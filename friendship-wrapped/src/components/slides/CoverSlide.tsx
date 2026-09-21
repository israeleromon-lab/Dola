'use client';

import { motion } from 'framer-motion';
import { MediaFrame } from '../MediaFrame';
import type { CoverSlide as CoverSlideData } from '../../data/types';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const LINE_SIZES = ['clamp(72px, 31cqw, 170px)', 'clamp(50px, 21cqw, 118px)'];

export function CoverSlide({ slide }: { slide: CoverSlideData }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 9, ease: EASE_OUT }}><MediaFrame media={slide.media} /></motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/5 to-ink/95" />
      <p className="pt-chrome absolute inset-x-0 top-0 px-6 font-sans text-[13px] tracking-wide text-bone/80">{slide.masthead}</p>
      <div className="pb-toast absolute inset-x-0 bottom-0 px-6"><h1 className="font-display font-bold italic leading-[0.88] tracking-[-0.03em] text-bone">{slide.titleLines.map((line, i) => <span key={line} className="block overflow-hidden whitespace-nowrap pb-[0.2em] pr-[0.12em]" style={{ fontSize: LINE_SIZES[i] ?? LINE_SIZES[1], marginBottom: '-0.1em' }}><motion.span className="block" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.16, duration: 1.05, ease: EASE_OUT }}>{line}</motion.span></span>)}</h1><motion.p className="mt-4 max-w-[28ch] font-sans text-[15px] leading-snug text-bone/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>{slide.dek}</motion.p></div>
    </div>
  );
}
