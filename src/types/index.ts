// ─── Difficulty & Duration ────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'medium' | 'master';
export type TestDuration = 30 | 60 | 120 | 300;

// ─── Paragraph ────────────────────────────────────────────────────────────────

export interface Paragraph {
  id: number;
  text: string;
}

// ─── Character States ─────────────────────────────────────────────────────────

export type CharState = 'untyped' | 'current' | 'correct' | 'incorrect' | 'extra' | 'missed';

export interface CharData {
  char: string;
  state: CharState;
  typed?: string; // what the user actually typed (for extra/incorrect)
}

// ─── Test Status ──────────────────────────────────────────────────────────────

export type TestStatus = 'idle' | 'running' | 'finished';

// ─── Test Result ──────────────────────────────────────────────────────────────

export interface TestResult {
  wpm: number;
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalChars: number;
  totalWords: number;
  errors: number;
  duration: TestDuration;
  difficulty: Difficulty;
  paragraphId: number;
  timestamp: number; // Date.now()
}

// ─── History Entry ────────────────────────────────────────────────────────────

export interface HistoryEntry extends TestResult {
  id: string; // uuid-like
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface Statistics {
  totalTests: number;
  averageWpm: number;
  highestWpm: number;
  lowestWpm: number;
  averageAccuracy: number;
  totalTypingTimeSeconds: number;
  totalWordsTyped: number;
  totalCharsTyped: number;
  totalMistakes: number;
  bestScore: number; // highest WPM ever
  currentStreak: number; // consecutive days
  lastTestDate: string | null; // ISO date string
}

// ─── User Settings ────────────────────────────────────────────────────────────

export type FontFamily = 'mono' | 'sans' | 'serif' | 'rounded' | 'dyslexic';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type LineSpacing = 'tight' | 'normal' | 'relaxed';
export type CharSpacing = 'tight' | 'normal' | 'wide';
export type CaretStyle = 'line' | 'block' | 'underline' | 'hidden';

export interface UserSettings {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  charSpacing: CharSpacing;
  caretStyle: CaretStyle;
  soundEnabled: boolean;
  errorSoundEnabled: boolean;
  completionSoundEnabled: boolean;
  characterAnimation: boolean;
  blurCompleted: boolean;
  showPunctuation: boolean;
  showNumbers: boolean;
  difficulty: Difficulty;
  duration: TestDuration;

  // Font Settings
  fontWeight: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;

  // Typing Area Customization
  textWidth: number;
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  paragraphSpacing: number;
  completedOpacity: number;
  upcomingOpacity: number;
  cursorThickness: number;
  cursorColor: string;
  cursorBlinkSpeed: number;

  // Color Customization
  customColorsEnabled: boolean;
  customColors: Record<string, string>;

  // UI Controls
  showNavbar: boolean;
  showFooter: boolean;
  collapseStats: boolean;
  showSidebar: boolean;
  compactMode: boolean;
  focusMode: boolean;
  distractionFree: boolean;
  hideCompletedText: boolean;
  highlightCurrentWord: boolean;
  highlightCurrentLine: boolean;

  // Animation Settings
  animationsEnabled: boolean;
  animationSpeed: number;
  typingAnimations: boolean;
  themeTransitionAnimations: boolean;
  buttonHoverAnimations: boolean;
  cardAnimations: boolean;
  pageTransitions: boolean;

  // Sound Settings
  keypressSoundType: 'click' | 'mechanical' | 'typewriter' | 'beep';
  errorSoundType: 'buzz' | 'beep' | 'none';
  successSoundEnabled: boolean;
  masterVolume: number;
  muteAllSounds: boolean;

  // Accessibility Settings
  highContrastMode: boolean;
  largerText: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  screenReaderOptimization: boolean;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

  // Practice Preferences
  defaultDifficulty: Difficulty;
  defaultDuration: TestDuration;
  defaultPracticeMode: 'normal' | 'practice';
  autoRestart: boolean;
  autoFocusInput: boolean;
  countdownBeforeStart: number;
  randomParagraphBehavior: boolean;
  ignorePunctuation: boolean;
  ignoreCapitalization: boolean;
  ignoreExtraSpaces: boolean;

  // Statistics Preferences
  showLiveWPM: boolean;
  showLiveCPM: boolean;
  showLiveAccuracy: boolean;
  showErrorCount: boolean;
  showProgressPercentage: boolean;
  showRemainingTime: boolean;
  showCurrentStreak: boolean;
}

// ─── Themes ───────────────────────────────────────────────────────────────────

export type ThemeName =
  | 'dark'
  | 'light'
  | 'system'
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'orange'
  | 'cyberpunk'
  | 'dracula'
  | 'solarized'
  | 'midnight'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'high-contrast'
  | 'paper'
  | 'sepia'
  | 'mint-light'
  | 'sakura-light'
  | 'lavender-light'
  | 'honey-light';

// ─── Beginner Learning Progress ───────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number; // timestamp
  icon: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  highestAccuracy: number;
  bestWpm: number;
  bestTime: number; // in seconds
  completedAt?: number;
}

export interface LearnProgress {
  completedLessons: string[];
  highestUnlockedLevel: number;
  bestScores: Record<string, { wpm: number; accuracy: number; time: number }>;
  practiceStreak: number;
  lastPracticeDate: string | null; // ISO date string
  unlockedAchievements: string[];
}

// ─── Live Stats ───────────────────────────────────────────────────────────────

export interface LiveStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  progress: number; // 0-100
  timeRemaining: number;
  wordsTyped: number;
}

// ─── Games Module ─────────────────────────────────────────────────────────────

export type GameId = 'cosmic-word-defense' | 'arcane-quest' | 'precision-trainer';

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'endless';

export interface GameResult {
  gameId: GameId;
  score: number;
  wpm: number;
  accuracy: number;
  combo: number;
  duration: number; // seconds played
  difficulty: GameDifficulty;
  timestamp: number;
  extraData?: Record<string, unknown>; // game-specific extras
}

export interface LeaderboardEntry {
  id: string;
  gameId: GameId;
  playerName: string;
  score: number;
  wpm: number;
  accuracy: number;
  combo: number;
  difficulty: GameDifficulty;
  timestamp: number;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  gameId: GameId | 'global';
  unlockedAt: number | null; // null = locked
}

export interface CosmicSave {
  highestWave: number;
  bestScore: number;
  totalKills: number;
  powerUpsUsed: number;
}

export interface ArcaneSave {
  playerLevel: number;
  playerXP: number;
  currentRegion: string;
  completedQuests: string[];
  unlockedRegions: string[];
  spells: string[];
}

export interface PrecisionSave {
  sessions: number;
  totalKeystrokes: number;
  keyStats: Record<string, { count: number; errors: number; totalMs: number }>;
}

export interface GamesGlobalStats {
  gamesPlayed: number;
  totalPlaytime: number; // seconds
  totalXP: number;
  level: number;
  bestCombo: number;
  achievements: string[]; // achievement ids
}
