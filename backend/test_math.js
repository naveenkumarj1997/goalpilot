const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

const dateStr = "1997-01-19";
const timeString = "15:30";
const timezone = "Asia/Kolkata";
const isoString = `${dateStr}T${timeString}:00`;
const dt = DateTime.fromISO(isoString, { zone: timezone }).toJSDate();

console.log("UTC Date:", dt.toISOString());

const getLahiriAyanamsa = (date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const fractionalYear = year + (month / 12) + (day / 365);
  return 23.8564722 + ((fractionalYear - 2000) * (50.290966 / 3600));
};

const ayanamsa = getLahiriAyanamsa(dt);
console.log("Ayanamsa:", ayanamsa);

const time = new Astronomy.AstroTime(dt);
const geoObserver = new Astronomy.Observer(0, 0, 0);

['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].forEach(body => {
  const eq = Astronomy.Equator(body, time, geoObserver, true, true);
  const tropicalLon = Astronomy.Ecliptic(eq.vec).elon;
  let siderealLon = tropicalLon - ayanamsa;
  if (siderealLon < 0) siderealLon += 360;
  
  const sign = Math.floor(siderealLon / 30) + 1;
  console.log(`${body}: Trop=${tropicalLon.toFixed(2)}, Sid=${siderealLon.toFixed(2)}, Sign=${sign}`);
});
