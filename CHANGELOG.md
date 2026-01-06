# Changelog

All notable changes to this portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-01-06

### Added
- **BookArchive database table** - permanent record of all books ever added
- Automatic archiving when books are added (tracks duplicates, timestamps)
- Archive viewer in Developer Mode (📜 button) showing complete book history
- Duplicate detection - prevents re-adding same book to archive
- Track metadata: first added date, times re-added, deletion status
- GET `/api/books/archive/all` endpoint to view archive
- Status badges (Active/Deleted) for books in archive view

### Changed
- Book deletion now marks books as deleted in archive instead of losing history
- Archive displays grayscale thumbnails for deleted books

## [1.6.1] - 2026-01-06

### Added
- Quick delete button (✕) on book carousel items - appears on hover in top-left corner
- Delete button only visible in Developer Mode for safety
- Instant book removal from carousel and database

## [1.6.0] - 2026-01-06

### Added
- Book manager UI in Developer Mode (📚 button)
- Edit book covers directly from UI - updates database in real-time
- Delete books from database via UI
- PUT `/api/books/:id` endpoint for updating book covers and details
- Live preview when editing book covers
- Books state lifted to App level for better management

### Changed
- Default backend port changed from 5000 to 4000 in `start.sh`
- All API calls now use environment variable `REACT_APP_API_URL` (defaults to localhost:4000)
- `start.sh` now auto-opens browser, suppresses verbose logs, quieter output
- Developer Mode button group with book manager access

### Fixed
- Consistent API URL usage across all components

## [1.5.0] - 2026-01-05

### Added
- Developer Mode feature with password protection
- Fixed button in bottom right corner to access developer mode
- Password authentication using environment variables
- Visual indicators for active developer mode
- Modal interface for password entry
- Foundation for future developer-specific functionality
- Book addition form now requires developer mode access
- Double protection on book API endpoints (UI + function-level validation)

### Security
- Password stored securely in `.env` file
- `.env` file excluded from version control via `.gitignore`
- Add Book form hidden until developer mode is activated
- All book addition functions validate developer mode status

## [1.4.2] - 2026-01-04

### Added
- Open Library integration for higher quality covers

### Changed
- Enhanced Google Books image quality (3x zoom, 800px width)
- Cover selection now shows 6 options (Open Library + 5 Google Books)
- Open Library covers shown first (higher quality)

## [1.4.1] - 2026-01-04

### Added
- Cover selection popup - choose from 5 Google Books covers before adding
- `/api/books/search` endpoint - returns multiple cover options
- Books persist to MySQL database, load automatically on page refresh

## [1.4.0] - 2026-01-04

### Added
- Books API (`/api/books`) - add books by title/author, auto-fetches cover from Google Books
- Dynamic port detection in `start.sh` - auto-finds available ports if 3000/5000 are busy
- Add Book form in frontend for testing

### Changed
- Updated CORS to support dynamic ports (3001, 3002)

## [1.3.0] - 2026-01-03

### Added
- Book cover API integration (Open Library API + Google Books API)
- Dynamic book cover loading with fallback system
- Automatic book cover download script (Node.js)
- API loading indicators and badges
- Book covers utility module

### Changed
- BookCarousel component now supports API-loaded covers
- Enhanced error handling for image loading

## [1.2.0] - 2026-01-03

### Changed
- Book Carousel Navigation with modern SVG icons
- Modal Popup Design with glassmorphism effects

### Added
- Smooth animations and transitions
- Enhanced mobile responsive design
- Professional typography hierarchy
- Card-based layout system for comments

### Improved
- Enhanced accessibility with ARIA labels
- Better visual feedback with hover animations
- Modern color palette and design standards

---

## Previous Versions

### [1.1.5] - Previous Version
- Initial stable version before UI modernization