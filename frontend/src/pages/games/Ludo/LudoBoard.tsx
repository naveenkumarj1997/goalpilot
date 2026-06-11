// React import not needed
import { motion } from 'framer-motion';
import { LUDO_PATH, RED_HOME_PATH, BLUE_HOME_PATH, SAFE_ZONES } from './ludoLogic';

export default function LudoBoard() {
  const renderCell = (x: number, y: number, key: string, isSafe: boolean, colorClass: string = 'bg-slate-800') => (
    <div
      key={key}
      className={`absolute w-[6%] h-[6%] rounded border border-white/5 flex items-center justify-center transition-colors ${colorClass} ${isSafe ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}`}
      style={{ left: `${x * 6.66}%`, top: `${y * 6.66}%` }}
    >
      {isSafe && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [45, 45, 45], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-1/2 bg-white/40 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
        />
      )}
    </div>
  );

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-3xl p-4 bg-slate-900 border border-white/10 shadow-xl overflow-hidden">

      <div className="relative w-full h-full">
        {/* Red Base */}
        <div className="absolute w-[40%] h-[40%] top-0 left-0 bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 shadow-[inset_0_0_30px_rgba(239,68,68,0.2)]">
          <div className="w-full h-full bg-slate-900/60 rounded-xl grid grid-cols-2 gap-4 p-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-black/60 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] border border-white/5" />
            ))}
          </div>
        </div>

        {/* Blue Base */}
        <div className="absolute w-[40%] h-[40%] bottom-0 right-0 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-4 shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]">
          <div className="w-full h-full bg-slate-900/60 rounded-xl grid grid-cols-2 gap-4 p-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-black/60 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] border border-white/5" />
            ))}
          </div>
        </div>

        {/* Outer Path */}
        {LUDO_PATH.map((pos, idx) => {
          const isSafe = SAFE_ZONES.has(idx);
          let colorClass = 'bg-slate-800 border-white/10';
          if (idx === 0) colorClass = 'bg-red-500/40 border-red-500/50';
          if (idx === 26) colorClass = 'bg-blue-500/40 border-blue-500/50';
          if (isSafe && idx !== 0 && idx !== 26) colorClass = 'bg-purple-500/30 border-purple-500/40';
          
          return renderCell(pos.x, pos.y, `path-${idx}`, isSafe, colorClass);
        })}

        {/* Home Paths */}
        {RED_HOME_PATH.slice(0, 5).map((pos, idx) => 
          renderCell(pos.x, pos.y, `red-home-${idx}`, false, 'bg-red-500/30 border-red-500/40')
        )}
        {BLUE_HOME_PATH.slice(0, 5).map((pos, idx) => 
          renderCell(pos.x, pos.y, `blue-home-${idx}`, false, 'bg-blue-500/30 border-blue-500/40')
        )}

        {/* Center Finish */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[20%] h-[20%] left-[40%] top-[40%] bg-gradient-to-br from-yellow-500/30 to-yellow-600/50 border-2 border-yellow-500/50 rounded-xl flex items-center justify-center backdrop-blur-lg shadow-[0_0_30px_rgba(234,179,8,0.5)]"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-yellow-300 font-black text-4xl drop-shadow-[0_0_15px_rgba(234,179,8,1)]"
          >
            ★
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
