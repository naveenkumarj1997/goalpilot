import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const ReactionTimer = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'WAITING' | 'CLICK' | 'RESULT'>('START');
  const [message, setMessage] = useState('Click to Start');
  const [bgColor, setBgColor] = useState('bg-slate-800');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const timeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleClick = () => {
    if (gameState === 'START' || gameState === 'RESULT') {
      setGameState('WAITING');
      setMessage('Wait for Green...');
      setBgColor('bg-red-500');
      
      // Random time between 2 to 5 seconds
      const waitTime = Math.floor(Math.random() * 3000) + 2000;
      
      timeoutRef.current = setTimeout(() => {
        setGameState('CLICK');
        setMessage('CLICK!');
        setBgColor('bg-emerald-500');
        startTimeRef.current = Date.now();
      }, waitTime);
    } 
    else if (gameState === 'WAITING') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('RESULT');
      setMessage('Too Soon!');
      setBgColor('bg-orange-500');
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

  const average = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) 
    : 0;

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="max-w-2xl mx-auto w-full text-center animate-slide-up-fade">
      <div className="flex justify-between items-center mb-6 text-slate-300 px-4">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-bold">Avg: {average > 0 ? `${average} ms` : '-'}</span>
        </div>
      </div>

      <div 
        onClick={handleClick}
        className={`w-full aspect-[4/3] rounded-3xl cursor-pointer flex flex-col items-center justify-center transition-colors duration-200 border border-white/10 shadow-2xl ${bgColor}`}
      >
        <h2 className="text-4xl md:text-6xl font-black text-white select-none pointer-events-none drop-shadow-md">
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
            <p className="text-white/80 mt-6 select-none">Click to try again</p>
          </div>
        )}
        {gameState === 'RESULT' && reactionTime === null && (
          <p className="text-white/80 mt-4 select-none pointer-events-none">You clicked before it turned green.</p>
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
