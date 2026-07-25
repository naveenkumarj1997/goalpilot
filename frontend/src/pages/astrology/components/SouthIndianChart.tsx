import React from 'react';

interface PlanetInfo {
  name: string; // Sun, Moon, etc.
  sign: number; // 1 to 12 (1 = Aries, 2 = Taurus)
  isRetrograde?: boolean;
}

interface ChartProps {
  planets: PlanetInfo[];
  ascendantSign: number; // 1 to 12
  title?: string;
}

const SouthIndianChart: React.FC<ChartProps> = ({ planets, ascendantSign, title }) => {
  // Fixed grid for South Indian Chart (12 signs)
  // Mapping index to Sign (1-indexed: 1=Aries, 12=Pisces)
  // Grid layout (4x4):
  // [12] [ 1] [ 2] [ 3]
  // [11]           [ 4]
  // [10]           [ 5]
  // [ 9] [ 8] [ 7] [ 6]

  const gridMapping = [
    12, 1, 2, 3,
    11, null, null, 4,
    10, null, null, 5,
    9, 8, 7, 6
  ];

  const getPlanetsInSign = (sign: number) => {
    return planets.filter(p => p.sign === sign);
  };

  const getSignNameTamil = (sign: number) => {
    const signs = [
      'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
      'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்',
      'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
    ];
    return signs[sign - 1];
  };

  const getPlanetNameTamil = (name: string) => {
    const names: Record<string, string> = {
      Sun: 'சூ', Moon: 'சந்', Mars: 'செ', Mercury: 'பு',
      Jupiter: 'கு', Venus: 'சுக்', Saturn: 'சனி',
      Rahu: 'ரா', Ketu: 'கே', Ascendant: 'லக்'
    };
    return names[name] || name;
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square border-2 border-fuchsia-500/50 bg-slate-900/50 relative p-1 rounded-sm shadow-[0_0_15px_rgba(217,70,239,0.2)]">
      {title && (
        <div className="absolute inset-0 m-auto w-1/2 h-1/2 flex items-center justify-center text-center">
          <h3 className="text-fuchsia-300 font-bold text-xl drop-shadow-md">{title}</h3>
        </div>
      )}
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-1">
        {gridMapping.map((sign, idx) => {
          if (sign === null) {
            return <div key={`empty-${idx}`} className="bg-transparent border border-transparent"></div>;
          }

          const signPlanets = getPlanetsInSign(sign);
          const isAscendant = sign === ascendantSign;

          return (
            <div key={`sign-${sign}`} className="border border-slate-700/80 bg-slate-800/40 relative overflow-hidden flex flex-col p-1 hover:bg-slate-700/60 transition-colors">
              <div className="text-[10px] sm:text-xs text-slate-500 absolute bottom-1 right-1 font-medium">{getSignNameTamil(sign)}</div>
              
              <div className="flex flex-wrap gap-1 content-start mt-1 z-10">
                {isAscendant && (
                  <span className="text-xs sm:text-sm font-black text-fuchsia-400">ல</span>
                )}
                {signPlanets.map((p, i) => (
                  <span key={i} className={`text-xs sm:text-sm font-bold ${p.isRetrograde ? 'underline text-orange-300' : 'text-slate-200'}`}>
                    {getPlanetNameTamil(p.name)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SouthIndianChart;
