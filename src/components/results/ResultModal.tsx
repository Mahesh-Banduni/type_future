'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TestResult } from '@/types';
import { useStatsStore } from '@/store/useStatsStore';
import { calcGrossWpm, calcNetWpm, formatDate, formatTime } from '@/utils/wpm';
import { countByState, markMissed } from '@/utils/charState';
import { useTypingStore } from '@/store/useTypingStore';

interface Props {
  result: TestResult | null;
  onRetry: () => void;
  onNewTest: () => void;
  onClose: () => void;
}

function Row({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span
        className="font-bold tabular-nums text-sm"
        style={{ color: accent ? 'var(--color-primary)' : 'var(--color-text)' }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultModal({ result, onRetry, onNewTest, onClose }: Props) {
  const router = useRouter();
  const { stats } = useStatsStore();
  const { charData } = useTypingStore();

  const counts = useMemo(() => {
    if (!charData.length) return null;
    return countByState(markMissed([...charData]));
  }, [charData]);

  if (!result) return null;

  const isPersonalBest = result.wpm >= stats.bestScore && stats.totalTests > 1;
  const elapsedSeconds = result.duration;
  const grossWpm = calcGrossWpm((counts?.correct ?? 0) + (counts?.incorrect ?? 0) + (counts?.extra ?? 0), elapsedSeconds);
  const netWpm = calcNetWpm(grossWpm, result.errors, elapsedSeconds);

  const handleShare = () => {
    const text = `I just typed ${result.wpm} WPM with ${result.accuracy}% accuracy on TypeFuture! (${result.difficulty} · ${result.duration}s) 🚀`;
    navigator.clipboard?.writeText(text).catch(() => {});
    alert('Result copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto"
          style={{ padding: '32px', position: 'relative' }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full focus-ring theme-transition"
            style={{ background: 'var(--color-surface2)', color: 'var(--color-text-muted)' }}
            aria-label="Close results"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            {isPersonalBest && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 animate-pulse-glow"
                style={{ background: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' }}
              >
                🏆 New Personal Best!
              </div>
            )}
            <h2 id="result-title" className="text-4xl font-black gradient-text">
              {result.wpm} <span className="text-2xl">WPM</span>
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {formatDate(result.timestamp)} · {result.difficulty} · {formatTime(result.duration)}
            </p>
          </div>

          {/* Main stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Accuracy', value: `${result.accuracy}%` },
              { label: 'Gross WPM', value: grossWpm },
              { label: 'Net WPM', value: netWpm },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="text-center rounded-xl p-3"
                style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
              >
                <div className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>{value}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Detail rows */}
          <div className="space-y-0 mb-6">
            <Row label="WPM"                value={result.wpm}                           accent />
            <Row label="Characters typed"  value={result.totalChars} />
            <Row label="Correct chars"     value={counts?.correct ?? result.correctChars} />
            <Row label="Incorrect chars"   value={counts?.incorrect ?? result.incorrectChars} />
            <Row label="Extra chars"       value={counts?.extra ?? 0} />
            <Row label="Missed chars"      value={counts?.missed ?? 0} />
            <Row label="Total words"       value={result.totalWords} />
            <Row label="Error count"       value={result.errors} />
            <Row label="Test duration"     value={`${result.duration}s`} />
            <Row label="Difficulty"        value={result.difficulty} />
            <Row label="Personal best"     value={`${stats.bestScore} WPM`} accent />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="result-retry-btn"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              🔄 Retry
            </button>
            <button
              id="result-new-btn"
              onClick={onNewTest}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-surface2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            >
              ✨ New Test
            </button>
            <button
              id="result-share-btn"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-surface2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            >
              📤 Share
            </button>
            <button
              id="result-home-btn"
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-surface2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            >
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
