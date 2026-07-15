import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity, Heart, ShieldAlert } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const POSITIVE_WORDS = ['Love', 'Joy', 'Peace', 'Gratitude', 'Abundance', 'Health', 'Success', 'Harmony', 'Focus', 'Strength', 'Clarity', 'Growth'];
const NEGATIVE_WORDS = ['Fear', 'Doubt', 'Anger', 'Lack', 'Stress', 'Anxiety', 'Worry', 'Failure', 'Panic', 'Guilt', 'Shame', 'Regret'];

type FallingWord = {
  id: number;
  text: string;
  isPositive: boolean;
  x: number; // 0-100%
  y: number; // 0-100%
  speed: number;
  clicked: boolean;
};

const GratitudeCatcher = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [words, setWords] = useState<FallingWord[]>([]);
  
  const requestRef = useRef<any>(null);
  const lastSpawnTime = useRef<number>(0);
  const wordsRef = useRef<FallingWord[]>([]);
  const stateRef = useRef(gameState);
  
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setWords([]);
    wordsRef.current = [];
    setGameState('PLAYING');
    lastSpawnTime.current = Date.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = () => {
    setGameState('GAMEOVER');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const spawnWord = () => {
    const isPositive = Math.random() > 0.4; // 60% positive
    const textList = isPositive ? POSITIVE_WORDS : NEGATIVE_WORDS;
    const text = textList[Math.floor(Math.random() * textList.length)];
    
    // speed increases slightly with score
    const baseSpeed = 0.2;
    const speedMult = 1 + (score / 1000);
    
    const newWord: FallingWord = {
      id: Date.now() + Math.random(),
      text,
      isPositive,
      x: 10 + Math.random() * 80,
      y: -10,
      speed: (baseSpeed + Math.random() * 0.2) * speedMult,
      clicked: false
    };
    
    wordsRef.current.push(newWord);
  };

  const gameLoop = () => {
    if (stateRef.current !== 'PLAYING') return;

    const now = Date.now();
    
    // Spawn rate increases with score
    const spawnRate = Math.max(800, 2000 - (score * 2));
    
    if (now - lastSpawnTime.current > spawnRate) {
      spawnWord();
      lastSpawnTime.current = now;
    }

    let currentLives = lives;
    let currentScore = score;

    wordsRef.current = wordsRef.current.filter(word => {
      if (word.clicked) return false;
      
      word.y += word.speed;
      
      if (word.y > 100) {
        // It fell off the screen
        if (word.isPositive) {
          // Missed a positive word -> lose a life
          currentLives--;
        }
        return false;
      }
      return true;
    });

    setLives(currentLives);
    setScore(currentScore);
    setWords([...wordsRef.current]);

    if (currentLives <= 0) {
      endGame();
    } else {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleWordClick = (wordId: number, isPositive: boolean) => {
    if (gameState !== 'PLAYING') return;

    const word = wordsRef.current.find(w => w.id === wordId);
    if (!word || word.clicked) return;

    word.clicked = true;

    if (isPositive) {
      setScore(s => s + 50);
    } else {
      // Clicked a negative word
      setLives(l => l - 1);
      if (lives - 1 <= 0) endGame();
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
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
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Heart className="w-5 h-5 text-pink-400 mr-2" />
          <span className="font-bold">Lives: {lives}</span>
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Gratitude Catcher</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Click the <span className="text-pink-400 font-bold">Positive</span> words to catch them. Let the <span className="text-slate-500 font-bold">Negative</span> words fall away. Don't let positive words hit the ground!
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Catching
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full h-[450px] relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden cursor-crosshair">
            {words.map(w => (
              <div 
                key={w.id} 
                onClick={() => handleWordClick(w.id, w.isPositive)}
                className={`absolute px-6 py-3 rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-110 active:scale-95 select-none
                  ${w.isPositive ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                style={{ top: `${w.y}%`, left: `${w.x}%`, transform: 'translate(-50%, -50%)' }}
              >
                {w.text}
              </div>
            ))}
            {/* The Ground */}
            <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-pink-500/50 to-purple-500/50 blur-sm"></div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full mt-8">
            <div className="flex items-center justify-center text-red-400 text-2xl font-bold mb-8">
              <ShieldAlert className="w-8 h-8 mr-2" /> Shields Down!
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('reframe', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('reframe', score).color}`}>
                  {getIQRank('reframe', score).percentile} ({getIQRank('reframe', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('reframe', score).message}</p>
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

export default GratitudeCatcher;
