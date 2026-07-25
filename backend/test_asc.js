const Astronomy = require('astronomy-engine');

const date = new Date('1997-12-27T08:53:00.000Z'); // 14:23 IST
const lat = 10.0211; // Manamelkudi lat
const lng = 79.2274; // Manamelkudi lng

const time = new Astronomy.AstroTime(date);

// Greenwich Apparent Sidereal Time (in hours)
const gast = Astronomy.SiderealTime(time);
console.log("GAST (hours):", gast);

// Local Sidereal Time (in degrees)
let lst = (gast * 15 + lng) % 360;
if (lst < 0) lst += 360;
console.log("LST (degrees):", lst);

// Obliquity of the Ecliptic (roughly 23.439 degrees)
const epsilon = 23.4392911 * (Math.PI / 180);

const lstRad = lst * (Math.PI / 180);
const latRad = lat * (Math.PI / 180);

const y = Math.cos(lstRad);
const x = -Math.sin(lstRad) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon);

let ascendantTropical = Math.atan2(y, x) * (180 / Math.PI);
if (ascendantTropical < 0) ascendantTropical += 360;

console.log("Ascendant Tropical:", ascendantTropical);

const ayanamsa = 23.8564722 + (((date.getUTCFullYear() + date.getUTCMonth()/12) - 2000) * (50.290966 / 3600));
console.log("Ayanamsa:", ayanamsa);

let ascendantSidereal = ascendantTropical - ayanamsa;
if (ascendantSidereal < 0) ascendantSidereal += 360;

console.log("Ascendant Sidereal:", ascendantSidereal);
console.log("Ascendant Sign:", Math.floor(ascendantSidereal / 30) + 1);
