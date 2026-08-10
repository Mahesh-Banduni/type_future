'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameDifficulty } from '@/types';
import { getCosmicWordForWave, COSMIC_WORDS } from '@/data/gameWords';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnemyType = 'scout' | 'fighter' | 'bomber' | 'shield' | 'drone' | 'cruiser' | 'boss';

export interface Enemy {
  id: string;
  word: string;
  type: EnemyType;
  x: number;      // 0-100% of canvas width
  y: number;      // 0-100% of canvas height
  speed: number;  // px per second
  hp: number;
  maxHp: number;
  points: number;
  icon: string;
  color: string;
  size: number;
}

export type PowerUpType = 'freeze' | 'double-score' | 'slow' | 'shield' | 'extra-life' | 'emp';

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number; // Date.now() + duration
}

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface CosmicGameState {
  status: GameStatus;
  score: number;
  combo: number;
  lives: number;
  wave: number;
  accuracy: number;
  wpm: number;
  timeRemaining: number;
  enemies: Enemy[];
  targetedId: string | null;
  typedSoFar: string;
  activePowerUps: ActivePowerUp[];
  kills: number;
  totalChars: number;
  correctChars: number;
  wordsCompleted: number;
  difficulty: GameDifficulty;
  duration: number; // total seconds
  explosions: { id: string; x: number; y: number; at: number }[];
}

const ENEMY_CONFIGS: Record<EnemyType, { icon: string; color: string; speedMult: number; hpMult: number; pointsMult: number; size: number }> = {
  scout:   { icon: '🛸', color: '#60a5fa', speedMult: 1.4, hpMult: 0.7, pointsMult: 1,   size: 36 },
  fighter: { icon: '🚀', color: '#a78bfa', speedMult: 1.0, hpMult: 1.0, pointsMult: 1.5, size: 40 },
  bomber:  { icon: '💣', color: '#f97316', speedMult: 0.7, hpMult: 1.5, pointsMult: 2,   size: 44 },
  shield:  { icon: '🛡️', color: '#34d399', speedMult: 0.8, hpMult: 2.0, pointsMult: 2.5, size: 42 },
  drone:   { icon: '🤖', color: '#fb7185', speedMult: 1.8, hpMult: 0.5, pointsMult: 1.2, size: 30 },
  cruiser: { icon: '🛩️', color: '#fbbf24', speedMult: 0.6, hpMult: 3.0, pointsMult: 4,   size: 52 },
  boss:    { icon: '👾', color: '#c084fc', speedMult: 0.5, hpMult: 8.0, pointsMult: 15,  size: 64 },
};

function pickEnemyType(wave: number): EnemyType {
  if (wave % 5 === 0) return 'boss';
  const types: EnemyType[] = ['scout', 'fighter', 'bomber', 'shield', 'drone', 'cruiser'];
  const available = types.slice(0, Math.min(2 + Math.floor(wave / 2), types.length));
  return available[Math.floor(Math.random() * available.length)];
}

function spawnEnemy(wave: number, difficulty: GameDifficulty, id: string): Enemy {
  const type = pickEnemyType(wave);
  const cfg = ENEMY_CONFIGS[type];
  const diffMult = difficulty === 'easy' ? 0.7 : difficulty === 'hard' ? 1.4 : difficulty === 'endless' ? 1.8 : 1.0;
  const baseSpeed = (25 + wave * 3) * diffMult;
  const baseHp = type === 'boss' ? 3 : 1;
  const pool = wave <= 2 ? COSMIC_WORDS.easy : wave <= 5 ? [...COSMIC_WORDS.easy, ...COSMIC_WORDS.medium] : wave % 5 === 0 ? COSMIC_WORDS.boss : COSMIC_WORDS.medium;
  const word = pool[Math.floor(Math.random() * pool.length)];

  return {
    id,
    word,
    type,
    x: 5 + Math.random() * 85,
    y: -8,
    speed: baseSpeed * cfg.speedMult,
    hp: baseHp * cfg.hpMult,
    maxHp: baseHp * cfg.hpMult,
    points: Math.ceil(word.length * 10 * cfg.pointsMult * (1 + wave * 0.1)),
    icon: cfg.icon,
    color: cfg.color,
    size: cfg.size,
  };
}

const DURATION_MAP: Record<GameDifficulty, number> = {
  easy: 120, medium: 300, hard: 600, endless: Infinity,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCosmicGame() {
  const [state, setState] = useState<CosmicGameState>({
    status: 'idle',
    score: 0, combo: 0, lives: 3, wave: 1,
    accuracy: 100, wpm: 0, timeRemaining: 120,
    enemies: [], targetedId: null, typedSoFar: '',
    activePowerUps: [], kills: 0,
    totalChars: 0, correctChars: 0, wordsCompleted: 0,
    difficulty: 'medium', duration: 300,
    explosions: [],
  });

  const loopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const totalCharsTypedRef = useRef(0);
  const enemyIdRef = useRef(0);

  // ── Start game ──────────────────────────────────────────────────────────────
  const startGame = useCallback((difficulty: GameDifficulty) => {
    const duration = DURATION_MAP[difficulty];
    totalCharsTypedRef.current = 0;
    enemyIdRef.current = 0;
    setState({
      status: 'countdown',
      score: 0, combo: 0, lives: 3, wave: 1,
      accuracy: 100, wpm: 0, timeRemaining: duration,
      enemies: [], targetedId: null, typedSoFar: '',
      activePowerUps: [], kills: 0,
      totalChars: 0, correctChars: 0, wordsCompleted: 0,
      difficulty, duration,
      explosions: [],
    });
  }, []);

  const beginPlaying = useCallback(() => {
    startTimeRef.current = Date.now();
    lastTickRef.current = Date.now();
    spawnTimerRef.current = 0;
    setState((s) => ({ ...s, status: 'playing' }));
  }, []);

  const pauseGame = useCallback(() => setState((s) => ({ ...s, status: 'paused' })), []);
  const resumeGame = useCallback(() => {
    lastTickRef.current = Date.now();
    setState((s) => ({ ...s, status: 'playing' }));
  }, []);
  const quitGame = useCallback(() => setState((s) => ({ ...s, status: 'idle' })), []);

  // ── Keyboard handler ─────────────────────────────────────────────────────────
  const handleKey = useCallback((key: string) => {
    setState((s) => {
      if (s.status !== 'playing') return s;

      // Backspace
      if (key === 'Backspace') {
        return { ...s, typedSoFar: s.typedSoFar.slice(0, -1) };
      }

      // Only allow printable single chars
      if (key.length !== 1) return s;

      totalCharsTypedRef.current++;
      const newTyped = s.typedSoFar + key;

      // Find or keep target
      let targetId = s.targetedId;

      // Auto-target: find enemy whose word starts with newTyped
      if (!targetId || !s.enemies.find((e) => e.id === targetId && e.word.startsWith(newTyped))) {
        const match = s.enemies.find((e) => e.word.startsWith(newTyped));
        targetId = match?.id ?? null;
      }

      if (!targetId) {
        // Wrong key — bust combo
        return {
          ...s,
          typedSoFar: '',
          combo: 0,
          totalChars: s.totalChars + 1,
        };
      }

      const target = s.enemies.find((e) => e.id === targetId)!;
      const isCorrectChar = target.word[newTyped.length - 1] === key;

      if (!isCorrectChar) {
        return { ...s, typedSoFar: '', combo: 0, totalChars: s.totalChars + 1 };
      }

      const newCorrectChars = s.correctChars + 1;
      const newTotalChars = s.totalChars + 1;

      // Word complete?
      if (newTyped === target.word) {
        const hasDoubleScore = s.activePowerUps.some((p) => p.type === 'double-score' && p.expiresAt > Date.now());
        const newCombo = s.combo + 1;
        const comboMult = 1 + Math.floor(newCombo / 5) * 0.5;
        const pts = Math.ceil(target.points * comboMult * (hasDoubleScore ? 2 : 1));
        const explosion = { id: `exp-${Date.now()}`, x: target.x, y: target.y, at: Date.now() };

        return {
          ...s,
          score: s.score + pts,
          combo: newCombo,
          kills: s.kills + 1,
          wordsCompleted: s.wordsCompleted + 1,
          enemies: s.enemies.filter((e) => e.id !== targetId),
          targetedId: null,
          typedSoFar: '',
          correctChars: newCorrectChars,
          totalChars: newTotalChars,
          explosions: [...s.explosions, explosion],
        };
      }

      return {
        ...s,
        typedSoFar: newTyped,
        targetedId: targetId,
        correctChars: newCorrectChars,
        totalChars: newTotalChars,
      };
    });
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.status !== 'playing') {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setState((s) => {
        if (s.status !== 'playing') return s;

        const elapsed = (now - startTimeRef.current) / 1000;
        const isFrozen = s.activePowerUps.some((p) => p.type === 'freeze' && p.expiresAt > now);
        const isSlowed = s.activePowerUps.some((p) => p.type === 'slow' && p.expiresAt > now);
        const speedMult = isFrozen ? 0 : isSlowed ? 0.3 : 1;

        // Move enemies
        const movedEnemies = s.enemies.map((e) => ({
          ...e,
          y: e.y + (e.speed * dt * speedMult),
        }));

        // Enemies that reached the bottom
        const escaped = movedEnemies.filter((e) => e.y >= 100);
        const remaining = movedEnemies.filter((e) => e.y < 100);
        const newLives = Math.max(0, s.lives - escaped.length);

        // Spawn
        spawnTimerRef.current += dt;
        const spawnInterval = Math.max(0.4, 2.5 - s.wave * 0.1 - (s.difficulty === 'hard' ? 0.5 : 0) - (s.difficulty === 'endless' ? 0.8 : 0));
        let newEnemies = remaining;
        if (spawnTimerRef.current >= spawnInterval && remaining.length < 12) {
          spawnTimerRef.current = 0;
          newEnemies = [...remaining, spawnEnemy(s.wave, s.difficulty, `enemy-${enemyIdRef.current++}`)];
        }

        // Wave progression
        const newWave = Math.floor(elapsed / 30) + 1;

        // WPM
        const minutesElapsed = elapsed / 60;
        const wpm = minutesElapsed > 0 ? Math.round(s.wordsCompleted / minutesElapsed) : 0;

        // Accuracy
        const accuracy = s.totalChars > 0 ? Math.round((s.correctChars / s.totalChars) * 100) : 100;

        // Time remaining
        const timeRemaining = s.duration === Infinity ? Infinity : Math.max(0, s.duration - elapsed);

        // Clean old explosions
        const explosions = s.explosions.filter((ex) => now - ex.at < 600);

        // Active power-ups: remove expired
        const activePowerUps = s.activePowerUps.filter((p) => p.expiresAt > now);

        // Check game over
        if (newLives <= 0 || (s.duration !== Infinity && timeRemaining <= 0)) {
          return { ...s, status: 'gameover', lives: 0, enemies: [], explosions };
        }

        return {
          ...s,
          enemies: newEnemies,
          lives: newLives,
          wave: newWave,
          wpm,
          accuracy,
          timeRemaining,
          activePowerUps,
          explosions,
        };
      });

      loopRef.current = requestAnimationFrame(tick);
    };

    loopRef.current = requestAnimationFrame(tick);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [state.status]);

  // ── Power-up activation ──────────────────────────────────────────────────
  const activatePowerUp = useCallback((type: PowerUpType, durationMs = 5000) => {
    const powerUp: ActivePowerUp = { type, expiresAt: Date.now() + durationMs };
    setState((s) => {
      const filtered = s.activePowerUps.filter((p) => p.type !== type);
      const extra = type === 'extra-life' ? { lives: Math.min(s.lives + 1, 5) } : {};
      const empEnemies = type === 'emp' ? [] : s.enemies;
      return { ...s, activePowerUps: [...filtered, powerUp], ...extra, enemies: empEnemies };
    });
  }, []);

  return { state, startGame, beginPlaying, pauseGame, resumeGame, quitGame, handleKey, activatePowerUp };
}
