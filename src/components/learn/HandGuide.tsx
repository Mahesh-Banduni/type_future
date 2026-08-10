'use client';

import { Finger } from '@/data/lessons';

interface HandGuideProps {
  activeFinger: Finger | null;
  pressedKey?: string | null;
}

const FINGER_COLORS: Record<Finger, string> = {
  'left-pinky':   '#f87171', // red
  'left-ring':    '#fb923c', // orange
  'left-middle':  '#facc15', // yellow
  'left-index':   '#4ade80', // green
  'left-thumb':   '#60a5fa', // blue
  'right-thumb':  '#60a5fa', // blue
  'right-index':  '#a78bfa', // violet
  'right-middle': '#f472b6', // pink
  'right-ring':   '#34d399', // teal
  'right-pinky':  '#94a3b8', // slate
};

const FINGER_NAMES: Record<Finger, string> = {
  'left-pinky':   'Left Pinky',
  'left-ring':    'Left Ring',
  'left-middle':  'Left Middle',
  'left-index':   'Left Index',
  'left-thumb':   'Left Thumb',
  'right-thumb':  'Right Thumb',
  'right-index':  'Right Index',
  'right-middle': 'Right Middle',
  'right-ring':   'Right Ring',
  'right-pinky':  'Right Pinky',
};

interface FingerDef {
  id: Finger;
  label: string;
  // SVG path data or ellipse params for each finger silhouette
}

const LEFT_FINGERS: FingerDef[] = [
  { id: 'left-pinky', label: 'Pinky' },
  { id: 'left-ring', label: 'Ring' },
  { id: 'left-middle', label: 'Middle' },
  { id: 'left-index', label: 'Index' },
  { id: 'left-thumb', label: 'Thumb' },
];

const RIGHT_FINGERS: FingerDef[] = [
  { id: 'right-thumb', label: 'Thumb' },
  { id: 'right-index', label: 'Index' },
  { id: 'right-middle', label: 'Middle' },
  { id: 'right-ring', label: 'Ring' },
  { id: 'right-pinky', label: 'Pinky' },
];

function HandSVG({
  side,
  fingers,
  activeFinger,
}: {
  side: 'left' | 'right';
  fingers: FingerDef[];
  activeFinger: Finger | null;
}) {
  const isLeft = side === 'left';

  // Finger positions in the SVG coordinate space
  const fingerPositions = isLeft
    ? [
        { cx: 30, cy: 48, rx: 10, ry: 30 },  // pinky
        { cx: 54, cy: 35, rx: 11, ry: 34 },  // ring
        { cx: 79, cy: 28, rx: 11, ry: 38 },  // middle
        { cx: 104, cy: 34, rx: 11, ry: 36 }, // index
        { cx: 126, cy: 78, rx: 12, ry: 22 }, // thumb
      ]
    : [
        { cx: 24, cy: 78, rx: 12, ry: 22 },  // thumb
        { cx: 46, cy: 34, rx: 11, ry: 36 },  // index
        { cx: 71, cy: 28, rx: 11, ry: 38 },  // middle
        { cx: 96, cy: 35, rx: 11, ry: 34 },  // ring
        { cx: 120, cy: 48, rx: 10, ry: 30 }, // pinky
      ];

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 150 160"
        className="w-28 h-36"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Palm */}
        <ellipse
          cx={isLeft ? 75 : 75}
          cy={128}
          rx={58}
          ry={34}
          fill="var(--color-surface2)"
          stroke="var(--color-border)"
          strokeWidth={1.5}
        />

        {/* Fingers */}
        {fingers.map((f, i) => {
          const pos = fingerPositions[i];
          const isActive = activeFinger === f.id;
          const color = FINGER_COLORS[f.id];
          return (
            <g key={f.id}>
              <ellipse
                cx={pos.cx}
                cy={pos.cy}
                rx={pos.rx}
                ry={pos.ry}
                fill={isActive ? color : 'var(--color-surface2)'}
                stroke={isActive ? color : 'var(--color-border)'}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  transition: 'fill 0.2s ease, stroke 0.2s ease',
                  filter: isActive ? `drop-shadow(0 0 6px ${color}88)` : undefined,
                }}
              />
              {/* Knuckle lines */}
              <ellipse
                cx={pos.cx}
                cy={pos.cy + pos.ry * 0.45}
                rx={pos.rx * 0.85}
                ry={2}
                fill="none"
                stroke={isActive ? `${color}88` : 'var(--color-border)'}
                strokeWidth={1}
              />
            </g>
          );
        })}
      </svg>
      <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {isLeft ? 'Left Hand' : 'Right Hand'}
      </span>
    </div>
  );
}

export default function HandGuide({ activeFinger, pressedKey }: HandGuideProps) {
  const fingerLabel = activeFinger ? FINGER_NAMES[activeFinger] : null;
  const fingerColor = activeFinger ? FINGER_COLORS[activeFinger] : null;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Finger label */}
      <div className="h-7 flex items-center">
        {activeFinger && fingerLabel && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold animate-fade-in"
            style={{
              background: `${fingerColor}22`,
              border: `1px solid ${fingerColor}55`,
              color: fingerColor ?? undefined,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: fingerColor ?? undefined }}
            />
            {fingerLabel}
            {pressedKey && (
              <span
                className="ml-1 px-1.5 rounded font-mono"
                style={{ background: `${fingerColor}33` }}
              >
                &quot;{pressedKey === ' ' ? 'Space' : pressedKey}&quot;
              </span>
            )}
          </div>
        )}
      </div>

      {/* Both hands */}
      <div className="flex items-end gap-6">
        <HandSVG side="left" fingers={LEFT_FINGERS} activeFinger={activeFinger} />
        <HandSVG side="right" fingers={RIGHT_FINGERS} activeFinger={activeFinger} />
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
        {(Object.entries(FINGER_COLORS) as [Finger, string][]).slice(0, 5).map(([f, c]) => (
          <div key={f} className="flex items-center gap-1 text-[9px]" style={{ color: 'var(--color-text-subtle)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {FINGER_NAMES[f].replace('Left ', '')}
          </div>
        ))}
      </div>
    </div>
  );
}
