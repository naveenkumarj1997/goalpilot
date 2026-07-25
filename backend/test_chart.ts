import { calculateHoroscope } from './src/services/astrologyEngine';
import { DateTime } from 'luxon';

const getBirthDateUTC = (dateObj: any, timeString: string, timezone: string): Date => {
  const dateStr = (dateObj instanceof Date ? dateObj.toISOString() : String(dateObj)).split('T')[0];
  const isoString = `${dateStr}T${timeString}:00`;
  const dt = DateTime.fromISO(isoString, { zone: timezone });
  return dt.toJSDate();
};

const dt = getBirthDateUTC("1997-12-27T00:00:00.000Z", "14:23", "Asia/Kolkata");
const chart = calculateHoroscope(dt, 9.919, 78.11953);

console.log("Ascendant:", chart.ascendant);
console.log("Moon Sign:", chart.moonSign);
console.log("Moon Nakshatra:", chart.moonNakshatra);
console.log("Planets:", JSON.stringify(chart.planets, null, 2));

