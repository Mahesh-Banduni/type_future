'use client';

import { create } from 'zustand';
import { CharData, Difficulty, TestDuration, TestStatus, LiveStats } from '@/types';
import { buildCharData } from '@/utils/charState';

interface TypingState {
  // Paragraph
  paragraphId: number;
  paragraphText: string;
  difficulty: Difficulty;

  // Typing
  typedText: string;
  charData: CharData[];
  status: TestStatus;
  startTime: number | null;

  // Timer
  duration: TestDuration;
  timeRemaining: number;

  // Live stats
  liveStats: LiveStats;

  // Actions
  setParagraph: (id: number, text: string, difficulty: Difficulty) => void;
  setDifficulty: (d: Difficulty) => void;
  setDuration: (d: TestDuration) => void;
  startTest: () => void;
  updateTyped: (typed: string, charData: CharData[], stats: LiveStats) => void;
  tickTimer: () => void;
  finishTest: () => void;
  resetTest: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  paragraphId: 0,
  paragraphText: '',
  difficulty: 'medium',
  typedText: '',
  charData: [],
  status: 'idle',
  startTime: null,
  duration: 30,
  timeRemaining: 30,
  liveStats: {
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    incorrectChars: 0,
    progress: 0,
    timeRemaining: 30,
    wordsTyped: 0,
  },

  setParagraph: (id, text, difficulty) => {
    set({
      paragraphId: id,
      paragraphText: text,
      difficulty,
      charData: buildCharData(text),
      typedText: '',
      status: 'idle',
      startTime: null,
      liveStats: {
        wpm: 0,
        cpm: 0,
        accuracy: 100,
        errors: 0,
        correctChars: 0,
        incorrectChars: 0,
        progress: 0,
        timeRemaining: get().duration,
        wordsTyped: 0,
      },
    });
  },

  setDifficulty: (d) => set({ difficulty: d }),
  setDuration: (d) =>
    set({ duration: d, timeRemaining: d, liveStats: { ...get().liveStats, timeRemaining: d } }),

  startTest: () => {
    set({ status: 'running', startTime: Date.now(), timeRemaining: get().duration });
  },

  updateTyped: (typed, charData, stats) => {
    set({ typedText: typed, charData, liveStats: stats });
  },

  tickTimer: () => {
    const { timeRemaining } = get();
    const newTime = Math.max(0, timeRemaining - 1);
    set({ timeRemaining: newTime });
    if (newTime === 0) {
      set({ status: 'finished' });
    }
  },

  finishTest: () => {
    set({ status: 'finished' });
  },

  resetTest: () => {
    const { paragraphText, duration } = get();
    set({
      typedText: '',
      charData: buildCharData(paragraphText),
      status: 'idle',
      startTime: null,
      timeRemaining: duration,
      liveStats: {
        wpm: 0,
        cpm: 0,
        accuracy: 100,
        errors: 0,
        correctChars: 0,
        incorrectChars: 0,
        progress: 0,
        timeRemaining: duration,
        wordsTyped: 0,
      },
    });
  },
}));
