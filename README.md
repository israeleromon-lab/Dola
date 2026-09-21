# Vercel deployment

The canonical application entry points are `app/page.tsx` and `app/layout.tsx`. Import the repository with **Root Directory** set to `.` and use the Next.js preset. Vercel should use `npm install` and `npm run build`; no environment variables are required.

The source compatibility modules under `components/`, `data/`, and `hooks/` preserve the existing `@/...` imports while the project is consolidated.

Before production deployment, verify that the binary media files are available under `public/assets/` (including `track.m4a`, `track.mp3`, photos, clips, and posters). The current repository also retains the original root media files and the ZIP archive for reference.
