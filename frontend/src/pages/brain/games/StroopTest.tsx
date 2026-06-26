import React, { useState, useEffect } from 'react';
import { Zap, RotateCcw, Timer, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const COLORS = [
  { name: 'RED', class: 'text-red-500' },
  { name: 'BLUE', class: 'text-blue-500' },
  { name: 'GREEN', class: 'text-emerald-500' },
  { name: 'YELLOW', class: 'text-yellow-500' }
];

const StroopTest = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // represents percentage of 2 seconds
  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [currentColorClass, setCurrentColorClass] = useState(COLORS[0].class);
  const [isMatch, setIsMatch] = useState(true);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    generateQuestion();
  };

  const generateQuestion = () => {
    // 50% chance of matching
    const match = Math.random() > 0.5;
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let colorIdx = wordIdx;

    if (!match) {
      colorIdx = Math.floor(Math.random() * COLORS.length);
      while (colorIdx === wordIdx) {
        colorIdx = Math.floor(Math.random() * COLORS.length);
      }
    }

    setCurrentWord(COLORS[wordIdx]);
    setCurrentColorClass(COLORS[colorIdx].class);
    setIsMatch(match);
    setTimeLeft(100);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      // Decrease time by 2% every 40ms -> 100% takes ~2000ms
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 2) {
            clearInterval(timer);
            setGameState('GAMEOVER');
            return 0;
          }
          return t - 2;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'PLAYING') return;

    if (answer === isMatch) {
      setScore(s => s + (100 * difficulty));
      generateQuestion();
    } else {
      setGameState('GAMEOVER');
    }
  };

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-8 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] text-center">
      <div className="flex justify-between items-center mb-8 text-slate-300">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-bold text-yellow-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-3xl font-bold text-white mb-4">Stroop Effect</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Does the meaning of the word match its ink color? You have 2 seconds per word.
            </p>
            
            <div className="flex gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full">
            <div className="flex items-center justify-center mb-12">
              <Timer className="w-5 h-5 text-slate-400 mr-2" />
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 linear ${timeLeft > 50 ? 'bg-emerald-500' : timeLeft > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${timeLeft}%` }}
                ></div>
              </div>
            </div>

            <div className={`text-6xl md:text-8xl font-black mb-12 tracking-wider ${currentColorClass}`}>
              {currentWord.name}
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => handleAnswer(false)}
                className="flex-1 max-w-[150px] py-4 bg-red-600/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 font-bold rounded-2xl text-2xl transition-all"
              >
                NO
              </button>
              <button 
                onClick={() => handleAnswer(true)}
                className="flex-1 max-w-[150px] py-4 bg-emerald-600/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-400 font-bold rounded-2xl text-2xl transition-all"
              >
                YES
              </button>
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-3xl font-black mb-2">Game Over!</div>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('stroop', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('stroop', score).color}`}>
                  {getIQRank('stroop', score).percentile} ({getIQRank('stroop', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('stroop', score).message}</p>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StroopTest;
