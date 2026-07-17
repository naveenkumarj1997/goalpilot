import React, { useState, useEffect, useRef } from 'react';
import { Eye, RotateCcw, Activity, XCircle, Trophy } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const Focus17 = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'FOCUSING' | 'SUCCESS' | 'GAMEOVER'>('START');
  const [goal, setGoal] = useState('');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  
  const timerRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { timeSec: 10 };
      case 2: return { timeSec: 17 };
      case 3: return { timeSec: 30 };
      default: return { timeSec: 17 };
    }
  };

  const startFocus = () => {
    if (!goal.trim()) return;
    setGameState('FOCUSING');
    setProgress(0);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (gameState !== 'FOCUSING') return;

    const params = getGameParams();
    // Update every (timeSec * 10) ms to get 1% increase. 100 * ms = totalTime.
    const msPerStep = params.timeSec * 10;
    
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 99) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSuccess();
          return 100;
        }
        return p + 1;
      });
    }, msPerStep);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (gameState !== 'FOCUSING' || progress >= 100) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // They let go before the required time
    setStreak(0);
    setGameState('GAMEOVER');
  };

  const handleSuccess = () => {
    setGameState('SUCCESS');
    setScore(s => s + (500 * difficulty) + (streak * 100));
    setStreak(s => s + 1);
  };

  const resetGame = () => {
    setGameState('START');
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Eye className="w-5 h-5 text-pink-400 mr-2" />
          <span className="font-bold text-pink-400">Vibration Score: {score}</span>
        </div>
        {streak > 0 && (
          <div className="text-sm font-bold text-slate-400">Manifestation Streak: {streak} ✨</div>
        )}
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade w-full max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Magnetic Focus</h2>
            <p className="text-slate-400 mb-8">
              Holding a pure thought aligns your vibration with it. Type your goal and hold your focus for the entire duration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (10s)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (17s)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (30s)</button>
            </div>

            <input 
              type="text" 
              placeholder="e.g. I am running a successful business"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all mb-8 text-center text-lg"
            />

            <button 
              onClick={startFocus}
              disabled={!goal.trim()}
              className="px-8 py-4 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:hover:bg-pink-600 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Begin Manifestation
            </button>
          </div>
        )}

        {gameState === 'FOCUSING' && (
          <div className="animate-slide-up-fade w-full select-none">
            <p className="text-pink-400 text-sm uppercase tracking-widest font-bold mb-4">Your Intent</p>
            <h3 className="text-3xl md:text-4xl font-black text-white italic mb-12 drop-shadow-lg">"{goal}"</h3>

            <div 
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-48 h-48 mx-auto rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all touch-manipulation touch-none"
            >
              <div 
                className="absolute bottom-0 left-0 w-full bg-pink-500/50 transition-all duration-200"
                style={{ height: `${progress}%` }}
              ></div>
              <div className="relative z-10 flex flex-col items-center">
                <Eye className="w-10 h-10 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-300 pointer-events-none">HOLD TO FOCUS</span>
              </div>
            </div>
            <p className="text-slate-400 mt-6 text-sm pointer-events-none">Do not let go until the circle fills.</p>
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <div className="animate-slide-up-fade">
            <div className="text-emerald-400 text-3xl font-black mb-4 flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-2" /> Vibration Aligned!
            </div>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              You held a pure thought for the target duration. The manifestation process has begun.
            </p>
            
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Focus on Another Goal
            </button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-2xl font-bold mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 mr-2" /> Focus Broken
            </div>
            <p className="text-slate-400 mb-8">You let go before the target duration. Your vibration was interrupted.</p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('focus', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('focus', score).color}`}>
                  {getIQRank('focus', score).percentile} ({getIQRank('focus', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('focus', score).message}</p>
            </div>

            <button 
              onClick={resetGame}
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

export default Focus17;
