export interface ImageMedia {
  kind: 'image';
  src: string;
  alt: string;
  /** CSS object-position, e.g. "50% 20%". Defaults to centre. */
  focus?: string;
}

export interface VideoMedia {
  kind: 'video';
  src: string;
  /** Shown while the clip loads, and if autoplay is blocked. */
  poster: string;
  alt: string;
  focus?: string;
}

export type Media = ImageMedia | VideoMedia;

interface SlideBase {
  id: string;
  /** How long the slide stays before auto-advancing (ms). */
  durationMs: number;
}

export interface CoverSlide extends SlideBase {
  type: 'cover';
  media: Media;
  masthead: string;
  /** Two lines. The first is set larger than the second. */
  titleLines: [string, string];
  dek: string;
  /** Shown as a toast until the first tap unlocks audio. */
  soundHint: string;
}

export interface MileageSlide extends SlideBase {
  type: 'mileage';
  label: string;
  /** ISO date (YYYY-MM-DD). The odometer counts days since this date. */
  startDate: string;
  unit: string;
  footnote: string;
  receipt: { label: string; value: string }[];
}

export interface Meter {
  label: string;
  /** 0 to 100 */
  value: number;
  note: string;
  tone: 'warm' | 'chaos';
}

export interface ArchetypeSlide extends SlideBase {
  type: 'archetype';
  titleLines: string[];
  tagline: string;
  exhibit: Media;
  exhibitCaption: string;
  meterTitle: string;
  meters: Meter[];
}

export interface ReelItem {
  media: Media;
  caption: string;
  /** Where the caption sits, so it never covers text baked into the photo. */
  captionAt: 'top' | 'bottom';
}

export interface ReelSlide extends SlideBase {
  type: 'reel';
  items: ReelItem[];
}

export interface AwardSlide extends SlideBase {
  type: 'award';
  media: Media;
  /** Text that runs around the seal. */
  sealText: string;
  title: string;
  presentedTo: string;
  citations: string[];
  footer: string;
}

export interface LetterSlide extends SlideBase {
  type: 'letter';
  backdrop: Media;
  heading: string;
  paragraphs: string[];
  signoff: string;
  replayLabel: string;
}

export type Slide =
  | CoverSlide
  | MileageSlide
  | ArchetypeSlide
  | ReelSlide
  | AwardSlide
  | LetterSlide;
