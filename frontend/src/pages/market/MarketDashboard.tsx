import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMarketOverview } from '../../api/market';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      getMarketOverview(user.token)
        .then(data => setOverview(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Calculate mock fear/greed based on S&P500
  const sp500 = overview.find(o => o.symbol === '^GSPC');
  const marketSentiment = sp500 ? (sp500.changePercent > 0 ? 'Greed' : 'Fear') : 'Neutral';
  const sentimentScore = sp500 ? Math.min(100, Math.max(0, 50 + (sp500.changePercent * 20))) : 50;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Disclaimer */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-bold text-sm">Educational Purposes Only</h3>
          <p className="text-red-300/80 text-xs mt-1">
            GoalPilot is NOT a financial advisor. The data, analysis, and AI insights provided here are strictly for educational and informational purposes. Do not make investment decisions based on this platform.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
          Market Intelligence Hub
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Track global markets, manage virtual portfolios, and stay ahead with AI-powered news analysis.
        </p>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-start max-w-4xl">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold mb-1">Welcome to the Market Intelligence Hub!</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              This module is designed to give you a complete, risk-free environment to learn about finance and global markets. 
              Here you can <strong>read breaking news</strong> with automatic sentiment analysis, <strong>track real-time market prices</strong>, 
              <strong>practice trading</strong> with virtual money, and study the <strong>basics of investing</strong>. 
              <br/><br/>
              <em>Disclaimer: This platform is purely for educational purposes and does not provide financial advice or guarantee any returns.</em>
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Activity className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sentiment Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-slate-400 font-bold text-sm mb-4 uppercase tracking-wider">Market Sentiment</h3>
            <div className="text-5xl font-black mb-2" style={{ color: marketSentiment === 'Greed' ? '#34d399' : marketSentiment === 'Fear' ? '#f87171' : '#94a3b8' }}>
              {Math.round(sentimentScore)}
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${marketSentiment === 'Greed' ? 'bg-emerald-500/20 text-emerald-400' : marketSentiment === 'Fear' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
              {marketSentiment.toUpperCase()}
            </div>
          </div>

          {/* Indices */}
          {overview.map((idxData, i) => {
            const isPositive = idxData.change >= 0;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={idxData.symbol}
                className={`bg-slate-900 border ${isPositive ? 'border-emerald-500/20' : 'border-red-500/20'} rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-800/80 transition-colors`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{idxData.name}</h3>
                    <p className="text-slate-500 text-xs">{idxData.symbol}</p>
                  </div>
                  {isPositive ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-black text-white">{idxData.price?.toFixed(2)}</span>
                  <div className={`flex flex-col pb-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className="text-sm font-bold">{isPositive ? '+' : ''}{idxData.change?.toFixed(2)}</span>
                    <span className="text-xs font-medium">{isPositive ? '+' : ''}{idxData.changePercent?.toFixed(2)}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketDashboard;
