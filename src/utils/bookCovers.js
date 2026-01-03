// Book Cover API Utilities

/**
 * Search for book cover using Open Library API
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @returns {Promise<string|null>} Cover URL or null
 */
export async function getOpenLibraryCover(title, author = '') {
  try {
    const query = author ? `title:${title} author:${author}` : title;
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`
    );
    
    const data = await response.json();
    
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
    console.error('Error fetching Open Library cover:', error);
    return null;
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
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @param {string} fallbackSrc - Local fallback image path
 * @returns {Promise<string>} Cover URL
 */
export async function getBookCover(title, author = '', fallbackSrc = null) {
  // Try Open Library first (faster, no API key needed)
  let coverUrl = await getOpenLibraryCover(title, author);
  
  // Fallback to Google Books
  if (!coverUrl) {
    coverUrl = await getGoogleBooksCover(title, author);
  }
  
  // Return API URL or fallback to local image
  return coverUrl || fallbackSrc || '/books/default-book-cover.jpg';
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