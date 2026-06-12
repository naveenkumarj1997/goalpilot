import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Send, Users, Activity } from 'lucide-react';

export default function GameLobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const state = location.state as any; // { opponentName, opponentId, gameType }
  
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [amIReady, setAmIReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) {
      navigate('/games');
      return;
    }

    if (socket) {
      socket.emit('joinRoom', { roomId });
    }

    socket.on('lobbyMessage', (msg) => {
      setMessages(prev => [...prev, msg].slice(-50)); // Keep last 50
    });

    socket.on('playerReady', ({ userId }) => {
      if (userId === user?._id) setAmIReady(true);
      else setOpponentReady(true);
    });

    socket.on('gameStart', ({ starterId }) => {
      // Navigate to actual game component based on gameType
      navigate(`/games/play/${roomId}`, { 
        state: { 
          gameType: state?.gameType || 'TicTacToe',
          format: state?.format || 'single',
          opponentName: state?.opponentName,
          opponentId: state?.opponentId,
          iAmStarter: starterId === user?._id
        } 
      });
    });

    return () => {
      socket.off('lobbyMessage');
      socket.off('playerReady');
      socket.off('gameStart');
    };
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('lobbyMessage', { roomId, message: chatInput });
    setChatInput('');
  };

  const handleReady = () => {
    if (!socket || amIReady) return;
    socket.emit('readyUp', { roomId });
  };

  if (!state) return <div className="p-10 text-white">Invalid Room State</div>;

  return (
    <div className="max-w-5xl mx-auto h-[800px] flex flex-col lg:flex-row gap-6 text-slate-100">
      
      {/* Left: Players & Ready */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-slate-900 rounded-2xl border border-blue-500/30 shadow-2xl p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <button onClick={() => navigate('/games')} className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              LEAVE
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          <h2 className="text-xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Match Lobby</h2>
          
          <div className="flex w-full items-center justify-between px-4 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <span className="text-2xl font-bold text-blue-300">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-bold">{user?.name}</span>
              <span className={`text-xs font-bold mt-1 ${amIReady ? 'text-green-400' : 'text-slate-500'}`}>
                {amIReady ? 'READY' : 'Waiting...'}
              </span>
            </div>

            <div className="text-3xl font-black text-slate-600">VS</div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="text-2xl font-bold text-purple-300">{state.opponentName?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-bold">{state.opponentName}</span>
              <span className={`text-xs font-bold mt-1 ${opponentReady ? 'text-green-400' : 'text-slate-500'}`}>
                {opponentReady ? 'READY' : 'Waiting...'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl w-full mb-8 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-slate-300">Game: <span className="text-white font-bold">{state.gameType === 'TicTacToe' ? 'Tic-Tac-Toe' : state.gameType === 'ConnectFour' ? 'Connect Four' : state.gameType === 'Battleship' ? 'Battleship' : state.gameType === 'SnakeAndLadders' ? 'Snakes & Ladders' : state.gameType === 'KartRacer' ? 'Kart Racing 3D' : 'Rock Paper Scissors'}</span></span>
            </div>
            {state.gameType === 'RockPaperScissors' && state.format && (
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-1">
                {state.format === 'single' ? 'Single Round' : state.format === 'bo3' ? 'Best of 3' : 'Best of 5'}
              </span>
            )}
          </div>

          <button 
            onClick={handleReady}
            disabled={amIReady}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              amIReady 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
            }`}
          >
            {amIReady ? 'Waiting for opponent...' : 'READY UP'}
          </button>
        </div>
      </div>

      {/* Right: Chat Room */}
      <div className="lg:w-2/3 bg-slate-900 rounded-2xl border border-slate-700 shadow-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center">
          <Users className="w-5 h-5 mr-2 text-slate-400" />
          <h3 className="font-bold text-slate-300">Room Chat</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
              Say hello to your opponent!
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?._id;
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-bold ${isMe ? 'text-blue-400' : 'text-purple-400'}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendChat} className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
