'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameCountdownProps {
  onComplete: () => void;
}

export default function GameCountdown({ onComplete }: GameCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 900);
    return () => clearTimeout(t);
  }, [count, onComplete]);

  const label = count === 0 ? 'GO!' : String(count);
  const color = count === 0 ? 'var(--color-correct)' : 'var(--color-primary)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.span
            className="font-black"
            style={{
              fontSize: 'clamp(5rem, 20vw, 10rem)',
              color,
              textShadow: `0 0 40px ${color}`,
              lineHeight: 1,
            }}
          >
            {label}
          </motion.span>
          {count > 0 && (
            <span
              className="text-lg font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Get Ready
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
