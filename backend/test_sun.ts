import * as Astronomy from 'astronomy-engine';
const time = new Astronomy.AstroTime(new Date());

try {
  const ecl = Astronomy.EclipticLongitude('Sun', time);
  console.log("Sun ecliptic:", ecl);
} catch (e) {
  console.log("Sun EclipticLongitude failed:", e);
}

try {
  const eq = Astronomy.Equator('Sun', time, new Astronomy.Observer(0,0,0), false, true);
  // convert equator to ecliptic?
  // let's try ecliptic coords
  const eclCoords = Astronomy.Ecliptic('Sun', time);
  console.log("Sun Ecliptic coords:", eclCoords.lon);
} catch (e) {
  console.log("Sun Ecliptic failed:", e);
}
