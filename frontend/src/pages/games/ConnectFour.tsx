import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, ArrowLeft, Trophy } from 'lucide-react';

const ROWS = 6;
const COLS = 7;
type PlayerColor = 'RED' | 'YELLOW' | null;

export default function ConnectFour() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const state = location.state as any; 

  // Initialize empty board
  const [board, setBoard] = useState<PlayerColor[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  
  const [isMyTurn, setIsMyTurn] = useState<boolean>(state?.iAmStarter);
  const [winner, setWinner] = useState<string | null>(null); 
  const [winningCells, setWinningCells] = useState<{r: number, c: number}[]>([]);
  const [rematchRequested, setRematchRequested] = useState(false);
  
  const myColor: PlayerColor = state?.iAmStarter ? 'RED' : 'YELLOW';
  const opColor: PlayerColor = state?.iAmStarter ? 'YELLOW' : 'RED';

  useEffect(() => {
    if (!socket || !roomId || !state) {
      navigate('/games');
      return;
    }

    socket.emit('joinRoom', { roomId });

    socket.on('gameMove', ({ row, col, color }) => {
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[row][col] = color;
        checkGameEnd(newBoard, row, col, color);
        return newBoard;
      });
      setIsMyTurn(true);
    });

    socket.on('rematchRequestedByOpponent', () => {
      // Could show a toast here in the future
    });

    socket.on('rematchStart', () => {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
      setWinner(null);
      setWinningCells([]);
      setRematchRequested(false);
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

  const checkGameEnd = (currentBoard: PlayerColor[][], r: number, c: number, color: PlayerColor) => {
    // Check directions: Horizontal, Vertical, Diagonal 1, Diagonal 2
    const directions = [
      [[0, 1], [0, -1]],   // Horizontal
      [[1, 0], [-1, 0]],   // Vertical
      [[1, 1], [-1, -1]],  // Diagonal \
      [[1, -1], [-1, 1]]   // Diagonal /
    ];

    let won = false;
    let winCells: {r: number, c: number}[] = [];

    for (let d of directions) {
      let count = 1;
      let cells = [{r, c}];
      
      for (let dir of d) {
        let dr = r + dir[0];
        let dc = c + dir[1];
        while (dr >= 0 && dr < ROWS && dc >= 0 && dc < COLS && currentBoard[dr][dc] === color) {
          count++;
          cells.push({r: dr, c: dc});
          dr += dir[0];
          dc += dir[1];
        }
      }

      if (count >= 4) {
        won = true;
        winCells = cells;
        break;
      }
    }

    if (won) {
      const isMyWin = color === myColor;
      setWinner(isMyWin ? 'me' : 'opponent');
      setWinningCells(winCells);
      
      if (isMyWin && socket) {
        socket.emit('gameEnd', {
          roomId, gameType: 'ConnectFour', winnerId: user?._id, loserId: state.opponentId, isDraw: false, duration: 0
        });
      }
      return;
    }

    // Check draw
    const isDraw = currentBoard[0].every(cell => cell !== null);
    if (isDraw) {
      setWinner('draw');
      if (state.iAmStarter && socket) {
        socket.emit('gameEnd', {
          roomId, gameType: 'ConnectFour', winnerId: user?._id, loserId: state.opponentId, isDraw: true, duration: 0
        });
      }
    }
  };

  const handleColumnClick = (colIndex: number) => {
    if (!socket || !isMyTurn || winner) return;

    // Find lowest empty row in this column
    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][colIndex] === null) {
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) return; // Column full

    const newBoard = board.map(r => [...r]);
    newBoard[rowIndex][colIndex] = myColor;
    setBoard(newBoard);
    setIsMyTurn(false);

    socket.emit('gameMove', { roomId, moveData: { row: rowIndex, col: colIndex, color: myColor } });
    
    checkGameEnd(newBoard, rowIndex, colIndex, myColor);
  };

  const requestRematch = () => {
    if (!socket) return;
    setRematchRequested(true);
    socket.emit('rematchRequest', { roomId });
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[600px] md:h-[800px] flex flex-col text-slate-100 bg-slate-900 p-4 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative">
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate('/games')} className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Leave Match
        </button>
      </div>

      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 tracking-wider">CONNECT FOUR</h1>
      </div>

      {/* Players Header */}
      <div className="flex justify-between items-center mb-10 px-10">
        <div className={`flex flex-col items-center ${isMyTurn && !winner ? 'scale-110 opacity-100' : 'opacity-50'} transition-all`}>
          <div className={`w-12 h-12 rounded-full mb-2 border-4 ${myColor === 'RED' ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-yellow-400 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]'}`} />
          <span className="font-bold">{user?.name} (You)</span>
        </div>
        
        <div className="text-2xl font-bold text-slate-600">VS</div>

        <div className={`flex flex-col items-center ${!isMyTurn && !winner ? 'scale-110 opacity-100' : 'opacity-50'} transition-all`}>
          <div className={`w-12 h-12 rounded-full mb-2 border-4 ${opColor === 'RED' ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-yellow-400 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]'}`} />
          <span className="font-bold">{state.opponentName}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-blue-600 p-1 sm:p-3 pb-2 sm:pb-4 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] border-b-4 sm:border-b-8 border-blue-800">
          <div className="flex gap-2">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`flex flex-col gap-2 p-1 rounded-full transition-colors ${isMyTurn && !winner && board[0][colIndex] === null ? 'hover:bg-blue-500 cursor-pointer' : ''}`}
                onClick={() => handleColumnClick(colIndex)}
              >
                {Array.from({ length: ROWS }).map((_, rowIndex) => {
                  const cell = board[rowIndex][colIndex];
                  const isWinningCell = winningCells.some(c => c.r === rowIndex && c.c === colIndex);
                  
                  return (
                    <div 
                      key={rowIndex} 
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border-[3px] border-blue-700 bg-slate-900 transition-all flex items-center justify-center
                        ${isWinningCell ? 'ring-4 ring-white ring-offset-2 ring-offset-blue-600 animate-pulse' : ''}
                      `}
                    >
                      {cell && (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full shadow-inner ${cell === 'RED' ? 'bg-red-500 shadow-red-700' : 'bg-yellow-400 shadow-yellow-600'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Panel */}
      {winner && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10 animate-fade-in">
          <Trophy className={`w-24 h-24 mb-6 ${winner === 'me' ? 'text-yellow-400' : winner === 'draw' ? 'text-slate-400' : 'text-blue-500'}`} />
          <h2 className="text-5xl font-black mb-2 text-white drop-shadow-lg">
            {winner === 'me' ? 'VICTORY!' : winner === 'opponent' ? 'DEFEAT' : 'DRAW!'}
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            {winner === 'me' ? 'You connected four.' : winner === 'opponent' ? `${state.opponentName} outsmarted you.` : 'The board is full.'}
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
