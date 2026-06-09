import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { Columns, ArrowRight, X } from 'lucide-react';

const COLUMNS = [
  { id: 'saved', title: 'Saved Jobs', color: 'bg-slate-700' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-600' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-purple-600' },
  { id: 'offered', title: 'Offer Received', color: 'bg-green-600' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-600' }
];

export default function JobKanban() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStates = async () => {
    try {
      const data = await jobService.getUserJobStates();
      setStates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const moveJob = async (id: string, currentStatus: string, direction: 'forward' | 'backward') => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      const newStatus = COLUMNS[nextIndex].id;
      try {
        await jobService.updateUserJobState(states.find(s => s._id === id).job._id, newStatus);
        fetchStates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeJob = async (id: string) => {
    if (window.confirm('Remove this job from tracker?')) {
      try {
        await jobService.removeUserJobState(id);
        fetchStates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-10 text-white">Loading tracker...</div>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center text-white"><Columns className="w-8 h-8 mr-3 text-purple-500" /> Application Tracker</h1>
        <p className="text-slate-400 mt-2">Track the status of your saved and applied jobs.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col, idx) => {
          const colJobs = states.filter(s => s.status === col.id);
          return (
            <div key={col.id} className="min-w-[300px] w-[300px] bg-slate-800 rounded-xl border border-slate-700 flex flex-col max-h-full">
              <div className={`p-3 rounded-t-xl font-bold flex justify-between items-center ${col.color}`}>
                <span>{col.title}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-sm">{colJobs.length}</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {colJobs.map(state => (
                  <div key={state._id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 shadow relative group">
                    <button 
                      onClick={() => removeJob(state._id)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-white mb-1 pr-6">{state.job.title}</h4>
                    <p className="text-sm text-slate-400 mb-3">{state.job.company}</p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <a href={state.job.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View Post</a>
                      <div className="flex gap-1">
                        {idx > 0 && (
                          <button onClick={() => moveJob(state._id, state.status, 'backward')} className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">
                            <ArrowRight className="w-3 h-3 rotate-180" />
                          </button>
                        )}
                        {idx < COLUMNS.length - 1 && (
                          <button onClick={() => moveJob(state._id, state.status, 'forward')} className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {colJobs.length === 0 && (
                  <div className="text-center text-sm text-slate-500 py-4 italic">No jobs here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
