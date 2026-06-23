import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyRooms } from '../../api/watchTogether';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, Lock, Unlock, PlayCircle } from 'lucide-react';

export default function MyRooms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (user?.token) {
          const data = await getMyRooms(user.token);
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

  const handleJoin = (roomId: string) => {
    navigate(`/watch/room/${roomId}`);
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MonitorPlay className="w-8 h-8 text-brand" />
            My Rooms
          </h1>
          <p className="text-slate-400 mt-1">Manage the rooms you've created.</p>
        </div>
        <button 
          onClick={() => navigate('/watch/create')}
          className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,112,209,0.5)] flex items-center gap-2"
        >
          <PlayCircle className="w-5 h-5" /> Create New Room
        </button>
      </div>

      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        ) : !Array.isArray(rooms) || rooms.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <MonitorPlay className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 font-medium">You haven't created any rooms yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room: any) => (
              <div
                key={room._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-brand/50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white truncate pr-4">{room.name}</h3>
                  {room.type === 'Private' ? (
                    <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : room.type === 'FriendsOnly' ? (
                    <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </div>

                <div className="mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${room.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                    {room.isActive ? 'Active' : 'Ended'}
                  </span>
                </div>

                {room.isActive && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                    <button 
                      onClick={() => handleJoin(room._id)}
                      className="w-full text-center text-sm font-bold text-brand bg-brand/10 py-2 rounded-lg group-hover:bg-brand group-hover:text-white transition-colors"
                    >
                      Re-enter Room
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
