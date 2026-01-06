import { useState } from 'react';
import './DeveloperMode.css';

export default function DeveloperMode({ onDevModeChange, books = [], onBookUpdate }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBookManager, setShowBookManager] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archiveBooks, setArchiveBooks] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const handleOpenModal = () => {
    setShowPasswordModal(true);
    setPassword('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.REACT_APP_DEV_PASSWORD;
    
    if (password === correctPassword) {
      setIsDevMode(true);
      onDevModeChange?.(true);
      setShowPasswordModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleExitDevMode = () => {
    setIsDevMode(false);
    onDevModeChange?.(false);
    setShowBookManager(false);
    setShowArchive(false);
  };

  const handleViewArchive = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books/archive/all`);
      if (response.ok) {
        const data = await response.json();
        setArchiveBooks(data);
        setShowArchive(true);
      } else {
        alert('Failed to load archive');
      }
    } catch (err) {
      console.error('Error loading archive:', err);
      alert('Error loading archive');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewCoverUrl(book.src || '');
  };

  const handleSaveCover = async () => {
    if (!editingBook || !newCoverUrl.trim()) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingBook.title,
          author: editingBook.author || '',
          review: editingBook.review || '',
          imagePath: newCoverUrl
        })
      });

      if (response.ok) {
        const updatedBook = await response.json();
        alert('Book cover updated successfully!');
        setEditingBook(null);
        setNewCoverUrl('');
        // Trigger refresh
        if (onBookUpdate) {
          onBookUpdate();
        }
      } else {
        alert('Failed to update book cover');
      }
    } catch (err) {
      console.error('Error updating book:', err);
      alert('Error updating book cover');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Book deleted successfully!');
        if (onBookUpdate) {
          onBookUpdate();
        }
      } else {
        alert('Failed to delete book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book');
    }
  };

  return (
    <>
      {/* Developer Mode Button */}
      <div className="dev-mode-button">
        {!isDevMode ? (
          <button onClick={handleOpenModal} className="dev-btn" title="Developer Mode">
            🔧
          </button>
        ) : (
          <div className="dev-btn-group">
            <button onClick={() => setShowBookManager(!showBookManager)} className="dev-btn" title="Manage Books">
              📚
            </button>
            <button onClick={handleViewArchive} className="dev-btn" title="View Book Archive">
              📜
            </button>
            <button onClick={handleExitDevMode} className="dev-btn active" title="Exit Developer Mode">
              ✓ DEV
            </button>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="dev-modal-overlay" onClick={handleCloseModal}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Developer Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="dev-password-input"
              />
              {error && <p className="dev-error">{error}</p>}
              <div className="dev-modal-buttons">
                <button type="submit" className="dev-submit-btn">
                  Enter
                </button>
                <button type="button" onClick={handleCloseModal} className="dev-cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Developer Mode Indicator (when active) */}
      {isDevMode && (
        <div className="dev-mode-indicator">
          Developer Mode Active
        </div>
      )}

      {/* Book Manager Modal */}
      {isDevMode && showBookManager && (
        <div className="dev-modal-overlay" onClick={() => setShowBookManager(false)}>
          <div className="dev-book-manager" onClick={(e) => e.stopPropagation()}>
            <div className="dev-manager-header">
              <h3>📚 Manage Books</h3>
              <button onClick={() => setShowBookManager(false)} className="dev-close-btn">✕</button>
            </div>
            
            <div className="dev-book-list">
              {books.length === 0 ? (
                <p className="dev-empty">No books found. Add books from the main interface.</p>
              ) : (
                books.map((book) => (
                  <div key={book.id} className="dev-book-item">
                    <img src={book.src} alt={book.title} className="dev-book-thumb" />
                    <div className="dev-book-info">
                      <h4>{book.title}</h4>
                      <p className="dev-book-author">{book.author || 'Unknown Author'}</p>
                    </div>
                    <div className="dev-book-actions">
                      <button 
                        onClick={() => handleEditBook(book)} 
                        className="dev-edit-btn"
                        title="Edit Cover"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteBook(book.id)} 
                        className="dev-delete-btn"
                        title="Delete Book"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Cover Modal */}
      {editingBook && (
        <div className="dev-modal-overlay" onClick={() => setEditingBook(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Book Cover</h3>
            <div className="dev-edit-preview">
              <img src={newCoverUrl || editingBook.src} alt={editingBook.title} />
            </div>
            <p className="dev-book-title">{editingBook.title}</p>
            <input
              type="text"
              value={newCoverUrl}
              onChange={(e) => setNewCoverUrl(e.target.value)}
              placeholder="Enter new cover URL"
              className="dev-url-input"
            />
            <div className="dev-modal-buttons">
              <button onClick={handleSaveCover} className="dev-submit-btn">
                Save Cover
              </button>
              <button onClick={() => setEditingBook(null)} className="dev-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Archive Modal */}
      {showArchive && (
        <div className="dev-modal-overlay" onClick={() => setShowArchive(false)}>
          <div className="dev-book-manager" onClick={(e) => e.stopPropagation()}>
            <div className="dev-manager-header">
              <h3>📜 Book Archive ({archiveBooks.length} books)</h3>
              <button onClick={() => setShowArchive(false)} className="dev-close-btn">✕</button>
            </div>
            
            <div className="dev-archive-info">
              <p>📖 Complete history of all books ever added to your shelf</p>
            </div>

            <div className="dev-book-list">
              {archiveBooks.length === 0 ? (
                <p className="dev-empty">No books in archive yet.</p>
              ) : (
                archiveBooks.map((book) => (
                  <div key={book.id} className={`dev-book-item ${book.isDeleted ? 'deleted' : ''}`}>
                    <img src={book.imagePath} alt={book.title} className="dev-book-thumb" />
                    <div className="dev-book-info">
                      <h4>{book.title}</h4>
                      <p className="dev-book-author">{book.author || 'Unknown Author'}</p>
                      <p className="dev-book-meta">
                        Added: {new Date(book.firstAddedAt).toLocaleDateString()} 
                        {book.timesAdded > 1 && ` • Re-added ${book.timesAdded - 1}x`}
                      </p>
                    </div>
                    <div className="dev-book-status">
                      {book.isDeleted ? (
                        <span className="status-badge deleted">Deleted</span>
                      ) : (
                        <span className="status-badge active">Active</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
