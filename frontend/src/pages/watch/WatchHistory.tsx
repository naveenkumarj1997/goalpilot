import AvatarLoader from '../../components/ui/AvatarLoader';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWatchHistory } from '../../api/watchTogether';
import { History, Clock, Users } from 'lucide-react';

export default function WatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user?.token) {
          const data = await getWatchHistory(user.token);
          if (Array.isArray(data)) {
            setHistory(data);
          } else {
            console.error('Expected array from API but got:', data);
            setHistory([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-8 h-8 text-brand" />
        <h1 className="text-3xl font-bold text-white">Watch History</h1>
      </div>

      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <AvatarLoader />
          </div>
        ) : !Array.isArray(history) || history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 font-medium">No watch history found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 px-4">Room Name</th>
                  <th className="pb-3 px-4">Host</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4">Participants</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record: any) => (
                  <tr key={record._id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{record.roomName}</td>
                    <td className="py-4 px-4 text-slate-300">
                      {record.hostId?._id === user?.id ? 'You' : record.hostId?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-medium text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {record.durationMinutes} min
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {record.participants.length}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
