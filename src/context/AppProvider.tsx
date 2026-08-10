'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStatsStore } from '@/store/useStatsStore';
import { applyTheme } from '@/styles/themes';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, theme, customColorsEnabled, customColors, reducedMotion, highContrastMode, animationsEnabled } = useSettingsStore();
  const { hydrate: hydrateStats } = useStatsStore();

  // Hydrate stores from localStorage on mount
  useEffect(() => {
    hydrate();
    hydrateStats();
  }, [hydrate, hydrateStats]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply custom color overrides on top of theme
  useEffect(() => {
    const root = document.documentElement;
    if (customColorsEnabled && customColors) {
      const keyMap: Record<string, string> = {
        bg: '--color-bg',
        surface: '--color-surface',
        surface2: '--color-surface2',
        border: '--color-border',
        text: '--color-text',
        textMuted: '--color-text-muted',
        textSubtle: '--color-text-subtle',
        primary: '--color-primary',
        primaryHover: '--color-primary-hover',
        correct: '--color-correct',
        incorrect: '--color-incorrect',
        current: '--color-current',
        extra: '--color-extra',
        missed: '--color-missed',
        caret: '--color-caret',
        accent: '--color-accent',
      };
      Object.entries(customColors).forEach(([key, value]) => {
        const cssVar = keyMap[key];
        if (cssVar && value) root.style.setProperty(cssVar, value);
      });
    }
  }, [customColorsEnabled, customColors]);

  // Reduced motion + high contrast accessibility
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    if (highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    if (!animationsEnabled) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  }, [reducedMotion, highContrastMode, animationsEnabled]);

  return <>{children}</>;
}
