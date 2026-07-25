const fs = require('fs');
const path = require('path');

const dir = 'src/pages/astrology';

const files = [
  'AstrologyDasha.tsx',
  'AstrologyTransit.tsx',
  'AstrologyMatch.tsx',
  'AstrologyNakshatra.tsx' // Wait, Nakshatra just uses getTodayHoroscope? I'll check inside the script.
];

files.forEach(file => {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) return;
  
  let code = fs.readFileSync(p, 'utf8');
  
  // Add useLocation
  if (code.includes('useNavigate') && !code.includes('useLocation')) {
    code = code.replace("import { useNavigate", "import { useNavigate, useLocation");
  } else if (!code.includes('useLocation')) {
    code = code.replace("import { useAuth", "import { useLocation } from 'react-router-dom';\nimport { useAuth");
  }
  
  // Add location hook
  if (!code.includes('const location = useLocation()')) {
    code = code.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n  const location = useLocation();");
  }
  
  // Inject profileId fetching and update API calls
  if (file === 'AstrologyDasha.tsx') {
    code = code.replace(
      "const result = await getDashaPeriods(user.token);",
      "const profileId = new URLSearchParams(location.search).get('profileId') || undefined;\n        const result = await getDashaPeriods(user.token, profileId);"
    );
  }
  if (file === 'AstrologyTransit.tsx') {
    code = code.replace(
      "const result = await getTransitInterpretations(user.token);",
      "const profileId = new URLSearchParams(location.search).get('profileId') || undefined;\n        const result = await getTransitInterpretations(user.token, profileId);"
    );
  }
  if (file === 'AstrologyNakshatra.tsx') {
    code = code.replace(
      "const result = await getTodayHoroscope(user.token);",
      "const profileId = new URLSearchParams(location.search).get('profileId') || undefined;\n        const result = await getTodayHoroscope(user.token, profileId);"
    );
  }
  // AstrologyMatch is a bit different because it also accepts partner data
  if (file === 'AstrologyMatch.tsx') {
    code = code.replace(
      "const result = await getTodayHoroscope(user.token);",
      "const profileId = new URLSearchParams(location.search).get('profileId') || undefined;\n        const result = await getTodayHoroscope(user.token, profileId);"
    );
    // calculateMatch was updated to take profileId? Wait, calculateMatch is a POST.
    // In backend calculateMatch uses req.query.profileId. Let's see if the frontend API does.
    // frontend `calculateMatch` API currently doesn't take profileId! 
    // Wait, the API for calculateMatch: export const calculateMatch = async (token: string, partnerData: any) => { ... }
    // Let's modify it to take profileId in the script!
  }
  
  fs.writeFileSync(p, code);
});

// Update API file for calculateMatch
let apiCode = fs.readFileSync('src/api/astrology.ts', 'utf8');
apiCode = apiCode.replace(
  "export const calculateMatch = async (token: string, partnerData: any) => {\n  const response = await axios.post(`${API_URL}/astrology/match`, partnerData,",
  "export const calculateMatch = async (token: string, partnerData: any, profileId?: string) => {\n  const url = profileId ? `${API_URL}/astrology/match?profileId=${profileId}` : `${API_URL}/astrology/match`;\n  const response = await axios.post(url, partnerData,"
);
fs.writeFileSync('src/api/astrology.ts', apiCode);

console.log('Frontend hooks updated.');
