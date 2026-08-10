'use client';

import { useTypingStore } from '@/store/useTypingStore';

interface Props {
  className?: string;
}

export default function ProgressBar({ className = '' }: Props) {
  const { liveStats, status } = useTypingStore();
  const { progress } = liveStats;

  return (
    <div
      className={`relative h-1.5 rounded-full overflow-hidden ${className}`}
      style={{ background: 'var(--color-surface2)' }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Typing progress"
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          boxShadow: status === 'running' ? '0 0 8px color-mix(in srgb, var(--color-primary) 60%, transparent)' : 'none',
        }}
      />
    </div>
  );
}
