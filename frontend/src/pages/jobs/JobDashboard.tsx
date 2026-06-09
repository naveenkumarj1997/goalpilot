import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { Briefcase, Building2, MapPin, Clock, ExternalLink, BookmarkPlus, Zap } from 'lucide-react';

export default function JobDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filters, setFilters] = useState({ title: '', location: '', company: '' });
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async (jobId: string) => {
    try {
      await jobService.updateUserJobState(jobId, 'saved');
      alert('Job Saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const isNewJob = (dateStr: string) => {
    const hoursDiff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white"><Briefcase className="w-8 h-8 mr-3 text-blue-500" /> Job Discovery</h1>
          <p className="text-slate-400 mt-2">Discover matching jobs scraped automatically from top company portals.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <div className="bg-slate-800 rounded-xl p-6 sticky top-8 border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-white">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                  placeholder="e.g. React"
                  value={filters.title}
                  onChange={e => setFilters({...filters, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                  placeholder="e.g. TCS"
                  value={filters.company}
                  onChange={e => setFilters({...filters, company: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                  placeholder="e.g. Remote"
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                />
              </div>
              <button 
                onClick={fetchJobs}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors mt-2"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Job Feed */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="text-center py-10">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-10 text-center border border-slate-700">
              <p className="text-slate-400">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => {
                const isNew = isNewJob(job.discoveredAt);
                return (
                  <div key={job._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors shadow-lg relative overflow-hidden">
                    {isNew && (
                      <div className="absolute top-4 right-4 flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50 animate-pulse">
                        <Zap className="w-3 h-3 mr-1" /> NEW - Apply Quickly
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-white mb-2 pr-32">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {job.company}</div>
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</div>
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.experience}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center"
                      >
                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                      <button 
                        onClick={() => handleSaveJob(job._id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
