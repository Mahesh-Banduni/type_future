import { CharData, CharState } from '@/types';

/**
 * Build the initial CharData array from a paragraph string.
 * Position 0 starts as 'current', rest as 'untyped'.
 */
export function buildCharData(text: string): CharData[] {
  return text.split('').map((char, i) => ({
    char,
    state: i === 0 ? 'current' : 'untyped',
  }));
}

/**
 * Compute the full CharData array given the original text and what the user has typed so far.
 */
export function computeCharStates(original: string, typed: string): CharData[] {
  const result: CharData[] = [];
  const maxLen = Math.max(original.length, typed.length);

  for (let i = 0; i < maxLen; i++) {
    const expectedChar = original[i];
    const typedChar = typed[i];

    if (i >= original.length) {
      // Extra characters beyond the paragraph
      result.push({ char: typedChar, state: 'extra', typed: typedChar });
    } else if (typedChar === undefined) {
      // Not yet reached
      const state: CharState = i === typed.length ? 'current' : 'untyped';
      result.push({ char: expectedChar, state });
    } else if (typedChar === expectedChar) {
      result.push({ char: expectedChar, state: 'correct', typed: typedChar });
    } else {
      result.push({ char: expectedChar, state: 'incorrect', typed: typedChar });
    }
  }

  return result;
}

/**
 * Count characters by state from a CharData array.
 */
export function countByState(chars: CharData[]): Record<CharState, number> {
  const counts: Record<CharState, number> = {
    untyped: 0,
    current: 0,
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  };
  for (const c of chars) {
    counts[c.state]++;
  }
  return counts;
}

/**
 * Mark remaining untyped/current characters as 'missed' when test ends.
 */
export function markMissed(chars: CharData[]): CharData[] {
  return chars.map((c) => {
    if (c.state === 'untyped' || c.state === 'current') {
      return { ...c, state: 'missed' as CharState };
    }
    return c;
  });
}
