# Fieldnotes Blog Application

A responsive React and TypeScript blog application built with TanStack Router and TanStack Query. It consumes the Oluwasetemi API at https://api.oluwasetemi.dev.

## Features
- Browse blog posts with titles, excerpts, publication dates, and search.
- Open a post detail page using its ID.
- Create and submit a new post through POST /posts.
- TanStack Router navigation, browser history, and a 404 fallback.
- TanStack Query caching, loading states, request errors, and refetching.
- Lazy-loaded route modules with React Suspense.
- A React Error Boundary for unexpected rendering errors.
- Responsive layouts and accessible form labels.

## Tech stack
React 19, TypeScript, Vite, TanStack Router, TanStack Query, Lucide icons, CSS.

## Run locally
Requires Node.js 20 or newer.
```bash
npm install
npm run dev
```
Open the URL printed by Vite, usually http://localhost:5173.

## Production build
```bash
npm run build
npm run preview
```

## API integration
- GET https://api.oluwasetemi.dev/posts
- GET https://api.oluwasetemi.dev/posts/:id
- POST https://api.oluwasetemi.dev/posts

The list parser accepts common response envelopes (posts, data, results, items). The create form submits { title, content }. The API may require an authenticated session for creating posts; server rejections are shown in the form instead of a false success state. Do not put privileged API credentials in client-side code.

API reference: https://api.oluwasetemi.dev/reference
