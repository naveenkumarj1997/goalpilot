import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useWebRTC } from '../../hooks/useWebRTC';
import { endRoom, getRoomById } from '../../api/watchTogether';
import FloatingReactions from '../../components/watch/FloatingReactions';
import { 
  MonitorPlay, Users, MessageCircle, X, 
  PlayCircle, StopCircle, LogOut, ArrowLeft 
} from 'lucide-react';

const REACTIONS = ['😂', '😱', '🔥', '👏', '❤️', '🥳', '🤯'];

export default function WatchRoom() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [initialRoom, setInitialRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (user?.token && id) {
          const roomData = await getRoomById(user.token, id);
          setInitialRoom(roomData);
        }
      } catch (err) {
        console.error('Failed to fetch room', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!initialRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <MonitorPlay className="w-16 h-16 text-red-500 opacity-50" />
        <h2 className="text-xl font-bold text-white">Room not found</h2>
        <p className="text-slate-400">The room might have ended or doesn't exist.</p>
      </div>
    );
  }

  const isHost = initialRoom?.hostId?._id === (user?._id || user?.id) || initialRoom?.hostId === (user?._id || user?.id);

  return <ActiveWatchRoom initialRoom={initialRoom} isHost={isHost} roomId={id!} />;
}

function ActiveWatchRoom({ initialRoom, isHost, roomId }: { initialRoom: any, isHost: boolean, roomId: string }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  
  const [roomInfo, setRoomInfo] = useState<any>({ ...initialRoom, participants: [] });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const actualHostId = initialRoom?.hostId?._id || initialRoom?.hostId;
  
  const { startScreenShare, stopStream, localStream, remoteStream, isStreaming, videoRef } = useWebRTC(roomId, isHost);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on('wt-room-info', (info) => {
      setRoomInfo((prev: any) => ({ ...prev, ...info }));
    });

    socket.on('wt-user-joined', (participant) => {
      setRoomInfo((prev: any) => ({
        ...prev,
        participants: [...(prev?.participants || []), participant]
      }));
      addSystemMessage(`${participant.username} joined the room`);
    });

    socket.on('wt-user-left', (participant) => {
      setRoomInfo((prev: any) => ({
        ...prev,
        participants: prev?.participants.filter((p: any) => p.socketId !== participant.socketId)
      }));
      addSystemMessage(`${participant.username} left the room`);
    });

    socket.on('wt-chat-message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on('wt-room-ended', () => {
      alert('The host has ended this room.');
      navigate('/watch');
    });

    return () => {
      socket.off('wt-room-info');
      socket.off('wt-user-joined');
      socket.off('wt-user-left');
      socket.off('wt-chat-message');
      socket.off('wt-room-ended');
    };
  }, [socket, roomId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (videoRef.current) {
      if (isHost && localStream) {
        videoRef.current.srcObject = localStream;
      } else if (!isHost && remoteStream) {
        videoRef.current.srcObject = remoteStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [localStream, remoteStream, isHost, videoRef]);

  const addSystemMessage = (text: string) => {
    setChatMessages((prev) => [...prev, { system: true, text, timestamp: new Date().toISOString() }]);
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket?.emit('wt-chat-message', { roomId, text: chatInput });
    setChatInput('');
  };

  const sendReaction = (emoji: string) => {
    socket?.emit('wt-reaction', { roomId, emoji });
  };

  const handleEndRoom = async () => {
    if (window.confirm('Are you sure you want to end this room for everyone?')) {
      stopStream();
      try {
        if (user?.token) {
          await endRoom(user.token, roomId, 60);
          socket?.emit('wt-end-room', { roomId });
        }
      } catch (err) {
        console.error('Failed to save history', err);
      }
      navigate('/watch');
    }
  };

  const handleLeave = () => {
    stopStream();
    navigate('/watch');
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 relative">
      <FloatingReactions roomId={roomId} />

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={handleLeave} className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">{roomInfo.name || 'Room'}</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex-shrink-0 hidden sm:inline-block">ID: {roomId.slice(-6)}</span>
              </h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isHost ? (
              <>
                {!isStreaming ? (
                  <button onClick={startScreenShare} className="flex-1 sm:flex-none bg-brand hover:bg-brand-hover text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,112,209,0.3)] transition-all whitespace-nowrap">
                    <PlayCircle className="w-4 h-4" /> <span className="hidden sm:inline">Share Screen</span><span className="sm:hidden">Share</span>
                  </button>
                ) : (
                  <button onClick={stopStream} className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all whitespace-nowrap">
                    <StopCircle className="w-4 h-4" /> <span className="hidden sm:inline">Stop Sharing</span><span className="sm:hidden">Stop</span>
                  </button>
                )}
                <button onClick={handleEndRoom} className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-red-400 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 whitespace-nowrap">
                  <X className="w-4 h-4" /> <span className="hidden sm:inline">End Room</span><span className="sm:hidden">End</span>
                </button>
              </>
            ) : (
              <button onClick={handleLeave} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
                <LogOut className="w-4 h-4" /> Leave Room
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-black rounded-2xl border border-slate-800 overflow-hidden relative group shadow-2xl min-h-[300px]">
          {(!isHost && !isStreaming) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 p-6 text-center">
              <MonitorPlay className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
              <p className="text-slate-400 font-medium">Waiting for Host to start streaming...</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted={isHost} 
              className="w-full h-full object-contain"
            />
          )}

          {/* Reaction Bar (Visible on Hover/Touch) */}
          <div className="absolute bottom-6 inset-x-0 mx-auto px-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex justify-center w-full">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-2xl sm:rounded-full flex flex-wrap justify-center items-center gap-2 sm:gap-3 shadow-2xl max-w-[280px] sm:max-w-none">
              {REACTIONS.map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="text-2xl sm:text-3xl hover:scale-125 hover:-translate-y-2 transition-all duration-200 cursor-pointer p-1 sm:p-2 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Chat & Participants) */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl flex-shrink-0 h-[400px] md:h-auto">
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-slate-400 hover:bg-slate-800/30'}`}
          >
            <MessageCircle className="w-4 h-4" /> Chat
          </button>
          <button 
            onClick={() => setActiveTab('participants')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'participants' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-slate-400 hover:bg-slate-800/30'}`}
          >
            <Users className="w-4 h-4" /> ({roomInfo.participants?.length || 0})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
          {activeTab === 'chat' ? (
            <>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.system ? 'items-center my-2' : ''}`}>
                  {msg.system ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full text-center max-w-[80%]">
                      {msg.text}
                    </span>
                  ) : (
                    <div className={`flex flex-col ${msg.userId === (user?._id || user?.id) ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">{msg.username}</span>
                      <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.userId === (user?._id || user?.id) ? 'bg-brand text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                        <p className="text-sm break-words">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {roomInfo.participants?.map((p: any) => (
                <div key={p.socketId} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold ${p.userId === actualHostId ? 'bg-yellow-500' : 'bg-brand'}`}>
                      {p.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-200 truncate">
                      {p.username} {p.userId === (user?._id || user?.id) && '(You)'}
                    </span>
                  </div>
                  {p.userId === actualHostId && (
                    <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30 flex-shrink-0 ml-2">HOST</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'chat' && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/80">
            <form onSubmit={sendChat} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors min-w-0"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-brand hover:bg-brand-hover text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
