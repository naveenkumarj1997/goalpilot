import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTokenCoordinates } from './ludoLogic';

interface LudoTokenProps {
  id: number;
  player: 'red' | 'blue';
  progress: number;
  isActiveTurn: boolean;
  isSelectable: boolean;
  onClick: (id: number) => void;
}

export default function LudoToken({ id, player, progress, isSelectable, onClick }: LudoTokenProps) {
  const coords = getTokenCoordinates(player, progress, id);
  const [trail, setTrail] = useState<{id: number, left: number, top: number}[]>([]);
  
  let left = coords.x * 6.66 + 1.33;
  let top = coords.y * 6.66 + 1.33;

  const [justCaptured, setJustCaptured] = useState(false);
  const prevProgress = useRef(progress);

  useEffect(() => {
    if (prevProgress.current > 0 && progress === 0) {
      setJustCaptured(true);
      const timer = setTimeout(() => setJustCaptured(false), 2500);
      return () => clearTimeout(timer);
    }
    prevProgress.current = progress;
  }, [progress]);

  const getEmoji = () => {
    if (justCaptured) return '😭';
    if (progress === 0) return '🥺';
    if (progress === 57) return '😎';
    return '😃';
  };

  useEffect(() => {
    if (progress === 0) return; // Don't trail in base initially
    const newTrail = { id: Date.now(), left, top };
    setTrail(prev => [...prev, newTrail].slice(-4)); 
    
    const timer = setTimeout(() => {
      setTrail(prev => prev.filter(p => p.id !== newTrail.id));
    }, 400);
    return () => clearTimeout(timer);
  }, [left, top, progress]);

  const isRed = player === 'red';

  return (
    <>
      <AnimatePresence>
        {trail.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0.8, scale: 0.8, left: `${t.left}%`, top: `${t.top}%` }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-[4%] aspect-square rounded-full z-10 pointer-events-none mix-blend-screen"
            style={{
              background: isRed ? '#ff6b6b' : '#4dabf7',
              filter: 'blur(4px)'
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        onClick={() => isSelectable && onClick(id)}
        initial={false}
        animate={{
          left: `${left}%`,
          top: `${top}%`,
          scale: isSelectable ? [1, 1.15, 1] : 1,
          boxShadow: isSelectable 
            ? `0 10px 25px ${isRed ? '#ef4444' : '#3b82f6'}, inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.8)` 
            : `0 8px 12px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.8)`
        }}
        transition={{
          left: { type: "spring", stiffness: 250, damping: 20, mass: 0.8 },
          top: { type: "spring", stiffness: 250, damping: 20, mass: 0.8 },
          scale: isSelectable ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : { duration: 0.2 },
          boxShadow: { duration: 0.2 }
        }}
        className={`absolute w-[4%] aspect-square rounded-full z-20 flex items-center justify-center text-[10px] sm:text-xs md:text-sm lg:text-base
          ${isSelectable ? 'cursor-pointer ring-4 ring-white/50 animate-pulse' : 'cursor-default'}
        `}
        style={{
          background: isRed 
            ? 'radial-gradient(circle at 30% 30%, #fca5a5 0%, #ef4444 50%, #991b1b 100%)' 
            : 'radial-gradient(circle at 30% 30%, #93c5fd 0%, #3b82f6 50%, #1e3a8a 100%)',
          border: `1px solid ${isRed ? '#7f1d1d' : '#1e3a8a'}`,
        }}
      >
        {/* Extra glossy highlight */}
        <div className="absolute top-[5%] left-[10%] w-[40%] h-[30%] bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[0.5px] transform -rotate-12" />
        <span className="relative z-10 drop-shadow-md select-none">{getEmoji()}</span>
      </motion.div>
    </>
  );
}
