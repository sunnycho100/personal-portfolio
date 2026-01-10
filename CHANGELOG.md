# Changelog

All notable changes to this portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-01-10

## [1.10.0] - 2026-01-10

### Added
- **CSS Modularization**: Broke the large `App.css` into focused modules under `src/styles/` (global, utilities, components) and added a dark-mode overrides file to improve maintainability and debugging.

### Changed
- Replaced monolithic stylesheet with an import-based `App.css` aggregator that imports the new modules; adjusted layout widths for wider card presentation (~96%).


### Added
- **Drag-and-drop Book Cover Upload**: Users (in Developer Mode) can now drag and drop a book cover image, enter the book title and author, and upload directly from the "More About Me" section.
- Backend `/api/books/upload` endpoint: Accepts image, title, and author, saves the cover as a JPEG with the format `Book-title_Author-name.jpg` in `public/books/`, and creates a Book/BookArchive DB entry.
- New React component `BookCoverDrop.jsx` for the drag-and-drop UI, with preview and validation.
- Automatic filename sanitization for uploaded covers (spaces replaced, only alphanumeric and hyphens, underscores between title and author).
- Error handling improvements: Upload errors now show specific backend messages in the UI.
- Added `multer` and `sharp` to backend dependencies for file upload and image processing.
- Added `REACT_APP_API_URL` to `.env` for reliable frontend-backend connection.

### Changed
- Improved backend logging for upload endpoint to aid debugging.
- Restarted frontend and backend to ensure all environment/config changes are picked up.

### Fixed
- Upload failures now show clear error messages to the user.

## [1.8.1] - 2026-01-07

### Changed
- **Dual API Integration for Book Covers** - Now uses both Open Library and Google Books APIs
  - Cover search displays results grouped by source (Open Library / Google Books)
  - Open Library section highlighted with green badges for high-quality covers
  - Google Books section with blue badges for additional options
  - Users can choose from up to 6+ cover options from both sources
  - Fallback mechanism: Open Library → Google Books → Default cover
- Book titles and authors now display in title case format (e.g., "atomic habits" → "Atomic Habits")
- `toTitleCase()` utility function added for consistent formatting across book displays
- `getBookCoverOptions()` function added to fetch covers from both APIs in parallel

### Added
- Source badges in cover selection modal to distinguish between API providers
- Enhanced hover effects with color-coded borders (green for Open Library, blue for Google Books)

## [1.8.0] - 2026-01-07

### Internal
- Initial dual API implementation

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