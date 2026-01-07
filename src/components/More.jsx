// src/components/More.jsx
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal.jsx';
import BookCarousel from './BookCarousel.jsx';
import CommentsSection from './CommentsSection.jsx';

// Cover Selection Modal Component
function CoverSelectionModal({ covers, onSelect, onClose, title, author }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Group covers by source
  const openLibraryCovers = covers.filter(c => c.source === 'Open Library');
  const googleBooksCovers = covers.filter(c => c.source === 'Google Books');

  const modalStyles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    },
    modal: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    header: {
      marginBottom: '16px',
      paddingRight: '30px'
    },
    title: {
      margin: '0 0 4px 0',
      fontSize: '20px',
      color: '#212529'
    },
    subtitle: {
      margin: 0,
      color: '#6c757d',
      fontSize: '14px'
    },
    sectionHeader: {
      marginTop: '24px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white'
    },
    openLibraryBadge: {
      background: '#28a745'
    },
    googleBooksBadge: {
      background: '#007bff'
    },
    closeBtn: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6c757d'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px'
    },
    coverCard: {
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      padding: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    coverImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '8px'
    },
    coverTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    coverAuthor: {
      fontSize: '11px',
      color: '#6c757d'
    },
    noCover: {
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d'
    }
  };

  return createPortal(
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <button style={modalStyles.closeBtn} onClick={onClose}>×</button>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Choose a Cover</h3>
          <p style={modalStyles.subtitle}>Select from {covers.length} cover{covers.length > 1 ? 's' : ''} for "{title}"</p>
        </div>
        
        {covers.length === 0 ? (
          <div style={modalStyles.noCover}>
            <p>No covers found for this book.</p>
            <button 
              onClick={() => onSelect(null)}
              style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add with default cover
            </button>
          </div>
        ) : (
          <>
            {/* Open Library Section */}
            {openLibraryCovers.length > 0 && (
              <div>
                <div style={modalStyles.sectionHeader}>
                  <span style={{...modalStyles.badge, ...modalStyles.openLibraryBadge}}>OPEN LIBRARY</span>
                  <span style={{ fontSize: '14px', color: '#495057' }}>High Quality Covers</span>
                </div>
                <div style={modalStyles.grid}>
                  {openLibraryCovers.map((cover, index) => (
                    <div
                      key={cover.id || index}
                      style={modalStyles.coverCard}
                      onClick={() => onSelect(cover.coverUrl)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#28a745';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img 
                        src={cover.coverUrl} 
                        alt={cover.title}
                        style={modalStyles.coverImage}
                        onError={(e) => { e.target.src = '/books/default-book-cover.jpg'; }}
                      />
                      <div style={modalStyles.coverTitle}>{cover.title}</div>
                      <div style={modalStyles.coverAuthor}>{cover.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Books Section */}
            {googleBooksCovers.length > 0 && (
              <div>
                <div style={modalStyles.sectionHeader}>
                  <span style={{...modalStyles.badge, ...modalStyles.googleBooksBadge}}>GOOGLE BOOKS</span>
                  <span style={{ fontSize: '14px', color: '#495057' }}>Additional Options</span>
                </div>
                <div style={modalStyles.grid}>
                  {googleBooksCovers.map((cover, index) => (
                    <div
                      key={cover.id || index}
                      style={modalStyles.coverCard}
                      onClick={() => onSelect(cover.coverUrl)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#007bff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img 
                        src={cover.coverUrl} 
                        alt={cover.title}
                        style={modalStyles.coverImage}
                        onError={(e) => { e.target.src = '/books/default-book-cover.jpg'; }}
                      />
                      <div style={modalStyles.coverTitle}>{cover.title}</div>
                      <div style={modalStyles.coverAuthor}>{cover.author}</div>
                      {cover.publishedDate && (
                        <div style={{ fontSize: '10px', color: '#adb5bd', marginTop: '4px' }}>
                          {new Date(cover.publishedDate).getFullYear()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function More({ reloadComments, isDevMode, reloadBooks = 0, onBooksLoaded }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [addingBook, setAddingBook] = useState(false);
  const [searchingCovers, setSearchingCovers] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [showCoverModal, setShowCoverModal] = useState(false);

  // Static fallback books (your original books)
  const fallbackBooks = useMemo(() => [
    { id:'how-to-win-friends', src: encodeURI('/books/How to Win Friends and Influence People - Dale Carnegie.jpg'), title:'How to Win Friends and Influence People', author:'Dale Carnegie', review:'People feel seen → trust grows.' },
    { id:'life-leverage', src: encodeURI('/books/Life Leverage - Rob Moore.jpg'), title:'Life Leverage', author:'Rob Moore', review:'Design life first; fit work around it.' },
    { id:'bitcoin-standard', src: encodeURI('/books/The Bitcoin Standard - Saifedean Ammous.jpg'), title:'The Bitcoin Standard', author:'Saifedean Ammous', review:'Sound money → long-term thinking.' },
    { id:'one-thing', src: encodeURI('/books/The ONE Thing - Gary Keller.jpg'), title:'The ONE Thing', author:'Gary Keller', review:'Focus multiplies results.' },
    { id:'psychology-money', src: encodeURI('/books/The Psychology of Money - Morgan Housel.jpg'), title:'The Psychology of Money', author:'Morgan Housel', review:'Behavior > spreadsheets.' },
    { id:'unstoppable', src: encodeURI('/books/Unstoppable - Brian Tracy.jpg'), title:'Unstoppable', author:'Brian Tracy', review:'Discipline compounds.' },
  ], []);

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
        const response = await fetch(`${API_URL}/api/books`);
        if (response.ok) {
          const apiBooks = await response.json();
          // Transform API books to match expected format
          const transformedBooks = apiBooks.map(book => ({
            id: book.id,
            src: book.imagePath,
            title: book.title,
            author: book.author || '',
            review: book.review || ''
          }));
          // Combine API books with fallback books (API books first)
          const allBooks = [...transformedBooks, ...fallbackBooks];
          setBooks(allBooks);
          // Notify parent component
          if (onBooksLoaded) {
            onBooksLoaded(allBooks);
          }
        } else {
          // Fallback to static books if API fails
          setBooks(fallbackBooks);
          if (onBooksLoaded) {
            onBooksLoaded(fallbackBooks);
          }
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks(fallbackBooks);
        if (onBooksLoaded) {
          onBooksLoaded(fallbackBooks);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [fallbackBooks, reloadBooks, onBooksLoaded]);

  // Search for book covers
  const searchCovers = async (e) => {
    e.preventDefault();
    if (!isDevMode) {
      alert('Developer mode required to add books');
      return;
    }
    if (!newBookTitle.trim()) return;

    setSearchingCovers(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const params = new URLSearchParams({ title: newBookTitle.trim() });
      if (newBookAuthor.trim()) {
        params.append('author', newBookAuthor.trim());
      }
      
      const response = await fetch(`${API_URL}/api/books/search?${params}`);
      if (response.ok) {
        const covers = await response.json();
        setCoverOptions(covers);
        setShowCoverModal(true);
      } else {
        throw new Error('Failed to search covers');
      }
    } catch (error) {
      console.error('Failed to search covers:', error);
      alert('Failed to search for book covers. Please try again.');
    } finally {
      setSearchingCovers(false);
    }
  };

  // Add book with selected cover
  const addBookWithCover = async (selectedCoverUrl) => {
    if (!isDevMode) {
      alert('Developer mode required to add books');
      setShowCoverModal(false);
      setCoverOptions([]);
      return;
    }
    setShowCoverModal(false);
    setAddingBook(true);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newBookTitle.trim(),
          author: newBookAuthor.trim(),
          imagePath: selectedCoverUrl, // Pass the chosen cover URL
        }),
      });

      if (response.ok) {
        const newBook = await response.json();
        const transformedBook = {
          id: newBook.id,
          src: newBook.imagePath,
          title: newBook.title,
          author: newBook.author || '',
          review: newBook.review || ''
        };
        setBooks(prev => [transformedBook, ...prev]);
        
        // Clear form
        setNewBookTitle('');
        setNewBookAuthor('');
        setCoverOptions([]);
        
        alert(`Successfully added "${newBook.title}" to your book collection!`);
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book. Please try again.');
    } finally {
      setAddingBook(false);
    }
  };

  const addNewBook = async (e) => {
    e.preventDefault();
    if (!isDevMode) {
      alert('Developer mode required to add books');
      return;
    }
    if (!newBookTitle.trim()) return;

    setAddingBook(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newBookTitle.trim(),
          author: newBookAuthor.trim(),
        }),
      });

      if (response.ok) {
        const newBook = await response.json();
        // Add the new book to the list
        const transformedBook = {
          id: newBook.id,
          src: newBook.imagePath,
          title: newBook.title,
          author: newBook.author || '',
          review: newBook.review || ''
        };
        setBooks(prev => [transformedBook, ...prev]);
        
        // Clear form
        setNewBookTitle('');
        setNewBookAuthor('');
        
        alert(`Successfully added "${newBook.title}" to your book collection!`);
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book. Please try again.');
    } finally {
      setAddingBook(false);
    }
  };

  return (
    <section id="more" className="section">
      <Reveal delay="320ms" className="list-container">
        <h2>More About Me</h2>

        <details className="accordion" open>
          <summary>
            <div className="summary-left">
              <i className="fa-solid fa-user" aria-hidden="true"></i>
              <span>Open to see books, interests, and mentors</span>
            </div>
            <i className="fa-solid fa-chevron-down chev" aria-hidden="true"></i>
          </summary>

          <div className="accordion-content stagger">
            <div className="about-block">
              <h3>Books I Love</h3>
              
              {/* Add New Book Form - Only visible in Developer Mode */}
              {isDevMode && (
              <div className="add-book-form" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '16px' }}>Add a New Book</h4>
                <form onSubmit={searchCovers} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Book title (e.g., Meditations)"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      border: '1px solid #ced4da', 
                      borderRadius: '4px', 
                      fontSize: '14px'
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author (e.g., Marcus Aurelius)"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      border: '1px solid #ced4da', 
                      borderRadius: '4px', 
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="submit" 
                      disabled={searchingCovers || addingBook || !newBookTitle.trim()}
                      style={{ 
                        flex: 1,
                        padding: '8px 16px', 
                        background: (searchingCovers || addingBook) ? '#6c757d' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: (searchingCovers || addingBook) ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {searchingCovers ? 'Searching...' : 'Search Covers (Choose from 5)'}
                    </button>
                    <button 
                      type="button"
                      onClick={addNewBook}
                      disabled={searchingCovers || addingBook || !newBookTitle.trim()}
                      style={{ 
                        padding: '8px 16px', 
                        background: (searchingCovers || addingBook) ? '#6c757d' : '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: (searchingCovers || addingBook) ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {addingBook ? 'Adding...' : 'Quick Add'}
                    </button>
                  </div>
                </form>
              </div>
              )}

              {/* Cover Selection Modal */}
              {showCoverModal && (
                <CoverSelectionModal
                  covers={coverOptions}
                  title={newBookTitle}
                  author={newBookAuthor}
                  onSelect={addBookWithCover}
                  onClose={() => setShowCoverModal(false)}
                />
              )}

              {loading ? (
                <p>Loading books...</p>
              ) : (
                <BookCarousel 
                  books={books} 
                  isDevMode={isDevMode}
                  onBookDelete={(bookId) => {
                    // Trigger reload after deletion
                    if (onBooksLoaded) {
                      setBooks(books.filter(b => b.id !== bookId));
                      onBooksLoaded(books.filter(b => b.id !== bookId));
                    }
                  }}
                />
              )}
            </div>

            <div className="about-block">
              <h3>Interests</h3>
              <ul className="chips-inline">
                <li>Traveling</li>
                <li>Learning systems</li>
                <li>Writing reflections</li>
                <li>Technology consulting</li>
              </ul>
            </div>

            <div className="about-block">
              <h3>My Mentors and Lessons Learned</h3>
              <ul className="bulleted">
                <li>My Beloved Parents – “Always share what you have.”</li>
                <li>Major Ok – “Provide unconditional love to everyone.”</li>
                <li>Lawyer Kim – “Imagine where you’ll be in 3 days, 3 weeks, 3 months.”</li>
              </ul>
            </div>
          </div>
        </details>

        {/* New: Comments accordion */}
        <CommentsSection onReloadRequest={reloadComments} />
      </Reveal>
    </section>
  );
}