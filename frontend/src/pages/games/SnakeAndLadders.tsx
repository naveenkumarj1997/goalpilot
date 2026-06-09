import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Info } from 'lucide-react';

const SNAKES: Record<number, number> = { 98: 78, 95: 56, 87: 24, 64: 36, 48: 12 };
const LADDERS: Record<number, number> = { 3: 22, 15: 45, 28: 65, 50: 89, 72: 96 };

const CELL_COLORS = [
  'bg-blue-900/60 border-blue-500/30',
  'bg-purple-900/60 border-purple-500/30',
  'bg-emerald-900/60 border-emerald-500/30',
  'bg-rose-900/60 border-rose-500/30',
  'bg-amber-900/60 border-amber-500/30'
];

export default function SnakeAndLadders() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const state = location.state as any;

  if (!state || !user) {
    navigate('/games');
    return null;
  }

  const opponentId = state.opponentId;
  const opponentName = state.opponentName;
  const starterId = state.iAmStarter ? user._id : opponentId;

  const [positions, setPositions] = useState<Record<string, number>>({
    [user._id]: 1,
    [opponentId]: 1
  });
  
  const [turnId, setTurnId] = useState<string>(starterId);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted] = useState(Date.now());
  const [actionMessage, setActionMessage] = useState<string>('Game started! Roll the dice.');

  // Initialize board cells
  const getBoardCells = () => {
    let cells = [];
    for (let row = 9; row >= 0; row--) {
      let rowCells = [];
      for (let col = 1; col <= 10; col++) {
        let cellNum = row * 10 + col;
        rowCells.push(cellNum);
      }
      if (row % 2 !== 0) {
        rowCells.reverse(); // Boustrophedon pattern
      }
      cells.push(...rowCells);
    }
    return cells;
  };

  const cells = getBoardCells();

  useEffect(() => {
    if (!socket || !roomId) return;

    // Ensure we are in the room (crucial if socket reconnects after tab switch)
    socket.emit('joinRoom', { roomId });

    socket.on('gameMove', (data: any) => {
      if (data.type === 'roll') {
        setIsRolling(true);
        setTimeout(() => {
          setDiceValue(data.roll);
        }, 100); // sync dice value quickly
        
        setTimeout(() => {
          setIsRolling(false);
          setPositions(prev => ({ ...prev, [opponentId]: data.newPosition }));
          setTurnId(user._id);
          checkSpecialEvents(data.newPosition, opponentId, data.roll);
        }, 2500);
      }
    });

    return () => {
      socket.off('gameMove');
    };
  }, [socket, roomId, opponentId, user._id]);

  const checkSpecialEvents = (pos: number, playerId: string, roll: number) => {
    const isMe = playerId === user._id;
    const name = isMe ? 'You' : opponentName;
    
    setActionMessage(`${name} rolled a ${roll}!`);

    setTimeout(() => {
      if (SNAKES[pos]) {
        setActionMessage(`Oh no! ${name} got bitten by a snake! Sliding down to ${SNAKES[pos]}.`);
        setPositions(prev => ({ ...prev, [playerId]: SNAKES[pos] }));
      } else if (LADDERS[pos]) {
        setActionMessage(`Awesome! ${name} found a ladder! Climbing up to ${LADDERS[pos]}.`);
        setPositions(prev => ({ ...prev, [playerId]: LADDERS[pos] }));
      }

      const finalPos = SNAKES[pos] || LADDERS[pos] || pos;
      if (finalPos === 100) {
        setWinner(playerId);
        if (isMe) {
           socket?.emit('gameEnd', {
              roomId,
              gameType: 'SnakeAndLadders',
              winnerId: user._id,
              loserId: opponentId,
              isDraw: false,
              duration: Math.floor((Date.now() - gameStarted) / 1000)
           });
        }
      }
    }, 1000);
  };

  const rollDice = () => {
    if (turnId !== user._id || isRolling || winner) return;

    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setDiceValue(roll);
    }, 100);

    let currentPos = positions[user._id];
    let newPosition = currentPos + roll;

    if (newPosition > 100) {
      newPosition = currentPos;
    }

    // Emit immediately so opponent sees the dice roll at the exact same time
    socket?.emit('gameMove', {
      roomId,
      moveData: { type: 'roll', roll, newPosition, by: user._id }
    });

    setTimeout(() => {
      setIsRolling(false);

      if (newPosition === currentPos) {
        setActionMessage(`You need exactly ${100 - currentPos} to win!`);
      }

      setPositions(prev => ({ ...prev, [user._id]: newPosition }));
      setTurnId(opponentId);
      
      checkSpecialEvents(newPosition, user._id, roll);
    }, 2500);
  };

  const isMyTurn = turnId === user._id;

  // 3D Dice Rotations (fixed mathematically to correctly bring the requested face to the front)
  const diceRotations: Record<number, { rotateX: number, rotateY: number }> = {
    1: { rotateX: 0, rotateY: 0 },
    2: { rotateX: 90, rotateY: 0 },
    3: { rotateX: 0, rotateY: 90 },
    4: { rotateX: 0, rotateY: -90 },
    5: { rotateX: -90, rotateY: 0 },
    6: { rotateX: 180, rotateY: 0 }
  };

  const currentRotation = diceRotations[diceValue] || { rotateX: 0, rotateY: 0 };
  const animatedRotation = isRolling 
    ? { rotateX: 720 + Math.random() * 360, rotateY: 720 + Math.random() * 360 }
    : currentRotation;

  // Render a 3D Dice Face
  const renderDiceFace = (num: number, transform: string) => {
    const dots = Array.from({ length: num }).map((_, i) => (
      <div key={i} className="w-3 h-3 bg-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
    ));
    
    // Layout classes for dots
    let layoutClass = "";
    if (num === 1) layoutClass = "flex items-center justify-center";
    if (num === 2) layoutClass = "flex flex-col justify-between items-center py-2";
    if (num === 3) layoutClass = "flex flex-col justify-between items-center py-1";
    if (num === 4) layoutClass = "grid grid-cols-2 grid-rows-2 gap-2 place-items-center p-2";
    if (num === 5) layoutClass = "grid grid-cols-2 grid-rows-3 gap-1 place-items-center p-1 [&>*:nth-child(3)]:col-span-2";
    if (num === 6) layoutClass = "grid grid-cols-2 grid-rows-3 gap-2 place-items-center py-2 px-1";

    return (
      <div 
        className={`absolute w-full h-full bg-gradient-to-br from-brand to-purple-600 border-2 border-white/30 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backface-hidden ${layoutClass}`}
        style={{ transform, backfaceVisibility: 'hidden' }}
      >
        {dots}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
      {/* Sidebar Area */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <button 
          onClick={() => navigate('/games')}
          className="self-start text-sm font-bold text-slate-400 hover:text-white flex items-center transition-colors bg-slate-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Game
        </button>

        <div className="glass p-6 rounded-2xl border border-brand/20 shadow-2xl relative overflow-hidden neon-border-brand">
          <h2 className="text-2xl font-bold mb-6 text-white text-center flex items-center justify-center">
            <Trophy className="w-6 h-6 mr-3 text-brand" />
            Snakes & Ladders
          </h2>

          <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl mb-4 border border-brand/10">
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${isMyTurn ? 'bg-brand/20 border border-brand/50 shadow-[0_0_15px_rgba(0,112,209,0.3)]' : 'opacity-60'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-500 mb-2 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <span className="font-bold text-white">You</span>
              {isMyTurn && <span className="text-[10px] text-brand-light font-bold mt-1 tracking-widest uppercase">Your Turn</span>}
            </div>
            
            <span className="text-xl font-black text-slate-500">VS</span>
            
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${!isMyTurn ? 'bg-purple-500/20 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'opacity-60'}`}>
              <div className="w-10 h-10 rounded-full bg-purple-500 mb-2 border-2 border-white shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <span className="font-bold text-white">{opponentName}</span>
              {!isMyTurn && <span className="text-[10px] text-purple-300 font-bold mt-1 tracking-widest uppercase">Their Turn</span>}
            </div>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 text-center mb-6 min-h-[80px] flex items-center justify-center">
            <span className="text-sm font-medium text-slate-300">
              <Info className="w-4 h-4 inline mr-2 text-brand" />
              {actionMessage}
            </span>
          </div>

          {!winner && (
            <div className="flex flex-col items-center py-4 perspective-1000">
              <div 
                className="w-24 h-24 mb-6 cursor-pointer"
                onClick={rollDice}
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={animatedRotation}
                  transition={{ 
                    duration: isRolling ? 2.5 : 0.5, 
                    type: isRolling ? "tween" : "spring",
                    ease: isRolling ? "linear" : undefined,
                    stiffness: 100,
                    damping: 10
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front = 1 */}
                  {renderDiceFace(1, 'translateZ(48px)')}
                  {/* Back = 6 */}
                  {renderDiceFace(6, 'rotateY(180deg) translateZ(48px)')}
                  {/* Right = 4 */}
                  {renderDiceFace(4, 'rotateY(90deg) translateZ(48px)')}
                  {/* Left = 3 */}
                  {renderDiceFace(3, 'rotateY(-90deg) translateZ(48px)')}
                  {/* Top = 5 */}
                  {renderDiceFace(5, 'rotateX(90deg) translateZ(48px)')}
                  {/* Bottom = 2 */}
                  {renderDiceFace(2, 'rotateX(-90deg) translateZ(48px)')}
                </motion.div>
              </div>

              <button
                onClick={rollDice}
                disabled={!isMyTurn || isRolling}
                className={`w-full py-3 rounded-xl font-bold transition-all uppercase tracking-widest ${
                  isMyTurn && !isRolling
                    ? 'bg-gradient-to-r from-brand to-brand-hover text-white shadow-[0_0_20px_rgba(0,112,209,0.5)] hover:scale-[1.02]' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isRolling ? 'Rolling...' : isMyTurn ? 'Roll Dice' : 'Waiting...'}
              </button>
            </div>
          )}

          {winner && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-xl mt-6 text-center border-2 ${
                winner === user._id 
                  ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                  : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              }`}
            >
              <h3 className="text-2xl font-black uppercase mb-2">
                {winner === user._id ? 'You Won!' : 'You Lost!'}
              </h3>
              <p className="text-sm opacity-80">Match stats have been recorded.</p>
              <button 
                onClick={() => navigate('/games')}
                className="mt-4 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors font-bold"
              >
                Return to Lobby
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Board Area */}
      <div className="lg:w-2/3 bg-[#0A0E17] rounded-2xl border border-slate-800 shadow-2xl p-4 lg:p-8">
        
        {/* The Grid */}
        <div 
          className="relative w-full border-[6px] border-[#1e293b] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-slate-900 mx-auto"
          style={{ 
            maxWidth: 'min(100%, 75vh)',
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(10, 1fr)',
            aspectRatio: '1 / 1'
          }}
        >
          
          {cells.map((cellNum) => {
            const isLadderStart = Object.keys(LADDERS).includes(cellNum.toString());
            const isSnakeHead = Object.keys(SNAKES).includes(cellNum.toString());
            
            const baseColor = CELL_COLORS[cellNum % 5];
            
            return (
              <div 
                key={cellNum} 
                className={`relative border border-black/20 flex flex-col items-center justify-center text-sm font-black transition-colors ${
                  cellNum === 100 
                    ? 'bg-yellow-500/80 border-yellow-400 text-yellow-100 shadow-[inset_0_0_30px_rgba(234,179,8,0.6)]' 
                    : `${baseColor} text-white/50 hover:bg-white/10`
                }`}
              >
                <span className="absolute top-1 left-1.5 opacity-60 drop-shadow-md">{cellNum}</span>
                
                {/* Visual markers for Starts/Heads */}
                {isLadderStart && <span className="absolute bottom-1 right-1 text-green-400 text-xs animate-bounce">⬆️</span>}
                {isSnakeHead && <span className="absolute bottom-1 right-1 text-red-400 text-xs animate-pulse">⬇️</span>}
                
                {/* Tokens */}
                <div className="flex gap-1.5 z-20 relative drop-shadow-2xl">
                  {positions[user._id] === cellNum && (
                    <motion.div 
                      layoutId="myToken"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-[0_0_15px_rgba(59,130,246,1)] z-30"
                    />
                  )}
                  {positions[opponentId] === cellNum && (
                    <motion.div 
                      layoutId="opponentToken"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white shadow-[0_0_15px_rgba(168,85,247,1)] z-30"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* SVG Overlay for Connections (Mathematically Perfect) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
             
             <defs>
               <linearGradient id="ladderGrad" x1="0" y1="0" x2="100" y2="0">
                 <stop offset="0%" stopColor="#78350f" />
                 <stop offset="50%" stopColor="#d97706" />
                 <stop offset="100%" stopColor="#78350f" />
               </linearGradient>
               <linearGradient id="snakeGrad" x1="0" y1="0" x2="100" y2="100">
                 <stop offset="0%" stopColor="#ef4444" />
                 <stop offset="50%" stopColor="#991b1b" />
                 <stop offset="100%" stopColor="#450a0a" />
               </linearGradient>
               <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.8"/>
               </filter>
             </defs>

             {/* DYNAMIC LADDERS */}
             {Object.entries(LADDERS).map(([startStr, endStr], i) => {
               const startNum = Number(startStr);
               const endNum = endStr as unknown as number;
               
               const startRow = Math.floor((startNum - 1) / 10);
               const startColRaw = (startNum - 1) % 10;
               const startCol = startRow % 2 === 0 ? startColRaw : 9 - startColRaw;
               const sx = startCol * 10 + 5;
               const sy = (9 - startRow) * 10 + 5;

               const endRow = Math.floor((endNum - 1) / 10);
               const endColRaw = (endNum - 1) % 10;
               const endCol = endRow % 2 === 0 ? endColRaw : 9 - endColRaw;
               const ex = endCol * 10 + 5;
               const ey = (9 - endRow) * 10 + 5;

               return (
                 <g key={`ladder-${i}`} filter="url(#shadow)">
                   {/* Background thick rail */}
                   <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="url(#ladderGrad)" strokeWidth="4" strokeLinecap="round" />
                   {/* Rungs (dashed line) */}
                   <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#f59e0b" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
                 </g>
               );
             })}

             {/* DYNAMIC SNAKES */}
             {Object.entries(SNAKES).map(([headStr, tailStr], i) => {
               const headNum = Number(headStr);
               const tailNum = tailStr as unknown as number;
               
               const headRow = Math.floor((headNum - 1) / 10);
               const headColRaw = (headNum - 1) % 10;
               const headCol = headRow % 2 === 0 ? headColRaw : 9 - headColRaw;
               const hx = headCol * 10 + 5;
               const hy = (9 - headRow) * 10 + 5;

               const tailRow = Math.floor((tailNum - 1) / 10);
               const tailColRaw = (tailNum - 1) % 10;
               const tailCol = tailRow % 2 === 0 ? tailColRaw : 9 - tailColRaw;
               const tx = tailCol * 10 + 5;
               const ty = (9 - tailRow) * 10 + 5;

               // Calculate a curved path so it's not a straight boring line
               const mx = (hx + tx) / 2;
               const my = (hy + ty) / 2;
               const cx = mx + (i % 2 === 0 ? 10 : -10);
               const cy = my;

               return (
                 <g key={`snake-${i}`} filter="url(#shadow)">
                   {/* Snake Body */}
                   <path d={`M ${hx} ${hy} Q ${cx} ${cy} ${tx} ${ty}`} stroke="url(#snakeGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                   
                   {/* Snake Head */}
                   <circle cx={hx} cy={hy} r="2.5" fill="#ef4444" />
                   <circle cx={hx - 0.8} cy={hy - 0.5} r="0.6" fill="#fff" />
                   <circle cx={hx + 0.8} cy={hy - 0.5} r="0.6" fill="#fff" />
                   <path d={`M ${hx} ${hy+1} L ${hx} ${hy+3}`} stroke="#f87171" strokeWidth="0.4" />
                 </g>
               );
             })}

          </svg>

        </div>
      </div>
    </div>
  );
}
