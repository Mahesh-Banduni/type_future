'use client';

import { useEffect, useState } from 'react';
import { useArcaneGame, ArcanePhase } from '@/hooks/useArcaneGame';
import { useGamesStore } from '@/store/useGamesStore';
import WorldMap from './WorldMap';
import BattleScreen from './BattleScreen';
import DialogueBox from './DialogueBox';
import ArcaneHUD from './ArcaneHUD';
import PauseMenu from '../shared/PauseMenu';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArcaneGame() {
  const {
    player,
    combat,
    phase,
    xpNeeded,
    loadSave,
    startQuest,
    advanceDialogue,
    handleCombatKey,
    completeQuest,
    returnToMap,
  } = useArcaneGame();

  const { arcaneSave, updateArcaneSave, recordGameResult, unlockAchievement } = useGamesStore();
  const [isPaused, setIsPaused] = useState(false);
  const [damageFlash, setDamageFlash] = useState(false);
  const [combatPhase, setCombatPhase] = useState<ArcanePhase>('world-map');
  const [playerHp, setPlayerHp] = useState(100);

  // Sync player save on mount
  useEffect(() => {
    loadSave(arcaneSave);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arcaneSave]);

  // Sync state phase
  useEffect(() => {
    setCombatPhase(phase);
  }, [phase]);

  // Sync local HP when player stats load
  useEffect(() => {
    setPlayerHp(player.hp);
  }, [player.hp]);

  // Periodic enemy attack during combat
  useEffect(() => {
    if (combatPhase !== 'combat' || isPaused || !combat) return;

    // Enemy attacks every 4 seconds
    const interval = setInterval(() => {
      setPlayerHp((prevHp) => {
        const nextHp = Math.max(0, prevHp - combat.enemy.attack);
        setDamageFlash(true);
        setTimeout(() => setDamageFlash(false), 200);

        if (nextHp <= 0) {
          setCombatPhase('defeat');
        }
        return nextHp;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [combatPhase, isPaused, combat]);

  // Handle combat victory / achievements / save state
  useEffect(() => {
    if (combatPhase === 'victory' && combat) {
      // Record game stats
      recordGameResult({
        gameId: 'arcane-quest',
        score: combat.score,
        wpm: combat.wpm,
        accuracy: combat.accuracy,
        combo: combat.combo,
        duration: 30, // average duration
        difficulty: 'medium',
        timestamp: Date.now(),
      });

      // Unlock achievements
      unlockAchievement({ id: 'arcane-first-spell', title: 'First Spell', description: 'Cast your first spell.', icon: '✨', gameId: 'arcane-quest' });
      if (combat.quest.type === 'boss') {
        unlockAchievement({ id: 'arcane-boss-defeat', title: 'Boss Vanquisher', description: 'Defeat a boss enemy.', icon: '⚔️', gameId: 'arcane-quest' });
      }

      // Check level achievements
      const rewardXp = combat.quest.reward.xp;
      const finalXp = player.xp + rewardXp;
      const finalLevel = Math.floor(1 + Math.sqrt(finalXp / 200));
      if (finalLevel >= 5) {
        unlockAchievement({ id: 'arcane-level-5', title: 'Adept Mage', description: 'Reach level 5.', icon: '🧙', gameId: 'arcane-quest' });
      }

      // Save state
      const updatedCompleted = Array.from(new Set([...player.completedQuests, combat.quest.id]));
      
      // Determine unlocked regions
      const unlockedRegions = [...player.unlockedRegions];
      if (combat.quest.id === 'mf-boss' && !unlockedRegions.includes('crystal-caverns')) {
        unlockedRegions.push('crystal-caverns');
      }
      if (combat.quest.id === 'cc-1' && !unlockedRegions.includes('ancient-library')) {
        unlockedRegions.push('ancient-library');
      }
      if (unlockedRegions.length >= 4) {
        unlockAchievement({ id: 'arcane-all-regions', title: 'World Explorer', description: 'Visit all 4 regions.', icon: '🗺️', gameId: 'arcane-quest' });
      }

      const spells = [...player.spells];
      if (combat.quest.reward.spell && !spells.includes(combat.quest.reward.spell)) {
        spells.push(combat.quest.reward.spell);
      }
      if (spells.length >= 5) {
        unlockAchievement({ id: 'arcane-spell-master', title: 'Spell Master', description: 'Unlock 5 spells.', icon: '📚', gameId: 'arcane-quest' });
      }

      updateArcaneSave({
        playerXP: finalXp,
        playerLevel: finalLevel,
        completedQuests: updatedCompleted,
        unlockedRegions,
        spells,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatPhase]);

  // Quit and restart triggers
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleRestart = () => {
    setIsPaused(false);
    if (combat) {
      startQuest(combat.quest.id);
    }
  };
  const handleQuit = () => {
    setIsPaused(false);
    returnToMap();
  };

  const handleKey = (key: string) => {
    if (isPaused) return;
    handleCombatKey(key);
  };

  return (
    <div
      className="flex-1 flex flex-col relative w-full h-[calc(100vh-64px)] overflow-hidden theme-transition"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Damage hit flash overlay */}
      <AnimatePresence>
        {damageFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Persistent Character HUD */}
      <ArcaneHUD player={{ ...player, hp: playerHp }} combat={combat} xpNeeded={xpNeeded} />

      {/* Game Phases */}
      {combatPhase === 'world-map' && (
        <WorldMap player={player} onSelectQuest={startQuest} />
      )}

      {combat && combatPhase === 'dialogue' && (
        <div className="flex-1 flex flex-col relative" style={{ background: combat.region.ambient }}>
          {/* NPC Graphic */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-8xl select-none"
            >
              🧙‍♂️
            </motion.div>
          </div>
          <DialogueBox
            dialogues={combat.quest.dialogues}
            currentIdx={combat.dialogueIdx}
            onAdvance={advanceDialogue}
          />
        </div>
      )}

      {combat && combatPhase === 'combat' && (
        <BattleScreen
          combat={combat}
          typedSoFar={combat.typedSoFar}
          onKey={handleKey}
          onPause={handlePause}
        />
      )}

      {/* Victory Phase Screen */}
      {combatPhase === 'victory' && combat && (
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center z-20"
          style={{ background: 'rgba(10, 5, 20, 0.95)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-md w-full p-8 flex flex-col items-center gap-6"
          >
            <span className="text-6xl">🏆</span>
            <div>
              <h2 className="text-2xl font-black text-white">Victory Achieved!</h2>
              <p className="text-sm mt-1 text-emerald-400 font-semibold">
                You defeated the {combat.enemy.name}!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3 rounded-xl" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">XP Gained</p>
                <p className="text-xl font-black text-purple-400">+{combat.quest.reward.xp} XP</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">WPM</p>
                <p className="text-xl font-black text-amber-400">{combat.wpm}</p>
              </div>
            </div>

            <button
              onClick={completeQuest}
              id="arcane-claim-reward-btn"
              className="w-full h-11 rounded-xl font-bold text-white transition-all hover:scale-105 focus-ring"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              Claim Rewards & Return
            </button>
          </motion.div>
        </div>
      )}

      {/* Defeat Phase Screen */}
      {combatPhase === 'defeat' && combat && (
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center z-20"
          style={{ background: 'rgba(20, 5, 5, 0.95)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-md w-full p-8 flex flex-col items-center gap-6"
          >
            <span className="text-6xl">💀</span>
            <div>
              <h2 className="text-2xl font-black text-red-500">Defeated</h2>
              <p className="text-sm mt-1 text-slate-400">
                You collapsed during the battle with {combat.enemy.name}.
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleRestart}
                id="arcane-retry-btn"
                className="flex-1 h-11 rounded-xl font-bold text-white transition-all hover:scale-105 focus-ring"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleQuit}
                id="arcane-quit-btn"
                className="flex-1 h-11 rounded-xl font-semibold transition-all hover:scale-105 focus-ring"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                ✕ Retreat
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pause Menu Overlay */}
      <PauseMenu
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onQuit={handleQuit}
        gameName="Arcane Typing Quest"
      />
    </div>
  );
}
