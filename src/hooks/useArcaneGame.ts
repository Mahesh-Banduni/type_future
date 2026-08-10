'use client';

import { useCallback, useRef, useState } from 'react';
import { ARCANE_REGIONS, ArcaneRegion, ArcaneQuest, ArcaneEnemy, SPELLS } from '@/data/arcaneWorld';
import { ARCANE_WORDS } from '@/data/gameWords';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArcanePhase = 'world-map' | 'dialogue' | 'combat' | 'victory' | 'defeat' | 'quest-complete';

export interface ArcanePlayerState {
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  spells: string[];
  completedQuests: string[];
  unlockedRegions: string[];
  currentRegion: string;
}

export interface CombatState {
  enemy: ArcaneEnemy;
  quest: ArcaneQuest;
  region: ArcaneRegion;
  enemyHp: number;
  words: string[];          // queue of words to type
  currentWordIdx: number;
  typedSoFar: string;
  combo: number;
  wpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  wordsTyped: number;
  score: number;
  spellEffect: string | null; // spell being cast
  dialogueIdx: number;
  phase: ArcanePhase;
}

function xpToLevel(xp: number): number {
  return Math.floor(1 + Math.sqrt(xp / 200));
}

function xpForNextLevel(level: number): number {
  return level * level * 200;
}

const STARTING_STATE: ArcanePlayerState = {
  level: 1, xp: 0, hp: 100, maxHp: 100, mp: 60, maxMp: 60,
  spells: ['fireball'], completedQuests: [],
  unlockedRegions: ['mystic-forest'], currentRegion: 'mystic-forest',
};

export function useArcaneGame() {
  const [player, setPlayer] = useState<ArcanePlayerState>(STARTING_STATE);
  const [combat, setCombat] = useState<CombatState | null>(null);
  const [phase, setPhase] = useState<ArcanePhase>('world-map');
  const startTimeRef = useRef<number>(0);

  // ── Load save ──────────────────────────────────────────────────────────────
  const loadSave = useCallback((save: Partial<ArcanePlayerState>) => {
    setPlayer((p) => ({ ...STARTING_STATE, ...save, hp: save.maxHp ?? p.maxHp }));
  }, []);

  // ── Start quest ──────────────────────────────────────────────────────────
  const startQuest = useCallback((questId: string) => {
    let foundRegion: ArcaneRegion | undefined;
    let foundQuest: ArcaneQuest | undefined;
    let foundEnemy: ArcaneEnemy | undefined;

    for (const region of ARCANE_REGIONS) {
      const quest = region.quests.find((q) => q.id === questId);
      if (quest) {
        foundRegion = region;
        foundQuest = quest;
        foundEnemy = quest.type === 'boss'
          ? region.enemies.find((e) => e.isBoss) ?? region.enemies[region.enemies.length - 1]
          : region.enemies.find((e) => !e.isBoss) ?? region.enemies[0];
        break;
      }
    }

    if (!foundRegion || !foundQuest || !foundEnemy) return;

    // Build word list for combat
    const pool = ARCANE_WORDS[foundRegion.id] ?? ARCANE_WORDS['mystic-forest'];
    const wordCount = foundQuest.wordCount;
    const words = Array.from({ length: wordCount }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    );

    setCombat({
      enemy: foundEnemy,
      quest: foundQuest,
      region: foundRegion,
      enemyHp: foundEnemy.hp,
      words,
      currentWordIdx: 0,
      typedSoFar: '',
      combo: 0, wpm: 0, accuracy: 100,
      totalChars: 0, correctChars: 0, wordsTyped: 0, score: 0,
      spellEffect: null,
      dialogueIdx: 0,
      phase: 'dialogue',
    });
    setPhase('dialogue');
    startTimeRef.current = Date.now();
  }, []);

  // ── Advance dialogue ──────────────────────────────────────────────────────
  const advanceDialogue = useCallback(() => {
    setCombat((c) => {
      if (!c) return c;
      const total = c.quest.dialogues.length;
      if (c.dialogueIdx + 1 >= total) {
        startTimeRef.current = Date.now();
        return { ...c, phase: 'combat', dialogueIdx: total - 1 };
      }
      return { ...c, dialogueIdx: c.dialogueIdx + 1 };
    });
    setPhase('combat');
  }, []);

  // ── Handle key in combat ──────────────────────────────────────────────────
  const handleCombatKey = useCallback((key: string) => {
    setCombat((c) => {
      if (!c || c.phase !== 'combat') return c;
      if (key === 'Backspace') return { ...c, typedSoFar: c.typedSoFar.slice(0, -1) };
      if (key.length !== 1) return c;

      const currentWord = c.words[c.currentWordIdx] ?? '';
      const newTyped = c.typedSoFar + key;
      const newTotalChars = c.totalChars + 1;
      const isCorrect = currentWord.startsWith(newTyped);

      if (!isCorrect) {
        return { ...c, typedSoFar: '', combo: 0, totalChars: newTotalChars };
      }

      const newCorrectChars = c.correctChars + 1;

      if (newTyped === currentWord) {
        // Word complete!
        const newCombo = c.combo + 1;
        const comboMult = 1 + Math.floor(newCombo / 3) * 0.5;
        const dmg = Math.ceil(currentWord.length * 5 * comboMult);
        const newEnemyHp = Math.max(0, c.enemyHp - dmg);
        const newWordIdx = c.currentWordIdx + 1;
        const newWordsTyped = c.wordsTyped + 1;
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        const newWpm = Math.round(newWordsTyped / Math.max(elapsed, 0.01));
        const newAccuracy = Math.round((newCorrectChars / newTotalChars) * 100);
        const spellKeys = c.region ? Object.keys(SPELLS) : [];
        const spellEffect = spellKeys[Math.floor(Math.random() * spellKeys.length)];

        // Check victory
        const allWordsTyped = newWordIdx >= c.words.length;
        const enemyDefeated = newEnemyHp <= 0;
        const newPhase = (allWordsTyped || enemyDefeated) ? 'victory' : 'combat';

        return {
          ...c,
          typedSoFar: '',
          currentWordIdx: newWordIdx,
          enemyHp: newEnemyHp,
          combo: newCombo,
          wpm: newWpm,
          accuracy: newAccuracy,
          totalChars: newTotalChars,
          correctChars: newCorrectChars,
          wordsTyped: newWordsTyped,
          score: c.score + dmg * 10,
          spellEffect,
          phase: newPhase,
        };
      }

      return { ...c, typedSoFar: newTyped, correctChars: newCorrectChars, totalChars: newTotalChars };
    });
  }, []);

  // ── Complete quest ─────────────────────────────────────────────────────────
  const completeQuest = useCallback(() => {
    if (!combat) return;
    const reward = combat.quest.reward;
    setPlayer((p) => {
      const newXP = p.xp + reward.xp;
      const newLevel = xpToLevel(newXP);
      const hpBonus = newLevel > p.level ? 20 : 0;
      const newSpells = reward.spell && !p.spells.includes(reward.spell)
        ? [...p.spells, reward.spell]
        : p.spells;
      const newCompletedQuests = [...p.completedQuests, combat.quest.id];
      return {
        ...p,
        xp: newXP,
        level: newLevel,
        hp: Math.min(p.maxHp + hpBonus, p.hp + 30),
        maxHp: p.maxHp + hpBonus,
        spells: newSpells,
        completedQuests: newCompletedQuests,
      };
    });
    setCombat(null);
    setPhase('world-map');
  }, [combat]);

  const returnToMap = useCallback(() => {
    setCombat(null);
    setPhase('world-map');
  }, []);

  const xpNeeded = xpForNextLevel(player.level);

  return {
    player, combat, phase,
    xpNeeded,
    loadSave, startQuest, advanceDialogue, handleCombatKey, completeQuest, returnToMap,
  };
}
