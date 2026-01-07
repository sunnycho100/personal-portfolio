import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getBookCover } from '../utils/bookCovers.js';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function toTitleCase(str) {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function BookModal({ book, onClose }) {
  const id = book.id || book.src;
  const notesKey = `book_quickdesc_${id}`;
  const commentsKey = `book_comments_${id}`;

  const [desc, setDesc] = useState(() => {
    try {
      return localStorage.getItem(notesKey) || "";
    } catch {
      return "";
    }
  });

  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(commentsKey) || "[]");
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const modalRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
  });

  const [pos, setPos] = useState({ left: null, top: null });

  // Center popup on open
  useLayoutEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const left = (vw - rect.width) / 2;
    const top = (vh - rect.height) / 2;

    setPos({
      left: clamp(left, 8, vw - rect.width - 8),
      top: clamp(top, 8, vh - rect.height - 8),
    });
  }, [book]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = (value) => {
    setDesc(value);
    try {
      localStorage.setItem(notesKey, value);
    } catch {}
  };

  const addComment = () => {
    if (!text.trim()) return;
    const item = {
      name: name.trim() || "Anonymous",
      text: text.trim(),
      ts: Date.now(),
    };
    const next = [...comments, item];
    setComments(next);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(next));
    } catch {}
    setText("");
  };

  // Drag behavior for header
  const onPointerDown = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.origLeft = pos.left ?? 0;
    dragRef.current.origTop = pos.top ?? 0;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const node = modalRef.current;
    const rect = node ? node.getBoundingClientRect() : { width: 0, height: 0 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setPos({
      left: clamp(dragRef.current.origLeft + dx, 8, vw - rect.width - 8),
      top: clamp(dragRef.current.origTop + dy, 8, vh - rect.height - 8),
    });
  };

  const onPointerUp = () => {
    dragRef.current.dragging = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  // Modal structure
  const modal = (
    <div
      className="book-modal-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="book-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{ left: pos.left, top: pos.top, position: "absolute" }}
      >
        <div className="modal-header" onPointerDown={onPointerDown}>
          <div className="modal-header-content">
            <h2 className="modal-title">{toTitleCase(book.title)}</h2>
            <p className="modal-subtitle">Book Details</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="book-cover-container">
              <img src={book.src} alt={book.title} loading="lazy" />
            </div>
          </div>

          <div className="modal-right">
            <div className="book-info">
              <h3 className="book-title">{toTitleCase(book.title)}</h3>
              {book.author && <p className="book-author">{toTitleCase(book.author)}</p>}
              {book.review && <div className="book-review">{book.review}</div>}
            </div>

            <div className="takeaway-section">
              <label className="section-label">Your Takeaway</label>
              <textarea
                className="quick-desc"
                value={desc}
                onChange={(e) => saveNotes(e.target.value)}
                placeholder="Share your key insights from this book..."
                rows={3}
              />
            </div>

            <div className="comments-section">
              <h4 className="section-title">Discussion</h4>

              <div className="comments-list">
                {comments.length === 0 && (
                  <div className="empty-state">
                    <p>Be the first to share your thoughts!</p>
                  </div>
                )}

                {comments.map((c, i) => (
                  <div key={i} className="comment-card">
                    <div className="comment-header">
                      <span className="comment-author">{c.name}</span>
                      <span className="comment-time">
                        {new Date(c.ts).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="comment-form">
                <div className="form-row">
                  <input
                    className="name-input"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <textarea
                  className="comment-textarea"
                  rows={3}
                  placeholder="Share your thoughts about this book..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="submit-button" onClick={addComment}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                  </svg>
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default function BookCarousel({ books = [], isDevMode = false, onBookDelete }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selected, setSelected] = useState(null);
  const [booksWithCovers, setBooksWithCovers] = useState(books);
  const [loadingCovers, setLoadingCovers] = useState(false);

  const handleDeleteBook = async (e, book) => {
    e.stopPropagation(); // Prevent opening the modal
    if (!window.confirm(`Delete "${toTitleCase(book.title)}"?`)) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/books/${book.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (onBookDelete) {
          onBookDelete(book.id);
        }
      } else {
        alert('Failed to delete book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book');
    }
  };

  // Load book covers from APIs
  useEffect(() => {
    async function loadCovers() {
      if (books.length === 0) return;
      
      setLoadingCovers(true);
      
      const booksWithApiCovers = await Promise.all(
        books.map(async (book) => {
          // Skip if book already has a valid cover or if it's a local path
          if (book.src && !book.src.includes('placeholder')) {
            return book;
          }
          
          try {
            const apiCover = await getBookCover(book.title, book.author, book.src);
            return {
              ...book,
              src: apiCover,
              isApiCover: apiCover !== book.src
            };
          } catch (error) {
            console.warn(`Failed to load cover for ${book.title}:`, error);
            return book;
          }
        })
      );
      
      setBooksWithCovers(booksWithApiCovers);
      setLoadingCovers(false);
    }
    
    loadCovers();
  }, [books]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setCanPrev(track.scrollLeft > 5);
      setCanNext(
        track.scrollLeft + track.clientWidth < track.scrollWidth - 5
      );
    };

    update();
    track.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [booksWithCovers]);

  const scrollByViewport = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = Math.round(track.clientWidth * 0.9) * dir;
    track.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <>
      <div className="book-carousel">
        <button
          className="carousel-btn prev"
          disabled={!canPrev}
          onClick={() => scrollByViewport(-1)}
          aria-label="Previous books"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div className="carousel-viewport">
          <div className="carousel-track" ref={trackRef}>
            {booksWithCovers.map((b, i) => (
              <div
                key={b.id || i}
                className={`carousel-item ${loadingCovers ? 'loading' : ''} ${isDevMode ? 'dev-mode' : ''}`}
                onClick={() => setSelected({ index: i })}
              >
                <img 
                  src={b.src} 
                  alt={b.title} 
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to local image if API image fails
                    e.target.src = books[i]?.src || '/books/default-book-cover.jpg';
                  }}
                />
                {isDevMode && b.id && (
                  <button
                    className="carousel-delete-btn"
                    onClick={(e) => handleDeleteBook(e, b)}
                    title={`Delete ${toTitleCase(b.title)}`}
                  >
                    ✕
                  </button>
                )}
                {b.isApiCover && (
                  <div className="api-badge" title="Cover loaded from API">
                    API
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-btn next"
          disabled={!canNext}
          onClick={() => scrollByViewport(1)}
          aria-label="Next books"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {selected && (
        <BookModal
          book={booksWithCovers[selected.index] || books[selected.index]}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}