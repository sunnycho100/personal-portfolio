// Book Cover API Utilities

/**
 * Search for book cover and metadata using Open Library API
 * API Docs: https://openlibrary.org/dev/docs/api/search
 * Data returned includes: title, author_name, first_publish_year, cover_i (Cover ID), isbn, key, etc.
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @returns {Promise<{coverUrl: string|null, bookData: Object|null}>} Cover URL and book metadata
 */
export async function getOpenLibraryCover(title, author = '') {
  try {
    // Build search query
    const query = author ? `title:${title} author:${author}` : title;
    
    // Fetch from Open Library Search API with specific fields
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=title,author_name,first_publish_year,isbn,cover_i,key,author_key`,
      {
        headers: {
          'User-Agent': 'PortfolioApp/1.0 (+https://portfolio.example.com)'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];
      let coverUrl = null;
      
      // Try to get cover using cover_i (Cover ID) - most reliable
      if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }
      // Fallback to ISBN if available
      else if (book.isbn && book.isbn[0]) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      }
      
      // Return both cover URL and book metadata
      return {
        coverUrl,
        bookData: {
          title: book.title,
          author: book.author_name ? book.author_name[0] : author,
          publishYear: book.first_publish_year,
          isbn: book.isbn ? book.isbn[0] : null,
          olid: book.key // Open Library ID
        }
      };
    }
    
    return { coverUrl: null, bookData: null };
  } catch (error) {
    console.error('Error fetching Open Library cover:', error);
    return { coverUrl: null, bookData: null };
  }
}

/**
 * Search for book cover using Google Books API
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @returns {Promise<string|null>} Cover URL or null
 */
export async function getGoogleBooksCover(title, author = '') {
  try {
    const query = author ? `${title}+inauthor:${author}` : title;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const book = data.items[0];
      if (book.volumeInfo && book.volumeInfo.imageLinks) {
        // Prefer large thumbnail, fallback to regular thumbnail
        return book.volumeInfo.imageLinks.large || 
               book.volumeInfo.imageLinks.thumbnail || 
               book.volumeInfo.imageLinks.smallThumbnail;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Google Books cover:', error);
    return null;
  }
}

/**
 * Get book cover from multiple sources with fallback
 * Fetches from both Open Library and Google Books APIs
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @param {string} fallbackSrc - Local fallback image path
 * @returns {Promise<string>} Cover URL (first available)
 */
export async function getBookCover(title, author = '', fallbackSrc = null) {
  // Try Open Library first (faster, no API key needed)
  const { coverUrl, bookData } = await getOpenLibraryCover(title, author);
  
  if (coverUrl) {
    return coverUrl;
  }
  
  // Fallback to Google Books
  const googleCover = await getGoogleBooksCover(title, author);
  if (googleCover) {
    return googleCover;
  }
  
  // Final fallback to local image
  return fallbackSrc || '/books/default-book-cover.jpg';
}

/**
 * Get book covers from both APIs for user selection
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @param {string} fallbackSrc - Local fallback image path
 * @returns {Promise<{openLibrary: string|null, googleBooks: string|null, fallback: string}>}
 */
export async function getBookCoverOptions(title, author = '', fallbackSrc = null) {
  // Fetch from both APIs in parallel
  const [openLibraryResult, googleBooksResult] = await Promise.all([
    getOpenLibraryCover(title, author),
    getGoogleBooksCover(title, author)
  ]);
  
  return {
    openLibrary: openLibraryResult.coverUrl,
    googleBooks: googleBooksResult,
    fallback: fallbackSrc || '/books/default-book-cover.jpg'
  };
}

/**
 * Download book cover to local storage
 * @param {string} coverUrl - URL of the cover image
 * @param {string} filename - Local filename to save as
 * @returns {Promise<boolean>} Success status
 */
export async function downloadBookCover(coverUrl, filename) {
  try {
    const response = await fetch(coverUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading book cover:', error);
    return false;
  }
}

/**
 * Batch process multiple books to get their covers
 * @param {Array} books - Array of book objects with title and author
 * @returns {Promise<Array>} Books with cover URLs added
 */
export async function batchProcessBookCovers(books) {
  const processedBooks = await Promise.all(
    books.map(async (book) => {
      const coverUrl = await getBookCover(book.title, book.author, book.src);
      return {
        ...book,
        apiCoverUrl: coverUrl !== book.src ? coverUrl : null,
        src: coverUrl
      };
    })
  );
  
  return processedBooks;
}