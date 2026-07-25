import * as Astronomy from 'astronomy-engine';
const time = new Astronomy.AstroTime(new Date());

const eq = Astronomy.Equator('Sun', time, new Astronomy.Observer(0,0,0), true, true);
console.log("Sun equator:", eq.ra, eq.dec);

// Ecliptic(vector) converts an equatorial vector to an ecliptic vector.
const ecl = Astronomy.Ecliptic(eq.vec);
console.log("Sun Ecliptic (vector converted):", ecl);

// Wait, does SunPosition work?
const sunPos = Astronomy.SunPosition(time);
// We can get ecliptic longitude of a vector: EclipticLongitude of a body? No.
// Let's look at Astronomy.Ecliptic.
console.log("SunPos vector:", sunPos);
const ecl2 = Astronomy.Ecliptic(sunPos);

// Calculate longitude in degrees from x and y of ecliptic coords
const lon1 = Math.atan2(ecl.y, ecl.x) * 180 / Math.PI;
const lon2 = Math.atan2(ecl2.y, ecl2.x) * 180 / Math.PI;

console.log("Sun Lon 1:", lon1 < 0 ? lon1 + 360 : lon1);
console.log("Sun Lon 2:", lon2 < 0 ? lon2 + 360 : lon2);

