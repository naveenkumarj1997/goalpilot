import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const subconsciousBook = {
  title: 'The Power of Your Subconscious Mind',
  author: 'Joseph Murphy',
  coverImage: 'https://m.media-amazon.com/images/I/71sBtM3Yi5L._AC_UF1000,1000_QL80_.jpg',
  categories: ['Self-Help', 'Psychology', 'Spirituality'],
  themes: [
    { en: 'Mind Power', ta: 'மன சக்தி' },
    { en: 'Belief & Healing', ta: 'நம்பிக்கை மற்றும் குணப்படுத்துதல்' }
  ],
  overview: {
    en: 'This book explains how the subconscious mind influences every aspect of our lives. By understanding and learning to control it, you can heal yourself, overcome fears, sleep better, enjoy better relationships, and achieve unprecedented success.',
    ta: 'ஆழ்மனம் நமது வாழ்க்கையின் ஒவ்வொரு அம்சத்தையும் எவ்வாறு பாதிக்கிறது என்பதை இந்தப் புத்தகம் விளக்குகிறது. அதைப் புரிந்துகொண்டு கட்டுப்படுத்தக் கற்றுக்கொள்வதன் மூலம், உங்களை நீங்களே குணப்படுத்திக் கொள்ளலாம், அச்சங்களை வெல்லலாம், சிறந்த உறவுகளை அனுபவிக்கலாம் மற்றும் மாபெரும் வெற்றியை அடையலாம்.'
  },
  topQuotes: [
    { en: 'As you sow in your subconscious mind, so shall you reap in your body and environment.', ta: 'உங்கள் ஆழ்மனதில் நீங்கள் எதை விதைக்கிறீர்களோ, அதையே உங்கள் உடலிலும் சூழலிலும் அறுவடை செய்வீர்கள்.' },
    { en: 'The law of life is the law of belief. A belief is a thought in your mind. Do not believe in things to harm or hurt you. Believe in the power of your subconscious to heal, inspire, strengthen, and prosper you.', ta: 'வாழ்க்கையின் விதி என்பது நம்பிக்கையின் விதி. நம்பிக்கை என்பது உங்கள் மனதில் உள்ள ஒரு எண்ணம். உங்களை காயப்படுத்தும் விஷயங்களை நம்பாதீர்கள். உங்களை குணப்படுத்தவும், வலிமையாக்கவும், செழிக்கச் செய்யவும் உங்கள் ஆழ்மனதின் சக்தியை நம்புங்கள்.' },
    { en: 'You are like a captain navigating a ship. You must give the right orders (thoughts and images) to your subconscious mind, which controls and governs all your experiences.', ta: 'நீங்கள் ஒரு கப்பலை வழிநடத்தும் கேப்டன் போன்றவர். உங்கள் அனுபவங்கள் அனைத்தையும் கட்டுப்படுத்தும் உங்கள் ஆழ்மனதிற்கு சரியான கட்டளைகளை (எண்ணங்கள் மற்றும் படங்கள்) நீங்கள் கொடுக்க வேண்டும்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Treasure House Within You', ta: 'உங்களுக்குள் இருக்கும் கருவூலம்' },
      explanation: { en: 'You have a treasure house within you from which you can extract everything you need to live life gloriously, joyously, and abundantly.', ta: 'உங்களுக்குள் ஒரு கருவூலம் உள்ளது, அதிலிருந்து நீங்கள் மகிழ்ச்சியாகவும், செழிப்பாகவும் வாழத் தேவையான அனைத்தையும் எடுத்துக்கொள்ளலாம்.' },
      whyItMatters: { en: 'Most people look outside themselves for success and happiness, ignoring the infinite power that lies within their own minds.', ta: 'பெரும்பாலான மக்கள் தங்கள் சொந்த மனதிற்குள் இருக்கும் எல்லையற்ற சக்தியைப் புறக்கணித்து, வெற்றி மற்றும் மகிழ்ச்சிக்காக வெளியில் தேடுகிறார்கள்.' },
      example: { en: 'Instead of wishing for a rich relative to give you money, you use your mind to come up with a brilliant business idea.', ta: 'ஒரு பணக்கார உறவினர் பணம் கொடுப்பார் என்று காத்திருப்பதற்குப் பதிலாக, ஒரு சிறந்த வணிக யோசனையைக் கொண்டு வர உங்கள் மனதைப் பயன்படுத்துவது.' },
      actionStep: { en: 'Acknowledge today that the solution to any problem you have exists inside your own mind.', ta: 'உங்களுக்கு இருக்கும் எந்தவொரு பிரச்சனைக்கும் தீர்வு உங்கள் சொந்த மனதிற்குள் இருப்பதை இன்று உணர்ந்து கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Do you believe your future depends on outside circumstances or your inside thoughts?', ta: 'உங்கள் எதிர்காலம் வெளிப்புற சூழ்நிலைகளைப் பொறுத்ததா அல்லது உங்கள் உள்ளக எண்ணங்களைப் பொறுத்ததா என்று நீங்கள் நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Conscious vs. Subconscious', ta: 'வெளிமனம் vs ஆழ்மனம்' },
      explanation: { en: 'Think of your conscious mind as the gardener and your subconscious mind as the garden. You are planting seeds of thought in your subconscious all day long.', ta: 'உங்கள் வெளிமனதை தோட்டக்காரராகவும், ஆழ்மனதை தோட்டமாகவும் நினைத்துக்கொள்ளுங்கள். நாள் முழுவதும் உங்கள் ஆழ்மனதில் எண்ண விதைகளை விதைக்கிறீர்கள்.' },
      whyItMatters: { en: 'The subconscious mind does not argue with you. It accepts whatever the conscious mind decrees. If you plant negative thoughts, you reap negative results.', ta: 'ஆழ்மனம் உங்களுடன் வாதிடுவதில்லை. வெளிமனம் ஆணையிடுவதை அது ஏற்றுக்கொள்கிறது. நீங்கள் எதிர்மறை எண்ணங்களை விதைத்தால், எதிர்மறை முடிவுகளையே அறுவடை செய்வீர்கள்.' },
      example: { en: 'If you constantly say "I can\'t afford this," your subconscious takes it as a command and ensures you never can afford it.', ta: 'நீங்கள் தொடர்ந்து "என்னால் இதை வாங்க முடியாது" என்று சொன்னால், உங்கள் ஆழ்மனம் அதை ஒரு கட்டளையாக ஏற்றுக்கொண்டு உங்களால் அதை ஒருபோதும் வாங்க முடியாதபடி பார்த்துக்கொள்கிறது.' },
      actionStep: { en: 'Stop mid-sentence if you catch yourself saying "I can\'t" and change it to "How can I?"', ta: '"என்னால் முடியாது" என்று நீங்கள் சொல்வதைக் கவனித்தால் பாதியில் நிறுத்திவிட்டு, அதை "நான் எப்படி முடியும்?" என்று மாற்றவும்.' },
      reflectionQuestion: { en: 'What kind of "seeds" have you been planting in your garden lately?', ta: 'சமீபகாலமாக உங்கள் தோட்டத்தில் எவ்வகையான "விதைகளை" விதைத்து வருகிறீர்கள்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'The Working Power of Your Mind', ta: 'உங்கள் மனதின் செயல்படும் சக்தி' },
      explanation: { en: 'Your subconscious mind works continuously, day and night, regardless of whether you are acting upon it or not.', ta: 'நீங்கள் செயல்பட்டாலும் செயல்படாவிட்டாலும் உங்கள் ஆழ்மனம் இரவும் பகலும் தொடர்ந்து செயல்படுகிறது.' },
      whyItMatters: { en: 'Because it never sleeps, the thoughts you fall asleep with are the most important thoughts of your day.', ta: 'அது ஒருபோதும் தூங்காததால், நீங்கள் தூங்கும் போது நினைக்கும் எண்ணங்களே உங்கள் நாளின் மிக முக்கியமான எண்ணங்கள்.' },
      example: { en: 'Going to bed worrying about a bill ensures your subconscious spends 8 hours creating anxiety.', ta: 'ஒரு கட்டணம் குறித்து கவலைப்பட்டுக்கொண்டே தூங்குவது, உங்கள் ஆழ்மனம் 8 மணிநேரம் கவலையை உருவாக்குவதை உறுதி செய்கிறது.' },
      actionStep: { en: 'Spend the last 5 minutes before sleep imagining your goals as already accomplished.', ta: 'தூங்குவதற்கு முந்தைய கடைசி 5 நிமிடங்களை உங்கள் இலக்குகள் ஏற்கனவே நிறைவேற்றப்பட்டுவிட்டதாகக் கற்பனை செய்து செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'What is usually the last thing on your mind before you fall asleep?', ta: 'நீங்கள் தூங்குவதற்கு முன் உங்கள் மனதில் தோன்றும் கடைசி விஷயம் என்ன?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Mental Healing', ta: 'மனதளவில் குணப்படுத்துதல்' },
      explanation: { en: 'The subconscious mind is the builder of your body and can heal you. The healing principle is within you.', ta: 'ஆழ்மனமே உங்கள் உடலைக் கட்டமைக்கிறது மற்றும் அதைக் குணப்படுத்தவும் முடியும். குணப்படுத்தும் கொள்கை உங்களுக்குள்ளேயே உள்ளது.' },
      whyItMatters: { en: 'Fear and anxiety disrupt the natural healing process of the body. Faith and positive suggestion accelerate it.', ta: 'பயம் மற்றும் பதட்டம் உடலின் இயற்கையான குணப்படுத்தும் செயல்முறையை சீர்குலைக்கின்றன. நம்பிக்கையும் நேர்மறையான ஆலோசனையும் அதை துரிதப்படுத்துகின்றன.' },
      example: { en: 'A patient who truly believes a placebo pill will cure them often experiences real physical healing.', ta: 'ஒரு வெற்று மாத்திரை தங்களைக் குணப்படுத்தும் என்று உண்மையிலேயே நம்பும் நோயாளி, உண்மையான உடல்ரீதியான குணமடைதலை அனுபவிக்கிறார்.' },
      actionStep: { en: 'If you are sick, stop talking about your illness to others. Speak only about your recovery.', ta: 'நீங்கள் நோய்வாய்ப்பட்டிருந்தால், உங்கள் நோயைப் பற்றி மற்றவர்களிடம் பேசுவதை நிறுத்துங்கள். நீங்கள் குணமடைவது பற்றி மட்டுமே பேசுங்கள்.' },
      reflectionQuestion: { en: 'Do you act like a victim to your body, or do you command it to heal?', ta: 'உங்கள் உடலுக்கு நீங்கள் ஒரு பலியாடைப் போல் நடந்துகொள்கிறீர்களா, அல்லது அதைக் குணமடையக் கட்டளையிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The Law of Belief', ta: 'நம்பிக்கையின் விதி' },
      explanation: { en: 'It is not the thing believed in that brings an answer to prayer; the answer comes because the subconscious mind responds to the mental picture or thought.', ta: 'நம்பப்படும் பொருளானது பிரார்த்தனைக்கு பதிலைக் கொண்டுவருவதில்லை; ஆழ்மனம் மனப் படம் அல்லது எண்ணத்திற்கு பதிலளிப்பதாலேயே பதில் வருகிறது.' },
      whyItMatters: { en: 'Your results are not based on magic, but on the depth of your own conviction.', ta: 'உங்கள் முடிவுகள் மாயாஜாலத்தை அடிப்படையாகக் கொண்டவை அல்ல, ஆனால் உங்கள் சொந்த நம்பிக்கையின் ஆழத்தை அடிப்படையாகக் கொண்டவை.' },
      example: { en: 'A student who genuinely believes they will pass a test studies with peace and clarity, directly leading to them passing.', ta: 'தேர்வில் தேர்ச்சி பெறுவோம் என்று உண்மையிலேயே நம்பும் ஒரு மாணவர் அமைதியுடனும் தெளிவுடனும் படிக்கிறார், அது நேரடியாக அவர்களை தேர்ச்சி பெற வைக்கிறது.' },
      actionStep: { en: 'Choose one goal and consciously decide to believe it is an absolute certainty.', ta: 'ஒரு இலக்கைத் தேர்ந்தெடுத்து, அது முற்றிலும் உறுதியானது என்று நம்ப நனவுடன் முடிவு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'What is a deeply held negative belief you have that might be holding you back?', ta: 'உங்களைத் தடுத்து நிறுத்தும் ஆழமாக வேரூன்றிய எதிர்மறை நம்பிக்கை உங்களிடம் என்ன உள்ளது?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Practical Techniques in Mental Healing', ta: 'மனநல குணப்படுத்துதலில் நடைமுறை நுட்பங்கள்' },
      explanation: { en: 'The "Baudoin Technique": Create a short, simple phrase representing your desire and repeat it like a lullaby just before sleep.', ta: '"பாடாயின் நுட்பம்": உங்கள் விருப்பத்தைக் குறிக்கும் ஒரு சிறிய, எளிமையான வாக்கியத்தை உருவாக்கி, தூங்குவதற்கு சற்று முன் அதை ஒரு தாலாட்டுப் போல திரும்பத் திரும்பச் சொல்லுங்கள்.' },
      whyItMatters: { en: 'A short phrase prevents the conscious mind from overthinking and easily slips past into the subconscious.', ta: 'ஒரு சிறிய வாக்கியம் வெளிமனம் அதிகமாகச் சிந்திப்பதைத் தடுக்கிறது மற்றும் எளிதாக ஆழ்மனதிற்குள் நழுவுகிறது.' },
      example: { en: 'Repeating "I am completely healed and perfectly healthy" as you drift off to sleep.', ta: 'நீங்கள் தூங்கும் போது "நான் முழுமையாக குணமடைந்துவிட்டேன், சரியான ஆரோக்கியத்துடன் இருக்கிறேன்" என்று திரும்பத் திரும்பச் சொல்வது.' },
      actionStep: { en: 'Condense your biggest goal into a 5-word sentence and repeat it tonight before bed.', ta: 'உங்கள் மிகப்பெரிய இலக்கை 5 வார்த்தை வாக்கியமாகச் சுருக்கி, இன்றிரவு படுக்கைக்கு முன் அதைத் திரும்பத் திரும்பச் சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'What 5-word phrase perfectly summarizes your current desire?', ta: 'உங்கள் தற்போதைய ஆசையை எந்த 5 வார்த்தை சொற்றொடர் கச்சிதமாகச் சுருக்கிச் சொல்கிறது?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'The Tendency of the Subconscious is Lifeward', ta: 'ஆழ்மனதின் போக்கு வாழ்க்கையை நோக்கியது' },
      explanation: { en: 'Your subconscious mind is always trying to preserve your life and restore you to health.', ta: 'உங்கள் ஆழ்மனம் எப்பொழுதும் உங்கள் உயிரைப் பாதுகாக்கவும் உங்கள் ஆரோக்கியத்தை மீட்டெடுக்கவும் முயற்சிக்கிறது.' },
      whyItMatters: { en: 'You do not have to force your body to heal or digest food; it wants to do these things. You just have to stop interfering with negative thoughts.', ta: 'நீங்கள் உங்கள் உடலைக் குணமடையவோ அல்லது உணவை ஜீரணிக்கவோ கட்டாயப்படுத்த வேண்டியதில்லை; அது இந்த விஷயங்களைச் செய்ய விரும்புகிறது. நீங்கள் எதிர்மறை எண்ணங்களுடன் தலையிடுவதை நிறுத்த வேண்டும்.' },
      example: { en: 'A cut on your finger heals automatically without your conscious effort, provided you keep it clean.', ta: 'நீங்கள் அதை சுத்தமாக வைத்திருக்கும் வரை, உங்கள் வெளிமனதின் முயற்சி இல்லாமல் உங்கள் விரலில் ஏற்பட்ட வெட்டு தானாகவே குணமாகும்.' },
      actionStep: { en: 'Trust your body. When you feel a minor ache, assume your body is actively fixing it, rather than assuming the worst.', ta: 'உங்கள் உடலை நம்புங்கள். ஒரு சிறிய வலியை நீங்கள் உணரும்போது, மோசமானதை நினைப்பதற்குப் பதிலாக, உங்கள் உடல் அதைச் சரிசெய்கிறது என்று கருதுங்கள்.' },
      reflectionQuestion: { en: 'Do you trust your body\'s natural intelligence, or do you constantly worry about it breaking down?', ta: 'உங்கள் உடலின் இயற்கையான நுண்ணறிவை நீங்கள் நம்புகிறீர்களா, அல்லது அது பழுதடைந்துவிடும் என்று நீங்கள் தொடர்ந்து கவலைப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'How to Get the Results You Want', ta: 'நீங்கள் விரும்பும் முடிவுகளை எவ்வாறு பெறுவது' },
      explanation: { en: 'Mental coercion or trying too hard defeats its own purpose. The subconscious mind does not respond to mental coercion; it responds to faith.', ta: 'மனநல வற்புறுத்தல் அல்லது மிகவும் கடினமாக முயற்சிப்பது அதன் சொந்த நோக்கத்தையே தோற்கடிக்கிறது. ஆழ்மனம் மனநல வற்புறுத்தலுக்கு பதிலளிக்காது; அது நம்பிக்கைக்கு பதிலளிக்கிறது.' },
      whyItMatters: { en: 'Struggling and worrying sends a message of "lack" to the subconscious, which then creates more lack.', ta: 'போராடுவதும் கவலைப்படுவதும் ஆழ்மனதிற்கு "பற்றாக்குறை" என்ற செய்தியை அனுப்புகிறது, அது பின்னர் அதிக பற்றாக்குறையை உருவாக்குகிறது.' },
      example: { en: 'Trying so hard to fall asleep that you stay awake all night. Sleep comes when you relax.', ta: 'தூங்குவதற்கு மிகவும் கடினமாக முயற்சிப்பதால் நீங்கள் இரவு முழுவதும் விழித்திருப்பீர்கள். நீங்கள் நிதானமாக இருக்கும்போது தூக்கம் வரும்.' },
      actionStep: { en: 'Stop stressing about *how* your goal will happen. Relax and just assume it is done.', ta: 'உங்கள் இலக்கு *எப்படி* நடக்கும் என்பதைப் பற்றிக் கவலைப்படுவதை நிறுத்துங்கள். ஓய்வெடுங்கள், அது முடிந்துவிட்டது என்று கருதுங்கள்.' },
      reflectionQuestion: { en: 'Where in your life are you pushing so hard that you are actually pushing the goal away?', ta: 'உங்கள் வாழ்க்கையில் எங்கே நீங்கள் மிகவும் கடினமாகத் தள்ளுகிறீர்கள், அதனால் இலக்கை விட்டு தள்ளி வைக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Use the Power of Imagination', ta: 'கற்பனை சக்தியைப் பயன்படுத்துங்கள்' },
      explanation: { en: 'In a battle between your will and your imagination, your imagination always wins.', ta: 'உங்கள் விருப்பத்திற்கும் உங்கள் கற்பனைக்கும் இடையிலான போரில், உங்கள் கற்பனையே எப்போதும் வெற்றி பெறுகிறது.' },
      whyItMatters: { en: 'You cannot force yourself to be brave (willpower) if you are vividly imagining a terrible disaster (imagination).', ta: 'நீங்கள் ஒரு பயங்கரமான பேரழிவை (கற்பனை) தெளிவாக கற்பனை செய்து கொண்டிருந்தால், உங்களை தைரியமாக (மன உறுதி) இருக்க கட்டாயப்படுத்த முடியாது.' },
      example: { en: 'Trying to diet using willpower while imagining eating a delicious chocolate cake. The imagination will eventually win.', ta: 'ஒரு சுவையான சாக்லேட் கேக் சாப்பிடுவதாக கற்பனை செய்து கொண்டே, மன உறுதியைப் பயன்படுத்தி டயட்டில் இருக்க முயற்சிப்பது. கற்பனை இறுதியில் வெல்லும்.' },
      actionStep: { en: 'Ensure your mental pictures match your goals. If you want a promotion, imagine shaking hands with your boss, not getting fired.', ta: 'உங்கள் மனப் படங்கள் உங்கள் இலக்குகளுடன் பொருந்துவதை உறுதிப்படுத்திக் கொள்ளுங்கள். நீங்கள் பதவி உயர்வு பெற விரும்பினால், உங்கள் முதலாளியுடன் கைகுலுக்குவதாக கற்பனை செய்து பாருங்கள், பணிநீக்கம் செய்யப்படுவதாக அல்ல.' },
      reflectionQuestion: { en: 'Do you spend more time imagining your success or imagining your failure?', ta: 'உங்கள் வெற்றியை கற்பனை செய்வதில் அதிக நேரம் செலவிடுகிறீர்களா அல்லது தோல்வியை கற்பனை செய்வதில் அதிக நேரம் செலவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Wealth is a State of Mind', ta: 'செல்வம் என்பது ஒரு மனநிலை' },
      explanation: { en: 'You can never attract wealth if you secretly despise it or think money is evil. The subconscious mind cannot attract what the conscious mind resents.', ta: 'நீங்கள் ரகசியமாக அதை வெறுத்தால் அல்லது பணம் தீமையானது என்று நினைத்தால் உங்களால் ஒருபோதும் செல்வத்தை ஈர்க்க முடியாது. வெளிமனம் வெறுக்கும் ஒன்றை ஆழ்மனதால் ஈர்க்க முடியாது.' },
      whyItMatters: { en: 'Your subconscious takes your feelings literally. If you feel jealous of rich people, your mind assumes you want to avoid being rich.', ta: 'உங்கள் ஆழ்மனம் உங்கள் உணர்வுகளை அப்படியே எடுத்துக்கொள்கிறது. பணக்காரர்களைப் பார்த்து நீங்கள் பொறாமைப்பட்டால், நீங்கள் பணக்காரராக இருப்பதைத் தவிர்க்க விரும்புவதாக உங்கள் மனம் கருதுகிறது.' },
      example: { en: 'Saying "I want to be rich" but then saying "Filthy rich people are greedy." Your mind gets confused and blocks wealth.', ta: '"நான் பணக்காரனாக விரும்புகிறேன்" என்று சொல்லிவிட்டு, "பணக்காரர்கள் பேராசைக்காரர்கள்" என்று சொல்வது. உங்கள் மனம் குழப்பமடைந்து செல்வத்தை தடுக்கிறது.' },
      actionStep: { en: 'Bless the wealth of others. When you see someone with a nice car, say "I am happy for them, and I am next."', ta: 'மற்றவர்களின் செல்வத்தை வாழ்த்துங்கள். நல்ல காருடன் ஒருவரைப் பார்க்கும்போது, "நான் அவர்களுக்காக மகிழ்ச்சியடைகிறேன், அடுத்து நான்தான்" என்று சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'What negative things did your parents teach you about money?', ta: 'பணம் பற்றி உங்கள் பெற்றோர் உங்களுக்குக் கற்றுக் கொடுத்த எதிர்மறையான விஷயங்கள் என்ன?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Your Right to be Rich', ta: 'பணக்காரராக இருப்பதற்கான உங்கள் உரிமை' },
      explanation: { en: 'It is your right to be rich. You are here to lead the abundant life and be happy, radiant, and free.', ta: 'பணக்காரராக இருப்பது உங்கள் உரிமை. நீங்கள் வளமான வாழ்க்கை வாழவும், மகிழ்ச்சியாகவும், பிரகாசமாகவும், சுதந்திரமாகவும் இருக்கவே இங்கு வந்துள்ளீர்கள்.' },
      whyItMatters: { en: 'Poverty is a mental disease. There is no virtue in poverty.', ta: 'வறுமை ஒரு மனநோய். வறுமையில் எந்த நற்பண்பும் இல்லை.' },
      example: { en: 'Believing that suffering financially makes you a more spiritual or noble person is a toxic belief that keeps you poor.', ta: 'நிதி ரீதியாக கஷ்டப்படுவது உங்களை ஒரு ஆன்மீக அல்லது உன்னதமான நபராக ஆக்குகிறது என்று நம்புவது ஒரு நச்சு நம்பிக்கையாகும், அது உங்களை ஏழையாகவே வைத்திருக்கும்.' },
      actionStep: { en: 'Affirm today: "I deserve to be wealthy, and wealth allows me to do more good in the world."', ta: 'இன்று உறுதிப்படுத்துங்கள்: "நான் பணக்காரனாக இருக்கத் தகுதியானவன், மேலும் செல்வம் உலகில் இன்னும் பல நன்மைகளைச் செய்ய என்னை அனுமதிக்கிறது."' },
      reflectionQuestion: { en: 'Do you feel guilty when you spend money on yourself?', ta: 'உங்களுக்காக பணம் செலவழிக்கும் போது நீங்கள் குற்ற உணர்ச்சியுடன் உணர்கிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Your Subconscious Mind as a Partner in Success', ta: 'வெற்றியில் ஒரு பங்காளியாக உங்கள் ஆழ்மனம்' },
      explanation: { en: 'Success means successful living. When you are peaceful, happy, joyous, and doing what you love, you are successful.', ta: 'வெற்றி என்பது வெற்றிகரமான வாழ்வு. நீங்கள் அமைதியாகவும், மகிழ்ச்சியாகவும், நீங்கள் விரும்பியதைச் செய்யும்போதும், நீங்கள் வெற்றி பெறுகிறீர்கள்.' },
      whyItMatters: { en: 'True success involves the whole person. If you are rich but have an ulcer and no friends, you have not succeeded.', ta: 'உண்மையான வெற்றி என்பது முழு நபரையும் உள்ளடக்கியது. நீங்கள் பணக்காரராக இருந்து, ஆனால் அல்சர் வந்து நண்பர்கள் இல்லாமல் இருந்தால், நீங்கள் வெற்றி பெறவில்லை.' },
      example: { en: 'A businessman who makes millions but cannot sleep without pills is a failure in the art of living.', ta: 'மில்லியன்களை சம்பாதித்து, ஆனால் மாத்திரைகள் இல்லாமல் தூங்க முடியாத ஒரு தொழிலதிபர் வாழும் கலையில் தோல்வியுற்றவர்.' },
      actionStep: { en: 'Redefine your picture of success to include health, peace of mind, and great relationships, not just money.', ta: 'வெற்றி பற்றிய உங்கள் பார்வையை மறுவரையறை செய்து, அதில் பணத்தை மட்டும் சேர்க்காமல் ஆரோக்கியம், மன அமைதி மற்றும் சிறந்த உறவுகளையும் சேர்த்துக் கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you sacrificing your health or peace to achieve a financial goal?', ta: 'ஒரு நிதி இலக்கை அடைவதற்காக உங்கள் ஆரோக்கியத்தையோ அமைதியையோ தியாகம் செய்கிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Scientists Use the Subconscious Mind', ta: 'விஞ்ஞானிகள் ஆழ்மனதைப் பயன்படுத்துகிறார்கள்' },
      explanation: { en: 'Many great scientists and inventors (like Einstein and Tesla) used their subconscious minds to solve complex problems.', ta: 'பல சிறந்த விஞ்ஞானிகளும் கண்டுபிடிப்பாளர்களும் (ஐன்ஸ்டீன் மற்றும் டெஸ்லா போன்றவர்கள்) சிக்கலான பிரச்சினைகளை தீர்க்க தங்கள் ஆழ்மனதைப் பயன்படுத்தினர்.' },
      whyItMatters: { en: 'When the conscious mind is stuck, the subconscious mind can provide the answer if you ask it clearly and let it go.', ta: 'வெளிமனம் சிக்கிக்கொள்ளும்போது, நீங்கள் தெளிவாகக் கேட்டுவிட்டு விட்டுவிட்டால் ஆழ்மனம் பதிலைத் தர முடியும்.' },
      example: { en: 'Thomas Edison taking a nap when stuck on an invention, trusting his subconscious to give him the idea when he woke up.', ta: 'தாமஸ் எடிசன் ஒரு கண்டுபிடிப்பில் சிக்கிக்கொண்டபோது தூங்கச் சென்று, விழித்தெழுந்ததும் தனது ஆழ்மனம் தனக்கு யோசனையைத் தரும் என்று நம்பியது.' },
      actionStep: { en: 'Before sleeping tonight, ask your subconscious to solve a specific problem you are facing at work.', ta: 'இன்றிரவு தூங்குவதற்கு முன், வேலையில் நீங்கள் எதிர்கொள்ளும் ஒரு குறிப்பிட்ட பிரச்சனையைத் தீர்க்க உங்கள் ஆழ்மனதிடம் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Have you ever had a brilliant idea pop into your head while taking a shower? That was your subconscious.', ta: 'நீங்கள் குளிக்கும்போது ஒரு சிறந்த யோசனை உங்கள் நினைவுக்கு வந்திருக்கிறதா? அதுதான் உங்கள் ஆழ்மனம்.' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Sleep and Your Subconscious', ta: 'தூக்கம் மற்றும் உங்கள் ஆழ்மனம்' },
      explanation: { en: 'During sleep, your conscious mind is suspended, but your subconscious remains highly active. Sleep is a time for physical and mental restoration.', ta: 'தூக்கத்தின் போது, உங்கள் வெளிமனம் இடைநிறுத்தப்படுகிறது, ஆனால் உங்கள் ஆழ்மனம் மிகவும் சுறுசுறுப்பாகவே இருக்கும். தூக்கம் என்பது உடல் மற்றும் மனதை மீட்டெடுப்பதற்கான நேரம்.' },
      whyItMatters: { en: 'Going to sleep angry or anxious is like poisoning your own mind for 8 hours. Going to sleep peaceful heals you.', ta: 'கோபமாகவோ அல்லது கவலையாகவோ தூங்கச் செல்வது 8 மணிநேரம் உங்கள் சொந்த மனதிற்கு விஷம் வைப்பது போன்றது. அமைதியாக தூங்கச் செல்வது உங்களைக் குணப்படுத்துகிறது.' },
      example: { en: 'Forgiving everyone who wronged you before closing your eyes ensures a deep, restorative sleep.', ta: 'கண்களை மூடுவதற்கு முன்பு உங்களுக்குத் தீங்கு செய்த அனைவரையும் மன்னிப்பது ஆழ்ந்த, நிம்மதியான தூக்கத்தை உறுதி செய்கிறது.' },
      actionStep: { en: 'Make a rule to never bring an argument or worry into the bedroom.', ta: 'படுக்கையறைக்குள் ஒருபோதும் வாதத்தையோ கவலையையோ கொண்டு வராதீர்கள் என்று ஒரு விதியை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'Do you use your bed for worrying, or for resting?', ta: 'நீங்கள் உங்கள் படுக்கையை கவலைப்படுவதற்காகப் பயன்படுத்துகிறீர்களா அல்லது ஓய்வெடுப்பதற்காகவா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Your Subconscious and Marital Problems', ta: 'உங்கள் ஆழ்மனமும் திருமணப் பிரச்சனைகளும்' },
      explanation: { en: 'Marriage problems often begin in the mind. If you constantly criticize your partner in your mind, you are destroying the relationship from within.', ta: 'திருமணப் பிரச்சனைகள் பெரும்பாலும் மனதில்தான் தொடங்குகின்றன. நீங்கள் தொடர்ந்து உங்கள் துணையை மனதில் விமர்சித்தால், நீங்கள் உள்ளிருந்தே உறவை அழிக்கிறீர்கள்.' },
      whyItMatters: { en: 'Your outward reality with your partner is a direct reflection of your inward thoughts about them.', ta: 'உங்கள் துணையுடனான உங்கள் வெளிப்புற யதார்த்தம் அவர்களைப் பற்றிய உங்கள் உள் எண்ணங்களின் நேரடி பிரதிபலிப்பாகும்.' },
      example: { en: 'A husband who secretly resents his wife\'s spending habits will eventually manifest an outward argument about money.', ta: 'மனைவியின் செலவு செய்யும் பழக்கத்தை ரகசியமாக வெறுக்கும் ஒரு கணவன், இறுதியில் பணத்தைப் பற்றிய ஒரு பெரிய சண்டையை வெளிப்படுத்துவான்.' },
      actionStep: { en: 'For the next 3 days, refuse to harbor a single critical thought about your partner or close friend.', ta: 'அடுத்த 3 நாட்களுக்கு, உங்கள் துணை அல்லது நெருங்கிய நண்பரைப் பற்றி ஒரு விமர்சன எண்ணத்தைக் கூட மனதில் கொள்ள மறுக்கவும்.' },
      reflectionQuestion: { en: 'If your partner could hear your thoughts about them, would they feel loved or attacked?', ta: 'அவர்களைப் பற்றிய உங்கள் எண்ணங்களை உங்கள் துணை கேட்க முடிந்தால், அவர்கள் நேசிக்கப்படுவதாக உணர்வார்களா அல்லது தாக்கப்படுவதாக உணர்வார்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Your Subconscious Mind and Your Happiness', ta: 'உங்கள் ஆழ்மனமும் உங்கள் மகிழ்ச்சியும்' },
      explanation: { en: 'Happiness is a habit. You must choose happiness. You cannot wait for circumstances to make you happy.', ta: 'மகிழ்ச்சி என்பது ஒரு பழக்கம். நீங்கள் மகிழ்ச்சியைத் தேர்ந்தெடுக்க வேண்டும். சூழ்நிலைகள் உங்களை மகிழ்ச்சியாக்கும் என்று நீங்கள் காத்திருக்க முடியாது.' },
      whyItMatters: { en: 'Your subconscious mind accepts your choice. If you choose to be unhappy, it will find endless reasons to validate your unhappiness.', ta: 'உங்கள் ஆழ்மனம் உங்கள் தேர்வை ஏற்றுக்கொள்கிறது. நீங்கள் மகிழ்ச்சியற்றவராக இருக்கத் தேர்ந்தெடுத்தால், அது உங்கள் மகிழ்ச்சியற்ற தன்மையை சரிபார்க்க முடிவற்ற காரணங்களைக் கண்டறியும்.' },
      example: { en: 'Waking up and saying "Today is going to be a terrible day" programs your mind to notice every single negative thing that happens.', ta: 'காலையில் எழுந்து "இன்று ஒரு மோசமான நாளாக இருக்கப்போகிறது" என்று சொல்வது, நடக்கும் ஒவ்வொரு எதிர்மறையான விஷயத்தையும் கவனிக்க உங்கள் மனதை நிரல்படுத்துகிறது.' },
      actionStep: { en: 'Say this every morning: "I choose happiness today. I choose peace today."', ta: 'தினமும் காலையில் இதைச் சொல்லுங்கள்: "நான் இன்று மகிழ்ச்சியைத் தேர்ந்தெடுக்கிறேன். நான் இன்று அமைதியைத் தேர்ந்தெடுக்கிறேன்."' },
      reflectionQuestion: { en: 'Are you delaying your happiness until you achieve a specific goal?', ta: 'ஒரு குறிப்பிட்ட இலக்கை அடையும் வரை உங்கள் மகிழ்ச்சியைத் தள்ளிப் போடுகிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Harmonious Human Relations', ta: 'இணக்கமான மனித உறவுகள்' },
      explanation: { en: 'The Golden Rule: As you would that men should do to you, do ye also to them. What you think and feel about others, you are bringing into your own experience.', ta: 'பொன் விதி: மனிதர்கள் உங்களுக்கு என்ன செய்ய வேண்டும் என்று நீங்கள் விரும்புகிறீர்களோ, அதையே நீங்களும் அவர்களுக்குச் செய்யுங்கள். மற்றவர்களைப் பற்றி நீங்கள் என்ன நினைக்கிறீர்களோ, உணர்கிறீர்களோ, அதையே உங்கள் சொந்த அனுபவத்திற்குக் கொண்டு வருகிறீர்கள்.' },
      whyItMatters: { en: 'Resentment towards others is mental poison. It harms you, not them.', ta: 'மற்றவர்கள் மீதான கோபம் ஒரு மனநல விஷம். அது அவர்களுக்கு அல்ல, உங்களுக்குத்தான் தீங்கு விளைவிக்கும்.' },
      example: { en: 'Hating a coworker who got a promotion poisons your own mind and blocks your own promotion.', ta: 'பதவி உயர்வு பெற்ற ஒரு சக ஊழியரை வெறுப்பது உங்கள் சொந்த மனதை விஷமாக்குகிறது மற்றும் உங்கள் சொந்த பதவி உயர்வைத் தடுக்கிறது.' },
      actionStep: { en: 'Send thoughts of peace, success, and health to someone you currently dislike.', ta: 'நீங்கள் தற்போது விரும்பாத ஒருவருக்கு அமைதி, வெற்றி மற்றும் ஆரோக்கியத்தின் எண்ணங்களை அனுப்புங்கள்.' },
      reflectionQuestion: { en: 'Who are you currently holding a grudge against? How is that grudge helping you?', ta: 'நீங்கள் தற்போது யார் மீது கோபமாக இருக்கிறீர்கள்? அந்தக் கோபம் உங்களுக்கு எப்படி உதவுகிறது?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'How to Use Your Subconscious Mind for Forgiveness', ta: 'மன்னிப்பிற்காக உங்கள் ஆழ்மனதை எவ்வாறு பயன்படுத்துவது' },
      explanation: { en: 'Life plays no favorites. God is Life, and this Life Principle is flowing through you. To be fully healthy and wealthy, you must forgive everyone, including yourself.', ta: 'வாழ்க்கை யாரிடமும் பாரபட்சம் காட்டுவதில்லை. கடவுளே வாழ்க்கை, இந்த வாழ்க்கை தத்துவம் உங்கள் மூலம் பாய்கிறது. முழுமையான ஆரோக்கியத்துடனும் செல்வத்துடனும் இருக்க, உங்களை உட்பட அனைவரையும் நீங்கள் மன்னிக்க வேண்டும்.' },
      whyItMatters: { en: 'Guilt and unforgiveness are heavy burdens that block the flow of the subconscious mind\'s healing power.', ta: 'குற்ற உணர்ச்சியும் மன்னிக்காமையும் ஆழ்மனதின் குணப்படுத்தும் சக்தியின் ஓட்டத்தைத் தடுக்கும் பெரும் சுமைகளாகும்.' },
      example: { en: 'A person holding onto childhood trauma will continue to manifest physical pain until they mentally forgive and let go.', ta: 'குழந்தைப்பருவ அதிர்ச்சியைப் பிடித்துக் கொண்டிருக்கும் ஒரு நபர், அவர்கள் மனதார மன்னித்து அதை விட்டுவிடும் வரை உடல் வலியைத் தொடர்ந்து அனுபவிப்பார்.' },
      actionStep: { en: 'Say out loud: "I fully and freely forgive [Name], and I release them to their own good."', ta: 'சத்தமாகச் சொல்லுங்கள்: "நான் [பெயர்]-ஐ முழுமையாகவும் சுதந்திரமாகவும் மன்னிக்கிறேன், மேலும் அவர்களை அவர்களின் சொந்த நலனுக்காக விடுவிக்கிறேன்."' },
      reflectionQuestion: { en: 'Have you truly forgiven yourself for your past mistakes?', ta: 'உங்கள் கடந்த கால தவறுகளுக்காக உங்களை நீங்கள் உண்மையாக மன்னித்துவிட்டீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'How to Remove Mental Blocks', ta: 'மன தடைகளை எவ்வாறு அகற்றுவது' },
      explanation: { en: 'If you are facing a block, the problem is your own conscious mind focusing on the obstacle rather than the solution.', ta: 'நீங்கள் ஒரு தடையை எதிர்கொண்டால், பிரச்சனை உங்களின் சொந்த வெளிமனம் தான், அது தீர்வை விட தடையின் மீதே அதிக கவனம் செலுத்துகிறது.' },
      whyItMatters: { en: 'The subconscious mind has the answer, but it cannot deliver it if your conscious mind is clouded with panic and fear of failure.', ta: 'ஆழ்மனதிடம் பதில் இருக்கிறது, ஆனால் உங்களின் வெளிமனம் பீதியாலும் தோல்வி பயத்தாலும் மங்கலாக இருந்தால் அதனால் பதிலைக் கொடுக்க முடியாது.' },
      example: { en: 'Staring at a blank page with writer\'s block because you are terrified of writing something bad.', ta: 'ஏதாவது தவறாக எழுதிவிடுவோமோ என்ற பயத்தில் வெற்றுத் தாளைப் பார்த்துக் கொண்டே இருப்பது.' },
      actionStep: { en: 'When blocked, completely step away from the problem. Relax your body and affirm, "The infinite intelligence within me knows the answer and is revealing it to me now."', ta: 'தடை ஏற்படும்போது, பிரச்சனையிலிருந்து முற்றிலுமாக விலகுங்கள். உங்கள் உடலைத் தளர்த்தி, "எனக்குள்ளிருக்கும் எல்லையற்ற அறிவு பதிலை அறிந்துள்ளது, அதை இப்போது எனக்கு வெளிப்படுத்துகிறது" என்று உறுதிப்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'When you face a problem, do you stare at the wall, or do you step back and let the answer come to you?', ta: 'நீங்கள் ஒரு பிரச்சனையை எதிர்கொள்ளும்போது, நீங்கள் சுவரை முறைத்துப் பார்க்கிறீர்களா, அல்லது பின்வாங்கி பதில் உங்களைத் தேடி வர அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Staying Young in Spirit Forever', ta: 'என்றென்றும் இளமையாக இருத்தல்' },
      explanation: { en: 'You grow old when you lose interest in life, when you cease to dream, to hunger after new truths, and to search for new worlds to conquer.', ta: 'நீங்கள் வாழ்க்கையில் ஆர்வத்தை இழக்கும்போதும், கனவு காண்பதை நிறுத்தும்போதும், புதிய உண்மைகளைத் தேடுவதை நிறுத்தும்போதும் நீங்கள் வயதாகிறீர்கள்.' },
      whyItMatters: { en: 'Age is not the flight of years; it is the dawn of wisdom in the mind of man. Your subconscious mind never grows old.', ta: 'வயது என்பது வருடங்களின் ஓட்டம் அல்ல; அது மனிதனின் மனதில் உதிக்கும் விடியல். உங்கள் ஆழ்மனதிற்கு ஒருபோதும் வயதாவதில்லை.' },
      example: { en: 'An 80-year-old learning a new language and starting a business is younger in spirit than a cynical 30-year-old.', ta: 'ஒரு புதிய மொழியைக் கற்றுக் கொண்டு வியாபாரத்தைத் தொடங்கும் 80 வயது முதியவர், விரக்தியடைந்த 30 வயது இளைஞரை விட மனதளவில் இளமையானவர்.' },
      actionStep: { en: 'Start learning a completely new skill today, regardless of your physical age.', ta: 'உங்கள் உடல் வயதைப் பொருட்படுத்தாமல், இன்று முற்றிலும் புதிய திறனைக் கற்கத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'Are you using your age as an excuse to stop growing?', ta: 'நீங்கள் வளர்வதை நிறுத்த உங்கள் வயதை ஒரு சாக்காகப் பயன்படுத்துகிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The Power of Your Subconscious Mind' });
    if (existing) {
      console.log('The Power of Your Subconscious Mind already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The Power of Your Subconscious Mind' });
    }
    
    await WisdomBook.create(subconsciousBook);
    console.log('The Power of Your Subconscious Mind added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
