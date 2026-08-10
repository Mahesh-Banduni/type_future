'use client';

import { motion } from 'framer-motion';

interface ProgressDashboardProps {
  sessions: number;
  avgWpm: number;
  avgAccuracy: number;
  weakKeys: string[];
}

export default function ProgressDashboard({ sessions, avgWpm, avgAccuracy, weakKeys }: ProgressDashboardProps) {
  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions Completed', value: sessions, icon: '📈', color: 'var(--color-primary)' },
          { label: 'Average WPM', value: avgWpm ? `${avgWpm} WPM` : '—', icon: '⚡', color: '#fbbf24' },
          { label: 'Average Accuracy', value: avgAccuracy ? `${avgAccuracy}%` : '—', icon: '🎯', color: 'var(--color-correct)' },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 p-4 rounded-2xl text-center"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xl font-black tabular-nums" style={{ color }}>{value}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div
        className="p-5 rounded-2xl flex flex-col gap-3"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Learning Insights
        </h3>
        {weakKeys.length > 0 ? (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Our adaptive engine has detected that your keystroke latency and errors are higher on keys:{' '}
            <span className="font-bold text-white uppercase">{weakKeys.join(', ')}</span>.
            Try typing these keys with uniform force and focus on accuracy over raw speed during drills.
          </p>
        ) : (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Complete your first targeted exercise session to allow the adaptive engine to construct a model of your typing strengths and weaknesses!
          </p>
        )}
      </div>
    </div>
  );
}
