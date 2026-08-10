'use client';

import { TestDuration } from '@/types';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';

const DURATIONS: TestDuration[] = [30, 60, 120, 300];

export default function TimerSelector() {
  const { setDuration: storeSetDuration } = useTypingStore();
  const { duration, setDuration } = useSettingsStore();
  const { status } = useTypingStore();

  const handleSelect = (d: TestDuration) => {
    if (status === 'running') return;
    setDuration(d);
    storeSetDuration(d);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-surface2)' }}>
      {DURATIONS.map((d) => {
        const isActive = duration === d;
        const displayTime = d < 60 ? d.toString() + "s" : `${d / 60}m`;
        return (
          <button
            key={d}
            id={`timer-${d}s`}
            onClick={() => handleSelect(d)}
            disabled={status === 'running'}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isActive ? 'var(--color-primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
              boxShadow: isActive ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
            }}
            aria-label={`Set timer to ${d} seconds`}
            aria-pressed={isActive}
          >
            {displayTime}
          </button>
        );
      })}
    </div>
  );
}
