import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw, Timer, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const BASIC_COLORS = [
  { name: 'RED', class: 'text-red-500' },
  { name: 'BLUE', class: 'text-blue-500' },
  { name: 'GREEN', class: 'text-emerald-500' },
  { name: 'YELLOW', class: 'text-yellow-500' }
];

const EXTENDED_COLORS = [
  ...BASIC_COLORS,
  { name: 'PURPLE', class: 'text-purple-500' },
  { name: 'ORANGE', class: 'text-orange-500' }
];

const StroopTest = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); 
  const [currentWord, setCurrentWord] = useState(BASIC_COLORS[0]);
  const [currentColorClass, setCurrentColorClass] = useState(BASIC_COLORS[0].class);
  const [isMatch, setIsMatch] = useState(true);
  const [difficulty, setDifficulty] = useState(1);
  
  const historyRef = useRef<string[]>([]);
  const timerRef = useRef<any>(null);

  const getGameParams = () => {
    switch(difficulty) {
      case 1: return { timeLimitMs: 2500, colors: BASIC_COLORS };
      case 2: return { timeLimitMs: 1500, colors: BASIC_COLORS };
      case 3: return { timeLimitMs: 1000, colors: EXTENDED_COLORS };
      default: return { timeLimitMs: 2000, colors: BASIC_COLORS };
    }
  };

  const startGame = () => {
    setScore(0);
    historyRef.current = [];
    setGameState('PLAYING');
    generateQuestion();
  };

  const generateQuestion = () => {
    const { colors } = getGameParams();
    
    let match = Math.random() > 0.5;
    let wordIdx = 0;
    let colorIdx = 0;
    
    let comboKey = '';
    let attempts = 0;
    
    // Prevent recent repetitions
    do {
      match = Math.random() > 0.5;
      wordIdx = Math.floor(Math.random() * colors.length);
      colorIdx = wordIdx;

      if (!match) {
        colorIdx = Math.floor(Math.random() * colors.length);
        while (colorIdx === wordIdx) {
          colorIdx = Math.floor(Math.random() * colors.length);
        }
      }
      
      comboKey = `${wordIdx}-${colorIdx}`;
      attempts++;
    } while (historyRef.current.includes(comboKey) && attempts < 10);
    
    historyRef.current.push(comboKey);
    if (historyRef.current.length > 3) {
      historyRef.current.shift(); // Keep last 3
    }

    setCurrentWord(colors[wordIdx]);
    setCurrentColorClass(colors[colorIdx].class);
    setIsMatch(match);
    setTimeLeft(100);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const { timeLimitMs } = getGameParams();
      const tickRate = 20; // ms
      const decreaseAmount = 100 / (timeLimitMs / tickRate);
      
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
  }, [gameState, difficulty, score]); // restart interval on score change (new question)

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'PLAYING') return;

    if (answer === isMatch) {
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
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-bold text-yellow-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Stroop Effect</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Does the meaning of the word match its ink color?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (2.5s)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (1.5s)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (1.0s)</button>
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
                  style={{ width: `${Math.max(0, timeLeft)}%` }}
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
