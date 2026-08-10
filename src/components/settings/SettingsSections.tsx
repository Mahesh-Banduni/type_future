'use client';

import React from 'react';

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleSwitch({ id, label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
    >
      <label htmlFor={id} className="flex flex-col gap-0.5 max-w-[70%] cursor-pointer">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{label}</span>
        {description && (
          <span className="text-[11px]" style={{ color: 'var(--color-text-subtle)' }}>{description}</span>
        )}
      </label>
      <button
        id={id}
        onClick={() => onChange(!checked)}
        className="w-10 h-6 rounded-full relative transition-colors duration-200 focus-ring flex-shrink-0"
        style={{ background: checked ? 'var(--color-primary)' : 'var(--color-border)' }}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
          style={{ transform: checked ? 'translateX(16px)' : 'none' }}
        />
      </button>
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  description?: string;
}

export function Slider({ id, label, value, min, max, step = 1, unit = '', onChange, description }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-xl"
      style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {label}
        </label>
        <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-primary)' }}>
          {value}{unit}
        </span>
      </div>
      {description && (
        <span className="text-[11px]" style={{ color: 'var(--color-text-subtle)' }}>{description}</span>
      )}
      <div className="relative h-6 flex items-center">
        <div
          className="absolute left-0 right-0 h-1.5 rounded-full"
          style={{ background: 'var(--color-border)' }}
        />
        <div
          className="absolute left-0 h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 h-6 cursor-pointer"
          aria-label={label}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-md border-2 pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            borderColor: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

interface DropdownProps<T extends string | number> {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  description?: string;
}

export function Dropdown<T extends string | number>({ id, label, value, options, onChange, description }: DropdownProps<T>) {
  return (
    <div
      className="flex flex-col gap-1.5 p-4 rounded-xl"
      style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
    >
      <label htmlFor={id} className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      {description && (
        <span className="text-[10px]" style={{ color: 'var(--color-text-subtle)' }}>{description}</span>
      )}
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full bg-transparent border-0 focus:ring-0 text-sm font-semibold p-0 cursor-pointer"
        style={{ color: 'var(--color-text)' }}
      >
        {options.map(opt => (
          <option key={String(opt.value)} value={opt.value} className="bg-[--color-surface] text-[--color-text]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Radio Group ──────────────────────────────────────────────────────────────

interface RadioGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: string }[];
  onChange: (v: T) => void;
}

export function RadioGroup<T extends string>({ label, value, options, onChange }: RadioGroupProps<T>) {
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-xl"
      style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
    >
      <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-ring"
            style={{
              background: value === opt.value
                ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)'
                : 'var(--color-surface)',
              border: `1.5px solid ${value === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
              color: value === opt.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  defaultValue?: string;
  onChange: (v: string) => void;
  description?: string;
}

export function ColorPicker({ id, label, value, defaultValue, onChange, description }: ColorPickerProps) {
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-xl"
      style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {label}
        </label>
        {defaultValue && value !== defaultValue && (
          <button
            onClick={() => onChange(defaultValue)}
            className="text-[10px] font-semibold focus-ring rounded px-1"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            Reset
          </button>
        )}
      </div>
      {description && (
        <span className="text-[11px]" style={{ color: 'var(--color-text-subtle)' }}>{description}</span>
      )}
      <div className="flex items-center gap-3">
        <div
          className="relative w-10 h-10 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <input
            id={id}
            type="color"
            value={value || '#6c8ef7'}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            aria-label={label}
          />
          <div
            className="absolute inset-0 rounded-md"
            style={{ background: value || '#6c8ef7' }}
          />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#6c8ef7"
          className="flex-1 text-xs font-mono bg-transparent border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Section Group ────────────────────────────────────────────────────────────

interface GroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}

export function Group({ title, description, children, cols = 3 }: GroupProps) {
  const colClass = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  return (
    <div className="flex flex-col gap-3 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {title}
        </h4>
        {description && (
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>{description}</p>
        )}
      </div>
      <div className={`grid ${colClass} gap-3`}>{children}</div>
    </div>
  );
}

// ─── Section Tab Button ───────────────────────────────────────────────────────

interface TabButtonProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus-ring whitespace-nowrap"
      style={{
        background: active ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'transparent',
        border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
