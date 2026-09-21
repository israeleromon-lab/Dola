'use client';

import { motion } from 'framer-motion';
import { MediaFrame } from '@/components/MediaFrame';
import type { AwardSlide as AwardSlideData } from '@/data/types';

const GOLD = '#DDA94B';

export function AwardSlide({ slide }: { slide: AwardSlideData }) {
  return (
    <div className="pt-chrome pb-safe relative flex h-full w-full flex-col items-center bg-ink px-6 text-center">
      <motion.div
        className="relative shrink-0"
        style={{ width: 'min(62cqw, 300px)', aspectRatio: '1 / 1' }}
        initial={{ scale: 0.6, opacity: 0, rotate: -14 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 0.15 }}
      >
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full motion-safe:animate-[spin_30s_linear_infinite]"
          aria-hidden="true"
        >
          <defs>
            <path id="seal-ring" d="M 100,100 m -83,0 a 83,83 0 1,1 166,0 a 83,83 0 1,1 -166,0" />
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={GOLD} strokeWidth="1.2" />
          <circle cx="100" cy="100" r="69" fill="none" stroke={GOLD} strokeWidth="1.2" />
          <text
            fill={GOLD}
            style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif', fontSize: 13.5, fontWeight: 600 }}
          >
            <textPath href="#seal-ring" textLength="516" lengthAdjust="spacing">
              {slide.sealText}
            </textPath>
          </text>
        </svg>
        <div className="absolute overflow-hidden rounded-full" style={{ inset: '17%' }}>
          <MediaFrame media={slide.media} />
        </div>
      </motion.div>

      <motion.h2
        className="mt-7 font-display font-bold italic leading-[0.95] tracking-[-0.01em] text-bone"
        style={{ fontSize: 'clamp(34px, 11cqw, 64px)' }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        {slide.title}
      </motion.h2>

      <motion.p
        className="mt-2 max-w-[30ch] font-sans text-[15px] leading-snug text-bone/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        {slide.presentedTo}
      </motion.p>

      <ul className="mt-5 w-full divide-y divide-bone/15 border-y border-bone/15 text-left font-sans text-[14px] leading-snug text-bone/90">
        {slide.citations.map((line, i) => (
          <motion.li
            key={line}
            className="py-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + i * 0.35, duration: 0.5 }}
          >
            {line}
          </motion.li>
        ))}
      </ul>

      <motion.p
        className="mt-auto pt-4 font-sans text-[13px] italic text-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
      >
        {slide.footer}
      </motion.p>
    </div>
  );
}
