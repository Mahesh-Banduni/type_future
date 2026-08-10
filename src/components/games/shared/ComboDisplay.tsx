'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ComboDisplayProps {
  combo: number;
  multiplier?: number;
}

export default function ComboDisplay({ combo, multiplier }: ComboDisplayProps) {
  if (combo < 2) return null;

  const isHighCombo = combo >= 10;
  const isInsaneCombo = combo >= 25;

  const color = isInsaneCombo
    ? '#f97316'
    : isHighCombo
    ? '#fbbf24'
    : 'var(--color-primary)';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className="flex flex-col items-center"
      >
        <motion.span
          className="font-black tabular-nums"
          style={{
            fontSize: `clamp(1.5rem, ${Math.min(3 + combo * 0.05, 5)}rem, 5rem)`,
            color,
            textShadow: isHighCombo ? `0 0 20px ${color}` : 'none',
            lineHeight: 1,
          }}
          animate={isHighCombo ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {combo}x
        </motion.span>
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color }}
        >
          {isInsaneCombo ? '🔥 INSANE!' : isHighCombo ? '⚡ COMBO!' : 'COMBO'}
        </span>
        {multiplier && multiplier > 1 && (
          <span className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            ×{multiplier.toFixed(1)} score
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
