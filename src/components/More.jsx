// src/components/More.jsx
import { useState, useEffect, useMemo } from 'react';
import Reveal from './Reveal.jsx';
import BookCarousel from './BookCarousel.jsx';
import CommentsSection from './CommentsSection.jsx';

export default function More({ reloadComments }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [addingBook, setAddingBook] = useState(false);

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
        const response = await fetch('http://localhost:5001/api/books');
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
          setBooks([...transformedBooks, ...fallbackBooks]);
        } else {
          // Fallback to static books if API fails
          setBooks(fallbackBooks);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [fallbackBooks]);

  const addNewBook = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    setAddingBook(true);
    try {
      const response = await fetch('http://localhost:5001/api/books', {
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
              
              {/* Add New Book Form */}
              <div className="add-book-form" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '16px' }}>Add a New Book</h4>
                <form onSubmit={addNewBook} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  <button 
                    type="submit" 
                    disabled={addingBook || !newBookTitle.trim()}
                    style={{ 
                      padding: '8px 16px', 
                      background: addingBook ? '#6c757d' : '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: addingBook ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {addingBook ? 'Adding Book...' : 'Add Book from Google Books API'}
                  </button>
                </form>
              </div>

              {loading ? (
                <p>Loading books...</p>
              ) : (
                <BookCarousel books={books} />
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