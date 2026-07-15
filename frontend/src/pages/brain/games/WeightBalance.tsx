import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Brain, Activity, Scale } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const SHAPES = ['●', '■', '▲', '★', '◆'];

type Equation = {
  left: string[];
  right: string[];
};

const WeightBalance = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(15);
  
  const [equations, setEquations] = useState<Equation[]>([]);
  const [heaviest, setHeaviest] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameState('PLAYING');
    generatePuzzle(1);
  };

  const generatePuzzle = (lvl: number) => {
    // Select 3 random shapes
    const shuffledShapes = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 3);
    setOptions(shuffledShapes);
    
    // Assign weights 1, 2, 3 to the 3 shapes
    const weights = [1, 2, 3];
    const shapeWeights = new Map<string, number>();
    shuffledShapes.forEach((shape, index) => {
      shapeWeights.set(shape, weights[index]);
    });
    
    setHeaviest(shuffledShapes[2]); // The one with weight 3

    // Generate valid equations
    // For weights 1, 2, 3:
    // Equation 1: 3 = 1 + 2 (Shape3 = Shape1 + Shape2)
    // Equation 2: 2 = 1 + 1 (Shape2 = Shape1 + Shape1)
    
    const s1 = shuffledShapes[0]; // weight 1
    const s2 = shuffledShapes[1]; // weight 2
    const s3 = shuffledShapes[2]; // weight 3

    const eqs: Equation[] = [];
    
    // Eq 1: s3 = s1 + s2
    if (Math.random() > 0.5) {
      eqs.push({ left: [s3], right: [s1, s2] });
    } else {
      eqs.push({ left: [s1, s2], right: [s3] });
    }

    // Eq 2: s2 = s1 + s1
    if (Math.random() > 0.5) {
      eqs.push({ left: [s2], right: [s1, s1] });
    } else {
      eqs.push({ left: [s1, s1], right: [s2] });
    }

    // Add a 3rd equation for higher levels to add noise/complexity
    if (lvl > 5) {
      // 3 + 1 = 2 + 2
      if (Math.random() > 0.5) {
        eqs.push({ left: [s3, s1], right: [s2, s2] });
      } else {
        eqs.push({ left: [s2, s2], right: [s3, s1] });
      }
    }

    // Shuffle equations
    setEquations(eqs.sort(() => Math.random() - 0.5));
    
    // Time per level decreases slightly or stays fixed
    setTimeRemaining(Math.max(5, 15 - Math.floor(lvl / 2)));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      timer = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleGuess = (shape: string) => {
    if (shape === heaviest) {
      setScore(s => s + (level * 100));
      setLevel(l => l + 1);
      generatePuzzle(level + 1);
    } else {
      setGameState('GAMEOVER');
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-3xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-emerald-400 mr-2" />
          <span className="font-bold">Level {level}</span>
        </div>
      </div>

      <div className="min-h-[350px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Weight Balance</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Analyze the scales to determine which shape is the heaviest.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Deduction
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            <div className="flex justify-between w-full max-w-md mb-8">
              <span className="text-slate-400 font-mono">Time: {timeRemaining}s</span>
              <span className="text-emerald-400 font-bold">Which is heaviest?</span>
            </div>

            <div className="space-y-6 mb-12 w-full max-w-lg">
              {equations.map((eq, i) => (
                <div key={i} className="flex items-center justify-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex gap-2 w-1/3 justify-end text-3xl">
                    {eq.left.map((s, idx) => <span key={idx}>{s}</span>)}
                  </div>
                  <Scale className="w-8 h-8 text-emerald-500/50" />
                  <div className="flex gap-2 w-1/3 justify-start text-3xl">
                    {eq.right.map((s, idx) => <span key={idx}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              {options.map((shape, i) => (
                <button
                  key={i}
                  onClick={() => handleGuess(shape)}
                  className="w-16 h-16 flex items-center justify-center text-4xl bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500 border border-transparent rounded-xl transition-all"
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-red-400 text-2xl font-bold mb-8">Incorrect or Out of Time!</div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('balance', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('balance', score).color}`}>
                  {getIQRank('balance', score).percentile} ({getIQRank('balance', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('balance', score).message}</p>
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

export default WeightBalance;
