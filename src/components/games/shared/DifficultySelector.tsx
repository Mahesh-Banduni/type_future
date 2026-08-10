'use client';

import { motion } from 'framer-motion';
import { GameDifficulty } from '@/types';

interface GameDifficultySelectorProps {
  value: GameDifficulty;
  onChange: (d: GameDifficulty) => void;
  includeEndless?: boolean;
}

const DIFFICULTIES: { id: GameDifficulty; label: string; desc: string; icon: string; color: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Short words, slower pace', icon: '🌱', color: '#4ade80' },
  { id: 'medium', label: 'Medium', desc: 'Mixed words, normal speed', icon: '⚡', color: '#fbbf24' },
  { id: 'hard', label: 'Hard', desc: 'Long words, fast pace', icon: '🔥', color: '#f97316' },
  { id: 'endless', label: 'Endless', desc: 'Infinite waves, max challenge', icon: '♾️', color: '#c084fc' },
];

export default function GameDifficultySelector({ value, onChange, includeEndless = true }: GameDifficultySelectorProps) {
  const options = includeEndless ? DIFFICULTIES : DIFFICULTIES.slice(0, 3);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {options.map((d) => {
        const isActive = value === d.id;
        return (
          <motion.button
            key={d.id}
            id={`difficulty-${d.id}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(d.id)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 focus-ring"
            style={{
              background: isActive
                ? `color-mix(in srgb, ${d.color} 15%, var(--color-surface2))`
                : 'var(--color-surface2)',
              border: `2px solid ${isActive ? d.color : 'var(--color-border)'}`,
              boxShadow: isActive ? `0 0 16px color-mix(in srgb, ${d.color} 30%, transparent)` : 'none',
            }}
          >
            <span className="text-2xl">{d.icon}</span>
            <div className="text-center">
              <p
                className="font-bold text-sm"
                style={{ color: isActive ? d.color : 'var(--color-text)' }}
              >
                {d.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {d.desc}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
