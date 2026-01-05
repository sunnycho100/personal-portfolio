require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
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
});

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

// list all books, newest first
app.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

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
        id: 'openlibrary',
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
  
  const { title, author, review } = parsed.data;
  // Allow passing imagePath directly if user chose a cover
  const chosenImagePath = req.body.imagePath;

  try {
    let imagePath = chosenImagePath || '/books/default-book-cover.jpg';
    
    // Only fetch from Google if no cover was provided
    if (!chosenImagePath) {
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
      },
    });
    
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create book entry" });
  }
});

// delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    await prisma.book.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});