'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AdaptiveTypingAreaProps {
  text: string;
  onComplete: (
    wpm: number,
    accuracy: number,
    keyStats: Record<string, { count: number; errors: number; totalMs: number }>
  ) => void;
}

export default function AdaptiveTypingArea({ text, onComplete }: AdaptiveTypingAreaProps) {
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const keyStatsRef = useRef<Record<string, { count: number; errors: number; totalMs: number }>>({});
  const lastKeyTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
      lastKeyTimeRef.current = performance.now();
    }

    // Ignore non-printable keys
    if (key.length !== 1 && key !== 'Backspace') return;

    const currentIdx = typed.length;
    const targetChar = text[currentIdx];

    if (key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
      }
      return;
    }

    const isCorrect = key === targetChar;
    const now = performance.now();
    const elapsedMs = now - lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;

    // Track statistics for the target character (lowercased for aggregation)
    if (targetChar) {
      const lowerChar = targetChar.toLowerCase();
      if (!keyStatsRef.current[lowerChar]) {
        keyStatsRef.current[lowerChar] = { count: 0, errors: 0, totalMs: 0 };
      }
      keyStatsRef.current[lowerChar].count += 1;
      if (!isCorrect) {
        keyStatsRef.current[lowerChar].errors += 1;
      } else {
        keyStatsRef.current[lowerChar].totalMs += elapsedMs;
      }
    }

    if (isCorrect) {
      const newTyped = typed + key;
      setTyped(newTyped);

      // Check for completion
      if (newTyped.length === text.length) {
        const totalTimeMin = startTime ? (Date.now() - startTime) / 60000 : 0.01;
        const words = text.split(' ').length;
        const calculatedWpm = Math.round(words / Math.max(totalTimeMin, 0.01));
        const totalKeystrokes = text.length + errors;
        const calculatedAccuracy = totalKeystrokes > 0 ? Math.round((text.length / totalKeystrokes) * 100) : 100;
        
        onComplete(calculatedWpm, calculatedAccuracy, keyStatsRef.current);
      }
    } else {
      setErrors((prev) => prev + 1);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="p-8 rounded-2xl w-full cursor-text min-h-36 flex flex-col justify-center relative font-mono text-xl sm:text-2xl leading-relaxed"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute inset-0 w-full h-full opacity-0 cursor-default"
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        value=""
        aria-label="Typing input field"
      />

      <div className="flex flex-wrap gap-x-0.5">
        {text.split('').map((char, index) => {
          let state: 'untyped' | 'correct' | 'current' = 'untyped';
          if (index < typed.length) state = 'correct';
          else if (index === typed.length) state = 'current';

          return (
            <span
              key={index}
              className={`transition-colors duration-150 relative ${
                state === 'correct'
                  ? 'char-correct'
                  : state === 'current'
                  ? 'char-current font-bold'
                  : 'char-untyped'
              }`}
            >
              {char}
              {state === 'current' && (
                <motion.span
                  layoutId="caret"
                  className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
