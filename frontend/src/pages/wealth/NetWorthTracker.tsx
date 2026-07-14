import React, { useState, useEffect } from 'react';
import { useWealth } from '../../context/WealthContext';
import { getNetWorthHistory } from '../../api/wealth';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Plus, Info } from 'lucide-react';

export default function NetWorthTracker() {
  const { user } = useAuth();
  const { profile, formatCurrency } = useWealth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user?.token) {
      getNetWorthHistory(user.token).then(setHistory).catch(console.error);
    }
  }, [user]);

  // Mock data if empty for demo purposes
  const chartData = history.length > 0 ? history : [
    { date: 'Jan', netWorth: 10000 },
    { date: 'Feb', netWorth: 15000 },
    { date: 'Mar', netWorth: 14000 },
    { date: 'Apr', netWorth: 22000 },
    { date: 'May', netWorth: 30000 },
    { date: 'Jun', netWorth: 45000 },
  ];

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mr-3" />
            Net Worth Tracker
          </h1>
          <p className="text-emerald-500/70 mt-1 font-medium">Watch your wealth compound over time.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center transition-all">
          <Plus className="w-5 h-5 mr-1" /> Log Entry
        </button>
      </div>

      <div className="glass p-8 rounded-3xl border border-emerald-500/20 bg-slate-900/60">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Current Net Worth</p>
            <h2 className="text-5xl font-black text-white">{formatCurrency(profile?.totalAssets - profile?.totalLiabilities || 45000)}</h2>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-400 font-bold flex items-center">
            +15% YTD
          </div>
        </div>

        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#10B981', borderRadius: '12px' }}
                itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorNetWorth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass p-6 rounded-3xl border border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Assets</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-300">Cash & Equivalents</span>
              <span className="text-white font-bold">{formatCurrency(profile?.cash || 10000)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-300">Investments</span>
              <span className="text-white font-bold">{formatCurrency(profile?.investments || 25000)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-300">Real Estate</span>
              <span className="text-white font-bold">{formatCurrency(profile?.property || 15000)}</span>
            </div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-3xl border border-red-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Liabilities</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-300">Credit Cards</span>
              <span className="text-red-400 font-bold">{formatCurrency(profile?.creditCards || 2000)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-300">Loans</span>
              <span className="text-red-400 font-bold">{formatCurrency(profile?.loans || 3000)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
