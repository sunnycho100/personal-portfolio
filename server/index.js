require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const app = express();

// tighten body limits to mitigate DoS
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// allow your local React dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true,
  })
);

// Resolve path to frontend public/books for saving uploaded covers
const BOOKS_DIR = path.join(__dirname, "..", "public", "books");
if (!fs.existsSync(BOOKS_DIR)) {
  try {
    fs.mkdirSync(BOOKS_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create books directory:", BOOKS_DIR, err.message);
  }
}

// Multer memory storage for processing via sharp
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Helper: sanitize title/author to filename-safe slugs
// Korean Hangul romanization mapping
const HANGUL_INITIALS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const HANGUL_MEDIALS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'weo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const HANGUL_FINALS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

function romanizeKorean(text) {
  if (!text) return '';
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    
    // Check if it's a Hangul syllable (가-힣)
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const syllableIndex = code - 0xAC00;
      const initialIndex = Math.floor(syllableIndex / 588);
      const medialIndex = Math.floor((syllableIndex % 588) / 28);
      const finalIndex = syllableIndex % 28;
      
      result += HANGUL_INITIALS[initialIndex];
      result += HANGUL_MEDIALS[medialIndex];
      result += HANGUL_FINALS[finalIndex];
    } else {
      // Keep non-Hangul characters as-is
      result += text[i];
    }
  }
  
  return result;
}

function toSlug(input) {
  if (!input) return "unknown";
  
  // First romanize Korean characters
  const romanized = romanizeKorean(input);
  
  return romanized
    .trim()
    .replace(/\s+/g, "-") // spaces -> hyphen
    .replace(/[^a-zA-Z0-9\-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .toLowerCase();
}

// Helper function to enhance Google Books image quality
function enhanceImageQuality(url) {
  if (!url) return url;
  // Replace zoom=1 with zoom=3 for higher quality
  let enhanced = url.replace(/zoom=1/g, 'zoom=3');
  // If it's a Google Books image, try to get higher resolution
  if (enhanced.includes('books.google.com') && !enhanced.includes('&fife=')) {
    enhanced += '&fife=w800';
  }
  return enhanced;
}

// Helper function to get cover from Open Library (often better quality)
async function getOpenLibraryCover(title, author = '') {
  try {
    const query = author ? `title:${title} author:${author}` : title;
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`
    );
    
    const data = response.data;
    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];
      if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }
      if (book.isbn && book.isbn[0]) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      }
    }
    return null;
  } catch (error) {
    console.error('Open Library error:', error.message);
    return null;
  }
}

// ----------------- GitHub overview (yours, unchanged) -----------------
const GITHUB_USERNAME = "sunnycho100";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function githubHeaders() {
  const headers = {
    "User-Agent": "portfolio-backend",
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

app.get("/api/github/overview", async (req, res) => {
  try {
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      { params: { per_page: 100, sort: "updated" }, headers: githubHeaders() }
    );

    const repos = ghRes.data;

    const simplified = await Promise.all(
      repos.map(async (r) => {
        let langs = [];
        let langBytes = [];
        try {
          if (r.languages_url) {
            const langRes = await axios.get(r.languages_url, {
              headers: githubHeaders(),
            });
            const entries = Object.entries(langRes.data);
            entries.sort((a, b) => b[1] - a[1]);
            langBytes = entries.map(([name, bytes]) => ({ name, bytes }));
            langs = langBytes.map((lb) => lb.name);
          }
        } catch (err) {
          console.error("Languages error for", r.name, err.message);
        }
        return {
          id: r.id,
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language || "Other",
          langs,
          langBytes,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
        };
      })
    );

    const languages = {};
    const languageBytes = {};
    for (const r of simplified) {
      const primary = r.language || "Other";
      languages[primary] = (languages[primary] || 0) + 1;
      if (Array.isArray(r.langBytes)) {
        for (const lb of r.langBytes) {
          if (!lb.bytes) continue;
          languageBytes[lb.name] = (languageBytes[lb.name] || 0) + lb.bytes;
        }
      }
    }

    res.json({ username: GITHUB_USERNAME, repos: simplified, languages, languageBytes });
  } catch (err) {
    console.error("GitHub API error:", err.response?.status, err.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

// ----------------- Comments API -----------------
const CommentInput = z.object({
  name: z.string().trim().min(1).max(120),
  relationship: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(500),
});

// ----------------- Books API -----------------
const BookInput = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().max(150).optional().or(z.literal("")),
  review: z.string().trim().max(500).optional().or(z.literal("")),
  language: z.enum(["en", "ko"]).optional().default("en"),
  isbn: z.string().trim().max(20).optional().or(z.literal("")),
});

// Helper function to search Korean books via Aladin API
// DISABLED: Aladin API has low quality covers, using manual upload instead
/*
async function searchAladinBooks(title, author = '') {
  try {
    const ALADIN_API_KEY = process.env.ALADIN_API_KEY;
    if (!ALADIN_API_KEY) {
      console.error('Aladin API key not configured');
      return [];
    }

    // Build query string
    let query = title;
    if (author) {
      query += ` ${author}`;
    }

    // Aladin API search endpoint
    const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx`;
    const params = {
      ttbkey: ALADIN_API_KEY,
      Query: query,
      QueryType: 'Title', // or 'Author', 'Publisher', 'Keyword'
      MaxResults: 5,
      start: 1,
      SearchTarget: 'Book',
      output: 'js', // JSON format
      Version: '20131101'
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    if (!data.item || data.item.length === 0) {
      return [];
    }

    // Transform Aladin results to our format
    return data.item.map(book => ({
      id: book.isbn13 || book.isbn,
      source: 'Aladin',
      title: book.title,
      author: book.author || '',
      coverUrl: book.cover || '', // Aladin provides direct cover URL
      isbn: book.isbn13 || book.isbn,
      publishedDate: book.pubDate || '',
      description: book.description ? book.description.slice(0, 150) + '...' : '',
      link: book.link || '' // Link to Aladin product page
    }));
  } catch (error) {
    console.error('Aladin API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}
*/

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// list comments, newest first
app.get("/api/comments", async (req, res) => {
  try {
    const take = Math.min(Number(req.query.take) || 20, 100);
    const data = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// create a comment
app.post("/api/comments", async (req, res) => {
  const parsed = CommentInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  const { name, relationship, message } = parsed.data;

  try {
    const created = await prisma.comment.create({
      data: {
        name,
        relationship: relationship && relationship.length ? relationship : null,
        message,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// ----------------- Books API -----------------

// list all books, newest first (with optional language filter)
app.get("/api/books", async (req, res) => {
  try {
    const { language } = req.query;
    const where = language ? { language } : {};
    
    const books = await prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// search for Korean book covers from Aladin API
// DISABLED: Aladin API has low quality covers
/*
app.get("/api/books/search/korean", async (req, res) => {
  const { title, author } = req.query;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const results = await searchAladinBooks(title, author);
    res.json(results);
  } catch (e) {
    console.error('Korean book search error:', e);
    res.status(500).json({ error: "Failed to search Korean books" });
  }
});
*/

// search for book covers from Google Books API (returns up to 5 options)
app.get("/api/books/search", async (req, res) => {
  const { title, author } = req.query;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const results = [];
    
    // Try Open Library first (often has better quality)
    const openLibCover = await getOpenLibraryCover(title, author);
    if (openLibCover) {
      results.push({
        id: 'openlibrary-1',
        source: 'Open Library',
        title: title,
        author: author || '',
        coverUrl: openLibCover,
        publishedDate: '',
        description: 'From Open Library (High Quality)'
      });
    }
    
    // Then get Google Books results
    const query = author ? `${title}+inauthor:${author}` : title;
    const googleResponse = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
    );
    
    if (googleResponse.data.items && googleResponse.data.items.length > 0) {
      for (const item of googleResponse.data.items) {
        if (item.volumeInfo && item.volumeInfo.imageLinks) {
          const cover = item.volumeInfo.imageLinks.large || 
                       item.volumeInfo.imageLinks.thumbnail || 
                       item.volumeInfo.imageLinks.smallThumbnail;
          if (cover) {
            results.push({
              id: item.id,
              source: 'Google Books',
              title: item.volumeInfo.title || title,
              author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : author || '',
              coverUrl: enhanceImageQuality(cover), // Enhanced quality
              publishedDate: item.volumeInfo.publishedDate || '',
              description: item.volumeInfo.description ? item.volumeInfo.description.slice(0, 150) + '...' : ''
            });
          }
        }
      }
    }
    
    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to search books" });
  }
});

// create book entry with chosen cover
app.post("/api/books", async (req, res) => {
  const parsed = BookInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  
  const { title, author, review, language, isbn } = parsed.data;
  // Allow passing imagePath directly if user chose a cover
  const chosenImagePath = req.body.imagePath;

  try {
    let imagePath = chosenImagePath || '/books/default-book-cover.jpg';
    
    // Only fetch from Google if no cover was provided and language is English
    if (!chosenImagePath && language === 'en') {
      const query = author ? `${title}+inauthor:${author}` : title;
      const googleResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
      );
      
      if (googleResponse.data.items && googleResponse.data.items.length > 0) {
        const book = googleResponse.data.items[0];
        if (book.volumeInfo && book.volumeInfo.imageLinks) {
          imagePath = enhanceImageQuality(
            book.volumeInfo.imageLinks.large || 
            book.volumeInfo.imageLinks.thumbnail || 
            book.volumeInfo.imageLinks.smallThumbnail ||
            imagePath
          );
        }
      }
    }

    // Create book in database
    const created = await prisma.book.create({
      data: {
        title,
        author: author && author.length ? author : null,
        imagePath,
        review: review && review.length ? review : null,
        language: language || 'en',
        isbn: isbn && isbn.length ? isbn : null,
      },
    });

    // Add to archive (or update if already exists)
    const normalizedAuthor = author && author.length ? author : null;
    try {
      await prisma.bookArchive.upsert({
        where: {
          title_author: {
            title: title,
            author: normalizedAuthor,
          },
        },
        update: {
          lastSeenAt: new Date(),
          timesAdded: { increment: 1 },
          isDeleted: false,
        },
        create: {
          title: title,
          author: normalizedAuthor,
          imagePath: imagePath,
          language: language || 'en',
          isbn: isbn && isbn.length ? isbn : null,
        },
      });
    } catch (archiveError) {
      console.error('Archive update failed (non-critical):', archiveError.message);
    }
    
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create book entry" });
  }
});

// upload a local book cover (drag & drop) and create the book
app.post("/api/books/upload", upload.single("file"), async (req, res) => {
  try {
    console.log('Upload request received:', { 
      hasFile: !!req.file, 
      title: req.body.title, 
      author: req.body.author,
      language: req.body.language
    });
    
    const { title, author, review, language } = req.body;

    // Validate core fields
    const parsed = BookInput.safeParse({ title, author, review });
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten());
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: "Cover image file is required" });
    }

    // Build filename
    let fileName;
    if (language === 'ko') {
      // For Korean books: Use title and author inputs with romanization
      console.log('Korean book title:', title, 'author:', author);
      
      const titleSlug = toSlug(title);
      const authorSlug = toSlug(author || "");
      
      if (titleSlug && titleSlug !== 'unknown' && titleSlug.trim() && titleSlug !== '-') {
        // Use romanized title_author format for Korean books
        const baseName = authorSlug && authorSlug.length && authorSlug !== 'unknown'
          ? `${titleSlug}_${authorSlug}`
          : `${titleSlug}`;
        fileName = `${baseName}.jpg`;
      } else {
        // Fallback: use timestamp with 'korean-book' prefix
        const timestamp = Date.now();
        fileName = `korean-book-${timestamp}.jpg`;
      }
      console.log('Korean book filename:', fileName);
    } else {
      // Build filename from title and author for English books
      const titleSlug = toSlug(title);
      const authorSlug = toSlug(author || "");
      const baseName = authorSlug && authorSlug.length
        ? `${titleSlug}_${authorSlug}`
        : `${titleSlug}`;
      fileName = `${baseName}.jpg`;
    }
    const destPath = path.join(BOOKS_DIR, fileName);

    console.log('Saving cover to:', destPath);

    // Convert to JPEG via sharp and write to public/books
    await sharp(req.file.buffer)
      .jpeg({ quality: 90 })
      .toFile(destPath);

    const imagePath = `/books/${fileName}`; // path used by frontend

    // Create DB record
    const created = await prisma.book.create({
      data: {
        title,
        author: author && author.length ? author : null,
        imagePath,
        review: review && review.length ? review : null,
        language: language && language.length ? language : 'en', // Default to 'en' if not provided
      },
    });

    console.log('Book created successfully:', created.id);

    // Upsert into archive
    const normalizedAuthor = author && author.length ? author : null;
    try {
      await prisma.bookArchive.upsert({
        where: { title_author: { title, author: normalizedAuthor } },
        update: {
          lastSeenAt: new Date(),
          timesAdded: { increment: 1 },
          isDeleted: false,
          imagePath,
        },
        create: { title, author: normalizedAuthor, imagePath },
      });
    } catch (archiveError) {
      console.error("Archive update failed (non-critical):", archiveError.message);
    }

    res.status(201).json(created);
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ error: "Failed to upload cover and create book" });
  }
});

// update a book (including cover)
app.put("/api/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const parsed = BookInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }

    const { title, author, review } = parsed.data;
    const imagePath = req.body.imagePath; // Allow updating cover URL

    const updateData = {
      title,
      author: author && author.length ? author : null,
      review: review && review.length ? review : null,
    };

    // Only update imagePath if provided
    if (imagePath) {
      updateData.imagePath = imagePath;
    }

    const updated = await prisma.book.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Get book details before deleting
    const book = await prisma.book.findUnique({
      where: { id }
    });

    if (book) {
      // Mark as deleted in archive
      const normalizedAuthor = book.author || null;
      try {
        await prisma.bookArchive.updateMany({
          where: {
            title: book.title,
            author: normalizedAuthor,
          },
          data: {
            isDeleted: true,
          },
        });
      } catch (archiveError) {
        console.error('Archive update failed (non-critical):', archiveError.message);
      }
    }

    // Delete from main table
    await prisma.book.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// get book archive (all books ever added)
app.get("/api/books/archive/all", async (req, res) => {
  try {
    const archive = await prisma.bookArchive.findMany({
      orderBy: { firstAddedAt: "desc" },
    });
    res.json(archive);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch book archive" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});