'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameAchievement } from '@/types';
import { useGamesStore } from '@/store/useGamesStore';

export function AchievementToast() {
  const { pendingAchievement, clearPendingAchievement } = useGamesStore();

  useEffect(() => {
    if (!pendingAchievement) return;
    const t = setTimeout(clearPendingAchievement, 4000);
    return () => clearTimeout(t);
  }, [pendingAchievement, clearPendingAchievement]);

  return (
    <AnimatePresence>
      {pendingAchievement && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 right-6 z-[100] max-w-xs w-full"
          onClick={clearPendingAchievement}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface2))',
              border: '1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent)',
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              {pendingAchievement.icon}
            </div>
            {/* Text */}
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary)' }}>
                🏆 Achievement Unlocked!
              </p>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>
                {pendingAchievement.title}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                {pendingAchievement.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementBadgeProps {
  achievement: GameAchievement;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const sizes = { sm: 'w-10 h-10 text-lg', md: 'w-14 h-14 text-2xl', lg: 'w-20 h-20 text-3xl' };

  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <div
        className={`${sizes[size]} rounded-xl flex items-center justify-center relative transition-all duration-300`}
        style={{
          background: isUnlocked
            ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
            : 'var(--color-surface2)',
          border: isUnlocked
            ? '1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)'
            : '1px solid var(--color-border)',
          filter: isUnlocked ? 'none' : 'grayscale(1) opacity(0.4)',
          boxShadow: isUnlocked ? '0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'none',
        }}
        title={achievement.description}
      >
        <span style={{ filter: isUnlocked ? 'none' : 'blur(2px)' }}>
          {achievement.icon}
        </span>
        {!isUnlocked && (
          <span className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: 'var(--color-text-subtle)' }}>🔒</span>
        )}
      </div>
      {size !== 'sm' && (
        <span
          className="text-xs font-semibold text-center leading-tight max-w-[80px]"
          style={{ color: isUnlocked ? 'var(--color-text)' : 'var(--color-text-subtle)' }}
        >
          {achievement.title}
        </span>
      )}
    </div>
  );
}
