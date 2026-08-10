'use client';

import { useEffect, useRef, useState } from 'react';
import { CosmicGameState } from '@/hooks/useCosmicGame';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingInputProps {
  onKey: (key: string) => void;
  gameState: CosmicGameState;
  onPause: () => void;
}

export default function TypingInput({ onKey, gameState, onPause }: TypingInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHint, setShowHint] = useState(false);

  // Keep focus
  useEffect(() => {
    const focus = () => { if (gameState.status === 'playing') inputRef.current?.focus(); };
    focus();
    document.addEventListener('click', focus);
    return () => document.removeEventListener('click', focus);
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status !== 'playing') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onPause(); return; }
      if (e.key === 'Backspace') { onKey('Backspace'); return; }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, onKey, onPause]);

  // Show hint after 3s of idle
  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.enemies.length === 0) { setShowHint(false); return; }
    const t = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(t);
  }, [gameState.typedSoFar, gameState.status, gameState.enemies.length]);

  useEffect(() => { if (gameState.typedSoFar.length > 0) setShowHint(false); }, [gameState.typedSoFar]);

  const target = gameState.enemies.find((e) => e.id === gameState.targetedId);

  return (
    <>
      {/* Hidden accessible input */}
      <input
        ref={inputRef}
        readOnly
        aria-label="Typing input for Cosmic Word Defense"
        className="sr-only"
        value={gameState.typedSoFar}
        tabIndex={0}
      />

      {/* Bottom typing indicator */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 px-4 py-3 flex items-center justify-between gap-4"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      >
        {/* Typed word so far */}
        <div className="flex-1 flex items-center justify-center">
          {gameState.typedSoFar ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Typing:</span>
              <motion.span
                key={gameState.typedSoFar}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                className="text-lg font-black font-mono tracking-widest"
                style={{ color: target ? target.color : 'var(--color-primary)' }}
              >
                {gameState.typedSoFar}
                <span
                  className="inline-block w-0.5 h-5 ml-0.5 animate-pulse"
                  style={{ background: 'var(--color-primary)', verticalAlign: 'middle' }}
                />
              </motion.span>
            </div>
          ) : (
            <AnimatePresence>
              {showHint && gameState.enemies.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Type the first letter to target an enemy
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* WPM indicator */}
        <div className="text-right flex-shrink-0">
          <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-primary)' }}>
            {gameState.wpm} WPM
          </span>
        </div>
      </div>
    </>
  );
}
