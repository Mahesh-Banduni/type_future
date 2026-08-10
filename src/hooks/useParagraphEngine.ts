'use client';

import { useCallback, useRef } from 'react';
import { Difficulty, Paragraph } from '@/types';
import { getShuffleState, saveShuffleState } from '@/utils/storage';

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ParagraphEngine {
  getNextParagraph: (difficulty: Difficulty) => Promise<Paragraph>;
}

export function useParagraphEngine(): ParagraphEngine {
  // In-memory queues per difficulty, initialized lazily
  const queues = useRef<Partial<Record<Difficulty, Paragraph[]>>>({});

  const getNextParagraph = useCallback(async (difficulty: Difficulty): Promise<Paragraph> => {
    // Lazy-load data
    if (!queues.current[difficulty] || queues.current[difficulty]!.length === 0) {
      let data: Paragraph[];
      try {
        // Dynamic import — Next.js will bundle JSON at build time
        const mod = await import(`@/data/${difficulty}.json`);
        data = mod.default as Paragraph[];
      } catch {
        return { id: 0, text: 'The quick brown fox jumps over the lazy dog.' };
      }

      // Restore or create shuffle state
      const shuffleState = getShuffleState();
      let queue: number[];

      if (shuffleState[difficulty] && shuffleState[difficulty].length > 0) {
        queue = shuffleState[difficulty];
      } else {
        // Build new shuffled queue from IDs
        queue = shuffle(data.map((p) => p.id));
        const updated = { ...shuffleState, [difficulty]: queue };
        saveShuffleState(updated);
      }

      // Build full paragraph objects in shuffle order
      const paragraphMap = new Map(data.map((p) => [p.id, p]));
      queues.current[difficulty] = queue.map((id) => paragraphMap.get(id)!).filter(Boolean);
    }

    const queue = queues.current[difficulty]!;
    const paragraph = queue.shift()!;

    // Persist remaining queue
    const shuffleState = getShuffleState();
    saveShuffleState({
      ...shuffleState,
      [difficulty]: queue.map((p) => p.id),
    });

    // If queue is now empty, it will refill on next call
    return paragraph;
  }, []);

  return { getNextParagraph };
}
