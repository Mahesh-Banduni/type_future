'use client';

import { useCallback, useEffect } from 'react';
import { useCosmicGame } from '@/hooks/useCosmicGame';
import { useGamesStore } from '@/store/useGamesStore';
import { GameDifficulty } from '@/types';
import GameCanvas from './GameCanvas';
import EnemyList from './EnemyList';
import CosmicHUD from './CosmicHUD';
import TypingInput from './TypingInput';
import CosmicGameOver from './CosmicGameOver';
import GameCountdown from '../shared/GameCountdown';
import PauseMenu from '../shared/PauseMenu';
import GameDifficultySelector from '../shared/DifficultySelector';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicGameProps {
  initialDifficulty?: GameDifficulty;
}

export default function CosmicGame({ initialDifficulty = 'medium' }: CosmicGameProps) {
  const { state, startGame, beginPlaying, pauseGame, resumeGame, quitGame, handleKey } = useCosmicGame();
  const { unlockAchievement, recordGameResult, addLeaderboardEntry, cosmicSave, updateCosmicSave } = useGamesStore();

  // Achievement checks
  useEffect(() => {
    if (state.kills >= 1) unlockAchievement({ id: 'cosmic-first-kill', title: 'First Strike', description: 'Destroy your first enemy ship.', icon: '🚀', gameId: 'cosmic-word-defense' });
    if (state.wave >= 5) unlockAchievement({ id: 'cosmic-wave-5', title: 'Survivor', description: 'Survive to wave 5.', icon: '🛡️', gameId: 'cosmic-word-defense' });
    if (state.wave >= 10) unlockAchievement({ id: 'cosmic-wave-10', title: 'Space Defender', description: 'Survive to wave 10.', icon: '⭐', gameId: 'cosmic-word-defense' });
    if (state.combo >= 10) unlockAchievement({ id: 'cosmic-combo-10', title: 'Combo Starter', description: 'Reach a 10x combo.', icon: '🔥', gameId: 'cosmic-word-defense' });
    if (state.combo >= 25) unlockAchievement({ id: 'cosmic-combo-25', title: 'Combo Master', description: 'Reach a 25x combo.', icon: '💥', gameId: 'cosmic-word-defense' });
    if (state.score >= 100000) unlockAchievement({ id: 'cosmic-100k', title: 'Century Scorer', description: 'Score 100,000 points.', icon: '💯', gameId: 'cosmic-word-defense' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.kills, state.wave, state.combo, state.score]);

  // On game over: record result and update saves
  useEffect(() => {
    if (state.status !== 'gameover') return;
    const duration = state.duration === Infinity ? 9999 : state.duration - state.timeRemaining;
    recordGameResult({
      gameId: 'cosmic-word-defense', score: state.score, wpm: state.wpm,
      accuracy: state.accuracy, combo: state.combo,
      duration, difficulty: state.difficulty, timestamp: Date.now(),
    });
    updateCosmicSave({
      bestScore: Math.max(cosmicSave.bestScore, state.score),
      highestWave: Math.max(cosmicSave.highestWave, state.wave),
      totalKills: cosmicSave.totalKills + state.kills,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const handleSubmitScore = useCallback((playerName: string) => {
    addLeaderboardEntry({
      gameId: 'cosmic-word-defense',
      playerName, score: state.score, wpm: state.wpm,
      accuracy: state.accuracy, combo: state.combo,
      difficulty: state.difficulty, timestamp: Date.now(),
    });
  }, [addLeaderboardEntry, state]);

  const handleRestart = useCallback(() => startGame(state.difficulty), [startGame, state.difficulty]);

  // Lobby screen
  if (state.status === 'idle') {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1535 0%, #020409 60%)' }}
      >
        {/* Stars BG */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              background: '#fff', opacity: Math.random() * 0.6 + 0.2,
            }} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg text-center"
        >
          <div className="text-7xl mb-4">🚀</div>
          <h1 className="text-4xl font-black text-white mb-2">Cosmic Word Defense</h1>
          <p className="text-base mb-8" style={{ color: '#94a3b8' }}>
            Type words to destroy enemy ships before they reach your space station!
          </p>

          {/* Best score */}
          {cosmicSave.bestScore > 0 && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(108,142,247,0.15)', border: '1px solid rgba(108,142,247,0.3)', color: '#60a5fa' }}
            >
              🏆 Best: {cosmicSave.bestScore.toLocaleString()} pts · Wave {cosmicSave.highestWave}
            </div>
          )}

          <GameDifficultySelector
            value={initialDifficulty}
            onChange={(d) => startGame(d)}
            includeEndless
          />

          <div className="mt-6 flex flex-col gap-2 text-sm" style={{ color: '#64748b' }}>
            <p>🎯 Type the word on each enemy ship to destroy it</p>
            <p>⌨️ Start typing to auto-target the matching enemy</p>
            <p>⏸ Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.1)' }}>Esc</kbd> to pause</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ height: '100dvh', background: '#020409' }}
    >
      {/* Canvas background */}
      <GameCanvas gameState={state} />

      {/* Enemy DOM overlay */}
      <AnimatePresence>
        {state.status === 'playing' || state.status === 'paused' ? (
          <EnemyList enemies={state.enemies} targetedId={state.targetedId} typedSoFar={state.typedSoFar} />
        ) : null}
      </AnimatePresence>

      {/* HUD */}
      {(state.status === 'playing' || state.status === 'paused') && (
        <CosmicHUD state={state} onPause={pauseGame} />
      )}

      {/* Typing input + bottom bar */}
      {state.status === 'playing' && (
        <TypingInput onKey={handleKey} gameState={state} onPause={pauseGame} />
      )}

      {/* Countdown */}
      {state.status === 'countdown' && <GameCountdown onComplete={beginPlaying} />}

      {/* Pause menu */}
      <PauseMenu
        isOpen={state.status === 'paused'}
        onResume={resumeGame}
        onRestart={handleRestart}
        onQuit={quitGame}
        gameName="Cosmic Word Defense"
      />

      {/* Game over */}
      {state.status === 'gameover' && (
        <CosmicGameOver
          state={state}
          onRestart={handleRestart}
          onSubmitScore={handleSubmitScore}
          bestScore={cosmicSave.bestScore}
        />
      )}
    </div>
  );
}
