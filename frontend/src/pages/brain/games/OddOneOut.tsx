import React, { useState, useEffect, useRef } from 'react';
import { Target, RotateCcw, XCircle, Activity, Timer } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const BANKS = {
  EASY: [
    { items: ['Dog', 'Wolf', 'Fox', 'Cat'], odd: 'Cat', reason: 'Cat is feline, others are canine.' },
    { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', reason: 'Carrot is a vegetable, others are fruits.' },
    { items: ['Triangle', 'Square', 'Pentagon', 'Circle'], odd: 'Circle', reason: 'Circle has no straight edges.' },
    { items: ['Red', 'Blue', 'Green', 'Loud'], odd: 'Loud', reason: 'Loud is a sound property, others are colors.' },
    { items: ['Car', 'Bus', 'Train', 'Airplane'], odd: 'Airplane', reason: 'Airplane flies, others are ground transport.' }
  ],
  MEDIUM: [
    { items: ['React', 'Angular', 'Vue', 'Express'], odd: 'Express', reason: 'Express is a backend framework, others are frontend.' },
    { items: ['Mars', 'Venus', 'Jupiter', 'Pluto'], odd: 'Pluto', reason: 'Pluto is a dwarf planet, others are major planets.' },
    { items: ['Guitar', 'Violin', 'Piano', 'Cello'], odd: 'Piano', reason: 'Piano is a percussion/keyboard instrument, others are strictly string/bowed.' },
    { items: ['Tokyo', 'Paris', 'New York', 'London'], odd: 'New York', reason: 'New York is not a capital city.' },
    { items: ['Oxygen', 'Hydrogen', 'Water', 'Carbon'], odd: 'Water', reason: 'Water is a compound, others are elements.' }
  ],
  HARD: [
    { items: ['16', '25', '36', '40'], odd: '40', reason: '40 is not a perfect square (16=4², 25=5², 36=6²).' },
    { items: ['Spider', 'Ant', 'Beetle', 'Fly'], odd: 'Spider', reason: 'Spider is an arachnid (8 legs), others are insects (6 legs).' },
    { items: ['Whale', 'Shark', 'Dolphin', 'Seal'], odd: 'Shark', reason: 'Shark is a fish, others are mammals.' },
    { items: ['31', '41', '51', '61'], odd: '51', reason: '51 is not a prime number (17 * 3).' },
    { items: ['Helium', 'Neon', 'Argon', 'Oxygen'], odd: 'Oxygen', reason: 'Oxygen is highly reactive, others are noble gases.' }
  ]
};

const OddOneOut = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [currentSet, setCurrentSet] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(100);

  const timerRef = useRef<any>(null);
  const historyRef = useRef<string[]>([]);

  const getGameParams = () => {
    switch(difficulty) {
      case 1: return { timeMs: 20000, bank: BANKS.EASY };
      case 2: return { timeMs: 15000, bank: BANKS.MEDIUM };
      case 3: return { timeMs: 10000, bank: BANKS.HARD };
      default: return { timeMs: 20000, bank: BANKS.EASY };
    }
  };

  const startGame = () => {
    setScore(0);
    historyRef.current = [];
    setGameState('PLAYING');
    generateQuestion();
  };

  const generateQuestion = () => {
    const params = getGameParams();
    
    let randomSet;
    let attempts = 0;
    
    do {
      randomSet = params.bank[Math.floor(Math.random() * params.bank.length)];
      attempts++;
    } while (historyRef.current.includes(randomSet.odd) && attempts < 10);
    
    historyRef.current.push(randomSet.odd);
    if (historyRef.current.length > 2) historyRef.current.shift(); // keep last 2

    setCurrentSet(randomSet);
    
    // Shuffle options
    const shuffled = [...randomSet.items].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setTimeLeft(100);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const { timeMs } = getGameParams();
      const tickRate = 50; 
      const decreaseAmount = 100 / (timeMs / tickRate);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= decreaseAmount) {
            clearInterval(timerRef.current);
            setGameState('GAMEOVER');
            return 0;
          }
          return t - decreaseAmount;
        });
      }, tickRate);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, score, difficulty]);

  const handleGuess = (guess: string) => {
    if (gameState !== 'PLAYING') return;

    if (guess === currentSet.odd) {
      setScore(s => s + (100 * difficulty));
      generateQuestion();
    } else {
      clearInterval(timerRef.current);
      setGameState('GAMEOVER');
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-emerald-400 mr-2" />
          <span className="font-bold text-emerald-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[350px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Odd One Out</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Three items follow a logical rule. One does not. Find the imposter before time runs out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && currentSet && (
          <div className="animate-slide-up-fade w-full">
            <div className="flex items-center justify-center mb-8">
              <Timer className="w-5 h-5 text-slate-400 mr-2" />
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 linear ${timeLeft > 50 ? 'bg-emerald-500' : timeLeft > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, timeLeft)}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mb-8">Which item does not belong?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-6 px-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 text-white font-bold rounded-xl text-xl transition-all shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && currentSet && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-red-400 text-2xl font-bold mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 mr-2" /> Incorrect!
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 max-w-md mx-auto text-left">
              <p className="text-slate-400 mb-2">The odd one out was: <span className="text-emerald-400 font-bold">{currentSet.odd}</span></p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6"><span className="font-bold text-white">Rule:</span> {currentSet.reason}</p>
              
              <div className="pt-6 border-t border-slate-800 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className={`w-6 h-6 mr-2 ${getIQRank('odd', score).color}`} />
                  <span className={`text-xl font-black ${getIQRank('odd', score).color}`}>
                    {getIQRank('odd', score).percentile} ({getIQRank('odd', score).title})
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{getIQRank('odd', score).message}</p>
              </div>
            </div>
            
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
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

export default OddOneOut;
