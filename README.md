# Dola, wrapped.

A story-style birthday web app built with Next.js, Tailwind, Framer Motion, and canvas-confetti.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The production build is:

```bash
npm run build
npm run start
```

## Deploy to Vercel

Import `israeleromon-lab/Dola` into Vercel with these settings:

- **Root Directory:** `.`
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** leave blank; Vercel detects Next.js automatically

No environment variables are required.

The canonical Next.js entry points are `app/page.tsx` and `app/layout.tsx`. The older root-level files and `friendship-wrapped/` directory are retained as source/archive references and should not be selected as Vercel's root directory.
