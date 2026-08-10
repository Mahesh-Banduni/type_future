'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/shared/GameCard';
import Leaderboard from '@/components/games/shared/Leaderboard';
import { AchievementBadge, AchievementToast } from '@/components/games/shared/AchievementBadge';
import XPBar from '@/components/games/shared/XPBar';
import { useGamesStore, ALL_ACHIEVEMENTS } from '@/store/useGamesStore';

const GAMES_LIST = [
  {
    id: 'cosmic-word-defense',
    title: 'Cosmic Word Defense',
    desc: 'Defend your futuristic space station from waves of descending enemy ships by typing words before they reach your defense line.',
    emoji: '🚀',
    difficulty: 'Variable',
    playTime: '2-10 min',
    href: '/games/cosmic-word-defense',
  },
  {
    id: 'arcane-quest',
    title: 'Arcane Typing Quest',
    desc: 'An immersive turn-based typing RPG. Cast elemental spells, battle fantasy monsters, and complete quests through typing speed.',
    emoji: '🧙',
    difficulty: 'Medium',
    playTime: '5-15 min',
    href: '/games/arcane-quest',
  },
  {
    id: 'precision-trainer',
    title: 'Precision Trainer',
    desc: 'An adaptive training coach that tracks your typing speed and accuracy per key, plotting errors on a interactive keyboard heatmap.',
    emoji: '⌨️',
    difficulty: 'Adaptive',
    playTime: '3-5 min',
    href: '/games/precision-trainer',
  },
];

export default function GamesHub() {
  const { globalStats, achievements, cosmicSave, arcaneSave, precisionSave, hydrate } = useGamesStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const bestScores: Record<string, number> = {
    'cosmic-word-defense': cosmicSave.bestScore || 0,
    'arcane-quest': (arcaneSave.playerLevel * 1000) || 0, // proxy high score
    'precision-trainer': precisionSave.sessions ? 1000 : 0, // simple proxy score
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Animated backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: 'var(--color-primary)' }}
          />
          <div
            className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: 'var(--color-accent)' }}
          />
        </div>

        {/* Hero Section */}
        <div className="max-w-5xl w-full text-center flex flex-col items-center gap-4 mb-12 relative z-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: 'var(--color-primary)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
            }}
          >
            🎮 TypeFuture Gaming Ecosystem
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
            Interactive Typing Games
          </h1>
          <p className="text-sm sm:text-base max-w-xl text-center" style={{ color: 'var(--color-text-muted)' }}>
            Level up your keyboard mastery with highly polished, arcade-inspired interactive typing trainers.
          </p>
        </div>

        {/* User Stats Summary Bar */}
        {globalStats.gamesPlayed > 0 && (
          <div
            className="max-w-5xl w-full p-6 rounded-2xl mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="md:col-span-2 flex flex-col justify-center">
              <XPBar xp={globalStats.totalXP} level={globalStats.level} />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white">{globalStats.gamesPlayed}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Games Played
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>
                {globalStats.bestCombo}x
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Highest Combo
              </span>
            </div>
          </div>
        )}

        {/* Content Layout Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Games Grid */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white mb-2">Select a Game</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GAMES_LIST.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  desc={game.desc}
                  emoji={game.emoji}
                  difficulty={game.difficulty}
                  playTime={game.playTime}
                  bestScore={bestScores[game.id]}
                  href={game.href}
                />
              ))}
            </div>

            {/* Achievements Strip */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4 mt-4"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Achievements Progress ({achievements.length} / {ALL_ACHIEVEMENTS.length})
              </h3>
              <div className="flex gap-4 overflow-x-auto py-2">
                {ALL_ACHIEVEMENTS.map((ach) => {
                  const unlocked = achievements.find((a) => a.id === ach.id);
                  return (
                    <AchievementBadge
                      key={ach.id}
                      achievement={{ ...ach, unlockedAt: unlocked ? unlocked.unlockedAt : null }}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Leaderboards */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white mb-2">High Scores (Local)</h2>
            <div
              className="p-5 rounded-2xl flex flex-col gap-4"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Leaderboard maxEntries={6} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AchievementToast />
    </>
  );
}
