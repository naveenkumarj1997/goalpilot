import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, UserPlus, Check, X as CloseIcon, MessageCircle, ArrowLeft } from 'lucide-react';

export default function ChatDashboard() {
  const { user } = useAuth();
  const { socket, onlineUsers, fetchUnreadCount, unreadPerUser } = useSocket();
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/friends`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setFriends(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setPendingRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('receivePrivateMessage', (msg: any) => {
        if (activeChat && (msg.sender === activeChat._id || msg.receiver === activeChat._id)) {
          setMessages(prev => [...prev, msg]);
          // Mark as read immediately if chat is open
          socket.emit('markMessagesAsRead', { senderId: msg.sender });
        } else {
          fetchUnreadCount();
        }
      });

      socket.on('receiveFriendRequest', () => {
        fetchRequests();
      });

      socket.on('friendRequestAccepted', () => {
        fetchFriends();
      });

      return () => {
        socket.off('receivePrivateMessage');
        socket.off('receiveFriendRequest');
        socket.off('friendRequestAccepted');
      };
    }
  }, [socket, activeChat]);

  const fetchMessages = async (friendId: string) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/chat/${friendId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMessages(data);
      // Let server know we opened it, so refresh unread
      fetchUnreadCount();
      if (socket) {
         socket.emit('markMessagesAsRead', { senderId: friendId });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectFriend = (friend: any) => {
    setActiveChat(friend);
    fetchMessages(friend._id);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !socket) return;

    const tempMsg = {
      _id: Date.now().toString(),
      sender: user?._id,
      receiver: activeChat._id,
      text: messageInput,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMsg]);
    
    socket.emit('sendPrivateMessage', {
      receiverId: activeChat._id,
      text: messageInput
    });
    
    setMessageInput('');
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/friends/request`, { receiverId }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (socket) {
        socket.emit('sendFriendRequestEvent', { receiverId });
      }
      alert('Friend request sent!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleRequestResponse = async (requestId: string, accept: boolean, senderId: string) => {
    try {
      const endpoint = accept ? 'accept' : 'decline';
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/friends/${endpoint}`, { requestId }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      if (accept && socket) {
        socket.emit('acceptFriendRequestEvent', { senderId });
        fetchFriends();
      }
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-6 animate-slide-up-fade">
      {/* Sidebar / List area */}
      <div className={`w-full md:w-[30%] flex-col gap-6 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Friends List - WhatsApp Style Sidebar */}
        <div className="glass p-4 rounded-2xl flex-1 flex flex-col overflow-hidden neon-border-brand transition-all">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center neon-text-brand pb-3 border-b border-brand/20">
            <MessageCircle className="h-5 w-5 mr-2 text-brand animate-ps-glow rounded-full" /> Chats
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {friends.length === 0 ? (
              <p className="text-sm text-text-secondary italic mt-4 text-center">No friends yet. Add someone from the online list!</p>
            ) : (
              friends.map(friend => {
                const isOnline = onlineUsers.some(u => u.userId === friend._id);
                const isActive = activeChat?._id === friend._id;
                const unreadForFriend = unreadPerUser[friend._id] || 0;
                return (
                  <div 
                    key={friend._id} 
                    onClick={() => handleSelectFriend(friend)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? 'bg-brand/20 border border-brand/50 shadow-[0_0_15px_rgba(0,112,209,0.3)] neon-border-brand scale-[1.02]' 
                        : 'hover:bg-brand/10 border border-transparent hover:border-brand/20 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(0,112,209,0.5)]">
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        {isOnline && <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[#0A0E17] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-semibold truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>{friend.name}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{isOnline ? 'Online' : 'Offline'}</p>
                      </div>
                      {unreadForFriend > 0 && (
                        <div className="shrink-0 bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                          {unreadForFriend > 99 ? '99+' : unreadForFriend}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="glass p-4 rounded-2xl neon-border-gold max-h-48 overflow-y-auto">
            <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider neon-text-gold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              Pending Requests
            </h3>
            <div className="space-y-2">
              {pendingRequests.map(req => (
                <div key={req._id} className="flex items-center justify-between bg-black/20 border border-brand/20 p-2.5 rounded-xl">
                  <span className="text-sm text-text-primary font-medium truncate flex-1">{req.sender.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleRequestResponse(req._id, true, req.sender._id)} className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-colors">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleRequestResponse(req._id, false, req.sender._id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors">
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online Users */}
        <div className="glass p-4 rounded-2xl max-h-64 overflow-y-auto neon-border-violet">
          <h2 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider neon-text-violet">
             Discover Online
          </h2>
          <div className="space-y-2">
            {onlineUsers.filter(u => u.userId !== user?._id).map(onlineUser => {
              const isFriend = friends.some(f => f._id === onlineUser.userId);
              return (
                <div key={onlineUser.userId} className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl border border-transparent hover:border-purple-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                      {onlineUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-text-primary font-medium group-hover:text-purple-300 transition-colors">{onlineUser.username}</span>
                  </div>
                  {!isFriend && (
                    <button 
                      onClick={() => sendFriendRequest(onlineUser.userId)}
                      className="p-1.5 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      title="Add Friend"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
            {onlineUsers.length === 0 && <p className="text-sm text-text-secondary italic text-center py-4">No one else is online right now.</p>}
          </div>
        </div>
      </div>

      {/* Active Chat Area - WhatsApp Style Right Pane */}
      <div className={`flex-1 glass rounded-2xl flex-col overflow-hidden relative neon-border-brand ${!activeChat ? 'hidden md:flex' : 'flex'} w-full`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-brand/20 flex items-center px-4 md:px-6 bg-black/40 backdrop-blur-md z-10 shrink-0">
               <button 
                 onClick={() => setActiveChat(null)}
                 className="mr-3 md:hidden p-2 -ml-2 text-text-secondary hover:text-white rounded-full transition-colors"
               >
                 <ArrowLeft className="w-5 h-5" />
               </button>
               <div className="relative">
                 <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,112,209,0.4)]">
                   {activeChat.name.charAt(0).toUpperCase()}
                 </div>
                 {onlineUsers.some(u => u.userId === activeChat._id) && (
                   <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[#0A0E17] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                 )}
               </div>
               <div className="ml-4">
                  <h3 className="text-lg font-bold text-white tracking-wide">{activeChat.name}</h3>
                  {onlineUsers.some(u => u.userId === activeChat._id) ? (
                    <span className="text-xs text-green-400 font-medium tracking-wider">ONLINE</span>
                  ) : (
                    <span className="text-xs text-text-secondary tracking-wider">OFFLINE</span>
                  )}
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0A0E17]/50 to-brand/5 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-70">
                  <MessageCircle className="h-16 w-16 mb-4 text-brand/50" />
                  <p className="text-lg text-text-primary">Start a conversation with {activeChat.name}</p>
                  <p className="text-xs mt-2 bg-black/40 px-3 py-1 rounded-full border border-brand/20">🔒 Messages disappear at midnight</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender === user?._id;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      key={msg._id || idx} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] px-5 py-3 shadow-md relative group ${
                        isMe 
                          ? 'bg-gradient-to-br from-brand to-brand-hover text-white rounded-2xl rounded-tr-sm shadow-[0_0_15px_rgba(0,112,209,0.3)]' 
                          : 'bg-[#1A2234] text-text-primary rounded-2xl rounded-tl-sm border border-brand/20'
                      }`}>
                        <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                        <span className={`text-[10px] block mt-1.5 font-medium tracking-wide ${isMe ? 'text-brand-light/80 text-right' : 'text-text-secondary'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <Check className="inline-block w-3 h-3 ml-1" />}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Premium Input Bar */}
            <form onSubmit={sendMessage} className="p-5 bg-black/40 backdrop-blur-xl border-t border-brand/20 flex items-center gap-3 shrink-0">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-6 py-4 rounded-full border border-brand/30 bg-[#0F172A]/80 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-white placeholder-text-secondary text-sm transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!messageInput.trim()}
                className="h-14 w-14 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(0,112,209,0.6)]"
              >
                <Send className="h-6 w-6 ml-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0E17]/30">
            <div className="glass p-10 rounded-3xl flex flex-col items-center neon-border-brand max-w-sm text-center">
              <div className="relative">
                <MessageCircle className="h-20 w-20 mb-6 text-brand animate-ps-glow rounded-full" />
                <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-brand border-4 border-[#121826] animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 neon-text-brand">Your Messages</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Select a friend from the sidebar to start a secure, encrypted conversation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
