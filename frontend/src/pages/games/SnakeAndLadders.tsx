import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Info, Star, Shield, Crown } from 'lucide-react';
import ReactConfetti from 'react-confetti';

const SNAKES: Record<number, number> = { 98: 78, 95: 56, 87: 24, 64: 36, 48: 12, 33: 6, 99: 4, 85: 12, 32: 25, 74: 66 };
const LADDERS: Record<number, number> = { 3: 22, 15: 45, 28: 65, 50: 89, 72: 96, 11: 30 };

// Special Events
const SPECIAL_EVENTS: Record<number, { type: string, message: string, bonus: number }> = {
  10: { type: 'LUCKY_DICE', message: 'Lucky Dice! +3 Spaces', bonus: 3 },
  25: { type: 'TREASURE', message: 'Found Treasure! +5 Spaces', bonus: 5 },
  42: { type: 'SPEED_BOOST', message: 'Speed Boost! Move forward 2.', bonus: 2 },
  80: { type: 'GOLDEN_LADDER', message: 'Golden Boost! +4 Spaces', bonus: 4 },
};

const MYSTERY_BOXES = [20, 38, 55, 76];
const POWERS = ['gun', 'bomb', 'shield', 'smoke', 'rocket_launcher'] as const;
type Power = typeof POWERS[number];

const CELL_COLORS = [
  'bg-blue-900/60 border-blue-500/30',
  'bg-purple-900/60 border-purple-500/30',
  'bg-emerald-900/60 border-emerald-500/30',
  'bg-rose-900/60 border-rose-500/30',
  'bg-amber-900/60 border-amber-500/30'
];

const EMOTES = ['😂', '😭', '😎', '😡', '🤯', '😱', '🥳', '👏', '💪', '🔥'];

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

  // Customization State
  const [tokenColor, setTokenColor] = useState('blue');
  const [tokenShape, setTokenShape] = useState('circle');
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentColor, setOpponentColor] = useState('purple');
  const [opponentShape, setOpponentShape] = useState('circle');

  // Position States
  const [targetPositions, setTargetPositions] = useState<Record<string, number>>({
    [user._id]: 1,
    [opponentId]: 1
  });
  const [visualPositions, setVisualPositions] = useState<Record<string, number>>({
    [user._id]: 1,
    [opponentId]: 1
  });
  const positionsRef = useRef(targetPositions);
  useEffect(() => { positionsRef.current = targetPositions; }, [targetPositions]);

  // Sync Tracking Refs
  const customizerRef = useRef(showCustomizer);
  useEffect(() => { customizerRef.current = showCustomizer; }, [showCustomizer]);
  const tokenColorRef = useRef(tokenColor);
  useEffect(() => { tokenColorRef.current = tokenColor; }, [tokenColor]);
  const tokenShapeRef = useRef(tokenShape);
  useEffect(() => { tokenShapeRef.current = tokenShape; }, [tokenShape]);

  // Combat States

  const [activeBuffs, setActiveBuffs] = useState<Record<string, { shield: number, smoke: number }>>({
    [user._id]: { shield: 0, smoke: 0 },
    [opponentId]: { shield: 0, smoke: 0 }
  });
  const buffsRef = useRef(activeBuffs);
  useEffect(() => { buffsRef.current = activeBuffs; }, [activeBuffs]);
  const [combatAnim, setCombatAnim] = useState<{ type: string, targetId: string } | null>(null);
  
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);
  
  const [turnId, setTurnId] = useState<string>(starterId);
  const turnRef = useRef(turnId);
  useEffect(() => { turnRef.current = turnId; }, [turnId]);
  
  const [diceRotation, setDiceRotation] = useState({ rotateX: 0, rotateY: 0 });
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted] = useState(Date.now());
  const [actionMessage, setActionMessage] = useState<string>('Customize your token to start!');

  // Update Action Message Dynamically
  useEffect(() => {
    if (!showCustomizer && opponentReady && !isRolling && !winner) {
      setActionMessage(turnId === user._id ? 'Your Turn! Roll the dice.' : `${opponentName}'s Turn.`);
    }
  }, [opponentReady, showCustomizer, turnId, isRolling, winner, user._id, opponentName]);
  
  // Social States
  const [playerEmotes, setPlayerEmotes] = useState<Record<string, string>>({});
  const [showEmoteMenu, setShowEmoteMenu] = useState(false);

  // Big Event Overlay
  const [bigEvent, setBigEvent] = useState<{ message: string, type: 'good' | 'bad' | 'neutral' } | null>(null);

  // Initialize board cells
  const cells = [];
  for (let row = 9; row >= 0; row--) {
    let rowCells = [];
    for (let col = 1; col <= 10; col++) {
      rowCells.push(row * 10 + col);
    }
    if (row % 2 !== 0) rowCells.reverse();
    cells.push(...rowCells);
  }

  // Socket Listeners
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('joinRoom', { roomId });
    socket.emit('sl2dRequestSync', { roomId });

    socket.on('gameMove', (data: any) => {
      if (data.type === 'roll') {
        setIsRolling(true);
        triggerDiceAnimation(data.roll);
        
        setActionMessage(`${opponentName} is rolling...`);
        
        setTimeout(() => {
          setActionMessage(`${opponentName} rolled a ${data.roll}!`);
        }, 6000);

        setTimeout(() => {
          setIsRolling(false);
          setTargetPositions(prev => ({ ...prev, [opponentId]: data.newPosition }));
          setTurnId(user._id);
        }, 6500); // Wait for dice to land
      }
    });

    socket.on('sl2dEmoteReceived', ({ userId, emote }) => {
      setPlayerEmotes(prev => ({ ...prev, [userId]: emote }));
      setTimeout(() => setPlayerEmotes(prev => ({ ...prev, [userId]: '' })), 3000);
    });

    socket.on('sl2dReadyReceived', ({ userId, color, shape }) => {
      if (userId === opponentId) {
        setOpponentReady(true);
        setOpponentColor(color);
        setOpponentShape(shape);
      }
    });

    socket.on('sl2dRequestSyncReceived', () => {
      if (!customizerRef.current) {
         socket.emit('sl2dGameStateSync', {
            roomId,
            syncData: {
               senderId: user._id,
               targetPositions: positionsRef.current,
               buffs: buffsRef.current,
               turnId: turnRef.current,
               color: tokenColorRef.current,
               shape: tokenShapeRef.current
            }
         });
      }
    });

    socket.on('sl2dGameStateSyncReceived', (syncData: any) => {
      if (syncData.senderId === opponentId) {
         setTargetPositions(prev => {
            const newTargets = { ...prev };
            // Ensure we never move backwards on sync unless it's genuinely a penalty we missed
            // The simplest approach is to just accept their truth for their own token and the largest truth for ours
            if (syncData.targetPositions[opponentId] > newTargets[opponentId]) {
                newTargets[opponentId] = syncData.targetPositions[opponentId];
            }
            if (syncData.targetPositions[user._id] > newTargets[user._id]) {
                newTargets[user._id] = syncData.targetPositions[user._id];
            }
            return newTargets;
         });
         setActiveBuffs(syncData.buffs);
         setTurnId(syncData.turnId);
         setOpponentColor(syncData.color);
         setOpponentShape(syncData.shape);
         setOpponentReady(true);
      }
    });

    const handleSocketCombat = (data: any) => {
      handleCombatAction(data);
    };
    socket.on('sl2dCombatActionReceived', handleSocketCombat);

    return () => {
      socket.off('gameMove');
      socket.off('sl2dEmoteReceived');
      socket.off('sl2dReadyReceived');
      socket.off('sl2dRequestSyncReceived');
      socket.off('sl2dGameStateSyncReceived');
      socket.off('sl2dCombatActionReceived', handleSocketCombat);
    };
  }, [socket, roomId, opponentId, user._id, opponentName]);

  const handleCombatAction = ({ userId, type, targetId, randomDrop }: any) => {
    const isMeAttacker = userId === user._id;
    const attackerName = isMeAttacker ? 'You' : opponentName;

    if (type === 'shield' || type === 'smoke') {
      setActiveBuffs(prev => ({
        ...prev,
        [userId]: { ...prev[userId], [type]: Date.now() + 60000 }
      }));
      setCombatAnim({ type, targetId: userId });
      setTimeout(() => setCombatAnim(null), 3000);
      showBigEvent(`${attackerName} used ${type.toUpperCase()}!`, 'good');
    } else {
      // Attack!
      setCombatAnim({ type, targetId });
      setTimeout(() => setCombatAnim(null), 3000);
      
      const isMeTarget = targetId === user._id;
      const targetName = isMeTarget ? 'You' : opponentName;
      const myBuffs = buffsRef.current[targetId];
      const isProtected = Date.now() < myBuffs.shield || Date.now() < myBuffs.smoke;

      if (type === 'rocket_launcher') {
         showBigEvent(`${attackerName} fired a ROCKET LAUNCHER!`, 'bad');
         setTimeout(() => {
           setTargetPositions(prev => ({ ...prev, [targetId]: 1 }));
           setVisualPositions(prev => ({ ...prev, [targetId]: 1 }));
         }, 1500);
      } else {
         if (isProtected) {
           showBigEvent(`${targetName}'s protection blocked the ${type}!`, 'good');
         } else {
           showBigEvent(`${targetName} ${isMeTarget?'were':'was'} hit by a ${type.toUpperCase()}!`, 'bad');
           setTimeout(() => {
             if (type === 'gun') {
               setTargetPositions(prev => ({ ...prev, [targetId]: 1 }));
               setVisualPositions(prev => ({ ...prev, [targetId]: 1 }));
             } else if (type === 'bomb') {
               setTargetPositions(prev => ({ ...prev, [targetId]: randomDrop }));
               setVisualPositions(prev => ({ ...prev, [targetId]: randomDrop }));
             }
           }, 1500);
         }
      }
    }
  };


  // Step-by-Step Movement Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setVisualPositions(prev => {
        let newPos = { ...prev };
        let hasChanges = false;
        
        for (let pid of Object.keys(newPos)) {
          if (newPos[pid] < targetPositions[pid]) {
             // Moving forward
             newPos[pid] += 1;
             hasChanges = true;
          } else if (newPos[pid] > targetPositions[pid]) {
             // Moving backward (snake)
             newPos[pid] -= 1;
             hasChanges = true;
          }

          // Once we reach the target, check for snakes/ladders/events
          if (newPos[pid] === targetPositions[pid]) {
             checkTileEvents(newPos[pid], pid);
          }
        }
        return hasChanges ? newPos : prev;
      });
    }, 250); // Speed of hops
    return () => clearInterval(interval);
  }, [targetPositions]);

  // Keep track of evaluated targets to prevent infinite loops
  const evaluatedTargets = useRef<Record<string, Set<number>>>({
    [user._id]: new Set(),
    [opponentId]: new Set()
  });

  // Bulletproof Token Sync
  useEffect(() => {
    let syncInterval: ReturnType<typeof setInterval>;
    if (!showCustomizer && !opponentReady) {
      // Keep telling the opponent my shape/color until they confirm
      syncInterval = setInterval(() => {
        socket?.emit('sl2dReady', { roomId, color: tokenColor, shape: tokenShape });
      }, 1000);
    }
    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [showCustomizer, opponentReady, socket, roomId, tokenColor, tokenShape]);

  const checkTileEvents = (pos: number, pid: string) => {
    if (evaluatedTargets.current[pid].has(pos)) return; // Already checked this tile
    evaluatedTargets.current[pid].add(pos);

    setTimeout(() => {
      let finalPos = pos;
      const isMe = pid === user._id;
      const name = isMe ? 'You' : opponentName;

      // Mystery Boxes
      if (MYSTERY_BOXES.includes(pos)) {
        if (isMe) {
          const power = POWERS[Math.floor(Math.random() * POWERS.length)];
          showBigEvent(`Mystery Box! Autocasting: ${power.toUpperCase()}!`, 'good');
          
          setTimeout(() => {
            let targetId = opponentId;
            if (power === 'shield' || power === 'smoke') {
               targetId = user._id;
            }

            let randomDrop = 1;
            if (power === 'bomb') {
               const oppPos = positionsRef.current[opponentId];
               randomDrop = Math.max(1, Math.floor(Math.random() * (oppPos - 1)) + 1);
            }

            const actionData = { type: power, targetId, randomDrop };
            socket?.emit('sl2dCombatAction', { roomId, actionData });
            handleCombatAction({ userId: user._id, ...actionData });
          }, 1500);
        }
      }
      // Special Events
      else if (SPECIAL_EVENTS[pos]) {
        const event = SPECIAL_EVENTS[pos];
        showBigEvent(event.message, 'good');
        setTimeout(() => {
           setTargetPositions(prev => ({ ...prev, [pid]: pos + event.bonus }));
        }, 800);
      }
      // Snakes
      else if (SNAKES[pos]) {
        const myBuffs = buffsRef.current[pid];
        if (Date.now() < myBuffs.shield || Date.now() < myBuffs.smoke) {
           showBigEvent(`${name}'s protection blocked the snake bite!`, 'good');
        } else {
           showBigEvent(`Oh no! ${name} got bitten by a snake!`, 'bad');
           setTimeout(() => {
               setTargetPositions(prev => ({ ...prev, [pid]: SNAKES[pos] }));
               setVisualPositions(prev => ({ ...prev, [pid]: SNAKES[pos] }));
           }, 800);
        }
      } 
      // Ladders
      else if (LADDERS[pos]) {
        showBigEvent(`Awesome! ${name} found a ladder!`, 'good');
        setTimeout(() => {
           setTargetPositions(prev => ({ ...prev, [pid]: LADDERS[pos] }));
           setVisualPositions(prev => ({ ...prev, [pid]: LADDERS[pos] }));
        }, 800);
      }

      // Check win
      if (finalPos >= 100 && !winner) {
         setTargetPositions(prev => ({ ...prev, [pid]: 100 }));
         setVisualPositions(prev => ({ ...prev, [pid]: 100 }));
         setWinner(pid);
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
    }, 300);
  };

  const showBigEvent = (msg: string, type: 'good' | 'bad' | 'neutral') => {
    setBigEvent({ message: msg, type });
    setTimeout(() => setBigEvent(null), 2500);
  };

  const triggerDiceAnimation = (roll: number) => {
    setDiceRotation(prev => {
      const targetFace = diceRotations[roll] || { rotateX: 0, rotateY: 0 };
      const extraSpinsX = (Math.floor(Math.random() * 5) + 15) * 360;
      const extraSpinsY = (Math.floor(Math.random() * 5) + 15) * 360;
      return {
        rotateX: prev.rotateX - (prev.rotateX % 360) + extraSpinsX + targetFace.rotateX,
        rotateY: prev.rotateY - (prev.rotateY % 360) + extraSpinsY + targetFace.rotateY
      };
    });
  };

  const rollDice = () => {
    if (turnId !== user._id || isRolling || winner || showCustomizer || !opponentReady) return;
    
    // Ensure we aren't still moving visually
    if (visualPositions[user._id] !== targetPositions[user._id]) return;

    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    triggerDiceAnimation(roll);
    setActionMessage('Rolling...');

    let currentPos = targetPositions[user._id];
    let newPosition = currentPos + roll;
    let actualNewPosition = newPosition > 100 ? currentPos : newPosition;

    setTimeout(() => {
      if (newPosition > 100) {
        setActionMessage(`You rolled a ${roll}! You need exactly ${100 - currentPos} to win!`);
      } else {
        setActionMessage(`You rolled a ${roll}!`);
      }
    }, 6000);

    socket?.emit('gameMove', {
      roomId,
      moveData: { type: 'roll', roll, newPosition: actualNewPosition, by: user._id }
    });

    setTimeout(() => {
      setIsRolling(false);
      setTargetPositions(prev => ({ ...prev, [user._id]: actualNewPosition }));
      setTurnId(opponentId);
      
      // Auto-sync state after roll finishes to prevent any turn deadlocks
      socket?.emit('sl2dGameStateSync', {
         roomId,
         syncData: {
            senderId: user._id,
            targetPositions: { ...positionsRef.current, [user._id]: actualNewPosition },
            buffs: buffsRef.current,
            turnId: opponentId,
            color: tokenColorRef.current,
            shape: tokenShapeRef.current
         }
      });
    }, 6500);
  };

  const handleEmote = (e: string) => {
    socket?.emit('sl2dEmote', { roomId, emote: e });
    setShowEmoteMenu(false);
  };

  const handleCustomizerComplete = () => {
    setShowCustomizer(false);
    if (opponentReady) {
      setActionMessage(turnId === user._id ? 'Your Turn! Roll the dice.' : `${opponentName}'s Turn.`);
    } else {
      setActionMessage('Waiting for opponent to customize.');
    }
    // Emit once immediately
    socket?.emit('sl2dReady', { roomId, color: tokenColor, shape: tokenShape });
  };

  const isMyTurn = turnId === user._id;

  const diceRotations: Record<number, { rotateX: number, rotateY: number }> = {
    1: { rotateX: 0, rotateY: 0 },
    2: { rotateX: 90, rotateY: 0 },
    3: { rotateX: 0, rotateY: 90 },
    4: { rotateX: 0, rotateY: -90 },
    5: { rotateX: -90, rotateY: 0 },
    6: { rotateX: 180, rotateY: 0 }
  };

  const renderDiceFace = (num: number, transform: string) => {
    const dots = Array.from({ length: num }).map((_, i) => (
      <div key={i} className="w-4 h-4 bg-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
    ));
    let layoutClass = "";
    if (num === 1) layoutClass = "flex items-center justify-center";
    if (num === 2) layoutClass = "flex flex-col justify-between items-center py-2 px-2";
    if (num === 3) layoutClass = "flex flex-col justify-between items-center py-1";
    if (num === 4) layoutClass = "grid grid-cols-2 grid-rows-2 gap-2 place-items-center p-3";
    if (num === 5) layoutClass = "grid grid-cols-2 grid-rows-3 gap-1 place-items-center p-2 [&>*:nth-child(3)]:col-span-2";
    if (num === 6) layoutClass = "grid grid-cols-2 grid-rows-3 gap-2 place-items-center py-3 px-2";

    return (
      <div 
        className={`absolute w-full h-full bg-gradient-to-br from-brand to-purple-600 border-4 border-white/40 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] backface-hidden ${layoutClass}`}
        style={{ transform, backfaceVisibility: 'hidden' }}
      >
        {dots}
      </div>
    );
  };

  // Render Token based on shape
  const renderToken = (colorClass: string, shape: string, isMe: boolean) => {
    const baseClasses = `w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform ${isMe && isMyTurn ? 'animate-bounce' : ''}`;
    
    if (shape === 'star') return <div className={`${baseClasses} text-${colorClass}-400 drop-shadow-[0_0_15px_currentColor]`}><Star fill="currentColor" size={32} /></div>;
    if (shape === 'shield') return <div className={`${baseClasses} text-${colorClass}-500 drop-shadow-[0_0_15px_currentColor]`}><Shield fill="currentColor" size={32} /></div>;
    if (shape === 'crown') return <div className={`${baseClasses} text-${colorClass}-400 drop-shadow-[0_0_15px_currentColor]`}><Crown fill="currentColor" size={32} /></div>;
    
    // Default circle
    return <div className={`${baseClasses} rounded-full bg-${colorClass}-500 border-2 border-white`} />;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-2 sm:gap-6 p-2 sm:p-4 min-h-[calc(100vh-100px)] h-auto lg:h-[calc(100vh-100px)] relative overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {winner && <ReactConfetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Combat Animation Overlay */}
      <AnimatePresence>
        {combatAnim && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
             {combatAnim.type === 'rocket_launcher' && <div className="text-9xl drop-shadow-[0_0_50px_rgba(239,68,68,1)]">🚀💥</div>}
             {combatAnim.type === 'bomb' && <div className="text-9xl drop-shadow-[0_0_50px_rgba(234,179,8,1)]">💣🔥</div>}
             {combatAnim.type === 'gun' && <div className="text-9xl drop-shadow-[0_0_50px_rgba(168,85,247,1)]">🔫🎯</div>}
             {combatAnim.type === 'shield' && <div className="text-9xl drop-shadow-[0_0_50px_rgba(59,130,246,1)]">🛡️✨</div>}
             {combatAnim.type === 'smoke' && <div className="text-9xl drop-shadow-[0_0_50px_rgba(156,163,175,1)]">💨🌫️</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Event Overlay */}
      <AnimatePresence>
        {bigEvent && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 z-50 px-12 py-6 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 backdrop-blur-md ${
              bigEvent.type === 'good' ? 'bg-green-500/80 border-green-300 text-white' :
              bigEvent.type === 'bad' ? 'bg-red-500/80 border-red-300 text-white' :
              'bg-blue-500/80 border-blue-300 text-white'
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase text-center drop-shadow-lg">{bigEvent.message}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customization Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-slate-900 p-8 rounded-3xl border border-brand shadow-2xl max-w-md w-full text-center">
              <h2 className="text-3xl font-black text-white mb-6">Customize Your Token</h2>
              
              <div className="mb-6">
                <h3 className="text-slate-400 mb-2 font-bold">Select Color</h3>
                <div className="flex gap-4 justify-center">
                  {['blue', 'purple', 'emerald', 'rose', 'amber'].map(c => (
                    <button key={c} onClick={() => setTokenColor(c)} className={`w-12 h-12 rounded-full bg-${c}-500 border-4 transition-transform ${tokenColor === c ? 'border-white scale-110 shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-50'}`} />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-slate-400 mb-2 font-bold">Select Shape</h3>
                <div className="flex gap-4 justify-center text-slate-300">
                  {['circle', 'star', 'shield', 'crown'].map(s => (
                    <button key={s} onClick={() => setTokenShape(s)} className={`p-4 rounded-2xl bg-slate-800 border-2 transition-all ${tokenShape === s ? 'border-brand text-brand scale-110 bg-brand/10' : 'border-transparent opacity-50'}`}>
                      {s === 'circle' && <div className="w-8 h-8 rounded-full bg-current" />}
                      {s === 'star' && <Star fill="currentColor" size={32} />}
                      {s === 'shield' && <Shield fill="currentColor" size={32} />}
                      {s === 'crown' && <Crown fill="currentColor" size={32} />}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleCustomizerComplete} className="w-full bg-brand hover:bg-brand-hover text-white font-black text-xl py-4 rounded-xl transition-colors">
                ENTER GAME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Area */}
      <div className="lg:w-1/4 flex flex-col gap-2 sm:gap-4 h-full overflow-y-auto pr-2 shrink-0 min-w-[280px]">
        <button 
          onClick={() => navigate('/games')}
          className="self-start text-xs sm:text-sm font-bold text-slate-400 hover:text-white flex items-center transition-colors bg-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Game
        </button>

        <div className="glass p-3 sm:p-6 rounded-2xl border border-brand/20 shadow-2xl relative neon-border-brand flex flex-col items-center">
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-white text-center flex items-center justify-center">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-brand" />
            Snakes & Ladders
          </h2>

          <div className="flex justify-between items-center bg-black/40 p-2 sm:p-4 rounded-xl mb-3 sm:mb-4 border border-brand/10 w-full">
            <div className={`flex flex-col items-center p-2 sm:p-3 rounded-lg w-[45%] transition-all ${isMyTurn ? 'bg-brand/20 border border-brand/50 shadow-[0_0_15px_rgba(0,112,209,0.3)]' : 'opacity-60'}`}>
              <div className="mb-1 sm:mb-2">{renderToken(tokenColor, tokenShape, true)}</div>
              <span className="font-bold text-white text-sm sm:text-base">You</span>
              <span className="text-[10px] sm:text-xs text-brand-light font-bold">Tile {visualPositions[user._id]}</span>
            </div>
            
            <span className="text-base sm:text-xl font-black text-slate-500">VS</span>
            
            <div className={`flex flex-col items-center p-2 sm:p-3 rounded-lg w-[45%] transition-all ${!isMyTurn ? 'bg-purple-500/20 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'opacity-60'}`}>
              <div className="mb-1 sm:mb-2">{renderToken(opponentColor, opponentShape, false)}</div>
              <span className="font-bold text-white text-sm sm:text-base truncate max-w-full">{opponentName}</span>
              <span className="text-[10px] sm:text-xs text-purple-300 font-bold">Tile {visualPositions[opponentId]}</span>
            </div>
          </div>



          <div className="bg-[#0F172A] p-2 sm:p-4 rounded-xl border border-slate-700 text-center mb-4 sm:mb-6 min-h-[40px] sm:min-h-[60px] flex items-center justify-center w-full">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 text-brand" />
              {actionMessage}
            </span>
          </div>

          {!winner && (
            <div className="flex flex-col items-center py-2 sm:py-4 perspective-1000 w-full">
              <div 
                className="w-32 h-32 mb-4 sm:mb-8 cursor-pointer relative scale-[0.6] sm:scale-100 origin-top"
                onClick={rollDice}
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={diceRotation}
                  transition={{ duration: 6.0, ease: "easeOut" }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {renderDiceFace(1, 'translateZ(64px)')}
                  {renderDiceFace(6, 'rotateY(180deg) translateZ(64px)')}
                  {renderDiceFace(4, 'rotateY(90deg) translateZ(64px)')}
                  {renderDiceFace(3, 'rotateY(-90deg) translateZ(64px)')}
                  {renderDiceFace(5, 'rotateX(90deg) translateZ(64px)')}
                  {renderDiceFace(2, 'rotateX(-90deg) translateZ(64px)')}
                </motion.div>
                {/* Visual indicator when opponent is not ready */}
                {!opponentReady && !showCustomizer && (
                  <div className="absolute -bottom-8 whitespace-nowrap text-xs font-bold text-yellow-400 animate-pulse bg-black/50 px-3 py-1 rounded-full -translate-x-1/2 left-1/2">
                    Waiting for opponent...
                  </div>
                )}
              </div>

              <button
                onClick={rollDice}
                disabled={!isMyTurn || isRolling || visualPositions[user._id] !== targetPositions[user._id] || !opponentReady}
                className={`w-full py-2 sm:py-4 mt-2 sm:mt-0 rounded-xl font-black text-base sm:text-xl transition-all uppercase tracking-widest ${
                  isMyTurn && !isRolling && visualPositions[user._id] === targetPositions[user._id] && opponentReady
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isRolling ? 'Rolling...' : !opponentReady ? 'Waiting...' : isMyTurn ? 'Roll Dice' : 'Opponent Turn'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Board Area */}
      <div className="lg:flex-1 w-full h-full flex flex-col items-center justify-center bg-[#0A0E17] rounded-3xl border border-slate-800 shadow-2xl p-2 sm:p-4 lg:p-8 relative">
        <div 
          className="relative border-8 border-[#1e293b] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-slate-900 w-full aspect-square max-w-[85vh] max-h-[85vh] mx-auto"
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(10, 1fr)'
          }}
        >
          {cells.map((cellNum) => {
            const isLadderStart = Object.keys(LADDERS).includes(cellNum.toString());
            const isSnakeHead = Object.keys(SNAKES).includes(cellNum.toString());
            const hasSpecial = SPECIAL_EVENTS[cellNum];
            
            const baseColor = CELL_COLORS[cellNum % 5];
            
            return (
              <div 
                key={cellNum} 
                className={`relative border border-black/20 flex flex-col items-center justify-center transition-colors ${
                  cellNum === 100 ? 'bg-yellow-500/80 border-yellow-400 shadow-[inset_0_0_30px_rgba(234,179,8,0.6)]' : baseColor
                }`}
              >
                <span className={`absolute top-1 left-1.5 opacity-50 drop-shadow-md text-xs sm:text-sm font-black ${cellNum === 100 ? 'text-yellow-100' : 'text-white'}`}>{cellNum}</span>
                
                {/* Visual markers */}
                {hasSpecial && <span className="absolute top-1 right-1 text-yellow-300 text-sm md:text-xl animate-pulse drop-shadow-[0_0_10px_currentColor]">✨</span>}
                {isLadderStart && <span className="absolute bottom-1 right-1 text-green-400 text-xs sm:text-sm">⬆️</span>}
                {isSnakeHead && <span className="absolute bottom-1 right-1 text-red-400 text-xs sm:text-sm">⬇️</span>}
                
                {/* Tokens overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-1 sm:gap-2 flex-wrap p-1">
                  {/* My Token */}
                  {visualPositions[user._id] === cellNum && (
                    <motion.div layoutId="myTokenLayout" className="z-30 relative shrink-0">
                       {/* Active Buff Aura */}
                       {(now < activeBuffs[user._id].shield || now < activeBuffs[user._id].smoke) && (
                          <div className={`absolute -inset-2 rounded-full animate-pulse ${now < activeBuffs[user._id].shield ? 'bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-gray-400/50 shadow-[0_0_15px_rgba(156,163,175,0.8)]'}`} />
                       )}
                       {renderToken(tokenColor, tokenShape, true)}
                       
                       {/* Emote Bubble */}
                       <AnimatePresence>
                         {playerEmotes[user._id] && playerEmotes[user._id] !== 'ready' && (
                           <motion.div initial={{opacity:0, y:10, scale:0}} animate={{opacity:1, y:-40, scale:1}} exit={{opacity:0, scale:0}} className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl drop-shadow-xl z-50">
                             {playerEmotes[user._id]}
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Opponent Token */}
                  {visualPositions[opponentId] === cellNum && (
                    <motion.div layoutId="oppTokenLayout" className="z-20 relative opacity-90 shrink-0">
                       {/* Active Buff Aura */}
                       {(now < activeBuffs[opponentId].shield || now < activeBuffs[opponentId].smoke) && (
                          <div className={`absolute -inset-2 rounded-full animate-pulse ${now < activeBuffs[opponentId].shield ? 'bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-gray-400/50 shadow-[0_0_15px_rgba(156,163,175,0.8)]'}`} />
                       )}
                       {renderToken(opponentColor, opponentShape, false)}

                       {/* Emote Bubble */}
                       <AnimatePresence>
                         {playerEmotes[opponentId] && playerEmotes[opponentId] !== 'ready' && (
                           <motion.div initial={{opacity:0, y:10, scale:0}} animate={{opacity:1, y:-40, scale:1}} exit={{opacity:0, scale:0}} className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl drop-shadow-xl z-50">
                             {playerEmotes[opponentId]}
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}

          {/* SVG Overlay for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
             {/* MYSTERY BOXES */}
             {MYSTERY_BOXES.map(boxNum => {
               const row = Math.floor((boxNum - 1) / 10);
               const colRaw = (boxNum - 1) % 10;
               const col = row % 2 === 0 ? colRaw : 9 - colRaw;
               const x = col * 10 + 5; const y = (9 - row) * 10 + 5;
               return (
                 <g key={`mbox-${boxNum}`}>
                   <rect x={x - 3.5} y={y - 3.5} width="7" height="7" fill="#8b5cf6" stroke="#d8b4fe" strokeWidth="0.5" rx="1.5" className="animate-pulse" />
                   <text x={x} y={y + 1.2} fontSize="3.5" fill="white" textAnchor="middle" fontWeight="bold">?</text>
                 </g>
               );
             })}

             {/* LADDERS */}
             {Object.entries(LADDERS).map(([startStr, endStr], i) => {
               const startNum = Number(startStr); const endNum = endStr as unknown as number;
               const startRow = Math.floor((startNum - 1) / 10);
               const startColRaw = (startNum - 1) % 10;
               const startCol = startRow % 2 === 0 ? startColRaw : 9 - startColRaw;
               const sx = startCol * 10 + 5; const sy = (9 - startRow) * 10 + 5;

               const endRow = Math.floor((endNum - 1) / 10);
               const endColRaw = (endNum - 1) % 10;
               const endCol = endRow % 2 === 0 ? endColRaw : 9 - endColRaw;
               const ex = endCol * 10 + 5; const ey = (9 - endRow) * 10 + 5;

               const ladderColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
               const lc = ladderColors[i % ladderColors.length];

               return (
                 <g key={`ladder-${i}`}>
                   <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
                   <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={lc} strokeWidth="2.5" strokeDasharray="2 4" strokeLinecap="round" />
                 </g>
               );
             })}

             {/* SNAKES */}
             {Object.entries(SNAKES).map(([headStr, tailStr], i) => {
               const headNum = Number(headStr); const tailNum = tailStr as unknown as number;
               const headRow = Math.floor((headNum - 1) / 10);
               const headColRaw = (headNum - 1) % 10;
               const headCol = headRow % 2 === 0 ? headColRaw : 9 - headColRaw;
               const hx = headCol * 10 + 5; const hy = (9 - headRow) * 10 + 5;

               const tailRow = Math.floor((tailNum - 1) / 10);
               const tailColRaw = (tailNum - 1) % 10;
               const tailCol = tailRow % 2 === 0 ? tailColRaw : 9 - tailColRaw;
               const tx = tailCol * 10 + 5; const ty = (9 - tailRow) * 10 + 5;

               const mx = (hx + tx) / 2; const my = (hy + ty) / 2;
               const offset = i % 2 === 0 ? 15 : -15;
               const cx = mx + offset; 
               const cy = my + offset/2;

               const snakeColors = [
                 { body: '#ef4444', accent: '#991b1b' }, // Red
                 { body: '#10b981', accent: '#047857' }, // Emerald
                 { body: '#8b5cf6', accent: '#5b21b6' }, // Purple
                 { body: '#eab308', accent: '#854d0e' }, // Yellow
                 { body: '#ec4899', accent: '#be185d' }, // Pink
                 { body: '#f97316', accent: '#c2410c' }  // Orange
               ];
               const sc = snakeColors[i % snakeColors.length];

               return (
                 <g key={`snake-${i}`}>
                   {/* Shadow */}
                   <path d={`M ${hx} ${hy} Q ${cx} ${cy} ${tx} ${ty}`} stroke="rgba(0,0,0,0.5)" strokeWidth="4" strokeLinecap="round" fill="none" transform="translate(1, 1)" />
                   {/* Body */}
                   <path d={`M ${hx} ${hy} Q ${cx} ${cy} ${tx} ${ty}`} stroke={sc.body} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                   {/* Accent */}
                   <path d={`M ${hx} ${hy} Q ${cx} ${cy} ${tx} ${ty}`} stroke={sc.accent} strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" fill="none" />
                   
                   {/* Head */}
                   <circle cx={hx} cy={hy} r="3" fill={sc.body} />
                   <circle cx={hx - 1} cy={hy - 0.5} r="0.8" fill="#fff" />
                   <circle cx={hx + 1} cy={hy - 0.5} r="0.8" fill="#fff" />
                   <circle cx={hx - 1} cy={hy - 0.5} r="0.3" fill="#000" />
                   <circle cx={hx + 1} cy={hy - 0.5} r="0.3" fill="#000" />
                   {/* Tongue */}
                   <path d={`M ${hx} ${hy+1.5} L ${hx} ${hy+4}`} stroke="#f87171" strokeWidth="0.5" />
                 </g>
               );
             })}
          </svg>
        </div>
      </div>

      {/* Floating Action Bar (Emotes) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40 lg:bottom-12">
        <div className="relative">
          <button onClick={() => setShowEmoteMenu(!showEmoteMenu)} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-2xl border-2 border-slate-600 transition-transform hover:scale-110 text-2xl">
            😀
          </button>
          <AnimatePresence>
            {showEmoteMenu && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-900 border border-slate-700 p-3 rounded-3xl shadow-2xl grid grid-cols-5 gap-2 w-72">
                {EMOTES.map(e => <button key={e} onClick={() => handleEmote(e)} className="text-3xl hover:bg-slate-700 hover:scale-125 rounded-xl p-2 transition-all">{e}</button>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
