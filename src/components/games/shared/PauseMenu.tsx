'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  gameName?: string;
}

export default function PauseMenu({ isOpen, onResume, onRestart, onQuit, gameName }: PauseMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              className="px-8 py-6 text-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              }}
            >
              <span className="text-3xl">⏸</span>
              <h2 className="text-xl font-black text-white mt-1">Game Paused</h2>
              {gameName && <p className="text-sm text-white/70 mt-0.5">{gameName}</p>}
            </div>

            {/* Buttons */}
            <div className="p-6 flex flex-col gap-3">
              <button
                onClick={onResume}
                id="pause-resume-btn"
                className="w-full h-12 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 focus-ring"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              >
                ▶ Resume
              </button>
              <button
                onClick={onRestart}
                id="pause-restart-btn"
                className="w-full h-12 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                🔄 Restart
              </button>
              <button
                onClick={onQuit}
                id="pause-quit-btn"
                className="w-full h-12 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
                style={{
                  background: 'color-mix(in srgb, var(--color-incorrect) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-incorrect) 25%, transparent)',
                  color: 'var(--color-incorrect)',
                }}
              >
                ✕ Quit to Hub
              </button>
            </div>
            <p className="text-center text-xs pb-4" style={{ color: 'var(--color-text-muted)' }}>
              Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>Esc</kbd> to resume
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
