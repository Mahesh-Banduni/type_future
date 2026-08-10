'use client';

import { useEffect } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ThemeName } from '@/types';

const themeNames: ThemeName[] = [
  'dark', 'light', 'blue', 'green', 'purple', 'red', 'orange',
  'cyberpunk', 'dracula', 'solarized', 'midnight', 'ocean', 'forest', 'sunset',
  'paper', 'sepia', 'mint-light', 'sakura-light', 'lavender-light', 'honey-light',
];

interface ShortcutHandlers {
  onNewParagraph: () => void;
  onRestart: () => void;
}

export function useKeyboardShortcuts({ onNewParagraph, onRestart }: ShortcutHandlers) {
  const { status, resetTest, finishTest } = useTypingStore();
  const { theme, setTheme, setDifficulty } = useSettingsStore();

  useEffect(() => {
    let tabHeld = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      // Allow shortcuts only when not inside an input/textarea (except the hidden typing input)
      const isTypingInput = (e.target as HTMLElement).id === 'typing-input';

      // Tab + Enter → Restart
      if (e.key === 'Tab') {
        tabHeld = true;
        if (!isTypingInput) e.preventDefault();
      }

      if (e.key === 'Enter' && tabHeld) {
        e.preventDefault();
        onRestart();
        return;
      }

      // Esc → Cancel test / reset
      if (e.key === 'Escape') {
        e.preventDefault();
        if (status === 'running') {
          finishTest();
        } else {
          resetTest();
        }
        return;
      }

      // Skip other shortcuts if typing
      if (isTypingInput || tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Ctrl+R → New random paragraph
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        onNewParagraph();
        return;
      }

      // Ctrl+T → Toggle theme (cycle through)
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const idx = themeNames.indexOf(theme);
        const next = themeNames[(idx + 1) % themeNames.length];
        setTheme(next);
        return;
      }

      // Ctrl+1/2/3 → Difficulty
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        setDifficulty('beginner');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        setDifficulty('medium');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        setDifficulty('master');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') tabHeld = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status, theme, onNewParagraph, onRestart, resetTest, finishTest, setTheme, setDifficulty]);
}
