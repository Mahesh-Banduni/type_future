'use client';

import { motion } from 'framer-motion';
import { CosmicGameState } from '@/hooks/useCosmicGame';

interface EnemyListProps {
  enemies: CosmicGameState['enemies'];
  targetedId: string | null;
  typedSoFar: string;
}

export default function EnemyList({ enemies, targetedId, typedSoFar }: EnemyListProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {enemies.map((enemy) => {
        const isTargeted = enemy.id === targetedId;
        const typedLen = isTargeted ? typedSoFar.length : 0;
        const typed = enemy.word.slice(0, typedLen);
        const remaining = enemy.word.slice(typedLen);

        return (
          <motion.div
            key={enemy.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            style={{
              position: 'absolute',
              left: `${enemy.x}%`,
              top: `${enemy.y}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              zIndex: isTargeted ? 20 : 10,
            }}
          >
            {/* Ship icon */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={isTargeted
                  ? { filter: ['drop-shadow(0 0 6px #fff)', 'drop-shadow(0 0 12px #fff)', 'drop-shadow(0 0 6px #fff)'] }
                  : { filter: 'none' }
                }
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{
                  fontSize: enemy.size,
                  lineHeight: 1,
                  filter: isTargeted ? undefined : `drop-shadow(0 0 4px ${enemy.color})`,
                }}
              >
                {enemy.icon}
              </motion.div>

              {/* HP bar (multi-hp enemies) */}
              {enemy.maxHp > 1 && (
                <div
                  className="w-12 h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                      background: enemy.color,
                    }}
                  />
                </div>
              )}

              {/* Word label */}
              <div
                className="px-2.5 py-1 rounded-lg text-sm font-bold font-mono whitespace-nowrap"
                style={{
                  background: isTargeted
                    ? 'rgba(0,0,0,0.85)'
                    : 'rgba(0,0,0,0.6)',
                  border: `1px solid ${isTargeted ? enemy.color : 'rgba(255,255,255,0.15)'}`,
                  boxShadow: isTargeted ? `0 0 12px ${enemy.color}55` : 'none',
                }}
              >
                <span style={{ color: 'var(--color-correct)' }}>{typed}</span>
                <span style={{ color: isTargeted ? '#fff' : 'rgba(255,255,255,0.8)' }}>{remaining}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
