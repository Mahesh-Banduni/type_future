'use client';

import { create } from 'zustand';
import {
  GameAchievement, LeaderboardEntry, GameResult, GamesGlobalStats,
  CosmicSave, ArcaneSave, PrecisionSave, GameId,
} from '@/types';
import {
  getGamesStats, recordGameResult as storageRecordResult,
  getLeaderboard, addLeaderboardEntry as storageAddLeaderboard,
  getAchievements, unlockAchievement as storageUnlock,
  getCosmicSave, saveCosmicSave,
  getArcaneSave, saveArcaneSave,
  getPrecisionSave, savePrecisionSave,
} from '@/utils/storage';

interface GamesState {
  // Global
  globalStats: GamesGlobalStats;
  achievements: GameAchievement[];
  leaderboard: LeaderboardEntry[];
  hydrated: boolean;
  pendingAchievement: GameAchievement | null;

  // Game saves
  cosmicSave: CosmicSave;
  arcaneSave: ArcaneSave;
  precisionSave: PrecisionSave;

  // Actions
  hydrate: () => void;
  recordGameResult: (result: GameResult) => void;
  addLeaderboardEntry: (entry: Omit<LeaderboardEntry, 'id'>) => void;
  unlockAchievement: (achievement: Omit<GameAchievement, 'unlockedAt'>) => void;
  clearPendingAchievement: () => void;
  updateCosmicSave: (save: Partial<CosmicSave>) => void;
  updateArcaneSave: (save: Partial<ArcaneSave>) => void;
  updatePrecisionSave: (save: Partial<PrecisionSave>) => void;
  getLeaderboardForGame: (gameId: GameId) => LeaderboardEntry[];
}

// All predefined achievements
export const ALL_ACHIEVEMENTS: Omit<GameAchievement, 'unlockedAt'>[] = [
  // Cosmic Word Defense
  { id: 'cosmic-first-kill', title: 'First Strike', description: 'Destroy your first enemy ship.', icon: '🚀', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-wave-5', title: 'Survivor', description: 'Survive to wave 5.', icon: '🛡️', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-wave-10', title: 'Space Defender', description: 'Survive to wave 10.', icon: '⭐', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-combo-10', title: 'Combo Starter', description: 'Reach a 10x combo.', icon: '🔥', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-combo-25', title: 'Combo Master', description: 'Reach a 25x combo.', icon: '💥', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-perfect', title: '100% Accuracy', description: 'Complete a wave with 100% accuracy.', icon: '🎯', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-boss-slay', title: 'Boss Slayer', description: 'Defeat a boss enemy.', icon: '👑', gameId: 'cosmic-word-defense' },
  { id: 'cosmic-100k', title: 'Century Scorer', description: 'Score 100,000 points.', icon: '💯', gameId: 'cosmic-word-defense' },
  // Arcane Quest
  { id: 'arcane-first-spell', title: 'First Spell', description: 'Cast your first spell.', icon: '✨', gameId: 'arcane-quest' },
  { id: 'arcane-level-5', title: 'Adept Mage', description: 'Reach level 5.', icon: '🧙', gameId: 'arcane-quest' },
  { id: 'arcane-boss-defeat', title: 'Boss Vanquisher', description: 'Defeat a boss enemy.', icon: '⚔️', gameId: 'arcane-quest' },
  { id: 'arcane-spell-master', title: 'Spell Master', description: 'Unlock 5 different spells.', icon: '📚', gameId: 'arcane-quest' },
  { id: 'arcane-all-regions', title: 'World Explorer', description: 'Visit all 4 regions.', icon: '🗺️', gameId: 'arcane-quest' },
  // Precision Trainer
  { id: 'precision-first', title: 'First Session', description: 'Complete your first training session.', icon: '⌨️', gameId: 'precision-trainer' },
  { id: 'precision-10-sessions', title: 'Dedicated Learner', description: 'Complete 10 training sessions.', icon: '📈', gameId: 'precision-trainer' },
  { id: 'precision-key-master', title: 'Key Master', description: 'Achieve 98%+ accuracy on all home row keys.', icon: '🏆', gameId: 'precision-trainer' },
  // Global
  { id: 'global-speed-demon', title: 'Speed Demon', description: 'Reach 100 WPM in any game.', icon: '⚡', gameId: 'global' },
  { id: 'global-level-10', title: 'Gaming Legend', description: 'Reach player level 10.', icon: '🎮', gameId: 'global' },
  { id: 'global-all-games', title: 'Completionist', description: 'Play all three games.', icon: '🌟', gameId: 'global' },
];

export const useGamesStore = create<GamesState>((set, get) => ({
  globalStats: {
    gamesPlayed: 0, totalPlaytime: 0, totalXP: 0, level: 1, bestCombo: 0, achievements: [],
  },
  achievements: [],
  leaderboard: [],
  hydrated: false,
  pendingAchievement: null,
  cosmicSave: { highestWave: 0, bestScore: 0, totalKills: 0, powerUpsUsed: 0 },
  arcaneSave: { playerLevel: 1, playerXP: 0, currentRegion: 'mystic-forest', completedQuests: [], unlockedRegions: ['mystic-forest'], spells: ['fireball'] },
  precisionSave: { sessions: 0, totalKeystrokes: 0, keyStats: {} },

  hydrate: () => {
    if (get().hydrated) return;
    set({
      globalStats: getGamesStats(),
      achievements: getAchievements(),
      leaderboard: getLeaderboard(),
      cosmicSave: getCosmicSave(),
      arcaneSave: getArcaneSave(),
      precisionSave: getPrecisionSave(),
      hydrated: true,
    });
  },

  recordGameResult: (result) => {
    const updated = storageRecordResult(result);
    set({ globalStats: updated });
  },

  addLeaderboardEntry: (entry) => {
    const full = storageAddLeaderboard(entry);
    set((state) => ({ leaderboard: [full, ...state.leaderboard].slice(0, 200) }));
  },

  unlockAchievement: (achievement) => {
    const wasNew = storageUnlock(achievement);
    if (!wasNew) return;
    const unlocked: GameAchievement = { ...achievement, unlockedAt: Date.now() };
    set((state) => ({
      achievements: [...state.achievements.filter((a) => a.id !== achievement.id), unlocked],
      pendingAchievement: unlocked,
      globalStats: { ...state.globalStats, achievements: [...state.globalStats.achievements, achievement.id] },
    }));
  },

  clearPendingAchievement: () => set({ pendingAchievement: null }),

  updateCosmicSave: (partial) => {
    const updated = { ...get().cosmicSave, ...partial };
    saveCosmicSave(updated);
    set({ cosmicSave: updated });
  },

  updateArcaneSave: (partial) => {
    const updated = { ...get().arcaneSave, ...partial };
    saveArcaneSave(updated);
    set({ arcaneSave: updated });
  },

  updatePrecisionSave: (partial) => {
    const updated = { ...get().precisionSave, ...partial };
    savePrecisionSave(updated);
    set({ precisionSave: updated });
  },

  getLeaderboardForGame: (gameId) => {
    return get().leaderboard
      .filter((e) => e.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },
}));
