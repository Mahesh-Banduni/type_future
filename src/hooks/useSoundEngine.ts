'use client';

import { useCallback } from 'react';

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.08,
  volumeScale = 1
) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain * volumeScale, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context not available — silent fallback
  }
}

function playSoundProfile(
  profile: 'click' | 'mechanical' | 'typewriter' | 'beep',
  isError: boolean,
  volume: number
) {
  if (isError) {
    // Error tones by profile
    switch (profile) {
      case 'mechanical':
        playTone(120, 0.15, 'square', 0.07, volume);
        break;
      case 'typewriter':
        playTone(200, 0.1, 'sawtooth', 0.07, volume);
        break;
      case 'beep':
        playTone(440, 0.1, 'sine', 0.06, volume);
        break;
      default: // click
        playTone(180, 0.12, 'sawtooth', 0.06, volume);
    }
  } else {
    // Keypress tones by profile
    switch (profile) {
      case 'mechanical':
        playTone(600, 0.04, 'square', 0.04, volume);
        break;
      case 'typewriter':
        playTone(1200, 0.03, 'sawtooth', 0.03, volume);
        break;
      case 'beep':
        playTone(800, 0.05, 'sine', 0.04, volume);
        break;
      default: // click
        playTone(900, 0.03, 'sine', 0.04, volume);
    }
  }
}

interface SoundOptions {
  soundEnabled: boolean;
  errorSoundEnabled: boolean;
  completionSoundEnabled: boolean;
  successSoundEnabled?: boolean;
  keypressSoundType?: 'click' | 'mechanical' | 'typewriter' | 'beep';
  masterVolume?: number;
  muteAllSounds?: boolean;
}

export function useSoundEngine(options?: SoundOptions) {
  const playKeySound = useCallback((isError: boolean) => {
    if (!options) return;
    if (options.muteAllSounds) return;
    const volume = options.masterVolume ?? 0.5;
    const profile = options.keypressSoundType ?? 'click';
    if (isError && options.errorSoundEnabled) {
      playSoundProfile(profile, true, volume);
    } else if (!isError && options.soundEnabled) {
      playSoundProfile(profile, false, volume);
    }
  }, [options]);

  const playCompletionSound = useCallback(() => {
    if (options?.muteAllSounds) return;
    const volume = options?.masterVolume ?? 0.5;
    // Rising arpeggio
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.1, volume), i * 100);
    });
  }, [options]);

  const playSuccessSound = useCallback(() => {
    if (options?.muteAllSounds) return;
    if (!options?.successSoundEnabled) return;
    const volume = options?.masterVolume ?? 0.5;
    [440, 550, 660, 880].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.08, volume), i * 80);
    });
  }, [options]);

  const playErrorSound = useCallback(() => {
    if (options?.muteAllSounds) return;
    const volume = options?.masterVolume ?? 0.5;
    playTone(220, 0.2, 'sawtooth', 0.08, volume);
  }, [options]);

  return { playKeySound, playCompletionSound, playSuccessSound, playErrorSound };
}
