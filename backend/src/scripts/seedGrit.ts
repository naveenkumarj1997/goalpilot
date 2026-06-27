import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const gritBook = {
  title: 'Grit: The Power of Passion and Perseverance',
  author: 'Angela Duckworth',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg',
  categories: ['Psychology', 'Self-Help', 'Business'],
  themes: [
    { en: 'Perseverance', ta: 'விடாமுயற்சி' },
    { en: 'Passion', ta: 'பேரார்வம்' }
  ],
  overview: {
    en: 'Psychologist Angela Duckworth shows anyone striving to succeed that the secret to outstanding achievement is not talent, but a special blend of passion and persistence she calls "grit." She explains how grit can be learned and cultivated over time.',
    ta: 'உளவியலாளர் அஞ்சலா டக்வொர்த், வெற்றிபெறத் துடிக்கும் எவருக்கும், சிறப்பான சாதனைக்கான ரகசியம் திறமை அல்ல, மாறாக அவர் "கிரிட்" (விடாமுயற்சி) என்று அழைக்கும் பேரார்வம் மற்றும் நிலைத்தன்மையின் சிறப்பு கலவைதான் என்பதைக் காட்டுகிறார். காலப்போக்கில் கிரிட்டை எவ்வாறு கற்றுக்கொள்ளலாம் மற்றும் வளர்க்கலாம் என்பதை அவர் விளக்குகிறார்.'
  },
  topQuotes: [
    { en: 'Enthusiasm is common. Endurance is rare.', ta: 'உற்சாகம் என்பது பொதுவானது. சகிப்புத்தன்மை என்பது அரிதானது.' },
    { en: 'Our potential is one thing. What we do with it is quite another.', ta: 'நமது திறன் என்பது ஒரு விஷயம். அதை வைத்து நாம் என்ன செய்கிறோம் என்பது முற்றிலும் வேறுபட்டது.' },
    { en: 'Grit is living life like it\'s a marathon, not a sprint.', ta: 'கிரிட் என்பது வாழ்க்கையை ஒரு குறுகிய தூர ஓட்டமாக அல்லாமல், ஒரு மாரத்தானாக வாழ்வதாகும்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'What is Grit?', ta: 'கிரிட் என்றால் என்ன?' },
      explanation: { en: 'Grit is the combination of deep passion and unyielding perseverance toward long-term goals. It is about sticking with things for years, not just weeks.', ta: 'கிரிட் என்பது நீண்ட கால இலக்குகளை நோக்கிய ஆழமான பேரார்வம் மற்றும் வளைந்துகொடுக்காத விடாமுயற்சியின் கலவையாகும். இது வாரங்களுக்கு அல்லாமல், பல ஆண்டுகளாக விஷயங்களுடன் இணைந்திருப்பதாகும்.' },
      whyItMatters: { en: 'Talent alone doesn\'t guarantee success. Grit is what keeps you going when talent hits a roadblock or when enthusiasm fades.', ta: 'திறமை மட்டுமே வெற்றிக்கு உத்தரவாதம் அளிக்காது. திறமை தடையை சந்திக்கும்போதோ அல்லது உற்சாகம் மங்கும்போது உங்களைத் தொடர்ந்து இயங்க வைப்பது கிரிட்தான்.' },
      example: { en: 'A writer who gets rejected 50 times but continues to write and submit their manuscript every single day.', ta: '50 முறை நிராகரிக்கப்பட்டாலும் தொடர்ந்து எழுதி ஒவ்வொரு நாளும் தனது கையெழுத்துப் பிரதியைச் சமர்ப்பிக்கும் ஒரு எழுத்தாளர்.' },
      actionStep: { en: 'Identify one long-term goal you are working toward. Commit to working on it for just 15 minutes today, even if you don\'t feel like it.', ta: 'நீங்கள் செயல்பட்டு வரும் ஒரு நீண்ட கால இலக்கைக் கண்டறியவும். உங்களுக்கு விருப்பமில்லை என்றாலும், இன்று 15 நிமிடங்கள் அதில் வேலை செய்ய உறுதியளியுங்கள்.' },
      reflectionQuestion: { en: 'Are you treating your goals like a short sprint or a lifelong marathon?', ta: 'உங்கள் இலக்குகளை குறுகிய தூர ஓட்டமாக கருதுகிறீர்களா அல்லது வாழ்நாள் மாரத்தானாக கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The Talent Distraction', ta: 'திறமையின் கவனச்சிதறல்' },
      explanation: { en: 'Society is obsessed with "natural talent." We mistakenly believe that great achievers were simply born with gifts we don\'t possess.', ta: 'சமூகம் "இயற்கையான திறமையின்" மீது வெறி கொண்டுள்ளது. பெரும் சாதனையாளர்கள் நம்மிடம் இல்லாத வரங்களுடன் பிறந்தவர்கள் என்று நாம் தவறாக நம்புகிறோம்.' },
      whyItMatters: { en: 'Believing that success is purely based on talent gives you a convenient excuse to give up when things get hard. It minimizes the value of hard work.', ta: 'வெற்றி முற்றிலும் திறமையை அடிப்படையாகக் கொண்டது என்று நம்புவது, காரியங்கள் கடினமாகும்போது கைவிடுவதற்கு வசதியான சாக்குப்போக்கை அளிக்கிறது. இது கடின உழைப்பின் மதிப்பைக் குறைக்கிறது.' },
      example: { en: 'Looking at an Olympic swimmer and saying, "They were born to do that," ignoring the 10,000 hours they spent staring at the bottom of a pool.', ta: 'ஒரு ஒலிம்பிக் நீச்சல் வீரரைப் பார்த்து, அவர்கள் குளத்தின் அடியில் 10,000 மணிநேரம் செலவழித்ததைப் புறக்கணித்து, "அவர்கள் அதற்காகவே பிறந்தவர்கள்" என்று சொல்வது.' },
      actionStep: { en: 'Stop using "I\'m just not talented at this" as an excuse. Replace it with "I haven\'t practiced this enough yet."', ta: '"எனக்கு இதில் திறமையில்லை" என்பதை ஒரு சாக்காகப் பயன்படுத்துவதை நிறுத்துங்கள். அதற்குப் பதிலாக "நான் இன்னும் இதை போதுமான அளவு பயிற்சி செய்யவில்லை" என்று மாற்றுங்கள்.' },
      reflectionQuestion: { en: 'What is a skill you abandoned because you thought you didn\'t have the "natural talent" for it?', ta: 'உங்களுக்கு அதற்கான "இயற்கையான திறமை" இல்லை என்று நினைத்து நீங்கள் கைவிட்ட திறன் என்ன?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Effort Counts Twice', ta: 'முயற்சி இரண்டு முறை கணக்கிடப்படுகிறது' },
      explanation: { en: 'Duckworth’s formula: Talent × Effort = Skill. And then, Skill × Effort = Achievement. Effort factors into the equation twice.', ta: 'டக்வொர்த்தின் சூத்திரம்: திறமை × முயற்சி = திறன். பின்னர், திறன் × முயற்சி = சாதனை. சமன்பாட்டில் முயற்சி இரண்டு முறை கணக்கில் எடுத்துக்கொள்ளப்படுகிறது.' },
      whyItMatters: { en: 'Someone with less natural talent who puts in immense effort will ultimately achieve more than a highly talented person who is lazy.', ta: 'இயற்கையான திறமை குறைவாக இருந்து அதீத முயற்சி எடுப்பவர், சோம்பேறியாக இருக்கும் அதிக திறமையாளரை விட இறுதியில் அதிக சாதனைகளைச் செய்வார்.' },
      example: { en: 'Will Smith famously attributing his success not to acting talent, but to his ridiculous, sickening work ethic—he simply outworks everyone.', ta: 'வில் ஸ்மித் தனது வெற்றியை நடிப்புத் திறமைக்கு அல்லாமல், தனது அபத்தமான, கடினமான வேலை நெறிமுறைக்கு காரணம் என்று புகழ்ந்து கூறுவது—அவர் எல்லோரையும் விட அதிகமாக உழைக்கிறார்.' },
      actionStep: { en: 'Focus on your effort output today, not just the results. Praise yourself for the hours put in, regardless of the immediate outcome.', ta: 'இன்று முடிவுகளில் மட்டுமல்ல, உங்கள் முயற்சியின் வெளியீட்டிலும் கவனம் செலுத்துங்கள். உடனடி முடிவைப் பொருட்படுத்தாமல், செலவழித்த மணிநேரங்களுக்கு உங்களைப் பாராட்டிக் கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you relying on your natural intelligence/talent to coast through life without putting in maximum effort?', ta: 'அதிகபட்ச முயற்சியில் ஈடுபடாமல் வாழ்க்கையை நகர்த்த உங்கள் இயற்கையான புத்திசாலித்தனம்/திறமையை நீங்கள் நம்பியிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Grow Your Passion', ta: 'உங்கள் பேரார்வத்தை வளர்த்துக் கொள்ளுங்கள்' },
      explanation: { en: 'Passion is not something you "find" fully formed in a moment of epiphany. It is something you discover, develop, and deepen over time.', ta: 'பேரார்வம் என்பது ஒரு வெளிப்பாட்டுத் தருணத்தில் முழுமையாக உருவானதாக நீங்கள் "கண்டுபிடிக்கும்" ஒன்றல்ல. அது காலப்போக்கில் நீங்கள் கண்டறிந்து, வளர்த்து, ஆழப்படுத்தும் ஒன்று.' },
      whyItMatters: { en: 'Waiting for a magical "calling" to strike will leave you waiting forever. Passion requires active engagement and exploration.', ta: 'ஒரு மாயாஜால "அழைப்பு" வரும் என்று காத்திருப்பது உங்களை என்றென்றும் காத்திருக்க வைக்கும். பேரார்வத்திற்கு சுறுசுறுப்பான ஈடுபாடும் தேடலும் தேவை.' },
      example: { en: 'A master chef didn\'t taste a single dish and decide to be a chef; they cooked thousands of meals, slowly developing a deep passion for culinary arts.', ta: 'ஒரு தலைசிறந்த சமையல்காரர் ஒரு உணவை சுவைத்துவிட்டு சமையல்காரராக மாற முடிவு செய்யவில்லை; அவர்கள் ஆயிரக்கணக்கான உணவுகளை சமைத்தனர், மெதுவாக சமையல் கலைகளில் ஆழமான பேரார்வத்தை வளர்த்துக் கொண்டனர்.' },
      actionStep: { en: 'Instead of searching for a passion, pick one mild interest you have and dedicate a month to actively learning about it.', ta: 'பேரார்வத்தைத் தேடுவதற்குப் பதிலாக, உங்களுக்கிருக்கும் ஒரு சிறிய ஆர்வத்தைத் தேர்ந்தெடுத்து, அதைப் பற்றி தீவிரமாக அறிந்துகொள்ள ஒரு மாதத்தை அர்ப்பணிக்கவும்.' },
      reflectionQuestion: { en: 'Are you dismissing interests too quickly because they don\'t immediately feel like your "life\'s purpose"?', ta: 'அவை உடனடியாக உங்கள் "வாழ்க்கையின் நோக்கம்" போல் உணர்த்தவில்லை என்பதற்காக நீங்கள் ஆர்வங்களை மிக விரைவாக நிராகரிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Deliberate Practice', ta: 'திட்டமிட்ட பயிற்சி' },
      explanation: { en: 'Gritty people don\'t just practice; they do deliberate practice. They focus specifically on their weaknesses, seek immediate feedback, and repeat.', ta: 'கிரிட் உள்ளவர்கள் வெறுமனே பயிற்சி மட்டும் செய்வதில்லை; அவர்கள் திட்டமிட்ட பயிற்சி செய்கிறார்கள். அவர்கள் குறிப்பாகத் தங்கள் பலவீனங்களில் கவனம் செலுத்துகிறார்கள், உடனடி பின்னூட்டத்தைத் தேடுகிறார்கள், மீண்டும் செய்கிறார்கள்.' },
      whyItMatters: { en: 'Practicing what you are already good at is easy and fun, but it doesn\'t make you better. Growth happens only when you struggle at the edge of your abilities.', ta: 'நீங்கள் ஏற்கனவே சிறந்து விளங்கும் ஒன்றைப் பயிற்சி செய்வது எளிதானது மற்றும் வேடிக்கையானது, ஆனால் அது உங்களைச் சிறந்தவராக்காது. உங்களின் திறன்களின் விளிம்பில் நீங்கள் போராடும்போது மட்டுமே வளர்ச்சி நிகழ்கிறது.' },
      example: { en: 'A musician practicing only the difficult 10-second section of a piece over and over, rather than playing the whole song through comfortably.', ta: 'ஒரு இசைக்கலைஞர் முழுப் பாடலையும் வசதியாக வாசிப்பதை விட, பாடலின் கடினமான 10 வினாடி பகுதியை மட்டும் மீண்டும் மீண்டும் பயிற்சி செய்வது.' },
      actionStep: { en: 'Identify one specific micro-weakness in your current project or skill. Spend 20 minutes today practicing only that exact weakness.', ta: 'உங்கள் தற்போதைய திட்டம் அல்லது திறனில் உள்ள ஒரு குறிப்பிட்ட சிறிய பலவீனத்தை அடையாளம் காணவும். அந்தச் சரியான பலவீனத்தை மட்டும் பயிற்சி செய்ய இன்று 20 நிமிடங்கள் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'In your daily work, are you actually practicing to get better, or are you just repeating what you already know how to do?', ta: 'உங்களின் அன்றாட வேலையில், சிறந்து விளங்குவதற்காக நீங்கள் உண்மையிலேயே பயிற்சி செய்கிறீர்களா, அல்லது எப்படிச் செய்வது என்று உங்களுக்கு ஏற்கனவே தெரிந்ததை மட்டும் திரும்பச் செய்கிறீர்களா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Purpose Over Self', ta: 'தன்னைத் தாண்டிய நோக்கம்' },
      explanation: { en: 'True grit requires connecting your work to a purpose larger than yourself. The most gritty people see how their work helps others.', ta: 'உண்மையான கிரிட்டிற்கு உங்களை விடப் பெரிய ஒரு நோக்கத்துடன் உங்கள் வேலையை இணைப்பது தேவை. மிகவும் கிரிட் உள்ளவர்கள் தங்கள் வேலை மற்றவர்களுக்கு எப்படி உதவுகிறது என்பதைப் பார்க்கிறார்கள்.' },
      whyItMatters: { en: 'When you are only working for yourself (money, fame), you will quit when things get too painful. Helping others provides endless motivation.', ta: 'நீங்கள் உங்களுக்காக மட்டுமே வேலை செய்யும்போது (பணம், புகழ்), காரியங்கள் மிகவும் வலியாக மாறும்போது நீங்கள் விட்டுவிடுவீர்கள். மற்றவர்களுக்கு உதவுவது முடிவற்ற உந்துதலை அளிக்கிறது.' },
      example: { en: 'A bricklayer who doesn\'t say "I am laying bricks," but rather "I am building a house of God." The perspective changes the meaning of the struggle.', ta: '"நான் செங்கற்களை அடுக்கிக் கொண்டிருக்கிறேன்" என்று சொல்லாமல், "நான் இறைவனின் இல்லத்தைக் கட்டிக் கொண்டிருக்கிறேன்" என்று சொல்லும் செங்கல் அடுக்கும் தொழிலாளி. இந்தக் கண்ணோட்டம் போராட்டத்தின் அர்த்தத்தை மாற்றுகிறது.' },
      actionStep: { en: 'Write down exactly how the hard work you are doing right now will eventually benefit someone other than yourself.', ta: 'நீங்கள் இப்போது செய்துகொண்டிருக்கும் கடின உழைப்பு, இறுதியில் உங்களைத் தவிர வேறு ஒருவருக்கு எவ்வாறு பயனளிக்கும் என்பதைத் துல்லியமாக எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Does your primary motivation come from self-interest, or from a desire to contribute to the world?', ta: 'உங்களின் முதன்மை உந்துதல் சுயநலத்திலிருந்து வருகிறதா அல்லது உலகிற்குப் பங்களிக்க வேண்டும் என்ற விருப்பத்திலிருந்தா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'A Growth Mindset', ta: 'வளர்ச்சி மனப்பான்மை' },
      explanation: { en: 'Gritty people possess a growth mindset. They believe that their abilities can change and improve through effort, rather than being fixed at birth.', ta: 'கிரிட் உள்ளவர்கள் வளர்ச்சி மனப்பான்மையைக் கொண்டுள்ளனர். தங்கள் திறன்கள் பிறப்பில் நிலையானவை என்பதற்குப் பதிலாக, முயற்சியின் மூலம் மாறலாம் மற்றும் மேம்படலாம் என்று அவர்கள் நம்புகிறார்கள்.' },
      whyItMatters: { en: 'If you believe your intelligence is fixed, failure means you are dumb. If you have a growth mindset, failure just means you need to learn more.', ta: 'உங்கள் புத்திசாலித்தனம் நிலையானது என்று நீங்கள் நம்பினால், தோல்வி என்பது நீங்கள் முட்டாள் என்பதாகும். உங்களுக்கு வளர்ச்சி மனப்பான்மை இருந்தால், தோல்வி என்பது நீங்கள் இன்னும் கற்றுக்கொள்ள வேண்டும் என்பதை மட்டுமே குறிக்கும்.' },
      example: { en: 'Getting a bad grade on a test and saying, "I haven\'t mastered this yet," instead of saying, "I am just bad at math."', ta: 'தேர்வில் மோசமான மதிப்பெண் பெற்று, "நான் கணக்கில் மோசம்" என்று கூறுவதற்குப் பதிலாக, "நான் இன்னும் இதில் தேர்ச்சி பெறவில்லை" என்று கூறுவது.' },
      actionStep: { en: 'Catch yourself saying "I can\'t do this" today and add the word "YET" to the end of the sentence.', ta: 'இன்று நீங்கள் "என்னைால் இதைச் செய்ய முடியாது" என்று சொல்வதைக் கவனித்து, வாக்கியத்தின் முடிவில் "இன்னும்" என்ற வார்த்தையைச் சேர்க்கவும்.' },
      reflectionQuestion: { en: 'When you fail, do you question your self-worth, or do you question your strategy?', ta: 'நீங்கள் தோல்வியடையும் போது, உங்களின் சுய மதிப்பை நீங்கள் கேள்வி கேட்கிறீர்களா, அல்லது உங்கள் உத்தியைக் கேள்வி கேட்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Hope that Depends on You', ta: 'உங்களைச் சார்ந்திருக்கும் நம்பிக்கை' },
      explanation: { en: 'The hope of gritty people has nothing to do with luck. It is the belief that "my own efforts can improve my future."', ta: 'கிரிட் உள்ளவர்களின் நம்பிக்கைக்கும் அதிர்ஷ்டத்திற்கும் எந்த சம்பந்தமும் இல்லை. "எனது சொந்த முயற்சிகளால் என் எதிர்காலத்தை மேம்படுத்த முடியும்" என்ற நம்பிக்கையே அது.' },
      whyItMatters: { en: 'Waiting for tomorrow to magically be better is passive hope. Believing you can MAKE tomorrow better is active hope, which fuels persistence.', ta: 'நாளை மாயாஜாலமாகச் சிறப்பாக இருக்கும் என்று காத்திருப்பது செயலற்ற நம்பிக்கை. உங்களால் நாளையைச் சிறப்பாக மாற்ற முடியும் என்று நம்புவது சுறுசுறுப்பான நம்பிக்கை, அது விடாமுயற்சியைத் தூண்டுகிறது.' },
      example: { en: 'Instead of hoping the economy gets better so you get a job, actively learning a new skill every day so you become undeniable to employers.', ta: 'உங்களுக்கு வேலை கிடைக்கும்படி பொருளாதாரம் சிறப்பாக மாறும் என்று நம்புவதற்குப் பதிலாக, ஒவ்வொரு நாளும் தீவிரமாக ஒரு புதிய திறனைக் கற்றுக்கொள்வதன் மூலம் நீங்கள் முதலாளிகளால் மறுக்க முடியாதவராக மாறுகிறீர்கள்.' },
      actionStep: { en: 'Identify a problem you are facing. Write down three specific actions you can take to solve it, rather than waiting for circumstances to change.', ta: 'நீங்கள் எதிர்கொள்ளும் ஒரு பிரச்சனையைக் கண்டறியவும். சூழ்நிலைகள் மாறும் வரை காத்திருப்பதற்குப் பதிலாக, அதைத் தீர்க்க நீங்கள் எடுக்கக்கூடிய மூன்று குறிப்பிட்ட நடவடிக்கைகளை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Are you waiting to be rescued, or are you acting as your own hero?', ta: 'யாராவது வந்து காப்பாற்றுவார்கள் என்று காத்திருக்கிறீர்களா, அல்லது உங்களுக்கு நீங்களே நாயகனாகச் செயல்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'The Hard Thing Rule', ta: 'கடினமான விஷய விதி' },
      explanation: { en: 'A rule Duckworth uses in her family: Everyone must do one "hard thing" (an activity that requires daily deliberate practice). You cannot quit in the middle of a season, and you get to pick your own hard thing.', ta: 'டக்வொர்த் தனது குடும்பத்தில் பயன்படுத்தும் ஒரு விதி: ஒவ்வொருவரும் ஒரு "கடினமான விஷயத்தை" (தினசரி திட்டமிட்ட பயிற்சி தேவைப்படும் ஒரு செயல்) செய்ய வேண்டும். ஒரு பருவத்தின் பாதியில் நீங்கள் விலக முடியாது, உங்களின் கடினமான விஷயத்தை நீங்களே தேர்ந்தெடுத்துக்கொள்ளலாம்.' },
      whyItMatters: { en: 'It teaches discipline and prevents the habit of quitting just because an activity becomes difficult or boring.', ta: 'இது ஒழுக்கத்தைக் கற்பிக்கிறது மற்றும் ஒரு செயல் கடினமாக அல்லது சலிப்பாக மாறுவதற்காக மட்டுமே விலகும் பழக்கத்தைத் தடுக்கிறது.' },
      example: { en: 'A child choosing to learn piano. Even if they hate it after a month, they must finish the semester of lessons before they are allowed to quit.', ta: 'பியானோ கற்கத் தேர்ந்தெடுக்கும் ஒரு குழந்தை. ஒரு மாதத்திற்குப் பிறகு அவர்கள் அதை வெறுத்தாலும், அவர்கள் விலக அனுமதிக்கப்படுவதற்கு முன்பு அந்தப் பருவத்தின் பாடங்களை முடிக்க வேண்டும்.' },
      actionStep: { en: 'Adopt the "Hard Thing Rule" for yourself. Commit to doing one challenging activity for the next 3 months without quitting, no matter what.', ta: 'உங்களுக்காக "கடினமான விஷய விதியை" ஏற்றுக்கொள்ளுங்கள். என்ன நடந்தாலும் அடுத்த 3 மாதங்களுக்குப் பின்வாங்காமல் ஒரு சவாலான செயலைச் செய்ய உறுதியளியுங்கள்.' },
      reflectionQuestion: { en: 'Do you have a habit of abandoning projects the moment the "honeymoon phase" is over?', ta: '"தேன்நிலவு கட்டம்" முடிந்தவுடனேயே திட்டங்களைக் கைவிடும் பழக்கம் உங்களுக்கு உள்ளதா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Hierarchy of Goals', ta: 'இலக்குகளின் படிநிலை' },
      explanation: { en: 'Gritty people have a clearly defined ultimate goal (the top of the pyramid). All their lower-level, short-term goals exist only to serve that top-level goal.', ta: 'கிரிட் உள்ளவர்கள் தெளிவாக வரையறுக்கப்பட்ட இறுதி இலக்கைக் (பிரமிட்டின் உச்சி) கொண்டுள்ளனர். அவர்களின் அனைத்து கீழ்-நிலை, குறுகிய கால இலக்குகளும் அந்த மேல்-நிலை இலக்குக்குச் சேவை செய்வதற்காக மட்டுமே உள்ளன.' },
      whyItMatters: { en: 'Without a unifying top-level goal, you will scatter your energy doing a lot of unrelated tasks and achieve nothing of significance.', ta: 'ஒருங்கிணைக்கும் மேல்-நிலை இலக்கு இல்லாமல், தொடர்பில்லாத பல பணிகளைச் செய்வதில் உங்கள் ஆற்றலைச் சிதறடித்து, குறிப்பிடத்தக்க எதையும் சாதிக்க மாட்டீர்கள்.' },
      example: { en: 'If the top goal is "become a published author," then reading daily, writing 500 words daily, and joining a critique group are the aligned lower-level goals.', ta: 'இறுதி இலக்கு "ஒரு வெளியிடப்பட்ட எழுத்தாளர் ஆக வேண்டும்" என்றால், தினசரி படிப்பது, தினசரி 500 வார்த்தைகள் எழுதுவது மற்றும் விமர்சனக் குழுவில் சேர்வது ஆகியவை சீரமைக்கப்பட்ட கீழ்-நிலை இலக்குகளாகும்.' },
      actionStep: { en: 'Draw a pyramid. Write your one ultimate life/career goal at the top, and list the daily actions required at the bottom.', ta: 'ஒரு பிரமிட்டை வரையவும். உங்களின் ஒரு இறுதி வாழ்க்கை/தொழில் இலக்கை உச்சியில் எழுதவும், கீழே தேவைப்படும் அன்றாடச் செயல்களைப் பட்டியலிடவும்.' },
      reflectionQuestion: { en: 'Are your daily tasks aligned with a massive vision, or are you just busy being busy?', ta: 'உங்களின் அன்றாடப் பணிகள் ஒரு பெரிய பார்வையுடன் சீரமைக்கப்பட்டுள்ளதா, அல்லது பரபரப்பாக இருக்க வேண்டும் என்பதற்காகப் பரபரப்பாக இருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Fall Seven, Rise Eight', ta: 'ஏழு முறை விழுந்தாலும், எட்டு முறை எழுங்கள்' },
      explanation: { en: 'Resilience is a core component of grit. It is the Japanese proverb of getting knocked down again and again, but always getting back up.', ta: 'மீள்திறன் என்பது கிரிட்டின் முக்கிய அங்கமாகும். இது மீண்டும் மீண்டும் கீழே தள்ளப்பட்டாலும், எப்போதும் மீண்டும் எழுவதைக் குறிக்கும் ஜப்பானியப் பழமொழியாகும்.' },
      whyItMatters: { en: 'Failure is an absolute certainty on the path to achievement. If you cannot handle failure without losing your passion, you lack grit.', ta: 'சாதனைக்கான பாதையில் தோல்வி என்பது முற்றிலும் உறுதியானது. உங்கள் பேரார்வத்தை இழக்காமல் தோல்வியைக் கையாள முடியாவிட்டால், உங்களிடம் கிரிட் இல்லை.' },
      example: { en: 'An entrepreneur whose first three businesses go bankrupt, but they use the lessons learned to make the fourth one a massive success.', ta: 'முதல் மூன்று தொழில்கள் திவாலானாலும், கற்றுக்கொண்ட பாடங்களைப் பயன்படுத்தி நான்காவது தொழிலை மாபெரும் வெற்றியாக மாற்றும் ஒரு தொழில்முனைவோர்.' },
      actionStep: { en: 'Look at a recent failure. Instead of feeling ashamed, write down exactly what that failure taught you about how to succeed next time.', ta: 'சமீபத்திய தோல்வியைப் பாருங்கள். அவமானப்படுவதை விட, அடுத்த முறை எப்படி வெற்றிபெறுவது என்பது பற்றி அந்தத் தோல்வி உங்களுக்கு என்ன கற்பித்தது என்பதைத் துல்லியமாக எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Do you view failure as a stop sign, or as a detour to get better information?', ta: 'தோல்வியை ஒரு நிறுத்தக் குறியாகப் பார்க்கிறீர்களா, அல்லது சிறந்த தகவல்களைப் பெறுவதற்கான மாற்றுப்பாதையாகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Culture Breeds Grit', ta: 'கலாச்சாரம் கிரிட்டை வளர்க்கிறது' },
      explanation: { en: 'If you want to be grittier, join a gritty culture. The drive to fit in with the group is deeply hardwired into human psychology.', ta: 'நீங்கள் அதிக கிரிட் உள்ளவராக இருக்க விரும்பினால், கிரிட் உள்ள கலாச்சாரத்தில் சேருங்கள். குழுவுடன் பொருந்திப்போகும் உந்துதல் மனித உளவியலில் ஆழமாகப் பதிக்கப்பட்டுள்ளது.' },
      whyItMatters: { en: 'Willpower is finite. But if you surround yourself with people who naturally work hard and never give up, doing the hard work becomes the default standard.', ta: 'மன உறுதிக்கு ஓர் எல்லை உண்டு. ஆனால் இயற்கையாகவே கடினமாக உழைக்கும் மற்றும் ஒருபோதும் விட்டுவிடாத மனிதர்களுடன் உங்களைச் சூழ்ந்துகொண்டால், கடின உழைப்பு செய்வது உங்களின் இயல்பான தரமாக மாறும்.' },
      example: { en: 'Joining a high-intensity sports team where showing up at 5 AM is just "what we do," rather than relying purely on self-discipline to wake up early.', ta: 'அதிகாலையில் எழுந்திருக்க முற்றிலும் சுய ஒழுக்கத்தை மட்டுமே நம்பியிருக்காமல், அதிகாலை 5 மணிக்கு ஆஜராகுவது "நாங்கள் செய்வதே" என்று இருக்கும் அதிக தீவிரமான விளையாட்டுக் குழுவில் சேர்வது.' },
      actionStep: { en: 'Find and join one group, community, or forum of people who are relentlessly pursuing the same goal as you.', ta: 'உங்களைப் போலவே அதே இலக்கை இடைவிடாமல் தொடரும் மக்களின் ஒரு குழு, சமூகம் அல்லது மன்றத்தைக் கண்டறிந்து அதில் சேரவும்.' },
      reflectionQuestion: { en: 'Does your current peer group normalize mediocrity or demand excellence?', ta: 'உங்கள் தற்போதைய நண்பர்கள் குழு சாதாரணத்தன்மையை இயல்பாக்குகிறதா அல்லது சிறப்பைக் கோருகிறதா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Interest Precedes Effort', ta: 'ஆர்வம் முயற்சிக்கு முந்தியது' },
      explanation: { en: 'Nobody can force themselves to be gritty about something they fundamentally hate. Genuine interest is the seed from which grit grows.', ta: 'அடிப்படையில் தாங்கள் வெறுக்கும் ஒன்றைப் பற்றி கிரிட் உள்ளவராக இருக்குமாறு யாரும் தங்களை வற்புறுத்திக் கொள்ள முடியாது. உண்மையான ஆர்வமே கிரிட் வளரும் விதையாகும்.' },
      whyItMatters: { en: 'You must play in the sandbox of your interests before you can commit to the heavy lifting of deliberate practice.', ta: 'திட்டமிட்ட பயிற்சியின் கடின உழைப்பிற்கு உங்களை அர்ப்பணிக்கும் முன், உங்கள் ஆர்வங்களின் மணல் பெட்டியில் நீங்கள் விளையாட வேண்டும்.' },
      example: { en: 'A scientist who spends their childhood casually playing with bugs in the backyard before dedicating 10 years to earning a Ph.D. in entomology.', ta: 'பூச்சியியலில் முனைவர் பட்டம் பெற 10 வருடங்களை அர்ப்பணிக்கும் முன், குழந்தைப்பருவத்தில் கொல்லைப்புறத்தில் பூச்சிகளுடன் சாதாரணமாக விளையாடும் ஒரு விஞ்ஞானி.' },
      actionStep: { en: 'List three things you genuinely enjoy reading or learning about in your free time. How can you turn one of them into a purposeful skill?', ta: 'உங்களின் ஓய்வு நேரத்தில் நீங்கள் உண்மையிலேயே படிக்க அல்லது கற்றுக்கொள்ள விரும்பும் மூன்று விஷயங்களைப் பட்டியலிடுங்கள். அவற்றில் ஒன்றை எவ்வாறு நோக்கமுள்ள திறனாக மாற்றலாம்?' },
      reflectionQuestion: { en: 'Are you trying to apply grit to a career you actually despise, hoping it will somehow make you happy?', ta: 'நீங்கள் உண்மையில் வெறுக்கும் ஒரு தொழிலில் கிரிட்டைப் பயன்படுத்த முயற்சிக்கிறீர்களா, அது எப்படியாவது உங்களை மகிழ்விக்கும் என்று நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'The Role of Parenting', ta: 'பெற்றோர் வளர்ப்பின் பங்கு' },
      explanation: { en: 'Parents who are both supportive (warm) and demanding (hold high standards) raise the grittiest kids. It is called "wise parenting."', ta: 'ஆதரவான (அன்பான) மற்றும் கோரும் (உயர்ந்த தரங்களைக் கொண்ட) பெற்றோர்களே அதிக கிரிட் உள்ள குழந்தைகளை வளர்க்கிறார்கள். இது "விவேகமான வளர்ப்பு" என்று அழைக்கப்படுகிறது.' },
      whyItMatters: { en: 'Too much warmth without standards leads to entitlement. Too many standards without warmth leads to anxiety. You need both to build resilience.', ta: 'தரங்கள் இல்லாமல் அதிக அன்பு காட்டுவது உரிமை உணர்வுக்கு வழிவகுக்கும். அன்பு இல்லாமல் அதிக தரங்கள் பதட்டத்திற்கு வழிவகுக்கும். மீள்திறனை உருவாக்க உங்களுக்கு இரண்டும் தேவை.' },
      example: { en: 'A parent who says, "I love you unconditionally, but I also expect you to finish the soccer season even though your team is losing."', ta: '"நான் நிபந்தனையின்றி உன்னை நேசிக்கிறேன், ஆனால் உனது அணி தோற்றுக் கொண்டிருந்தாலும் நீ கால்பந்து பருவத்தை முடிக்க வேண்டும் என்று நான் எதிர்பார்க்கிறேன்" என்று சொல்லும் பெற்றோர்.' },
      actionStep: { en: 'Whether managing kids or a team, ensure you are providing a balance of deep psychological safety alongside unwavering high expectations.', ta: 'குழந்தைகளை நிர்வகித்தாலும் அல்லது ஒரு குழுவை நிர்வகித்தாலும், ஆழமான உளவியல் பாதுகாப்புடன் சமரசம் இல்லாத உயர்ந்த எதிர்பார்ப்புகளையும் வழங்குவதை உறுதிசெய்யுங்கள்.' },
      reflectionQuestion: { en: 'Do you lower your standards to avoid conflict, or do you enforce standards without providing support?', ta: 'மோதலைத் தவிர்க்க உங்கள் தரங்களைக் குறைக்கிறீர்களா, அல்லது ஆதரவை வழங்காமல் தரங்களைச் செயல்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Stubbornness vs. Grit', ta: 'பிடிவாதம் vs கிரிட்' },
      explanation: { en: 'Grit does not mean blindly doing the exact same thing when it clearly isn\'t working. Gritty people are stubborn about their high-level goals, but flexible on their low-level strategies.', ta: 'கிரிட் என்பது தெளிவாக வேலை செய்யாதபோது கண்மூடித்தனமாக அதே காரியத்தைச் செய்வது என்று பொருளல்ல. கிரிட் உள்ளவர்கள் தங்களின் உயர்-நிலை இலக்குகளில் பிடிவாதமாக இருப்பார்கள், ஆனால் தங்களின் குறைந்த-நிலை உத்திகளில் நெகிழ்வாக இருப்பார்கள்.' },
      whyItMatters: { en: 'Continuing to use a broken strategy is just stupidity. True grit involves adapting, learning, and pivoting while keeping your eyes on the ultimate prize.', ta: 'உடைந்த உத்தியைத் தொடர்ந்து பயன்படுத்துவது முட்டாள்தனமே. உண்மையான கிரிட் என்பது இறுதிப் பரிசின் மீது கண்களை வைத்துக்கொண்டே தழுவுதல், கற்றுக்கொள்ளுதல் மற்றும் மாற்றுதல் ஆகியவற்றை உள்ளடக்கியது.' },
      example: { en: 'An entrepreneur closing a failing product line to start a new one, because their ultimate goal is to build a successful company, not save that specific product.', ta: 'ஒரு தொழில்முனைவோர் ஒரு புதிய தயாரிப்பைத் தொடங்குவதற்காக தோல்வியடையும் ஒரு தயாரிப்பு வரிசையை மூடுகிறார், ஏனென்றால் அவர்களின் இறுதி இலக்கு ஒரு வெற்றிகரமான நிறுவனத்தை உருவாக்குவதே தவிர, அந்த குறிப்பிட்ட தயாரிப்பைக் காப்பாற்றுவது அல்ல.' },
      actionStep: { en: 'Review a project you are struggling with. Keep the goal, but completely change your strategy for achieving it today.', ta: 'நீங்கள் போராடிக்கொண்டிருக்கும் ஒரு திட்டத்தை மதிப்பாய்வு செய்யவும். இலக்கை வைத்துக்கொள்ளுங்கள், ஆனால் அதை அடைவதற்கான உங்கள் உத்தியை இன்று முழுமையாக மாற்றவும்.' },
      reflectionQuestion: { en: 'Are you mistaking pointless stubbornness for grit?', ta: 'பயனற்ற பிடிவாதத்தை கிரிட் என்று நீங்கள் தவறாகப் புரிந்துகொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Give up the Easy Work', ta: 'எளிதான வேலையைக் கைவிடுங்கள்' },
      explanation: { en: 'Deliberate practice means you stop doing the things you are already good at and force yourself to do the things you are bad at.', ta: 'திட்டமிட்ட பயிற்சி என்பது நீங்கள் ஏற்கனவே சிறந்து விளங்கும் விஷயங்களைச் செய்வதை நிறுத்திவிட்டு, நீங்கள் மோசமாக இருக்கும் விஷயங்களைச் செய்ய உங்களை வற்புறுத்துவதாகும்.' },
      whyItMatters: { en: 'Spending hours doing easy work feels productive, but it is an illusion. It is a way to avoid the painful effort required for actual growth.', ta: 'எளிதான வேலைகளைச் செய்ய பல மணிநேரம் செலவிடுவது பயனுள்ளதாகத் தோன்றும், ஆனால் அது ஒரு மாயை. உண்மையான வளர்ச்சிக்குத் தேவையான வேதனையான முயற்சியைத் தவிர்ப்பதற்கான ஒரு வழி இது.' },
      example: { en: 'A basketball player who is great at three-pointers spending their whole practice shooting threes, rather than working on their weak left-hand dribbling.', ta: 'த்ரீ-பாயிண்டர்களில் சிறப்பாகச் செயல்படும் கூடைப்பந்து வீரர் ஒருவர், தனது பலவீனமான இடது கை ட்ரிப்ளிங்கில் வேலை செய்வதற்குப் பதிலாக, பயிற்சி முழுவதும் த்ரீ-பாயிண்டர்களைச் சுடுவதிலேயே செலவிடுவது.' },
      actionStep: { en: 'Identify the task in your work that you actively avoid because you are bad at it. Spend your first hour of work tomorrow doing only that task.', ta: 'உங்கள் வேலையில் நீங்கள் மோசமாக இருப்பதனால் தீவிரமாகத் தவிர்க்கும் பணியைக் கண்டறியவும். நாளை உங்கள் வேலையின் முதல் மணிநேரத்தை அந்தப் பணியை மட்டும் செய்யச் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you hiding in your comfort zone while pretending to work hard?', ta: 'கடினமாக உழைப்பது போல் நடித்துக்கொண்டு உங்கள் சௌகரிய வட்டத்திற்குள் நீங்கள் ஒளிந்துகொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'The Role of Optimism', ta: 'நம்பிக்கைவாதத்தின் பங்கு' },
      explanation: { en: 'Optimists explain failures as temporary and specific causes that can be fixed. Pessimists explain failures as permanent and pervasive flaws in themselves.', ta: 'நம்பிக்கையாளர்கள் தோல்விகளை தற்காலிகமானவை என்றும் சரிசெய்யக்கூடிய குறிப்பிட்ட காரணங்கள் என்றும் விளக்குகிறார்கள். அவநம்பிக்கையாளர்கள் தோல்விகளை தங்களுக்குள்ளான நிரந்தரமான மற்றும் பரவலான குறைகள் என்று விளக்குகிறார்கள்.' },
      whyItMatters: { en: 'If you believe a failure is permanent ("I\'m just stupid"), you will stop trying. Optimism is the fuel that keeps grit alive after a defeat.', ta: 'தோல்வி நிரந்தரமானது ("நான் ஒரு முட்டாள்") என்று நீங்கள் நம்பினால், நீங்கள் முயற்சி செய்வதை நிறுத்துவீர்கள். ஒரு தோல்விக்குப் பிறகு கிரிட்டை உயிர்ப்புடன் வைத்திருக்கும் எரிபொருளே நம்பிக்கைவாதம்.' },
      example: { en: 'Optimist: "I failed the test because I didn\'t study the right chapters." Pessimist: "I failed the test because I am not smart enough for college."', ta: 'நம்பிக்கையாளர்: "நான் சரியான அத்தியாயங்களைப் படிக்காததால் தேர்வில் தோல்வியடைந்தேன்." அவநம்பிக்கையாளர்: "நான் கல்லூரிக்குப் படிக்கும் அளவுக்குப் புத்திசாலி இல்லை என்பதால் தேர்வில் தோல்வியடைந்தேன்."' },
      actionStep: { en: 'Next time you face a setback, physically write down the specific, temporary reason it happened, proving to yourself that it can be changed.', ta: 'அடுத்த முறை நீங்கள் பின்னடைவைச் சந்திக்கும்போது, அது நடந்ததற்கான குறிப்பிட்ட, தற்காலிகக் காரணத்தை நேரடியாக எழுதுங்கள், அதை மாற்ற முடியும் என்பதை உங்களுக்கு நீங்களே நிரூபிக்கவும்.' },
      reflectionQuestion: { en: 'Do you view your mistakes as character flaws, or as logistical errors that can be corrected?', ta: 'உங்கள் தவறுகளை உங்களின் குணநலக் குறைகளாகப் பார்க்கிறீர்களா, அல்லது சரிசெய்யக்கூடிய தர்க்கரீதியான பிழைகளாகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Continuous Improvement', ta: 'தொடர்ச்சியான மேம்பாடு' },
      explanation: { en: 'Grit requires a philosophy of Kaizen—the Japanese business philosophy of continuous, small improvements every single day.', ta: 'கிரிட்டிற்கு கைசன் என்ற தத்துவம் தேவை—இது ஒவ்வொரு நாளும் தொடர்ச்சியான, சிறிய மேம்பாடுகளைச் செய்யும் ஜப்பானிய வணிகத் தத்துவமாகும்.' },
      whyItMatters: { en: 'Greatness is not achieved in one massive leap; it is the accumulation of thousands of tiny, invisible improvements made consistently over time.', ta: 'மகத்துவம் என்பது ஒரு மாபெரும் பாய்ச்சலில் அடையப்படுவதில்லை; அது காலப்போக்கில் தொடர்ந்து செய்யப்படும் ஆயிரக்கணக்கான சிறிய, கண்ணுக்குத் தெரியாத மேம்பாடுகளின் தொகுப்பாகும்.' },
      example: { en: 'A competitive swimmer aiming to shave just 0.1 seconds off their turn time every month.', ta: 'ஒவ்வொரு மாதமும் தங்கள் திரும்பும் நேரத்தில் 0.1 வினாடியைக் குறைக்க இலக்கு வைக்கும் ஒரு போட்டி நீச்சல் வீரர்.' },
      actionStep: { en: 'Find one tiny aspect of your routine (e.g., how you organize your email, your typing speed) and improve it by 1% today.', ta: 'உங்கள் வழக்கத்தில் ஒரு சிறிய அம்சத்தைக் கண்டறிந்து (எ.கா., உங்கள் மின்னஞ்சலை எப்படி ஒழுங்கமைக்கிறீர்கள், உங்கள் தட்டச்சு வேகம்) அதை இன்று 1% மேம்படுத்தவும்.' },
      reflectionQuestion: { en: 'Are you looking for a magic bullet to transform your life, rather than putting in the daily reps?', ta: 'தினசரி பயிற்சிகளை மேற்கொள்வதற்குப் பதிலாக, உங்கள் வாழ்க்கையை மாற்ற ஒரு மேஜிக் தோட்டாவைத் தேடுகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Passion is a Compass', ta: 'பேரார்வம் ஒரு திசைகாட்டி' },
      explanation: { en: 'Passion isn\'t a fiery explosion; it\'s a compass. It doesn\'t always feel incredibly exciting, but it consistently points you in the same long-term direction.', ta: 'பேரார்வம் என்பது ஒரு உமிழும் வெடிப்பு அல்ல; அது ஒரு திசைகாட்டி. அது எப்போதும் நம்பமுடியாத அளவுக்கு உற்சாகமாக உணரப்படுவதில்லை, ஆனால் அது தொடர்ந்து உங்களை அதே நீண்ட கால திசையை நோக்கிக் காட்டுகிறது.' },
      whyItMatters: { en: 'If you expect your work to feel thrilling every single day, you will quit. Real passion is quiet, steady devotion, even on boring days.', ta: 'உங்கள் வேலை ஒவ்வொரு நாளும் சிலிர்ப்பாக இருக்க வேண்டும் என்று நீங்கள் எதிர்பார்த்தால், நீங்கள் விலகிவிடுவீர்கள். உண்மையான பேரார்வம் என்பது சலிப்பான நாட்களிலும் அமைதியான, நிலையான பக்தியாகும்.' },
      example: { en: 'A scientist looking through a microscope at the exact same cells for the 500th day. It isn\'t thrilling, but their inner compass tells them it is meaningful.', ta: '500-வது நாளாக அதே செல்களை நுண்ணோக்கியின் மூலம் பார்க்கும் ஒரு விஞ்ஞானி. இது சிலிர்ப்பாக இல்லை, ஆனால் அவர்களின் உள்ளக திசைகாட்டி அது அர்த்தமுள்ளதாகக் கூறுகிறது.' },
      actionStep: { en: 'Remind yourself of your "compass heading" when doing mundane tasks today. Link the boring task back to the ultimate goal.', ta: 'இன்று சாதாரண பணிகளைச் செய்யும்போது உங்கள் "திசைகாட்டியின் தலைப்பை" உங்களுக்கு நினைவூட்டுங்கள். சலிப்பான பணியை இறுதி இலக்குடன் இணைக்கவும்.' },
      reflectionQuestion: { en: 'Are you confusing the excitement of novelty with true passion?', ta: 'புதுமையின் உற்சாகத்தை உண்மையான பேரார்வத்துடன் சேர்த்துக் குழப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Grit Grows', ta: 'கிரிட் வளர்கிறது' },
      explanation: { en: 'The most encouraging finding in Duckworth’s research is that grit changes. As we age, mature, and navigate life\'s challenges, our capacity for grit naturally increases.', ta: 'டக்வொர்த்தின் ஆராய்ச்சியில் மிகவும் ஊக்கமளிக்கும் கண்டுபிடிப்பு என்னவென்றால், கிரிட் மாறுகிறது. நாம் வயதாகும்போது, முதிர்ச்சியடையும்போது மற்றும் வாழ்க்கையின் சவால்களைக் கடந்து செல்லும்போது, கிரிட்டிற்கான நமது திறன் இயற்கையாகவே அதிகரிக்கிறது.' },
      whyItMatters: { en: 'You are not stuck with the level of grit you have today. By intentionally practicing passion and perseverance, you can become a grittier person.', ta: 'இன்று உங்களிடம் உள்ள கிரிட் நிலையில் நீங்கள் சிக்கிக்கொள்ளவில்லை. பேரார்வத்தையும் விடாமுயற்சியையும் வேண்டுமென்றே பயிற்சி செய்வதன் மூலம், நீங்கள் அதிக கிரிட் உள்ள நபராக மாற முடியும்.' },
      example: { en: 'Someone who used to quit every job after three months in their twenties, developing the discipline to stick with a career and build a business in their thirties.', ta: 'தங்கள் இருபதுகளில் மூன்று மாதங்களுக்குப் பிறகு ஒவ்வொரு வேலையையும் கைவிட்ட ஒருவர், முப்பதுகளில் ஒரு தொழிலுடன் இணைந்திருக்கவும் வணிகத்தை உருவாக்கவும் ஒழுக்கத்தை வளர்த்துக் கொள்வது.' },
      actionStep: { en: 'Reflect on a time 5 years ago when you gave up easily. Compare it to a recent time when you pushed through hardship. Acknowledge your growth.', ta: '5 ஆண்டுகளுக்கு முன்பு நீங்கள் எளிதில் கைவிட்ட நேரத்தைச் சிந்தித்துப் பாருங்கள். சமீபத்தில் நீங்கள் கஷ்டங்களைத் தாண்டி வந்த நேரத்துடன் அதை ஒப்பிடுங்கள். உங்கள் வளர்ச்சியை அங்கீகரியுங்கள்.' },
      reflectionQuestion: { en: 'Are you actively taking steps to become a grittier person than you were yesterday?', ta: 'நேற்று நீங்கள் இருந்ததை விட அதிக கிரிட் உள்ள நபராக மாற நீங்கள் தீவிரமாக நடவடிக்கை எடுக்கிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Grit: The Power of Passion and Perseverance' });
    if (existing) {
      console.log('Grit already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Grit: The Power of Passion and Perseverance' });
    }
    
    await WisdomBook.create(gritBook);
    console.log('Grit added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
