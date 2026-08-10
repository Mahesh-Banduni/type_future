/**
 * Calculate Words Per Minute.
 * Standard: 1 word = 5 characters (including spaces)
 */
export function calcWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(correctChars / 5 / minutes);
}

/**
 * Gross WPM — counts all typed characters (correct + incorrect)
 */
export function calcGrossWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(totalTypedChars / 5 / minutes);
}

/**
 * Net WPM = Gross WPM - (errors / minutes)
 */
export function calcNetWpm(grossWpm: number, errors: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(grossWpm - errors / minutes));
}

/**
 * Characters Per Minute
 */
export function calcCpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(correctChars / minutes);
}

/**
 * Accuracy percentage (0-100)
 */
export function calcAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars === 0) return 100;
  return Math.round((correctChars / totalTypedChars) * 100);
}

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`;
  return `${s}s`;
}

/**
 * Format a timestamp to readable date/time
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
