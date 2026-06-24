import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVirtualPortfolio, addPortfolioItem } from '../../api/market';
import { Briefcase, Plus, ShieldAlert } from 'lucide-react';

const VirtualPortfolioUI: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ ticker: '', companyName: '', buyPrice: '', quantity: '' });

  useEffect(() => {
    if (user?.token) fetchPortfolio();
  }, [user]);

  const fetchPortfolio = async () => {
    if (!user?.token) return;
    try {
      const data = await getVirtualPortfolio(user.token);
      setPortfolio(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    try {
      await addPortfolioItem(user.token, {
        ticker: formData.ticker,
        companyName: formData.companyName,
        buyPrice: Number(formData.buyPrice),
        quantity: Number(formData.quantity)
      });
      setShowAdd(false);
      setFormData({ ticker: '', companyName: '', buyPrice: '', quantity: '' });
      fetchPortfolio();
    } catch (err) {
      alert('Failed to add. Make sure the ticker is valid on Yahoo Finance.');
    }
  };

  const totalValue = portfolio.reduce((acc, p) => acc + (p.currentValue || 0), 0);
  const totalCost = portfolio.reduce((acc, p) => acc + (p.buyPrice * p.quantity), 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Disclaimer */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-bold text-sm">Educational Virtual Portfolio</h3>
          <p className="text-red-300/80 text-xs mt-1">
            This is a simulated paper-trading portfolio for educational tracking only. No real money is involved. 
          </p>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">What is a Virtual Portfolio?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The <strong>Virtual Portfolio</strong> is a risk-free environment where you can practice trading stocks without using real money. 
            You can add stocks you're interested in, log the hypothetical price you "bought" them at, and track how much profit or loss you would have made in the real world. 
            It's the perfect way to test your trading strategies before putting real capital on the line.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Briefcase className="w-8 h-8 text-indigo-400 mr-3" />
            Virtual Portfolio
          </h1>
          <p className="text-slate-400 mt-2">Track educational investments risk-free.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Position
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Add Virtual Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Ticker (e.g. AAPL)" required className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white uppercase" value={formData.ticker} onChange={e => setFormData({...formData, ticker: e.target.value})} />
            <input type="text" placeholder="Company Name" required className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
            <input type="number" step="0.01" placeholder="Buy Price ($)" required className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: e.target.value})} />
            <input type="number" placeholder="Quantity" required className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-400 hover:text-white mr-4">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold">Save Position</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Briefcase className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Total Value</h3>
              <div className="text-4xl font-black text-white">${totalValue.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Total Cost</h3>
              <div className="text-4xl font-black text-slate-300">${totalCost.toFixed(2)}</div>
            </div>
            <div className={`bg-slate-900 border rounded-2xl p-6 ${totalPL >= 0 ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Total P/L</h3>
              <div className={`text-4xl font-black ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Avg Cost</th>
                  <th className="px-6 py-4">Current Price</th>
                  <th className="px-6 py-4">Total Value</th>
                  <th className="px-6 py-4">P/L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {portfolio.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No positions. Add one above!</td></tr>
                ) : (
                  portfolio.map(p => {
                    const isPositive = p.profitOrLoss >= 0;
                    return (
                      <tr key={p._id} className="hover:bg-slate-800/20">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white uppercase">{p.ticker}</div>
                          <div className="text-xs text-slate-500">{p.companyName}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">{p.quantity}</td>
                        <td className="px-6 py-4">${p.buyPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">${p.currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold text-white">${p.currentValue.toFixed(2)}</td>
                        <td className={`px-6 py-4 font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}${p.profitOrLoss.toFixed(2)} <br/>
                          <span className="text-xs">({p.profitOrLossPercent.toFixed(2)}%)</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default VirtualPortfolioUI;
