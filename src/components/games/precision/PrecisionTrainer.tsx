'use client';

import { useEffect } from 'react';
import { usePrecisionTrainer } from '@/hooks/usePrecisionTrainer';
import { useGamesStore } from '@/store/useGamesStore';
import ProgressDashboard from './ProgressDashboard';
import KeyboardHeatmap from './KeyboardHeatmap';
import ExerciseCard from './ExerciseCard';
import AdaptiveTypingArea from './AdaptiveTypingArea';
import { motion } from 'framer-motion';

export default function PrecisionTrainer() {
  const {
    sessionActive,
    exerciseText,
    weakKeys,
    keyStats,
    wpm,
    accuracy,
    loadSave,
    startExercise,
    endExercise,
  } = usePrecisionTrainer();

  const { precisionSave, updatePrecisionSave, recordGameResult, unlockAchievement } = useGamesStore();

  // Load stats from the Zustand games save state on mount
  useEffect(() => {
    loadSave(precisionSave.keyStats || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precisionSave]);

  const handleComplete = (
    finalWpm: number,
    finalAccuracy: number,
    typedKeyStats: Record<string, { count: number; errors: number; totalMs: number }>
  ) => {
    // Record game result
    recordGameResult({
      gameId: 'precision-trainer',
      score: Math.round(finalWpm * 100 * (finalAccuracy / 100)),
      wpm: finalWpm,
      accuracy: finalAccuracy,
      combo: 0,
      duration: 30, // average duration
      difficulty: 'medium',
      timestamp: Date.now(),
    });

    // Save and update stats
    const totalSessions = (precisionSave.sessions || 0) + 1;
    
    // Merge stats
    const newMergedStats = { ...precisionSave.keyStats };
    Object.entries(typedKeyStats).forEach(([key, val]) => {
      if (!newMergedStats[key]) {
        newMergedStats[key] = { count: 0, errors: 0, totalMs: 0 };
      }
      newMergedStats[key].count += val.count;
      newMergedStats[key].errors += val.errors;
      newMergedStats[key].totalMs += val.totalMs;
    });

    updatePrecisionSave({
      sessions: totalSessions,
      keyStats: newMergedStats,
    });

    // End exercise hook logic (recalculates weak keys)
    endExercise(finalWpm, finalAccuracy, typedKeyStats);

    // Achievements check
    unlockAchievement({ id: 'precision-first', title: 'First Session', description: 'Complete your first training session.', icon: '⌨️', gameId: 'precision-trainer' });
    if (totalSessions >= 10) {
      unlockAchievement({ id: 'precision-10-sessions', title: 'Dedicated Learner', description: 'Complete 10 training sessions.', icon: '📈', gameId: 'precision-trainer' });
    }
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1e3d 0%, #020409 60%)' }}
    >
      <div className="max-w-2xl w-full flex flex-col items-center gap-8 z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-5xl">🎯</span>
          <h1 className="text-3xl font-black text-white mt-3">Precision Trainer</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Intelligent typing coach that dynamically adapts practice drills to target your weakest keys
          </p>
        </motion.div>

        {!sessionActive ? (
          <>
            {/* Summary statistics & heatmap dashboard */}
            <ProgressDashboard
              sessions={precisionSave.sessions || 0}
              avgWpm={wpm}
              avgAccuracy={accuracy}
              weakKeys={weakKeys}
            />

            <KeyboardHeatmap keyStats={keyStats} />

            <button
              onClick={startExercise}
              id="precision-start-btn"
              className="h-12 px-8 rounded-full font-bold text-white transition-all duration-200 hover:scale-105 shadow-lg focus-ring animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              }}
            >
              Start Targeted Practice Drill
            </button>
          </>
        ) : (
          <>
            {/* Active typing drill display */}
            <ExerciseCard weakKeys={weakKeys} />

            <AdaptiveTypingArea text={exerciseText} onComplete={handleComplete} />

            <button
              onClick={() => handleComplete(0, 0, {})}
              id="precision-cancel-btn"
              className="h-10 px-6 rounded-full font-semibold border transition-all duration-200 hover:scale-105 focus-ring"
              style={{
                background: 'var(--color-surface2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              Cancel Drill
            </button>
          </>
        )}
      </div>
    </div>
  );
}
