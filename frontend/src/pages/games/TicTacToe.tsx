import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, ArrowLeft, Trophy } from 'lucide-react';

type PlayerSymbol = 'X' | 'O' | null;

export default function TicTacToe() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const state = location.state as any; 
  // { gameType, opponentName, opponentId, iAmStarter }

  const [board, setBoard] = useState<PlayerSymbol[]>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState<boolean>(state?.iAmStarter);
  const [winner, setWinner] = useState<string | null>(null); // 'me', 'opponent', 'draw', null
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);
  
  const mySymbol = state?.iAmStarter ? 'X' : 'O';
  const opSymbol = state?.iAmStarter ? 'O' : 'X';

  useEffect(() => {
    if (!socket || !roomId || !state) {
      navigate('/games');
      return;
    }

    socket.emit('joinRoom', { roomId });

    socket.on('gameMove', ({ index, symbol }) => {
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[index] = symbol;
        checkGameEnd(newBoard); // false means I didn't make this move
        return newBoard;
      });
      setIsMyTurn(true);
    });

    socket.on('rematchRequestedByOpponent', () => {
      // Could show a toast here in the future
    });

    socket.on('rematchStart', () => {
      // Reset game
      setBoard(Array(9).fill(null));
      setWinner(null);
      setWinningLine(null);
      setRematchRequested(false);
      // Swap starter role for fairness
      const newAmIStarter = !state.iAmStarter;
      setIsMyTurn(newAmIStarter);
      state.iAmStarter = newAmIStarter; 
    });

    return () => {
      socket.off('gameMove');
      socket.off('rematchRequestedByOpponent');
      socket.off('rematchStart');
    };
  }, [socket, roomId]);

  const checkGameEnd = (currentBoard: PlayerSymbol[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        const isMyWin = currentBoard[a] === mySymbol;
        setWinner(isMyWin ? 'me' : 'opponent');
        setWinningLine(lines[i]);
        
        // Let the winner record the match to prevent duplicate DB entries
        if (isMyWin && socket) {
          socket.emit('gameEnd', {
            roomId,
            gameType: 'TicTacToe',
            winnerId: user?._id,
            loserId: state.opponentId,
            isDraw: false,
            duration: 0
          });
        }
        return;
      }
    }

    if (!currentBoard.includes(null)) {
      setWinner('draw');
      // If draw, let the original starter record it
      if (state.iAmStarter && socket) {
        socket.emit('gameEnd', {
          roomId,
          gameType: 'TicTacToe',
          winnerId: user?._id,
          loserId: state.opponentId,
          isDraw: true,
          duration: 0
        });
      }
    }
  };

  const handleCellClick = (index: number) => {
    if (!socket || !isMyTurn || winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);
    setIsMyTurn(false);

    socket.emit('gameMove', { roomId, moveData: { index, symbol: mySymbol } });
    
    checkGameEnd(newBoard);
  };

  const requestRematch = () => {
    if (!socket) return;
    setRematchRequested(true);
    socket.emit('rematchRequest', { roomId });
  };

  if (!state) return null;

  return (
    <div className="max-w-4xl mx-auto h-[800px] flex flex-col text-slate-100 bg-slate-900 p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative">
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate('/games')} className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Leave Match
        </button>
      </div>

      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wider">TIC-TAC-TOE</h1>
      </div>

      {/* Players Header */}
      <div className="flex justify-between items-center mb-12 px-10">
        <div className={`flex flex-col items-center ${isMyTurn && !winner ? 'scale-110 opacity-100' : 'opacity-50'} transition-all`}>
          <div className="text-4xl font-black text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">{mySymbol}</div>
          <span className="font-bold">{user?.name} (You)</span>
        </div>
        
        <div className="text-2xl font-bold text-slate-600">VS</div>

        <div className={`flex flex-col items-center ${!isMyTurn && !winner ? 'scale-110 opacity-100' : 'opacity-50'} transition-all`}>
          <div className="text-4xl font-black text-purple-400 mb-2 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">{opSymbol}</div>
          <span className="font-bold">{state.opponentName}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-3 bg-slate-700 p-3 rounded-2xl shadow-xl">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                disabled={!!cell || !!winner || !isMyTurn}
                onClick={() => handleCellClick(idx)}
                className={`w-28 h-28 sm:w-32 sm:h-32 bg-slate-800 rounded-xl text-6xl font-black flex items-center justify-center transition-all
                  ${!cell && isMyTurn && !winner ? 'hover:bg-slate-600 cursor-pointer' : 'cursor-default'}
                  ${isWinningCell ? 'bg-green-500/20 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : ''}
                `}
              >
                {cell && (
                  <span className={`${cell === mySymbol ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]'}`}>
                    {cell}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Over Panel */}
      {winner && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10 animate-fade-in">
          <Trophy className={`w-24 h-24 mb-6 ${winner === 'me' ? 'text-yellow-400' : winner === 'draw' ? 'text-slate-400' : 'text-purple-500'}`} />
          <h2 className="text-5xl font-black mb-2 text-white drop-shadow-lg">
            {winner === 'me' ? 'VICTORY!' : winner === 'opponent' ? 'DEFEAT' : 'DRAW!'}
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            {winner === 'me' ? 'You crushed them.' : winner === 'opponent' ? `${state.opponentName} wins this time.` : 'A hard fought stalemate.'}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/games')}
              className="px-8 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
            >
              Leave
            </button>
            <button 
              onClick={requestRematch}
              disabled={rematchRequested}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${
                rematchRequested 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              }`}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${rematchRequested ? 'animate-spin' : ''}`} />
              {rematchRequested ? 'Waiting...' : 'Rematch'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
