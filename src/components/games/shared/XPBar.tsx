'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
  level: number;
  compact?: boolean;
}

function xpForLevel(level: number): number {
  return level * level * 500;
}

export default function XPBar({ xp, level, compact = false }: XPBarProps) {
  const currentLevelXP = xpForLevel(level - 1);
  const nextLevelXP = xpForLevel(level);
  const progress = Math.min(1, (xp - currentLevelXP) / Math.max(1, nextLevelXP - currentLevelXP));

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
        >
          {level}
        </div>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface2)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
          >
            {level}
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>Level {level}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              {xp.toLocaleString()} XP
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {nextLevelXP.toLocaleString()} XP
        </p>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-surface2)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
