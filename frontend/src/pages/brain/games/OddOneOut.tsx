import React, { useState, useEffect } from 'react';
import { Target, RotateCcw, XCircle, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const ODD_BANKS = [
  { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', reason: 'Carrot is a vegetable, others are fruits.' },
  { items: ['React', 'Angular', 'Vue', 'Express'], odd: 'Express', reason: 'Express is a backend framework, others are frontend.' },
  { items: ['Dog', 'Cat', 'Lion', 'Wolf'], odd: 'Cat', reason: 'Cat is a domestic feline, others are canines/wild (wait: Dog/Wolf are canine, Lion is feline. Cat is feline. Let\'s make it clearer: Dog, Wolf, Fox, Cat)' }, // Wait, let me fix that offline bank.
];

const REFINED_BANKS = [
  { items: ['Dog', 'Wolf', 'Fox', 'Cat'], odd: 'Cat', reason: 'Cat is feline, others are canine.' },
  { items: ['React', 'Angular', 'Vue', 'Express'], odd: 'Express', reason: 'Express is a backend framework, others are frontend libraries/frameworks.' },
  { items: ['Mars', 'Venus', 'Jupiter', 'Pluto'], odd: 'Pluto', reason: 'Pluto is a dwarf planet, others are major planets.' },
  { items: ['16', '25', '36', '40'], odd: '40', reason: '40 is not a perfect square (16=4², 25=5², 36=6²).' },
  { items: ['Oxygen', 'Hydrogen', 'Water', 'Carbon'], odd: 'Water', reason: 'Water is a compound, others are elements.' },
  { items: ['Triangle', 'Square', 'Pentagon', 'Circle'], odd: 'Circle', reason: 'Circle has no straight edges.' },
  { items: ['Guitar', 'Violin', 'Piano', 'Cello'], odd: 'Piano', reason: 'Piano is a percussion/keyboard instrument, others are strictly string/bowed.' },
  { items: ['Tokyo', 'Paris', 'New York', 'London'], odd: 'New York', reason: 'New York is not a capital city.' }
];

const OddOneOut = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [currentSet, setCurrentSet] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    generateQuestion();
  };

  const generateQuestion = () => {
    const randomSet = REFINED_BANKS[Math.floor(Math.random() * REFINED_BANKS.length)];
    setCurrentSet(randomSet);
    
    // Shuffle options
    const shuffled = [...randomSet.items].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  };

  const handleGuess = (guess: string) => {
    if (gameState !== 'PLAYING') return;

    if (guess === currentSet.odd) {
      setScore(s => s + (100 * difficulty));
      generateQuestion();
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
              Three items follow a logical rule. One does not. Find the imposter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
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
