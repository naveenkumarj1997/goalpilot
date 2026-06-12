import { useState, useEffect } from 'react';
import { workoutApi } from '../../api/workoutApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Weight } from 'lucide-react';
import { format } from 'date-fns';

export default function BodyTracker() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ weight: '', chest: '', waist: '', arms: '', legs: '' });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = () => {
    workoutApi.getBodyMetrics()
      .then(res => {
        const formatted = res.data.map((m: any) => ({
          ...m,
          dateStr: format(new Date(m.date), 'MMM dd')
        }));
        setMetrics(formatted);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await workoutApi.addBodyMetric(formData);
      setShowModal(false);
      fetchMetrics();
      setFormData({ weight: '', chest: '', waist: '', arms: '', legs: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading metrics...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Body Transformation</h1>
          <p className="text-slate-400 mt-1">Track your progress over time.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold flex items-center shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Log
        </button>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl mb-8 h-96">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center"><Weight className="mr-3 text-emerald-400" /> Weight Tracking (kg)</h2>
        {metrics.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="dateStr" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} width={40} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-medium">No data yet. Add your first log!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">New Body Log</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weight (kg) *</label>
                <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Chest (cm)</label>
                  <input type="number" step="0.1" value={formData.chest} onChange={e => setFormData({...formData, chest: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Waist (cm)</label>
                  <input type="number" step="0.1" value={formData.waist} onChange={e => setFormData({...formData, waist: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Arms (cm)</label>
                  <input type="number" step="0.1" value={formData.arms} onChange={e => setFormData({...formData, arms: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Legs (cm)</label>
                  <input type="number" step="0.1" value={formData.legs} onChange={e => setFormData({...formData, legs: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-colors shadow-lg">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
