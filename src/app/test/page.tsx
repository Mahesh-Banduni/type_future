'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TypingArea from '@/components/typing/TypingArea';
import LiveStats from '@/components/typing/LiveStats';
import ProgressBar from '@/components/typing/ProgressBar';
import ResultModal from '@/components/results/ResultModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStatsStore } from '@/store/useStatsStore';
import { useParagraphEngine } from '@/hooks/useParagraphEngine';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTimer } from '@/hooks/useTimer';
import { useSoundEngine } from '@/hooks/useSoundEngine';
import { TestResult } from '@/types';
import { countByState, markMissed } from '@/utils/charState';
import { IoReload } from 'react-icons/io5';
import { ArrowRight } from 'lucide-react';

export default function TestPage() {
  const {
    paragraphId,
    paragraphText,
    difficulty,
    duration,
    status,
    liveStats,
    charData,
    setParagraph,
    setDifficulty,
    setDuration,
    resetTest,
  } = useTypingStore();

  const settings = useSettingsStore();
  const { recordResult } = useStatsStore();
  const { getNextParagraph } = useParagraphEngine();
  const { playCompletionSound } = useSoundEngine();
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);

  // Sync settings configuration down to typing store
  useEffect(() => {
    if (settings.hydrated) {
      setDifficulty(settings.difficulty);
      setDuration(settings.duration);
    }
  }, [settings.hydrated, settings.difficulty, settings.duration, setDifficulty, setDuration]);

  // Load a new paragraph based on current settings difficulty
  const handleLoadNext = useCallback(async () => {
    setLoading(true);
    setCurrentResult(null);
    resetTest();
    try {
      const p = await getNextParagraph(settings.difficulty);
      setParagraph(p.id, p.text, settings.difficulty);
    } catch {
      // Fallback in case of unexpected error
      setParagraph(1, 'The quick brown fox jumps over the lazy dog.', settings.difficulty);
    } finally {
      setLoading(false);
    }
  }, [settings.difficulty, getNextParagraph, setParagraph, resetTest]);

  // Initial load
  useEffect(() => {
    if (settings.hydrated) {
      Promise.resolve().then(() => {
        handleLoadNext();
      });
    }
  }, [settings.hydrated, settings.difficulty, handleLoadNext]);

  // Handle countdown timer tick
  useTimer();

  // Handle test completion logic
  useEffect(() => {
    if (status === 'finished' && !currentResult) {
      // Save stats & trigger completions sound
      if (settings.completionSoundEnabled) {
        playCompletionSound();
      }

      // Compute final exact counts (mark all untyped as missed)
      const finalChars = markMissed([...charData]);
      const counts = countByState(finalChars);

      const resultEntry: TestResult = {
        wpm: liveStats.wpm,
        grossWpm: liveStats.wpm, // Fallback if no specific calc
        netWpm: Math.max(0, liveStats.wpm - liveStats.errors),
        cpm: liveStats.cpm,
        accuracy: liveStats.accuracy,
        correctChars: counts.correct,
        incorrectChars: counts.incorrect,
        extraChars: counts.extra,
        missedChars: counts.missed,
        totalChars: paragraphText.length,
        totalWords: liveStats.wordsTyped,
        errors: liveStats.errors,
        duration: settings.duration,
        difficulty: settings.difficulty,
        paragraphId,
        timestamp: Date.now(),
      };

      recordResult(resultEntry);
      Promise.resolve().then(() => {
        setCurrentResult(resultEntry);
      });
    }
  }, [
    status,
    currentResult,
    charData,
    paragraphId,
    paragraphText,
    liveStats,
    settings.duration,
    settings.difficulty,
    settings.completionSoundEnabled,
    playCompletionSound,
    recordResult,
  ]);

  // Restart logic
  const handleRestart = useCallback(() => {
    setCurrentResult(null);
    resetTest();
  }, [resetTest]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewParagraph: handleLoadNext,
    onRestart: handleRestart,
  });


  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-center py-12 gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoadingSpinner size="lg" />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Preparing your test...
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Live stats progress header */}
            <div className="flex items-center justify-between flex-wrap gap-4 px-1">
              <span className="text-sm font-bold capitalize" style={{ color: 'var(--color-text-muted)' }}>
                {difficulty} difficulty · {duration}s
              </span>
              <LiveStats />
            </div>

            {/* Typing Canvas */}
            <div className="relative">
              <TypingArea />
            </div>

            {/* Completion Progress Bar */}
            <ProgressBar className="my-2" />

            {/* Auxiliary actions row */}
            <div className="flex items-center justify-center gap-3">
              <button
                id="test-restart-btn"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Restart current test"
              >
                <IoReload className='pt-0.5 w-4 h-4'></IoReload>
                Restart
              </button>
              <button
                id="test-next-btn"
                onClick={handleLoadNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Load next random paragraph"
              >
                New Text
                <ArrowRight className='pt-0.5 w-4 h-4'></ArrowRight>
              </button>
            </div>
          </div>
        )}

        {/* Result summary screen overlays */}
        {currentResult && (
          <ResultModal
            result={currentResult}
            onRetry={handleRestart}
            onNewTest={handleLoadNext}
            onClose={() => {
              setCurrentResult(null);
              handleLoadNext();
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
