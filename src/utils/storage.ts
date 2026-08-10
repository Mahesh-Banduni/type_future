import { TestResult, Statistics, HistoryEntry, UserSettings, LearnProgress } from '@/types';

const STATS_KEY = 'typefuture_stats';
const HISTORY_KEY = 'typefuture_history';
const SETTINGS_KEY = 'typefuture_settings';
const SHUFFLE_KEY = 'typefuture_shuffle';
const LEARN_KEY = 'typefuture_learn';

// Safe read
function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Safe write
function safeSet<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage quota or access failure — silently ignore
  }
}

// ─── Statistics ───────────────────────────────────────────────────────────────

const defaultStats: Statistics = {
  totalTests: 0,
  averageWpm: 0,
  highestWpm: 0,
  lowestWpm: Infinity,
  averageAccuracy: 0,
  totalTypingTimeSeconds: 0,
  totalWordsTyped: 0,
  totalCharsTyped: 0,
  totalMistakes: 0,
  bestScore: 0,
  currentStreak: 0,
  lastTestDate: null,
};

export function getStats(): Statistics {
  return safeGet<Statistics>(STATS_KEY, defaultStats);
}

export function saveStats(stats: Statistics): void {
  safeSet(STATS_KEY, stats);
}

export function updateStatsWithResult(result: TestResult): Statistics {
  const prev = getStats();
  const n = prev.totalTests + 1;
  const updated: Statistics = {
    totalTests: n,
    averageWpm: Math.round((prev.averageWpm * (n - 1) + result.wpm) / n),
    highestWpm: Math.max(prev.highestWpm, result.wpm),
    lowestWpm: Math.min(prev.lowestWpm === Infinity ? result.wpm : prev.lowestWpm, result.wpm),
    averageAccuracy: Math.round((prev.averageAccuracy * (n - 1) + result.accuracy) / n),
    totalTypingTimeSeconds: prev.totalTypingTimeSeconds + result.duration,
    totalWordsTyped: prev.totalWordsTyped + result.totalWords,
    totalCharsTyped: prev.totalCharsTyped + result.totalChars,
    totalMistakes: prev.totalMistakes + result.errors,
    bestScore: Math.max(prev.bestScore, result.wpm),
    currentStreak: calcStreak(prev),
    lastTestDate: new Date().toISOString().split('T')[0],
  };
  saveStats(updated);
  return updated;
}

function calcStreak(prev: Statistics): number {
  const today = new Date().toISOString().split('T')[0];
  if (!prev.lastTestDate) return 1;
  const last = new Date(prev.lastTestDate);
  const now = new Date(today);
  const diff = Math.floor((now.getTime() - last.getTime()) / 86400000);
  if (diff === 0) return prev.currentStreak; // same day
  if (diff === 1) return prev.currentStreak + 1; // consecutive
  return 1; // streak broken
}

// ─── History ──────────────────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  return safeGet<HistoryEntry[]>(HISTORY_KEY, []);
}

export function addHistoryEntry(result: TestResult): HistoryEntry {
  const entry: HistoryEntry = {
    ...result,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  const history = getHistory();
  history.unshift(entry); // newest first
  safeSet(HISTORY_KEY, history.slice(0, 500)); // cap at 500
  return entry;
}

export function clearHistory(): void {
  safeSet(HISTORY_KEY, []);
}

export function clearStats(): void {
  safeSet(STATS_KEY, defaultStats);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export const defaultSettings: UserSettings = {
  theme: 'dark',
  fontSize: 'md',
  fontFamily: 'mono',
  lineSpacing: 'normal',
  charSpacing: 'normal',
  caretStyle: 'line',
  soundEnabled: false,
  errorSoundEnabled: false,
  completionSoundEnabled: false,
  characterAnimation: true,
  blurCompleted: false,
  showPunctuation: true,
  showNumbers: true,
  difficulty: 'medium',
  duration: 30,

  // Font settings
  fontWeight: 400,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.7,

  // Typing area
  textWidth: 100,
  textAlignment: 'left',
  paragraphSpacing: 16,
  completedOpacity: 1,
  upcomingOpacity: 1,
  cursorThickness: 2,
  cursorColor: '',
  cursorBlinkSpeed: 1.1,

  // Color customization
  customColorsEnabled: false,
  customColors: {},

  // UI controls
  showNavbar: true,
  showFooter: true,
  collapseStats: false,
  showSidebar: true,
  compactMode: false,
  focusMode: false,
  distractionFree: false,
  hideCompletedText: false,
  highlightCurrentWord: false,
  highlightCurrentLine: false,

  // Animation
  animationsEnabled: true,
  animationSpeed: 1,
  typingAnimations: true,
  themeTransitionAnimations: true,
  buttonHoverAnimations: true,
  cardAnimations: true,
  pageTransitions: true,

  // Sound
  keypressSoundType: 'click',
  errorSoundType: 'buzz',
  successSoundEnabled: false,
  masterVolume: 0.5,
  muteAllSounds: false,

  // Accessibility
  highContrastMode: false,
  largerText: false,
  keyboardNavigation: false,
  reducedMotion: false,
  screenReaderOptimization: false,
  colorblindMode: 'none',

  // Practice preferences
  defaultDifficulty: 'medium',
  defaultDuration: 30,
  defaultPracticeMode: 'normal',
  autoRestart: false,
  autoFocusInput: true,
  countdownBeforeStart: 0,
  randomParagraphBehavior: true,
  ignorePunctuation: false,
  ignoreCapitalization: false,
  ignoreExtraSpaces: false,

  // Statistics display
  showLiveWPM: true,
  showLiveCPM: true,
  showLiveAccuracy: true,
  showErrorCount: true,
  showProgressPercentage: true,
  showRemainingTime: true,
  showCurrentStreak: true,
};

export function getSettings(): UserSettings {
  return { ...defaultSettings, ...safeGet<Partial<UserSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: UserSettings): void {
  safeSet(SETTINGS_KEY, settings);
}

// ─── Shuffle State ────────────────────────────────────────────────────────────

type ShuffleState = Record<string, number[]>;

export function getShuffleState(): ShuffleState {
  return safeGet<ShuffleState>(SHUFFLE_KEY, {});
}

export function saveShuffleState(state: ShuffleState): void {
  safeSet(SHUFFLE_KEY, state);
}

// ─── Learn Progress ───────────────────────────────────────────────────────────

const defaultLearnProgress: LearnProgress = {
  completedLessons: [],
  highestUnlockedLevel: 1,
  bestScores: {},
  practiceStreak: 0,
  lastPracticeDate: null,
  unlockedAchievements: [],
};

export function getLearnProgress(): LearnProgress {
  return { ...defaultLearnProgress, ...safeGet<Partial<LearnProgress>>(LEARN_KEY, {}) };
}

export function saveLearnProgress(progress: LearnProgress): void {
  safeSet(LEARN_KEY, progress);
}

export function clearLearnProgress(): void {
  safeSet(LEARN_KEY, defaultLearnProgress);
}

// ─── Games ───────────────────────────────────────────────────────────────────────────────────

import {
  GameResult, LeaderboardEntry, GameAchievement,
  CosmicSave, ArcaneSave, PrecisionSave, GamesGlobalStats,
} from '@/types';

const LEADERBOARD_KEY = 'typefuture_leaderboard';
const ACHIEVEMENTS_KEY = 'typefuture_achievements';
const GAMES_STATS_KEY = 'typefuture_games_stats';
const COSMIC_SAVE_KEY = 'typefuture_cosmic_save';
const ARCANE_SAVE_KEY = 'typefuture_arcane_save';
const PRECISION_SAVE_KEY = 'typefuture_precision_save';

const DEFAULT_GAMES_STATS: GamesGlobalStats = {
  gamesPlayed: 0,
  totalPlaytime: 0,
  totalXP: 0,
  level: 1,
  bestCombo: 0,
  achievements: [],
};

export function getGamesStats(): GamesGlobalStats {
  return safeGet<GamesGlobalStats>(GAMES_STATS_KEY, DEFAULT_GAMES_STATS);
}

export function saveGamesStats(stats: GamesGlobalStats): void {
  safeSet(GAMES_STATS_KEY, stats);
}

export function recordGameResult(result: GameResult): GamesGlobalStats {
  const prev = getGamesStats();
  const xpGained = Math.floor(result.score / 100) + result.wpm;
  const totalXP = prev.totalXP + xpGained;
  const level = Math.floor(1 + Math.sqrt(totalXP / 500));
  const updated: GamesGlobalStats = {
    gamesPlayed: prev.gamesPlayed + 1,
    totalPlaytime: prev.totalPlaytime + result.duration,
    totalXP,
    level,
    bestCombo: Math.max(prev.bestCombo, result.combo),
    achievements: prev.achievements,
  };
  saveGamesStats(updated);
  return updated;
}

// Leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  return safeGet<LeaderboardEntry[]>(LEADERBOARD_KEY, []);
}

export function addLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id'>
): LeaderboardEntry {
  const full: LeaderboardEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  const board = getLeaderboard();
  board.push(full);
  // keep top 100 per game, sorted by score desc
  const sorted = board.sort((a, b) => b.score - a.score).slice(0, 200);
  safeSet(LEADERBOARD_KEY, sorted);
  return full;
}

// Achievements
export function getAchievements(): GameAchievement[] {
  return safeGet<GameAchievement[]>(ACHIEVEMENTS_KEY, []);
}

export function unlockAchievement(achievement: Omit<GameAchievement, 'unlockedAt'>): boolean {
  const achievements = getAchievements();
  const existing = achievements.find((a) => a.id === achievement.id);
  if (existing?.unlockedAt) return false; // already unlocked
  const unlocked: GameAchievement = { ...achievement, unlockedAt: Date.now() };
  if (existing) {
    const idx = achievements.indexOf(existing);
    achievements[idx] = unlocked;
  } else {
    achievements.push(unlocked);
  }
  safeSet(ACHIEVEMENTS_KEY, achievements);
  // also mark in global stats
  const stats = getGamesStats();
  if (!stats.achievements.includes(achievement.id)) {
    stats.achievements.push(achievement.id);
    saveGamesStats(stats);
  }
  return true;
}

// Game Saves
export function getCosmicSave(): CosmicSave {
  return safeGet<CosmicSave>(COSMIC_SAVE_KEY, {
    highestWave: 0, bestScore: 0, totalKills: 0, powerUpsUsed: 0,
  });
}
export function saveCosmicSave(s: CosmicSave): void { safeSet(COSMIC_SAVE_KEY, s); }

export function getArcaneSave(): ArcaneSave {
  return safeGet<ArcaneSave>(ARCANE_SAVE_KEY, {
    playerLevel: 1,
    playerXP: 0,
    currentRegion: 'mystic-forest',
    completedQuests: [],
    unlockedRegions: ['mystic-forest'],
    spells: ['fireball'],
  });
}
export function saveArcaneSave(s: ArcaneSave): void { safeSet(ARCANE_SAVE_KEY, s); }

export function getPrecisionSave(): PrecisionSave {
  return safeGet<PrecisionSave>(PRECISION_SAVE_KEY, {
    sessions: 0, totalKeystrokes: 0, keyStats: {},
  });
}
export function savePrecisionSave(s: PrecisionSave): void { safeSet(PRECISION_SAVE_KEY, s); }

