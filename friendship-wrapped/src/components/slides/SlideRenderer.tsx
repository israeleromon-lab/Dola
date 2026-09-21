'use client';

import type { MotionValue } from 'framer-motion';
import type { Slide } from '@/data/types';
import { ArchetypeSlide } from '../ArchetypeSlide';
import { AwardSlide } from './AwardSlide';
import { CoverSlide } from './CoverSlide';
import { LetterSlide } from './LetterSlide';
import { MileageSlide } from './MileageSlide';
import { ReelSlide } from '../ReelSlide';

interface SlideRendererProps { slide: Slide; progress: MotionValue<number>; onReplay: () => void; }

export function SlideRenderer({ slide, progress, onReplay }: SlideRendererProps) {
  switch (slide.type) {
    case 'cover': return <CoverSlide slide={slide} />;
    case 'mileage': return <MileageSlide slide={slide} />;
    case 'archetype': return <ArchetypeSlide slide={slide} />;
    case 'reel': return <ReelSlide slide={slide} progress={progress} />;
    case 'award': return <AwardSlide slide={slide} />;
    case 'letter': return <LetterSlide slide={slide} onReplay={onReplay} />;
  }
}
