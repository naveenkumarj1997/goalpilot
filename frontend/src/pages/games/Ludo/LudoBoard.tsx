import { motion } from 'framer-motion';
import { LUDO_PATH, RED_HOME_PATH, BLUE_HOME_PATH, SAFE_ZONES } from './ludoLogic';

export default function LudoBoard() {
  const renderCell = (x: number, y: number, key: string, isSafe: boolean, colorClass: string = 'bg-white', customBorder: string = 'border-slate-300') => (
    <div
      key={key}
      className={`absolute w-[6%] h-[6%] rounded-sm border-2 ${customBorder} flex items-center justify-center transition-colors shadow-sm ${colorClass}`}
      style={{ left: `${x * 6.66 + 0.33}%`, top: `${y * 6.66 + 0.33}%` }}
    >
      {isSafe && (
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-slate-800/20 drop-shadow-sm flex items-center justify-center font-bold text-[8px] sm:text-xs"
        >
          ★
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-2xl p-2 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-[12px] border-[#4a2e15] overflow-hidden"
         style={{
           backgroundColor: '#8B5A2B',
           backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)`,
           backgroundSize: '30px 30px'
         }}
    >
      <div className="relative w-full h-full bg-[#fdfaf6] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] border-2 border-slate-300/50">
        
        {/* Top-Left Red Base */}
        <div className="absolute w-[40%] h-[40%] top-0 left-0 bg-red-500 border-[10px] border-red-600 flex items-center justify-center shadow-inner">
          <div className="w-[70%] h-[70%] bg-white rounded-lg grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 shadow-md">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-red-100 border-[3px] border-red-200 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Top-Right Green Base */}
        <div className="absolute w-[40%] h-[40%] top-0 right-0 bg-green-500 border-[10px] border-green-600 flex items-center justify-center shadow-inner">
          <div className="w-[70%] h-[70%] bg-white rounded-lg grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 shadow-md">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-green-100 border-[3px] border-green-200 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Bottom-Right Blue Base */}
        <div className="absolute w-[40%] h-[40%] bottom-0 right-0 bg-blue-500 border-[10px] border-blue-600 flex items-center justify-center shadow-inner">
          <div className="w-[70%] h-[70%] bg-white rounded-lg grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 shadow-md">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-blue-100 border-[3px] border-blue-200 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Bottom-Left Yellow Base */}
        <div className="absolute w-[40%] h-[40%] bottom-0 left-0 bg-yellow-400 border-[10px] border-yellow-500 flex items-center justify-center shadow-inner">
          <div className="w-[70%] h-[70%] bg-white rounded-lg grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 shadow-md">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full bg-yellow-100 border-[3px] border-yellow-200 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Outer Path */}
        {LUDO_PATH.map((pos, idx) => {
          const isSafe = SAFE_ZONES.has(idx);
          let colorClass = 'bg-white';
          let borderClass = 'border-slate-300';
          
          if (idx === 0) { colorClass = 'bg-red-500'; borderClass = 'border-red-600'; }
          if (idx === 13) { colorClass = 'bg-green-500'; borderClass = 'border-green-600'; }
          if (idx === 26) { colorClass = 'bg-blue-500'; borderClass = 'border-blue-600'; }
          if (idx === 39) { colorClass = 'bg-yellow-400'; borderClass = 'border-yellow-500'; }
          
          if (isSafe && idx !== 0 && idx !== 13 && idx !== 26 && idx !== 39) {
            colorClass = 'bg-slate-200';
          }
          
          return renderCell(pos.x, pos.y, `path-${idx}`, isSafe, colorClass, borderClass);
        })}

        {/* Home Paths */}
        {RED_HOME_PATH.slice(0, 5).map((pos, idx) => 
          renderCell(pos.x, pos.y, `red-home-${idx}`, false, 'bg-red-500', 'border-red-600')
        )}
        {/* Green Home */}
        {[1, 2, 3, 4, 5].map((y, idx) => 
          renderCell(7, y, `green-home-${idx}`, false, 'bg-green-500', 'border-green-600')
        )}
        {/* Blue Home */}
        {BLUE_HOME_PATH.slice(0, 5).map((pos, idx) => 
          renderCell(pos.x, pos.y, `blue-home-${idx}`, false, 'bg-blue-500', 'border-blue-600')
        )}
        {/* Yellow Home */}
        {[13, 12, 11, 10, 9].map((y, idx) => 
          renderCell(7, y, `yellow-home-${idx}`, false, 'bg-yellow-400', 'border-yellow-500')
        )}

        {/* Center Finish */}
        <div className="absolute w-[20%] h-[20%] left-[40%] top-[40%]">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-lg">
              <polygon points="0,0 50,50 0,100" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
              <polygon points="0,0 100,0 50,50" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
              <polygon points="100,0 100,100 50,50" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
              <polygon points="0,100 100,100 50,50" fill="#facc15" stroke="#eab308" strokeWidth="1" />
              <polygon points="0,0 100,0 100,100 0,100" fill="none" stroke="#94a3b8" strokeWidth="2" />
            </svg>
        </div>
      </div>
    </div>
  );
}
