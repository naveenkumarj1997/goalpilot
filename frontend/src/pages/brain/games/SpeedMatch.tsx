import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const SHAPES = ['●', '■', '▲', '★', '◆', '♥'];

const SpeedMatch = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [previousShape, setPreviousShape] = useState<string | null>(null);
  const [currentShape, setCurrentShape] = useState<string | null>(null);
  const [isMatchStatus, setIsMatchStatus] = useState<boolean | null>(null); 
  const [timeRemaining, setTimeRemaining] = useState(30); 
  
  const timerRef = useRef<any>(null);
  const roundTimerRef = useRef<any>(null);

  const startGame = () => {
    setScore(0);
    setPreviousShape(null);
    setCurrentShape(null);
    setTimeRemaining(30); 
    setGameState('PLAYING');
    nextTurn(null);
  };

  const nextTurn = (prev: string | null) => {
    setIsMatchStatus(null);
    
    // 40% chance to be a match if there is a previous shape
    let nextShp = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    if (prev && Math.random() < 0.4) {
      nextShp = prev;
    }
    
    setPreviousShape(prev);
    setCurrentShape(nextShp);

    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      // User didn't click anything
      nextTurn(nextShp);
    }, 1500); // 1.5 seconds per shape max
  };

  const handleChoice = (userSaysMatch: boolean) => {
    if (gameState !== 'PLAYING' || !timerRef.current) return;
    
    if (!previousShape) return; // First shape, can't guess yet

    clearTimeout(timerRef.current);
    
    const actualMatch = previousShape === currentShape;
    
    if (userSaysMatch === actualMatch) {
      setScore(s => s + 100);
      setIsMatchStatus(true);
    } else {
      setScore(s => Math.max(0, s - 50));
      setIsMatchStatus(false);
    }
    
    setTimeout(() => {
      nextTurn(currentShape);
    }, 200);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      roundTimerRef.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            if (timerRef.current) clearTimeout(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-bold">Speed Match</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Speed Match</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Does the current symbol match the one immediately before it? Answer as fast as possible!
            </p>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start 30s Timer
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            <p className="text-slate-400 mb-4 font-mono text-xl">Time: <span className="text-white">{timeRemaining}s</span></p>
            
            <div className={`w-32 h-32 flex items-center justify-center rounded-2xl mb-8 transition-colors duration-150 ${
              isMatchStatus === true ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
              isMatchStatus === false ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
              'bg-slate-800 text-white border border-slate-700'
            }`}>
              <span className="text-7xl">{currentShape}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-sm">
              <button 
                onClick={() => handleChoice(false)}
                className="flex-1 py-6 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors text-lg"
                disabled={!previousShape}
              >
                No Match
              </button>
              <button 
                onClick={() => handleChoice(true)}
                className="flex-1 py-6 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors text-lg"
                disabled={!previousShape}
              >
                Match
              </button>
            </div>
            {!previousShape && (
              <p className="text-slate-400 mt-4 text-sm animate-pulse">Memorize the first shape...</p>
            )}
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-yellow-400 text-2xl font-bold mb-8">Time's Up!</div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('speed', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('speed', score).color}`}>
                  {getIQRank('speed', score).percentile} ({getIQRank('speed', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('speed', score).message}</p>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedMatch;
