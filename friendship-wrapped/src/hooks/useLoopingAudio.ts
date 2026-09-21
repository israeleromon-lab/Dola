'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
const MIME: Record<string, string> = { m4a: 'audio/mp4; codecs="mp4a.40.2"', mp3: 'audio/mpeg' };
export interface LoopingAudio { playing: boolean; start: () => void; toggle: () => void; }
function pickSource(el: HTMLAudioElement, sources: readonly string[]): string { for (const src of sources) { const ext = src.split('.').pop()?.toLowerCase() ?? ''; const mime = MIME[ext]; if (mime && el.canPlayType(mime) !== '') return src; } return sources[0]; }
export function useLoopingAudio(sources: readonly string[], volume = 0.85): LoopingAudio {
  const elRef = useRef<HTMLAudioElement | null>(null); const fadeRaf = useRef(0); const wantsPlay = useRef(false); const [playing, setPlaying] = useState(false);
  const fadeTo = useCallback((el: HTMLAudioElement, to: number, ms: number, done?: () => void) => { cancelAnimationFrame(fadeRaf.current); const from = el.volume; const t0 = performance.now(); const step = (now: number) => { const k = Math.min((now - t0) / ms, 1); el.volume = Math.min(1, Math.max(0, from + (to - from) * k)); if (k < 1) fadeRaf.current = requestAnimationFrame(step); else done?.(); }; fadeRaf.current = requestAnimationFrame(step); }, []);
  useEffect(() => { const el = new Audio(); el.loop = true; el.preload = 'auto'; el.volume = 0; el.src = pickSource(el, sources); elRef.current = el; const onPlay = () => setPlaying(true); const onPause = () => setPlaying(false); const onVisibility = () => { if (document.hidden) el.pause(); else if (wantsPlay.current) void el.play().catch(() => undefined); }; el.addEventListener('play', onPlay); el.addEventListener('pause', onPause); document.addEventListener('visibilitychange', onVisibility); return () => { cancelAnimationFrame(fadeRaf.current); document.removeEventListener('visibilitychange', onVisibility); el.removeEventListener('play', onPlay); el.removeEventListener('pause', onPause); el.pause(); el.removeAttribute('src'); el.load(); elRef.current = null; }; }, [sources]);
  const play = useCallback(() => { const el = elRef.current; if (!el) return; wantsPlay.current = true; el.play().then(() => fadeTo(el, volume, 1400)).catch(() => { wantsPlay.current = false; }); }, [fadeTo, volume]);
  const pause = useCallback(() => { const el = elRef.current; if (!el) return; wantsPlay.current = false; setPlaying(false); fadeTo(el, 0, 250, () => el.pause()); }, [fadeTo]);
  const start = useCallback(() => { const el = elRef.current; if (el && el.paused) play(); }, [play]);
  const toggle = useCallback(() => { const el = elRef.current; if (!el) return; if (el.paused) play(); else pause(); }, [play, pause]);
  return useMemo(() => ({ playing, start, toggle }), [playing, start, toggle]);
}
