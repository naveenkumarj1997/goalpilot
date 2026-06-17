import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, MapPin, Building, Calendar, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationProfile, updateManifestationProfile } from '../../api/manifestation';

export default function OpportunityTracker() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Interview',
    title: '',
    company: '',
    status: 'Pending',
    notes: ''
  });

  const fetchProfile = async () => {
    try {
      if (!user?.token) return;
      const data = await getManifestationProfile(user.token);
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.token || !profile) return;
      
      const newOpps = [...(profile.opportunityTracker || []), { ...formData, date: new Date() }];
      await updateManifestationProfile({ opportunityTracker: newOpps }, user.token);
      
      setShowModal(false);
      setFormData({ type: 'Interview', title: '', company: '', status: 'Pending', notes: '' });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const opportunities = profile?.opportunityTracker || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-400';
      case 'Lost': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading Tracker...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white">Opportunity Tracker</h1>
          </div>
          <p className="text-slate-400">Log the synchronicities, job offers, and leads that manifest.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Opportunity
        </button>
      </div>

      {opportunities.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5">
          <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Opportunities Yet</h3>
          <p className="text-slate-400">Keep visualizing and taking action. Opportunities will come!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {opportunities.map((opp: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-colors flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(opp.status)}`}>
                    {opp.status}
                  </span>
                  <span className="text-slate-500 text-sm font-medium bg-slate-900/50 px-2 py-1 rounded">
                    {opp.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{opp.title}</h3>
                {opp.company && (
                  <div className="flex items-center text-indigo-400 text-sm mb-4 font-bold">
                    <Building className="w-4 h-4 mr-1" /> {opp.company}
                  </div>
                )}
                
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                  {opp.notes || "No notes provided."}
                </p>
                
                <div className="flex items-center justify-between text-slate-500 text-xs mt-auto pt-4 border-t border-white/5">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(opp.date).toLocaleDateString()}</span>
                  <button className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center">
                    Edit <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-white mb-6">Log an Opportunity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Type</label>
                <select required value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Interview</option><option>Job Opportunity</option><option>Networking Contact</option><option>Business Lead</option><option>Event</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Title</label>
                <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Call with Google Recruiter" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Company / Organization (Optional)</label>
                <input type="text" value={formData.company} onChange={e=>setFormData({...formData, company: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Google" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Status</label>
                <select required value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Pending</option><option>In Progress</option><option>Completed</option><option>Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Notes</label>
                <textarea value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" rows={3} placeholder="Details about this opportunity..." />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors mt-4">
                Save Opportunity
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}