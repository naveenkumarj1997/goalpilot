import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, ArrowLeft, Trophy, RotateCcw, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Orientation = 'H' | 'V';
type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer';
type GamePhase = 'placement' | 'waiting' | 'battle' | 'game_over';

const SHIPS: Record<ShipType, number> = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2
};

interface PlacedShip {
  type: ShipType;
  r: number;
  c: number;
  orientation: Orientation;
  hits: number;
}

export default function Battleship() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const state = location.state as any; 

  const [phase, setPhase] = useState<GamePhase>('placement');
  const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);
  
  // Placement State
  const [myShips, setMyShips] = useState<PlacedShip[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('H');
  
  // Battle State
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [myBoardHits, setMyBoardHits] = useState<string[]>([]); // "r,c" -> hit
  const [myBoardMisses, setMyBoardMisses] = useState<string[]>([]); // "r,c" -> miss
  
  const [opBoardState, setOpBoardState] = useState<Record<string, 'hit' | 'miss' | 'sunk'>>({});
  
  const [rematchRequested, setRematchRequested] = useState(false);

  useEffect(() => {
    if (!socket || !roomId || !state || !user) {
      navigate('/games');
      return;
    }

    socket.emit('joinRoom', { roomId });

    socket.on('bshipPlayerReady', () => {
      // Just for logging or showing opponent is ready
    });

    socket.on('bshipStart', ({ starterId }) => {
      setPhase('battle');
      setIsMyTurn(starterId === user._id);
    });

    socket.on('bshipAttackReceived', ({ r, c }) => {
      handleIncomingAttack(r, c);
    });

    socket.on('bshipAttackResultReceived', ({ r, c, result, isGameOver }) => {
      setOpBoardState(prev => ({ ...prev, [`${r},${c}`]: result }));
      
      if (result === 'sunk') {
        // We could theoretically mark all cells of the sunk ship, but we'll just show the last hit as sunk for now, or just notify.
        // Simple implementation: just keep it as 'hit' visually or a special 'sunk' color.
      }

      if (isGameOver) {
        handleGameOver('me');
      } else {
        setIsMyTurn(false); // End my turn
      }
    });

    socket.on('rematchRequestedByOpponent', () => {});

    socket.on('rematchStart', () => {
      resetGame();
    });

    return () => {
      socket.off('bshipPlayerReady');
      socket.off('bshipStart');
      socket.off('bshipAttackReceived');
      socket.off('bshipAttackResultReceived');
      socket.off('rematchRequestedByOpponent');
      socket.off('rematchStart');
    };
  }, [socket, roomId, user, myShips, myBoardHits, myBoardMisses]);

  const resetGame = () => {
    setPhase('placement');
    setWinner(null);
    setMyShips([]);
    setSelectedShip(null);
    setOrientation('H');
    setMyBoardHits([]);
    setMyBoardMisses([]);
    setOpBoardState({});
    setRematchRequested(false);
  };

  const isCellOccupied = (r: number, c: number, ships: PlacedShip[] = myShips) => {
    return ships.some(ship => {
      const len = SHIPS[ship.type];
      if (ship.orientation === 'H') {
        return r === ship.r && c >= ship.c && c < ship.c + len;
      } else {
        return c === ship.c && r >= ship.r && r < ship.r + len;
      }
    });
  };

  const handleCellClickPlacement = (r: number, c: number) => {
    if (!selectedShip) return;

    const len = SHIPS[selectedShip];
    
    // Check bounds
    if (orientation === 'H' && c + len > 10) return;
    if (orientation === 'V' && r + len > 10) return;

    // Check overlap
    let overlap = false;
    for (let i = 0; i < len; i++) {
      if (orientation === 'H') {
        if (isCellOccupied(r, c + i)) overlap = true;
      } else {
        if (isCellOccupied(r + i, c)) overlap = true;
      }
    }
    
    if (overlap) return;

    // Place ship
    setMyShips([...myShips, { type: selectedShip, r, c, orientation, hits: 0 }]);
    setSelectedShip(null);
  };

  const handleRandomize = () => {
    let newShips: PlacedShip[] = [];
    const types: ShipType[] = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'];
    
    for (const type of types) {
      let placed = false;
      while (!placed) {
        const ori: Orientation = Math.random() > 0.5 ? 'H' : 'V';
        const r = Math.floor(Math.random() * 10);
        const c = Math.floor(Math.random() * 10);
        const len = SHIPS[type];

        if (ori === 'H' && c + len > 10) continue;
        if (ori === 'V' && r + len > 10) continue;

        let overlap = false;
        for (let i = 0; i < len; i++) {
          if (ori === 'H' && isCellOccupied(r, c + i, newShips)) overlap = true;
          if (ori === 'V' && isCellOccupied(r + i, c, newShips)) overlap = true;
        }

        if (!overlap) {
          newShips.push({ type, r, c, orientation: ori, hits: 0 });
          placed = true;
        }
      }
    }
    setMyShips(newShips);
  };

  const handleReady = () => {
    if (myShips.length !== 5 || !socket) return;
    setPhase('waiting');
    socket.emit('bshipReady', { roomId });
  };

  const handleIncomingAttack = (r: number, c: number) => {
    let hitShip: PlacedShip | null = null;
    let newHits = [...myBoardHits];
    let newMisses = [...myBoardMisses];
    
    let isGameOver = false;
    let result: 'hit' | 'miss' | 'sunk' = 'miss';
    let shipName = null;

    const newShips = myShips.map(ship => {
      const len = SHIPS[ship.type];
      let isHit = false;
      if (ship.orientation === 'H') {
        if (r === ship.r && c >= ship.c && c < ship.c + len) isHit = true;
      } else {
        if (c === ship.c && r >= ship.r && r < ship.r + len) isHit = true;
      }

      if (isHit) {
        hitShip = ship;
        ship.hits += 1;
      }
      return ship;
    });

    const hShip = hitShip as PlacedShip | null;
    if (hShip) {
      newHits.push(`${r},${c}`);
      result = hShip.hits === SHIPS[hShip.type] ? 'sunk' : 'hit';
      shipName = hShip.type;
      
      const totalHits = newShips.reduce((acc, s) => acc + s.hits, 0);
      if (totalHits === 17) isGameOver = true;
    } else {
      newMisses.push(`${r},${c}`);
    }

    setMyShips(newShips);
    setMyBoardHits(newHits);
    setMyBoardMisses(newMisses);
    setIsMyTurn(true); // My turn now

    socket?.emit('bshipAttackResult', { roomId, r, c, result, shipName, isGameOver });

    if (isGameOver) {
      handleGameOver('opponent');
    }
  };

  const handleAttack = (r: number, c: number) => {
    if (!isMyTurn || phase !== 'battle' || opBoardState[`${r},${c}`]) return;
    socket?.emit('bshipAttack', { roomId, r, c });
    // We don't end turn immediately; wait for result
  };

  const handleGameOver = (win: 'me' | 'opponent') => {
    setPhase('game_over');
    setWinner(win);
    if (win === 'me' && socket) {
      socket.emit('gameEnd', {
        roomId, gameType: 'Battleship', winnerId: user?._id, loserId: state.opponentId, isDraw: false, duration: 0
      });
    }
  };

  const requestRematch = () => {
    if (!socket) return;
    setRematchRequested(true);
    socket.emit('rematchRequest', { roomId });
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[900px] flex flex-col text-slate-100 bg-slate-900 p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900 rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
      
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => navigate('/games')} className="flex items-center text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5 mr-2" /> Leave Match
        </button>
      </div>

      <div className="text-center mb-8 relative z-10 pt-4">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 tracking-wider">
          BATTLESHIP
        </h1>
      </div>

      {phase === 'placement' && (
        <div className="flex flex-col items-center z-10">
          <h2 className="text-2xl font-bold mb-6 text-slate-300">Deploy Your Fleet</h2>
          
          <div className="flex gap-12">
            {/* My Grid */}
            <div className="bg-blue-950 p-4 rounded-xl border-4 border-blue-900 shadow-2xl">
              <div className="grid grid-cols-10 gap-1 bg-blue-900 p-1 rounded-lg">
                {Array.from({ length: 10 }).map((_, r) => 
                  Array.from({ length: 10 }).map((_, c) => {
                    const hasShip = isCellOccupied(r, c);
                    return (
                      <div 
                        key={`${r}-${c}`}
                        onClick={() => handleCellClickPlacement(r, c)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 border rounded-sm transition-colors cursor-pointer
                          ${hasShip ? 'bg-green-400 border-green-200 shadow-[0_0_15px_rgba(74,222,128,1)] z-10 relative' : 'border-blue-800/50 bg-blue-500/10 hover:bg-blue-400/30'}
                        `}
                      >
                        {hasShip && <div className="w-2 h-2 rounded-full bg-green-800 mx-auto mt-[40%]" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 min-w-[250px]">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-slate-400 mb-4 uppercase text-sm tracking-wider">Available Ships</h3>
                <div className="flex flex-col gap-2">
                  {(['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'] as ShipType[]).map(type => {
                    const isPlaced = myShips.some(s => s.type === type);
                    const isSelected = selectedShip === type;
                    return (
                      <button
                        key={type}
                        disabled={isPlaced}
                        onClick={() => setSelectedShip(type)}
                        className={`flex justify-between px-4 py-2 rounded-lg text-sm font-bold transition-all
                          ${isPlaced ? 'opacity-30 bg-slate-900' : isSelected ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-700 hover:bg-slate-600'}
                        `}
                      >
                        <span>{type}</span>
                        <span>{SHIPS[type]}</span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex gap-2">
                  <button 
                    onClick={() => setOrientation(o => o === 'H' ? 'V' : 'H')}
                    className="flex-1 flex items-center justify-center py-2 bg-slate-700 rounded-lg hover:bg-slate-600 font-bold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {orientation === 'H' ? 'Horizontal' : 'Vertical'}
                  </button>
                </div>
              </div>

              <button 
                onClick={handleRandomize}
                className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-300"
              >
                Randomize Fleet
              </button>

              <button 
                onClick={handleReady}
                disabled={myShips.length !== 5}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all tracking-widest uppercase
                  ${myShips.length === 5 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                `}
              >
                Battle Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <RefreshCw className="w-16 h-16 animate-spin text-blue-500 mb-6" />
          <h2 className="text-3xl font-black text-white tracking-widest">WAITING FOR OPPONENT...</h2>
        </div>
      )}

      {(phase === 'battle' || phase === 'game_over') && (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 z-10 w-full px-4">
          
          {/* Opponent Board (Attack here) */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="text-xl font-black text-red-400 tracking-widest flex items-center">
                <Crosshair className="w-6 h-6 mr-2" /> TARGET GRID
              </h2>
              {isMyTurn && phase === 'battle' && (
                <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded-full text-xs font-bold animate-pulse">YOUR TURN</span>
              )}
            </div>
            <div className={`bg-red-950 p-3 rounded-xl border-4 ${isMyTurn ? 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'border-red-900'} transition-all`}>
              <div className="grid grid-cols-10 gap-1 bg-red-900/50 p-1 rounded-lg">
                {Array.from({ length: 10 }).map((_, r) => 
                  Array.from({ length: 10 }).map((_, c) => {
                    const state = opBoardState[`${r},${c}`];
                    return (
                      <div 
                        key={`op-${r}-${c}`}
                        onClick={() => handleAttack(r, c)}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 border border-red-800/30 rounded-sm transition-all flex items-center justify-center overflow-hidden
                          ${!state && isMyTurn ? 'cursor-pointer hover:bg-red-500/40 bg-red-500/10' : 'bg-red-900/40'}
                          ${state === 'miss' ? 'bg-blue-600/40' : ''}
                          ${state === 'hit' || state === 'sunk' ? 'bg-orange-600/80 shadow-[0_0_15px_rgba(249,115,22,0.8)]' : ''}
                        `}
                      >
                        <AnimatePresence>
                          {state === 'miss' && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              className="w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                            />
                          )}
                          {(state === 'hit' || state === 'sunk') && (
                            <motion.div 
                              initial={{ scale: 0, rotate: -45 }} 
                              animate={{ scale: 1.5, rotate: 0 }} 
                              className="text-2xl drop-shadow-[0_0_15px_rgba(239,68,68,1)] z-10"
                            >
                              💥
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="hidden lg:flex flex-col items-center opacity-30">
            <div className="w-1 h-32 bg-gradient-to-b from-red-500 to-transparent mb-4" />
            <span className="text-3xl font-black text-slate-500">VS</span>
            <div className="w-1 h-32 bg-gradient-to-t from-blue-500 to-transparent mt-4" />
          </div>

          {/* My Board */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="text-xl font-black text-blue-400 tracking-widest">MY FLEET</h2>
            </div>
            <div className="bg-blue-950 p-3 rounded-xl border-4 border-blue-900 opacity-80">
              <div className="grid grid-cols-10 gap-1 bg-blue-900 p-1 rounded-lg">
                {Array.from({ length: 10 }).map((_, r) => 
                  Array.from({ length: 10 }).map((_, c) => {
                    const hasShip = isCellOccupied(r, c);
                    const isHit = myBoardHits.includes(`${r},${c}`);
                    const isMiss = myBoardMisses.includes(`${r},${c}`);
                    
                    return (
                      <div 
                        key={`my-${r}-${c}`}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 border rounded-sm flex items-center justify-center overflow-hidden
                          ${hasShip && !isHit ? 'bg-green-400 border-green-200 shadow-[0_0_15px_rgba(74,222,128,1)] z-10' : !hasShip ? 'border-blue-800/50 bg-blue-900/50' : 'border-blue-800/50'}
                          ${isMiss ? 'bg-blue-600/40' : ''}
                          ${isHit ? 'bg-red-600/80' : ''}
                        `}
                      >
                        {hasShip && !isHit && <div className="w-2 h-2 rounded-full bg-green-800 z-0" />}
                        <AnimatePresence>
                          {isMiss && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              className="w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10" 
                            />
                          )}
                          {isHit && (
                            <motion.div 
                              initial={{ scale: 0, rotate: -45 }} 
                              animate={{ scale: 1.5, rotate: 0 }} 
                              className="text-2xl drop-shadow-[0_0_15px_rgba(239,68,68,1)] z-10"
                            >
                              💥
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Match Over Overlay */}
      <AnimatePresence>
        {phase === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            className="absolute inset-0 bg-slate-900/90 rounded-3xl flex flex-col items-center justify-center z-50"
          >
            <Trophy className={`w-32 h-32 mb-8 ${winner === 'me' ? 'text-yellow-400' : 'text-red-500'}`} />
            <h2 className="text-6xl font-black mb-4 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-wider uppercase text-center">
              {winner === 'me' ? 'FLEET DESTROYED\nVICTORY!' : 'FLEET SUNK\nDEFEAT'}
            </h2>
            <p className="text-2xl text-slate-300 mb-12 font-medium">
              {winner === 'me' ? `You obliterated ${state.opponentName}.` : `${state.opponentName} sank your entire fleet.`}
            </p>

            <div className="flex gap-6">
              <button 
                onClick={() => navigate('/games')}
                className="px-10 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Return to Lounge
              </button>
              <button 
                onClick={requestRematch}
                disabled={rematchRequested}
                className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center ${
                  rematchRequested 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                }`}
              >
                <RefreshCw className={`w-6 h-6 mr-3 ${rematchRequested ? 'animate-spin' : ''}`} />
                {rematchRequested ? 'Waiting for opponent...' : 'Rematch'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
