'use client';

import { AnimatePresence, motion, useMotionValueEvent, type MotionValue, type Variants } from 'framer-motion';
import { useState } from 'react';
import { MediaFrame } from '@/components/MediaFrame';
import type { ReelSlide as ReelSlideData } from '@/data/types';

interface ReelSlideProps {
  slide: ReelSlideData;
  /** Story progress (0 to 1). The reel cuts on it, so holding the screen freezes the reel too. */
  progress: MotionValue<number>;
}

const wordVariants: Variants = {
  hidden: { y: '115%' },
  show: { y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
};

function KineticCaption({ text, at }: { text: string; at: 'top' | 'bottom' }) {
  const words = text.split(' ');
  return (
    <motion.p
      className="absolute inset-x-0 z-10 px-6 font-display font-bold italic leading-[1.02] text-bone"
      style={{
        fontSize: 'clamp(28px, 9cqw, 54px)',
        textShadow: '0 2px 24px rgba(18,17,19,0.7)',
        ...(at === 'top'
          ? { top: 'calc(var(--safe-top) + 92px)' }
          : { bottom: 'calc(var(--safe-bottom) + 52px)' }),
      }}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      variants={{ show: { transition: { staggerChildren: 0.055 } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="mr-[0.24em] inline-block overflow-hidden pb-[0.22em] pr-[0.06em] align-bottom">
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

export function ReelSlide({ slide, progress }: ReelSlideProps) {
  const count = slide.items.length;
  const indexFor = (p: number) => Math.min(count - 1, Math.floor(p * count));

  const [current, setCurrent] = useState(() => indexFor(progress.get()));
  useMotionValueEvent(progress, 'change', (p) => {
    const next = indexFor(p);
    setCurrent((prev) => (prev === next ? prev : next));
  });

  const item = slide.items[current];

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.09 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <MediaFrame media={item.media} />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/80" />

      <AnimatePresence mode="wait">
        <KineticCaption key={current} text={item.caption} at={item.captionAt} />
      </AnimatePresence>

      <p
        className="absolute left-4 z-10 rounded-full bg-ink/50 px-3 py-1.5 font-sans text-[12px] tabular-nums text-bone/90 backdrop-blur-md"
        style={{ top: 'calc(var(--safe-top) + 32px)' }}
        aria-hidden="true"
      >
        {current + 1} / {count}
      </p>
    </div>
  );
}
