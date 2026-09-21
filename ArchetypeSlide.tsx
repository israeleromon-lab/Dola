'use client';

import { motion } from 'framer-motion';
import { MediaFrame } from '@/components/MediaFrame';
import type { ArchetypeSlide as ArchetypeSlideData } from '@/data/types';

const BAR_TONE = {
  warm: 'bg-gold',
  chaos: 'bg-zobo',
} as const;

export function ArchetypeSlide({ slide }: { slide: ArchetypeSlideData }) {
  return (
    <div className="pt-chrome pb-safe relative flex h-full w-full flex-col bg-ink px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            className="font-display font-bold italic leading-[0.9] tracking-[-0.02em] text-bone"
            style={{ fontSize: 'clamp(44px, 15.5cqw, 92px)' }}
          >
            {slide.titleLines.map((line, i) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.2em] pr-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            className="mt-3 font-sans text-[15px] text-bone/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {slide.tagline}
          </motion.p>
        </div>

        <motion.figure
          className="shrink-0 bg-bone shadow-[0_14px_40px_rgba(0,0,0,0.5)]"
          style={{ width: '29cqw', padding: '1.6cqw 1.6cqw 1.4cqw' }}
          initial={{ opacity: 0, rotate: -10, y: 24 }}
          animate={{ opacity: 1, rotate: -4, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.5 }}
        >
          <div className="aspect-[4/5] w-full overflow-hidden">
            <MediaFrame media={slide.exhibit} />
          </div>
          <figcaption className="mt-[6px] font-sans text-[10.5px] font-medium leading-tight text-ink">
            {slide.exhibitCaption}
          </figcaption>
        </motion.figure>
      </div>

      <div className="mt-6 flex-1">
        <p className="font-sans text-[14px] text-bone/60">{slide.meterTitle}</p>
        <ul className="mt-1 divide-y divide-bone/10">
          {slide.meters.map((meter, i) => (
            <li key={meter.label} className="py-2.5">
              <div className="flex items-baseline justify-between gap-3 font-sans text-[14px]">
                <span className="font-medium text-bone">{meter.label}</span>
                <span className="tabular-nums text-bone/70">{meter.value}%</span>
              </div>
              <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-bone/15">
                <motion.div
                  className={`h-full origin-left rounded-full ${BAR_TONE[meter.tone]}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: meter.value / 100 }}
                  transition={{ type: 'spring', stiffness: 60, damping: 17, delay: 0.9 + i * 0.14 }}
                />
              </div>
              <motion.p
                className="mt-1.5 font-sans text-[12.5px] italic leading-snug text-bone/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.14, duration: 0.5 }}
              >
                {meter.note}
              </motion.p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
