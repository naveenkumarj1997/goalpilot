import React from 'react';
import { Link } from 'react-router-dom';
import { useWealth } from '../../context/WealthContext';
import { ArrowUpRight, TrendingUp, Target, Landmark, Lightbulb, Wallet, CalendarCheck } from 'lucide-react';
import DreamDailyCheckInModal from '../../components/wealth/DreamDailyCheckInModal';

export default function WealthDashboard() {
  const { profile, dreams, isLoading, formatCurrency } = useWealth();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = React.useState(false);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center">
            <Landmark className="w-8 h-8 text-emerald-400 mr-3" />
            Life Wealth & Dream OS
          </h1>
          <p className="text-emerald-500/70 mt-1 font-medium">Turn your dreams into mathematical inevitabilities.</p>
        </div>
        <button 
          onClick={() => setIsCheckInModalOpen(true)}
          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold rounded-xl flex items-center transition-all"
        >
          <CalendarCheck className="w-5 h-5 mr-2" />
          Daily Savings Check-In
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="glass p-6 rounded-3xl border border-emerald-500/10">
          <p className="text-slate-400 font-bold tracking-wider uppercase text-sm mb-2">Total Savings</p>
          <h2 className="text-3xl font-black text-white">{formatCurrency(profile?.currentSavings || 0)}</h2>
        </div>

        <div className="glass p-6 rounded-3xl border border-amber-500/20">
          <p className="text-amber-400/80 font-bold tracking-wider uppercase text-sm mb-2">Active Dreams</p>
          <h2 className="text-3xl font-black text-white">{dreams.filter(d => d.status === 'Active').length}</h2>
        </div>

        <div className="glass p-6 rounded-3xl border border-blue-500/20">
          <p className="text-blue-400/80 font-bold tracking-wider uppercase text-sm mb-2">Financial Health</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-white">{profile?.financialHealthScore || 0}</h2>
            <span className="text-slate-400 mb-1">/100</span>
          </div>
        </div>
      </div>

      {/* Dream Grid placeholder */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-emerald-400" /> Your Top Dreams
        </h2>
        {dreams.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-dashed border-emerald-500/30">
            <Lightbulb className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Dreams Added Yet</h3>
            <p className="text-slate-400 mb-6">Start planning your future by adding a dream.</p>
            <Link to="/wealth/dreams" className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              + Plan New Dream
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dreams.map(dream => (
              <div key={dream._id} className="glass p-6 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h3 className="text-lg font-bold text-white mb-1">{dream.title}</h3>
                <p className="text-emerald-400 font-bold mb-4">{formatCurrency(dream.targetCost)}</p>
                
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2 rounded-full" style={{ width: `${Math.min(100, (dream.savedAmount / dream.targetCost) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{formatCurrency(dream.savedAmount)} saved</span>
                  <span>{Math.round((dream.savedAmount / dream.targetCost) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DreamDailyCheckInModal 
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSuccess={() => {
          localStorage.setItem('lastDreamCheckInDate', new Date().toISOString());
        }}
      />
    </div>
  );
}
