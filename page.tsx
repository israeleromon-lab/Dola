'use client';

import { SlideViewer } from '@/components/SlideViewer';
import { AUDIO_SOURCES, SLIDES } from '@/data/slides';
import { useLoopingAudio } from '@/hooks/useLoopingAudio';

export default function Page() {
  // The audio lives here, above the viewer, so it keeps looping across slide changes.
  const audio = useLoopingAudio(AUDIO_SOURCES);

  return (
    <main>
      <SlideViewer slides={SLIDES} audio={audio} />
    </main>
  );
}
