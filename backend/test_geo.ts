import * as Astronomy from 'astronomy-engine';

const time = new Astronomy.AstroTime(new Date("1997-12-27T00:00:00Z"));
const observer = new Astronomy.Observer(0, 0, 0);

const bodies: Astronomy.Body[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

for (const b of bodies) {
  const eq = Astronomy.Equator(b, time, observer, true, true);
  const eclCoords = Astronomy.Ecliptic(eq.vec);
  console.log(`${b} Geocentric Ecliptic:`, eclCoords.elon);
}
