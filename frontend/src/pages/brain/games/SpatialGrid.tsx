import React, { useState, useEffect } from 'react';
import { Trophy, Brain, RotateCcw, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const GRID_SIZE = 25; // 5x5 grid

const SpatialGrid = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'MEMORIZE' | 'RECALL' | 'GAMEOVER'>('START');
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    generateGrid(1);
  };

  const generateGrid = (currentLevel: number) => {
    // Number of tiles to remember increases with level
    const tilesCount = Math.min(2 + currentLevel, 12);
    
    const newTiles: number[] = [];
    while (newTiles.length < tilesCount) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      if (!newTiles.includes(r)) {
        newTiles.push(r);
      }
    }
    
    setActiveTiles(newTiles);
    setSelectedTiles([]);
    setGameState('MEMORIZE');
    
    // Hide after 2 seconds
    setTimeout(() => {
      setGameState('RECALL');
    }, 2000);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'RECALL') return;
    if (selectedTiles.includes(index)) return;

    if (!activeTiles.includes(index)) {
      // Wrong tile clicked
      setGameState('GAMEOVER');
      return;
    }

    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);

    if (newSelected.length === activeTiles.length) {
      // Level complete
      setScore(s => s + ((level * 150) * difficulty));
      setLevel(l => l + 1);
      setTimeout(() => {
        generateGrid(level + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-purple-400 mr-2" />
          <span className="font-bold">Level: {level}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Spatial Grid</h2>
            <p className="text-slate-400 mb-8">Memorize the highlighted tiles. Click them after they hide.</p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {(gameState === 'MEMORIZE' || gameState === 'RECALL' || gameState === 'GAMEOVER') && (
          <div className="animate-slide-up-fade">
            <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl">
              {Array.from({ length: GRID_SIZE }).map((_, idx) => {
                const isActive = activeTiles.includes(idx);
                const isSelected = selectedTiles.includes(idx);
                
                let tileClass = "w-12 h-12 md:w-16 md:h-16 rounded-xl transition-all duration-300 ";
                
                if (gameState === 'MEMORIZE') {
                  tileClass += isActive ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-105" : "bg-slate-800";
                } else if (gameState === 'GAMEOVER') {
                  if (isActive && !isSelected) tileClass += "bg-yellow-400 opacity-50"; // Missed
                  else if (isSelected && !isActive) tileClass += "bg-red-500"; // Wrong click
                  else if (isActive && isSelected) tileClass += "bg-green-500"; // Correct click
                  else tileClass += "bg-slate-800 opacity-50";
                } else {
                  // RECALL state
                  tileClass += isSelected ? "bg-white scale-95" : "bg-slate-800 hover:bg-slate-700 cursor-pointer";
                }

                return (
                  <div 
                    key={idx} 
                    className={tileClass}
                    onClick={() => handleTileClick(idx)}
                  />
                );
              })}
            </div>

            {gameState === 'RECALL' && (
              <p className="text-purple-400 font-bold animate-pulse">Select the {activeTiles.length} hidden tiles!</p>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="animate-slide-up-fade mt-8">
                <div className="text-red-400 text-2xl font-bold mb-6 text-center">Incorrect Tile!</div>
                
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className={`w-6 h-6 mr-2 ${getIQRank('spatial', score).color}`} />
                    <span className={`text-xl font-black ${getIQRank('spatial', score).color}`}>
                      {getIQRank('spatial', score).percentile} ({getIQRank('spatial', score).title})
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{getIQRank('spatial', score).message}</p>
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
        )}
      </div>
    </div>
  );
};

export default SpatialGrid;
