import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity, Scale } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const SHAPES = ['●', '■', '▲', '★', '◆', '✚', '✿'];

type Equation = {
  left: string[];
  right: string[];
};

const WeightBalance = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(15);
  
  const [equations, setEquations] = useState<Equation[]>([]);
  const [heaviest, setHeaviest] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);

  const historyRef = useRef<string[]>([]);
  const timerRef = useRef<any>(null);

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { numShapes: 3, numEqs: 2, time: 20 };
      case 2: return { numShapes: 4, numEqs: 3, time: 15 };
      case 3: return { numShapes: 5, numEqs: 4, time: 10 };
      default: return { numShapes: 4, numEqs: 3, time: 15 };
    }
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    historyRef.current = [];
    setGameState('PLAYING');
    generatePuzzle(1);
  };

  const generatePuzzle = (lvl: number) => {
    const params = getGameParams();
    
    let shuffledShapes: string[] = [];
    let attempts = 0;
    
    do {
      shuffledShapes = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, params.numShapes);
      attempts++;
    } while (historyRef.current.includes(shuffledShapes.join(',')) && attempts < 10);
    
    historyRef.current.push(shuffledShapes.join(','));
    if (historyRef.current.length > 5) historyRef.current.shift();

    setOptions([...shuffledShapes].sort(() => Math.random() - 0.5));
    
    // Weights are 1 to N
    // To make valid equations easily, we assign powers of 2? No, simple addition is better.
    // Actually, generating generic equations that have unique solutions is hard.
    // Let's use predefined patterns based on numShapes.
    
    const eqs: Equation[] = [];
    const sortedByWeight = shuffledShapes; // index 0 is weight 1, index N-1 is highest
    
    setHeaviest(sortedByWeight[sortedByWeight.length - 1]);
    
    const s1 = sortedByWeight[0];
    const s2 = sortedByWeight[1];
    const s3 = sortedByWeight[2];
    const s4 = sortedByWeight[3];
    const s5 = sortedByWeight[4];

    // Build standard equations based on difficulty
    if (params.numShapes >= 3) {
      // 3 = 1 + 2
      eqs.push(Math.random() > 0.5 ? { left: [s3], right: [s1, s2] } : { left: [s1, s2], right: [s3] });
      // 2 = 1 + 1
      eqs.push(Math.random() > 0.5 ? { left: [s2], right: [s1, s1] } : { left: [s1, s1], right: [s2] });
    }
    
    if (params.numShapes >= 4) {
      // 4 = 3 + 1
      eqs.push(Math.random() > 0.5 ? { left: [s4], right: [s3, s1] } : { left: [s3, s1], right: [s4] });
    }
    
    if (params.numShapes >= 5) {
      // 5 = 4 + 1
      eqs.push(Math.random() > 0.5 ? { left: [s5], right: [s4, s1] } : { left: [s4, s1], right: [s5] });
    }
    
    // Add noise for high levels
    if (lvl > 5 && params.numShapes >= 3) {
      // 3 + 1 = 2 + 2
      eqs.push(Math.random() > 0.5 ? { left: [s3, s1], right: [s2, s2] } : { left: [s2, s2], right: [s3, s1] });
    }

    setEquations(eqs.sort(() => Math.random() - 0.5).slice(0, params.numEqs));
    
    // Time per level decreases slightly based on level, bounded by difficulty base
    setTimeRemaining(Math.max(5, params.time - Math.floor(lvl / 3)));
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const handleGuess = (shape: string) => {
    if (gameState !== 'PLAYING') return;

    if (shape === heaviest) {
      setScore(s => s + (level * 100 * difficulty));
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
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (3 Shapes)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (4 Shapes)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (5 Shapes)</button>
            </div>

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
              <span className={`font-mono font-bold ${timeRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>Time: {timeRemaining}s</span>
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

            <div className="flex gap-4 justify-center flex-wrap">
              {options.map((shape, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); handleGuess(shape); }}
                  onPointerDown={(e) => { e.preventDefault(); handleGuess(shape); }}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500 border border-transparent rounded-xl transition-all touch-manipulation active:scale-95 shadow-lg"
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
