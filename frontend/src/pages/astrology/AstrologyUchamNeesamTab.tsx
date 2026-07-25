import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import SouthIndianChart from './components/SouthIndianChart';

export default function AstrologyUchamNeesamTab() {
  const [selectedLagnam, setSelectedLagnam] = useState<number>(1);

  const signs = [
    'மேஷம் (Aries)', 'ரிஷபம் (Taurus)', 'மிதுனம் (Gemini)', 'கடகம் (Cancer)',
    'சிம்மம் (Leo)', 'கன்னி (Virgo)', 'துலாம் (Libra)', 'விருச்சிகம் (Scorpio)',
    'தனுசு (Sagittarius)', 'மகரம் (Capricorn)', 'கும்பம் (Aquarius)', 'மீனம் (Pisces)'
  ];

  const lagnadipathis = [
    { sign: 1, lord: 'Mars', lordTamil: 'செவ்வாய் (Mars)', ucham: 10, neesam: 4 },
    { sign: 2, lord: 'Venus', lordTamil: 'சுக்கிரன் (Venus)', ucham: 12, neesam: 6 },
    { sign: 3, lord: 'Mercury', lordTamil: 'புதன் (Mercury)', ucham: 6, neesam: 12 },
    { sign: 4, lord: 'Moon', lordTamil: 'சந்திரன் (Moon)', ucham: 2, neesam: 8 },
    { sign: 5, lord: 'Sun', lordTamil: 'சூரியன் (Sun)', ucham: 1, neesam: 7 },
    { sign: 6, lord: 'Mercury', lordTamil: 'புதன் (Mercury)', ucham: 6, neesam: 12 },
    { sign: 7, lord: 'Venus', lordTamil: 'சுக்கிரன் (Venus)', ucham: 12, neesam: 6 },
    { sign: 8, lord: 'Mars', lordTamil: 'செவ்வாய் (Mars)', ucham: 10, neesam: 4 },
    { sign: 9, lord: 'Jupiter', lordTamil: 'குரு (Jupiter)', ucham: 4, neesam: 10 },
    { sign: 10, lord: 'Saturn', lordTamil: 'சனி (Saturn)', ucham: 7, neesam: 1 },
    { sign: 11, lord: 'Saturn', lordTamil: 'சனி (Saturn)', ucham: 7, neesam: 1 },
    { sign: 12, lord: 'Jupiter', lordTamil: 'குரு (Jupiter)', ucham: 4, neesam: 10 },
  ];

  const currentLagnaData = lagnadipathis.find(l => l.sign === selectedLagnam)!;

  const chartPlanets = [
    { name: currentLagnaData.lord, sign: currentLagnaData.ucham, status: 'ucham' },
    { name: currentLagnaData.lord, sign: currentLagnaData.neesam, status: 'neesam' }
  ];

  const getHouseNumber = (lagnam: number, targetSign: number) => {
    return ((targetSign - lagnam + 12) % 12) + 1;
  };

  const uchamHouse = getHouseNumber(selectedLagnam, currentLagnaData.ucham);
  const neesamHouse = getHouseNumber(selectedLagnam, currentLagnaData.neesam);

  const getHouseSuffix = (num: number) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-fuchsia-500/20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowUp className="w-6 h-6 text-emerald-400" /> 
            <ArrowDown className="w-6 h-6 text-rose-400" />
            லக்னாதிபதி உச்சம் / நீசம் 
          </h2>
          <p className="text-sm text-slate-400">Find where the Ascendant Lord (Lagnadipathi) attains Exaltation and Debilitation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-fuchsia-500/20 rounded-xl p-5 shadow-lg shadow-fuchsia-900/10">
            <label className="block text-sm font-semibold text-fuchsia-300 mb-2">லக்னத்தை தேர்ந்தெடுக்கவும் (Select Lagnam)</label>
            <select
              value={selectedLagnam}
              onChange={(e) => setSelectedLagnam(Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-fuchsia-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-400 transition-colors"
            >
              {signs.map((sign, index) => (
                <option key={index + 1} value={index + 1}>
                  {sign}
                </option>
              ))}
            </select>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/80 border border-fuchsia-500/30">
                <h3 className="text-base font-bold text-white mb-1">
                  லக்னாதிபதி: <span className="text-fuchsia-400">{currentLagnaData.lordTamil}</span>
                </h3>
                <p className="text-xs text-slate-400">Lord of {signs[selectedLagnam - 1].split(' ')[0]} Lagnam</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" /> உச்சம் (Ucham)
                </h4>
                <p className="text-slate-200 font-medium">
                  {uchamHouse}{getHouseSuffix(uchamHouse)} House ({signs[currentLagnaData.ucham - 1].split(' ')[0]})
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1">
                  <ArrowDown className="w-4 h-4" /> நீசம் (Neesam)
                </h4>
                <p className="text-slate-200 font-medium">
                  {neesamHouse}{getHouseSuffix(neesamHouse)} House ({signs[currentLagnaData.neesam - 1].split(' ')[0]})
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 border border-fuchsia-500/20 rounded-xl p-5 sm:p-8 flex items-center justify-center shadow-lg shadow-fuchsia-900/10 min-h-[400px]">
            <div className="w-full max-w-lg">
              <SouthIndianChart 
                planets={chartPlanets as any} 
                ascendantSign={selectedLagnam} 
                title={`${signs[selectedLagnam - 1].split(' ')[0]} லக்னம்`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
