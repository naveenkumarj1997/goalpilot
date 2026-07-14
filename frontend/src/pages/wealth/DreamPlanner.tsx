import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { createDream, deleteDream, updateDream } from '../../api/wealth';
import { useAuth } from '../../context/AuthContext';
import { Plus, Target, CheckCircle2, Calendar, MapPin, Tag, Lightbulb, Trash2, DollarSign } from 'lucide-react';

export default function DreamPlanner() {
  const { user } = useAuth();
  const { dreams, formatCurrency, refreshWealthData } = useWealth();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetCost: 0,
    targetDate: new Date().toISOString().split('T')[0],
    category: 'Lifestyle',
    priority: 'Medium',
    type: 'Dream'
  });
  const [addFundsId, setAddFundsId] = useState<string | null>(null);
  const [fundsAmount, setFundsAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    try {
      await createDream(formData, user.token);
      await refreshWealthData();
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create dream', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.token) return;
    try {
      await deleteDream(id, user.token);
      await refreshWealthData();
    } catch (err) {
      console.error('Failed to delete dream', err);
    }
  };

  const handleAddFunds = async (id: string, currentAmount: number) => {
    if (!user?.token || !fundsAmount) return;
    try {
      await updateDream(id, { savedAmount: currentAmount + fundsAmount }, user.token);
      await refreshWealthData();
      setAddFundsId(null);
      setFundsAmount(0);
    } catch (err) {
      console.error('Failed to add funds', err);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center">
            <Target className="w-8 h-8 text-emerald-400 mr-3" />
            Dreams & Bucket List
          </h1>
          <p className="text-emerald-500/70 mt-1 font-medium">Design your future, save for your dreams.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center transition-all"
        >
          {isCreating ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> New Dream</>}
        </button>
      </div>

      {isCreating && (
        <div className="glass p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/50">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Porsche 911 or Skydiving"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-1">Target Cost</label>
                <input 
                  type="number" required
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="150000"
                  value={formData.targetCost || ''} onChange={e => setFormData({...formData, targetCost: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-1">Target Date</label>
                <input 
                  type="date" required
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-1">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Essential</option>
                  <option>Important</option>
                  <option>Lifestyle</option>
                  <option>Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-1">Type</label>
                <select 
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Dream">Dream</option>
                  <option value="BucketList">Bucket List</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-1">Description / Why do you want this?</label>
              <textarea 
                className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 min-h-[100px]"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl mt-4">
              Save Goal
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dreams.map(dream => (
          <div key={dream._id} className="glass p-6 rounded-3xl border border-slate-700 relative overflow-hidden group">
            <div className="absolute top-4 right-4 flex space-x-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${dream.type === 'BucketList' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-emerald-400 border-emerald-500/20'}`}>
                {dream.type === 'BucketList' ? 'Bucket List' : 'Dream'}
              </span>
              <button onClick={() => handleDelete(dream._id)} className="p-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 pr-20">{dream.title}</h3>
            
            <div className="flex items-center text-sm text-slate-400 mb-6">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(dream.targetDate).toLocaleDateString()}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-emerald-400">{formatCurrency(dream.savedAmount)}</span>
                <span className="text-sm font-medium text-slate-500">of {formatCurrency(dream.targetCost)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (dream.savedAmount / dream.targetCost) * 100)}%` }}></div>
              </div>
              <p className="text-right text-xs font-bold text-emerald-500">{Math.round((dream.savedAmount / dream.targetCost) * 100)}% Complete</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              {addFundsId === dream._id ? (
                <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                  <input
                    type="number"
                    className="flex-1 bg-slate-800 border border-emerald-500/30 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Amount"
                    value={fundsAmount || ''}
                    onChange={(e) => setFundsAmount(Number(e.target.value))}
                    autoFocus
                  />
                  <button 
                    onClick={() => handleAddFunds(dream._id, dream.savedAmount)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setAddFundsId(null)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAddFundsId(dream._id)}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl flex items-center justify-center transition-all text-sm border border-emerald-500/20"
                >
                  <DollarSign className="w-4 h-4 mr-1" /> Add Funds
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
