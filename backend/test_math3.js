const Astronomy = require('astronomy-engine');

const date = new Date('1997-01-19T10:00:00Z');
const time = new Astronomy.AstroTime(date);
const geoObserver = new Astronomy.Observer(0, 0, 0);

console.log("J2000 Math vs Current Math for 1997-01-19T10:00:00Z");

const getLahiriAyanamsa = (date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const fractionalYear = year + (month / 12) + (day / 365);
  return 23.8564722 + ((fractionalYear - 2000) * (50.290966 / 3600));
};
const currentAyanamsa = getLahiriAyanamsa(date);

['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].forEach(body => {
  // Current Math
  const eqCurrent = Astronomy.Equator(body, time, geoObserver, true, true);
  const tropCurrent = Astronomy.Ecliptic(eqCurrent.vec).elon;
  let sidCurrent = tropCurrent - currentAyanamsa;
  if (sidCurrent < 0) sidCurrent += 360;
  
  // J2000 Math
  const eqJ2000 = Astronomy.Equator(body, time, geoObserver, false, true);
  const tropJ2000 = Astronomy.Ecliptic(eqJ2000.vec).elon;
  let sidJ2000 = tropJ2000 - 23.8564722; // Lahiri J2000 base
  if (sidJ2000 < 0) sidJ2000 += 360;
  
  console.log(`${body}: SidCurrent=${sidCurrent.toFixed(3)}, SidJ2000=${sidJ2000.toFixed(3)}`);
});
