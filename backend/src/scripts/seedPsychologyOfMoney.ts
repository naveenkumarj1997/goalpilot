import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const moneyBook = {
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  coverImage: 'https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg',
  categories: ['Finance', 'Psychology', 'Self-Help'],
  themes: [
    { en: 'Wealth vs Money', ta: 'செல்வம் vs பணம்' },
    { en: 'Behavior over Math', ta: 'கணிதத்தை விட நடத்தை' }
  ],
  overview: {
    en: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.',
    ta: 'பணத்தை சிறப்பாக கையாள்வது உங்களுக்கு எவ்வளவு தெரியும் என்பதைப் பொறுத்தது அல்ல. அது நீங்கள் எப்படி நடந்து கொள்கிறீர்கள் என்பதைப் பொறுத்தது. நடத்தை மிகவும் புத்திசாலிகளுக்குக் கூட கற்பிக்க கடினமான ஒன்று.'
  },
  topQuotes: [
    { en: 'Wealth is what you don’t see.', ta: 'செல்வம் என்பது நீங்கள் பார்க்காதது.' },
    { en: 'Saving is a gap between your ego and your income.', ta: 'சேமிப்பு என்பது உங்கள் ஈகோவிற்கும் உங்கள் வருமானத்திற்கும் இடையிலான இடைவெளி.' },
    { en: 'Nothing is as good or as bad as it seems.', ta: 'எதுவும் அது தோன்றும் அளவுக்கு நல்லதோ கெட்டதோ அல்ல.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'No One\'s Crazy', ta: 'யாரும் பைத்தியம் அல்ல' },
      explanation: { en: 'People do crazy things with money, but no one is crazy. Everyone forms their views on money based on the generation and economy they grew up in.', ta: 'மக்கள் பணத்துடன் பைத்தியக்காரத்தனமான விஷயங்களைச் செய்கிறார்கள், ஆனால் யாரும் பைத்தியம் அல்ல. ஒவ்வொருவரும் தாங்கள் வளர்ந்த தலைமுறை மற்றும் பொருளாதாரத்தின் அடிப்படையில் பணத்தைப் பற்றிய தங்கள் கருத்துக்களை உருவாக்குகிறார்கள்.' },
      whyItMatters: { en: 'It teaches empathy. Your financial decisions make sense to you, and theirs make sense to them.', ta: 'இது பச்சாதாபத்தைக் கற்பிக்கிறது. உங்கள் நிதி முடிவுகள் உங்களுக்கு அர்த்தமுள்ளதாக இருக்கும், அவர்களுடையது அவர்களுக்கு அர்த்தமுள்ளதாக இருக்கும்.' },
      example: { en: 'Someone who grew up during a severe depression might hoard cash, while someone who grew up in a boom might invest aggressively.', ta: 'பொருளாதார மந்தநிலையில் வளர்ந்த ஒருவர் பணத்தை பதுக்கி வைக்கலாம், அதே சமயம் நல்ல வளர்ச்சியில் வளர்ந்தவர் தீவிரமாக முதலீடு செய்யலாம்.' },
      actionStep: { en: 'Stop judging others for their financial decisions. Focus on what works for you.', ta: 'மற்றவர்களின் நிதி முடிவுகளுக்காக அவர்களை மதிப்பிடுவதை நிறுத்துங்கள். உங்களுக்கு எது வேலை செய்கிறதோ அதில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'How did your parents\' attitude towards money shape yours?', ta: 'பணம் குறித்த உங்கள் பெற்றோரின் அணுகுமுறை உங்களுடையதை எவ்வாறு வடிவமைத்தது?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Luck & Risk', ta: 'அதிர்ஷ்டம் மற்றும் ஆபத்து' },
      explanation: { en: 'Luck and risk are siblings. They are both the reality that every outcome in life is guided by forces other than individual effort.', ta: 'அதிர்ஷ்டமும் ஆபத்தும் உடன்பிறப்புகள். வாழ்க்கையில் ஒவ்வொரு விளைவும் தனிப்பட்ட முயற்சியைத் தவிர மற்ற சக்திகளால் வழிநடத்தப்படுகிறது என்பதே இவை இரண்டின் உண்மை.' },
      whyItMatters: { en: 'You shouldn\'t let success go to your head or failure go to your heart.', ta: 'வெற்றியை நீங்கள் தலைக்குக் கொண்டு செல்லக் கூடாது அல்லது தோல்வியை இதயத்திற்கு எடுத்துச் செல்லக் கூடாது.' },
      example: { en: 'Bill Gates was incredibly smart and hardworking, but he also happened to attend one of the only high schools in the world with a computer.', ta: 'பில் கேட்ஸ் நம்பமுடியாத அளவிற்கு புத்திசாலி மற்றும் கடின உழைப்பாளி, ஆனால் அவர் கணினி இருந்த உலகின் ஒரு சில உயர்நிலைப் பள்ளிகளில் ஒன்றில் படித்தார்.' },
      actionStep: { en: 'Attribute a portion of your success to luck, and a portion of others\' failures to risk.', ta: 'உங்கள் வெற்றியின் ஒரு பகுதியை அதிர்ஷ்டத்திற்கும், மற்றவர்களின் தோல்வியின் ஒரு பகுதியை ஆபத்திற்கும் காரணமாக்குங்கள்.' },
      reflectionQuestion: { en: 'What is one lucky break you had that changed your life trajectory?', ta: 'உங்கள் வாழ்க்கைப் பாதையை மாற்றிய ஒரு அதிர்ஷ்டம் எது?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Never Enough', ta: 'எப்போதும் போதாது' },
      explanation: { en: 'There is no reason to risk what you have and need for what you don’t have and don’t need.', ta: 'உங்களிடம் இருப்பதையும் தேவைப்படுவதையும், உங்களிடம் இல்லாத மற்றும் தேவையில்லாத ஒன்றிற்காக பணயம் வைப்பதில் எந்த அர்த்தமும் இல்லை.' },
      whyItMatters: { en: 'If you don\'t know what "enough" is, you will continually take reckless risks until you lose everything.', ta: '"எவ்வளவு போதுமானது" என்று உங்களுக்குத் தெரியாவிட்டால், அனைத்தையும் இழக்கும் வரை நீங்கள் தொடர்ந்து பொறுப்பற்ற அபாயங்களை எடுப்பீர்கள்.' },
      example: { en: 'A millionaire risking their entire fortune on a shady investment just to become a billionaire.', ta: 'ஒரு மில்லியனர் பில்லியனர் ஆவதற்காக சந்தேகத்திற்குரிய முதலீட்டில் தனது முழு செல்வத்தையும் பணயம் வைப்பது.' },
      actionStep: { en: 'Define clearly what your "enough" number is.', ta: 'உங்கள் "போதுமானது" என்ற அளவுகோல் என்ன என்பதை தெளிவாக வரையறுக்கவும்.' },
      reflectionQuestion: { en: 'At what point will you stop moving the goalposts of success?', ta: 'எந்த கட்டத்தில் வெற்றியின் இலக்குகளை நகர்த்துவதை நிறுத்துவீர்கள்?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Confounding Compounding', ta: 'கூட்டு வட்டியின் ஆச்சரியம்' },
      explanation: { en: 'Good investing isn’t necessarily about earning the highest returns. It’s about earning pretty good returns that you can stick with for the longest period of time.', ta: 'நல்ல முதலீடு என்பது அதிக வருமானத்தை ஈட்டுவது அல்ல. இது நீண்ட காலம் உங்களுடன் இருக்கக்கூடிய நல்ல வருமானத்தை ஈட்டுவது.' },
      whyItMatters: { en: 'Time is the most powerful force in investing. 95% of Warren Buffett\'s wealth came after his 65th birthday.', ta: 'முதலீட்டில் நேரம் மிகவும் சக்திவாய்ந்த சக்தி. வாரன் பஃபெட்டின் செல்வத்தில் 95% அவரது 65வது பிறந்தநாளுக்குப் பிறகுதான் வந்தது.' },
      example: { en: 'Starting to save $100 a month at age 20 vs $1000 a month at age 50.', ta: '20 வயதில் மாதம் $100 சேமிக்கத் தொடங்குவது மற்றும் 50 வயதில் மாதம் $1000 சேமிப்பது.' },
      actionStep: { en: 'Start investing today, no matter how small the amount.', ta: 'தொகை எவ்வளவு சிறியதாக இருந்தாலும் இன்றே முதலீடு செய்யத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'How many years have your current investments been compounding?', ta: 'உங்கள் தற்போதைய முதலீடுகள் எத்தனை ஆண்டுகளாக கூட்டு வட்டியை ஈட்டுகின்றன?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Getting Wealthy vs. Staying Wealthy', ta: 'பணக்காரர் ஆவது vs பணக்காரராகவே இருப்பது' },
      explanation: { en: 'Getting money requires taking risks, being optimistic, and putting yourself out there. Keeping money requires the opposite of taking risk.', ta: 'பணத்தைப் பெறுவதற்கு ரிஸ்க் எடுக்க வேண்டும், நம்பிக்கையுடன் இருக்க வேண்டும். ஆனால் பணத்தை தக்கவைக்க ரிஸ்க் எடுப்பதற்கு நேர்மாறான குணம் தேவை.' },
      whyItMatters: { en: 'Survival is the most important skill in finance. If you can\'t survive, your money can\'t compound.', ta: 'நிதியில் தப்பிப்பிழைப்பது மிக முக்கியமான திறன். உங்களால் பிழைக்க முடியாவிட்டால், உங்கள் பணம் பெருக முடியாது.' },
      example: { en: 'An entrepreneur who made millions taking a huge risk, but then lost it all because they couldn\'t stop taking huge risks.', ta: 'பெரிய ரிஸ்க் எடுத்து மில்லியன்களை சம்பாதித்த ஒரு தொழில்முனைவோர், தொடர்ந்து ரிஸ்க் எடுத்ததால் அனைத்தையும் இழந்தார்.' },
      actionStep: { en: 'Build an emergency fund that gives you a margin of safety.', ta: 'உங்களுக்கு பாதுகாப்பு விளிம்பை அளிக்கும் அவசர நிதியை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'Are your habits geared toward making money or keeping money?', ta: 'உங்கள் பழக்கவழக்கங்கள் பணம் சம்பாதிப்பதற்கா அல்லது தக்கவைப்பதற்கா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Tails, You Win', ta: 'வால் விழுந்தால், நீங்கள் வெற்றி பெறுகிறீர்கள்' },
      explanation: { en: 'You can be wrong half the time and still make a fortune. Most of the returns in the market come from a tiny percentage of investments.', ta: 'நீங்கள் பாதி நேரம் தவறாக இருந்தாலும் நிறைய பணம் சம்பாதிக்கலாம். சந்தையில் பெரும்பாலான வருமானம் முதலீடுகளின் சிறிய சதவீதத்தில் இருந்துதான் வருகிறது.' },
      whyItMatters: { en: 'You don\'t need every decision to be perfect. You just need a few massive winners.', ta: 'ஒவ்வொரு முடிவும் சரியாக இருக்க வேண்டிய அவசியமில்லை. உங்களுக்கு சில பெரிய வெற்றிகள் மட்டும் போதும்.' },
      example: { en: 'A venture capital fund invests in 50 companies. 48 fail, but 2 become the next Google and Amazon, making the fund wildly profitable.', ta: 'ஒரு நிறுவனம் 50 கம்பெனிகளில் முதலீடு செய்கிறது. 48 தோல்வியடைகின்றன, ஆனால் 2 அடுத்த கூகுளாகவும் அமேசானாகவும் மாறி, பெரும் லாபத்தைத் தருகின்றன.' },
      actionStep: { en: 'Diversify your investments to increase your chances of catching a "tail event" (a huge winner).', ta: 'ஒரு பெரிய வெற்றியைப் பெறுவதற்கான வாய்ப்புகளை அதிகரிக்க உங்கள் முதலீடுகளை பல்வகைப்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'How do you handle small losses on your path to big wins?', ta: 'பெரிய வெற்றிகளுக்கான பாதையில் ஏற்படும் சிறிய இழப்புகளை எப்படி கையாளுகிறீர்கள்?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Freedom', ta: 'சுதந்திரம்' },
      explanation: { en: 'The highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today."', ta: 'செல்வத்தின் மிக உயர்ந்த வடிவம் என்பது தினமும் காலையில் எழுந்து, "இன்று நான் என்ன வேண்டுமானாலும் செய்ய முடியும்" என்று கூற முடிவதுதான்.' },
      whyItMatters: { en: 'Controlling your time is the highest dividend money pays.', ta: 'உங்கள் நேரத்தைக் கட்டுப்படுத்துவதுதான் பணம் தரும் மிக உயர்ந்த லாபம்.' },
      example: { en: 'Taking a lower-paying job that offers a flexible schedule and less stress, rather than a high-paying job that owns your life.', ta: 'உங்கள் வாழ்க்கையை ஆக்கிரமிக்கும் அதிக சம்பளம் தரும் வேலையை விட, நெகிழ்வான நேரமும் குறைந்த மன அழுத்தமும் உள்ள குறைந்த சம்பள வேலையைத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Use a portion of your savings specifically to buy back your time.', ta: 'உங்கள் நேரத்தை திரும்பப் பெற உங்கள் சேமிப்பின் ஒரு பகுதியை பயன்படுத்தவும்.' },
      reflectionQuestion: { en: 'If you had complete freedom today, how would you spend your time?', ta: 'இன்று உங்களுக்கு முழு சுதந்திரம் இருந்தால், உங்கள் நேரத்தை எப்படி செலவிடுவீர்கள்?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Man in the Car Paradox', ta: 'காரில் உள்ள மனிதன் முரண்பாடு' },
      explanation: { en: 'No one is impressed with your possessions as much as you are. When you see someone in a nice car, you don\'t admire the driver; you imagine yourself in the car.', ta: 'உங்களை விட யாரும் உங்கள் பொருட்களைப் பார்த்து ஆச்சரியப்படுவதில்லை. நீங்கள் ஒருவரை நல்ல காரில் பார்க்கும்போது, டிரைவரை நீங்கள் ரசிப்பதில்லை; உங்களை அந்த காரில் கற்பனை செய்து பார்க்கிறீர்கள்.' },
      whyItMatters: { en: 'Buying expensive things to gain respect doesn\'t work.', ta: 'மரியாதையைப் பெற விலையுயர்ந்த பொருட்களை வாங்குவது வேலை செய்யாது.' },
      example: { en: 'Buying a Ferrari thinking people will respect you, but people just look at the Ferrari and ignore you.', ta: 'மக்கள் உங்களை மதிப்பார்கள் என்று நினைத்து ஃபெராரி வாங்குவது, ஆனால் மக்கள் ஃபெராரியை மட்டும் பார்த்து உங்களை புறக்கணிக்கிறார்கள்.' },
      actionStep: { en: 'Stop buying things to impress people you don\'t even like.', ta: 'உங்களுக்கு பிடிக்காதவர்களை கவர பொருட்களை வாங்குவதை நிறுத்துங்கள்.' },
      reflectionQuestion: { en: 'What was the last expensive thing you bought purely for status?', ta: 'ஸ்டேட்டஸுக்காக நீங்கள் கடைசியாக வாங்கிய விலையுயர்ந்த பொருள் எது?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Wealth is What You Don\'t See', ta: 'செல்வம் என்பது நீங்கள் பார்க்காதது' },
      explanation: { en: 'Wealth is the nice cars not purchased. The diamonds not bought. The watches not worn. Wealth is financial assets that haven\'t yet been converted into the stuff you see.', ta: 'செல்வம் என்பது வாங்கப்படாத கார்கள். வாங்கப்படாத வைரங்கள். அணியப்படாத கைக்கடிகாரங்கள். செல்வம் என்பது நீங்கள் காணும் பொருளாக மாற்றப்படாத நிதி சொத்துக்கள்.' },
      whyItMatters: { en: 'We tend to judge wealth by what we see, but true wealth is hidden.', ta: 'நாம் காணும் பொருட்களை வைத்து செல்வத்தை மதிப்பிடுகிறோம், ஆனால் உண்மையான செல்வம் மறைக்கப்பட்டுள்ளது.' },
      example: { en: 'A person driving a $100,000 car might just be $100,000 in debt, while the millionaire drives a 10-year-old Toyota.', ta: '$100,000 கார் ஓட்டும் ஒருவர் $100,000 கடனில் இருக்கலாம், அதேசமயம் மில்லியனர் 10 வருட பழைய டொயோட்டாவை ஓட்டலாம்.' },
      actionStep: { en: 'Focus on building your net worth (what you don\'t see) rather than your spending profile (what you do see).', ta: 'உங்கள் செலவுகளைக் காட்டுவதை விட உங்கள் நிகர மதிப்பைக் கட்டியெழுப்புவதில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Do you feel pressure to look rich, or are you focused on actually being wealthy?', ta: 'பணக்காரர்களாகத் தோன்ற வேண்டும் என்ற அழுத்தம் உங்களுக்கு இருக்கிறதா அல்லது உண்மையிலேயே பணக்காரர்களாக இருப்பதில் கவனம் செலுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Save Money', ta: 'பணத்தை சேமிக்கவும்' },
      explanation: { en: 'Saving is the gap between your ego and your income. You don\'t need a specific reason to save.', ta: 'சேமிப்பு என்பது உங்கள் ஈகோவிற்கும் உங்கள் வருமானத்திற்கும் இடையிலான இடைவெளி. சேமிப்பதற்கு ஒரு குறிப்பிட்ட காரணம் தேவையில்லை.' },
      whyItMatters: { en: 'Saving just for the sake of saving gives you flexibility and options in an unpredictable world.', ta: 'சேமிப்பிற்காக மட்டுமே சேமிப்பது எதிர்பாராத உலகில் உங்களுக்கு நெகிழ்வுத்தன்மையையும் விருப்பங்களையும் வழங்குகிறது.' },
      example: { en: 'Having a year of living expenses saved allows you to quit a toxic job without having another one lined up.', ta: 'ஒரு வருட வாழ்கைக்கான செலவை சேமித்து வைத்திருப்பது, வேறொரு வேலை கிடைக்காமலேயே நச்சுத்தன்மையான வேலையை விட்டுவிலக உங்களை அனுமதிக்கிறது.' },
      actionStep: { en: 'Automate your savings so a portion of your income disappears before you can spend it.', ta: 'உங்கள் சேமிப்பை தானியங்குபடுத்துங்கள், இதனால் நீங்கள் செலவு செய்வதற்கு முன்பே உங்கள் வருமானத்தின் ஒரு பகுதி சேமிக்கப்படும்.' },
      reflectionQuestion: { en: 'What percentage of your income do you currently save?', ta: 'தற்போது உங்கள் வருமானத்தில் எத்தனை சதவீதத்தை சேமிக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Reasonable > Rational', ta: 'நியாயமானது > பகுத்தறிவு' },
      explanation: { en: 'Do not aim to be coldly rational when making financial decisions. Aim to just be pretty reasonable.', ta: 'நிதி முடிவுகளை எடுக்கும்போது முற்றிலும் பகுத்தறிவுடன் இருக்க முயற்சிக்காதீர்கள். நியாயமாக இருக்க முயற்சி செய்யுங்கள்.' },
      whyItMatters: { en: 'Reasonable decisions are easier to stick with when times get tough. Purely rational strategies often fail because they ignore human emotion.', ta: 'கடினமான நேரங்களில் நியாயமான முடிவுகளைப் பின்பற்றுவது எளிது. முற்றிலும் பகுத்தறிவு உத்திகள் பெரும்பாலும் தோல்வியடைகின்றன, ஏனெனில் அவை மனித உணர்ச்சிகளைப் புறக்கணிக்கின்றன.' },
      example: { en: 'Paying off a low-interest mortgage might not be "rational" mathematically, but if it gives you peace of mind (reasonable), it\'s the right choice.', ta: 'குறைந்த வட்டிக்கு வாங்கிய வீட்டுக் கடனை அடைப்பது கணித ரீதியாக "பகுத்தறிவாக" இருக்காது, ஆனால் அது உங்களுக்கு மன அமைதியைத் தந்தால் (நியாயமானது), அதுவே சரியான தேர்வு.' },
      actionStep: { en: 'Make financial plans that let you sleep at night, even if they aren\'t mathematically optimal.', ta: 'கணித ரீதியாக உகந்ததாக இல்லாவிட்டாலும், இரவில் நிம்மதியாக தூங்க அனுமதிக்கும் நிதித் திட்டங்களை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'What is a financial decision you made that was more emotional than rational, but you don\'t regret?', ta: 'பகுத்தறிவை விட உணர்ச்சிகரமானதாக இருந்தாலும், நீங்கள் வருந்தாத ஒரு நிதி முடிவு எது?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Surprise!', ta: 'ஆச்சரியம்!' },
      explanation: { en: 'History is the study of change, ironically used as a map of the future. The most important events are always unprecedented.', ta: 'வரலாறு என்பது மாற்றத்தின் ஆய்வு, முரண்பாடாக இது எதிர்காலத்தின் வரைபடமாக பயன்படுத்தப்படுகிறது. மிக முக்கியமான நிகழ்வுகள் எப்போதும் முன்னெப்போதும் இல்லாதவையே.' },
      whyItMatters: { en: 'You cannot perfectly predict the economy based on past data.', ta: 'கடந்த கால தரவுகளின் அடிப்படையில் பொருளாதாரத்தை உங்களால் துல்லியமாக கணிக்க முடியாது.' },
      example: { en: 'No one predicted the economic impact of the 2020 pandemic using historical stock market data.', ta: 'வரலாற்று பங்குச் சந்தை தரவுகளைப் பயன்படுத்தி 2020 தொற்றுநோயின் பொருளாதார தாக்கத்தை யாரும் கணிக்கவில்லை.' },
      actionStep: { en: 'Build a margin of safety into your investments to survive the unexpected.', ta: 'எதிர்பாராதவற்றிலிருந்து தப்பிக்க உங்கள் முதலீடுகளில் பாதுகாப்பு விளிம்பை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'How did the last major global surprise affect your finances?', ta: 'கடைசியாக நடந்த பெரிய உலகளாவிய ஆச்சரியம் உங்கள் நிதியை எவ்வாறு பாதித்தது?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Room for Error', ta: 'பிழைக்கான இடம்' },
      explanation: { en: 'The most important part of every plan is planning on your plan not going according to plan.', ta: 'ஒவ்வொரு திட்டத்தின் மிக முக்கியமான பகுதி உங்கள் திட்டம் திட்டமிட்டபடி நடக்காது என்று திட்டமிடுவதே.' },
      whyItMatters: { en: 'A margin of safety ensures you can survive when things go wrong.', ta: 'காரியங்கள் தவறாக நடக்கும்போது நீங்கள் பிழைக்க முடியும் என்பதை பாதுகாப்பு விளிம்பு உறுதி செய்கிறது.' },
      example: { en: 'Assuming your investments will only return 5% even if historically they return 8%, so you save more just in case.', ta: 'உங்கள் முதலீடுகள் வரலாற்று ரீதியாக 8% வருமானத்தை அளித்தாலும், அவை 5% மட்டுமே வருமானத்தை அளிக்கும் என்று கருதி, முன்னெச்சரிக்கையாக அதிகமாக சேமிப்பது.' },
      actionStep: { en: 'Calculate your retirement needs, then add 20% just to be safe.', ta: 'உங்கள் ஓய்வூதியத் தேவைகளைக் கணக்கிட்டு, பாதுகாப்பிற்காக 20% சேர்க்கவும்.' },
      reflectionQuestion: { en: 'Where in your life do you operate with zero room for error?', ta: 'உங்கள் வாழ்க்கையில் எந்த இடத்தில் நீங்கள் பிழைக்கு இடமில்லாமல் செயல்படுகிறீர்கள்?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'You\'ll Change', ta: 'நீங்கள் மாறுவீர்கள்' },
      explanation: { en: 'Long-term planning is harder than it seems because people\'s goals and desires change over time.', ta: 'நீண்ட கால திட்டமிடல் தோன்றுவதை விட கடினமானது, ஏனெனில் மக்களின் இலக்குகளும் ஆசைகளும் காலப்போக்கில் மாறுகின்றன.' },
      whyItMatters: { en: 'The person you are today is not the person you will be in 20 years.', ta: 'இன்று நீங்கள் இருக்கும் நபர், 20 வருடங்களில் நீங்கள் இருக்கப் போகும் நபர் அல்ல.' },
      example: { en: 'A 20-year-old might want to be an investment banker making millions, but at 40 they might just want a quiet life in the country.', ta: 'ஒரு 20 வயது இளைஞர் மில்லியன்களை சம்பாதிக்கும் வங்கியாளராக விரும்பலாம், ஆனால் 40 வயதில் அவர்கள் அமைதியான வாழ்க்கையை விரும்பலாம்.' },
      actionStep: { en: 'Avoid extreme financial commitments that lock you into one specific path for decades.', ta: 'பல தசாப்தங்களுக்கு ஒரு குறிப்பிட்ட பாதையில் உங்களை அடைத்து வைக்கும் தீவிர நிதி ஈடுபாடுகளைத் தவிர்க்கவும்.' },
      reflectionQuestion: { en: 'How have your financial goals changed over the last 5 years?', ta: 'கடந்த 5 ஆண்டுகளில் உங்கள் நிதி இலக்குகள் எவ்வாறு மாறியுள்ளன?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Nothing\'s Free', ta: 'எதுவும் இலவசம் இல்லை' },
      explanation: { en: 'Everything has a price, but not all prices appear on labels. The price of investing is volatility, fear, doubt, uncertainty, and regret.', ta: 'எல்லாவற்றுக்கும் ஒரு விலை உண்டு, ஆனால் எல்லா விலைகளும் லேபிள்களில் தோன்றுவதில்லை. முதலீட்டின் விலை என்பது ஏற்ற இறக்கம், பயம், சந்தேகம், நிச்சயமற்ற தன்மை மற்றும் வருத்தம்.' },
      whyItMatters: { en: 'If you try to avoid the fee, you usually end up paying a larger penalty.', ta: 'நீங்கள் கட்டணத்தைத் தவிர்க்க முயன்றால், நீங்கள் பொதுவாக பெரிய அபராதத்தைச் செலுத்த நேரிடும்.' },
      example: { en: 'Panic-selling stocks during a crash is refusing to pay the "fee" of volatility, and instead paying the "penalty" of permanent loss.', ta: 'சந்தை வீழ்ச்சியின் போது பங்குகள பீதியில் விற்பது என்பது ஏற்ற இறக்கம் என்ற கட்டணத்தை செலுத்த மறுப்பதும், நிரந்தர இழப்பு என்ற அபராதத்தை செலுத்துவதும் ஆகும்.' },
      actionStep: { en: 'View market volatility as a fee for long-term gains, not a fine for doing something wrong.', ta: 'சந்தை ஏற்ற இறக்கத்தை நீண்ட கால லாபத்திற்கான கட்டணமாகப் பாருங்கள், ஏதோ தவறு செய்ததற்கான அபராதமாக அல்ல.' },
      reflectionQuestion: { en: 'What hidden "prices" are you paying for your current lifestyle?', ta: 'உங்கள் தற்போதைய வாழ்க்கை முறைக்காக நீங்கள் என்ன மறைக்கப்பட்ட விலைகளை செலுத்துகிறீர்கள்?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'You & Me', ta: 'நீங்களும் நானும்' },
      explanation: { en: 'Beware taking financial cues from people playing a different game than you are.', ta: 'உங்களை விட வித்தியாசமான விளையாட்டை விளையாடும் நபர்களிடமிருந்து நிதி ஆலோசனைகளை எடுப்பதில் ஜாக்கிரதை.' },
      whyItMatters: { en: 'A day trader and a long-term retirement investor should not buy the same stocks for the same reasons.', ta: 'ஒரு டே டிரேடர் மற்றும் நீண்ட கால ஓய்வூதிய முதலீட்டாளர் ஒரே பங்குகளை ஒரே காரணங்களுக்காக வாங்கக்கூடாது.' },
      example: { en: 'Buying a meme stock because a speculator on Reddit made money, when you are trying to save for a down payment.', ta: 'நீங்கள் முன்பணம் செலுத்த சேமிக்க முயற்சிக்கும் போது, ரெடிட்டில் உள்ள ஒருவர் பணம் சம்பாதித்ததால் ஒரு மீம் பங்கை வாங்குவது.' },
      actionStep: { en: 'Clearly write down the rules and timeline of the financial game *you* are playing.', ta: '*நீங்கள்* விளையாடும் நிதி விளையாட்டின் விதிகள் மற்றும் காலக்கெடுவை தெளிவாக எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Whose financial advice are you following that doesn\'t actually apply to your life?', ta: 'உங்கள் வாழ்க்கைக்கு பொருந்தாத யாருடைய நிதி ஆலோசனையை நீங்கள் பின்பற்றுகிறீர்கள்?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'The Seduction of Pessimism', ta: 'நம்பிக்கையின்மையின் கவர்ச்சி' },
      explanation: { en: 'Pessimism sounds like somebody trying to help you. Optimism sounds like a sales pitch.', ta: 'நம்பிக்கையின்மை யாரோ உங்களுக்கு உதவ முயற்சிப்பது போல் ஒலிக்கிறது. நம்பிக்கை ஒரு விற்பனை பேச்சு போல் ஒலிக்கிறது.' },
      whyItMatters: { en: 'We are biologically wired to pay more attention to threats (pessimism) than opportunities (optimism), which makes us bad long-term investors.', ta: 'அச்சுறுத்தல்களுக்கு (அவநம்பிக்கை) அதிக கவனம் செலுத்துமாறு நாம் உயிரியல் ரீதியாக கம்பி செய்யப்பட்டுள்ளோம், இது நம்மை மோசமான நீண்ட கால முதலீட்டாளர்களாக்குகிறது.' },
      example: { en: 'A news article predicting an economic crash gets millions of views, while an article showing slow, steady growth gets ignored.', ta: 'பொருளாதார வீழ்ச்சியைக் கணிக்கும் செய்தி மில்லியன் கணக்கான பார்வைகளைப் பெறுகிறது, அதே சமயம் மெதுவான, நிலையான வளர்ச்சியைக் காட்டும் கட்டுரை புறக்கணிக்கப்படுகிறது.' },
      actionStep: { en: 'Limit your consumption of daily financial news and focus on long-term trends.', ta: 'தினசரி நிதிச் செய்திகளை உட்கொள்வதை வரம்பிட்டு, நீண்ட கால போக்குகளில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'When was the last time pessimism caused you to miss a great opportunity?', ta: 'கடைசியாக அவநம்பிக்கை உங்களுக்கு ஒரு சிறந்த வாய்ப்பை இழக்கச் செய்தது எப்போது?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'When You\'ll Believe Anything', ta: 'நீங்கள் எதையும் நம்பும்போது' },
      explanation: { en: 'The more you want something to be true, the more likely you are to believe a story that overestimates the odds of it being true.', ta: 'ஏதேனும் உண்மையாக இருக்க வேண்டும் என்று நீங்கள் எவ்வளவு அதிகமாக விரும்புகிறீர்களோ, அது உண்மையாக இருப்பதற்கான வாய்ப்புகளை மிகைப்படுத்தும் ஒரு கதையை நீங்கள் நம்புவதற்கான வாய்ப்புகள் அதிகம்.' },
      whyItMatters: { en: 'Desperation makes people fall for scams and "get rich quick" schemes.', ta: 'விரக்தி மக்களை மோசடிகளில் விழச் செய்கிறது மற்றும் "விரைவில் பணக்காரர்" திட்டங்களில் சிக்க வைக்கிறது.' },
      example: { en: 'Investing in a highly risky crypto project because it promises to double your money in a week, just because you desperately need the money.', ta: 'உங்களுக்கு பணம் மிகவும் தேவைப்படுவதால், ஒரு வாரத்தில் உங்கள் பணத்தை இரட்டிப்பாக்குவதாக உறுதியளிக்கும் மிகவும் ஆபத்தான கிரிப்டோ திட்டத்தில் முதலீடு செய்வது.' },
      actionStep: { en: 'Always get a second opinion before making a financial decision that feels "too good to be true."', ta: '"உண்மையாக இருக்க முடியாது" என்று தோன்றும் நிதி முடிவை எடுப்பதற்கு முன் எப்போதும் இரண்டாவது கருத்தைப் பெறுங்கள்.' },
      reflectionQuestion: { en: 'Have you ever bought into a hype just because you really needed it to work out?', ta: 'உண்மையிலேயே அது வேலை செய்ய வேண்டும் என்று நீங்கள் நினைத்ததால், நீங்கள் எப்போதாவது ஒரு விளம்பரத்தை நம்பியுள்ளீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'All Together Now', ta: 'இப்போது எல்லாம் ஒன்றாக' },
      explanation: { en: 'Financial success is not a hard science. It’s a soft skill, where how you behave is more important than what you know.', ta: 'நிதி வெற்றி என்பது ஒரு கடினமான அறிவியல் அல்ல. இது ஒரு மென்மையான திறன், உங்களுக்கு என்ன தெரியும் என்பதை விட நீங்கள் எப்படி நடந்து கொள்கிறீர்கள் என்பது முக்கியம்.' },
      whyItMatters: { en: 'You don\'t need a PhD in finance to be wealthy. You just need discipline and time.', ta: 'பணக்காரராக இருக்க உங்களுக்கு நிதியில் பிஎச்டி தேவையில்லை. உங்களுக்கு ஒழுக்கமும் நேரமும் மட்டுமே தேவை.' },
      example: { en: 'Ronald Read, a janitor, died with $8 million by saving consistently and investing in blue-chip stocks for decades.', ta: 'ரொனால்ட் ரீட் என்ற துப்புரவுத் தொழிலாளி, தொடர்ந்து சேமித்து பல்லாண்டுகளாக பங்குகளில் முதலீடு செய்ததன் மூலம் $8 மில்லியன் சொத்துக்களுடன் இறந்தார்.' },
      actionStep: { en: 'Review your financial habits today and adjust one small behavior.', ta: 'இன்று உங்கள் நிதிப் பழக்கங்களை மதிப்பாய்வு செய்து ஒரு சிறிய நடத்தையை சரிசெய்யவும்.' },
      reflectionQuestion: { en: 'What is one financial truth you know, but struggle to actually practice?', ta: 'உங்களுக்குத் தெரிந்த, ஆனால் உண்மையில் பயிற்சி செய்ய போராடும் ஒரு நிதி உண்மை என்ன?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Confessions', ta: 'ஒப்புதல் வாக்குமூலங்கள்' },
      explanation: { en: 'The author\'s own financial strategy is extremely simple: high savings rate, index funds, and a paid-off house.', ta: 'ஆசிரியரின் சொந்த நிதி உத்தி மிகவும் எளிமையானது: அதிக சேமிப்பு விகிதம், குறியீட்டு நிதிகள் மற்றும் கடனில்லாத வீடு.' },
      whyItMatters: { en: 'Complex strategies are often just ego. Simplicity leads to peace of mind.', ta: 'சிக்கலான உத்திகள் பெரும்பாலும் வெறும் ஈகோ மட்டுமே. எளிமை மன அமைதிக்கு வழிவகுக்கும்.' },
      example: { en: 'Ignoring hot stocks and just buying the S&P 500 every single month for 30 years.', ta: 'சூடான பங்குகளை புறக்கணித்துவிட்டு, 30 ஆண்டுகளாக ஒவ்வொரு மாதமும் S&P 500ஐ வாங்குவது.' },
      actionStep: { en: 'Write down your personal financial philosophy in one sentence.', ta: 'உங்கள் தனிப்பட்ட நிதி தத்துவத்தை ஒரு வாக்கியத்தில் எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Is your current financial plan simple enough to explain to a 10-year-old?', ta: 'உங்கள் தற்போதைய நிதித் திட்டம் 10 வயது குழந்தைக்கு விளக்கக்கூடிய அளவுக்கு எளிமையானதா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The Psychology of Money' });
    if (existing) {
      console.log('The Psychology of Money already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The Psychology of Money' });
    }
    
    await WisdomBook.create(moneyBook);
    console.log('The Psychology of Money added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
