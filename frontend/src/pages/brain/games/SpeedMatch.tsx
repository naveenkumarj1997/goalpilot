import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const SHAPES = ['●', '■', '▲', '★', '◆', '♥', '✿', '✦', '⬟', '❖'];
const COLORS = ['text-white', 'text-blue-500', 'text-emerald-500', 'text-yellow-500', 'text-purple-500'];

interface ShapeItem {
  symbol: string;
  colorClass: string;
}

const SpeedMatch = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState(0);
  
  const [previousShape, setPreviousShape] = useState<ShapeItem | null>(null);
  const [currentShape, setCurrentShape] = useState<ShapeItem | null>(null);
  
  const [isMatchStatus, setIsMatchStatus] = useState<boolean | null>(null); 
  const [timeRemaining, setTimeRemaining] = useState(30); 
  
  const timerRef = useRef<any>(null);
  const roundTimerRef = useRef<any>(null);

  const getGameParams = () => {
    switch(difficulty) {
      case 1: return { totalTime: 40, timePerShape: 1500, shapeCount: 6, useColors: false };
      case 2: return { totalTime: 30, timePerShape: 1200, shapeCount: 10, useColors: false };
      case 3: return { totalTime: 20, timePerShape: 1000, shapeCount: 8, useColors: true };
      default: return { totalTime: 30, timePerShape: 1500, shapeCount: 6, useColors: false };
    }
  };

  const startGame = () => {
    const params = getGameParams();
    setScore(0);
    setPreviousShape(null);
    setCurrentShape(null);
    setTimeRemaining(params.totalTime); 
    setGameState('PLAYING');
    nextTurn(null);
  };

  const getRandomShape = (params: any, excludeShape?: ShapeItem | null): ShapeItem => {
    const availableShapes = SHAPES.slice(0, params.shapeCount);
    let symbol = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    let colorClass = params.useColors ? COLORS[Math.floor(Math.random() * COLORS.length)] : 'text-white';
    
    // Prevent accidental match if we are forcing a non-match
    if (excludeShape) {
      while (symbol === excludeShape.symbol && (!params.useColors || colorClass === excludeShape.colorClass)) {
        symbol = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        colorClass = params.useColors ? COLORS[Math.floor(Math.random() * COLORS.length)] : 'text-white';
      }
    }
    
    return { symbol, colorClass };
  };

  const checkMatch = (shape1: ShapeItem, shape2: ShapeItem, useColors: boolean) => {
    if (useColors) {
      return shape1.symbol === shape2.symbol && shape1.colorClass === shape2.colorClass;
    }
    return shape1.symbol === shape2.symbol;
  };

  const nextTurn = (prev: ShapeItem | null) => {
    setIsMatchStatus(null);
    const params = getGameParams();
    
    let nextShp: ShapeItem;
    const forceMatch = Math.random() < 0.4;
    
    if (prev && forceMatch) {
      nextShp = { ...prev }; // It's a match
    } else {
      // Force it to NOT be a match by passing prev to exclude
      nextShp = getRandomShape(params, prev);
    }
    
    setPreviousShape(prev);
    setCurrentShape(nextShp);

    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      // User didn't click anything, move to next
      nextTurn(nextShp);
    }, params.timePerShape);
  };

  const handleChoice = (userSaysMatch: boolean) => {
    if (gameState !== 'PLAYING' || !timerRef.current || !currentShape) return;
    if (!previousShape) return; // First shape, can't guess yet
    if (isMatchStatus !== null) return; // Prevent double clicking

    clearTimeout(timerRef.current);
    
    const params = getGameParams();
    const actualMatch = checkMatch(previousShape, currentShape, params.useColors);
    
    if (userSaysMatch === actualMatch) {
      setScore(s => s + (100 * difficulty));
      setIsMatchStatus(true);
    } else {
      setScore(s => Math.max(0, s - (50 * difficulty)));
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
              {difficulty === 3 ? "Does the current symbol AND color match the one immediately before it?" : "Does the current symbol match the one immediately before it?"} Answer as fast as possible!
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Timer
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && currentShape && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            <p className="text-slate-400 mb-4 font-mono text-xl">Time: <span className="text-white">{timeRemaining}s</span></p>
            
            <div className={`w-32 h-32 flex items-center justify-center rounded-2xl mb-8 transition-colors duration-150 ${
              isMatchStatus === true ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
              isMatchStatus === false ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
              'bg-slate-800 border border-slate-700'
            }`}>
              <span className={`text-7xl ${currentShape.colorClass}`}>{currentShape.symbol}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-sm">
              {!previousShape ? (
                <div className="w-full py-6 flex items-center justify-center">
                  <p className="text-yellow-400 font-bold text-xl animate-pulse">Memorize this shape!</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleChoice(false); }}
                    onPointerDown={(e) => { e.preventDefault(); handleChoice(false); }}
                    className="flex-1 py-6 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors text-lg active:scale-95"
                  >
                    No Match
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleChoice(true); }}
                    onPointerDown={(e) => { e.preventDefault(); handleChoice(true); }}
                    className="flex-1 py-6 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors text-lg active:scale-95"
                  >
                    Match
                  </button>
                </>
              )}
            </div>
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
