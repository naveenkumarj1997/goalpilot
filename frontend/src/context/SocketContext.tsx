import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: any[];
  invite: any | null;
  clearInvite: () => void;
  unreadCount: number;
  fetchUnreadCount: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
  invite: null,
  clearInvite: () => {},
  unreadCount: 0,
  fetchUnreadCount: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [invite, setInvite] = useState<any | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.token) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/unread`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUnreadCount(data.total);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (user && user.token) {
      const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`, {
        auth: { token: user.token },
      });

      newSocket.on('connect', () => {
        console.log('Connected to game server');
      });

      newSocket.on('onlineUsers', (users) => {
        // Filter out self
        setOnlineUsers(users.filter((u: any) => u.userId !== user._id));
      });

      newSocket.on('receiveInvite', (data) => {
        setInvite(data);
      });

      newSocket.on('inviteAccepted', (data) => {
        // Automatically navigate to lobby
        setInvite(null);
        navigate(`/games/lobby/${data.roomId}`, { state: { ...data } });
      });

      newSocket.on('inviteRejected', (data) => {
        alert(`${data.rejecterName} declined your game invitation.`);
      });

      newSocket.on('unreadCountUpdate', () => {
        fetchUnreadCount();
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const clearInvite = () => setInvite(null);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, invite, clearInvite, unreadCount, fetchUnreadCount }}>
      {children}
      
      {/* Global Invitation Popup */}
      {invite && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-blue-500/30 w-80 animate-bounce-in">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              {invite.senderName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h4 className="font-bold">Game Invite!</h4>
              <p className="text-sm text-gray-400">
                {invite.senderName} challenged you to {invite.gameType}
                {invite.format && ` (${invite.format === 'single' ? 'Single Round' : invite.format === 'bo3' ? 'Best of 3' : 'Best of 5'})`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button 
              className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm"
              onClick={() => {
                socket?.emit('inviteReply', { senderId: invite.senderId, accept: false });
                setInvite(null);
              }}
            >
              Decline
            </button>
            <button 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium text-sm shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              onClick={() => {
                socket?.emit('inviteReply', { senderId: invite.senderId, accept: true, gameType: invite.gameType, format: invite.format });
                // We don't navigate immediately; we wait for the server's 'inviteAccepted' to get the roomId
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
};
