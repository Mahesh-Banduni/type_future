'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useSoundEngine } from '@/hooks/useSoundEngine';
import { CharData, CaretStyle } from '@/types';

const CARET_CLASS: Record<CaretStyle, string> = {
  line: 'caret-line',
  block: 'caret-block',
  underline: 'caret-underline',
  hidden: '',
};

function CharSpan({ char, state, isCurrent, caretStyle, animate }: {
  char: string;
  state: CharData['state'];
  isCurrent: boolean;
  caretStyle: CaretStyle;
  animate: boolean;
}) {
  const caretClass = isCurrent && caretStyle !== 'hidden' ? CARET_CLASS[caretStyle] : '';

  return (
    <span
      className={`relative char-${state} ${caretClass} ${animate && state !== 'untyped' ? 'animate-pop' : ''}`}
      style={{ display: 'inline' }}
      aria-hidden="true"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
}

export default function TypingArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { charData, typedText, status, paragraphText } = useTypingStore();
  const settings = useSettingsStore();
  const {
    fontFamily, fontSize, lineSpacing, charSpacing, caretStyle,
    characterAnimation, blurCompleted,
  } = settings;

  const { handleInput, setSoundFn } = useTypingEngine();
  const { playKeySound } = useSoundEngine();

  // Wire sound engine
  useEffect(() => {
    setSoundFn(playKeySound);
  }, [setSoundFn, playKeySound]);

  // Focus input on mount and when status resets
  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleClick = () => {
    if (status !== 'finished') inputRef.current?.focus();
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInput(e.target.value);
    },
    [handleInput]
  );

  // Prevent paste, context menu inside typing area
  const preventDefault = (e: React.SyntheticEvent) => e.preventDefault();

  // Auto-scroll: keep current character in view
  useEffect(() => {
    if (!containerRef.current) return;
    const current = containerRef.current.querySelector('.caret-line, .caret-block, .caret-underline') as HTMLElement;
    if (current) {
      const container = containerRef.current;
      const top = current.offsetTop;
      const height = container.clientHeight;
      if (top > height * 0.6) {
        container.scrollTop = top - height * 0.4;
      }
    }
  }, [typedText]);

  const cssClasses = [
    `font-family-${fontFamily}`,
    `font-size-${fontSize}`,
    `line-spacing-${lineSpacing}`,
    `char-spacing-${charSpacing}`,
    status === 'running' ? 'typing' : '',
    blurCompleted ? 'blur-completed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const isFinished = status === 'finished';

  return (
    <div className="relative w-full" onClick={handleClick}>
      {/* Hidden input — always mounted */}
      <input
        ref={inputRef}
        id="typing-input"
        type="text"
        value={typedText}
        onChange={handleChange}
        onPaste={preventDefault}
        onContextMenu={preventDefault}
        onCopy={preventDefault}
        onCut={preventDefault}
        disabled={isFinished}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-label="Typing input — start typing to begin the test"
        aria-hidden={isFinished}
      />

      {/* Instruction hint */}
      {status === 'idle' && paragraphText && (
        <div
          className="text-center text-sm mb-4 animate-fade-in"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          Click here or start typing to begin
        </div>
      )}

      {/* Text display */}
      <div
        ref={containerRef}
        className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden select-none cursor-text ${cssClasses}`}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          maxHeight: '220px',
          overflowY: 'hidden',
          wordBreak: 'break-word',
          transition: 'border-color 0.2s',
          borderColor: status === 'running' ? 'var(--color-primary)' : 'var(--color-border)',
          
          // User customization style overrides
          width: `${settings.textWidth}%`,
          margin: '0 auto',
          textAlign: settings.textAlignment,
          fontWeight: settings.fontWeight,
          lineHeight: settings.lineHeight,
          letterSpacing: settings.letterSpacing !== 0 ? `${settings.letterSpacing}em` : undefined,
          wordSpacing: settings.wordSpacing !== 0 ? `${settings.wordSpacing}em` : undefined,
          
          // Custom CSS variables passed down
          ['--cursor-thickness' as any]: `${settings.cursorThickness}px`,
          ['--cursor-blink-speed' as any]: `${settings.cursorBlinkSpeed}s`,
          ['--completed-opacity' as any]: settings.completedOpacity,
          ['--upcoming-opacity' as any]: settings.upcomingOpacity,
        }}
        role="region"
        aria-label="Typing text area"
      >
        {charData.map((c, i) => (
          <CharSpan
            key={i}
            char={c.char}
            state={c.state}
            isCurrent={c.state === 'current'}
            caretStyle={caretStyle}
            animate={characterAnimation}
          />
        ))}
      </div>

      {/* Finished overlay */}
      {isFinished && (
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center animate-fade-in"
          style={{ background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', backdropFilter: 'blur(8px)' }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-bold text-lg gradient-text">Test Complete!</div>
          </div>
        </div>
      )}
    </div>
  );
}
