import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const ReactionTimer = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'WAITING' | 'CLICK' | 'RESULT' | 'GAMEOVER'>('START');
  const [message, setMessage] = useState('Click to Start');
  const [bgColor, setBgColor] = useState('bg-slate-800');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState(1);
  
  const average = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) 
    : 0;
  
  const score = Math.max(0, (1000 - average) * difficulty);

  const timeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFakeFlashRef = useRef<boolean>(false);

  const getWaitParams = () => {
    switch(difficulty) {
      case 1: return { min: 1000, max: 3000, fakeChance: 0 };
      case 2: return { min: 2000, max: 5000, fakeChance: 0 };
      case 3: return { min: 2000, max: 5000, fakeChance: 0.4 };
      default: return { min: 2000, max: 5000, fakeChance: 0 };
    }
  };

  const scheduleNextEvent = () => {
    const params = getWaitParams();
    const waitTime = Math.floor(Math.random() * (params.max - params.min)) + params.min;
    
    // Will it be a fake flash?
    const isFake = Math.random() < params.fakeChance;
    
    timeoutRef.current = setTimeout(() => {
      if (isFake) {
        // Fake flash (Yellow)
        isFakeFlashRef.current = true;
        setBgColor('bg-yellow-500');
        setMessage('WAIT...');
        
        // Return to red after 500ms and schedule real one
        setTimeout(() => {
          if (gameState === 'WAITING' && isFakeFlashRef.current) {
            setBgColor('bg-red-500');
            isFakeFlashRef.current = false;
            scheduleNextEvent(); // Recursively schedule next (real or fake)
          }
        }, 500);
      } else {
        // Real flash (Green)
        isFakeFlashRef.current = false;
        setGameState('CLICK');
        setMessage('CLICK!');
        setBgColor('bg-emerald-500');
        startTimeRef.current = Date.now();
      }
    }, waitTime);
  };

  const handleClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    if (gameState === 'START' || gameState === 'RESULT') {
      setGameState('WAITING');
      setMessage('Wait for Green...');
      setBgColor('bg-red-500');
      isFakeFlashRef.current = false;
      scheduleNextEvent();
    } 
    else if (gameState === 'WAITING') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      if (isFakeFlashRef.current) {
        setGameState('RESULT');
        setMessage('Fell for the trick!');
        setBgColor('bg-orange-500');
        isFakeFlashRef.current = false;
      } else {
        setGameState('RESULT');
        setMessage('Too Soon!');
        setBgColor('bg-orange-500');
      }
    } 
    else if (gameState === 'CLICK') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setHistory(prev => [...prev, time]);
      setGameState('RESULT');
      setMessage(`${time} ms`);
      setBgColor('bg-slate-800');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);


  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="max-w-2xl mx-auto w-full text-center animate-slide-up-fade p-4">
      <div className="flex justify-between items-center mb-6 text-slate-300">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-bold">Avg: {average > 0 ? `${average} ms` : '-'}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-slate-400 font-bold">Difficulty:</span>
           <button onClick={() => setDifficulty(1)} className={`px-3 py-1 rounded-lg font-bold text-xs ${difficulty === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
           <button onClick={() => setDifficulty(2)} className={`px-3 py-1 rounded-lg font-bold text-xs ${difficulty === 2 ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Med</button>
           <button onClick={() => setDifficulty(3)} className={`px-3 py-1 rounded-lg font-bold text-xs ${difficulty === 3 ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
        </div>
      </div>

      <div 
        onPointerDown={handleClick}
        className={`w-full aspect-[4/3] rounded-3xl cursor-pointer flex flex-col items-center justify-center transition-colors duration-200 border border-white/10 shadow-2xl ${bgColor} touch-manipulation`}
      >
        <h2 className="text-4xl md:text-6xl font-black text-white select-none pointer-events-none drop-shadow-md px-4">
          {message}
        </h2>
        {gameState === 'RESULT' && reactionTime !== null && (
          <div className="mt-8 text-center animate-slide-up-fade pointer-events-none">
            <div className="bg-slate-900/40 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-1">
                <Activity className={`w-5 h-5 mr-2 ${getIQRank('reaction', reactionTime).color}`} />
                <span className={`text-lg font-black ${getIQRank('reaction', reactionTime).color}`}>
                  {getIQRank('reaction', reactionTime).percentile} ({getIQRank('reaction', reactionTime).title})
                </span>
              </div>
            </div>
            <p className="text-white/80 mt-6 select-none">Tap to try again</p>
          </div>
        )}
        {gameState === 'RESULT' && reactionTime === null && (
          <p className="text-white/80 mt-4 select-none pointer-events-none">Tap to try again</p>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-8 flex gap-2 justify-center flex-wrap">
          {history.map((t, idx) => (
            <div key={idx} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-700">
              {t} ms
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionTimer;
