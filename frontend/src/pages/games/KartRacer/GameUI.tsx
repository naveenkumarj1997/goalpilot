import { useKartStore } from './store';
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
      
      {/* Minimap */}
      <Minimap />

      {/* Top Bar: Lap & Race Time */}
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
      {/* Speedometer */}
        <div className="relative w-40 h-40 bg-black/50 backdrop-blur-md rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-2 rounded-full border-4 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rotate-45 opacity-50" />
          <span className="text-4xl font-black italic text-white">{Math.floor(speed)}</span>
          <span className="text-xs text-white/50 font-bold tracking-widest">KM/H</span>
        </div>

        {/* Powerup Slot */}
        <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl border-4 border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-slate-600 shadow-inner">
            {getPowerupIcon()}
          </div>
          <div className="text-center mt-2 text-xs font-bold text-slate-300">ITEM</div>
        </div>

        {/* Mobile Controls (Visible only on small screens) */}
        <div className="absolute bottom-6 inset-x-6 sm:hidden pointer-events-auto flex justify-between items-end opacity-70">
          {/* Steering D-Pad */}
          <div className="flex gap-2">
            <button 
              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border border-white/50 active:bg-white/40 flex items-center justify-center text-white"
              onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ left: true }); }}
              onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ left: false }); }}
              onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ left: false }); }}
            >
              <div className="w-0 h-0 border-y-[10px] border-y-transparent border-r-[15px] border-r-white" />
            </button>
            <button 
              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border border-white/50 active:bg-white/40 flex items-center justify-center text-white"
              onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ right: true }); }}
              onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ right: false }); }}
              onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ right: false }); }}
            >
              <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[15px] border-l-white" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              className="w-16 h-16 bg-green-500/50 backdrop-blur-md rounded-full border border-green-300 active:bg-green-500 flex items-center justify-center text-white font-black"
              onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ forward: true }); }}
              onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ forward: false }); }}
              onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ forward: false }); }}
            >
              GAS
            </button>
            <div className="flex gap-2">
              <button 
                className="w-14 h-14 bg-red-500/50 backdrop-blur-md rounded-full border border-red-300 active:bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ backward: true }); }}
                onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ backward: false }); }}
                onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ backward: false }); }}
              >
                BRK
              </button>
              <button 
                className="w-14 h-14 bg-blue-500/50 backdrop-blur-md rounded-full border border-blue-300 active:bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                onPointerDown={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: true }); }}
                onPointerUp={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: false }); }}
                onPointerCancel={(e) => { e.preventDefault(); useKartStore.getState().setMobileControls({ useItem: false }); }}
              >
                ITEM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
