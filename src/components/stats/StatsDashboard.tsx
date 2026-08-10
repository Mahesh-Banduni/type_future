'use client';

import { useStatsStore } from '@/store/useStatsStore';
import { formatTime } from '@/utils/wpm';

interface CardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
}

function StatCard({ label, value, icon, accent }: CardProps) {
  return (
    <div
      className="glass p-5 flex flex-col gap-2 theme-transition hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="text-2xl">{icon}</div>
      <div
        className="text-3xl font-black tabular-nums"
        style={{ color: accent ? 'var(--color-primary)' : 'var(--color-text)' }}
      >
        {value}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsDashboard() {
  const { stats, hydrated } = useStatsStore();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl" style={{ background: 'var(--color-surface)' }} />
        ))}
      </div>
    );
  }

  if (stats.totalTests === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>No tests yet</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Complete a typing test to see your statistics here.</p>
      </div>
    );
  }

  const cards: CardProps[] = [
    { icon: '🧪', label: 'Total Tests',        value: stats.totalTests,                          accent: false },
    { icon: '⚡', label: 'Average WPM',        value: stats.averageWpm,                          accent: true },
    { icon: '🏆', label: 'Best WPM',           value: stats.bestScore,                           accent: true },
    { icon: '📉', label: 'Lowest WPM',         value: stats.lowestWpm === Infinity ? '–' : stats.lowestWpm },
    { icon: '🎯', label: 'Avg Accuracy',       value: `${stats.averageAccuracy}%`,               accent: false },
    { icon: '⏱️', label: 'Total Time',         value: formatTime(stats.totalTypingTimeSeconds),  accent: false },
    { icon: '📝', label: 'Words Typed',        value: stats.totalWordsTyped.toLocaleString(),     accent: false },
    { icon: '🔤', label: 'Chars Typed',        value: stats.totalCharsTyped.toLocaleString(),    accent: false },
    { icon: '❌', label: 'Total Mistakes',     value: stats.totalMistakes.toLocaleString(),      accent: false },
    { icon: '🔥', label: 'Current Streak',     value: `${stats.currentStreak}d`,                 accent: true },
    { icon: '📅', label: 'Last Test',          value: stats.lastTestDate ?? '–',                 accent: false },
    { icon: '💎', label: 'Highest WPM',        value: stats.highestWpm,                          accent: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
