'use client';

import { CosmicGameState } from '@/hooks/useCosmicGame';
import { motion } from 'framer-motion';

interface CosmicHUDProps {
  state: CosmicGameState;
  onPause: () => void;
}

export default function CosmicHUD({ state, onPause }: CosmicHUDProps) {
  const { score, combo, accuracy, wpm, lives, timeRemaining, wave, activePowerUps } = state;

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '∞';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const powerUpLabels: Record<string, string> = {
    freeze: '❄️ Freeze', 'double-score': '×2 Score',
    slow: '🐢 Slow', shield: '🛡 Shield',
    'extra-life': '❤️ +Life', emp: '⚡ EMP',
  };

  return (
    <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      >
        {/* Left: Score + Combo */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#60a5fa' }}>Score</p>
            <motion.p
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-xl font-black tabular-nums" style={{ color: '#fff' }}
            >
              {score.toLocaleString()}
            </motion.p>
          </div>
          {combo >= 2 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#fbbf24' }}>Combo</p>
              <motion.p
                key={combo}
                initial={{ scale: 1.3, color: '#fbbf24' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-xl font-black tabular-nums"
              >
                ×{combo}
              </motion.p>
            </div>
          )}
        </div>

        {/* Center: Wave */}
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#a78bfa' }}>Wave</p>
          <p className="text-xl font-black" style={{ color: '#fff' }}>{wave}</p>
        </div>

        {/* Right: Stats + Lives + Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>WPM / Acc</p>
            <p className="text-sm font-bold" style={{ color: '#fff' }}>
              {wpm} / <span style={{ color: '#4ade80' }}>{accuracy}%</span>
            </p>
          </div>

          {/* Lives */}
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>

          {/* Timer */}
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>Time</p>
            <p
              className="text-xl font-black tabular-nums"
              style={{ color: timeRemaining < 30 && isFinite(timeRemaining) ? '#f87171' : '#fff' }}
            >
              {formatTime(timeRemaining)}
            </p>
          </div>

          {/* Pause button */}
          <button
            onClick={onPause}
            id="cosmic-pause-btn"
            className="pointer-events-auto w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          >
            ⏸
          </button>
        </div>
      </div>

      {/* Active power-ups strip */}
      {activePowerUps.length > 0 && (
        <div className="flex gap-2 px-4 py-1.5 flex-wrap" style={{ background: 'rgba(0,0,0,0.5)' }}>
          {activePowerUps.map((p) => {
            const remaining = Math.ceil((p.expiresAt - Date.now()) / 1000);
            return (
              <div
                key={p.type}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(108,142,247,0.2)', border: '1px solid rgba(108,142,247,0.4)', color: '#fff' }}
              >
                {powerUpLabels[p.type]} {remaining > 0 ? `${remaining}s` : ''}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
