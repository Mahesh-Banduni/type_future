'use client';

import { create } from 'zustand';
import { HistoryEntry, Statistics, TestResult } from '@/types';
import {
  getStats,
  getHistory,
  updateStatsWithResult,
  addHistoryEntry,
  clearHistory,
  clearStats,
} from '@/utils/storage';

interface StatsState {
  stats: Statistics;
  history: HistoryEntry[];
  hydrated: boolean;
  hydrate: () => void;
  recordResult: (result: TestResult) => void;
  clearAllHistory: () => void;
  clearAllStats: () => void;
}

const defaultStats: Statistics = {
  totalTests: 0,
  averageWpm: 0,
  highestWpm: 0,
  lowestWpm: 0,
  averageAccuracy: 0,
  totalTypingTimeSeconds: 0,
  totalWordsTyped: 0,
  totalCharsTyped: 0,
  totalMistakes: 0,
  bestScore: 0,
  currentStreak: 0,
  lastTestDate: null,
};

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: defaultStats,
  history: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({
      stats: getStats(),
      history: getHistory(),
      hydrated: true,
    });
  },

  recordResult: (result: TestResult) => {
    const updatedStats = updateStatsWithResult(result);
    const entry = addHistoryEntry(result);
    set((state) => ({
      stats: updatedStats,
      history: [entry, ...state.history].slice(0, 500),
    }));
  },

  clearAllHistory: () => {
    clearHistory();
    set({ history: [] });
  },

  clearAllStats: () => {
    clearStats();
    set({ stats: defaultStats });
  },
}));
