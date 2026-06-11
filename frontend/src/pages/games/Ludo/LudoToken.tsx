import { useState, useEffect } from 'react';
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
            ? `0 0 25px ${isRed ? '#ff6b6b' : '#4dabf7'}, 0 0 10px white` 
            : `0 5px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.5)`
        }}
        transition={{
          left: { type: "spring", stiffness: 250, damping: 20, mass: 0.8 },
          top: { type: "spring", stiffness: 250, damping: 20, mass: 0.8 },
          scale: isSelectable ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : { duration: 0.2 },
          boxShadow: { duration: 0.2 }
        }}
        className={`absolute w-[4%] aspect-square rounded-full z-20 
          ${isSelectable ? 'cursor-pointer' : 'cursor-default'}
        `}
        style={{
          background: isRed 
            ? 'radial-gradient(circle at 30% 30%, #ff8787, #c92a2a)' 
            : 'radial-gradient(circle at 30% 30%, #74c0fc, #1864ab)',
          border: `2px solid ${isRed ? '#ffe3e3' : '#d0ebff'}`,
        }}
      >
        <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-white/60 rounded-full blur-[1px]" />
      </motion.div>
    </>
  );
}
