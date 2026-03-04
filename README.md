# Sunny Cho — Personal Portfolio

A full-stack personal portfolio website built with **React 19** and **Express 5**, featuring a live GitHub integration, an interactive bookshelf, a visitor comment system, and a password-protected developer mode.

## Quick Start

```bash
./start.sh        # installs deps, runs Prisma migrations, auto-detects ports, opens browser
```

The startup script handles everything — dependency installation, database setup, port detection (defaults: client `3000`, server `4000`), and cleanup on `Ctrl+C`.

**Or run each part manually:**

```bash
# Frontend (React)
npm install
npm start                # http://localhost:3000

# Backend (Express + Prisma)
cd server
npm install
npx prisma generate
npx prisma migrate deploy
PORT=4000 node index.js  # http://localhost:4000
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  React 19 SPA (Create React App)                        │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ TopNav  │ │  Hero    │ │ Sections  │ │ DevMode   │  │
│  │ (tabs)  │ │ + About  │ │ (scrolls) │ │ (admin)   │  │
│  └─────────┘ └──────────┘ └───────────┘ └───────────┘  │
│       │            │             │              │       │
│       └────────────┴──────┬──────┴──────────────┘       │
│                           │                             │
│              IntersectionObserver (Reveal)               │
│              CSS Custom Properties + Dark Mode           │
│              localStorage (book notes/comments)          │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTP (fetch)
                            │  Ports 3000 → 4000
┌───────────────────────────┴─────────────────────────────┐
│                    Express 5 Server                      │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/github/* │  │ /api/books/* │  │/api/comments*│  │
│  │              │  │              │  │              │  │
│  │ GitHub REST  │  │ Zod valid.   │  │ Zod valid.   │  │
│  │ API proxy    │  │ Multer upload│  │ CRUD         │  │
│  │              │  │ Sharp resize │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │          │
│         │          ┌──────┴───────┐         │          │
│         │          │  Cover APIs  │         │          │
│         │          │ Google Books │         │          │
│         │          │ Open Library │         │          │
│         │          └──────────────┘         │          │
│         │                 │                 │          │
│  ┌──────┴─────────────────┴─────────────────┴───────┐  │
│  │                   Prisma ORM                      │  │
│  │         (generate → migrate → query)              │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │
               ┌──────────┴──────────┐
               │       MySQL         │
               │                     │
               │  Comment            │
               │  Book               │
               │  BookArchive        │
               └─────────────────────┘
```

### Stack Details

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | React 19 | Component-based UI with hooks (`useState`, `useEffect`, `useRef`, `useLayoutEffect`) |
| | Create React App | Build toolchain (Webpack, Babel, ESLint) |
| | react-icons | Icon library (FontAwesome via `FaEnvelope`, `FaGithub`, `FaLinkedin`) |
| | CSS Custom Properties | Design tokens for theming (`variables.css`) with dark mode support |
| | IntersectionObserver | Scroll-triggered reveal animations + active nav tab tracking |
| | `createPortal` | Modals rendered outside component tree (book detail, cover selection) |
| | localStorage | Client-side persistence for book notes and per-book comments |
| **Backend** | Express 5 | REST API server with JSON body limits (100kb DoS mitigation) |
| | Prisma ORM | Type-safe database client with migration management |
| | Zod | Runtime schema validation for all API inputs (comments, books) |
| | Multer | Multipart file upload handling (memory storage, 5MB limit) |
| | Sharp | Image processing — converts uploaded covers to optimised JPEG |
| | Axios | Server-side HTTP client for GitHub, Google Books, Open Library APIs |
| | CORS | Whitelisted origins (`localhost:3000–3002`, `5173`) |
| **Database** | MySQL | Relational storage via Prisma with indexed queries |
| | 3 models | `Comment` (visitor messages), `Book` (active shelf), `BookArchive` (historical tracking with soft delete) |
| **External APIs** | GitHub REST API | Repo list + per-repo language byte counts (optional token auth) |
| | Google Books API | Book cover search with enhanced image quality (`zoom=3`, `fife=w800`) |
| | Open Library API | Alternative high-quality cover source (searched first) |
| **DevOps** | `start.sh` | Bash startup script — installs deps, runs Prisma migrations, auto-detects available ports, opens browser, handles cleanup on `Ctrl+C` |
| | Hangul romanization | Server-side Korean → ASCII transliteration for filename-safe cover slugs |

### Data Flow

1. **App boot** — React mounts, fires two parallel fetches: GitHub overview + English books (deferred 100ms to prioritise critical render)
2. **GitHub section** — Server proxies `api.github.com/users/sunnycho100/repos`, aggregates language bytes across all repos, returns unified payload
3. **Skills merge** — `Skills.jsx` merges GitHub-detected languages with a hand-curated list, deduplicates, renders as chips
4. **Book add (English)** — User enters title/author → frontend calls `/api/books/search` → server queries Open Library then Google Books → returns cover options → user picks one → `POST /api/books` with chosen `imagePath` → Prisma creates `Book` + upserts `BookArchive`
5. **Book add (Korean)** — User drops a cover image → `POST /api/books/upload` (multipart) → Sharp converts to JPEG → filename generated via Hangul romanization → saved to `public/books/` → DB record created
6. **Comments** — `POST /api/comments` validates via Zod → stores in MySQL → `GET /api/comments` returns newest-first → accordion renders with avatar initials + hue-based colours

## Sections

The site is a single-page app with tab-based navigation that highlights the active section as you scroll:

| Section | Description |
|---------|-------------|
| **Home** | Hero with profile photo and résumé download |
| **About** | Personal background and story |
| **Education** | UW–Madison and Australian International School |
| **Experience** | Timeline / list view toggle showing work history (Deloitte, UW–Madison, ROK Army, etc.) |
| **Skills** | Categorised skill chips (Languages, Tools & Platforms, Other) — language list auto-merges from GitHub data |
| **Activities** | Club memberships and volunteer work |
| **GitHub** | Live repo cards + language usage bar chart pulled from the GitHub API |
| **Books** | Interactive 3D book carousel with cover search, drag-and-drop upload, and language tabs (English / Korean) |
| **More** | Interests, mentors, and a visitor comments accordion |
| **Contact** | Email, LinkedIn, GitHub links, and a "Leave a Comment" form |

## Features

### GitHub Integration

Fetches all public repos for [`sunnycho100`](https://github.com/sunnycho100) via the GitHub API:

- Language usage breakdown (byte-weighted bar + legend, top 5 + Other)
- Sortable repo cards with primary language, stars, forks, and last-updated date
- Skills section auto-merges GitHub languages with a hand-curated list

Set `GITHUB_TOKEN` in the server `.env` for higher rate limits.

### Bookshelf

An interactive 3D carousel displaying book covers. Books are stored in MySQL and served through a REST API.

- **Cover search** — searches Open Library and Google Books for high-quality covers
- **Drag-and-drop upload** — drop a cover image to add a book (processed to JPEG via Sharp)
- **Language tabs** — separate English and Korean shelves
- **Book modal** — click a book to see details; personal notes and comments persist in `localStorage`
- **Archive** — every book ever added is tracked in a `BookArchive` table (times added, deleted status)
- **Korean support** — Hangul titles are romanized to filename-safe slugs for cover storage

### Comment System

Visitors can leave messages with name, optional relationship, and a 500-character message. Comments are stored in MySQL and displayed newest-first in an accordion under "More".

### Developer Mode

Password-protected admin panel for managing the bookshelf:

1. Click the 🔧 button (bottom-right corner)
2. Enter the password (`REACT_APP_DEV_PASSWORD` env var)
3. Access book manager (edit covers, delete books) and book archive viewer
4. Click again to exit

### Scroll Animations

Every section is wrapped in a `<Reveal>` component that uses `IntersectionObserver` to trigger fade-in/slide-up animations. Respects `prefers-reduced-motion`.

### Dark Mode

Stylesheet support for dark mode via `darkmode.css`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/github/overview` | All public repos with language stats |
| `GET` | `/api/comments?take=N` | List comments (newest first, max 100) |
| `POST` | `/api/comments` | Create a comment (`name`, `relationship?`, `message`) |
| `GET` | `/api/books?language=en\|ko` | List books (optional language filter) |
| `GET` | `/api/books/search?title=…&author=…` | Search Open Library + Google Books for covers |
| `POST` | `/api/books` | Add a book (auto-fetches cover if none provided) |
| `POST` | `/api/books/upload` | Upload a cover image + create book (multipart form) |
| `PUT` | `/api/books/:id` | Update book metadata / cover |
| `DELETE` | `/api/books/:id` | Delete a book (marks as deleted in archive) |
| `GET` | `/api/books/archive/all` | Full book history |

## Environment Variables

Create `.env` files (excluded from version control):

**Root `.env`**
```env
REACT_APP_DEV_PASSWORD=your_password_here
REACT_APP_API_URL=http://localhost:4000
```

**`server/.env`**
```env
DATABASE_URL=mysql://user:pass@localhost:3306/portfolio
SHADOW_DATABASE_URL=mysql://user:pass@localhost:3306/portfolio_shadow
GITHUB_TOKEN=ghp_...          # optional, raises rate limit
PORT=4000                     # optional, defaults to 4000
```

## Project Structure

```
├── public/books/              # Book cover images (uploaded or downloaded)
├── scripts/
│   └── downloadBookCovers.js  # Bulk cover download utility
├── server/
│   ├── index.js               # Express API (GitHub, books, comments)
│   └── prisma/
│       └── schema.prisma      # Comment, Book, BookArchive models
├── src/
│   ├── App.jsx                # Root component, data preloading
│   ├── components/
│   │   ├── TopNav.jsx         # Tab navigation with active section tracking
│   │   ├── Hero.jsx           # Profile photo + résumé download
│   │   ├── About.jsx          # Personal story
│   │   ├── Education.jsx      # Schools and honors
│   │   ├── Experience.jsx     # Timeline / list view with work history
│   │   ├── Timeline.jsx       # Visual timeline component
│   │   ├── Skills.jsx         # Skill chips merged with GitHub languages
│   │   ├── Activities.jsx     # Clubs and volunteering
│   │   ├── Github.jsx         # Live GitHub stats and repo cards
│   │   ├── Books.jsx          # Bookshelf with search, tabs, cover selection modal
│   │   ├── BookCarousel.jsx   # 3D carousel with draggable book modal
│   │   ├── BookCoverDrop.jsx  # Drag-and-drop cover upload
│   │   ├── More.jsx           # Interests, mentors, comments accordion
│   │   ├── CommentsSection.jsx# Visitor comments display
│   │   ├── LeaveComment.jsx   # Comment submission form
│   │   ├── Contact.jsx        # Social links + comment form
│   │   ├── DeveloperMode.jsx  # Admin panel (book management, archive)
│   │   └── Reveal.jsx         # Scroll-triggered fade-in animation
│   ├── styles/                # Modular CSS (components, global, utilities)
│   └── utils/
│       └── bookCovers.js      # Cover path helpers
└── start.sh                   # One-command startup script
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start React dev server |
| `npm run build` | Production build to `build/` |
| `npm test` | Run tests (Jest + React Testing Library) |
| `npm run download-covers` | Bulk-download book cover images |

## TODO

### Work Experience Timeline
- [ ] Automatic date extraction from experience descriptions to eliminate duplicate data sources in `Experience.jsx`

