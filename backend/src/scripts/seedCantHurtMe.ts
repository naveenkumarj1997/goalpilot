import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const cantHurtMeBook = {
  title: 'Can\'t Hurt Me: Master Your Mind and Defy the Odds',
  author: 'David Goggins',
  coverImage: 'https://m.media-amazon.com/images/I/81gTRv2HXrL._AC_UF1000,1000_QL80_.jpg',
  categories: ['Biography', 'Self-Help', 'Motivation'],
  themes: [
    { en: 'Mental Toughness', ta: 'மன உறுதி' },
    { en: 'Overcoming Adversity', ta: 'துன்பங்களை வெல்வது' }
  ],
  overview: {
    en: 'For David Goggins, childhood was a nightmare - poverty, prejudice, and physical abuse colored his days. But through self-discipline, mental toughness, and hard work, Goggins transformed himself into one of the world\'s top endurance athletes and a US Armed Forces icon.',
    ta: 'டேவிட் கோகின்ஸுக்கு குழந்தைப்பருவம் ஒரு கனவாக இருந்தது - வறுமை, பாரபட்சம் மற்றும் உடல் ரீதியான துஷ்பிரயோகம் அவரது நாட்களை இருளாக்கின. ஆனால் சுய ஒழுக்கம், மன உறுதி மற்றும் கடின உழைப்பின் மூலம், உலகின் தலைசிறந்த சகிப்புத்தன்மை கொண்ட விளையாட்டு வீரர்களில் ஒருவராகவும், அமெரிக்க ஆயுதப் படைகளின் ஐகானாகவும் கோகின்ஸ் தன்னை மாற்றிக் கொண்டார்.'
  },
  topQuotes: [
    { en: 'You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.', ta: 'உங்கள் உண்மையான திறனை உணராமலேயே இறந்துவிடும் அளவுக்கு மிகவும் வசதியான மற்றும் மென்மையான வாழ்க்கையை வாழும் ஆபத்தில் நீங்கள் இருக்கிறீர்கள்.' },
    { en: 'The only thing more contagious than a good attitude is a bad one.', ta: 'நல்ல மனப்பான்மையை விட எளிதில் பரவக்கூடியது மோசமான மனப்பான்மை மட்டுமே.' },
    { en: 'Don\'t stop when you\'re tired. Stop when you\'re done.', ta: 'நீங்கள் சோர்வடையும் போது நிற்க வேண்டாம். நீங்கள் முடித்ததும் நில்லுங்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Accountability Mirror', ta: 'பொறுப்புக்கூறும் கண்ணாடி' },
      explanation: { en: 'Stand in front of a mirror and tell yourself the brutal truth about where you are in life. Don\'t sugarcoat your weaknesses or failures.', ta: 'கண்ணாடியின் முன் நின்று, உங்கள் வாழ்க்கையில் நீங்கள் இருக்கும் நிலையைப் பற்றிய கடுமையான உண்மையை நீங்களே சொல்லுங்கள். உங்கள் பலவீனங்களையோ தோல்விகளையோ இனிமையாக்காதீர்கள்.' },
      whyItMatters: { en: 'You cannot fix a problem you refuse to acknowledge. Radical honesty is the first step to self-improvement.', ta: 'நீங்கள் ஏற்றுக்கொள்ள மறுக்கும் ஒரு பிரச்சனையை உங்களால் சரிசெய்ய முடியாது. தீவிரமான நேர்மையே சுய முன்னேற்றத்திற்கான முதல் படியாகும்.' },
      example: { en: 'Instead of saying "I\'m big-boned," Goggins looked in the mirror and said, "You are fat, and you need to lose weight to join the SEALs."', ta: '"நான் பெரிய எலும்பு கொண்டவன்" என்று சொல்வதற்குப் பதிலாக, கோகின்ஸ் கண்ணாடியில் பார்த்து, "நீ குண்டாக இருக்கிறாய், சீல்ஸ் படையில் சேர நீ உடல் எடையைக் குறைக்க வேண்டும்" என்றார்.' },
      actionStep: { en: 'Write your current weaknesses on sticky notes and put them on your mirror. Look at them daily and hold yourself accountable to fix them.', ta: 'உங்கள் தற்போதைய பலவீனங்களை குறிப்புத் தாள்களில் எழுதி உங்கள் கண்ணாடியில் ஒட்டவும். தினசரி அவற்றைப் பார்த்து, அவற்றைச் சரிசெய்ய உங்களைப் பொறுப்பாக்கிக் கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'What lie have you been telling yourself to avoid facing a difficult truth?', ta: 'கடினமான உண்மையை எதிர்கொள்வதைத் தவிர்ப்பதற்காக உங்களுக்கு நீங்களே என்ன பொய் சொல்லிக் கொண்டிருக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The 40% Rule', ta: '40% விதி' },
      explanation: { en: 'When your mind tells you that you are completely exhausted and cannot go any further, you are actually only at 40% of your maximum capacity.', ta: 'நீங்கள் முற்றிலும் சோர்வடைந்துவிட்டீர்கள், இனிமேலும் செல்ல முடியாது என்று உங்கள் மனம் சொல்லும்போது, நீங்கள் உண்மையில் உங்கள் அதிகபட்ச திறனில் 40% மட்டுமே இருக்கிறீர்கள்.' },
      whyItMatters: { en: 'Our brains are wired for survival and comfort, so they scream "stop" long before our bodies actually need to. Pushing past this barrier unlocks your true potential.', ta: 'நமது மூளை உயிர்வாழ்வதற்கும் வசதிக்கும் ஏற்றவாறு வடிவமைக்கப்பட்டுள்ளது, எனவே நமது உடலுக்கு உண்மையாக தேவைப்படுவதற்கு முன்பே அவை "நிறுத்து" என்று கத்துகின்றன. இந்தத் தடையைத் தாண்டிச் செல்வது உங்கள் உண்மையான திறனைத் திறக்கிறது.' },
      example: { en: 'Running a marathon and hitting "the wall" at mile 20. Your brain says stop, but your body can physically finish the last 6.2 miles if you force it.', ta: 'மாரத்தான் ஓடி 20வது மைலில் "சுவரை" அடைவது. உங்கள் மூளை நிற்கச் சொல்கிறது, ஆனால் நீங்கள் கட்டாயப்படுத்தினால் உங்கள் உடல் மீதமுள்ள 6.2 மைல்களை முடிக்க முடியும்.' },
      actionStep: { en: 'The next time you want to quit an exercise or a difficult task, force yourself to do 10% more than you originally planned.', ta: 'அடுத்த முறை நீங்கள் ஒரு உடற்பயிற்சி அல்லது கடினமான பணியை விட்டுவிட விரும்பினால், நீங்கள் முதலில் திட்டமிட்டதை விட 10% அதிகமாகச் செய்ய உங்களை வற்புறுத்துங்கள்.' },
      reflectionQuestion: { en: 'Do you usually quit when it gets hard, or when you are truly finished?', ta: 'அது கடினமாகும்போது நீங்கள் வழக்கமாக விட்டுவிடுகிறீர்களா, அல்லது நீங்கள் உண்மையிலேயே முடித்தவுடன் நிறுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Callusing Your Mind', ta: 'உங்கள் மனதைக் கடினமாக்குவது' },
      explanation: { en: 'Just like hands get callused from hard physical labor, your mind gets callused (resilient) by repeatedly exposing it to discomfort and suffering.', ta: 'கடினமான உடல் உழைப்பால் கைகள் எப்படி தழும்பேறுகிறதோ, அதேபோல உங்கள் மனதை மீண்டும் மீண்டும் அசௌகரியம் மற்றும் துன்பங்களுக்கு உட்படுத்துவதன் மூலம் அது தழும்பேறுகிறது (மீள்திறன் பெறுகிறது).' },
      whyItMatters: { en: 'A callused mind doesn\'t panic when things go wrong; it stays calm and finds a way to push through the pain.', ta: 'காரியங்கள் தவறாக நடக்கும்போது கடினமான மனம் பீதியடையாது; அது அமைதியாக இருந்து வலியைத் தாண்டிச் செல்ல ஒரு வழியைக் கண்டுபிடிக்கிறது.' },
      example: { en: 'Doing an activity you hate every single day (like waking up at 4 AM or taking a cold shower) just to train your mind to tolerate discomfort.', ta: 'உங்கள் மனதை அசௌகரியத்தைத் தாங்கிக்கொள்ளப் பழக்கப்படுத்துவதற்காகவே, நீங்கள் வெறுக்கும் ஒரு செயலை (அதிகாலை 4 மணிக்கு எழுவது அல்லது குளிர்ந்த நீரில் குளிப்பது போல) தினமும் செய்வது.' },
      actionStep: { en: 'Pick one thing you hate doing and do it every day for a week specifically to build mental toughness.', ta: 'நீங்கள் செய்ய வெறுக்கும் ஒன்றைத் தேர்ந்தெடுத்து, மன உறுதியை வளர்ப்பதற்காகவே ஒரு வாரம் தினமும் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'How often do you intentionally step outside of your comfort zone just to toughen your mind?', ta: 'உங்கள் மனதைக் கடினமாக்குவதற்காக மட்டுமே நீங்கள் எவ்வளவு அடிக்கடி உங்கள் சௌகரிய வட்டத்திற்கு வெளியே அடியெடுத்து வைக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Taking Souls', ta: 'ஆன்மாக்களைக் கைப்பற்றுவது' },
      explanation: { en: 'When facing an opponent, an instructor, or a difficult task, push yourself so hard that you earn their ultimate respect and break their will to defeat you.', ta: 'ஒரு எதிரியை, ஒரு பயிற்றுவிப்பாளரை அல்லது ஒரு கடினமான பணியை எதிர்கொள்ளும்போது, அவர்களின் முழுமையான மரியாதையைப் பெறவும், உங்களை தோற்கடிக்க வேண்டும் என்ற அவர்களின் எண்ணத்தை உடைக்கவும் உங்களை மிகவும் கடினமாகத் தள்ளுங்கள்.' },
      whyItMatters: { en: 'It shifts the power dynamic. Instead of being the victim of a hard situation, you become the master of it by outworking everyone else.', ta: 'இது அதிகார இயக்கவியலை மாற்றுகிறது. கடினமான சூழ்நிலைக்கு பலியாகாமல், மற்ற அனைவரையும் விட அதிகமாக உழைப்பதன் மூலம் நீங்கள் அதன் எஜமானராக ஆகிறீர்கள்.' },
      example: { en: 'During Hell Week, Goggins and his boat crew did extra pushups just to show the instructors that their punishments couldn\'t break them.', ta: 'நரக வாரத்தின் போது, பயிற்றுவிப்பாளர்களின் தண்டனைகள் தங்களை உடைக்க முடியாது என்பதைக் காட்டுவதற்காக கோகின்ஸும் அவரது படகுக் குழுவினரும் கூடுதல் புஷ்அப்களைச் செய்தனர்.' },
      actionStep: { en: 'In your next competitive or difficult situation, go above and beyond the expected standard just to prove to yourself (and others) that you cannot be broken.', ta: 'உங்களின் அடுத்த போட்டி அல்லது கடினமான சூழ்நிலையில், உங்களை உடைக்க முடியாது என்பதை உங்களுக்கு (மற்றும் பிறருக்கு) நிரூபிக்க, எதிர்பார்க்கப்படும் தரத்திற்கு மேல் செல்லுங்கள்.' },
      reflectionQuestion: { en: 'Do you shrink under pressure, or do you rise up to intimidate the pressure itself?', ta: 'நீங்கள் அழுத்தத்தின் கீழ் சுருங்குகிறீர்களா, அல்லது அழுத்தத்தையே அச்சுறுத்த மேலே எழுகிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The Cookie Jar', ta: 'குக்கீ ஜாடி' },
      explanation: { en: 'A mental concept where you store all your past victories, moments you overcame adversity, and times you succeeded when the odds were against you.', ta: 'இது ஒரு மனக் கருத்து, அங்கு உங்களின் கடந்த கால வெற்றிகள், நீங்கள் துன்பங்களை வென்ற தருணங்கள் மற்றும் உங்களுக்கு எதிராக முரண்பாடுகள் இருந்தபோது நீங்கள் வெற்றி பெற்ற நேரங்கள் அனைத்தையும் சேமித்து வைக்கிறீர்கள்.' },
      whyItMatters: { en: 'When you are in the middle of a struggle and want to quit, you reach into the "Cookie Jar" to remind yourself of what you are capable of.', ta: 'நீங்கள் ஒரு போராட்டத்தின் நடுவில் இருக்கும்போது, அதை விட்டுவிட விரும்பினால், உங்களால் என்ன முடியும் என்பதை உங்களுக்கு நினைவூட்ட "குக்கீ ஜாடியை" அடைகிறீர்கள்.' },
      example: { en: 'Remembering the time you passed a terribly difficult exam when you feel like quitting a tough project at work.', ta: 'வேலையில் ஒரு கடினமான திட்டத்தை விட்டுவிடலாம் என்று நீங்கள் நினைக்கும் போது, மிகவும் கடினமான தேர்வில் நீங்கள் தேர்ச்சி பெற்ற நேரத்தை நினைவில் கொள்வது.' },
      actionStep: { en: 'Write down a list of your top 5 life accomplishments and hardest moments you survived. Read this list when you feel like giving up.', ta: 'உங்களின் சிறந்த 5 வாழ்க்கைச் சாதனைகள் மற்றும் நீங்கள் தப்பிப்பிழைத்த கடினமான தருணங்களின் பட்டியலை எழுதுங்கள். விட்டுவிடத் தோன்றும் போது இந்தப் பட்டியலைப் படிக்கவும்.' },
      reflectionQuestion: { en: 'What is the most difficult thing you have ever survived that you can use as fuel today?', ta: 'இன்று எரிபொருளாக நீங்கள் பயன்படுத்தக்கூடிய, நீங்கள் இதுவரை தப்பிப்பிழைத்த மிகக் கடினமான விஷயம் எது?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Embrace the Suck', ta: 'கடினமானதை ஏற்றுக்கொள்ளுங்கள்' },
      explanation: { en: 'Accept that growth and achievement require suffering. Don\'t run from the pain; lean into it and make peace with it.', ta: 'வளர்ச்சிக்கும் சாதனைக்கும் துன்பம் தேவை என்பதை ஏற்றுக்கொள்ளுங்கள். வலியை விட்டு ஓடாதீர்கள்; அதை நோக்கிச் சாய்ந்து அதனுடன் சமாதானம் செய்யுங்கள்.' },
      whyItMatters: { en: 'If you constantly seek comfort, you will never grow. Greatness is forged in the fire of suffering.', ta: 'நீங்கள் தொடர்ந்து வசதியைத் தேடினால், நீங்கள் ஒருபோதும் வளர மாட்டீர்கள். துன்பம் என்ற நெருப்பில்தான் மகத்துவம் உருவாக்கப்படுகிறது.' },
      example: { en: 'Running a 100-mile race with broken bones in his feet because Goggins knew the suffering was necessary to reach his goal.', ta: 'தனது இலக்கை அடைய துன்பம் அவசியம் என்று கோகின்ஸுக்குத் தெரிந்ததால், கால்களில் உடைந்த எலும்புகளுடன் 100 மைல் ஓட்டப்பந்தயத்தில் ஓடியது.' },
      actionStep: { en: 'When facing a difficult task today, say out loud, "This is going to suck, and I am going to do it anyway."', ta: 'இன்று ஒரு கடினமான பணியை எதிர்கொள்ளும்போது, "இது கடினமாக இருக்கப்போகிறது, ஆனாலும் நான் இதைச் செய்யப்போகிறேன்" என்று சத்தமாகச் சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Are you structuring your life to avoid pain, or to achieve greatness despite the pain?', ta: 'வலியைத் தவிர்ப்பதற்காக உங்கள் வாழ்க்கையை அமைத்துக்கொள்கிறீர்களா, அல்லது வலி இருந்தபோதிலும் மகத்துவத்தை அடையவா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Nobody is Coming to Save You', ta: 'உங்களைக் காப்பாற்ற யாரும் வரப்போவதில்லை' },
      explanation: { en: 'You are the only person responsible for your life. Stop waiting for a hero, a lucky break, or for someone to fix your problems.', ta: 'உங்கள் வாழ்க்கைக்கு நீங்களே பொறுப்பு. ஒரு நாயகனுக்காகவோ, அதிர்ஷ்டத்திற்காகவோ அல்லது உங்கள் பிரச்சனைகளை யாராவது சரிசெய்வார்கள் என்றோ காத்திருப்பதை நிறுத்துங்கள்.' },
      whyItMatters: { en: 'Victim mentality paralyzes you. Taking 100% extreme ownership empowers you to change your circumstances.', ta: 'பலியானவர் என்ற மனநிலை உங்களை முடக்குகிறது. 100% தீவிர உரிமையை எடுத்துக்கொள்வது உங்கள் சூழ்நிலைகளை மாற்ற உங்களுக்கு அதிகாரம் அளிக்கிறது.' },
      example: { en: 'Goggins realized his abusive father wasn\'t coming back to apologize, and the world didn\'t owe him anything. He had to save himself.', ta: 'தன்னைத் துன்புறுத்திய தந்தை மன்னிப்பு கேட்க வரப்போவதில்லை என்பதையும், உலகம் தனக்கு எதுவும் கடன்படவில்லை என்பதையும் கோகின்ஸ் உணர்ந்தார். அவர் தன்னைத்தானே காப்பாற்றிக்கொள்ள வேண்டியிருந்தது.' },
      actionStep: { en: 'Identify one area of your life where you are blaming others. Take full responsibility for fixing it today.', ta: 'உங்கள் வாழ்க்கையில் நீங்கள் மற்றவர்களைக் குறை கூறும் ஒரு பகுதியைக் கண்டறியவும். இன்று அதைச் சரிசெய்வதற்கான முழுப் பொறுப்பையும் ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you waiting for permission or help to start chasing your dreams?', ta: 'உங்கள் கனவுகளைத் துரத்தத் தொடங்க அனுமதி அல்லது உதவிக்காகக் காத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'The Governor', ta: 'ஆளுநர்' },
      explanation: { en: 'Cars have a "governor" that stops them from going over a certain speed to prevent damage. Your brain has a governor too, telling you to stop when you feel pain or fatigue.', ta: 'கார்களில் சேதத்தைத் தடுக்க ஒரு குறிப்பிட்ட வேகத்திற்கு மேல் செல்வதைத் தடுக்கும் "ஆளுநர்" உள்ளது. வலி அல்லது சோர்வை உணரும்போது நிறுத்தச் சொல்லும் ஒரு ஆளுநர் உங்கள் மூளையிலும் உள்ளது.' },
      whyItMatters: { en: 'Your physical limits are much higher than your mental limits. You have to consciously override your brain\'s governor to reach your true peak.', ta: 'உங்கள் மன வரம்புகளை விட உங்களின் உடல் வரம்புகள் மிக அதிகம். உங்களின் உண்மையான உச்சத்தை அடைய உங்கள் மூளையின் ஆளுநரை நீங்கள் நனவுடன் மீற வேண்டும்.' },
      example: { en: 'Doing 100 pull-ups. When your brain says "I can\'t do one more" at 70, you acknowledge the pain and force yourself to do 30 more.', ta: '100 புல்-அப்களைச் செய்வது. 70-ல் உங்கள் மூளை "என்னால் இன்னொன்று செய்ய முடியாது" என்று சொல்லும்போது, வலியை ஏற்றுக்கொண்டு உங்களை நீங்களே கட்டாயப்படுத்தி மேலும் 30 செய்யுங்கள்.' },
      actionStep: { en: 'Next time you do a repetitive task and want to quit, consciously tell your "governor" to shut up and do 5 more reps.', ta: 'அடுத்த முறை நீங்கள் மீண்டும் மீண்டும் செய்யும் ஒரு பணியைச் செய்து அதை விட்டுவிட விரும்பும்போது, உங்கள் "ஆளுநரை" வாயை மூடிக்கொண்டு மேலும் 5 முறை செய்யும்படி நனவுடன் சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Is it your body that is truly failing, or is it just your mind giving up early?', ta: 'உண்மையிலேயே தோல்வியடைவது உங்கள் உடலா, அல்லது உங்கள் மனம் முன்னதாகவே விட்டுவிடுகிறதா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Schedule Your Suffering', ta: 'உங்கள் துன்பத்தைத் திட்டமிடுங்கள்' },
      explanation: { en: 'Discipline isn\'t about doing what you want when you feel like it. It\'s about doing what you hate, exactly when it’s scheduled.', ta: 'ஒழுக்கம் என்பது உங்களுக்குத் தோன்றும் போது நீங்கள் விரும்புவதைச் செய்வது அல்ல. நீங்கள் வெறுப்பதை, அது திட்டமிடப்பட்ட நேரத்தில் சரியாகச் செய்வது.' },
      whyItMatters: { en: 'Motivation comes and goes, but a relentless schedule builds unbreakable discipline.', ta: 'உந்துதல் வரும் போகும், ஆனால் ஒரு இடைவிடாத அட்டவணை உடைக்க முடியாத ஒழுக்கத்தை உருவாக்குகிறது.' },
      example: { en: 'Goggins scheduled his workouts at 3 AM so he could still spend time with his family and go to work, leaving no room for excuses.', ta: 'கோகின்ஸ் தனது உடற்பயிற்சிகளை அதிகாலை 3 மணிக்குத் திட்டமிட்டார், இதனால் அவர் தனது குடும்பத்துடன் நேரத்தைச் செலவிடவும் வேலைக்குச் செல்லவும் முடிந்தது, சாக்குப்போக்குகளுக்கு இடமளிக்கவில்லை.' },
      actionStep: { en: 'Schedule every hour of your day, including a specific time for a difficult task (like working out), and stick to it no matter how you feel.', ta: 'உங்கள் நாளின் ஒவ்வொரு மணிநேரத்தையும் திட்டமிடுங்கள், அதில் ஒரு கடினமான பணிக்கான (உடற்பயிற்சி செய்வது போல) குறிப்பிட்ட நேரத்தையும் சேர்த்து, நீங்கள் எப்படி உணர்ந்தாலும் அதைக் கடைப்பிடிக்கவும்.' },
      reflectionQuestion: { en: 'Do you run your schedule, or does your mood run your schedule?', ta: 'நீங்கள் உங்கள் அட்டவணையை இயக்குகிறீர்களா, அல்லது உங்கள் மனநிலை உங்கள் அட்டவணையை இயக்குகிறதா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Outwork Your Doubts', ta: 'உங்கள் சந்தேகங்களை மிஞ்சி உழையுங்கள்' },
      explanation: { en: 'The only way to silence self-doubt is through undeniable, overwhelming effort and preparation.', ta: 'சுய சந்தேகத்தை அமைதிப்படுத்துவதற்கான ஒரே வழி மறுக்க முடியாத, அதீத முயற்சி மற்றும் தயாரிப்பு மட்டுமே.' },
      whyItMatters: { en: 'Confidence isn\'t given; it is earned through blood, sweat, and tears. You can\'t fake true confidence.', ta: 'நம்பிக்கை கொடுக்கப்படுவதில்லை; அது இரத்தம், வியர்வை மற்றும் கண்ணீர் மூலம் சம்பாதிக்கப்படுகிறது. உண்மையான நம்பிக்கையை உங்களால் போலியாக உருவாக்க முடியாது.' },
      example: { en: 'Studying so hard for a test that it is mathematically impossible for you to fail, removing all anxiety.', ta: 'ஒரு தேர்வுக்காக மிகவும் கடினமாகப் படிப்பது, நீங்கள் தோல்வியடைவது கணித ரீதியாக சாத்தியமற்றது என்ற நிலையை அடைந்து, எல்லா கவலைகளையும் நீக்குவது.' },
      actionStep: { en: 'Identify a goal you are insecure about and double the amount of time you are currently spending preparing for it.', ta: 'நீங்கள் பாதுகாப்பற்றதாக உணரும் ஒரு இலக்கைக் கண்டறிந்து, அதற்காக நீங்கள் தற்போது செலவிடும் தயாரிப்பு நேரத்தை இரட்டிப்பாக்குங்கள்.' },
      reflectionQuestion: { en: 'Are your doubts a result of a lack of talent, or simply a lack of preparation?', ta: 'உங்கள் சந்தேகங்கள் திறமையின்மையின் விளைவா, அல்லது வெறுமனே தயாரிப்பின்மையா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Be Uncommon Amongst Uncommon People', ta: 'அசாதாரணமானவர்களிடையேயும் அசாதாரணமாக இருங்கள்' },
      explanation: { en: 'Don\'t settle for being the best among average people. Strive to be the best among the elite.', ta: 'சாதாரண மக்களிடையே சிறந்தவராக இருப்பதோடு திருப்தி அடையாதீர்கள். மேல்தட்டு மக்களிடையே சிறந்தவராக இருக்க முயற்சி செய்யுங்கள்.' },
      whyItMatters: { en: 'Comfort is the enemy of progress. If you are the smartest/toughest person in the room, you are in the wrong room.', ta: 'வசதி என்பது முன்னேற்றத்தின் எதிரி. அறையில் உள்ள மிகவும் புத்திசாலி/கடினமான நபர் நீங்கள்தான் என்றால், நீங்கள் தவறான அறையில் இருக்கிறீர்கள்.' },
      example: { en: 'After becoming a Navy SEAL (elite), Goggins went on to become an Army Ranger and an ultra-marathon runner, constantly seeking harder rooms.', ta: 'கடற்படை சீல் (மேல்தட்டு) ஆன பிறகு, கோகின்ஸ் ராணுவ ரேஞ்சராகவும், அல்ட்ரா-மாரத்தான் ஓட்டப்பந்தய வீரராகவும் ஆனார், தொடர்ந்து கடினமான அறைகளைத் தேடினார்.' },
      actionStep: { en: 'Find a new group, gym, or mentor that makes you feel like a beginner again, and let them push you to a new standard.', ta: 'உங்களை மீண்டும் ஒரு தொடக்கக்காரராக உணரவைக்கும் புதிய குழு, உடற்பயிற்சி கூடம் அல்லது வழிகாட்டியைக் கண்டறிந்து, அவர்கள் உங்களை ஒரு புதிய தரத்திற்குத் தள்ள அனுமதிக்கவும்.' },
      reflectionQuestion: { en: 'Have you become a big fish in a small pond, and has it made you lazy?', ta: 'நீங்கள் ஒரு சிறிய குளத்தில் பெரிய மீனாக மாறிவிட்டீர்களா, அது உங்களை சோம்பேறியாக்கியுள்ளதா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Friction Generates Growth', ta: 'உராய்வு வளர்ச்சியை உருவாக்குகிறது' },
      explanation: { en: 'Just like a muscle needs the friction of heavy weights to tear and grow stronger, your mind needs the friction of adversity to grow.', ta: 'கனமான எடைகளின் உராய்வால் தசை கிழிந்து வலுவடைவது போல, உங்கள் மனமும் வளர துன்பத்தின் உராய்வு தேவை.' },
      whyItMatters: { en: 'Smooth seas do not make skillful sailors. Embrace the difficult times as mandatory training for your future success.', ta: 'அமைதியான கடல்கள் திறமையான மாலுமிகளை உருவாக்குவதில்லை. உங்கள் எதிர்கால வெற்றிக்கான கட்டாய பயிற்சியாக கடினமான நேரங்களை ஏற்றுக்கொள்ளுங்கள்.' },
      example: { en: 'Failing the ASVAB test twice forced Goggins to study harder than he ever had in his life, teaching him how to learn.', ta: 'ASVAB தேர்வில் இரண்டு முறை தோல்வியடைந்தது கோகின்ஸை தனது வாழ்க்கையில் முன்னெப்போதும் இல்லாததை விட கடினமாக படிக்க வற்புறுத்தியது, எப்படி கற்றுக்கொள்வது என்பதை அவருக்குக் கற்றுக் கொடுத்தது.' },
      actionStep: { en: 'Instead of complaining about a current obstacle, write down exactly how this obstacle is forcing you to upgrade your skills.', ta: 'தற்போதைய தடையைப் பற்றி புகார் கூறுவதற்குப் பதிலாக, இந்தத் தடை உங்கள் திறன்களை மேம்படுத்த உங்களை எவ்வாறு கட்டாயப்படுத்துகிறது என்பதைத் துல்லியமாக எழுதுங்கள்.' },
      reflectionQuestion: { en: 'What recent failure actually gave you the exact lesson you needed to succeed?', ta: 'சமீபத்திய எந்தத் தோல்வி நீங்கள் வெற்றிபெறத் தேவையான சரியான பாடத்தை உங்களுக்கு வழங்கியது?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'The Empowerment of Failure', ta: 'தோல்வியின் அதிகாரமளித்தல்' },
      explanation: { en: 'Failure is not the end; it is merely a data point. Use it to conduct an After Action Report (AAR) to figure out what went wrong and try again.', ta: 'தோல்வி என்பது முடிவல்ல; அது வெறும் ஒரு தரவுப் புள்ளி. என்ன தவறு நடந்தது என்பதைக் கண்டறிந்து மீண்டும் முயற்சிக்க, செயலுக்குப் பிந்தைய அறிக்கையை (AAR) நடத்த அதைப் பயன்படுத்தவும்.' },
      whyItMatters: { en: 'Fear of failure stops most people from even trying. But analyzing failure removes the emotion and leaves only logic.', ta: 'தோல்வி பயம் பெரும்பாலான மக்களை முயற்சி செய்வதிலிருந்தே தடுக்கிறது. ஆனால் தோல்வியை பகுப்பாய்வு செய்வது உணர்ச்சியை அகற்றி தர்க்கத்தை மட்டுமே விட்டுவிடுகிறது.' },
      example: { en: 'Goggins failed the pull-up world record twice on national television before finally breaking it on his third attempt.', ta: 'கோகின்ஸ் தேசிய தொலைக்காட்சியில் இரண்டு முறை புல்-அப் உலக சாதனையை முறியடிக்கத் தவறி, இறுதியாக தனது மூன்றாவது முயற்சியில் அதை முறியடித்தார்.' },
      actionStep: { en: 'Do an After Action Report on a recent failure: Write down 1. What went well? 2. What went wrong? 3. How will you fix it next time?', ta: 'சமீபத்திய தோல்வி குறித்து செயலுக்குப் பிந்தைய அறிக்கையைச் செய்யுங்கள்: 1. எது நன்றாக நடந்தது? 2. எது தவறாக நடந்தது? 3. அடுத்த முறை அதை எப்படி சரிசெய்வீர்கள்? என எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Have you let a past failure define you, instead of letting it teach you?', ta: 'கடந்த கால தோல்வி உங்களைக் கற்றுக்கொடுக்க அனுமதிப்பதற்குப் பதிலாக, அது உங்களை வரையறுக்க அனுமதித்துள்ளீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Own Your Story', ta: 'உங்கள் கதையை சொந்தமாக்குங்கள்' },
      explanation: { en: 'Stop hiding your trauma, your past, and your insecurities. Own everything that has happened to you, good and bad, and use it as armor.', ta: 'உங்கள் அதிர்ச்சி, கடந்த காலம் மற்றும் பாதுகாப்பின்மை ஆகியவற்றை மறைப்பதை நிறுத்துங்கள். உங்களுக்கு நடந்த நல்லதும் கெட்டதுமான அனைத்தையும் சொந்தமாக்கிக் கொள்ளுங்கள், அதை ஒரு கவசமாகப் பயன்படுத்துங்கள்.' },
      whyItMatters: { en: 'When you accept your dark past, nobody can use it against you. It becomes the source of your strength, not your shame.', ta: 'உங்களின் இருண்ட கடந்த காலத்தை நீங்கள் ஏற்றுக்கொள்ளும்போது, எவராலும் அதை உங்களுக்கு எதிராகப் பயன்படுத்த முடியாது. அது உங்கள் வலிமையின் ஆதாரமாக மாறுகிறதே தவிர, அவமானமாக அல்ல.' },
      example: { en: 'Goggins talking openly about his abusive father and his struggles with obesity, using it to inspire millions.', ta: 'தன்னைத் துன்புறுத்திய தந்தை மற்றும் உடல் பருமனுடனான தனது போராட்டங்கள் பற்றி கோகின்ஸ் வெளிப்படையாகப் பேசியது, அதை கோடிக்கணக்கான மக்களை ஊக்குவிக்கப் பயன்படுத்தினார்.' },
      actionStep: { en: 'Share a struggle or failure you usually hide with one trusted person to take the power back from that secret.', ta: 'அந்த ரகசியத்திலிருந்து சக்தியைத் திரும்பப் பெற, நீங்கள் வழக்கமாக மறைக்கும் ஒரு போராட்டம் அல்லது தோல்வியை நம்பகமான ஒரு நபருடன் பகிர்ந்து கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you spending too much energy trying to look perfect instead of being real?', ta: 'உண்மையாக இருப்பதற்குப் பதிலாக கச்சிதமாகத் தெரிய முயற்சிப்பதில் அதிக ஆற்றலைச் செலவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Visualization for Success', ta: 'வெற்றிக்கான காட்சிப்படுத்தல்' },
      explanation: { en: 'Don\'t just visualize the finish line. Visualize the pain, the challenges, and the obstacles you will face, and visualize yourself pushing through them.', ta: 'இறுதிக்கோட்டை மட்டும் காட்சிப்படுத்த வேண்டாம். நீங்கள் எதிர்கொள்ளும் வலி, சவால்கள் மற்றும் தடைகளை கற்பனை செய்து பாருங்கள், மேலும் அவற்றைத் தாண்டிச் செல்வதை கற்பனை செய்து பாருங்கள்.' },
      whyItMatters: { en: 'Visualizing only the positive leaves you unprepared for the inevitable pain. Visualizing the struggle prepares your mind for the fight.', ta: 'நேர்மறையை மட்டும் காட்சிப்படுத்துவது தவிர்க்க முடியாத வலியை எதிர்கொள்ள உங்களைத் தயார்படுத்தாது. போராட்டத்தை கற்பனை செய்வது உங்கள் மனதை போருக்கு தயார்படுத்துகிறது.' },
      example: { en: 'Visualizing the exact moment in a race when your legs cramp and you want to quit, and deciding beforehand how you will react.', ta: 'பந்தயத்தில் உங்கள் கால்கள் பிடித்துக்கொண்டு நீங்கள் விலக விரும்பும் சரியான தருணத்தை கற்பனை செய்து, எப்படி செயல்படுவீர்கள் என்பதை முன்கூட்டியே தீர்மானிப்பது.' },
      actionStep: { en: 'Think of a goal. Now vividly imagine the worst obstacle that could happen while pursuing it, and plan your response.', ta: 'ஒரு இலக்கை எண்ணுங்கள். இப்போது அதைப் பின்தொடரும் போது ஏற்படக்கூடிய மோசமான தடையைத் தெளிவாகக் கற்பனை செய்து, உங்களின் பதிலைத் திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you only dreaming of the reward, without mentally preparing for the cost?', ta: 'செலவுக்கு மனதளவில் தயாராகாமல், வெகுமதியை மட்டும் கனவு காண்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Ignore the Naysayers', ta: 'குறை கூறுபவர்களைப் புறக்கணிப்போம்' },
      explanation: { en: 'People will tell you your goals are impossible because they are projecting their own limitations onto you. Don\'t listen.', ta: 'தங்கள் சொந்த வரம்புகளை உங்கள் மீது திணிப்பதால் உங்கள் இலக்குகள் சாத்தியமற்றது என்று மக்கள் கூறுவார்கள். கேட்காதீர்கள்.' },
      whyItMatters: { en: 'If you listen to people who have never achieved greatness, you will end up just like them: average.', ta: 'சிறந்து விளங்கியிராத மக்களின் பேச்சைக் கேட்டால், நீங்களும் அவர்களைப் போலவே சாதாரணமானவராக முடிவடைவீர்கள்.' },
      example: { en: 'Recruiters laughing at a 300-pound Goggins when he said he wanted to be a Navy SEAL.', ta: '300 பவுண்டுகள் எடையுள்ள கோகின்ஸ் தான் கடற்படை சீல் ஆக வேண்டும் என்று கூறியபோது ஆட்சேர்ப்பவர்கள் அவரைப் பார்த்துச் சிரித்தனர்.' },
      actionStep: { en: 'Identify one person whose negative opinion is holding you back, and consciously decide that their opinion no longer matters.', ta: 'உங்களைத் தடுத்து நிறுத்தும் எதிர்மறையான கருத்தைக் கொண்ட ஒருவரைக் கண்டறிந்து, அவர்களின் கருத்து இனி ஒரு பொருட்டல்ல என்று நனவுடன் முடிவு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you letting someone else\'s fear dictate what you are capable of?', ta: 'உங்களால் என்ன முடியும் என்பதை வேறொருவரின் பயம் தீர்மானிக்க அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Stretch Your Comfort Zone Daily', ta: 'உங்கள் வசதி வட்டத்தை தினமும் விரிவுபடுத்துங்கள்' },
      explanation: { en: 'Comfort is a trap. You must do something every day that makes you uncomfortable to keep your mind sharp.', ta: 'வசதி என்பது ஒரு பொறி. உங்கள் மனதைக் கூர்மையாக வைத்திருக்க தினமும் உங்களை அசௌகரியப்படுத்தும் ஒன்றை நீங்கள் செய்ய வேண்டும்.' },
      whyItMatters: { en: 'If you stop challenging yourself, your callused mind will soften, and you will lose your edge.', ta: 'உங்களுக்கு நீங்களே சவால் விடுவதை நிறுத்தினால், உங்கள் கடினமான மனம் மென்மையாகி, நீங்கள் உங்கள் கூர்மையை இழப்பீர்கள்.' },
      example: { en: 'Making your bed perfectly every morning, going for a run in the rain, or speaking up in a meeting when you are shy.', ta: 'தினமும் காலையில் உங்கள் படுக்கையைச் சரியாகச் செய்வது, மழையில் ஓடச் செல்வது அல்லது நீங்கள் வெட்கப்படும்போது கூட்டத்தில் பேசுவது.' },
      actionStep: { en: 'Choose one small, uncomfortable task to do today that you normally avoid (e.g., a cold shower, a hard conversation).', ta: 'நீங்கள் பொதுவாகத் தவிர்க்கும் ஒரு சிறிய, அசௌகரியமான பணியை இன்று செய்யத் தேர்ந்தெடுங்கள் (எ.கா., குளிர்ந்த நீரில் குளிப்பது, கடினமான உரையாடல்).' },
      reflectionQuestion: { en: 'What did you do today that was genuinely uncomfortable?', ta: 'இன்று நீங்கள் உண்மையிலேயே அசௌகரியமாக உணர்ந்த என்ன காரியத்தைச் செய்தீர்கள்?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'The Power of the Mind', ta: 'மனதின் சக்தி' },
      explanation: { en: 'Your mind is the most powerful weapon you have. It can either be your greatest ally or your worst enemy.', ta: 'உங்களிடம் உள்ள மிக சக்திவாய்ந்த ஆயுதம் உங்கள் மனமே. அது உங்களின் மிகப்பெரிய கூட்டாளியாகவோ அல்லது மோசமான எதிரியாகவோ இருக்கலாம்.' },
      whyItMatters: { en: 'Physical training is only 10% of the battle. Mental training is 90%. If your mind is weak, your body will follow.', ta: 'உடல் பயிற்சி என்பது போரின் 10% மட்டுமே. மனப் பயிற்சி 90%. உங்கள் மனம் பலவீனமாக இருந்தால், உங்கள் உடலும் அதைப் பின்பற்றும்.' },
      example: { en: 'Finishing Hell Week with broken legs purely because his mind refused to let his body quit.', ta: 'அவரது உடல் கைவிடுவதை அவரது மனம் மறுத்ததால் மட்டுமே, உடைந்த கால்களுடன் நரக வாரத்தை முடித்தார்.' },
      actionStep: { en: 'Notice your internal dialogue during a workout today. Replace every "I\'m tired" with "I am strong."', ta: 'இன்று உடற்பயிற்சியின் போது உங்களின் உள்ளக உரையாடலைக் கவனியுங்கள். ஒவ்வொரு "நான் சோர்வாக இருக்கிறேன்" என்பதையும் "நான் வலிமையாக இருக்கிறேன்" என்று மாற்றவும்.' },
      reflectionQuestion: { en: 'Is your mind currently working for you, or against you?', ta: 'உங்கள் மனம் தற்போது உங்களுக்காகச் செயல்படுகிறதா, அல்லது உங்களுக்கு எதிராகச் செயல்படுகிறதா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Stay Hard', ta: 'கடினமாக இருங்கள்' },
      explanation: { en: 'This is not a temporary phase or a 30-day challenge. It is a lifelong commitment to never settling and always pushing forward.', ta: 'இது ஒரு தற்காலிக கட்டம் அல்லது 30 நாள் சவால் அல்ல. இது ஒருபோதும் திருப்தியடையாமலும், எப்போதும் முன்னேறிச் செல்லவுமான வாழ்நாள் முழுவதுக்குமான அர்ப்பணிப்பு.' },
      whyItMatters: { en: 'There is no finish line. The moment you think you have "made it," you start losing your edge.', ta: 'எந்த முடிவுக் கோடும் இல்லை. நீங்கள் "சாதித்துவிட்டீர்கள்" என்று நினைக்கும் கணமே, நீங்கள் உங்கள் கூர்மையை இழக்கத் தொடங்குகிறீர்கள்.' },
      example: { en: 'After setting records, Goggins didn\'t retire to a beach; he looked for the next hardest thing to do, like becoming a wildland firefighter.', ta: 'சாதனைகளைப் படைத்த பிறகு, கோகின்ஸ் கடற்கரையில் ஓய்வெடுக்கச் செல்லவில்லை; காட்டுத் தீயணைப்பு வீரராக மாறுவது போன்ற அடுத்த கடினமான காரியத்தைத் தேடினார்.' },
      actionStep: { en: 'Look at the goal you just achieved. Celebrate for five minutes, then immediately set a new, harder goal.', ta: 'நீங்கள் இப்போது அடைந்த இலக்கைப் பாருங்கள். ஐந்து நிமிடம் கொண்டாடுங்கள், பிறகு உடனடியாக புதிய, கடினமான இலக்கை நிர்ணயிங்கள்.' },
      reflectionQuestion: { en: 'Are you treating your self-improvement as a destination, or as a never-ending journey?', ta: 'உங்கள் சுய முன்னேற்றத்தை ஒரு இலக்காகக் கருதுகிறீர்களா, அல்லது முடிவற்ற பயணமாகக் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Master Yourself', ta: 'உங்களை நீங்களே கட்டுப்படுத்துங்கள்' },
      explanation: { en: 'True freedom and greatness come from absolute self-mastery. Conquering your own mind is the greatest victory you can achieve.', ta: 'உண்மையான சுதந்திரமும் மகத்துவமும் முழுமையான சுய-கட்டுப்பாட்டிலிருந்து வருகின்றன. உங்களின் சொந்த மனதை வெல்வதே நீங்கள் அடையக்கூடிய மிகப்பெரிய வெற்றியாகும்.' },
      whyItMatters: { en: 'You cannot lead others, change the world, or reach your potential until you have conquered the demons in your own head.', ta: 'உங்கள் சொந்த தலையில் உள்ள அரக்கர்களை நீங்கள் வெல்லும் வரை உங்களால் மற்றவர்களை வழிநடத்தவோ, உலகத்தை மாற்றவோ அல்லது உங்கள் திறனை அடையவோ முடியாது.' },
      example: { en: 'Goggins transforming from a depressed, overweight exterminator into an icon of human potential through sheer willpower.', ta: 'மனச்சோர்வடைந்த, அதிக எடையுள்ள பூச்சி அழிப்பவரிலிருந்து, வெறும் மன உறுதியின் மூலம் மனித திறனின் சின்னமான கோகின்ஸ் மாறியது.' },
      actionStep: { en: 'Identify the one habit that has the most control over you (scrolling, sugar, snoozing). Conquer it today.', ta: 'உங்கள் மீது அதிகக் கட்டுப்பாட்டைக் கொண்ட ஒரு பழக்கத்தைக் கண்டறியவும் (ஸ்க்ரோலிங், சர்க்கரை, ஸ்னூசிங்). இன்று அதை வெல்லுங்கள்.' },
      reflectionQuestion: { en: 'Are you the master of your mind, or is your mind the master of you?', ta: 'நீங்கள் உங்கள் மனதின் எஜமானரா, அல்லது உங்கள் மனம் உங்களுக்கு எஜமானரா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Can\'t Hurt Me: Master Your Mind and Defy the Odds' });
    if (existing) {
      console.log('Can\'t Hurt Me already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Can\'t Hurt Me: Master Your Mind and Defy the Odds' });
    }
    
    await WisdomBook.create(cantHurtMeBook);
    console.log('Can\'t Hurt Me added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
