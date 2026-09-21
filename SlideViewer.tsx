'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  type PanInfo,
  type Variants,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { imageUrls } from '@/data/helpers';
import type { Slide } from '@/data/types';
import type { LoopingAudio } from '@/hooks/useLoopingAudio';
import { AudioPlayer } from './AudioPlayer';
import { Grain } from './Grain';
import { SlideRenderer } from './slides/SlideRenderer';
import { StoryProgress } from './StoryProgress';

const HOLD_MS = 220; // a press longer than this is a "hold", not a tap
const MOVE_SLOP = 10; // px of travel before a press counts as a drag
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 450;
const BACK_ZONE = 0.3; // left 30% goes back, right 70% goes forward
const MAX_FRAME_MS = 100; // ignore huge gaps (tab was in the background)

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-26%', zIndex: dir > 0 ? 2 : 1 }),
  center: { x: 0, zIndex: 2, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-26%' : '100%', zIndex: dir > 0 ? 1 : 2, opacity: 0.5 }),
};

const slideTransition = { type: 'spring', stiffness: 240, damping: 30, mass: 0.9 } as const;

interface PointerState {
  x: number;
  y: number;
  t: number;
  moved: boolean;
}

interface SlideViewerProps {
  slides: readonly Slide[];
  audio: LoopingAudio;
}

export function SlideViewer({ slides, audio }: SlideViewerProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [gated, setGated] = useState(true); // true until the first tap unlocks sound
  const [holding, setHolding] = useState(false);

  const progress = useMotionValue(0);
  const last = slides.length - 1;

  // Timer state lives in refs so the rAF loop never triggers a React render.
  const indexRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const gatedRef = useRef(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState | null>(null);
  const holdTimer = useRef<number | undefined>(undefined);
  const hasNavigated = useRef(false); // the first slide shouldn't slide in from the side

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      if (next < 0 || next > last) return;
      hasNavigated.current = true;
      indexRef.current = next;
      elapsedRef.current = 0;
      progress.set(0); // reset before the new slide mounts so it never sees stale progress
      setDirection(dir);
      setIndex(next);
    },
    [last, progress],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = indexRef.current + dir;
      if (next < 0) {
        // Back on the first slide just restarts it.
        elapsedRef.current = 0;
        progress.set(0);
        return;
      }
      goTo(next, dir);
    },
    [goTo, progress],
  );

  const unlock = useCallback(() => {
    if (!gatedRef.current) return;
    gatedRef.current = false;
    setGated(false);
    audio.start();
  }, [audio]);

  const onAudioButton = useCallback(() => {
    if (gatedRef.current) unlock();
    else audio.toggle();
  }, [audio, unlock]);

  // Auto-advance clock (6 to 8s per slide, set in slides.ts).
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, MAX_FRAME_MS);
      prev = now;
      if (!pausedRef.current && !gatedRef.current) {
        const i = indexRef.current;
        const p = Math.min((elapsedRef.current + dt) / slides[i].durationMs, 1);
        elapsedRef.current += dt;
        progress.set(p);
        if (p >= 1 && i < last) goTo(i + 1, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slides, last, goTo, progress]);

  // Keyboard for desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const forward = e.key === 'ArrowRight';
      const back = e.key === 'ArrowLeft';
      const confirm = e.key === 'Enter' || e.key === ' ';
      if (!forward && !back && !confirm) return;
      if (gatedRef.current) {
        e.preventDefault();
        unlock();
        return;
      }
      if (forward) step(1);
      if (back) step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, unlock]);

  // Warm the cache so photos are already there when a slide slides in.
  useEffect(() => {
    slides.flatMap(imageUrls).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  // Pointer: tap zones + press-and-hold to pause.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-no-tap]')) return;
    pointerRef.current = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    pausedRef.current = true;
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHolding(true), HOLD_MS);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointerRef.current;
    if (!p || p.moved) return;
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_SLOP) p.moved = true;
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    window.clearTimeout(holdTimer.current);
    setHolding(false);
    pausedRef.current = false;

    const p = pointerRef.current;
    pointerRef.current = null;
    if (!p || cancelled || p.moved) return;

    if (gatedRef.current) {
      unlock(); // "Tap anywhere to experience with sound."
      return;
    }
    if (performance.now() - p.t > HOLD_MS) return; // it was a hold, not a tap

    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    step(x < BACK_ZONE ? -1 : 1);
  };

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    if (gatedRef.current) return;
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) step(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) step(-1);
  };

  const slide = slides[index];
  const soundHint = slides[0].type === 'cover' ? slides[0].soundHint : 'Tap anywhere to experience with sound.';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0b0a0b]">
      <div
        ref={stageRef}
        className="stage relative h-full overflow-hidden bg-ink text-bone"
        style={{ width: 'min(100vw, calc(100dvh * 9 / 16))' }}
      >
        <motion.div
          className="absolute inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endPointer(e, false)}
          onPointerCancel={(e) => endPointer(e, true)}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse' && pointerRef.current) endPointer(e, true);
          }}
        >
          <AnimatePresence custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial={hasNavigated.current ? 'enter' : false}
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="absolute inset-0"
            >
              <SlideRenderer slide={slide} progress={progress} onReplay={() => goTo(0, -1)} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <StoryProgress count={slides.length} index={index} progress={progress} hidden={holding} />
        <AudioPlayer playing={audio.playing} onToggle={onAudioButton} />

        <AnimatePresence>
          {gated && (
            <motion.div
              key="sound-hint"
              className="pointer-events-none absolute inset-x-0 z-30 flex justify-center px-6"
              style={{ bottom: 'calc(var(--safe-bottom) + 28px)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.9, type: 'spring', stiffness: 200, damping: 24 },
              }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
            >
              <div className="flex items-center gap-3 rounded-full bg-bone px-5 py-3 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <span className="flex h-3.5 items-center gap-[2px]" aria-hidden="true">
                  {[0.5, 1, 0.65].map((peak, i) => (
                    <motion.span
                      key={i}
                      className="block h-full w-[2px] rounded-full bg-ink"
                      animate={{ scaleY: [0.3, peak, 0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                    />
                  ))}
                </span>
                <span className="font-sans text-[13px] font-medium tracking-tight">{soundHint}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Grain />
      </div>
    </div>
  );
}
