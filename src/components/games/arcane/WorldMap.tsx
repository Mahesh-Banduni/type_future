'use client';

import { motion } from 'framer-motion';
import { ARCANE_REGIONS } from '@/data/arcaneWorld';
import { ArcanePlayerState } from '@/hooks/useArcaneGame';

interface WorldMapProps {
  player: ArcanePlayerState;
  onSelectQuest: (questId: string) => void;
}

export default function WorldMap({ player, onSelectQuest }: WorldMapProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0a3a 0%, #0a0520 100%)' }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">🗺️ World of Aetheria</h2>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            Choose a region to embark on your quest
          </p>
        </motion.div>

        <div className="space-y-4">
          {ARCANE_REGIONS.map((region, i) => {
            const isUnlocked = player.unlockedRegions.includes(region.id);
            const isCurrentRegion = player.currentRegion === region.id;
            const completedQuestsInRegion = region.quests.filter((q) =>
              player.completedQuests.includes(q.id)
            ).length;
            const totalQuests = region.quests.length;

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: isUnlocked ? `linear-gradient(135deg, ${region.colorFrom}, ${region.colorTo}22)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isUnlocked ? `${region.colorTo}66` : 'rgba(255,255,255,0.08)'}`,
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {/* Region header */}
                <div className="px-5 py-4 flex items-center gap-4">
                  <span style={{ fontSize: 36 }}>{region.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white text-lg">{region.name}</h3>
                      {isCurrentRegion && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa' }}>
                          Current
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
                          🔒 Lv.{region.unlockLevel}+
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{region.description}</p>
                    {isUnlocked && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(completedQuestsInRegion / totalQuests) * 100}%`,
                              background: region.colorTo,
                            }}
                          />
                        </div>
                        <span className="text-[10px] flex-shrink-0" style={{ color: '#94a3b8' }}>
                          {completedQuestsInRegion}/{totalQuests}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quests */}
                {isUnlocked && (
                  <div className="px-5 pb-4 flex flex-col gap-2">
                    {region.quests.map((quest) => {
                      const isCompleted = player.completedQuests.includes(quest.id);
                      const typeIcon = quest.type === 'boss' ? '👾' : quest.type === 'side' ? '📜' : '⚔️';
                      const typeColor = quest.type === 'boss' ? '#f97316' : quest.type === 'side' ? '#fbbf24' : '#60a5fa';
                      return (
                        <button
                          key={quest.id}
                          id={`quest-${quest.id}`}
                          onClick={() => !isCompleted && onSelectQuest(quest.id)}
                          disabled={isCompleted}
                          className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] focus-ring"
                          style={{
                            background: isCompleted ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isCompleted ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)'}`,
                            cursor: isCompleted ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{typeIcon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-white">{quest.title}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                                style={{ background: `${typeColor}22`, color: typeColor }}>
                                {quest.type}
                              </span>
                              {isCompleted && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                                  style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>
                                  ✓ Done
                                </span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{quest.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold" style={{ color: '#a78bfa' }}>+{quest.reward.xp} XP</p>
                            {quest.reward.spell && (
                              <p className="text-[10px]" style={{ color: '#fbbf24' }}>🔮 Spell unlock</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
