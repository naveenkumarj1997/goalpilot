import React, { useState } from 'react';
import { BookOpen, TrendingUp, ShieldAlert, BrainCircuit, LineChart, PieChart, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRICULUM = [
  {
    id: 'intro',
    title: '1. What is the Stock Market?',
    icon: <LineChart className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    content: `The stock market is a platform where investors buy and sell shares of publicly traded companies. A share represents a tiny fraction of ownership in that company. When you buy a stock, you are buying a small piece of that business.\n\nPrices fluctuate based on supply and demand. If a company is doing well and making profits, more people want to buy its stock, driving the price up. If it's struggling, people sell, driving the price down.`
  },
  {
    id: 'buy_sell',
    title: '2. How to Buy and Sell',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    content: `To buy or sell stocks, you need a brokerage account (like Robinhood, Fidelity, or Zerodha). \n\nThere are two main types of orders:\n- Market Order: Buys or sells immediately at the current market price.\n- Limit Order: Sets a specific price you are willing to pay or sell at. The trade only happens if the stock reaches your price.\n\nBuy Low, Sell High is the goal, but timing the market perfectly is nearly impossible.`
  },
  {
    id: 'diversification',
    title: '3. Diversification',
    icon: <PieChart className="w-5 h-5" />,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/20',
    content: `Diversification means spreading your investments across different assets (stocks, bonds, real estate) and sectors (tech, healthcare, energy) to reduce risk. \n\nIf you put all your money into one company and it goes bankrupt, you lose everything. But if you invest in 50 different companies, the failure of one won't ruin your portfolio.`
  },
  {
    id: 'etf',
    title: '4. ETFs & Index Funds',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
    content: `Instead of trying to pick individual winning stocks (which is very hard), beginners are often advised to buy ETFs (Exchange Traded Funds) or Index Funds.\n\nAn Index Fund (like the S&P 500) automatically buys a little bit of the 500 largest companies in the US. By buying one share of the ETF, you instantly own a tiny piece of Apple, Microsoft, Google, Amazon, and 496 others!`
  },
  {
    id: 'risk',
    title: '5. Risk vs. Reward',
    icon: <ShieldAlert className="w-5 h-5" />,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    content: `Generally, higher potential returns come with higher risk. \n\n- Crypto and Startups carry immense risk but can yield huge rewards.\n- Tech Stocks are moderately risky but grow fast.\n- Dividend-paying utility companies offer lower returns but much greater stability.\n\nNever invest money you might need in the next 3-5 years.`
  },
  {
    id: 'tech',
    title: '6. Tech Industry Cycles',
    icon: <BrainCircuit className="w-5 h-5" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    content: `The tech industry goes through distinct cycles. During economic booms (low interest rates), tech companies hire aggressively and grow. During downturns (high interest rates), they consolidate and announce layoffs.\n\nCurrently, the shift toward Artificial Intelligence is creating massive demand for machine learning and data processing, completely reshaping the industry.`
  }
];

const LearningCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState(CURRICULUM[0].id);

  const activeContent = CURRICULUM.find(c => c.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <GraduationCap className="w-8 h-8 text-blue-400 mr-3" />
            Learning Center
          </h1>
          <p className="text-slate-400 mt-2">Master the fundamentals of investing and market mechanics.</p>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">Why should I learn this?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The <strong>Learning Center</strong> is designed to take you from a complete beginner to a confident investor. 
            Before you start adding stocks to your Virtual Portfolio or analyzing Breaking News, it's crucial to understand <em>how</em> the market works, <em>why</em> prices move, and <em>what</em> strategies minimize your risk. 
            Read through these lessons chronologically to build a strong foundation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {CURRICULUM.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-slate-800 border-l-4 border-amber-400' : 'hover:bg-slate-800/50 text-slate-400'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <span className={`font-bold ${activeTab === item.id ? 'text-white' : ''}`}>{item.title}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[400px]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${activeContent?.bg} ${activeContent?.color}`}>
                {activeContent?.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-6">{activeContent?.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed">
                  {activeContent?.content}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
