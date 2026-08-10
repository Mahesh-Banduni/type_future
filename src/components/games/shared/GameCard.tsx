'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameCardProps {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  difficulty: string;
  playTime: string;
  bestScore: number;
  href: string;
}

export default function GameCard({ title, desc, emoji, difficulty, playTime, bestScore, href }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="glass p-6 flex flex-col justify-between gap-4 h-full relative group transition-all duration-300"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
          <div className="flex flex-col gap-1 text-right">
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                color: 'var(--color-primary)',
              }}
            >
              {difficulty}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
              ⏱ {playTime}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {desc}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dashed" style={{ borderColor: 'var(--color-border)' }}>
        {bestScore > 0 ? (
          <div className="flex justify-between text-xs font-semibold">
            <span style={{ color: 'var(--color-text-muted)' }}>🏆 Personal Best</span>
            <span style={{ color: 'var(--color-primary)' }}>{bestScore.toLocaleString()} pts</span>
          </div>
        ) : (
          <div className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            No score recorded yet
          </div>
        )}

        <Link
          href={href}
          className="flex h-10 items-center justify-center rounded-xl font-bold text-white transition-all duration-200 group-hover:scale-[1.02] shadow focus-ring text-sm"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          }}
        >
          Play Game
        </Link>
      </div>
    </motion.div>
  );
}
