import { useEffect, useState } from 'react';
import { getProfile, getLogs } from '../../api/nofap';
import { BarChart2, TrendingUp, Activity, PieChart } from 'lucide-react';
// Note: We might normally use a chart library like Recharts here, but we will build a visual summary for now

export default function NoFapAnalytics() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        if (token) {
          const [profileData, logsData] = await Promise.all([
            getProfile(token),
            getLogs(token)
          ]);
          setProfile(profileData);
          setLogs(logsData);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-b-2 border-brand rounded-full"></div></div>;

  const totalDays = logs.length;
  const successfulDays = logs.filter(l => l.success).length;
  const successRate = totalDays > 0 ? Math.round((successfulDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart2 className="h-8 w-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-text-primary">Progress Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border border-purple-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Success Rate</p>
              <h3 className="text-3xl font-bold text-white mt-1">{successRate}%</h3>
            </div>
            <PieChart className="h-6 w-6 text-purple-500" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-emerald-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Success Days</p>
              <h3 className="text-3xl font-bold text-white mt-1">{profile?.totalSuccessfulDays || 0}</h3>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-red-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Relapses</p>
              <h3 className="text-3xl font-bold text-white mt-1">{profile?.relapseCount || 0}</h3>
            </div>
            <Activity className="h-6 w-6 text-red-500" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-brand/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Current Target</p>
              <h3 className="text-3xl font-bold text-white mt-1">{profile?.targetGoal || 7} Days</h3>
            </div>
            <Target className="h-6 w-6 text-brand" />
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-emerald-100/20 mt-8">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity Trends</h3>
        <div className="flex space-x-2 h-32 items-end">
          {logs.slice(0, 14).reverse().map((log, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div 
                className={`w-full rounded-t-sm transition-all duration-300 ${log.success ? 'bg-emerald-500 hover:bg-emerald-400 h-full' : 'bg-red-500 hover:bg-red-400 h-1/4'}`}
              ></div>
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 border border-gray-700">
                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {log.success ? 'Success' : 'Relapse'}
              </div>
            </div>
          ))}
          {logs.length === 0 && <div className="text-gray-500 w-full text-center pb-10">Not enough data for trend analysis.</div>}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
          <span>Older</span>
          <span>Recent (Last 14 days)</span>
        </div>
      </div>
    </div>
  );
}

// Temporary inline component
function Target(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
