import type { Media, Slide } from './types';

const DAY_MS = 86_400_000;

/** Whole days between a local-midnight date (YYYY-MM-DD) and now. Never negative. */
export function daysSince(isoDate: string, now: Date = new Date()): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  const start = new Date(y, m - 1, d).getTime();
  return Math.max(0, Math.floor((now.getTime() - start) / DAY_MS));
}

function stillOf(media: Media): string {
  return media.kind === 'video' ? media.poster : media.src;
}

/** Every still image a slide needs, so the viewer can preload them. */
export function imageUrls(slide: Slide): string[] {
  switch (slide.type) {
    case 'cover':
    case 'award':
      return [stillOf(slide.media)];
    case 'archetype':
      return [stillOf(slide.exhibit)];
    case 'reel':
      return slide.items.map((item) => stillOf(item.media));
    case 'letter':
      return [stillOf(slide.backdrop)];
    case 'mileage':
      return [];
  }
}
