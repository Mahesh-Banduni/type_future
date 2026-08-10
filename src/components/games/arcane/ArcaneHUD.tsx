'use client';

import { motion } from 'framer-motion';
import { ArcanePlayerState, CombatState } from '@/hooks/useArcaneGame';

interface ArcaneHUDProps {
  player: ArcanePlayerState;
  combat: CombatState | null;
  xpNeeded: number;
}

export default function ArcaneHUD({ player, combat, xpNeeded }: ArcaneHUDProps) {
  const hpPercent = (player.hp / player.maxHp) * 100;
  const mpPercent = (player.mp / player.maxMp) * 100;
  const xpPercent = Math.min(100, (player.xp / xpNeeded) * 100);

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 flex-wrap"
      style={{
        background: 'rgba(10,5,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(167,139,250,0.2)',
      }}
    >
      {/* Level badge */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        {player.level}
      </div>

      {/* HP / MP bars */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold w-6 text-red-400">HP</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              animate={{ width: `${hpPercent}%` }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #ef4444, #f87171)`, transition: 'width 0.4s ease' }}
            />
          </div>
          <span className="text-[10px] tabular-nums w-12 text-right" style={{ color: '#e2e8f0' }}>
            {player.hp}/{player.maxHp}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold w-6 text-blue-400">MP</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              animate={{ width: `${mpPercent}%` }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', transition: 'width 0.4s ease' }}
            />
          </div>
          <span className="text-[10px] tabular-nums w-12 text-right" style={{ color: '#e2e8f0' }}>
            {player.mp}/{player.maxMp}
          </span>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold" style={{ color: '#a78bfa' }}>XP</span>
          <span className="text-[10px] tabular-nums" style={{ color: '#94a3b8' }}>
            {player.xp} / {xpNeeded}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            animate={{ width: `${xpPercent}%` }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)', transition: 'width 0.4s ease' }}
          />
        </div>
      </div>

      {/* Combat stats */}
      {combat && combat.phase === 'combat' && (
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>WPM</p>
            <p className="text-sm font-black" style={{ color: '#fbbf24' }}>{combat.wpm}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Acc</p>
            <p className="text-sm font-black" style={{ color: '#4ade80' }}>{combat.accuracy}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Combo</p>
            <p className="text-sm font-black" style={{ color: '#f97316' }}>×{combat.combo}</p>
          </div>
        </div>
      )}

      {/* Active spell indicator */}
      {player.spells.length > 0 && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {player.spells.slice(0, 3).map((s) => (
            <div
              key={s}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(167,139,250,0.3)',
              }}
              title={s}
            >
              {s === 'fireball' ? '🔥' : s === 'spark' ? '✨' : s === 'crystal-lance' ? '💎' : s === 'arcane-bolt' ? '⚡' : s === 'nature-bolt' ? '🌿' : '🌩️'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
