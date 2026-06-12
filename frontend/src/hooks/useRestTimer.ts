import { useState, useEffect, useRef } from 'react';

export function useRestTimer(initialTime: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio on mount
    audioRef.current = new Audio('/sounds/beep.mp3'); // Need to ensure we handle missing sound gracefully
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 4 && time > 1) {
            // Tick sound for last 3 seconds
            try {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            } catch (e) {}
          }
          return time - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      try {
        if (audioRef.current) {
          // Long beep
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      } catch (e) {}
      if (onComplete) onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const start = (time?: number) => {
    if (time) setTimeLeft(time);
    setIsActive(true);
  };

  const pause = () => setIsActive(false);
  const resume = () => setIsActive(true);
  const reset = (time?: number) => {
    setIsActive(false);
    setTimeLeft(time || initialTime);
  };

  return { timeLeft, isActive, start, pause, resume, reset };
}
