'use client';

import { useLearnStore, getActiveExercise } from '@/store/useLearnStore';
import { ACHIEVEMENTS, LEVELS, Lesson } from '@/data/lessons';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonCompleteModalProps {
  onContinue: () => void;
  onRetry: () => void;
  onBackToDashboard: () => void;
  onStartLesson?: (level: number, lesson: Lesson) => void;
}

export default function LessonCompleteModal({ onContinue, onRetry, onBackToDashboard, onStartLesson }: LessonCompleteModalProps) {
  const {
    activeLevel, activeLesson, activeExerciseIndex, sessionStats, sessionStatus,
    newlyUnlockedAchievements, dismissNewAchievements,
  } = useLearnStore();

  const currentLevel = activeLevel ? LEVELS.find(l => l.id === activeLevel) : null;
  const currentLessonIndex = currentLevel?.lessons.findIndex(l => l.id === activeLesson?.id) ?? -1;
  const nextLessonInLevel = (currentLevel && currentLessonIndex >= 0 && currentLessonIndex + 1 < currentLevel.lessons.length)
    ? currentLevel.lessons[currentLessonIndex + 1]
    : null;

  const exercise = getActiveExercise(activeLesson, activeExerciseIndex);
  const isPassed = exercise
    ? sessionStats.accuracy >= exercise.minAccuracy &&
      (exercise.minWpm ? sessionStats.wpm >= exercise.minWpm : true)
    : false;

  const newAchs = ACHIEVEMENTS.filter(a => newlyUnlockedAchievements.includes(a.id));
  const isLessonComplete = sessionStatus === 'lesson-complete';

  if (sessionStatus !== 'exercise-complete' && sessionStatus !== 'lesson-complete') return null;

  const handleContinue = () => {
    dismissNewAchievements();
    if (isLessonComplete) {
      onBackToDashboard();
    } else {
      onContinue();
    }
  };

  const handleNextLesson = () => {
    dismissNewAchievements();
    if (nextLessonInLevel && activeLevel && onStartLesson) {
      onStartLesson(activeLevel, nextLessonInLevel);
    } else {
      onBackToDashboard();
    }
  };

  const handleRetry = () => {
    dismissNewAchievements();
    onRetry();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="complete-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)', backdropFilter: 'blur(16px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="glass w-full max-w-lg p-8 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="text-5xl mb-3">
              {isLessonComplete ? '🏅' : isPassed ? '✅' : '⚠️'}
            </div>
            <h2 className="text-2xl font-black gradient-text">
              {isLessonComplete
                ? 'Lesson Complete!'
                : isPassed
                  ? 'Exercise Passed!'
                  : 'Keep Practicing!'}
            </h2>
            {!isPassed && exercise && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                You need {exercise.minAccuracy}% accuracy
                {exercise.minWpm ? ` and ${exercise.minWpm} WPM` : ''} to pass.
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'WPM', value: sessionStats.wpm, icon: '⚡', color: 'var(--color-primary)' },
              { label: 'Accuracy', value: `${sessionStats.accuracy}%`, icon: '🎯', color: sessionStats.accuracy >= 90 ? 'var(--color-correct)' : 'var(--color-extra)' },
              { label: 'Errors', value: sessionStats.errors, icon: '❌', color: sessionStats.errors === 0 ? 'var(--color-correct)' : 'var(--color-incorrect)' },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-4 rounded-xl"
                style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xl font-black tabular-nums" style={{ color }}>{value}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Time */}
          <div
            className="flex items-center justify-center gap-2 text-sm py-2 rounded-lg"
            style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            <span>⏱</span>
            <span>Time: <strong>{Math.round(sessionStats.elapsedSeconds)}s</strong></span>
          </div>

          {/* New achievements */}
          {newAchs.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                🎉 Achievements Unlocked!
              </h3>
              {newAchs.map(a => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 rounded-xl animate-fade-in-up"
                  style={{
                    background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                  }}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--color-accent)' }}>{a.title}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 focus-ring"
              style={{
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              🔄 Retry
            </button>
            {!isLessonComplete && isPassed && (
              <button
                onClick={handleContinue}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                }}
              >
                Next Exercise →
              </button>
            )}
            {isLessonComplete && nextLessonInLevel && onStartLesson && (
              <button
                onClick={handleNextLesson}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                }}
              >
                Next Lesson →
              </button>
            )}
            <button
              onClick={onBackToDashboard}
              className={`${isLessonComplete && nextLessonInLevel ? 'px-4' : 'flex-1'} py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 focus-ring`}
              style={{
                background: (isLessonComplete && nextLessonInLevel)
                  ? 'var(--color-surface2)'
                  : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                color: (isLessonComplete && nextLessonInLevel) ? 'var(--color-text)' : '#fff',
                border: (isLessonComplete && nextLessonInLevel) ? '1px solid var(--color-border)' : undefined,
              }}
            >
              🏠 Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
