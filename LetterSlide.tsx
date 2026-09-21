'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { MediaFrame } from '@/components/MediaFrame';
import type { LetterSlide as LetterSlideData } from '@/data/types';

interface LetterSlideProps {
  slide: LetterSlideData;
  onReplay: () => void;
}

const CONFETTI_COLORS = ['#E2325E', '#DDA94B', '#EFE7DA', '#C9864F'];

export function LetterSlide({ slide, onReplay }: LetterSlideProps) {
  // Finale: one big burst, two side cannons, then a short shower.
  useEffect(() => {
    let cancelled = false;
    let reset: (() => void) | undefined;
    const timers: number[] = [];

    const launch = async () => {
      const { default: confetti } = await import('canvas-confetti');
      if (cancelled) return;
      reset = () => confetti.reset();

      const base = {
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
        zIndex: 100,
      };

      confetti({ ...base, particleCount: 170, spread: 105, startVelocity: 58, origin: { x: 0.5, y: 0.72 } });

      timers.push(
        window.setTimeout(() => {
          confetti({ ...base, particleCount: 90, angle: 60, spread: 70, startVelocity: 62, origin: { x: 0, y: 0.82 } });
          confetti({ ...base, particleCount: 90, angle: 120, spread: 70, startVelocity: 62, origin: { x: 1, y: 0.82 } });
        }, 350),
      );

      timers.push(
        window.setTimeout(() => {
          const stopAt = Date.now() + 2400;
          const shower = window.setInterval(() => {
            if (cancelled || Date.now() > stopAt) {
              window.clearInterval(shower);
              return;
            }
            confetti({
              ...base,
              particleCount: 5,
              angle: 90,
              spread: 160,
              startVelocity: 26,
              gravity: 0.8,
              ticks: 280,
              origin: { x: Math.random(), y: -0.05 },
            });
          }, 110);
          timers.push(shower);
        }, 800),
      );
    };

    timers.push(window.setTimeout(launch, 450));

    return () => {
      cancelled = true;
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      reset?.();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div className="absolute inset-0 scale-110 opacity-30 blur-2xl">
        <MediaFrame media={slide.backdrop} />
      </div>
      <div className="absolute inset-0 bg-ink/60" />

      <div className="pt-chrome pb-safe relative flex h-full flex-col px-6">
        <motion.h2
          className="font-display font-bold italic leading-[0.95] tracking-[-0.02em] text-bone"
          style={{ fontSize: 'clamp(40px, 14cqw, 84px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {slide.heading}
        </motion.h2>

        <div
          className="mt-5 space-y-4 font-display leading-[1.42] text-bone/90"
          style={{ fontSize: 'clamp(16px, 4.5cqw, 22px)' }}
        >
          {slide.paragraphs.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.75, duration: 0.7 }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="mt-5 font-display italic text-bone"
          style={{ fontSize: 'clamp(22px, 6.5cqw, 34px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + slide.paragraphs.length * 0.75, duration: 0.8 }}
        >
          {slide.signoff}
        </motion.p>

        <motion.div
          className="mt-auto pt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.6 }}
        >
          <button
            type="button"
            data-no-tap
            onClick={onReplay}
            className="w-full rounded-full border border-bone/40 bg-ink/40 py-3.5 font-sans text-[15px] font-medium text-bone backdrop-blur-sm transition-transform active:scale-[0.98]"
          >
            {slide.replayLabel}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
