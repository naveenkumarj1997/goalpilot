import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
  isRolling: boolean;
}

export default function Dice({ value, onRoll, disabled, isRolling }: DiceProps) {
  const [diceRotation, setDiceRotation] = useState({ rotateX: 15, rotateY: 15 });
  const hasRolledRef = useRef(false);

  const diceRotations: Record<number, { rotateX: number, rotateY: number }> = {
    1: { rotateX: 0, rotateY: 0 },
    2: { rotateX: 90, rotateY: 0 },
    3: { rotateX: 0, rotateY: 90 },
    4: { rotateX: 0, rotateY: -90 },
    5: { rotateX: -90, rotateY: 0 },
    6: { rotateX: 180, rotateY: 0 }
  };

  useEffect(() => {
    if (isRolling && value !== null) {
      hasRolledRef.current = true;
      setDiceRotation(prev => {
        const targetFace = diceRotations[value] || { rotateX: 0, rotateY: 0 };
        const extraSpinsX = (Math.floor(Math.random() * 10) + 10) * 360;
        const extraSpinsY = (Math.floor(Math.random() * 10) + 10) * 360;
        const currentModX = prev.rotateX % 360;
        const currentModY = prev.rotateY % 360;
        
        return {
          rotateX: prev.rotateX - currentModX + extraSpinsX + targetFace.rotateX,
          rotateY: prev.rotateY - currentModY + extraSpinsY + targetFace.rotateY
        };
      });
    } else if (value === null) {
      setDiceRotation({ rotateX: 15, rotateY: 15 });
    }
  }, [isRolling, value]);

  const renderDiceFace = (num: number, transform: string) => {
    const dots = Array.from({ length: num }).map((_, i) => (
      <div key={i} className="w-3 h-3 bg-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
    ));
    
    // Layout classes for dots
    let layoutClass = "";
    if (num === 1) layoutClass = "flex items-center justify-center";
    if (num === 2) layoutClass = "flex flex-col justify-between items-center py-2";
    if (num === 3) layoutClass = "flex flex-col justify-between items-center py-1";
    if (num === 4) layoutClass = "grid grid-cols-2 grid-rows-2 gap-2 place-items-center p-2";
    if (num === 5) layoutClass = "grid grid-cols-2 grid-rows-3 gap-1 place-items-center p-1 [&>*:nth-child(3)]:col-span-2";
    if (num === 6) layoutClass = "grid grid-cols-2 grid-rows-3 gap-2 place-items-center py-2 px-1";

    return (
      <div 
        className={`absolute w-full h-full bg-gradient-to-br from-brand to-purple-600 border-2 border-white/30 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backface-hidden ${layoutClass}`}
        style={{ transform, backfaceVisibility: 'hidden' }}
      >
        {dots}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[120px]">
      <div className="flex flex-col items-center py-4 perspective-1000">
        <div 
          className={`w-24 h-24 mb-6 ${!disabled && !isRolling ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed opacity-90'}`}
          onClick={() => !disabled && !isRolling && onRoll()}
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="w-full h-full relative"
            animate={diceRotation}
            transition={{ 
              duration: isRolling ? 6.0 : 0.4, 
              type: "tween",
              ease: "easeOut",
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front = 1 */}
            {renderDiceFace(1, 'translateZ(48px)')}
            {/* Back = 6 */}
            {renderDiceFace(6, 'rotateY(180deg) translateZ(48px)')}
            {/* Right = 4 */}
            {renderDiceFace(4, 'rotateY(90deg) translateZ(48px)')}
            {/* Left = 3 */}
            {renderDiceFace(3, 'rotateY(-90deg) translateZ(48px)')}
            {/* Top = 5 */}
            {renderDiceFace(5, 'rotateX(90deg) translateZ(48px)')}
            {/* Bottom = 2 */}
            {renderDiceFace(2, 'rotateX(-90deg) translateZ(48px)')}
          </motion.div>
        </div>
      </div>
      
      {!isRolling && value === null && !disabled && (
        <span className="text-sm font-bold text-brand animate-pulse -mt-4">ROLL DICE!</span>
      )}
    </div>
  );
}
