import { Trophy, Clock, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchResultsProps {
  winnerId: string;
  opponentId: string;
  opponentName: string;
  myId: string;
  raceTime: number;
}

export default function MatchResults({ winnerId, opponentName, myId, raceTime }: MatchResultsProps) {
  const navigate = useNavigate();
  const isWinner = winnerId === myId;

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white">
      
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
          RACE FINISHED
        </h1>
        <div className="mt-4 text-2xl font-bold flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 text-cyan-400" />
          Time: {(raceTime / 1000).toFixed(2)}s
        </div>
      </div>

      <div className="flex items-end justify-center gap-6 h-64 mb-16">
        {/* 2nd Place */}
        <div className="flex flex-col items-center opacity-80">
          <div className="mb-4 flex flex-col items-center">
            <span className="font-bold text-xl">{!isWinner ? 'YOU' : opponentName}</span>
          </div>
          <div className="w-32 h-32 bg-slate-700 rounded-t-xl border-t-4 border-slate-400 flex items-center justify-center flex-col shadow-inner">
            <Medal className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-3xl font-black">2ND</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="mb-4 flex flex-col items-center">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <span className="font-bold text-2xl text-yellow-400">{isWinner ? 'YOU' : opponentName}</span>
          </div>
          <div className="w-40 h-48 bg-gradient-to-t from-yellow-700 to-yellow-500 rounded-t-xl border-t-4 border-yellow-300 flex items-center justify-center flex-col shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            <span className="text-5xl font-black text-yellow-100">1ST</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/games')}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-slate-600"
        >
          Return to Lobby
        </button>
      </div>

    </div>
  );
}
