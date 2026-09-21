'use client';

import { SlideViewer } from '@/SlideViewer';
import { AUDIO_SOURCES, SLIDES } from '@/slides';
import { useLoopingAudio } from '@/useLoopingAudio';

export default function Page() {
  const audio = useLoopingAudio(AUDIO_SOURCES);
  return <main><SlideViewer slides={SLIDES} audio={audio} /></main>;
}
