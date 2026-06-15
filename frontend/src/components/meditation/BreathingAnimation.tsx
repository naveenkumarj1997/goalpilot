import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  mode: 'Box' | '4-7-8' | 'Deep';
  isActive: boolean;
}

export default function BreathingAnimation({ mode, isActive }: BreathingAnimationProps) {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Out)'>('Inhale');
  const [timer, setTimer] = useState(0);

  // Breathing configs
  const configs = {
    'Box': { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    '4-7-8': { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
    'Deep': { inhale: 5, holdIn: 2, exhale: 5, holdOut: 2 }
  };

  const currentConfig = configs[mode];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev + 1;
        
        if (phase === 'Inhale' && next >= currentConfig.inhale) {
          setPhase(currentConfig.holdIn > 0 ? 'Hold' : 'Exhale');
          return 0;
        }
        if (phase === 'Hold' && next >= currentConfig.holdIn) {
          setPhase('Exhale');
          return 0;
        }
        if (phase === 'Exhale' && next >= currentConfig.exhale) {
          setPhase(currentConfig.holdOut > 0 ? 'Hold (Out)' : 'Inhale');
          return 0;
        }
        if (phase === 'Hold (Out)' && next >= currentConfig.holdOut) {
          setPhase('Inhale');
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, currentConfig]);

  // Scale based on phase
  let scale = 1;
  let transitionDuration = 1;

  if (phase === 'Inhale') {
    scale = 1.5;
    transitionDuration = currentConfig.inhale;
  } else if (phase === 'Exhale') {
    scale = 1;
    transitionDuration = currentConfig.exhale;
  } else if (phase === 'Hold') {
    scale = 1.5;
    transitionDuration = currentConfig.holdIn;
  } else {
    scale = 1;
    transitionDuration = currentConfig.holdOut;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer expanding circle */}
        <motion.div
          animate={{
            scale: isActive ? scale : 1,
            opacity: isActive ? 0.3 : 0.1
          }}
          transition={{
            duration: isActive ? transitionDuration : 1,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-indigo-500 rounded-full blur-xl"
        />
        
        {/* Inner solid circle */}
        <motion.div
          animate={{
            scale: isActive ? scale : 1,
          }}
          transition={{
            duration: isActive ? transitionDuration : 1,
            ease: "easeInOut"
          }}
          className="relative w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-indigo-300/30 z-10"
        >
          <div className="text-white text-xl font-bold tracking-wider">
            {isActive ? phase : 'Ready'}
          </div>
        </motion.div>
      </div>

      {isActive && (
        <div className="mt-8 text-center">
          <p className="text-2xl text-white font-light">{timer}s</p>
          <p className="text-indigo-200/50 text-sm mt-2">{mode} Breathing</p>
        </div>
      )}
    </div>
  );
}
