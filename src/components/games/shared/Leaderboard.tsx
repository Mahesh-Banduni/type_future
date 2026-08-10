'use client';

import { motion } from 'framer-motion';
import { LeaderboardEntry, GameId } from '@/types';
import { useGamesStore } from '@/store/useGamesStore';

const GAME_LABELS: Record<GameId, string> = {
  'cosmic-word-defense': '🚀 Cosmic',
  'arcane-quest': '🧙 Arcane',
  'precision-trainer': '⌨️ Precision',
};

interface LeaderboardProps {
  gameId?: GameId;
  entries?: LeaderboardEntry[];
  maxEntries?: number;
}

export default function Leaderboard({ gameId, entries, maxEntries = 10 }: LeaderboardProps) {
  const { getLeaderboardForGame } = useGamesStore();
  const data = entries ?? (gameId ? getLeaderboardForGame(gameId) : []);
  const displayData = data.slice(0, maxEntries);

  const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

  if (displayData.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-3">
        <span className="text-4xl">🏆</span>
        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>No scores yet</p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Be the first to set a high score!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-2">
        {displayData.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: i < 3
                ? `color-mix(in srgb, ${rankColors[i]} 8%, var(--color-surface2))`
                : 'var(--color-surface2)',
              border: `1px solid ${i < 3 ? `color-mix(in srgb, ${rankColors[i]} 20%, transparent)` : 'var(--color-border)'}`,
            }}
          >
            {/* Rank */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{
                background: i < 3
                  ? `linear-gradient(135deg, ${rankColors[i]}, ${rankColors[i]}99)`
                  : 'var(--color-border)',
                color: i < 3 ? '#000' : 'var(--color-text-muted)',
              }}
            >
              {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
            </div>

            {/* Name + game tag */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                {entry.playerName}
              </p>
              {!gameId && (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {GAME_LABELS[entry.gameId]}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-shrink-0 text-right">
              <div>
                <p className="text-sm font-black tabular-nums" style={{ color: 'var(--color-primary)' }}>
                  {entry.score.toLocaleString()}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>pts</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-text)' }}>
                  {entry.wpm}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>WPM</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-correct)' }}>
                  {entry.accuracy}%
                </p>
                <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>acc</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
