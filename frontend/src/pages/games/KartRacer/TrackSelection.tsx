import { useState } from 'react';

interface TrackSelectionProps {
  isHost: boolean;
  onSelect: (trackId: number) => void;
  opponentName: string;
}

const TRACKS = [
  { id: 0, name: 'Tropical Island', desc: 'Sunny beaches and coconut trees.', color: 'from-yellow-400 to-green-500', image: '/assets/kartracer/track_tropical.png' },
  { id: 1, name: 'Volcano Valley', desc: 'Dangerous lava pits and tight turns.', color: 'from-orange-500 to-red-700', image: '/assets/kartracer/track_volcano.png' },
  { id: 2, name: 'Snow Mountain', desc: 'Slippery ice and steep drops.', color: 'from-cyan-300 to-blue-600', image: '/assets/kartracer/track_snow.png' },
  { id: 3, name: 'Desert Canyon', desc: 'Dusty trails and massive jumps.', color: 'from-amber-600 to-orange-800', image: '/assets/kartracer/track_desert.png' },
  { id: 4, name: 'Jungle Adventure', desc: 'Dense foliage and ancient ruins.', color: 'from-green-600 to-emerald-900', image: '/assets/kartracer/track_jungle.png' },
];

export default function TrackSelection({ isHost, onSelect, opponentName }: TrackSelectionProps) {
  const [selTrack, setSelTrack] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col min-h-screen text-white overflow-y-auto">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
          SELECT TRACK
        </h1>
        <p className="text-orange-200 mt-2 text-sm md:text-base">
          {isHost ? 'You are the host. Choose the battlefield!' : `Waiting for ${opponentName} to choose the track...`}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max pb-24">
        {TRACKS.map(t => (
          <div 
            key={t.id}
            onClick={() => isHost && setSelTrack(t.id)}
            className={`group rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ${
              selTrack === t.id 
                ? `scale-105 shadow-[0_0_30px_rgba(255,165,0,0.5)] border-4 border-white z-10` 
                : 'border-2 border-slate-700 opacity-70 scale-95'
            } ${isHost ? 'cursor-pointer hover:opacity-100 hover:scale-[1.02]' : 'cursor-not-allowed'}`}
          >
            {/* Track Image with Animation */}
            <div className="relative w-full aspect-video overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img 
                src={t.image} 
                alt={t.name} 
                className={`w-full h-full object-cover transition-transform duration-1000 ${selTrack === t.id ? 'scale-110' : 'group-hover:scale-105'}`} 
              />
            </div>

            {/* Track Info */}
            <div className={`p-4 bg-gradient-to-r ${t.color} flex-1 flex flex-col justify-center`}>
              <h3 className="text-xl md:text-2xl font-black italic shadow-black drop-shadow-md">{t.name}</h3>
              <p className="text-white/90 font-medium text-sm drop-shadow-sm mt-1">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-50 pointer-events-none">
          <button 
            onClick={() => onSelect(selTrack)}
            className="pointer-events-auto px-16 py-4 rounded-full font-black text-2xl italic tracking-widest bg-white text-black hover:scale-110 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            START RACE
          </button>
        </div>
      )}
    </div>
  );
}
