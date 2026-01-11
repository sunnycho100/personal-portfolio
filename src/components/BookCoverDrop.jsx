// src/components/BookCoverDrop.jsx
import { useState, useRef } from 'react';

export default function BookCoverDrop({ onBookAdded, isDevMode, language = 'en' }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isDevMode) {
      alert('Developer mode required to upload books');
      return;
    }
    if (!file || !title.trim()) return;
    setSubmitting(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title.trim());
      if (author.trim()) fd.append('author', author.trim());
      fd.append('language', language); // Add language parameter

      const res = await fetch(`${API_URL}/api/books/upload`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${res.status}`);
      }
      const newBook = await res.json();
      // Inform parent
      if (onBookAdded) {
        onBookAdded({
          id: newBook.id,
          src: newBook.imagePath,
          title: newBook.title,
          author: newBook.author || '',
          review: newBook.review || '',
        });
      }
      // Reset
      setFile(null);
      setPreviewUrl('');
      setTitle('');
      setAuthor('');
      alert(`Uploaded and added "${newBook.title}"`);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    container: { marginTop: '16px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' },
    title: { margin: '0 0 12px 0', color: '#495057', fontSize: '16px' },
    dropZone: {
      border: `2px dashed ${dragActive ? '#007bff' : '#ced4da'}`,
      borderRadius: '8px',
      padding: '18px',
      textAlign: 'center',
      background: dragActive ? '#e9f2ff' : 'white',
      cursor: 'pointer',
    },
    preview: { maxWidth: '100%', maxHeight: '240px', borderRadius: '6px', marginTop: '12px' },
    inputs: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
    input: { padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' },
    actions: { display: 'flex', gap: '10px', marginTop: '10px' },
    submit: { padding: '8px 16px', background: submitting ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px' },
    choose: { padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Drop a Book Cover (JPEG/PNG)</h4>
      <div
        style={styles.dropZone}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={styles.preview} />
        ) : (
          <div>
            <p style={{ margin: 0, color: '#6c757d' }}>Drag & drop an image here, or click to choose.</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
      </div>
      <form onSubmit={onSubmit} style={styles.inputs}>
        <input
          type="text"
          placeholder="Book title (e.g., Meditations)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Author (e.g., Marcus Aurelius)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={styles.input}
        />
        <div style={styles.actions}>
          <button type="button" style={styles.choose} onClick={() => inputRef.current?.click()}>Choose Image</button>
          <button type="submit" style={styles.submit} disabled={submitting || !file || !title.trim()}>
            {submitting ? 'Uploading...' : 'Upload & Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
