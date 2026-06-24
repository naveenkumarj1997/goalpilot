import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMarketOverview } from '../../api/market';
import { Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketOverview: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    if (user?.token) {
      setLoading(true);
      getMarketOverview(user.token)
        .then(data => setOverview(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Activity className="w-8 h-8 text-blue-400 mr-3" />
            Market Overview
          </h1>
          <p className="text-slate-400 mt-2">Live prices for major indices and top tech stocks.</p>
        </div>
        <button 
          onClick={fetchOverview}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Prices
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">What is this section?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The <strong>Market Overview</strong> provides a real-time snapshot of the stock market's overall health. 
            By tracking major indices like the S&P 500 (^GSPC) and NASDAQ (^IXIC), you can quickly gauge if the market is having a good (green) or bad (red) day. 
            You can use this to spot broader economic trends before making individual investment decisions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Activity className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Change</th>
                <th className="px-6 py-4">% Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {overview.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Unable to fetch market data at this time.
                  </td>
                </tr>
              ) : (
                overview.map((idxData, i) => {
                  const isPositive = idxData.change >= 0;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={idxData.symbol} 
                      className="hover:bg-slate-800/20"
                    >
                      <td className="px-6 py-4 font-bold text-white">{idxData.symbol}</td>
                      <td className="px-6 py-4 text-slate-400">{idxData.name}</td>
                      <td className="px-6 py-4 font-bold text-white">{idxData.price?.toFixed(2)}</td>
                      <td className={`px-6 py-4 font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? '+' : ''}{idxData.change?.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{idxData.changePercent?.toFixed(2)}%
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketOverview;
