import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, Sliders, TrendingUp } from 'lucide-react';

export default function FinancialForecast() {
  const { profile, formatCurrency } = useWealth();
  
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(3);
  const [yearsToForecast, setYearsToForecast] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(profile?.monthlyIncome - profile?.monthlyExpenses || 500);

  const generateForecastData = () => {
    const data = [];
    let currentWealth = (profile?.totalAssets - profile?.totalLiabilities) || 10000;
    const realReturn = (expectedReturn - inflationRate) / 100;
    
    for (let year = 0; year <= yearsToForecast; year++) {
      data.push({
        year: `Year ${year}`,
        netWorth: Math.round(currentWealth),
        contributions: Math.round(currentWealth * 0.4) // arbitrary for visual demo
      });
      currentWealth = (currentWealth + (monthlyContribution * 12)) * (1 + realReturn);
    }
    return data;
  };

  const chartData = generateForecastData();

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12 h-full flex flex-col">
      <div className="shrink-0">
        <h1 className="text-4xl font-black text-white flex items-center">
          <Calculator className="w-8 h-8 text-emerald-400 mr-3" />
          Financial Forecast & Simulator
        </h1>
        <p className="text-emerald-500/70 mt-1 font-medium">Model your financial future using compound interest.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <div className="w-full lg:w-1/3 glass p-6 rounded-3xl border border-emerald-500/20 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center mb-6">
            <Sliders className="w-5 h-5 mr-2 text-emerald-400" /> Parameters
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-emerald-400">Monthly Investment</label>
                <span className="text-white font-bold">{formatCurrency(monthlyContribution)}</span>
              </div>
              <input 
                type="range" min="0" max="10000" step="100"
                className="w-full accent-emerald-500"
                value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-emerald-400">Expected Annual Return</label>
                <span className="text-white font-bold">{expectedReturn}%</span>
              </div>
              <input 
                type="range" min="1" max="15" step="0.5"
                className="w-full accent-emerald-500"
                value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-emerald-400">Inflation Rate</label>
                <span className="text-white font-bold">{inflationRate}%</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.5"
                className="w-full accent-red-500"
                value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-emerald-400">Years to Forecast</label>
                <span className="text-white font-bold">{yearsToForecast} Years</span>
              </div>
              <input 
                type="range" min="5" max="40" step="1"
                className="w-full accent-blue-500"
                value={yearsToForecast} onChange={(e) => setYearsToForecast(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <p className="text-sm text-slate-300">Projected Value in {yearsToForecast} years:</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {formatCurrency(chartData[chartData.length - 1].netWorth)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 glass p-6 rounded-3xl border border-emerald-500/20 flex flex-col">
          <h3 className="text-xl font-bold text-white flex items-center mb-6">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Wealth Projection
          </h3>
          <div className="flex-1 min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94A3B8" tickLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#10B981', borderRadius: '12px' }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="netWorth" name="Projected Net Worth" stroke="#10B981" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
