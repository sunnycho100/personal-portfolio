# Changelog

All notable changes to this portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.17.0] - 2026-01-16

### Added
- **Data Analytics Intern experience** at PNS Networks (Dec 2025 – Jan 2026)
  - Full-stack freight analytics platform with Python, Flask, React, TypeScript
  - Automated intermodal freight ETL pipelines reducing manual processing by 95%
  - Regression modeling analysis of 100k+ shipment records with continuous risk-scoring

### Technical
- Added new experience entry to shared `experienceData` array
- Timeline and Work Experience views both auto-update from same data source

## [1.16.0] - 2026-01-13

### Performance
- **Book Covers Preloading**: Implemented low-priority preloading of book covers API on initial page load
  - Books API now fetches in background with 100ms delay after critical components render
  - Eliminates loading delay when scrolling to Books section
  - Books are ready and displayed immediately when section comes into view
  - Improved user experience with smoother transitions between sections

### Technical
- Moved book fetching logic to App.jsx with deferred loading strategy
- Books component now receives preloaded data via props
- Added `preloadedBooks` state management in main App component

## [1.15.0] - 2026-01-11

### Fixed
- **Korean Book Filename Generation**: Fixed issue where Korean book uploads resulted in filenames like "-.jpg"
  - Korean books now use title and author inputs (instead of original filename) for file naming
  - Implemented Korean-to-romanization conversion for safe filename generation
  - Korean book filenames now follow format: `romanized-title_romanized-author.jpg`
  - Added fallback to `korean-book-{timestamp}.jpg` if romanization fails
  - Fixed language filtering to properly separate English and Korean book carousels

### Technical
- Updated `toSlug()` function with Korean Hangul romanization support
- Enhanced upload endpoint logging for Korean book filename debugging
- Improved filename sanitization for cross-platform compatibility

## [1.14.0] - 2026-01-11

### Changed
- **Korean Books Section**: Simplified to manual upload only
  - Removed Aladin API search functionality (commented out for future reference)
  - Korean books now use drag-and-drop upload exclusively via BookCoverDrop
  - Updated BookCoverDrop component to support language parameter ('en' or 'ko')
  - Backend upload endpoint now accepts and stores language field
  - Improved quality control by using manual uploads instead of external API covers

### Technical
- Commented out `searchAladinBooks()` function in server/index.js
- Commented out `GET /api/books/search/korean` endpoint
- Updated BookCoverDrop.jsx to accept language prop (default: 'en')
- Updated POST /api/books/upload to handle language field in database

## [1.13.0] - 2026-01-11

### Added
- **Korean Books Integration**: Added dedicated Korean books section using Aladin API
  - Separate accordion for Korean books (한국 도서) within Books section
  - Aladin API integration for searching Korean book covers by title and author
  - Database fields: `language` ("en" or "ko") and `isbn` for book identification
  - New backend endpoint: `GET /api/books/search/korean` for Aladin book search
  - Updated `GET /api/books` to filter by language
  - Secure API key storage in backend environment variables
  - Korean-language UI for adding books (책 제목, 저자)

### Changed
- Refactored "Books I Love" into a dedicated section above "More About Me" for greater visibility and importance.
- Created new `Books.jsx` component and moved all book-related features out of `More.jsx`.
- Updated navigation to include a "Books" tab.
- Added new CSS module for Books section.
- Changed main Books heading from "Books I Love" to "Books"
- First accordion: "Books that shaped my thinking" (open by default)
- Second accordion: "Korean Books (한국 도서)" (closed by default)
- Database schema updated with migration `20260111053336_add_language_and_isbn_to_books`

### Security
- Aladin API key (`ttbsuch42831430001`) securely stored in backend `.env`
- API key not exposed to frontend/client

## [1.11.0] - 2026-01-10

### Changed
- Book carousel: 3D tilt effect, page and back rendering, and consistent sizing for all covers.
- Increased horizontal gap and vertical space for book covers and meta, so long titles/authors never get cut off.
- Carousel now only scrolls horizontally (vertical scroll disabled), and always expands to fit the lowest author/title.
- Improved overflow handling so 3D books are never clipped, and carousel always shows full book and meta.

## [1.10.0] - 2026-01-10

### Added
- **CSS Modularization**: Broke the large `App.css` into focused modules under `src/styles/` (global, utilities, components) and added a dark-mode overrides file to improve maintainability and debugging.

### Changed
- Replaced monolithic stylesheet with an import-based `App.css` aggregator that imports the new modules; adjusted layout widths for wider card presentation (~96%).

## [1.9.0] - 2026-01-10


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