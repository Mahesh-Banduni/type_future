'use client';

import { Difficulty } from '@/types';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';

const DIFFICULTIES: { value: Difficulty; label: string; emoji: string }[] = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'medium',   label: 'Medium',   emoji: '⚡' },
  { value: 'master',   label: 'Master',   emoji: '🔥' },
];

interface Props {
  onChange?: (d: Difficulty) => void;
}

export default function DifficultySelector({ onChange }: Props) {
  const { status } = useTypingStore();
  const { difficulty, setDifficulty } = useSettingsStore();

  const handleSelect = (d: Difficulty) => {
    if (status === 'running') return;
    setDifficulty(d);
    onChange?.(d);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-surface2)' }}>
      {DIFFICULTIES.map(({ value, label, emoji }) => {
        const isActive = difficulty === value;
        return (
          <button
            key={value}
            id={`difficulty-${value}`}
            onClick={() => handleSelect(value)}
            disabled={status === 'running'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isActive ? 'var(--color-primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
              boxShadow: isActive ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
            }}
            aria-label={`Set difficulty to ${label}`}
            aria-pressed={isActive}
          >
            <span>{emoji}</span>
            <span className="hidden sm:block">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
