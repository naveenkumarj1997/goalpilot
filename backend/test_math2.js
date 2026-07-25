const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

const date = new Date('1997-01-19T10:00:00Z');
const time = new Astronomy.AstroTime(date);
const geoObserver = new Astronomy.Observer(0, 0, 0);

console.log("My Math vs EclipticLongitude for 1997-01-19T10:00:00Z");

['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].forEach(body => {
  const eq = Astronomy.Equator(body, time, geoObserver, true, true);
  const tropicalLon = Astronomy.Ecliptic(eq.vec).elon;
  
  const elon = Astronomy.EclipticLongitude(body, time);
  
  console.log(`${body}: MyTrop=${tropicalLon.toFixed(2)}, AstroElon=${elon.toFixed(2)}`);
});
