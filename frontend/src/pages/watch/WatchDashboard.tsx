import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPublicRooms } from '../../api/watchTogether';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, Users, Lock, Unlock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatchDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (user?.token) {
          const data = await getPublicRooms(user.token);
          if (Array.isArray(data)) {
            setRooms(data);
          } else {
            console.error('Expected array from API but got:', data);
            setRooms([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [user]);

  const handleJoin = (roomId: string, type: string) => {
    if (type === 'Private') {
      const pwd = prompt('Enter Room Password:');
      if (pwd === null) return;
      navigate(`/watch/room/${roomId}?pwd=${pwd}`);
    } else {
      navigate(`/watch/room/${roomId}`);
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MonitorPlay className="w-8 h-8 text-brand" />
            Watch Together
          </h1>
          <p className="text-slate-400 mt-1">Stream directly with friends in real-time.</p>
        </div>
        <button 
          onClick={() => navigate('/watch/create')}
          className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,112,209,0.5)] flex items-center gap-2"
        >
          <PlayCircle className="w-5 h-5" /> Create Room
        </button>
      </div>

      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-6">Active Public Rooms</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        ) : !Array.isArray(rooms) || rooms.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <MonitorPlay className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 font-medium">No active public rooms right now.</p>
            <button 
              onClick={() => navigate('/watch/create')}
              className="mt-4 text-brand hover:text-brand-light font-bold"
            >
              Be the first to create one!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={room._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-brand/50 transition-colors group cursor-pointer"
                onClick={() => handleJoin(room._id, room.type)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white truncate pr-4">{room.name}</h3>
                  {room.type === 'Private' ? (
                    <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-brand text-[10px] font-bold">
                    {room.hostId.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{room.hostId.name}</span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Users className="w-4 h-4 text-blue-400" />
                    {room.participants.length} / {room.maxUsers}
                  </div>
                  <button className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg group-hover:bg-brand group-hover:text-white transition-colors">
                    Join Room
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
