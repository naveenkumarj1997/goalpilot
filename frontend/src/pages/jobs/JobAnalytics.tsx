import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { BarChart3, TrendingUp, Building, Briefcase } from 'lucide-react';

export default function JobAnalytics() {
  const [stats, setStats] = useState({
    jobsFoundToday: 0,
    totalJobs: 0,
    companiesCount: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await jobService.getAnalytics();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center text-white"><BarChart3 className="w-8 h-8 mr-3 text-blue-500" /> Discovery Analytics</h1>
        <p className="text-slate-400 mt-2">Insights from the job scraping engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <div className="bg-blue-500/20 p-4 rounded-lg mr-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Found Today</p>
            <p className="text-3xl font-black text-white">{stats.jobsFoundToday}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <div className="bg-purple-500/20 p-4 rounded-lg mr-4">
            <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Scraped Jobs</p>
            <p className="text-3xl font-black text-white">{stats.totalJobs}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <div className="bg-green-500/20 p-4 rounded-lg mr-4">
            <Building className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Sources</p>
            <p className="text-3xl font-black text-white">{stats.companiesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
