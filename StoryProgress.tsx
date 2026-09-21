'use client';

import { motion, type MotionValue } from 'framer-motion';

interface StoryProgressProps {
  count: number;
  index: number;
  /** 0 to 1 for the current slide. Driven outside React so it never re-renders. */
  progress: MotionValue<number>;
  hidden?: boolean;
}

export function StoryProgress({ count, index, progress, hidden }: StoryProgressProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex gap-1 px-3 transition-opacity duration-200"
      style={{ paddingTop: 'calc(var(--safe-top) + 12px)', opacity: hidden ? 0 : 1 }}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={index + 1}
      aria-label="Story progress"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-bone/25">
          {i < index && <div className="h-full w-full bg-bone" />}
          {i === index && (
            <motion.div className="h-full w-full origin-left bg-bone" style={{ scaleX: progress }} />
          )}
        </div>
      ))}
    </div>
  );
}
