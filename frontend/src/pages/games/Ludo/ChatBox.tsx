import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import { Send, Smile } from 'lucide-react';

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export default function ChatBox({ roomId }: { roomId: string }) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😎', '😡', '🎲', '🏆', '🔥', '👀'];

  useEffect(() => {
    if (!socket) return;
    
    const handleLobbyMessage = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };
    
    socket.on('lobbyMessage', handleLobbyMessage);
    return () => {
      socket.off('lobbyMessage', handleLobbyMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !socket) return;
    
    socket.emit('lobbyMessage', { roomId, message: input.trim() });
    setInput('');
    setShowEmojis(false);
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return (
    <div className="flex flex-col bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 w-full h-64 md:h-full max-h-[400px] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="p-3 border-b border-slate-800 bg-slate-800/50 font-bold text-sm text-slate-300 flex items-center">
        Match Chat
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-xs mt-10">Say hi to your opponent!</div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-slate-500 mb-0.5 px-1">{isMe ? 'You' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              <div className={`px-3 py-1.5 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-slate-800 relative">
        {showEmojis && (
          <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-700 p-2 rounded-xl shadow-xl flex gap-2">
            {emojis.map(e => (
              <button key={e} onClick={() => addEmoji(e)} className="hover:bg-slate-700 p-1 rounded text-lg transition-colors">{e}</button>
            ))}
          </div>
        )}
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-slate-400 hover:text-yellow-400 transition-colors p-1">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200"
          />
          <button type="submit" disabled={!input.trim()} className="text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed p-1">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
