import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationJournals, addManifestationJournal } from '../../api/manifestation';

export default function SuccessJournal() {
  const { user } = useAuth();
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    wentWell: '',
    progressMade: '',
    opportunitiesNoticed: '',
    gratefulFor: ''
  });

  const fetchJournals = async () => {
    try {
      if (!user?.token) return;
      const data = await getManifestationJournals(user.token);
      setJournals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (user?.token) {
        await addManifestationJournal(formData, user.token);
        setFormData({ wentWell: '', progressMade: '', opportunitiesNoticed: '', gratefulFor: '' });
        fetchJournals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col lg:flex-row gap-8">
      {/* Editor Side */}
      <div className="lg:w-1/2">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Success Journal</h1>
          <p className="text-slate-400">Shift your focus to growth, gratitude, and opportunities.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/5">
            <label className="block text-emerald-400 font-bold mb-2 text-lg">What went well today?</label>
            <textarea required name="wentWell" value={formData.wentWell} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={3} placeholder="I successfully..." />
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5">
            <label className="block text-blue-400 font-bold mb-2 text-lg">What progress did I make on my goals?</label>
            <textarea required name="progressMade" value={formData.progressMade} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} placeholder="I took action by..." />
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5">
            <label className="block text-amber-400 font-bold mb-2 text-lg">What opportunities did I notice?</label>
            <textarea required name="opportunitiesNoticed" value={formData.opportunitiesNoticed} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none" rows={3} placeholder="I saw a chance to..." />
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5">
            <label className="block text-pink-400 font-bold mb-2 text-lg">What am I grateful for?</label>
            <textarea required name="gratefulFor" value={formData.gratefulFor} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none" rows={3} placeholder="I am deeply grateful for..." />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {submitting ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Log Journal Entry</>}
          </button>
        </form>
      </div>

      {/* History Side */}
      <div className="lg:w-1/2 mt-12 lg:mt-0">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-400" /> Past Entries
        </h2>
        
        {loading ? (
          <div className="text-slate-400">Loading history...</div>
        ) : journals.length === 0 ? (
          <div className="glass p-8 rounded-2xl border border-white/5 text-center text-slate-400">
            No entries yet. Start writing your success story today!
          </div>
        ) : (
          <div className="space-y-6">
            {journals.map((j) => (
              <motion.div key={j._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border border-white/10">
                <div className="text-slate-400 text-sm font-bold mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(j.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">Went Well</h4>
                    <p className="text-white text-sm bg-slate-900/50 p-3 rounded-lg">{j.wentWell}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Progress</h4>
                    <p className="text-white text-sm bg-slate-900/50 p-3 rounded-lg">{j.progressMade}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase mb-1">Opportunities</h4>
                    <p className="text-white text-sm bg-slate-900/50 p-3 rounded-lg">{j.opportunitiesNoticed}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-pink-400 uppercase mb-1">Gratitude</h4>
                    <p className="text-white text-sm bg-slate-900/50 p-3 rounded-lg">{j.gratefulFor}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}