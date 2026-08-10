'use client';

import { useCallback, useState } from 'react';
import { generatePrecisionExercise } from '@/data/gameWords';

export interface KeyMetrics {
  key: string;
  count: number;
  errors: number;
  totalMs: number;
}

export function usePrecisionTrainer() {
  const [sessionActive, setSessionActive] = useState(false);
  const [exerciseText, setExerciseText] = useState('');
  const [weakKeys, setWeakKeys] = useState<string[]>([]);
  const [keyStats, setKeyStats] = useState<Record<string, { count: number; errors: number; totalMs: number }>>({});
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Load key stats from store/save
  const loadSave = useCallback((savedStats: Record<string, { count: number; errors: number; totalMs: number }>) => {
    setKeyStats(savedStats);
    // Determine initial weak keys
    const sorted = Object.entries(savedStats)
      .map(([key, data]) => {
        const errorRate = data.count > 0 ? data.errors / data.count : 0;
        const avgSpeed = data.count > 0 ? data.totalMs / data.count : 0;
        return { key, score: errorRate * 10 + avgSpeed / 500 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.key);
    setWeakKeys(sorted.length > 0 ? sorted : ['q', 'z', 'p']);
  }, []);

  // Generate a customized adaptive exercise targeting weak keys
  const startExercise = useCallback(() => {
    const targets = weakKeys.length > 0 ? weakKeys : ['a', 's', 'd', 'f'];
    const generated = generatePrecisionExercise(targets, 15);
    setExerciseText(generated);
    setSessionActive(true);
  }, [weakKeys]);

  const endExercise = useCallback((
    finalWpm: number,
    finalAccuracy: number,
    typedKeyStats: Record<string, { count: number; errors: number; totalMs: number }>
  ) => {
    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
    setSessionActive(false);

    // Merge session stats into keyStats
    setKeyStats((prev) => {
      const merged = { ...prev };
      Object.entries(typedKeyStats).forEach(([key, val]) => {
        if (!merged[key]) {
          merged[key] = { count: 0, errors: 0, totalMs: 0 };
        }
        merged[key].count += val.count;
        merged[key].errors += val.errors;
        merged[key].totalMs += val.totalMs;
      });

      // Recalculate weak keys (top 5 keys with highest error rate/slowest response)
      const sorted = Object.entries(merged)
        .map(([k, data]) => {
          const errorRate = data.count > 0 ? data.errors / data.count : 0;
          const avgSpeed = data.count > 0 ? data.totalMs / data.count : 0;
          // Combine metrics: error rate is weighted heavily, avg latency also counts
          return { key: k, score: errorRate * 15 + avgSpeed / 300 };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((entry) => entry.key);

      setWeakKeys(sorted.length > 0 ? sorted : ['q', 'z', 'p']);
      return merged;
    });
  }, []);

  return {
    sessionActive,
    exerciseText,
    weakKeys,
    keyStats,
    wpm,
    accuracy,
    loadSave,
    startExercise,
    endExercise,
  };
}
