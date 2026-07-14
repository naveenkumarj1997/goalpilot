import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { getAIDreamAdvice } from '../../api/wealth';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIDreamAdvisor() {
  const { user } = useAuth();
  const { dreams, profile } = useWealth();
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const response = await getAIDreamAdvice(user.token);
      setAdvice(response.advice);
    } catch (err) {
      console.error('Failed to get AI advice', err);
      setAdvice('The AI is currently analyzing market conditions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center">
            <BrainCircuit className="w-8 h-8 text-emerald-400 mr-3" />
            AI Dream Advisor
          </h1>
          <p className="text-emerald-500/70 mt-1 font-medium">Your personal Gemini-powered wealth strategist.</p>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl flex items-center transition-all disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {advice ? 'Refresh Strategy' : 'Generate Strategy'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 glass p-6 rounded-3xl border border-emerald-500/20 overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold text-white mb-4">Financial Snapshot</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-sm">Monthly Income</span>
              <p className="text-2xl font-bold text-emerald-400">${profile?.monthlyIncome || 0}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-sm">Monthly Expenses</span>
              <p className="text-2xl font-bold text-red-400">${profile?.monthlyExpenses || 0}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-sm">Current Debt</span>
              <p className="text-2xl font-bold text-red-500">${profile?.totalDebt || 0}</p>
            </div>
            
            <h4 className="font-bold text-white mt-6 pt-4 border-t border-slate-700">Active Dreams ({dreams.length})</h4>
            {dreams.map(d => (
              <div key={d._id} className="text-sm">
                <span className="text-slate-300">{d.title}</span> - <span className="text-emerald-400 font-bold">${d.targetCost}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 glass p-6 md:p-10 rounded-3xl border border-emerald-500/20 overflow-y-auto custom-scrollbar relative">
          {!advice && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-12 h-12 text-emerald-500/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Analyze</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Gemini AI will analyze your income, expenses, and active dreams to create a personalized, mathematical roadmap to success.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-b-4 border-teal-400 rounded-full animate-spin direction-reverse"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-emerald-400 mt-6 font-bold animate-pulse">Consulting the Oracle...</p>
            </div>
          )}

          {advice && !isLoading && (
            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
