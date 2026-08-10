'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useLearnStore, getActiveExercise } from '@/store/useLearnStore';
import { getKeyInfo } from '@/data/lessons';
import { Finger } from '@/data/lessons';
import VirtualKeyboard from './VirtualKeyboard';
import HandGuide from './HandGuide';

function calcWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}
function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export default function PracticeArena() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    activeLesson, activeExerciseIndex, typedText, sessionStats, sessionStatus,
    feedback, updateTyped, completeExercise, setFeedback,
  } = useLearnStore();

  const exercise = getActiveExercise(activeLesson, activeExerciseIndex);

  const [activeFinger, setActiveFinger] = useState<Finger | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Derive current char
  const currentCharIndex = typedText.length;
  const currentChar = exercise?.text[currentCharIndex] ?? null;
  const activeKey = currentChar ? currentChar.toLowerCase() : null;

  // Update finger guide when character changes
  useEffect(() => {
    if (currentChar) {
      const info = getKeyInfo(currentChar);
      setActiveFinger(info?.finger ?? null);
    } else {
      setActiveFinger(null);
    }
  }, [currentChar]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [exercise?.id]);

  const handleInput = useCallback((newTyped: string) => {
    if (!exercise || sessionStatus === 'exercise-complete') return;

    // Clamp to exercise text length
    const clamped = newTyped.slice(0, exercise.text.length);

    // Start timer on first keystroke
    if (!startTimeRef.current && clamped.length > 0) {
      startTimeRef.current = Date.now();
    }

    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;

    // Calculate stats
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < clamped.length; i++) {
      if (clamped[i] === exercise.text[i]) correct++;
      else errors++;
    }
    const accuracy = calcAccuracy(correct, clamped.length);
    const wpm = calcWpm(correct, elapsed);

    // Flash pressed key
    const lastChar = clamped[clamped.length - 1];
    if (lastChar && clamped.length > typedText.length) {
      setPressedKey(lastChar.toLowerCase());
      setTimeout(() => setPressedKey(null), 120);

      // Incorrect finger feedback
      const expected = exercise.text[clamped.length - 1];
      if (lastChar !== expected) {
        const info = getKeyInfo(expected);
        if (info) {
          setFeedback(`⚠️ Wrong key! Use your ${info.finger.replace(/-/g, ' ')} for "${expected === ' ' ? 'Space' : expected}"`);
        } else {
          setFeedback('⚠️ Incorrect character!');
        }
      } else {
        setFeedback('');
      }
    }

    const stats = {
      wpm,
      accuracy,
      errors,
      correctChars: correct,
      totalTyped: clamped.length,
      startTime: startTimeRef.current,
      elapsedSeconds: elapsed,
    };

    updateTyped(clamped, stats);

    // Auto-complete when fully typed
    if (clamped.length >= exercise.text.length) {
      completeExercise(stats);
    }
  }, [exercise, sessionStatus, typedText.length, updateTyped, completeExercise, setFeedback]);

  if (!exercise) return null;

  const progress = exercise.text.length > 0
    ? Math.min(100, Math.round((typedText.length / exercise.text.length) * 100))
    : 0;

  const isComplete = sessionStatus === 'exercise-complete';

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Exercise header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            {exercise.title}
          </h3>
          <div className="flex gap-4 text-sm font-semibold tabular-nums">
            <span style={{ color: 'var(--color-primary)' }}>{sessionStats.wpm} WPM</span>
            <span style={{ color: sessionStats.accuracy >= 90 ? 'var(--color-correct)' : sessionStats.accuracy >= 75 ? 'var(--color-extra)' : 'var(--color-incorrect)' }}>
              {sessionStats.accuracy}%
            </span>
            {sessionStats.errors > 0 && (
              <span style={{ color: 'var(--color-incorrect)' }}>{sessionStats.errors} err</span>
            )}
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {exercise.instruction}
        </p>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            }}
          />
        </div>
      </div>

      {/* Typing area */}
      <div
        className="relative rounded-2xl p-6 cursor-text select-none"
        style={{ background: 'var(--color-surface)', border: `1px solid ${isComplete ? 'var(--color-correct)' : 'var(--color-border)'}` }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={e => handleInput(e.target.value)}
          onPaste={e => e.preventDefault()}
          disabled={isComplete}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="absolute opacity-0 w-0 h-0"
          aria-label="Practice typing input"
        />

        {/* Character display */}
        <div className="font-mono text-lg leading-relaxed tracking-wide break-words">
          {exercise.text.split('').map((char, i) => {
            let color = 'var(--color-text-subtle)';
            let bg = 'transparent';
            let border = 'none';

            if (i < typedText.length) {
              if (typedText[i] === char) {
                color = 'var(--color-correct)';
              } else {
                color = 'var(--color-incorrect)';
                bg = 'color-mix(in srgb, var(--color-incorrect) 15%, transparent)';
              }
            } else if (i === typedText.length) {
              color = 'var(--color-text)';
              border = '2px solid var(--color-primary)';
            }

            return (
              <span
                key={i}
                style={{
                  color,
                  background: bg,
                  borderBottom: border,
                  display: 'inline',
                  borderRadius: bg !== 'transparent' ? '2px' : undefined,
                  transition: 'color 0.06s ease',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>

        {/* Complete overlay */}
        {isComplete && (
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center animate-fade-in"
            style={{ background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', backdropFilter: 'blur(8px)' }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {sessionStats.accuracy >= exercise.minAccuracy ? '✅' : '⚠️'}
              </div>
              <div className="font-bold text-lg gradient-text">
                {sessionStats.accuracy >= exercise.minAccuracy ? 'Exercise Complete!' : 'Keep Practicing!'}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {sessionStats.wpm} WPM · {sessionStats.accuracy}% accuracy
              </div>
              {sessionStats.accuracy < exercise.minAccuracy && (
                <div className="text-xs mt-1" style={{ color: 'var(--color-incorrect)' }}>
                  Need {exercise.minAccuracy}% accuracy to pass
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback message */}
      {feedback && (
        <div
          className="px-4 py-2 rounded-xl text-sm font-semibold animate-fade-in"
          style={{
            background: 'color-mix(in srgb, var(--color-incorrect) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-incorrect) 30%, transparent)',
            color: 'var(--color-incorrect)',
          }}
        >
          {feedback}
        </div>
      )}

      {/* Visual guides: Keyboard + Hands */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        <div className="flex-1 flex justify-center">
          <VirtualKeyboard
            activeKey={activeKey}
            pressedKey={pressedKey}
            activeFinger={activeFinger}
          />
        </div>
        <div className="flex justify-center">
          <HandGuide activeFinger={activeFinger} pressedKey={currentChar} />
        </div>
      </div>
    </div>
  );
}
