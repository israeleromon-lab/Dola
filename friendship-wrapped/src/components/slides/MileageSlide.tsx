'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { daysSince } from '../../data/helpers';
import type { MileageSlide as MileageSlideData } from '../../data/types';
import { Odometer } from '../Odometer';

export function MileageSlide({ slide }: { slide: MileageSlideData }) {
  const digits = useMemo(() => String(daysSince(slide.startDate)).split('').map(Number), [slide.startDate]);
  return (
    <div className="pt-chrome pb-safe relative flex h-full w-full flex-col bg-ink px-6">
      <p className="font-sans text-[14px] text-bone/60">{slide.label}</p>
      <div className="flex flex-1 flex-col justify-center"><Odometer digits={digits} /><motion.p className="mt-3 font-display italic leading-none text-bone" style={{ fontSize: 'clamp(28px, 9.5cqw, 52px)' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.7 }}>{slide.unit}</motion.p><motion.p className="mt-5 max-w-[30ch] font-sans text-[15px] leading-snug text-bone/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.7 }}>{slide.footnote}</motion.p></div>
      <motion.dl className="space-y-3 border-t border-bone/20 pt-4 font-sans text-[14px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.7 }}>{slide.receipt.map((row) => <div key={row.label} className="flex items-baseline gap-2"><dt className="text-bone/70">{row.label}</dt><span aria-hidden="true" className="flex-1 border-b border-dotted border-bone/30" /><dd className="text-right font-medium text-bone">{row.value}</dd></div>)}</motion.dl>
    </div>
  );
}
