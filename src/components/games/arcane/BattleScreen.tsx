'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CombatState } from '@/hooks/useArcaneGame';
import SpellEffect from './SpellEffect';

interface BattleScreenProps {
  combat: CombatState;
  typedSoFar: string;
  onKey: (key: string) => void;
  onPause: () => void;
}

export default function BattleScreen({ combat, typedSoFar, onKey, onPause }: BattleScreenProps) {
  const { enemy, enemyHp, words, currentWordIdx, spellEffect } = combat;
  const currentWord = words[currentWordIdx] || '';
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    focus();
    document.addEventListener('click', focus);
    return () => document.removeEventListener('click', focus);
  }, []);

  // Listen to keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onPause();
        return;
      }
      if (e.key === 'Backspace') {
        onKey('Backspace');
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey, onPause]);

  const progressPercent = (enemyHp / enemy.hp) * 100;

  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{ background: combat.region.ambient }}
    >
      {/* Hidden accessible input */}
      <input
        ref={inputRef}
        readOnly
        aria-label="Typing input for Battle"
        className="sr-only"
        value={typedSoFar}
      />

      {/* Spell Animation Container */}
      <SpellEffect spellId={spellEffect} />

      {/* Arena Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 relative z-10">
        {/* Enemy Panel */}
        <div className="flex flex-col items-center gap-3">
          {/* Enemy Sprite & Shake animation */}
          <motion.div
            animate={spellEffect ? { x: [-10, 10, -10, 10, 0], scale: [1, 0.95, 1] } : { y: [0, -6, 0] }}
            transition={spellEffect ? { duration: 0.5 } : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-8xl select-none"
            style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.6))` }}
          >
            {enemy.icon}
          </motion.div>

          {/* Enemy HP */}
          <div className="w-56 text-center">
            <h3 className="font-black text-sm tracking-wide text-white uppercase mb-1.5">{enemy.name}</h3>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <motion.div
                animate={{ width: `${progressPercent}%` }}
                className="h-full rounded-full"
                style={{
                  background: progressPercent > 50 ? '#ef4444' : progressPercent > 20 ? '#f97316' : '#b91c1c',
                }}
              />
            </div>
            <p className="text-[10px] text-red-300 font-bold mt-1 tabular-nums">
              HP: {enemyHp} / {enemy.hp}
            </p>
          </div>
        </div>

        {/* Word Challenge / Target Area */}
        <div className="max-w-xl w-full flex flex-col items-center justify-center gap-4 text-center mt-4">
          <div
            className="p-8 rounded-2xl w-full"
            style={{
              background: 'rgba(10, 5, 20, 0.75)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Cast Spell Word</p>
            {/* Word Display with styled parts */}
            <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest select-none">
              <span className="text-emerald-400 font-size-lg">
                {currentWord.slice(0, typedSoFar.length)}
              </span>
              <span className="text-slate-400 font-size-lg">
                {currentWord.slice(typedSoFar.length)}
              </span>
            </div>
            {/* Word progression count */}
            <div className="mt-4 flex justify-between items-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span>Words: {currentWordIdx} / {words.length}</span>
              {combat.combo > 1 && (
                <span className="text-orange-400 font-bold">Combo: {combat.combo}x</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Instructions */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <button
          onClick={onPause}
          id="battle-pause-btn"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 border"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          ⏸
        </button>
      </div>
    </div>
  );
}
