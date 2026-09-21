'use client';

import { motion } from 'framer-motion';

interface AudioPlayerProps {
  playing: boolean;
  onToggle: () => void;
}

/** Peak height of each bar while playing (fraction of full height). */
const PEAKS = [0.55, 0.95, 0.7, 1, 0.6];

export function AudioPlayer({ playing, onToggle }: AudioPlayerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Mute soundtrack' : 'Play soundtrack'}
      aria-pressed={playing}
      className="pointer-events-auto absolute right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-ink/50 ring-1 ring-bone/20 backdrop-blur-md transition-transform active:scale-90"
      style={{ top: 'calc(var(--safe-top) + 26px)' }}
    >
      <span className="flex h-4 items-center gap-[2.5px]" aria-hidden="true">
        {PEAKS.map((peak, i) => (
          <motion.span
            key={i}
            className="block h-full w-[2.5px] rounded-full bg-bone"
            animate={
              playing
                ? { scaleY: [0.25, peak, 0.35, peak * 0.8, 0.25] }
                : { scaleY: 0.14 }
            }
            transition={
              playing
                ? {
                    duration: 1.1 + i * 0.13,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }
                : { type: 'spring', stiffness: 320, damping: 22 }
            }
          />
        ))}
      </span>
    </button>
  );
}
