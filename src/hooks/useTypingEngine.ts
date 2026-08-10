'use client';

import { useCallback, useRef } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { computeCharStates, countByState } from '@/utils/charState';
import { calcWpm, calcCpm, calcAccuracy } from '@/utils/wpm';
import { LiveStats } from '@/types';

export function useTypingEngine() {
  const { paragraphText, status, startTime, updateTyped, startTest, finishTest } =
    useTypingStore();
  const { soundEnabled, errorSoundEnabled } = useSettingsStore();
  const lastTypedLen = useRef(0);
  const soundRef = useRef<((isError: boolean) => void) | null>(null);

  // Inject sound fn from useSoundEngine (optional)
  const setSoundFn = useCallback((fn: (isError: boolean) => void) => {
    soundRef.current = fn;
  }, []);

  const handleInput = useCallback(
    (newTyped: string) => {
      // Auto-start on first keystroke
      if (status === 'idle' && newTyped.length > 0) {
        startTest();
      }
      if (status === 'finished') return;

      // Clamp: don't let extra chars grow beyond paragraph + 10 chars
      const clamped = newTyped.slice(0, paragraphText.length + 10);

      // Sound feedback
      if (soundRef.current && clamped.length > lastTypedLen.current) {
        const idx = clamped.length - 1;
        const isError = clamped[idx] !== paragraphText[idx];
        if (soundEnabled || (errorSoundEnabled && isError)) {
          soundRef.current(isError);
        }
      }
      lastTypedLen.current = clamped.length;

      const charData = computeCharStates(paragraphText, clamped);
      const counts = countByState(charData);
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;

      const totalTyped = counts.correct + counts.incorrect + counts.extra;
      const wpm = calcWpm(counts.correct, elapsed);
      const cpm = calcCpm(counts.correct, elapsed);
      const accuracy = calcAccuracy(counts.correct, totalTyped);

      const stats: LiveStats = {
        wpm,
        cpm,
        accuracy,
        errors: counts.incorrect + counts.extra,
        correctChars: counts.correct,
        incorrectChars: counts.incorrect + counts.extra,
        progress: Math.min(100, Math.round((clamped.length / paragraphText.length) * 100)),
        timeRemaining: useTypingStore.getState().timeRemaining,
        wordsTyped: Math.floor(counts.correct / 5),
      };

      updateTyped(clamped, charData, stats);

      // Finish if user typed the entire paragraph
      if (clamped.length >= paragraphText.length && paragraphText.length > 0) {
        // Check all chars correct to auto-complete
        if (counts.untyped === 0 && counts.current === 0) {
          finishTest();
        }
      }
    },
    [status, paragraphText, startTime, startTest, finishTest, updateTyped, soundEnabled, errorSoundEnabled]
  );

  return { handleInput, setSoundFn };
}
