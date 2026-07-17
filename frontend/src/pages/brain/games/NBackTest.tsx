import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'K', 'L', 'O', 'P', 'R', 'S', 'T', 'X', 'Y'];

const NBackTest = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null); // To flash green/red
  const [timeRemaining, setTimeRemaining] = useState(20); // 20 letters per round
  
  const timerRef = useRef<any>(null);

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { nBack: 1, speedMs: 2500 };
      case 2: return { nBack: 2, speedMs: 1500 };
      case 3: return { nBack: 3, speedMs: 800 };
      default: return { nBack: 1, speedMs: 2500 };
    }
  };

  const startGame = () => {
    const params = getGameParams();
    setScore(0);
    setSequence([]);
    setCurrentIndex(-1);
    setCurrentLetter(null);
    setTimeRemaining(20 + params.nBack); // Total trials
    setGameState('PLAYING');
    nextTurn([]);
  };

  const nextTurn = (currentSeq: string[]) => {
    setIsMatch(null);
    const params = getGameParams();
    
    // 30% chance to be a match if we are past nBack
    let nextLtr = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    if (currentSeq.length >= params.nBack && Math.random() < 0.3) {
      nextLtr = currentSeq[currentSeq.length - params.nBack];
    }
    
    const newSeq = [...currentSeq, nextLtr];
    setSequence(newSeq);
    setCurrentIndex(newSeq.length - 1);
    setCurrentLetter(nextLtr);

    timerRef.current = setTimeout(() => {
      // If user didn't click anything, it counts as a miss if it WAS a match.
      // But for simplicity, we just move to the next turn if they missed the window.
      if (timeRemaining > 1) {
        setTimeRemaining(t => t - 1);
        nextTurn(newSeq);
      } else {
        setGameState('GAMEOVER');
      }
    }, params.speedMs);
  };

  const handleChoice = (userSaysMatch: boolean) => {
    if (gameState !== 'PLAYING' || !timerRef.current) return;
    
    clearTimeout(timerRef.current);
    const params = getGameParams();
    
    const actualMatch = sequence.length > params.nBack && sequence[sequence.length - 1] === sequence[sequence.length - 1 - params.nBack];
    
    if (userSaysMatch === actualMatch) {
      setScore(s => s + (params.nBack * 100));
      setIsMatch(true);
    } else {
      setScore(s => Math.max(0, s - 50));
      setIsMatch(false);
    }
    
    setTimeout(() => {
      if (timeRemaining > 1) {
        setTimeRemaining(t => t - 1);
        nextTurn(sequence);
      } else {
        setGameState('GAMEOVER');
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-purple-400 mr-2" />
          <span className="font-bold">{getGameParams().nBack}-Back Mode</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">N-Back Test</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Letters will flash on screen. Does the current letter match the one from <strong>N</strong> steps ago?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1-Back)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2-Back)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3-Back)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Sequence
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            <p className="text-slate-500 mb-4">Trials remaining: {timeRemaining}</p>
            
            <div className={`w-32 h-32 flex items-center justify-center rounded-2xl mb-8 transition-colors duration-200 ${
              isMatch === true ? 'bg-green-500/20 text-green-400' :
              isMatch === false ? 'bg-red-500/20 text-red-400' :
              'bg-slate-800 text-white'
            }`}>
              <span className="text-6xl font-black">{currentLetter}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-sm">
              <button 
                onClick={(e) => { e.preventDefault(); handleChoice(false); }}
                onPointerDown={(e) => { e.preventDefault(); handleChoice(false); }}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95 touch-manipulation"
                disabled={currentIndex < getGameParams().nBack}
              >
                No Match
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleChoice(true); }}
                onPointerDown={(e) => { e.preventDefault(); handleChoice(true); }}
                className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors active:scale-95 touch-manipulation"
                disabled={currentIndex < getGameParams().nBack}
              >
                Match
              </button>
            </div>
            {currentIndex < getGameParams().nBack && (
              <p className="text-slate-400 mt-4 text-sm animate-pulse">Wait for {getGameParams().nBack} letters...</p>
            )}
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-purple-400 text-2xl font-bold mb-8">Test Complete!</div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('nback', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('nback', score).color}`}>
                  {getIQRank('nback', score).percentile} ({getIQRank('nback', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('nback', score).message}</p>
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

export default NBackTest;
