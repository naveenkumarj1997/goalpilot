import { calculateHoroscope } from './src/services/astrologyEngine';

try {
  const now = new Date();
  const res = calculateHoroscope(now, 13.0827, 80.2707); // Chennai lat/lng
  console.log("Success:", res.planets[0].name);
} catch (error) {
  console.error("Error thrown:", error);
}
