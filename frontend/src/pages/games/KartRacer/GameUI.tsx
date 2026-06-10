import { useKartStore } from './store';
import { useState, useRef, useEffect } from 'react';

function Joystick({ onMove, onStop }: { onMove: (x: number, y: number) => void, onStop: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.PointerEvent | PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    let deltaX = e.clientX - centerX;
    let deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }

    setPosition({ x: deltaX, y: deltaY });
    onMove(deltaX / maxRadius, deltaY / maxRadius);
  };

  const handleUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onStop();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="w-32 h-32 bg-white/10 rounded-full border-2 border-white/30 backdrop-blur-md relative touch-none"
      onPointerDown={(e) => {
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxRadius = rect.width / 2;
        let deltaX = e.clientX - centerX;
        let deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxRadius) {
          deltaX = (deltaX / distance) * maxRadius;
          deltaY = (deltaY / distance) * maxRadius;
        }
        setPosition({ x: deltaX, y: deltaY });
        onMove(deltaX / maxRadius, deltaY / maxRadius);
      }}
    >
      <div 
        className="w-12 h-12 bg-white/50 rounded-full absolute top-1/2 left-1/2 shadow-lg pointer-events-none transition-transform duration-75"
        style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` }}
      />
    </div>
  );
}
import { Shield, Rocket, Asterisk, Zap, LogOut } from 'lucide-react';
import Minimap from './Minimap';
import { useNavigate } from 'react-router-dom';

export default function GameUI() {
  const { speed, lap, powerup, gameState, countdown, raceTime } = useKartStore();
  const navigate = useNavigate();

  const getPowerupIcon = () => {
    switch(powerup) {
      case 'Speed Boost': return <Zap className="w-12 h-12 text-yellow-400" />;
      case 'Rocket Projectile': return <Rocket className="w-12 h-12 text-red-500" />;
      case 'Shield': return <Shield className="w-12 h-12 text-cyan-400" />;
      case 'Mine Trap': return <Asterisk className="w-12 h-12 text-orange-500" />;
      default: return <div className="w-12 h-12 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/30 font-black">?</div>;
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top Right Container (Minimap + Speed + Item) */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-4 pointer-events-none z-40">
        <Minimap />
        
        {/* Powerup Slot */}
        <div className="bg-black/50 backdrop-blur-md p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-700 shadow-lg pointer-events-auto">
          <div className="w-12 h-12 sm:w-20 sm:h-20 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-slate-600 shadow-inner scale-75 sm:scale-100 origin-center">
            {getPowerupIcon()}
          </div>
          <div className="text-center mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold text-slate-300">ITEM</div>
        </div>

        {/* Speedometer */}
        <div className="relative w-20 h-20 sm:w-32 sm:h-32 bg-black/50 backdrop-blur-md rounded-full border-2 sm:border-4 border-slate-800 flex flex-col items-center justify-center shadow-lg">
          <div className="absolute inset-1 sm:inset-2 rounded-full border-2 sm:border-4 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rotate-45 opacity-50" />
          <span className="text-2xl sm:text-4xl font-black italic text-white leading-none">{Math.floor(speed)}</span>
          <span className="text-[8px] sm:text-xs text-white/50 font-bold tracking-widest mt-1">KM/H</span>
        </div>
      </div>

      {/* Top Bar: Lap & Race Time (Left aligned now) */}
      <div className="flex justify-between items-start">
        
        {/* Left Side: Leave Button & Lap Counter */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/games')}
            className="pointer-events-auto bg-red-500/80 hover:bg-red-500 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-center text-white transition-all shadow-lg w-14 h-14"
            title="Leave Race"
          >
            <LogOut className="w-6 h-6" />
          </button>

          {/* Lap Counter */}
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Lap</span>
            <span className="text-4xl font-black italic text-white drop-shadow-md">{lap} <span className="text-xl text-white/50">/ 3</span></span>
          </div>
        </div>

        {/* Race Time */}
        <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center shadow-xl">
          <span className="text-2xl font-mono text-white">{(raceTime / 1000).toFixed(1)}s</span>
        </div>

        {/* Position */}
        <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Pos</span>
          <span className="text-4xl font-black italic text-yellow-400 drop-shadow-md">1<span className="text-xl text-yellow-400/50">st</span></span>
        </div>
      </div>

      {/* Center Alerts */}
      <div className="flex-1 flex items-center justify-center">
        {gameState === 'countdown' && (
          <div className="text-[150px] font-black italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        {/* Bottom bar is now exclusively for mobile controls */}
        {/* Mobile Controls (Visible only on small screens) */}

        {/* Mobile Controls (Visible only on small screens) */}
        <div className="absolute bottom-6 inset-x-6 sm:hidden pointer-events-auto flex justify-between items-end opacity-70 touch-none select-none">
          {/* Analog Joystick */}
          <Joystick 
            onMove={(x, y) => {
              useKartStore.getState().setMobileControls({
                forward: y < -0.2,
                backward: y > 0.2,
                left: x < -0.2,
                right: x > 0.2,
              });
            }}
            onStop={() => {
              useKartStore.getState().setMobileControls({
                forward: false,
                backward: false,
                left: false,
                right: false,
              });
            }}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              className="w-20 h-20 bg-blue-500/50 backdrop-blur-md rounded-full border border-blue-300 active:bg-blue-500 flex items-center justify-center text-white text-lg font-bold touch-none select-none"
              onTouchStart={() => { useKartStore.getState().setMobileControls({ useItem: true }); }}
              onTouchEnd={() => { useKartStore.getState().setMobileControls({ useItem: false }); }}
              onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: true }); }}
              onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: false }); }}
              onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: false }); }}
            >
              <span className="pointer-events-none">ITEM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
