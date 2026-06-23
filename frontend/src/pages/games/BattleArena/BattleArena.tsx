import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import GameScene from './GameScene';
import { LogOut, Maximize } from 'lucide-react';

export default function BattleArena() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [health, setHealth] = useState(100);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(() => {
    if (!socket || !user || !state?.roomId) {
      navigate('/games');
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current!,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 800 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [GameScene],
      backgroundColor: '#1e293b'
    };

    gameRef.current = new Phaser.Game(config);

    // Pass react state setters to the scene via scene data or registry
    gameRef.current.events.on('ready', () => {
      const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
      if (scene) {
        scene.initNetwork(socket, state.roomId, user);
        scene.events.on('health-changed', setHealth);
        scene.events.on('kills-changed', setKills);
        scene.events.on('deaths-changed', setDeaths);
      }
    });

    return () => {
      gameRef.current?.destroy(true);
      socket.emit('ba-leave', { roomId: state.roomId });
    };
  }, [socket, user, state, navigate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Mobile controls triggered by react synthetic events that emit to the Phaser Scene
  const handleMove = (dir: 'left' | 'right' | 'stop') => {
    const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
    if (scene) scene.setMobileMove(dir);
  };
  const handleJump = () => {
    const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
    if (scene) scene.triggerJump();
  };
  const handleShoot = () => {
    const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
    if (scene) scene.triggerShoot();
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] max-w-6xl mx-auto flex flex-col items-center bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800" ref={wrapperRef}>
      
      {/* Top HUD */}
      <div className="w-full bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center z-10 absolute top-0 left-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/games')} className="bg-slate-800 p-2 rounded hover:bg-slate-700 text-white">
            <LogOut className="w-5 h-5" />
          </button>
          <div>
            <div className="text-white font-bold text-lg">Battle Arena</div>
            <div className="text-xs text-slate-400 font-mono">Room: {state?.roomId?.slice(0, 8)}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase">Health</div>
            <div className="w-32 h-4 bg-slate-800 rounded overflow-hidden mt-1 border border-slate-700 relative">
              <div 
                className="h-full bg-green-500 transition-all duration-200" 
                style={{ width: `${Math.max(0, health)}%` }} 
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                {Math.max(0, health)} HP
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase">K / D</div>
            <div className="text-lg font-black text-white">{kills} / {deaths}</div>
          </div>
          <button onClick={toggleFullscreen} className="bg-slate-800 p-2 rounded hover:bg-slate-700 text-white hidden sm:block">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Phaser Canvas Container */}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center pt-20" />

      {/* Mobile Controls (Visible only on small screens) */}
      <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-end sm:hidden pointer-events-none">
        
        {/* D-Pad */}
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onTouchStart={() => handleMove('left')} 
            onTouchEnd={() => handleMove('stop')}
            onMouseDown={() => handleMove('left')}
            onMouseUp={() => handleMove('stop')}
            onMouseLeave={() => handleMove('stop')}
            className="w-16 h-16 bg-white/10 backdrop-blur rounded-full border border-white/20 active:bg-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg"
          >
            ←
          </button>
          <button 
            onTouchStart={() => handleMove('right')} 
            onTouchEnd={() => handleMove('stop')}
            onMouseDown={() => handleMove('right')}
            onMouseUp={() => handleMove('stop')}
            onMouseLeave={() => handleMove('stop')}
            className="w-16 h-16 bg-white/10 backdrop-blur rounded-full border border-white/20 active:bg-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg"
          >
            →
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={handleShoot}
            className="w-16 h-16 bg-red-500/50 backdrop-blur rounded-full border border-red-500/50 active:bg-red-500/80 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20"
          >
            SHOOT
          </button>
          <button 
            onClick={handleJump}
            className="w-16 h-16 bg-blue-500/50 backdrop-blur rounded-full border border-blue-500/50 active:bg-blue-500/80 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20"
          >
            JUMP
          </button>
        </div>

      </div>

    </div>
  );
}
