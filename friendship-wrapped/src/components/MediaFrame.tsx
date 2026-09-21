/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
import type { Media } from '@/data/types';

interface MediaFrameProps {
  media: Media;
  className?: string;
}

/** Full-bleed photo or looping muted clip. Clips fall back to their poster frame. */
export function MediaFrame({ media, className = '' }: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const style = media.focus ? { objectPosition: media.focus } : undefined;
  const base = `pointer-events-none h-full w-full object-cover ${className}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => undefined); // blocked? the poster frame stays visible
  }, [media]);

  if (media.kind === 'video') {
    return (
      <video
        ref={videoRef}
        className={base}
        style={style}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    );
  }

  return <img className={base} style={style} src={media.src} alt={media.alt} draggable={false} />;
}
