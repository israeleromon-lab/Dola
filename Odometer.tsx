'use client';

import { motion } from 'framer-motion';

const DIGITS = Array.from({ length: 10 }, (_, n) => n);

/** Rolling-digit counter. Each column spins to its digit, left to right. */
export function Odometer({ digits }: { digits: number[] }) {
  return (
    <div
      className="flex font-display font-bold leading-none tracking-[-0.04em] text-bone"
      style={{ fontSize: 'clamp(96px, 46cqw, 250px)' }}
      role="img"
      aria-label={digits.join('')}
    >
      {digits.map((digit, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="relative block h-[1em] overflow-hidden"
          style={{ width: '0.62em' }}
        >
          <motion.span
            className="block"
            initial={{ y: '0%' }}
            animate={{ y: `${-digit * 10}%` }}
            transition={{ type: 'spring', stiffness: 55, damping: 15, delay: 0.35 + i * 0.16 }}
          >
            {DIGITS.map((n) => (
              <span key={n} className="block h-[1em] text-center">
                {n}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
