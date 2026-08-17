'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Dashboard from '@/components/learn/Dashboard';
import PracticeArena from '@/components/learn/PracticeArena';
import LessonCompleteModal from '@/components/learn/LessonCompleteModal';
import { useLearnStore } from '@/store/useLearnStore';
import { LEVELS } from '@/data/lessons';
import { Lesson } from '@/data/lessons';
import { useEffect } from 'react';

export default function LearnPage() {
  const {
    hydrate, activeLesson, activeLevel, activeExerciseIndex,
    sessionStatus, startLesson, nextExercise, completeLesson,
    resetSession, sessionStats,
  } = useLearnStore();

  const [view, setView] = useState<'dashboard' | 'practice'>('dashboard');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleStartLesson = useCallback((level: number, lesson: Lesson) => {
    startLesson(level, lesson);
    setView('practice');
  }, [startLesson]);

  const handleRetry = useCallback(() => {
    if (!activeLesson || !activeLevel) return;
    startLesson(activeLevel, activeLesson);
  }, [activeLesson, activeLevel, startLesson]);

  const handleContinue = useCallback(() => {
    if (sessionStatus === 'exercise-complete') {
      nextExercise();
    }
  }, [sessionStatus, nextExercise]);

  const handleBackToDashboard = useCallback(() => {
    resetSession();
    setView('dashboard');
  }, [resetSession]);

  // Auto-complete lesson when all exercises done
  const handleLessonComplete = useCallback(() => {
    completeLesson(sessionStats.wpm, sessionStats.accuracy, sessionStats.elapsedSeconds);
  }, [completeLesson, sessionStats]);

  // Watch for exercise-complete → check if it's the last
  useEffect(() => {
    if (sessionStatus === 'exercise-complete' && activeLesson) {
      const isLast = activeExerciseIndex >= activeLesson.exercises.length - 1;
      if (isLast) {
        handleLessonComplete();
      }
    }
  }, [sessionStatus, activeExerciseIndex, activeLesson, handleLessonComplete]);

  // Current level info
  const currentLevelData = activeLevel ? LEVELS.find(l => l.id === activeLevel) : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {view === 'dashboard' ? (
          <Dashboard onStartLesson={handleStartLesson} />
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {/* Back nav + lesson header */}
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors focus-ring rounded-lg px-2 py-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                ← Back to Dashboard
              </button>
              {activeLesson && currentLevelData && (
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${currentLevelData.color}22`,
                    border: `1px solid ${currentLevelData.color}44`,
                    color: currentLevelData.color,
                  }}
                >
                  <span>{currentLevelData.icon}</span>
                  Level {currentLevelData.id} — {activeLesson.title}
                </div>
              )}
            </div>

            {/* Exercise tracker */}
            {activeLesson && (
              <div className="flex items-center gap-2">
                {activeLesson.exercises.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i < activeExerciseIndex
                        ? 'var(--color-correct)'
                        : i === activeExerciseIndex
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                    }}
                  />
                ))}
                <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                  {activeExerciseIndex + 1}/{activeLesson.exercises.length}
                </span>
              </div>
            )}

            {/* Tips panel */}
            {activeLesson && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  💡 Tips
                </div>
                <ul className="list-disc list-inside space-y-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {activeLesson.tips.map((tip, i) => (
                    <li key={i} className="text-xs">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice arena */}
            <PracticeArena />
          </div>
        )}
      </main>
      <Footer />

      {/* Lesson complete / exercise complete modal */}
      {(sessionStatus === 'exercise-complete' || sessionStatus === 'lesson-complete') && (
        <LessonCompleteModal
          onContinue={handleContinue}
          onRetry={handleRetry}
          onBackToDashboard={handleBackToDashboard}
          onStartLesson={handleStartLesson}
        />
      )}
    </>
  );
}
