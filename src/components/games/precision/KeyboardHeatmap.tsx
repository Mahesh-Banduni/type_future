'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface KeyboardHeatmapProps {
  keyStats: Record<string, { count: number; errors: number; totalMs: number }>;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function KeyboardHeatmap({ keyStats }: KeyboardHeatmapProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const getKeyColor = (key: string) => {
    const stats = keyStats[key];
    if (!stats || stats.count === 0) return 'var(--color-surface2)';

    const errorRate = stats.errors / stats.count;
    const avgLatency = stats.totalMs / stats.count;

    // Weight error rate and speed to calculate heat (0 to 1)
    const heat = Math.min(1, errorRate * 1.5 + Math.max(0, avgLatency - 150) / 450);

    // Green to yellow to red interpolation
    if (heat < 0.3) return 'color-mix(in srgb, var(--color-correct) 35%, var(--color-surface2))';
    if (heat < 0.6) return 'color-mix(in srgb, #fbbf24 35%, var(--color-surface2))';
    return 'color-mix(in srgb, var(--color-incorrect) 45%, var(--color-surface2))';
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className="p-6 rounded-2xl w-full max-w-2xl"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Precision Keyboard Heatmap
        </h3>

        <div className="flex flex-col gap-2">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex justify-center gap-1.5"
              style={{
                paddingLeft: rowIdx === 1 ? '1.5rem' : rowIdx === 2 ? '3rem' : '0',
              }}
            >
              {row.map((key) => {
                const stats = keyStats[key];
                const color = getKeyColor(key);

                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => stats && setSelectedKey(selectedKey === key ? null : key)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm uppercase transition-all duration-200 border cursor-pointer focus-ring"
                    style={{
                      background: color,
                      borderColor: 'var(--color-border)',
                      color: stats && stats.count > 0 ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {key}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Selected key detailed popover */}
        {selectedKey && keyStats[selectedKey] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl text-center text-xs"
            style={{
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
            }}
          >
            <p className="font-bold text-sm uppercase" style={{ color: 'var(--color-primary)' }}>
              Key: {selectedKey}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>Keystrokes</p>
                <p className="font-bold text-sm">{keyStats[selectedKey].count}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>Accuracy</p>
                <p className="font-bold text-sm text-emerald-400">
                  {Math.round((1 - keyStats[selectedKey].errors / keyStats[selectedKey].count) * 100)}%
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>Avg Speed</p>
                <p className="font-bold text-sm">
                  {Math.round(keyStats[selectedKey].totalMs / keyStats[selectedKey].count)}ms
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
