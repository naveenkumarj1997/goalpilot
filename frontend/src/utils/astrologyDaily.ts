export interface DailyPrediction {
  status: 'Excellent' | 'Good' | 'Mixed' | 'Caution' | 'Chandrashtamam';
  prediction: string;
  caution: string;
  remedy: string;
  luckyColor: string;
  luckyNumber: string;
  winTheDay: string;
}

export const getDailyPrediction = (natalMoonSign: number, transitMoonSign: number, natalNakshatra?: number, transitNakshatra?: number): DailyPrediction => {
  let distance = transitMoonSign - natalMoonSign + 1;
  if (distance <= 0) distance += 12;

  let taraBalaMsg = '';
  let taraWinMsg = '';

  if (natalNakshatra !== undefined && transitNakshatra !== undefined) {
    let taraDistance = ((transitNakshatra - natalNakshatra) % 9 + 9) % 9 + 1;
    switch (taraDistance) {
      case 1: 
        taraBalaMsg = " உடல் ஆரோக்கியத்தில் சிறு கவனம் தேவை."; 
        taraWinMsg = " ஆரோக்கிய உணவுகளை எடுத்துக்கொள்ளுங்கள்."; 
        break;
      case 2: 
        taraBalaMsg = " பணவரவு அதிகரிக்கும், சுப செலவுகள் ஏற்படும்."; 
        taraWinMsg = " நிதி சார்ந்த முடிவுகளை தைரியமாக எடுக்கலாம்."; 
        break;
      case 3: 
        taraBalaMsg = " சிறு அலைச்சல்கள் மற்றும் பயணங்களில் தாமதம் ஏற்படலாம்."; 
        taraWinMsg = " திட்டமிட்டு செயல்படுவது நல்லது."; 
        break;
      case 4: 
        taraBalaMsg = " குடும்பத்தில் மகிழ்ச்சி நிலவும், நற்செய்திகள் தேடி வரும்."; 
        taraWinMsg = " குடும்பத்தினருடன் அன்பான நேரத்தை செலவிடுங்கள்."; 
        break;
      case 5: 
        taraBalaMsg = " செய்யும் காரியங்களில் சிறு தடங்கல்கள் வந்து விலகும்."; 
        taraWinMsg = " விடாமுயற்சியுடன் செயல்பட்டால் வெற்றி நிச்சயம்."; 
        break;
      case 6: 
        taraBalaMsg = " எடுத்த காரியங்கள் அனைத்திலும் எளிதில் வெற்றி கிட்டும்."; 
        taraWinMsg = " புதிய முயற்சிகளை தயங்காமல் உடனடியாக தொடங்குங்கள்."; 
        break;
      case 7: 
        taraBalaMsg = " வீண் விவாதங்களை தவிர்க்கவும், முக்கிய முடிவுகளை தள்ளி வைக்கவும்."; 
        taraWinMsg = " அமைதி மற்றும் அளவான பேச்சு உங்களுக்கு நன்மையை தரும்."; 
        break;
      case 8: 
        taraBalaMsg = " நண்பர்களின் மற்றும் உற்றாரின் உதவி தக்க சமயத்தில் கிடைக்கும்."; 
        taraWinMsg = " மற்றவர்களின் ஆலோசனைகளை ஏற்று செயல்படுங்கள்."; 
        break;
      case 9: 
        taraBalaMsg = " எதிர்பாராத நன்மைகள் மற்றும் உதவிகள் தானாக வந்து சேரும்."; 
        taraWinMsg = " வரும் அனைத்து நல்ல வாய்ப்புகளையும் சரியாக பயன்படுத்துங்கள்."; 
        break;
    }
  }

  const appendTara = (pred: string) => pred + taraBalaMsg;
  const appendWin = (win: string) => win + taraWinMsg;

  switch (distance) {
    case 1:
      return {
        status: 'Mixed',
        prediction: appendTara('இன்று உங்களுக்கு கலவையான பலன்கள் கிடைக்கும். மனதில் சிறு குழப்பங்கள் வந்து நீங்கும். உணவு விஷயங்களில் கவனம் தேவை.'),
        caution: 'அதிகமாக சிந்திக்க வேண்டாம். முக்கிய முடிவுகளை தள்ளி வைப்பது நல்லது.',
        remedy: 'சிவன் அல்லது சந்திர பகவானை வழிபடவும். நெற்றியில் திருநீறு அணிவது நல்லது.',
        luckyColor: 'வெள்ளை (White)',
        luckyNumber: '2, 7',
        winTheDay: appendWin('உங்கள் அன்றாட வேலைகளில் மட்டும் கவனம் செலுத்துங்கள். தியானம் செய்து மனதை அமைதியாக வையுங்கள்.')
      };
    case 2:
      return {
        status: 'Mixed',
        prediction: appendTara('பணவரவு இருக்கும், ஆனால் அதற்கேற்ப செலவுகளும் காத்திருக்கும். குடும்பத்தில் சிறு விவாதங்கள் ஏற்படலாம்.'),
        caution: 'பேச்சில் நிதானம் தேவை. கோபத்தை கட்டுப்படுத்தவும்.',
        remedy: 'அம்மன் வழிபாடு நன்மையை தரும். பசுவிற்கு அகத்திக்கீரை வழங்கவும்.',
        luckyColor: 'வெளிர் நீலம் (Light Blue)',
        luckyNumber: '6',
        winTheDay: appendWin('கோபத்தை தவிர்த்து, புன்னகையுடன் அனைவரையும் அணுகினால் நாள் இனிமையாக இருக்கும்.')
      };
    case 3:
      return {
        status: 'Excellent',
        prediction: appendTara('இன்று உங்களுக்கு மிகவும் சிறப்பான நாள்! புதிய முயற்சிகள் வெற்றியடையும். தைரியமும் தன்னம்பிக்கையும் அதிகரிக்கும்.'),
        caution: 'பொருட்களை கவனமாக கையாளவும்.',
        remedy: 'முருகன் வழிபாடு சிறந்தது. கந்த சஷ்டி கவசம் படிக்கவும்.',
        luckyColor: 'சிவப்பு (Red)',
        luckyNumber: '3, 9',
        winTheDay: appendWin('உங்கள் இலக்குகளை நோக்கி தைரியமாக அடி எடுத்து வையுங்கள். வெற்றி நிச்சயம்!')
      };
    case 4:
      return {
        status: 'Caution',
        prediction: appendTara('பயணங்களில் அலைச்சல் ஏற்படும். வேலைப்பளு காரணமாக உடல் சோர்வு உண்டாகலாம். தாயாரின் உடல்நலத்தில் கவனம் தேவை.'),
        caution: 'வாகனங்களில் செல்லும்போது கூடுதல் கவனம் தேவை.',
        remedy: 'விநாயகரை வழிபடவும். ஏழைகளுக்கு உணவு தானம் செய்யவும்.',
        luckyColor: 'பச்சை (Green)',
        luckyNumber: '5',
        winTheDay: appendWin('தேவையான ஓய்வு எடுத்து, எந்த வேலையையும் அவசரப்படாமல் செய்யுங்கள்.')
      };
    case 5:
      return {
        status: 'Mixed',
        prediction: appendTara('குழந்தைகள் வழியில் சில கவலைகள் வந்து நீங்கும். எதிர்பார்த்த உதவிகள் சற்று தாமதமாக கிடைக்கும்.'),
        caution: 'பங்குச்சந்தை போன்ற முதலீடுகளை இன்று தவிர்க்கவும்.',
        remedy: 'தட்சிணாமூர்த்தி அல்லது குரு பகவானை வழிபடவும்.',
        luckyColor: 'மஞ்சள் (Yellow)',
        luckyNumber: '3',
        winTheDay: appendWin('உங்கள் நேரத்தை குடும்பத்தினருடன் செலவிடுங்கள். பொறுமை காப்பது வெற்றியை தரும்.')
      };
    case 6:
      return {
        status: 'Excellent',
        prediction: appendTara('இன்று உங்களுக்கு அமோகமான நாள். எதிர்ப்புகள் விலகும். உடல் ஆரோக்கியம் மேம்படும். செய்யும் தொழிலில் லாபம் கூடும்.'),
        caution: 'அடுத்தவர் விஷயங்களில் தலையிட வேண்டாம்.',
        remedy: 'பெருமாள் அல்லது விஷ்ணுவை வழிபடவும்.',
        luckyColor: 'பச்சை (Green)',
        luckyNumber: '5, 8',
        winTheDay: appendWin('உங்கள் திட்டங்களை செயல்படுத்த இது சரியான நேரம். முழு ஈடுபாட்டுடன் செயல்படுங்கள்.')
      };
    case 7:
      return {
        status: 'Good',
        prediction: appendTara('கணவன் மனைவிக்குள் அன்பு அதிகரிக்கும். நண்பர்கள் மூலம் நல்ல செய்திகள் வரும். சுவையான உணவுகளை உண்பீர்கள்.'),
        caution: 'புதிய அறிமுகங்களிடம் அந்தரங்க விஷயங்களை பகிர வேண்டாம்.',
        remedy: 'மகாலட்சுமி அல்லது சுக்கிரனை வழிபடவும்.',
        luckyColor: 'வெள்ளை அல்லது வெள்ளி (Silver)',
        luckyNumber: '6',
        winTheDay: appendWin('உங்கள் அன்புக்குரியவர்களுடன் நேரத்தை செலவிடுங்கள். மகிழ்ச்சியான மனநிலை அனைத்தையும் சாதிக்கும்.')
      };
    case 8:
      return {
        status: 'Chandrashtamam',
        prediction: appendTara('இன்று உங்களுக்கு சந்திராஷ்டமம். எந்த ஒரு காரியத்திலும் அதிக கவனம் தேவை. புதிய முயற்சிகளை முற்றிலும் தவிர்க்கவும்.'),
        caution: 'கடுமையான வாக்குவாதங்களை தவிர்க்கவும். பயணங்களை தள்ளிப்போடுவது நல்லது. யாரிடமும் ஜாமீன் கையெழுத்து போட வேண்டாம்.',
        remedy: 'குலதெய்வ வழிபாடு அவசியம். சிவபெருமானுக்கு வில்வ இலை அர்ச்சனை செய்யவும்.',
        luckyColor: 'நீலம் (Blue) தவிர்க்கவும்',
        luckyNumber: 'ஏதுமில்லை',
        winTheDay: appendWin('அமைதியாக இருப்பது மட்டுமே இன்றைய தாரக மந்திரம். தேவையற்ற விவாதங்களை தவிர்க்கவும்.')
      };
    case 9:
      return {
        status: 'Mixed',
        prediction: appendTara('தந்தை வழியில் சிறு கருத்து வேறுபாடுகள் வரலாம். ஆன்மீக நாட்டம் அதிகரிக்கும். சிறு தூர பயணங்கள் உண்டு.'),
        caution: 'முக்கிய ஆவணங்களில் கையெழுத்திடும் முன் சரிபார்க்கவும்.',
        remedy: 'பழனி முருகன் அல்லது தர்மசாஸ்தாவை வழிபடவும்.',
        luckyColor: 'பொன்னிறம் (Gold)',
        luckyNumber: '1, 9',
        winTheDay: appendWin('ஆன்மீக சிந்தனையில் நேரத்தை செலவிடுங்கள். அமைதியாக முடிவுகளை எடுங்கள்.')
      };
    case 10:
      return {
        status: 'Excellent',
        prediction: appendTara('பணியிடத்தில் உங்கள் மதிப்பு கூடும். மேல் அதிகாரிகளின் பாராட்டு கிடைக்கும். நினைத்த காரியங்கள் எளிதில் கைகூடும்.'),
        caution: 'அதிக வேலைப்பளுவை ஏற்க வேண்டாம்.',
        remedy: 'சிவாலயம் சென்று வழிபடுவது நன்மையை தரும்.',
        luckyColor: 'ஆரஞ்சு (Orange)',
        luckyNumber: '1',
        winTheDay: appendWin('தலைமைப் பண்பை வெளிப்படுத்துங்கள். உங்களை நிரூபிக்க இது சிறந்த நாள்.')
      };
    case 11:
      return {
        status: 'Excellent',
        prediction: appendTara('தொழிலில் நல்ல லாபம் கிடைக்கும். மூத்த சகோதரர் வழியில் ஆதரவு கிடைக்கும். மனம் மகிழ்ச்சியாக இருக்கும்.'),
        caution: 'ஆடம்பர செலவுகளை குறைக்கவும்.',
        remedy: 'சனி பகவானுக்கு எள் தீபம் ஏற்றவும்.',
        luckyColor: 'கருநீலம் (Dark Blue)',
        luckyNumber: '8',
        winTheDay: appendWin('புதிய வாய்ப்புகளை தேடிப் பிடித்து பயன்படுத்துங்கள். அதிர்ஷ்டம் உங்கள் பக்கம்.')
      };
    case 12:
      return {
        status: 'Caution',
        prediction: appendTara('வீண் செலவுகள் ஏற்படும் நாளாகும். தூக்கமின்மை மற்றும் உடல் சோர்வு உண்டாகலாம். ஆன்மீக செலவுகள் இருக்கும்.'),
        caution: 'எதிர்பாராத மருத்துவ செலவுகள் வரலாம். ஆரோக்கியத்தில் கவனம் தேவை.',
        remedy: 'பைரவர் வழிபாடு அல்லது துர்க்கை அம்மன் வழிபாடு நன்மையை தரும்.',
        luckyColor: 'சாம்பல் நிறம் (Grey)',
        luckyNumber: '7',
        winTheDay: appendWin('செலவுகளை கட்டுப்படுத்தி, உங்கள் உடலையும் மனதையும் ஓய்வாக வையுங்கள்.')
      };
    default:
      return {
        status: 'Mixed',
        prediction: appendTara('சாதாரண நாளாக அமையும்.'),
        caution: 'கவனம் தேவை.',
        remedy: 'குலதெய்வ வழிபாடு.',
        luckyColor: 'வெள்ளை',
        luckyNumber: '1',
        winTheDay: appendWin('அமைதியாக நாளை கடத்துங்கள்.')
      };
  }
};
