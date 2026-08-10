'use client';

import { useMemo } from 'react';
import { useStatsStore } from '@/store/useStatsStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ProgressGraphs() {
  const { history, hydrated } = useStatsStore();

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    // Show up to the last 15 tests, sorted oldest to newest for the graph
    return [...history]
      .slice(0, 15)
      .reverse()
      .map((item, index) => ({
        index: index + 1,
        wpm: item.wpm,
        accuracy: item.accuracy,
        date: new Date(item.timestamp).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      }));
  }, [history]);

  if (!hydrated) {
    return (
      <div className="h-[300px] w-full rounded-2xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
    );
  }

  if (chartData.length === 0) {
    return null; // Don't show empty graphs if there's no data
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* WPM Trend */}
      <div className="glass p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          WPM Trend (Last {chartData.length} Tests)
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface2)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                name="WPM"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
                activeDot={{ r: 6, fill: 'var(--color-accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accuracy Trend */}
      <div className="glass p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          Accuracy Trend (%)
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface2)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy %"
                stroke="var(--color-accent)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', r: 4 }}
                activeDot={{ r: 6, fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
