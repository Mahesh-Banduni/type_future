'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStatsStore } from '@/store/useStatsStore';
import { useLearnStore } from '@/store/useLearnStore';
import { ThemeName, FontSize, FontFamily, LineSpacing, CharSpacing, CaretStyle } from '@/types';
import { ToggleSwitch, Slider, Dropdown, RadioGroup, ColorPicker, Group, TabButton } from './SettingsSections';
import { themes } from '@/styles/themes';

const TABS = [
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'colors',     label: 'Colors',     icon: '🖌️' },
  { id: 'behavior',   label: 'Behavior',   icon: '⚙️' },
  { id: 'audio',      label: 'Audio',      icon: '🔊' },
  { id: 'animation',  label: 'Animation',  icon: '✨' },
  { id: 'access',     label: 'Accessibility', icon: '♿' },
  { id: 'stats',      label: 'Stats',      icon: '📊' },
  { id: 'data',       label: 'Data',       icon: '💾' },
] as const;

type TabId = typeof TABS[number]['id'];

const COLOR_LABELS: Record<string, string> = {
  bg: 'Background',
  surface: 'Surface / Cards',
  surface2: 'Surface 2',
  border: 'Borders',
  text: 'Primary Text',
  textMuted: 'Muted Text',
  textSubtle: 'Subtle Text',
  primary: 'Primary / Accent',
  primaryHover: 'Primary Hover',
  correct: 'Correct Characters',
  incorrect: 'Incorrect Characters',
  current: 'Current Character',
  extra: 'Extra Characters',
  missed: 'Missed Characters',
  caret: 'Caret / Cursor',
  accent: 'Accent Color',
};

export default function SettingsModal() {
  const s = useSettingsStore();
  const { clearAllHistory, clearAllStats } = useStatsStore();
  const { clearAllProgress } = useLearnStore();
  const [activeTab, setActiveTab] = useState<TabId>('appearance');
  const [exportMsg, setExportMsg] = useState('');

  const handleExport = () => {
    const json = s.exportSettings();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typefuture-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('Settings exported!');
    setTimeout(() => setExportMsg(''), 2000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = s.importSettings(text);
      setExportMsg(ok ? 'Settings imported!' : 'Invalid settings file.');
      setTimeout(() => setExportMsg(''), 2500);
    };
    input.click();
  };

  const themeOptions = (Object.keys(themes) as ThemeName[]).map(t => ({
    value: t,
    label: t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' '),
  }));

  const currentThemeColors = themes[s.theme];

  return (
    <div className="glass p-6 md:p-8 flex flex-col gap-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h2 className="text-2xl font-black gradient-text">Settings</h2>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Customize your typing experience. All changes save automatically.
          </p>
        </div>
        <button
          onClick={() => { if (confirm('Reset all settings to defaults?')) s.resetSettings(); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold theme-transition focus-ring"
          style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          Reset Defaults
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(tab => (
          <TabButton
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* ── Appearance ── */}
      {activeTab === 'appearance' && (
        <div className="flex flex-col gap-0">
          <Group title="Theme" description="Choose a color theme for the entire application.">
            <div className="col-span-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {themeOptions.map(t => (
                  <button
                    key={t.value}
                    onClick={() => s.setTheme(t.value)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-105 focus-ring"
                    style={{
                      background: themes[t.value].bg,
                      border: `2px solid ${s.theme === t.value ? themes[t.value].primary : themes[t.value].border}`,
                      color: themes[t.value].text,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: themes[t.value].primary }}
                    />
                    <span style={{ fontSize: 10 }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Group>

          <Group title="Typography">
            <Dropdown<FontFamily>
              id="s-font-family"
              label="Font Family"
              value={s.fontFamily}
              onChange={s.setFontFamily}
              options={[
                { value: 'mono', label: 'Monospace (JetBrains)' },
                { value: 'sans', label: 'Sans-Serif (Inter)' },
                { value: 'serif', label: 'Serif (Georgia)' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'dyslexic', label: 'Dyslexia-Friendly' },
              ]}
            />
            <RadioGroup<FontSize>
              label="Font Size"
              value={s.fontSize}
              onChange={s.setFontSize}
              options={[
                { value: 'sm', label: '14px' },
                { value: 'md', label: '18px' },
                { value: 'lg', label: '22px' },
                { value: 'xl', label: '26px' },
              ]}
            />
            <Dropdown<LineSpacing>
              id="s-line-spacing"
              label="Line Spacing"
              value={s.lineSpacing}
              onChange={s.setLineSpacing}
              options={[
                { value: 'tight', label: 'Tight' },
                { value: 'normal', label: 'Normal' },
                { value: 'relaxed', label: 'Relaxed' },
              ]}
            />
            <Dropdown<CharSpacing>
              id="s-char-spacing"
              label="Character Spacing"
              value={s.charSpacing}
              onChange={s.setCharSpacing}
              options={[
                { value: 'tight', label: 'Tight' },
                { value: 'normal', label: 'Normal' },
                { value: 'wide', label: 'Wide' },
              ]}
            />
            <Slider
              id="s-font-weight"
              label="Font Weight"
              value={s.fontWeight}
              min={300}
              max={800}
              step={100}
              onChange={s.setFontWeight}
            />
            <Slider
              id="s-line-height"
              label="Line Height"
              value={s.lineHeight}
              min={1.2}
              max={2.5}
              step={0.1}
              onChange={s.setLineHeight}
            />
          </Group>

          <Group title="Typing Area">
            <Dropdown<CaretStyle>
              id="s-caret"
              label="Caret Style"
              value={s.caretStyle}
              onChange={s.setCaretStyle}
              options={[
                { value: 'line', label: 'Line (vertical)' },
                { value: 'block', label: 'Block (opaque)' },
                { value: 'underline', label: 'Underline' },
                { value: 'hidden', label: 'Hidden' },
              ]}
            />
            <Slider id="s-cursor-thickness" label="Cursor Thickness" value={s.cursorThickness} min={1} max={6} onChange={s.setCursorThickness} unit="px" />
            <Slider id="s-cursor-blink" label="Cursor Blink Speed" value={s.cursorBlinkSpeed} min={0.4} max={2.5} step={0.1} onChange={s.setCursorBlinkSpeed} unit="s" />
            <Slider id="s-text-width" label="Text Area Width" value={s.textWidth} min={50} max={100} onChange={s.setTextWidth} unit="%" />
            <RadioGroup
              label="Text Alignment"
              value={s.textAlignment}
              onChange={s.setTextAlignment}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
            <Slider id="s-completed-opacity" label="Completed Text Opacity" value={s.completedOpacity} min={0.1} max={1} step={0.05} onChange={s.setCompletedOpacity} />
            <Slider id="s-upcoming-opacity" label="Upcoming Text Opacity" value={s.upcomingOpacity} min={0.2} max={1} step={0.05} onChange={s.setUpcomingOpacity} />
          </Group>

          <Group title="UI Layout" cols={2}>
            <ToggleSwitch id="s-show-navbar" label="Show Navbar" checked={s.showNavbar} onChange={s.setShowNavbar} />
            <ToggleSwitch id="s-show-footer" label="Show Footer" checked={s.showFooter} onChange={s.setShowFooter} />
            <ToggleSwitch id="s-compact" label="Compact Mode" description="Tighter spacing throughout the UI" checked={s.compactMode} onChange={s.setCompactMode} />
            <ToggleSwitch id="s-focus" label="Focus Mode" description="Hide all distracting UI while typing" checked={s.focusMode} onChange={s.setFocusMode} />
            <ToggleSwitch id="s-highlight-word" label="Highlight Current Word" checked={s.highlightCurrentWord} onChange={s.setHighlightCurrentWord} />
            <ToggleSwitch id="s-highlight-line" label="Highlight Current Line" checked={s.highlightCurrentLine} onChange={s.setHighlightCurrentLine} />
          </Group>
        </div>
      )}

      {/* ── Colors ── */}
      {activeTab === 'colors' && (
        <div className="flex flex-col gap-0">
          <Group title="Custom Color Override" description="Override individual theme colors. Enable to apply your custom palette." cols={1}>
            <ToggleSwitch
              id="s-custom-colors"
              label="Enable Custom Colors"
              description="Override current theme colors with your own selections"
              checked={s.customColorsEnabled}
              onChange={s.setCustomColorsEnabled}
            />
          </Group>

          {s.customColorsEnabled && (
            <Group title="Element Colors" description="Click any swatch to pick a color." cols={3}>
              {(Object.keys(COLOR_LABELS) as (keyof typeof currentThemeColors)[]).map(key => (
                <ColorPicker
                  key={key}
                  id={`color-${key}`}
                  label={COLOR_LABELS[key]}
                  value={s.customColors[key] || (currentThemeColors as unknown as Record<string, string>)[key] || ''}
                  defaultValue={(currentThemeColors as unknown as Record<string, string>)[key]}
                  onChange={v => s.setCustomColor(key, v)}
                />
              ))}
              <div className="col-span-3 flex gap-3">
                <button
                  onClick={s.resetCustomColors}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 focus-ring"
                  style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  Reset All Colors
                </button>
              </div>
            </Group>
          )}
        </div>
      )}

      {/* ── Behavior ── */}
      {activeTab === 'behavior' && (
        <div className="flex flex-col gap-0">
          <Group title="Typing Behavior" cols={2}>
            <ToggleSwitch id="s-blur" label="Blur Completed Text" description="Blur text after typing past it" checked={s.blurCompleted} onChange={s.setBlurCompleted} />
            <ToggleSwitch id="s-punctuation" label="Include Punctuation" description="Show punctuation in test passages" checked={s.showPunctuation} onChange={s.setShowPunctuation} />
            <ToggleSwitch id="s-numbers" label="Include Numbers" description="Show numbers where applicable" checked={s.showNumbers} onChange={s.setShowNumbers} />
            <ToggleSwitch id="s-ignore-punct" label="Ignore Punctuation Errors" checked={s.ignorePunctuation} onChange={s.setIgnorePunctuation} />
            <ToggleSwitch id="s-ignore-cap" label="Ignore Capitalization" checked={s.ignoreCapitalization} onChange={s.setIgnoreCapitalization} />
            <ToggleSwitch id="s-ignore-spaces" label="Ignore Extra Spaces" checked={s.ignoreExtraSpaces} onChange={s.setIgnoreExtraSpaces} />
          </Group>
          <Group title="Test Flow" cols={2}>
            <ToggleSwitch id="s-auto-restart" label="Auto Restart" description="Automatically start a new test after completion" checked={s.autoRestart} onChange={s.setAutoRestart} />
            <ToggleSwitch id="s-auto-focus" label="Auto Focus Input" description="Focus the typing area automatically" checked={s.autoFocusInput} onChange={s.setAutoFocusInput} />
            <Slider id="s-countdown" label="Countdown Before Start" value={s.countdownBeforeStart} min={0} max={5} onChange={s.setCountdownBeforeStart} unit="s" />
          </Group>
          <Group title="Defaults" cols={2}>
            <Dropdown
              id="s-default-difficulty"
              label="Default Difficulty"
              value={s.defaultDifficulty}
              onChange={s.setDefaultDifficulty}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'medium', label: 'Medium' },
                { value: 'master', label: 'Master' },
              ]}
            />
            <Dropdown
              id="s-default-duration"
              label="Default Duration"
              value={s.defaultDuration}
              onChange={s.setDefaultDuration}
              options={[
                { value: 30, label: '30 seconds' },
                { value: 60, label: '1 minute' },
                { value: 120, label: '2 minutes' },
                { value: 300, label: '5 minutes' },
              ]}
            />
          </Group>
        </div>
      )}

      {/* ── Audio ── */}
      {activeTab === 'audio' && (
        <div className="flex flex-col gap-0">
          <Group title="Sound Control" cols={2}>
            <ToggleSwitch id="s-mute" label="Mute All Sounds" checked={s.muteAllSounds} onChange={s.setMuteAllSounds} />
            <Slider id="s-volume" label="Master Volume" value={Math.round(s.masterVolume * 100)} min={0} max={100} onChange={v => s.setMasterVolume(v / 100)} unit="%" />
          </Group>
          <Group title="Keypress Sounds" cols={2}>
            <ToggleSwitch id="s-sound" label="Key Press Sounds" description="Audible feedback when typing" checked={s.soundEnabled} onChange={s.setSoundEnabled} />
            <RadioGroup
              label="Sound Profile"
              value={s.keypressSoundType}
              onChange={s.setKeypressSoundType}
              options={[
                { value: 'click', label: 'Click', icon: '🖱️' },
                { value: 'mechanical', label: 'Mechanical', icon: '⌨️' },
                { value: 'typewriter', label: 'Typewriter', icon: '📜' },
                { value: 'beep', label: 'Beep', icon: '🔔' },
              ]}
            />
          </Group>
          <Group title="Event Sounds" cols={2}>
            <ToggleSwitch id="s-error-sound" label="Error Sounds" description="Tone when typing a wrong key" checked={s.errorSoundEnabled} onChange={s.setErrorSoundEnabled} />
            <ToggleSwitch id="s-completion-sound" label="Completion Chime" description="Celebration sound when test ends" checked={s.completionSoundEnabled} onChange={s.setCompletionSoundEnabled} />
            <ToggleSwitch id="s-success-sound" label="Success Sounds" description="Positive sound for achievements" checked={s.successSoundEnabled} onChange={s.setSuccessSoundEnabled} />
          </Group>
        </div>
      )}

      {/* ── Animation ── */}
      {activeTab === 'animation' && (
        <div className="flex flex-col gap-0">
          <Group title="Animation Controls" cols={2}>
            <ToggleSwitch id="s-anim-enabled" label="Enable Animations" description="Master toggle for all animations" checked={s.animationsEnabled} onChange={s.setAnimationsEnabled} />
            <Slider id="s-anim-speed" label="Animation Speed" value={s.animationSpeed} min={0.25} max={2} step={0.25} onChange={s.setAnimationSpeed} unit="×" />
          </Group>
          <Group title="Specific Animations" cols={2}>
            <ToggleSwitch id="s-typing-anim" label="Character Pop Animation" description="Scale bounce when typing" checked={s.typingAnimations} onChange={s.setTypingAnimations} />
            <ToggleSwitch id="s-theme-anim" label="Theme Transitions" description="Smooth color changes on theme switch" checked={s.themeTransitionAnimations} onChange={s.setThemeTransitionAnimations} />
            <ToggleSwitch id="s-hover-anim" label="Button Hover Effects" checked={s.buttonHoverAnimations} onChange={s.setButtonHoverAnimations} />
            <ToggleSwitch id="s-card-anim" label="Card Animations" description="Slide-in animations for cards" checked={s.cardAnimations} onChange={s.setCardAnimations} />
            <ToggleSwitch id="s-page-anim" label="Page Transitions" checked={s.pageTransitions} onChange={s.setPageTransitions} />
          </Group>
        </div>
      )}

      {/* ── Accessibility ── */}
      {activeTab === 'access' && (
        <div className="flex flex-col gap-0">
          <Group title="Visual Accessibility" cols={2}>
            <ToggleSwitch id="s-high-contrast" label="High Contrast Mode" description="Maximum contrast for readability" checked={s.highContrastMode} onChange={s.setHighContrastMode} />
            <ToggleSwitch id="s-larger-text" label="Larger Text" description="Increase base font size globally" checked={s.largerText} onChange={s.setLargerText} />
            <ToggleSwitch id="s-reduced-motion" label="Reduced Motion" description="Disable decorative animations" checked={s.reducedMotion} onChange={s.setReducedMotion} />
          </Group>
          <Group title="Color Blindness" cols={1}>
            <RadioGroup
              label="Colorblind Mode"
              value={s.colorblindMode}
              onChange={s.setColorblindMode}
              options={[
                { value: 'none', label: 'None', icon: '👁️' },
                { value: 'protanopia', label: 'Protanopia (red-blind)', icon: '🔴' },
                { value: 'deuteranopia', label: 'Deuteranopia (green-blind)', icon: '🟢' },
                { value: 'tritanopia', label: 'Tritanopia (blue-blind)', icon: '🔵' },
              ]}
            />
          </Group>
          <Group title="Interaction" cols={2}>
            <ToggleSwitch id="s-keyboard-nav" label="Enhanced Keyboard Navigation" checked={s.keyboardNavigation} onChange={s.setKeyboardNavigation} />
            <ToggleSwitch id="s-screen-reader" label="Screen Reader Optimization" checked={s.screenReaderOptimization} onChange={s.setScreenReaderOptimization} />
          </Group>
        </div>
      )}

      {/* ── Stats Display ── */}
      {activeTab === 'stats' && (
        <div className="flex flex-col gap-0">
          <Group title="Live Statistics Display" description="Choose which stats to show during a test." cols={2}>
            <ToggleSwitch id="s-live-wpm" label="Live WPM" checked={s.showLiveWPM} onChange={s.setShowLiveWPM} />
            <ToggleSwitch id="s-live-cpm" label="Live CPM" checked={s.showLiveCPM} onChange={s.setShowLiveCPM} />
            <ToggleSwitch id="s-live-acc" label="Live Accuracy" checked={s.showLiveAccuracy} onChange={s.setShowLiveAccuracy} />
            <ToggleSwitch id="s-live-errors" label="Error Count" checked={s.showErrorCount} onChange={s.setShowErrorCount} />
            <ToggleSwitch id="s-live-progress" label="Progress Percentage" checked={s.showProgressPercentage} onChange={s.setShowProgressPercentage} />
            <ToggleSwitch id="s-live-time" label="Remaining Time" checked={s.showRemainingTime} onChange={s.setShowRemainingTime} />
            <ToggleSwitch id="s-live-streak" label="Current Streak" checked={s.showCurrentStreak} onChange={s.setShowCurrentStreak} />
          </Group>
        </div>
      )}

      {/* ── Data Management ── */}
      {activeTab === 'data' && (
        <div className="flex flex-col gap-0">
          <Group title="Import / Export Settings" cols={2}>
            <button
              onClick={handleExport}
              id="settings-export-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              📤 Export Settings
            </button>
            <button
              onClick={handleImport}
              id="settings-import-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 focus-ring"
              style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              📥 Import Settings
            </button>
            {exportMsg && (
              <div
                className="col-span-2 text-center text-sm font-semibold py-2 rounded-xl animate-fade-in"
                style={{
                  background: 'color-mix(in srgb, var(--color-correct) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-correct) 30%, transparent)',
                  color: 'var(--color-correct)',
                }}
              >
                {exportMsg}
              </div>
            )}
          </Group>

          <Group title="Clear Data" description="These actions are irreversible." cols={2}>
            <button
              onClick={() => { if (confirm('Clear all typing history?')) { clearAllHistory(); } }}
              id="settings-clear-history-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80 focus-ring"
              style={{ background: 'color-mix(in srgb, var(--color-incorrect) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-incorrect) 30%, transparent)', color: 'var(--color-incorrect)' }}
            >
              🗑️ Clear Test History
            </button>
            <button
              onClick={() => { if (confirm('Clear all statistics?')) { clearAllStats(); } }}
              id="settings-clear-stats-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80 focus-ring"
              style={{ background: 'color-mix(in srgb, var(--color-incorrect) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-incorrect) 30%, transparent)', color: 'var(--color-incorrect)' }}
            >
              📉 Clear Statistics
            </button>
            <button
              onClick={() => { if (confirm('Clear all learning progress?')) clearAllProgress(); }}
              id="settings-clear-learn-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80 focus-ring"
              style={{ background: 'color-mix(in srgb, var(--color-incorrect) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-incorrect) 30%, transparent)', color: 'var(--color-incorrect)' }}
            >
              📚 Reset Learn Progress
            </button>
            <button
              onClick={() => { if (confirm('Restore ALL settings to factory defaults?')) s.resetSettings(); }}
              id="settings-reset-all-btn"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80 focus-ring"
              style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)', color: 'var(--color-primary)' }}
            >
              🔄 Restore Default Config
            </button>
          </Group>
        </div>
      )}
    </div>
  );
}
