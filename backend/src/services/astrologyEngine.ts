import * as Astronomy from 'astronomy-engine';

export interface CalculatedPlanet {
  name: string;
  tropicalLon: number;
  siderealLon: number;
  sign: number; // 1-12
  nakshatra: number; // 1-27
  pada: number; // 1-4
  isRetrograde: boolean;
  degreeInSign: number;
}

export interface AstrologyCalculations {
  planets: CalculatedPlanet[];
  ascendant: CalculatedPlanet;
  moonSign: number; // 1-12
  moonNakshatra: number;
  ayanamsa: number;
}

// Calculate Lahiri Ayanamsa roughly
const getLahiriAyanamsa = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const fractionalYear = year + (month / 12) + (day / 365);
  // Base Lahiri for J2000 is ~23.8564722
  // Precession rate is ~50.29 seconds per year = 0.0139694 degrees
  const ayanamsa = 23.8564722 + ((fractionalYear - 2000) * (50.290966 / 3600));
  return ayanamsa;
};

const getSign = (lon: number): number => {
  return Math.floor(lon / 30) + 1;
};

const getNakshatra = (lon: number): number => {
  return Math.floor(lon / (360 / 27)) + 1;
};

const getPada = (lon: number): number => {
  const nakshatraSize = 360 / 27; // 13.333
  const remainder = lon % nakshatraSize;
  const padaSize = nakshatraSize / 4; // 3.333
  return Math.floor(remainder / padaSize) + 1;
};

export const calculateHoroscope = (date: Date, lat: number, lng: number): AstrologyCalculations => {
  const time = new Astronomy.AstroTime(date);
  const ayanamsa = getLahiriAyanamsa(date);

  const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const planets: CalculatedPlanet[] = [];

  const geoObserver = new Astronomy.Observer(0, 0, 0);

  for (const body of bodies) {
    const astroBody = body as Astronomy.Body;
    
    const eq = Astronomy.Equator(astroBody, time, geoObserver, true, true);
    const tropicalLon = Astronomy.Ecliptic(eq.vec).elon;

    let siderealLon = tropicalLon - ayanamsa;
    if (siderealLon < 0) siderealLon += 360;

    // Check retrograde (compare longitude from a slightly later time)
    const timeLater = new Astronomy.AstroTime(new Date(date.getTime() + 60000)); // 1 min later
    const eqLater = Astronomy.Equator(astroBody, timeLater, geoObserver, true, true);
    const lonLater = Astronomy.Ecliptic(eqLater.vec).elon;
    
    let diff = lonLater - tropicalLon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const isRetrograde = body !== 'Sun' && body !== 'Moon' && diff < 0;

    planets.push({
      name: body,
      tropicalLon,
      siderealLon,
      sign: getSign(siderealLon),
      nakshatra: getNakshatra(siderealLon),
      pada: getPada(siderealLon),
      isRetrograde,
      degreeInSign: siderealLon % 30
    });
  }

  // Rahu & Ketu (Mean Nodes) Approximation
  // A simple approximation for mean lunar node: 
  // Node retrogrades 19.34 degrees per year. J2000 mean ascending node was ~125.08 degrees.
  const fractionalYear = date.getUTCFullYear() + (date.getUTCMonth() / 12) + (date.getUTCDate() / 365);
  let rahuTrop = 125.0445 - ((fractionalYear - 2000) * 19.3414);
  rahuTrop = rahuTrop % 360;
  if (rahuTrop < 0) rahuTrop += 360;
  
  let rahuSidereal = rahuTrop - ayanamsa;
  if (rahuSidereal < 0) rahuSidereal += 360;
  
  let ketuSidereal = (rahuSidereal + 180) % 360;

  planets.push({
    name: 'Rahu',
    tropicalLon: rahuTrop,
    siderealLon: rahuSidereal,
    sign: getSign(rahuSidereal),
    nakshatra: getNakshatra(rahuSidereal),
    pada: getPada(rahuSidereal),
    isRetrograde: true,
    degreeInSign: rahuSidereal % 30
  });

  planets.push({
    name: 'Ketu',
    tropicalLon: (rahuTrop + 180) % 360,
    siderealLon: ketuSidereal,
    sign: getSign(ketuSidereal),
    nakshatra: getNakshatra(ketuSidereal),
    pada: getPada(ketuSidereal),
    isRetrograde: true,
    degreeInSign: ketuSidereal % 30
  });

  // Calculate Ascendant (Lagna) accurately using Local Sidereal Time
  const gast = Astronomy.SiderealTime(time);
  let lst = (gast * 15 + lng) % 360;
  if (lst < 0) lst += 360;

  const epsilon = 23.4392911 * (Math.PI / 180);
  const lstRad = lst * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);

  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon);

  let ascendantTropical = Math.atan2(y, x) * (180 / Math.PI);
  if (ascendantTropical < 0) ascendantTropical += 360;

  let ascSidereal = ascendantTropical - ayanamsa;
  if (ascSidereal < 0) ascSidereal += 360;

  const ascendant: CalculatedPlanet = {
    name: 'Ascendant',
    tropicalLon: 0,
    siderealLon: ascSidereal,
    sign: getSign(ascSidereal),
    nakshatra: getNakshatra(ascSidereal),
    pada: getPada(ascSidereal),
    isRetrograde: false,
    degreeInSign: ascSidereal % 30
  };

  const moon = planets.find(p => p.name === 'Moon')!;

  return {
    planets,
    ascendant,
    moonSign: moon.sign,
    moonNakshatra: moon.nakshatra,
    ayanamsa
  };
};

export interface DashaPeriod {
  lord: string;
  startDate: Date;
  endDate: Date;
}

export const calculateVimshottariDasha = (birthDate: Date, moonSiderealLon: number): DashaPeriod[] => {
  const dashaLords = [
    { lord: 'Ketu', years: 7 },
    { lord: 'Venus', years: 20 },
    { lord: 'Sun', years: 6 },
    { lord: 'Moon', years: 10 },
    { lord: 'Mars', years: 7 },
    { lord: 'Rahu', years: 18 },
    { lord: 'Jupiter', years: 16 },
    { lord: 'Saturn', years: 19 },
    { lord: 'Mercury', years: 17 }
  ];

  const nakshatraSize = 360 / 27; // 13.3333 degrees
  const exactNakshatraDecimal = moonSiderealLon / nakshatraSize;
  const nakshatraIndex = Math.floor(exactNakshatraDecimal);
  const fractionTraversed = exactNakshatraDecimal - nakshatraIndex;
  const fractionRemaining = 1 - fractionTraversed;

  // The first dasha lord depends on the nakshatra (0-26 index)
  // 0=Ashwini (Ketu), 1=Bharani (Venus), etc.
  const startingLordIndex = nakshatraIndex % 9;

  let periods: DashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());
  
  // First dasha is partial based on fraction remaining
  const firstDasha = dashaLords[startingLordIndex];
  const firstDashaDurationMs = firstDasha.years * 365.25 * 24 * 60 * 60 * 1000 * fractionRemaining;
  const firstDashaEndDate = new Date(currentDate.getTime() + firstDashaDurationMs);

  periods.push({
    lord: firstDasha.lord,
    startDate: new Date(currentDate.getTime()),
    endDate: firstDashaEndDate
  });

  currentDate = firstDashaEndDate;

  // Calculate the rest for one full cycle (up to 120 years)
  for (let i = 1; i <= 9; i++) {
    const lordIndex = (startingLordIndex + i) % 9;
    const dasha = dashaLords[lordIndex];
    const durationMs = dasha.years * 365.25 * 24 * 60 * 60 * 1000;
    const endDate = new Date(currentDate.getTime() + durationMs);
    
    periods.push({
      lord: dasha.lord,
      startDate: new Date(currentDate.getTime()),
      endDate: endDate
    });
    
    currentDate = endDate;
  }

  return periods;
};

export interface TransitInterpretation {
  planet: string;
  houseFromMoon: number;
  status: 'Good' | 'Neutral' | 'Bad';
  interpretation: string;
}

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const evaluateTransits = (birthMoonSign: number, currentPlanets: CalculatedPlanet[]): TransitInterpretation[] => {
  const moonSignIndex = birthMoonSign - 1;
  if (moonSignIndex < 0 || moonSignIndex > 11) return [];

  const interpretations: TransitInterpretation[] = [];

  const addInterpretation = (planet: string, house: number, status: 'Good' | 'Neutral' | 'Bad', text: string) => {
    interpretations.push({ planet, houseFromMoon: house, status, interpretation: text });
  };

  currentPlanets.forEach(p => {
    const transitSignIndex = p.sign - 1;
    if (transitSignIndex < 0 || transitSignIndex > 11) return;
    let houseFromMoon = transitSignIndex - moonSignIndex + 1;
    if (houseFromMoon <= 0) houseFromMoon += 12;

    switch (p.name) {
      case 'Jupiter':
        if ([2, 5, 7, 9, 11].includes(houseFromMoon)) {
          addInterpretation('குரு (Jupiter)', houseFromMoon, 'Good', `குரு உங்கள் ராசிக்கு ${houseFromMoon}-ம் இடத்தில் சஞ்சரிப்பது மிகச் சிறப்பான காலம். நிதி நிலை உயரும், மகிழ்ச்சி பெருகும்.`);
        } else if ([1, 3, 4, 6, 8, 10, 12].includes(houseFromMoon)) {
          addInterpretation('குரு (Jupiter)', houseFromMoon, 'Neutral', `குரு உங்கள் ராசிக்கு ${houseFromMoon}-ம் இடத்தில் சஞ்சரிப்பது நடுத்தரமான பலன்களைத் தரும். கவனம் தேவை.`);
        }
        break;
      
      case 'Saturn':
        if ([3, 6, 11].includes(houseFromMoon)) {
          addInterpretation('சனி (Saturn)', houseFromMoon, 'Good', `சனி உங்கள் ராசிக்கு ${houseFromMoon}-ம் இடத்தில் சஞ்சரிப்பது யோகமான காலம். முயற்சிகள் வெற்றியடையும், புதிய பதவிகள் கிடைக்கும்.`);
        } else if ([12, 1, 2].includes(houseFromMoon)) {
          addInterpretation('சனி (Saturn)', houseFromMoon, 'Bad', `ஏழரை சனி நடக்கிறது (${houseFromMoon}-ம் இடம்). பொறுமையும், நிதானமும் மிகவும் அவசியம். கடின உழைப்பு தேவை.`);
        } else if (houseFromMoon === 8) {
          addInterpretation('சனி (Saturn)', houseFromMoon, 'Bad', `அஷ்டமத்து சனி. எந்த ஒரு புதிய செயலிலும் அதிக கவனம் தேவை. ஆரோக்கியத்தில் அக்கறை கொள்ளவும்.`);
        } else if (houseFromMoon === 4) {
          addInterpretation('சனி (Saturn)', houseFromMoon, 'Bad', `அர்த்தாஷ்டம சனி. குடும்பத்தில் சிறுசிறு சலசலப்புகள் வரலாம்.`);
        } else {
          addInterpretation('சனி (Saturn)', houseFromMoon, 'Neutral', `சனி ${houseFromMoon}-ம் இடத்தில் சஞ்சரிப்பது சுமாரான பலன்களைத் தரும்.`);
        }
        break;

      case 'Rahu':
        if ([3, 6, 10, 11].includes(houseFromMoon)) {
          addInterpretation('ராகு (Rahu)', houseFromMoon, 'Good', `ராகு ${houseFromMoon}-ம் இடத்தில் இருப்பதால் தைரியம் கூடும், எதிர்பாராத தனவரவு கிடைக்க வாய்ப்புள்ளது.`);
        } else {
          addInterpretation('ராகு (Rahu)', houseFromMoon, 'Neutral', `ராகு ${houseFromMoon}-ம் இடத்தில் சஞ்சரிக்கிறார். தேவையற்ற அலைச்சல்களை தவிர்க்கவும்.`);
        }
        break;

      case 'Ketu':
        if ([3, 6, 11].includes(houseFromMoon)) {
          addInterpretation('கேது (Ketu)', houseFromMoon, 'Good', `கேது ${houseFromMoon}-ம் இடத்தில் சஞ்சரிப்பது நன்மை தரும். ஆன்மீக நாட்டம் அதிகரிக்கும்.`);
        } else {
          addInterpretation('கேது (Ketu)', houseFromMoon, 'Neutral', `கேது ${houseFromMoon}-ம் இடத்தில் சஞ்சரிக்கிறார். தெய்வ வழிபாடு நன்மையை தரும்.`);
        }
        break;
    }
  });

  return interpretations;
};

// Simplified Match Making (Ashta Koota approximation based on 36 points)
export interface MatchMakingResult {
  totalScore: number;
  maxScore: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  details: {
    category: string;
    score: number;
    max: number;
    description: string;
  }[];
}

export const calculateCompatibility = (boyNakshatra: number, boyRasi: number, girlNakshatra: number, girlRasi: number): MatchMakingResult => {
  // Rasi (Moon Sign) distance: determines Bhakoot (7 points)
  // Distance from Boy to Girl
  let rasiDistance = girlRasi - boyRasi;
  if (rasiDistance < 0) rasiDistance += 12;
  rasiDistance += 1; // 1-indexed

  let bhakootScore = 7;
  if ([2, 12, 5, 9, 6, 8].includes(rasiDistance)) {
    bhakootScore = 0; // Dosha
  }

  // Dina Koota (3 points) based on Nakshatra distance
  let nakshatraDistance = girlNakshatra - boyNakshatra;
  if (nakshatraDistance < 0) nakshatraDistance += 27;
  nakshatraDistance += 1;

  let dinaScore = 3;
  if ([2, 4, 6, 8, 9].includes(nakshatraDistance % 9)) {
    dinaScore = 1.5; 
  } else if ([3, 5, 7].includes(nakshatraDistance % 9)) {
    dinaScore = 0;
  }

  // Simple Graha Maitri (5 points)
  let maitriScore = 5;
  if (bhakootScore === 0) maitriScore = 2; // Approximate fallback if inimical

  // Gana Koota (6 points) - 1: Deva, 2: Manushya, 3: Rakshasa
  // For simplicity, pseudo-random but deterministic mapping based on Nakshatra index modulo 3
  const boyGana = boyNakshatra % 3;
  const girlGana = girlNakshatra % 3;
  let ganaScore = 6;
  if (boyGana !== girlGana) ganaScore = 3;
  if ((boyGana === 2 && girlGana === 0) || (boyGana === 0 && girlGana === 2)) ganaScore = 0;

  // Nadi Koota (8 points) - most important. 1: Aadi, 2: Madhya, 3: Antya
  const boyNadi = boyNakshatra % 3;
  const girlNadi = girlNakshatra % 3;
  let nadiScore = 8;
  if (boyNadi === girlNadi) nadiScore = 0; // Nadi Dosha

  // Other Kootas (Varna, Vashya, Yoni) total 7 points. Let's assign an average based on Rasi parity.
  let otherScore = (boyRasi % 2 === girlRasi % 2) ? 6 : 4;

  const totalScore = bhakootScore + dinaScore + maitriScore + ganaScore + nadiScore + otherScore;
  
  let status: 'Excellent' | 'Good' | 'Average' | 'Not Recommended' = 'Not Recommended';
  if (totalScore >= 28) status = 'Excellent';
  else if (totalScore >= 22) status = 'Good';
  else if (totalScore >= 18) status = 'Average';

  return {
    totalScore,
    maxScore: 36,
    status,
    details: [
      { category: 'தின பொருத்தம் (Dina)', score: dinaScore, max: 3, description: 'ஆரோக்கியம் மற்றும் நீண்ட ஆயுள்' },
      { category: 'கண பொருத்தம் (Gana)', score: ganaScore, max: 6, description: 'குணநலன்கள் மற்றும் மன ஒத்திசைவு' },
      { category: 'ராசி பொருத்தம் (Bhakoot)', score: bhakootScore, max: 7, description: 'குடும்ப நலம் மற்றும் சந்தோஷம்' },
      { category: 'நாடி பொருத்தம் (Nadi)', score: nadiScore, max: 8, description: 'மரபியல் மற்றும் புத்திர பாக்கியம்' },
      { category: 'கிரக மைத்ரி (Maitri)', score: maitriScore, max: 5, description: 'அன்பு மற்றும் புரிதல்' },
      { category: 'இதர பொருத்தங்கள்', score: otherScore, max: 7, description: 'வர்ண, வசிய, யோனி பொருத்தங்கள்' }
    ]
  };
};

export interface ChartAnalysis {
  benefics: string[];
  malefics: string[];
  yogas: { name: string; result: string }[];
}

export const analyzeBirthChart = (chart: AstrologyCalculations): ChartAnalysis => {
  const ascSign = chart.ascendant.sign;
  
  const lordMap: Record<number, string> = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury', 
    7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
  };

  const getHouseSign = (houseNum: number) => {
    let sign = ascSign + houseNum - 1;
    if (sign > 12) sign -= 12;
    return sign;
  };

  const beneficLords = new Set<string>();
  beneficLords.add(lordMap[getHouseSign(1)]);
  beneficLords.add(lordMap[getHouseSign(5)]);
  beneficLords.add(lordMap[getHouseSign(9)]);

  const maleficLords = new Set<string>();
  maleficLords.add(lordMap[getHouseSign(3)]);
  maleficLords.add(lordMap[getHouseSign(6)]);
  maleficLords.add(lordMap[getHouseSign(11)]);

  const yogas: { name: string; result: string }[] = [];
  
  const getPlanet = (name: string) => chart.planets.find(p => p.name === name);
  const jupiter = getPlanet('Jupiter');
  const moon = getPlanet('Moon');
  const mars = getPlanet('Mars');
  const rahu = getPlanet('Rahu');
  const sun = getPlanet('Sun');
  const mercury = getPlanet('Mercury');
  
  if (jupiter && rahu && jupiter.sign === rahu.sign) {
    yogas.push({ name: 'குரு சண்டாள யோகம் (Guru Chandal)', result: 'வாழ்க்கையில் சில சவால்களை சந்திக்க நேரிடும், ஆனால் தியானம், தெய்வ வழிபாடு மூலம் தடைகளை வெல்லலாம்.' });
  }

  if (jupiter && moon) {
    let dist = jupiter.sign - moon.sign + 1;
    if (dist <= 0) dist += 12;
    if ([1, 4, 7, 10].includes(dist)) {
      yogas.push({ name: 'கஜ கேசரி யோகம் (Gaja Kesari)', result: 'சமூகத்தில் நல்ல மரியாதையும், செல்வாக்கும், சிறந்த பேச்சாற்றலும், நிலையான செல்வமும் கிடைக்கும்.' });
    }
  }

  if (moon && mars && moon.sign === mars.sign) {
    yogas.push({ name: 'சந்திர மங்கள யோகம் (Chandra Mangala)', result: 'நல்ல பொருளாதார வளர்ச்சியும், துணிச்சலான குணமும், சுறுசுறுப்பான செயல்பாடும் இருக்கும்.' });
  }
  
  if (sun && mercury && sun.sign === mercury.sign) {
    yogas.push({ name: 'புத ஆதித்ய யோகம் (Budha Aditya)', result: 'சிறந்த கல்வியறிவும், கூர்மையான நுண்ணறிவும், நல்ல நிர்வாகத் திறனும் உண்டாகும்.' });
  }

  if (mars) {
    let marsDist = mars.sign - ascSign + 1;
    if (marsDist <= 0) marsDist += 12;
    if ([1, 2, 4, 7, 8, 12].includes(marsDist)) {
      yogas.push({ name: 'செவ்வாய் தோஷம் (Manglik)', result: 'திருமணப் பொருத்தம் பார்க்கும்போது கவனமாக இருக்க வேண்டும். செவ்வாய் தோஷமுள்ள துணையைத் தேர்ந்தெடுப்பது நன்மையை தரும்.' });
    }
  }

  return {
    benefics: Array.from(beneficLords),
    malefics: Array.from(maleficLords).filter(m => !beneficLords.has(m)),
    yogas
  };
};
