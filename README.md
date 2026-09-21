# Dola, wrapped.

A story-style birthday web app. Next.js (App Router), Tailwind, Framer Motion, canvas-confetti, all TypeScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (open on your phone via your LAN IP too)
```

## Ship it

```bash
npm run build      # static site in ./out, upload it anywhere
```

Works on Vercel, Netlify, Cloudflare Pages, or GitHub Pages. For GitHub Pages under a repo path,
uncomment `basePath` and `assetPrefix` in `next.config.mjs`, and prefix the asset paths in
`src/data/slides.ts` and `AUDIO_SOURCES` with the same path.

## Change the words

Every line of copy, every date, and every photo choice lives in **`src/data/slides.ts`**.
Press-and-hold anywhere to pause a slide while you proofread.

- Friendship day count: `startDate` on the mileage slide (currently 2026-05-09).
- Slide length: `durationMs` per slide. The reel slide splits its time evenly across its items.
- Swap a photo: change the number in `photo(n, ...)`. Files are in `public/assets/media/`.
  Photos 1, 5 and 6 are unused spares.
- Audio: `public/assets/track.m4a` (plays first) and `track.mp3` (fallback). Same track, two formats.

## Controls

Tap right 70% = next. Tap left 30% = back. Swipe left/right. Arrow keys on desktop.
Press and hold = pause. Speaker icon top right = mute/unmute.

## Files

```
src/data/slides.ts            all copy + media config
src/data/types.ts             slide types
src/hooks/useLoopingAudio.ts  one audio element that loops across slides
src/components/SlideViewer    gestures, auto-advance clock, transitions
src/components/StoryProgress  segmented progress bars
src/components/AudioPlayer    floating sound-wave toggle
src/components/slides/*       the six slides
src/app/page.tsx              wires audio + viewer together
```
