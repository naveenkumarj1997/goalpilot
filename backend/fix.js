const fs = require('fs');
let code = fs.readFileSync('src/controllers/astrologyController.ts', 'utf8');

const importReplacement = `import { calculateHoroscope } from '../services/astrologyEngine';
import { DateTime } from 'luxon';

const getBirthDateUTC = (dateObj: any, timeString: string, timezone: string): Date => {
  const dateStr = (dateObj instanceof Date ? dateObj.toISOString() : String(dateObj)).split('T')[0];
  const isoString = \`\${dateStr}T\${timeString}:00\`;
  const dt = DateTime.fromISO(isoString, { zone: timezone });
  return dt.toJSDate();
};
`;
code = code.replace(`import { calculateHoroscope } from '../services/astrologyEngine';`, importReplacement);

const pattern1 = `    const yyyyMmDd = new Date(profile.dateOfBirth).toISOString().split('T')[0];
    const dobString = \`\${yyyyMmDd}T\${profile.timeOfBirth}:00\`;
    const birthDate = new Date(dobString + 'Z');`;

const rep1 = `    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone);`;

code = code.split(pattern1).join(rep1);

const pattern2 = `    const pDobString = \`\${partnerDob}T\${partnerTob}:00\`;
    const partnerDate = new Date(pDobString + 'Z');`;

const rep2 = `    const partnerTz = tzlookup(partnerLat, partnerLng);
    const partnerDate = getBirthDateUTC(partnerDob, partnerTob, partnerTz);`;

code = code.split(pattern2).join(rep2);

fs.writeFileSync('src/controllers/astrologyController.ts', code);
console.log('Done!');
