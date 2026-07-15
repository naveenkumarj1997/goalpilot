import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity, SplitSquareHorizontal } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const DualTasking = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45);
  
  // Math Task State
  const [equation, setEquation] = useState({ q: '', a: 0 });
  const [mathInput, setMathInput] = useState('');
  
  // Tracking Task State
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const targetInterval = useRef<NodeJS.Timeout>();
  const gameTimer = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setScore(0);
    setTimeRemaining(45);
    setGameState('PLAYING');
    generateMath();
    moveTarget();
  };

  const generateMath = () => {
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let n1, n2, ans;
    
    if (op === '+') {
      n1 = Math.floor(Math.random() * 50);
      n2 = Math.floor(Math.random() * 50);
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 50) + 20;
      n2 = Math.floor(Math.random() * n1);
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12);
      n2 = Math.floor(Math.random() * 12);
      ans = n1 * n2;
    }
    
    setEquation({ q: `${n1} ${op} ${n2}`, a: ans });
    setMathInput('');
  };

  const moveTarget = () => {
    if (targetInterval.current) clearInterval(targetInterval.current);
    
    targetInterval.current = setInterval(() => {
      setTargetPos({
        x: 10 + Math.random() * 80, // 10% to 90%
        y: 10 + Math.random() * 80,
      });
    }, 1500); // Moves every 1.5 seconds
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameTimer.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            if (targetInterval.current) clearInterval(targetInterval.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (gameTimer.current) clearInterval(gameTimer.current);
      if (targetInterval.current) clearInterval(targetInterval.current);
    };
  }, [gameState]);

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHovering) return; // Must be hovering to submit!
    
    if (parseInt(mathInput) === equation.a) {
      setScore(s => s + 150);
      generateMath();
    } else {
      setMathInput('');
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-4xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-indigo-400 mr-2" />
          <span className="font-bold">Dual Tasking</span>
        </div>
      </div>

      <div className="min-h-[450px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Neural Splitter</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Forge new pathways by splitting your attention. You must keep your mouse hovering over the moving <span className="text-indigo-400 font-bold">Target</span> on the left in order to submit answers to the <span className="text-emerald-400 font-bold">Math Equations</span> on the right.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Split-Brain Training
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            <p className="text-slate-400 mb-4 font-mono text-xl">Time: <span className="text-white">{timeRemaining}s</span></p>
            
            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* Left Task: Tracking */}
              <div className="flex-1 h-[200px] sm:h-[300px] bg-slate-900 border-2 border-slate-700 rounded-2xl relative overflow-hidden flex items-center justify-center">
                {!isHovering && <div className="absolute top-4 text-red-400 font-bold animate-pulse">HOVER THE TARGET!</div>}
                
                <div 
                  className={`absolute w-16 h-16 rounded-full transition-all duration-1000 ease-in-out cursor-crosshair
                    ${isHovering ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]' : 'bg-slate-700 border-2 border-indigo-500/50'}
                  `}
                  style={{ top: `${targetPos.y}%`, left: `${targetPos.x}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onTouchStart={() => setIsHovering(true)}
                  onTouchEnd={() => setIsHovering(false)}
                ></div>
              </div>

              {/* Right Task: Math */}
              <div className="flex-1 h-[200px] sm:h-[300px] bg-slate-900 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6">
                <div className="text-4xl text-white font-black mb-8 font-mono">{equation.q}</div>
                <form onSubmit={handleMathSubmit} className="w-full max-w-[200px]">
                  <input 
                    type="number"
                    value={mathInput}
                    onChange={e => setMathInput(e.target.value)}
                    className="w-full text-center text-3xl bg-slate-800 border-2 border-emerald-500/50 rounded-xl p-3 text-white focus:border-emerald-400 focus:outline-none mb-4"
                    disabled={!isHovering}
                    placeholder="?"
                  />
                  <button 
                    type="submit"
                    disabled={!isHovering || !mathInput}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="flex justify-center items-center text-indigo-400 text-2xl font-bold mb-8">
              <SplitSquareHorizontal className="w-8 h-8 mr-2" /> Training Complete!
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('dual', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('dual', score).color}`}>
                  {getIQRank('dual', score).percentile} ({getIQRank('dual', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('dual', score).message}</p>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Train Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualTasking;
