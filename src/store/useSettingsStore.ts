'use client';

import { create } from 'zustand';
import { UserSettings, ThemeName, Difficulty, TestDuration, FontFamily, FontSize, LineSpacing, CharSpacing, CaretStyle } from '@/types';
import { getSettings, saveSettings, defaultSettings } from '@/utils/storage';

interface SettingsState extends UserSettings {
  hydrated: boolean;
  hydrate: () => void;

  // Existing setters
  setTheme: (theme: ThemeName) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
  setCharSpacing: (spacing: CharSpacing) => void;
  setCaretStyle: (style: CaretStyle) => void;
  setSoundEnabled: (v: boolean) => void;
  setErrorSoundEnabled: (v: boolean) => void;
  setCompletionSoundEnabled: (v: boolean) => void;
  setCharacterAnimation: (v: boolean) => void;
  setBlurCompleted: (v: boolean) => void;
  setShowPunctuation: (v: boolean) => void;
  setShowNumbers: (v: boolean) => void;
  setDifficulty: (d: Difficulty) => void;
  setDuration: (d: TestDuration) => void;

  // Font settings
  setFontWeight: (v: number) => void;
  setLetterSpacing: (v: number) => void;
  setWordSpacing: (v: number) => void;
  setLineHeight: (v: number) => void;

  // Typing area
  setTextWidth: (v: number) => void;
  setTextAlignment: (v: UserSettings['textAlignment']) => void;
  setParagraphSpacing: (v: number) => void;
  setCompletedOpacity: (v: number) => void;
  setUpcomingOpacity: (v: number) => void;
  setCursorThickness: (v: number) => void;
  setCursorColor: (v: string) => void;
  setCursorBlinkSpeed: (v: number) => void;

  // Color customization
  setCustomColorsEnabled: (v: boolean) => void;
  setCustomColor: (key: string, value: string) => void;
  resetCustomColors: () => void;

  // UI controls
  setShowNavbar: (v: boolean) => void;
  setShowFooter: (v: boolean) => void;
  setCollapseStats: (v: boolean) => void;
  setShowSidebar: (v: boolean) => void;
  setCompactMode: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setDistractionFree: (v: boolean) => void;
  setHideCompletedText: (v: boolean) => void;
  setHighlightCurrentWord: (v: boolean) => void;
  setHighlightCurrentLine: (v: boolean) => void;

  // Animation
  setAnimationsEnabled: (v: boolean) => void;
  setAnimationSpeed: (v: number) => void;
  setTypingAnimations: (v: boolean) => void;
  setThemeTransitionAnimations: (v: boolean) => void;
  setButtonHoverAnimations: (v: boolean) => void;
  setCardAnimations: (v: boolean) => void;
  setPageTransitions: (v: boolean) => void;

  // Sound
  setKeypressSoundType: (v: UserSettings['keypressSoundType']) => void;
  setErrorSoundType: (v: UserSettings['errorSoundType']) => void;
  setSuccessSoundEnabled: (v: boolean) => void;
  setMasterVolume: (v: number) => void;
  setMuteAllSounds: (v: boolean) => void;

  // Accessibility
  setHighContrastMode: (v: boolean) => void;
  setLargerText: (v: boolean) => void;
  setKeyboardNavigation: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setScreenReaderOptimization: (v: boolean) => void;
  setColorblindMode: (v: UserSettings['colorblindMode']) => void;

  // Practice preferences
  setDefaultDifficulty: (v: Difficulty) => void;
  setDefaultDuration: (v: TestDuration) => void;
  setDefaultPracticeMode: (v: UserSettings['defaultPracticeMode']) => void;
  setAutoRestart: (v: boolean) => void;
  setAutoFocusInput: (v: boolean) => void;
  setCountdownBeforeStart: (v: number) => void;
  setRandomParagraphBehavior: (v: boolean) => void;
  setIgnorePunctuation: (v: boolean) => void;
  setIgnoreCapitalization: (v: boolean) => void;
  setIgnoreExtraSpaces: (v: boolean) => void;

  // Stats display
  setShowLiveWPM: (v: boolean) => void;
  setShowLiveCPM: (v: boolean) => void;
  setShowLiveAccuracy: (v: boolean) => void;
  setShowErrorCount: (v: boolean) => void;
  setShowProgressPercentage: (v: boolean) => void;
  setShowRemainingTime: (v: boolean) => void;
  setShowCurrentStreak: (v: boolean) => void;

  // Data management
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

function makeSetter<K extends keyof UserSettings>(key: K) {
  return (get: () => SettingsState, set: (s: Partial<SettingsState>) => void) =>
    (value: UserSettings[K]) => {
      const update = { [key]: value } as Partial<UserSettings>;
      set(update);
      saveSettings({ ...get(), ...update } as UserSettings);
    };
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const saved = getSettings();
    set({ ...saved, hydrated: true });
  },

  // Existing
  setTheme: (theme) => { set({ theme }); saveSettings({ ...get(), theme }); },
  setFontSize: (fontSize) => { set({ fontSize }); saveSettings({ ...get(), fontSize }); },
  setFontFamily: (fontFamily) => { set({ fontFamily }); saveSettings({ ...get(), fontFamily }); },
  setLineSpacing: (lineSpacing) => { set({ lineSpacing }); saveSettings({ ...get(), lineSpacing }); },
  setCharSpacing: (charSpacing) => { set({ charSpacing }); saveSettings({ ...get(), charSpacing }); },
  setCaretStyle: (caretStyle) => { set({ caretStyle }); saveSettings({ ...get(), caretStyle }); },
  setSoundEnabled: (soundEnabled) => { set({ soundEnabled }); saveSettings({ ...get(), soundEnabled }); },
  setErrorSoundEnabled: (errorSoundEnabled) => { set({ errorSoundEnabled }); saveSettings({ ...get(), errorSoundEnabled }); },
  setCompletionSoundEnabled: (completionSoundEnabled) => { set({ completionSoundEnabled }); saveSettings({ ...get(), completionSoundEnabled }); },
  setCharacterAnimation: (characterAnimation) => { set({ characterAnimation }); saveSettings({ ...get(), characterAnimation }); },
  setBlurCompleted: (blurCompleted) => { set({ blurCompleted }); saveSettings({ ...get(), blurCompleted }); },
  setShowPunctuation: (showPunctuation) => { set({ showPunctuation }); saveSettings({ ...get(), showPunctuation }); },
  setShowNumbers: (showNumbers) => { set({ showNumbers }); saveSettings({ ...get(), showNumbers }); },
  setDifficulty: (difficulty) => { set({ difficulty }); saveSettings({ ...get(), difficulty }); },
  setDuration: (duration) => { set({ duration }); saveSettings({ ...get(), duration }); },

  // Font
  setFontWeight: (fontWeight) => { set({ fontWeight }); saveSettings({ ...get(), fontWeight }); },
  setLetterSpacing: (letterSpacing) => { set({ letterSpacing }); saveSettings({ ...get(), letterSpacing }); },
  setWordSpacing: (wordSpacing) => { set({ wordSpacing }); saveSettings({ ...get(), wordSpacing }); },
  setLineHeight: (lineHeight) => { set({ lineHeight }); saveSettings({ ...get(), lineHeight }); },

  // Typing area
  setTextWidth: (textWidth) => { set({ textWidth }); saveSettings({ ...get(), textWidth }); },
  setTextAlignment: (textAlignment) => { set({ textAlignment }); saveSettings({ ...get(), textAlignment }); },
  setParagraphSpacing: (paragraphSpacing) => { set({ paragraphSpacing }); saveSettings({ ...get(), paragraphSpacing }); },
  setCompletedOpacity: (completedOpacity) => { set({ completedOpacity }); saveSettings({ ...get(), completedOpacity }); },
  setUpcomingOpacity: (upcomingOpacity) => { set({ upcomingOpacity }); saveSettings({ ...get(), upcomingOpacity }); },
  setCursorThickness: (cursorThickness) => { set({ cursorThickness }); saveSettings({ ...get(), cursorThickness }); },
  setCursorColor: (cursorColor) => { set({ cursorColor }); saveSettings({ ...get(), cursorColor }); },
  setCursorBlinkSpeed: (cursorBlinkSpeed) => { set({ cursorBlinkSpeed }); saveSettings({ ...get(), cursorBlinkSpeed }); },

  // Colors
  setCustomColorsEnabled: (customColorsEnabled) => { set({ customColorsEnabled }); saveSettings({ ...get(), customColorsEnabled }); },
  setCustomColor: (key, value) => {
    const customColors = { ...get().customColors, [key]: value };
    set({ customColors });
    saveSettings({ ...get(), customColors });
  },
  resetCustomColors: () => {
    const customColors = {};
    set({ customColors });
    saveSettings({ ...get(), customColors });
  },

  // UI controls
  setShowNavbar: (showNavbar) => { set({ showNavbar }); saveSettings({ ...get(), showNavbar }); },
  setShowFooter: (showFooter) => { set({ showFooter }); saveSettings({ ...get(), showFooter }); },
  setCollapseStats: (collapseStats) => { set({ collapseStats }); saveSettings({ ...get(), collapseStats }); },
  setShowSidebar: (showSidebar) => { set({ showSidebar }); saveSettings({ ...get(), showSidebar }); },
  setCompactMode: (compactMode) => { set({ compactMode }); saveSettings({ ...get(), compactMode }); },
  setFocusMode: (focusMode) => { set({ focusMode }); saveSettings({ ...get(), focusMode }); },
  setDistractionFree: (distractionFree) => { set({ distractionFree }); saveSettings({ ...get(), distractionFree }); },
  setHideCompletedText: (hideCompletedText) => { set({ hideCompletedText }); saveSettings({ ...get(), hideCompletedText }); },
  setHighlightCurrentWord: (highlightCurrentWord) => { set({ highlightCurrentWord }); saveSettings({ ...get(), highlightCurrentWord }); },
  setHighlightCurrentLine: (highlightCurrentLine) => { set({ highlightCurrentLine }); saveSettings({ ...get(), highlightCurrentLine }); },

  // Animation
  setAnimationsEnabled: (animationsEnabled) => { set({ animationsEnabled }); saveSettings({ ...get(), animationsEnabled }); },
  setAnimationSpeed: (animationSpeed) => { set({ animationSpeed }); saveSettings({ ...get(), animationSpeed }); },
  setTypingAnimations: (typingAnimations) => { set({ typingAnimations }); saveSettings({ ...get(), typingAnimations }); },
  setThemeTransitionAnimations: (themeTransitionAnimations) => { set({ themeTransitionAnimations }); saveSettings({ ...get(), themeTransitionAnimations }); },
  setButtonHoverAnimations: (buttonHoverAnimations) => { set({ buttonHoverAnimations }); saveSettings({ ...get(), buttonHoverAnimations }); },
  setCardAnimations: (cardAnimations) => { set({ cardAnimations }); saveSettings({ ...get(), cardAnimations }); },
  setPageTransitions: (pageTransitions) => { set({ pageTransitions }); saveSettings({ ...get(), pageTransitions }); },

  // Sound
  setKeypressSoundType: (keypressSoundType) => { set({ keypressSoundType }); saveSettings({ ...get(), keypressSoundType }); },
  setErrorSoundType: (errorSoundType) => { set({ errorSoundType }); saveSettings({ ...get(), errorSoundType }); },
  setSuccessSoundEnabled: (successSoundEnabled) => { set({ successSoundEnabled }); saveSettings({ ...get(), successSoundEnabled }); },
  setMasterVolume: (masterVolume) => { set({ masterVolume }); saveSettings({ ...get(), masterVolume }); },
  setMuteAllSounds: (muteAllSounds) => { set({ muteAllSounds }); saveSettings({ ...get(), muteAllSounds }); },

  // Accessibility
  setHighContrastMode: (highContrastMode) => { set({ highContrastMode }); saveSettings({ ...get(), highContrastMode }); },
  setLargerText: (largerText) => { set({ largerText }); saveSettings({ ...get(), largerText }); },
  setKeyboardNavigation: (keyboardNavigation) => { set({ keyboardNavigation }); saveSettings({ ...get(), keyboardNavigation }); },
  setReducedMotion: (reducedMotion) => { set({ reducedMotion }); saveSettings({ ...get(), reducedMotion }); },
  setScreenReaderOptimization: (screenReaderOptimization) => { set({ screenReaderOptimization }); saveSettings({ ...get(), screenReaderOptimization }); },
  setColorblindMode: (colorblindMode) => { set({ colorblindMode }); saveSettings({ ...get(), colorblindMode }); },

  // Practice prefs
  setDefaultDifficulty: (defaultDifficulty) => { set({ defaultDifficulty }); saveSettings({ ...get(), defaultDifficulty }); },
  setDefaultDuration: (defaultDuration) => { set({ defaultDuration }); saveSettings({ ...get(), defaultDuration }); },
  setDefaultPracticeMode: (defaultPracticeMode) => { set({ defaultPracticeMode }); saveSettings({ ...get(), defaultPracticeMode }); },
  setAutoRestart: (autoRestart) => { set({ autoRestart }); saveSettings({ ...get(), autoRestart }); },
  setAutoFocusInput: (autoFocusInput) => { set({ autoFocusInput }); saveSettings({ ...get(), autoFocusInput }); },
  setCountdownBeforeStart: (countdownBeforeStart) => { set({ countdownBeforeStart }); saveSettings({ ...get(), countdownBeforeStart }); },
  setRandomParagraphBehavior: (randomParagraphBehavior) => { set({ randomParagraphBehavior }); saveSettings({ ...get(), randomParagraphBehavior }); },
  setIgnorePunctuation: (ignorePunctuation) => { set({ ignorePunctuation }); saveSettings({ ...get(), ignorePunctuation }); },
  setIgnoreCapitalization: (ignoreCapitalization) => { set({ ignoreCapitalization }); saveSettings({ ...get(), ignoreCapitalization }); },
  setIgnoreExtraSpaces: (ignoreExtraSpaces) => { set({ ignoreExtraSpaces }); saveSettings({ ...get(), ignoreExtraSpaces }); },

  // Stats display
  setShowLiveWPM: (showLiveWPM) => { set({ showLiveWPM }); saveSettings({ ...get(), showLiveWPM }); },
  setShowLiveCPM: (showLiveCPM) => { set({ showLiveCPM }); saveSettings({ ...get(), showLiveCPM }); },
  setShowLiveAccuracy: (showLiveAccuracy) => { set({ showLiveAccuracy }); saveSettings({ ...get(), showLiveAccuracy }); },
  setShowErrorCount: (showErrorCount) => { set({ showErrorCount }); saveSettings({ ...get(), showErrorCount }); },
  setShowProgressPercentage: (showProgressPercentage) => { set({ showProgressPercentage }); saveSettings({ ...get(), showProgressPercentage }); },
  setShowRemainingTime: (showRemainingTime) => { set({ showRemainingTime }); saveSettings({ ...get(), showRemainingTime }); },
  setShowCurrentStreak: (showCurrentStreak) => { set({ showCurrentStreak }); saveSettings({ ...get(), showCurrentStreak }); },

  // Data management
  resetSettings: () => {
    set({ ...defaultSettings });
    saveSettings(defaultSettings);
  },
  exportSettings: () => {
    return JSON.stringify(get(), null, 2);
  },
  importSettings: (json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<UserSettings>;
      const merged = { ...defaultSettings, ...parsed };
      set(merged);
      saveSettings(merged);
      return true;
    } catch {
      return false;
    }
  },
}));

// Unused but keep to avoid lint
void makeSetter;
