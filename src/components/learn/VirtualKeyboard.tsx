'use client';

import { useEffect, useState } from 'react';
import { Finger } from '@/data/lessons';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKey?: string | null;
  activeFinger?: Finger | null;
}

const FINGER_COLORS: Record<Finger, string> = {
  'left-pinky':   '#f87171',
  'left-ring':    '#fb923c',
  'left-middle':  '#facc15',
  'left-index':   '#4ade80',
  'left-thumb':   '#60a5fa',
  'right-thumb':  '#60a5fa',
  'right-index':  '#a78bfa',
  'right-middle': '#f472b6',
  'right-ring':   '#34d399',
  'right-pinky':  '#94a3b8',
};

const KEY_FINGER: Record<string, Finger> = {
  '`': 'left-pinky', '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle',
  '4': 'left-index', '5': 'left-index', '6': 'right-index', '7': 'right-index',
  '8': 'right-middle', '9': 'right-ring', '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',
  q: 'left-pinky', w: 'left-ring', e: 'left-middle', r: 'left-index', t: 'left-index',
  y: 'right-index', u: 'right-index', i: 'right-middle', o: 'right-ring', p: 'right-pinky',
  '[': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky',
  a: 'left-pinky', s: 'left-ring', d: 'left-middle', f: 'left-index', g: 'left-index',
  h: 'right-index', j: 'right-index', k: 'right-middle', l: 'right-ring', ';': 'right-pinky', "'": 'right-pinky',
  z: 'left-pinky', x: 'left-ring', c: 'left-middle', v: 'left-index', b: 'left-index',
  n: 'right-index', m: 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
  ' ': 'right-thumb',
};

const HOME_ROW_KEYS = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';']);

type KeyDef = { key: string; label: string; wide?: boolean };
type Row = KeyDef[];

const ROWS: Row[] = [
  [
    { key: '`', label: '`' }, { key: '1', label: '1' }, { key: '2', label: '2' },
    { key: '3', label: '3' }, { key: '4', label: '4' }, { key: '5', label: '5' },
    { key: '6', label: '6' }, { key: '7', label: '7' }, { key: '8', label: '8' },
    { key: '9', label: '9' }, { key: '0', label: '0' }, { key: '-', label: '-' },
    { key: '=', label: '=' },
  ],
  [
    { key: 'q', label: 'Q' }, { key: 'w', label: 'W' }, { key: 'e', label: 'E' },
    { key: 'r', label: 'R' }, { key: 't', label: 'T' }, { key: 'y', label: 'Y' },
    { key: 'u', label: 'U' }, { key: 'i', label: 'I' }, { key: 'o', label: 'O' },
    { key: 'p', label: 'P' }, { key: '[', label: '[' }, { key: ']', label: ']' },
  ],
  [
    { key: 'a', label: 'A' }, { key: 's', label: 'S' }, { key: 'd', label: 'D' },
    { key: 'f', label: 'F' }, { key: 'g', label: 'G' }, { key: 'h', label: 'H' },
    { key: 'j', label: 'J' }, { key: 'k', label: 'K' }, { key: 'l', label: 'L' },
    { key: ';', label: ';' }, { key: "'", label: "'" },
  ],
  [
    { key: 'z', label: 'Z' }, { key: 'x', label: 'X' }, { key: 'c', label: 'C' },
    { key: 'v', label: 'V' }, { key: 'b', label: 'B' }, { key: 'n', label: 'N' },
    { key: 'm', label: 'M' }, { key: ',', label: ',' }, { key: '.', label: '.' },
    { key: '/', label: '/' },
  ],
];

function Key({
  keyDef,
  isActive,
  isPressed,
  isHomeRow,
  finger,
}: {
  keyDef: KeyDef;
  isActive: boolean;
  isPressed: boolean;
  isHomeRow: boolean;
  finger: Finger | undefined;
}) {
  const fingerColor = finger ? FINGER_COLORS[finger] : null;

  let bg = 'var(--color-surface2)';
  let border = 'var(--color-border)';
  let textColor = 'var(--color-text-subtle)';
  let scale = 'scale(1)';
  let shadow = 'none';

  if (fingerColor) {
    bg = `${fingerColor}18`;
    border = `${fingerColor}44`;
    textColor = fingerColor;
  }
  if (isHomeRow && !isActive) {
    border = `${fingerColor ?? 'var(--color-primary)'}66`;
  }
  if (isActive) {
    bg = `${fingerColor ?? 'var(--color-primary)'}33`;
    border = fingerColor ?? 'var(--color-primary)';
    textColor = fingerColor ?? 'var(--color-primary)';
    shadow = `0 0 12px ${fingerColor ?? 'var(--color-primary)'}55`;
  }
  if (isPressed) {
    scale = 'scale(0.88)';
    bg = fingerColor ?? 'var(--color-primary)';
    textColor = '#fff';
    shadow = `0 0 18px ${fingerColor ?? 'var(--color-primary)'}88`;
  }

  return (
    <div
      className="flex items-center justify-center rounded-lg font-mono font-bold text-[11px] select-none relative"
      style={{
        width: 36,
        height: 36,
        background: bg,
        border: `1.5px solid ${border}`,
        color: textColor,
        transform: scale,
        boxShadow: shadow,
        transition: 'all 0.08s ease',
      }}
    >
      {keyDef.label}
      {isHomeRow && !isActive && (
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: fingerColor ?? 'var(--color-primary)' }}
        />
      )}
    </div>
  );
}

export default function VirtualKeyboard({ activeKey, pressedKey, activeFinger }: VirtualKeyboardProps) {
  const [localPressed, setLocalPressed] = useState<string | null>(null);

  // Flash animation for pressed key
  useEffect(() => {
    if (pressedKey) {
      setLocalPressed(pressedKey.toLowerCase());
      const t = setTimeout(() => setLocalPressed(null), 120);
      return () => clearTimeout(t);
    }
  }, [pressedKey]);

  const active = activeKey?.toLowerCase() ?? null;

  return (
    <div className="flex flex-col gap-1.5 items-center w-full">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5 justify-center">
          {row.map((k) => {
            const finger = KEY_FINGER[k.key] as Finger | undefined;
            return (
              <Key
                key={k.key}
                keyDef={k}
                isActive={k.key === active}
                isPressed={localPressed === k.key}
                isHomeRow={HOME_ROW_KEYS.has(k.key)}
                finger={finger}
              />
            );
          })}
        </div>
      ))}
      {/* Space bar row */}
      <div className="flex gap-1.5 justify-center mt-0.5">
        <div
          className="flex items-center justify-center rounded-lg font-mono font-bold text-[11px] select-none"
          style={{
            width: 220,
            height: 34,
            background: active === ' ' || localPressed === ' '
              ? `${FINGER_COLORS['right-thumb']}33`
              : 'var(--color-surface2)',
            border: `1.5px solid ${active === ' ' ? FINGER_COLORS['right-thumb'] : 'var(--color-border)'}`,
            color: active === ' ' ? FINGER_COLORS['right-thumb'] : 'var(--color-text-subtle)',
            transform: localPressed === ' ' ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.08s ease',
            boxShadow: active === ' ' ? `0 0 12px ${FINGER_COLORS['right-thumb']}44` : 'none',
          }}
        >
          SPACE
        </div>
      </div>

      {/* Finger color legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {(Object.entries(FINGER_COLORS) as [Finger, string][])
          .filter((_, i) => i % 2 === 0)
          .map(([f, c]) => (
            <div key={f} className="flex items-center gap-1 text-[9px]" style={{ color: 'var(--color-text-subtle)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              {f.replace('left-', 'L ').replace('right-', 'R ')}
            </div>
          ))}
      </div>
    </div>
  );
}
