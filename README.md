# Sunny Cho — Personal Portfolio (v2)

A personal dashboard-style portfolio built with React, TypeScript, and Vite. Designed to showcase work, GitHub activity, and interests in a minimal, card-based UI.

## Stack

- **React 19 + TypeScript** — component-based UI
- **Vite** — fast dev server and build tool
- **CSS custom properties** — glassmorphism design system, no UI library

## Features

- **GitHub Heatmap** — live contribution graph via GitHub GraphQL API
- **Gallery** — photo grid for experiences and moments
- **Mini Calendar** — current month with today highlighted
- **Quick Summary** — education, agentic tools, and languages at a glance
- **Reading List** — curated books with cover art

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_GITHUB_TOKEN=your_github_pat_here
```

Required scope: `read:user`. Without it, the heatmap falls back to the public events API.

## Project Structure

```
src/
  components/    # All UI components
  index.css      # Global styles and design tokens
  App.tsx        # Layout and routing
docs/
  CHANGELOG.md   # Release history
```

## Changelog

See [`docs/CHANGELOG.md`](docs/CHANGELOG.md).
