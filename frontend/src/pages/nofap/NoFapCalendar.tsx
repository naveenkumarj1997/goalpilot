import { useEffect, useState } from 'react';
import { getLogs } from '../../api/nofap';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

export default function NoFapCalendar() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        if (token) {
          const data = await getLogs(token);
          setLogs(data);
        }
      } catch (error) {
        console.error('Failed to fetch logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-b-2 border-brand rounded-full"></div></div>;

  // Simple grid for now, could use a real calendar component
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <CalendarIcon className="h-8 w-8 text-emerald-500" />
        <h1 className="text-3xl font-bold text-text-primary">Journey History</h1>
      </div>

      <div className="glass p-6 rounded-2xl border border-emerald-100/20">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Check-ins</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No check-ins yet. Start your journey today!</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <span className="text-text-primary font-medium">
                  {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex items-center">
                  {log.success ? (
                    <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-500/20">
                      <CheckCircle className="h-4 w-4 mr-1" /> Success
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/20">
                      <XCircle className="h-4 w-4 mr-1" /> Relapse
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
