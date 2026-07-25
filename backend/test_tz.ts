import { DateTime } from 'luxon';

const getBirthDateUTC = (dateObj: any, timeString: string, timezone: string): Date => {
  const dateStr = (dateObj instanceof Date ? dateObj.toISOString() : String(dateObj)).split('T')[0];
  const isoString = `${dateStr}T${timeString}:00`;
  const dt = DateTime.fromISO(isoString, { zone: timezone });
  return dt.toJSDate();
};

const dt = getBirthDateUTC("1997-01-19", "10:30", "Asia/Kolkata");
console.log(dt.toISOString());
