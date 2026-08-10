'use client';

import { create } from 'zustand';
import { LearnProgress } from '@/types';
import { getLearnProgress, saveLearnProgress, clearLearnProgress } from '@/utils/storage';
import { LEVELS, ACHIEVEMENTS, Exercise, Lesson } from '@/data/lessons';

interface ActiveSessionStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalTyped: number;
  startTime: number | null;
  elapsedSeconds: number;
}

interface LearnState extends LearnProgress {
  hydrated: boolean;

  // Active session
  activeLevel: number | null;       // 1-10
  activeLesson: Lesson | null;
  activeExerciseIndex: number;
  typedText: string;
  sessionStats: ActiveSessionStats;
  sessionStatus: 'idle' | 'running' | 'exercise-complete' | 'lesson-complete';
  feedback: string;
  newlyUnlockedAchievements: string[];

  // Actions
  hydrate: () => void;
  startLesson: (level: number, lesson: Lesson) => void;
  updateTyped: (typed: string, stats: ActiveSessionStats) => void;
  completeExercise: (stats: ActiveSessionStats) => void;
  nextExercise: () => void;
  completeLesson: (finalWpm: number, finalAccuracy: number, finalTime: number) => void;
  resetSession: () => void;
  clearAllProgress: () => void;
  setFeedback: (msg: string) => void;
  dismissNewAchievements: () => void;
}

const defaultStats: ActiveSessionStats = {
  wpm: 0,
  accuracy: 100,
  errors: 0,
  correctChars: 0,
  totalTyped: 0,
  startTime: null,
  elapsedSeconds: 0,
};

export const useLearnStore = create<LearnState>((set, get) => ({
  // Progress
  completedLessons: [],
  highestUnlockedLevel: 1,
  bestScores: {},
  practiceStreak: 0,
  lastPracticeDate: null,
  unlockedAchievements: [],

  hydrated: false,

  // Session
  activeLevel: null,
  activeLesson: null,
  activeExerciseIndex: 0,
  typedText: '',
  sessionStats: defaultStats,
  sessionStatus: 'idle',
  feedback: '',
  newlyUnlockedAchievements: [],

  hydrate: () => {
    if (get().hydrated) return;
    const saved = getLearnProgress();
    set({ ...saved, hydrated: true });
  },

  startLesson: (level, lesson) => {
    set({
      activeLevel: level,
      activeLesson: lesson,
      activeExerciseIndex: 0,
      typedText: '',
      sessionStats: defaultStats,
      sessionStatus: 'idle',
      feedback: '',
    });
  },

  updateTyped: (typed, stats) => {
    set({ typedText: typed, sessionStats: stats });
    if (stats.startTime && get().sessionStatus === 'idle') {
      set({ sessionStatus: 'running' });
    }
  },

  completeExercise: (stats) => {
    set({ sessionStats: stats, sessionStatus: 'exercise-complete' });
  },

  nextExercise: () => {
    const { activeLesson, activeExerciseIndex } = get();
    if (!activeLesson) return;
    const next = activeExerciseIndex + 1;
    if (next >= activeLesson.exercises.length) {
      set({ sessionStatus: 'lesson-complete' });
    } else {
      set({
        activeExerciseIndex: next,
        typedText: '',
        sessionStats: defaultStats,
        sessionStatus: 'idle',
        feedback: '',
      });
    }
  },

  completeLesson: (finalWpm, finalAccuracy, finalTime) => {
    const state = get();
    const { activeLesson, activeLevel } = state;
    if (!activeLesson || !activeLevel) return;

    const lessonId = activeLesson.id;

    // Update completed lessons
    const completedLessons = state.completedLessons.includes(lessonId)
      ? state.completedLessons
      : [...state.completedLessons, lessonId];

    // Update best scores
    const prev = state.bestScores[lessonId];
    const bestScores = {
      ...state.bestScores,
      [lessonId]: {
        wpm: Math.max(finalWpm, prev?.wpm ?? 0),
        accuracy: Math.max(finalAccuracy, prev?.accuracy ?? 0),
        time: prev?.time ? Math.min(finalTime, prev.time) : finalTime,
      },
    };

    // Update level unlock — check if this level's lessons are all done
    const currentLevelData = LEVELS.find(l => l.id === activeLevel);
    const allLevelLessonsDone = currentLevelData?.lessons.every(l =>
      completedLessons.includes(l.id)
    ) ?? false;

    const highestUnlockedLevel = allLevelLessonsDone
      ? Math.min(10, Math.max(state.highestUnlockedLevel, activeLevel + 1))
      : state.highestUnlockedLevel;

    // Streak update
    const today = new Date().toISOString().split('T')[0];
    let practiceStreak = state.practiceStreak;
    if (state.lastPracticeDate !== today) {
      const last = state.lastPracticeDate ? new Date(state.lastPracticeDate) : null;
      const diff = last ? Math.floor((Date.now() - last.getTime()) / 86400000) : 99;
      practiceStreak = diff === 1 ? practiceStreak + 1 : 1;
    }

    // Check achievements
    const allWpm = Object.values(bestScores).map(s => s.wpm);
    const allAccuracy = Object.values(bestScores).map(s => s.accuracy);
    const highestWpm = allWpm.length > 0 ? Math.max(...allWpm) : 0;
    const highestAccuracy = allAccuracy.length > 0 ? Math.max(...allAccuracy) : 0;

    const achievementCtx = { completedLessons, highestAccuracy, highestWpm, highestLevel: highestUnlockedLevel };
    const newlyUnlocked: string[] = [];
    const updatedAchievements = [...state.unlockedAchievements];
    for (const ach of ACHIEVEMENTS) {
      if (!updatedAchievements.includes(ach.id) && ach.condition(achievementCtx)) {
        updatedAchievements.push(ach.id);
        newlyUnlocked.push(ach.id);
      }
    }

    const updated: LearnProgress = {
      completedLessons,
      highestUnlockedLevel,
      bestScores,
      practiceStreak,
      lastPracticeDate: today,
      unlockedAchievements: updatedAchievements,
    };

    saveLearnProgress(updated);
    set({
      ...updated,
      sessionStatus: 'lesson-complete',
      newlyUnlockedAchievements: newlyUnlocked,
    });
  },

  resetSession: () => {
    set({
      activeLevel: null,
      activeLesson: null,
      activeExerciseIndex: 0,
      typedText: '',
      sessionStats: defaultStats,
      sessionStatus: 'idle',
      feedback: '',
      newlyUnlockedAchievements: [],
    });
  },

  clearAllProgress: () => {
    clearLearnProgress();
    set({
      completedLessons: [],
      highestUnlockedLevel: 1,
      bestScores: {},
      practiceStreak: 0,
      lastPracticeDate: null,
      unlockedAchievements: [],
    });
  },

  setFeedback: (feedback) => set({ feedback }),

  dismissNewAchievements: () => set({ newlyUnlockedAchievements: [] }),
}));

// Helper to get current active exercise
export function getActiveExercise(lesson: Lesson | null, index: number): Exercise | null {
  return lesson?.exercises[index] ?? null;
}
