'use client';

import { motion } from 'framer-motion';
import { CosmicGameState } from '@/hooks/useCosmicGame';
import Link from 'next/link';

interface CosmicGameOverProps {
  state: CosmicGameState;
  onRestart: () => void;
  onSubmitScore: (name: string) => void;
  bestScore: number;
}

export default function CosmicGameOver({ state, onRestart, onSubmitScore, bestScore }: CosmicGameOverProps) {
  const isNewBest = state.score > bestScore;
  const grade = state.accuracy >= 95 ? 'S' : state.accuracy >= 85 ? 'A' : state.accuracy >= 70 ? 'B' : state.accuracy >= 50 ? 'C' : 'D';
  const gradeColors: Record<string, string> = { S: '#ffd700', A: '#4ade80', B: '#60a5fa', C: '#fbbf24', D: '#f87171' };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value.trim();
    if (name) onSubmitScore(name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0520, #1a0a4a, #0d1535)' }}
        >
          {/* Stars decoration */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: '#fff',
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
          <span className="text-5xl relative z-10">
            {state.lives > 0 ? '🏆' : '💥'}
          </span>
          <h2 className="text-2xl font-black text-white mt-2 relative z-10">
            {state.lives > 0 ? 'Mission Complete!' : 'Station Destroyed!'}
          </h2>
          {isNewBest && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-black relative z-10"
              style={{ background: '#ffd70022', border: '1px solid #ffd700', color: '#ffd700' }}
            >
              ⭐ NEW BEST SCORE!
            </motion.div>
          )}
        </div>

        {/* Stats grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Score', value: state.score.toLocaleString(), icon: '🚀', color: 'var(--color-primary)' },
              { label: 'Wave', value: state.wave, icon: '🌊', color: '#a78bfa' },
              { label: 'Kills', value: state.kills, icon: '💥', color: '#f97316' },
              { label: 'WPM', value: state.wpm, icon: '⚡', color: '#fbbf24' },
              { label: 'Accuracy', value: `${state.accuracy}%`, icon: '🎯', color: 'var(--color-correct)' },
              { label: 'Combo', value: `×${state.combo}`, icon: '🔥', color: '#fb7185' },
            ].map(({ label, value, icon, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
              >
                <span>{icon}</span>
                <span className="text-lg font-black tabular-nums" style={{ color }}>{value}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Grade */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Grade</span>
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                className="text-6xl font-black"
                style={{ color: gradeColors[grade], textShadow: `0 0 30px ${gradeColors[grade]}` }}
              >
                {grade}
              </motion.span>
            </div>
          </div>

          {/* Submit score form */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              name="name"
              maxLength={16}
              placeholder="Your name for leaderboard…"
              defaultValue="Anonymous"
              className="flex-1 h-10 px-3 rounded-xl text-sm font-semibold focus-ring outline-none"
              style={{
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <button
              type="submit"
              id="cosmic-submit-score-btn"
              className="h-10 px-4 rounded-xl text-sm font-bold text-white focus-ring transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              Submit
            </button>
          </form>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              id="cosmic-restart-btn"
              className="flex-1 h-11 rounded-xl font-bold text-white transition-all hover:scale-105 focus-ring"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              🔄 Play Again
            </button>
            <Link
              href="/games"
              id="cosmic-hub-btn"
              className="flex-1 h-11 rounded-xl font-semibold flex items-center justify-center transition-all hover:scale-105 focus-ring"
              style={{
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              🏠 Games Hub
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
