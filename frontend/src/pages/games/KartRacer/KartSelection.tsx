import { useState } from 'react';


interface KartSelectionProps {
  onLockIn: (character: string, kart: string) => void;
  isReady: boolean;
  opponentReady: boolean;
  opponentName: string;
}

const CHARACTERS = [
  { name: 'Tiger', image: '/assets/kartracer/char_tiger.png', speedMod: 1.1, handlingMod: 0.9, accelMod: 1.0 },
  { name: 'Fox', image: '/assets/kartracer/char_fox.png', speedMod: 0.9, handlingMod: 1.1, accelMod: 1.2 },
  { name: 'Panda', image: '/assets/kartracer/char_panda.png', speedMod: 0.8, handlingMod: 1.2, accelMod: 0.9 },
  { name: 'Monkey', image: '/assets/kartracer/char_monkey.png', speedMod: 0.9, handlingMod: 1.3, accelMod: 1.1 },
  { name: 'Wolf', image: '/assets/kartracer/char_wolf.png', speedMod: 1.2, handlingMod: 0.8, accelMod: 1.0 },
  { name: 'Rabbit', image: '/assets/kartracer/char_rabbit.png', speedMod: 0.8, handlingMod: 1.0, accelMod: 1.3 },
  { name: 'Bear', image: '/assets/kartracer/char_bear.png', speedMod: 1.3, handlingMod: 0.7, accelMod: 0.8 },
  { name: 'Eagle', image: '/assets/kartracer/char_eagle.png', speedMod: 1.1, handlingMod: 1.1, accelMod: 0.8 },
];

const KARTS = [
  { name: 'Classic Kart', image: '/assets/kartracer/kart_classic.png', speed: 50, handling: 50, accel: 50 },
  { name: 'Speed Kart', image: '/assets/kartracer/kart_speed.png', speed: 80, handling: 30, accel: 40 },
  { name: 'Heavy Kart', image: '/assets/kartracer/kart_heavy.png', speed: 70, handling: 20, accel: 20 },
  { name: 'Offroad Kart', image: '/assets/kartracer/kart_offroad.png', speed: 40, handling: 80, accel: 50 },
  { name: 'Turbo Kart', image: '/assets/kartracer/kart_turbo.png', speed: 60, handling: 40, accel: 80 },
];

export default function KartSelection({ onLockIn, isReady, opponentReady, opponentName }: KartSelectionProps) {
  const [selChar, setSelChar] = useState(CHARACTERS[0].name);
  const [selKart, setSelKart] = useState(KARTS[0].name);

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col h-screen text-white">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">
          CHOOSE YOUR RACER
        </h1>
        <p className="text-blue-200 mt-2">Select your Character and Kart combo!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Left Side: Characters */}
        <div className="flex-1 bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b border-cyan-500/30 pb-2">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CHARACTERS.map(c => (
              <div 
                key={c.name}
                onClick={() => !isReady && setSelChar(c.name)}
                className={`cursor-pointer rounded-2xl p-2 flex flex-col items-center justify-center transition-all ${
                  selChar === c.name 
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-[1.05] shadow-[0_0_20px_rgba(34,211,238,0.5)] z-10 relative' 
                    : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700 opacity-60 hover:opacity-100'
                } ${isReady ? 'pointer-events-none' : ''}`}
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <span className="font-bold text-sm tracking-wider uppercase">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Karts */}
        <div className="flex-1 bg-slate-900/80 border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2">Karts</h2>
          <div className="space-y-3">
            {KARTS.map(k => (
              <div 
                key={k.name}
                onClick={() => !isReady && setSelKart(k.name)}
                className={`cursor-pointer rounded-2xl p-3 flex items-center justify-between transition-all ${
                  selKart === k.name 
                    ? 'bg-purple-500/20 border-2 border-purple-400 scale-[1.03] shadow-[0_0_20px_rgba(192,132,252,0.5)] z-10 relative' 
                    : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700 opacity-60 hover:opacity-100'
                } ${isReady ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-slate-600">
                    <img src={k.image} alt={k.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-lg">{k.name}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex flex-col items-center"><span className="text-slate-400">SPD</span><div className="w-12 h-2 bg-slate-700 rounded-full mt-1"><div className="h-full bg-blue-400 rounded-full" style={{ width: `${k.speed}%` }}/></div></div>
                  <div className="flex flex-col items-center"><span className="text-slate-400">ACC</span><div className="w-12 h-2 bg-slate-700 rounded-full mt-1"><div className="h-full bg-green-400 rounded-full" style={{ width: `${k.accel}%` }}/></div></div>
                  <div className="flex flex-col items-center"><span className="text-slate-400">HND</span><div className="w-12 h-2 bg-slate-700 rounded-full mt-1"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${k.handling}%` }}/></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center bg-slate-900/80 p-6 rounded-3xl border border-slate-700 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-bold">YOU</span>
            <span className={`text-xl font-black ${isReady ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>{isReady ? 'READY' : 'SELECTING...'}</span>
          </div>
          <div className="h-10 w-px bg-slate-700 mx-4" />
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-bold uppercase">{opponentName}</span>
            <span className={`text-xl font-black ${opponentReady ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>{opponentReady ? 'READY' : 'SELECTING...'}</span>
          </div>
        </div>

        <button 
          onClick={() => onLockIn(selChar, selKart)}
          disabled={isReady}
          className={`px-12 py-4 rounded-xl font-black text-2xl italic tracking-widest transition-all ${
            isReady 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          }`}
        >
          {isReady ? 'LOCKED IN' : 'LOCK IN'}
        </button>
      </div>
    </div>
  );
}
