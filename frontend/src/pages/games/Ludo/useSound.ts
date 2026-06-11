import { useCallback, useRef } from 'react';

export function useLudoSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playOscillator = useCallback((
    type: OscillatorType,
    freqs: number[],
    durations: number[],
    vol = 0.1
  ) => {
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      let time = ctx.currentTime;
      osc.frequency.setValueAtTime(freqs[0], time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.05);

      for (let i = 0; i < freqs.length; i++) {
        osc.frequency.setValueAtTime(freqs[i], time);
        time += durations[i];
      }

      gain.gain.exponentialRampToValueAtTime(0.001, time);
      osc.start();
      osc.stop(time);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }, []);

  const playRoll = useCallback(() => {
    // Quick rattling sound
    playOscillator('triangle', [800, 1200, 600, 1000], [0.05, 0.05, 0.05, 0.1], 0.05);
  }, [playOscillator]);

  const playMove = useCallback(() => {
    // Soft bloop
    playOscillator('sine', [400, 600], [0.05, 0.1], 0.1);
  }, [playOscillator]);

  const playCapture = useCallback(() => {
    // Aggressive smash
    playOscillator('square', [150, 100, 50], [0.1, 0.1, 0.2], 0.15);
  }, [playOscillator]);

  const playWin = useCallback(() => {
    // Triumphant arpeggio
    playOscillator('sine', [440, 554, 659, 880], [0.1, 0.1, 0.1, 0.4], 0.15);
  }, [playOscillator]);

  return { playRoll, playMove, playCapture, playWin };
}
