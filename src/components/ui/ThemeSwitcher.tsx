'use client';

import { useState } from 'react';
import { ThemeName } from '@/types';
import { themes } from '@/styles/themes';
import { useSettingsStore } from '@/store/useSettingsStore';

const THEME_NAMES = Object.keys(themes) as ThemeName[];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useSettingsStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        id="theme-switcher-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl theme-transition focus-ring"
        style={{
          background: 'var(--color-surface2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
        aria-label="Switch theme"
        aria-expanded={open}
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: themes[theme].primary }}
        />
        <span className="text-sm capitalize hidden sm:block">{theme}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl p-3 grid grid-cols-4 gap-2 min-w-[240px] animate-fade-in"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            {THEME_NAMES.map((name) => {
              const t = themes[name];
              const isActive = theme === name;
              return (
                <button
                  key={name}
                  id={`theme-option-${name}`}
                  onClick={() => {
                    setTheme(name);
                    setOpen(false);
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 hover:scale-105 focus-ring"
                  style={{
                    background: isActive ? 'var(--color-surface2)' : 'transparent',
                    border: isActive
                      ? `1px solid ${t.primary}`
                      : '1px solid transparent',
                  }}
                  title={name}
                  aria-label={`Switch to ${name} theme`}
                >
                  {/* Color preview */}
                  <div
                    className="w-8 h-5 rounded-md flex gap-0.5 overflow-hidden"
                    style={{ background: t.bg }}
                  >
                    <div className="flex-1" style={{ background: t.primary }} />
                    <div className="flex-1" style={{ background: t.correct }} />
                    <div className="flex-1" style={{ background: t.accent }} />
                  </div>
                  <span
                    className="text-[9px] font-medium capitalize tracking-wide"
                    style={{ color: isActive ? t.primary : 'var(--color-text-muted)' }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
