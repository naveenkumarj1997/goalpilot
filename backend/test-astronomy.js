const Astronomy = require('astronomy-engine');
const date = new Date('1997-01-19T10:30:00Z');
const time = new Astronomy.AstroTime(date);

const geo = Astronomy.GeoVector('Moon', time, true);
console.log('GeoVector:', geo);

// Try to find ecliptic coordinates
const eq = Astronomy.Equator('Moon', time, new Astronomy.Observer(0,0,0), false, true);
console.log('Equator:', eq);
console.log('Equator RA/Dec:', eq.ra, eq.dec);

// Ecliptic Longitude
const ecl = Astronomy.EclipticLongitude('Moon', time);
console.log('Ecliptic Longitude:', ecl);
