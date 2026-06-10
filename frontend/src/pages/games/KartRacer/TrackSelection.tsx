import { useState } from 'react';

interface TrackSelectionProps {
  isHost: boolean;
  onSelect: (trackId: number) => void;
  opponentName: string;
}

const TRACKS = [
  { id: 0, name: 'Tropical Island', desc: 'Sunny beaches and coconut trees.', color: 'from-yellow-400 to-green-500' },
  { id: 1, name: 'Volcano Valley', desc: 'Dangerous lava pits and tight turns.', color: 'from-orange-500 to-red-700' },
  { id: 2, name: 'Snow Mountain', desc: 'Slippery ice and steep drops.', color: 'from-cyan-300 to-blue-600' },
  { id: 3, name: 'Desert Canyon', desc: 'Dusty trails and massive jumps.', color: 'from-amber-600 to-orange-800' },
  { id: 4, name: 'Jungle Adventure', desc: 'Dense foliage and ancient ruins.', color: 'from-green-600 to-emerald-900' },
];

export default function TrackSelection({ isHost, onSelect, opponentName }: TrackSelectionProps) {
  const [selTrack, setSelTrack] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen text-white justify-center">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
          SELECT TRACK
        </h1>
        <p className="text-orange-200 mt-2">
          {isHost ? 'You are the host. Choose the battlefield!' : `Waiting for ${opponentName} to choose the track...`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {TRACKS.map(t => (
          <div 
            key={t.id}
            onClick={() => isHost && setSelTrack(t.id)}
            className={`rounded-2xl p-6 flex items-center justify-between transition-all ${
              selTrack === t.id 
                ? `bg-gradient-to-r ${t.color} scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-white` 
                : 'bg-slate-800 border-2 border-slate-700 opacity-60'
            } ${isHost ? 'cursor-pointer hover:opacity-100' : 'cursor-not-allowed'}`}
          >
            <div>
              <h3 className="text-2xl font-black italic">{t.name}</h3>
              <p className="text-white/80 font-medium">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => onSelect(selTrack)}
            className="px-16 py-4 rounded-full font-black text-2xl italic tracking-widest bg-white text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            START RACE
          </button>
        </div>
      )}
    </div>
  );
}
