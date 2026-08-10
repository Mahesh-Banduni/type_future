'use client';

import { useTypingStore } from '@/store/useTypingStore';
import { formatTime } from '@/utils/wpm';

function StatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl theme-transition"
      style={{
        background: highlight ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'var(--color-surface)',
        border: `1px solid ${highlight ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'var(--color-border)'}`,
        minWidth: '80px',
      }}
    >
      <div
        className="text-2xl font-black tabular-nums"
        style={{ color: highlight ? 'var(--color-primary)' : 'var(--color-text)' }}
      >
        {value}
        {unit && <span className="text-sm font-medium ml-0.5" style={{ color: 'var(--color-text-muted)' }}>{unit}</span>}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
        {label}
      </div>
    </div>
  );
}

export default function LiveStats() {
  const { liveStats, status, timeRemaining } = useTypingStore();
  const { wpm, cpm, accuracy, errors } = liveStats;

  if (status === 'idle') {
    return (
      <div className="flex items-center justify-center gap-3 text-sm" style={{ color: 'var(--color-text-subtle)' }}>
        <span>Start typing to see live statistics</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
      {/* Timer — most prominent */}
      <StatCard
        label="time"
        value={formatTime(timeRemaining)}
        highlight={timeRemaining <= 10}
      />
      <StatCard label="wpm"      value={wpm}      highlight />
      <StatCard label="cpm"      value={cpm}      />
      <StatCard label="accuracy" value={accuracy} unit="%" />
      <StatCard label="errors"   value={errors}   />
    </div>
  );
}
