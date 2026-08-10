'use client';

import Link from 'next/link';
import { useSettingsStore } from '@/store/useSettingsStore';

const SHORTCUTS = [
  { keys: 'Tab + Enter', action: 'Restart test' },
  { keys: 'Esc',         action: 'Cancel test' },
  { keys: 'Ctrl + R',    action: 'New paragraph' },
  { keys: 'Ctrl + T',    action: 'Toggle theme' },
  { keys: 'Ctrl + 1',    action: 'Beginner' },
  { keys: 'Ctrl + 2',    action: 'Medium' },
  { keys: 'Ctrl + 3',    action: 'Master' },
];

export default function Footer() {
  const { showFooter } = useSettingsStore();
  if (!showFooter) return null;
  return (
    <footer
      className="mt-auto py-8 theme-transition"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Shortcuts row */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {SHORTCUTS.map(({ keys, action }) => (
            <div key={action} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {keys}
              </kbd>
              <span>{action}</span>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          <div className="flex items-center gap-1">
            <span className="font-bold gradient-text">TypeFuture</span>
            <span>— A modern typing test platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/test" className="hover:text-[--color-primary] transition-colors focus-ring rounded">Test</Link>
            <Link href="/learn" className="hover:text-[--color-primary] transition-colors focus-ring rounded">Learn</Link>
            <Link href="/stats" className="hover:text-[--color-primary] transition-colors focus-ring rounded">Stats</Link>
            <Link href="/settings" className="hover:text-[--color-primary] transition-colors focus-ring rounded">Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
