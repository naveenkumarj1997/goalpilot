import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const zeroToOneBook = {
  title: 'Zero to One: Notes on Startups, or How to Build the Future',
  author: 'Peter Thiel',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
  categories: ['Business', 'Entrepreneurship', 'Technology'],
  themes: [
    { en: 'Innovation', ta: 'கண்டுபிடிப்பு' },
    { en: 'Monopoly', ta: 'ஏகபோகம்' }
  ],
  overview: {
    en: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.',
    ta: 'நமது காலத்தின் மாபெரும் ரகசியம் என்னவென்றால், ஆராயப்படாத எல்லைகளும் உருவாக்கப்பட வேண்டிய புதிய கண்டுபிடிப்புகளும் இன்னும் உள்ளன. ஜீரோ டூ ஒன் புத்தகத்தில், புகழ்பெற்ற தொழில்முனைவோர் மற்றும் முதலீட்டாளர் பீட்டர் தியேல், அந்தப் புதிய விஷயங்களை உருவாக்குவதற்கான தனித்துவமான வழிகளை நாம் எவ்வாறு கண்டறியலாம் என்பதைக் காட்டுகிறார்.'
  },
  topQuotes: [
    { en: 'What important truth do very few people agree with you on?', ta: 'மிகச் சிலரே உங்களுடன் உடன்படும் முக்கியமான உண்மை எது?' },
    { en: 'Monopoly is the condition of every successful business.', ta: 'ஏகபோகம் என்பது ஒவ்வொரு வெற்றிகரமான வணிகத்தின் நிபந்தனையாகும்.' },
    { en: 'Doing what we already know how to do takes the world from 1 to n, adding more of something familiar. But every time we create something new, we go from 0 to 1.', ta: 'எப்படிச் செய்வது என்று நமக்கு ஏற்கனவே தெரிந்ததைச் செய்வது உலகை 1-லிருந்து n-க்குக் கொண்டு செல்கிறது, பழக்கமான ஒன்றை மேலும் சேர்க்கிறது. ஆனால் ஒவ்வொரு முறையும் நாம் புதிதாக ஒன்றை உருவாக்கும்போது, நாம் 0-லிருந்து 1-க்குச் செல்கிறோம்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'Zero to One vs. One to N', ta: '0-லிருந்து 1 vs 1-லிருந்து N' },
      explanation: { en: 'Going from 1 to N means copying things that already work (horizontal progress). Going from 0 to 1 means doing something completely new (vertical progress).', ta: '1-லிருந்து N-க்குச் செல்வது என்பது ஏற்கனவே வேலை செய்யும் விஷயங்களை நகலெடுப்பதைக் குறிக்கிறது (கிடைமட்ட முன்னேற்றம்). 0-லிருந்து 1-க்குச் செல்வது என்பது முற்றிலும் புதிய ஒன்றைச் செய்வதைக் குறிக்கிறது (செங்குத்து முன்னேற்றம்).' },
      whyItMatters: { en: 'If you take a typewriter and build 100 typewriters, you have made horizontal progress. If you take a typewriter and build a word processor, you have made vertical progress. True innovation requires the latter.', ta: 'நீங்கள் ஒரு தட்டச்சுப்பொறியை எடுத்து 100 தட்டச்சுப்பொறிகளை உருவாக்கினால், நீங்கள் கிடைமட்ட முன்னேற்றத்தை அடைந்துள்ளீர்கள். நீங்கள் ஒரு தட்டச்சுப்பொறியை எடுத்து ஒரு சொல் செயலாக்கியை (Word Processor) உருவாக்கினால், நீங்கள் செங்குத்து முன்னேற்றத்தை அடைந்துள்ளீர்கள். உண்மையான கண்டுபிடிப்புக்குப் பிந்தையது தேவை.' },
      example: { en: 'Opening another restaurant in your town is 1 to N. Inventing a completely new way to synthesize food at home is 0 to 1.', ta: 'உங்கள் ஊரில் மற்றொரு உணவகத்தைத் திறப்பது 1-லிருந்து N. வீட்டிலேயே உணவை ஒருங்கிணைக்க முற்றிலும் புதிய வழியைக் கண்டுபிடிப்பது 0-லிருந்து 1.' },
      actionStep: { en: 'Look at a project you are working on. Are you just copying best practices (1 to n), or are you introducing a completely novel mechanism (0 to 1)?', ta: 'நீங்கள் வேலை செய்யும் ஒரு திட்டத்தைப் பாருங்கள். சிறந்த நடைமுறைகளை மட்டும் நீங்கள் நகலெடுக்கிறீர்களா (1-லிருந்து n), அல்லது முற்றிலும் புதிய வழிமுறையை அறிமுகப்படுத்துகிறீர்களா (0-லிருந்து 1)?' },
      reflectionQuestion: { en: 'Are you trying to beat the competition by just being 10% better, instead of being completely different?', ta: 'முற்றிலும் வித்தியாசமாக இருப்பதற்குப் பதிலாக, 10% மட்டுமே சிறப்பாக இருப்பதன் மூலம் போட்டியை முறியடிக்க முயற்சிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The Contrarian Question', ta: 'முரண்பாடான கேள்வி' },
      explanation: { en: 'Thiel’s favorite interview question: "What important truth do very few people agree with you on?" It forces you to think for yourself.', ta: 'தியேலுக்கு மிகவும் பிடித்த நேர்காணல் கேள்வி: "மிகச் சிலரே உங்களுடன் உடன்படும் முக்கியமான உண்மை எது?" இது உங்களைச் சிந்திக்கத் தூண்டுகிறது.' },
      whyItMatters: { en: 'Brilliant thinking is rare, but courage is in even shorter supply than genius. Most people are afraid to be wrong in front of the crowd.', ta: 'அற்புதமான சிந்தனை அரிதானது, ஆனால் மேதைமையை விடத் தைரியம் குறைவான அளவிலேயே உள்ளது. பெரும்பாலான மக்கள் கூட்டத்தின் முன் தவறு செய்யப் பயப்படுகிறார்கள்.' },
      example: { en: 'In 2004, the contrarian truth was that people wanted a real-identity internet directory, contrary to the anonymous culture of the early web. That truth built Facebook.', ta: '2004-ஆம் ஆண்டில், முரண்பாடான உண்மை என்னவென்றால், ஆரம்பகால வலையின் அநாமதேய கலாச்சாரத்திற்கு முரணாக, மக்கள் உண்மையான அடையாள இணைய கோப்பகத்தை விரும்பினர். அந்த உண்மைதான் ஃபேஸ்புக்கை உருவாக்கியது.' },
      actionStep: { en: 'Write down one deeply held belief you have about your industry or life that almost everyone else thinks is crazy or wrong.', ta: 'உங்கள் தொழில்துறையைப் பற்றியோ அல்லது வாழ்க்கையைப் பற்றியோ மற்ற அனைவரும் பைத்தியக்காரத்தனம் அல்லது தவறு என்று நினைக்கும் ஒரு ஆழமான நம்பிக்கையை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Does your business idea sound like something everyone already agrees is a "good idea"? If so, it is likely too late.', ta: 'உங்கள் வணிக யோசனை அனைவரும் ஏற்கனவே "நல்ல யோசனை" என்று ஒப்புக்கொண்ட ஒன்று போல் ஒலிக்கிறதா? அப்படியானால், நீங்கள் தாமதமாக வந்திருக்கலாம்.' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Monopolies are Good', ta: 'ஏகபோகங்கள் நல்லவை' },
      explanation: { en: 'Capitalism and competition are opposites. Capitalism is about the accumulation of capital, but under perfect competition, all profits are competed away.', ta: 'முதலாளித்துவமும் போட்டியும் எதிரெதிரானவை. முதலாளித்துவம் என்பது மூலதனத்தைக் குவிப்பதாகும், ஆனால் சரியான போட்டியின் கீழ், அனைத்து லாபங்களும் போட்டியால் போய்விடுகின்றன.' },
      whyItMatters: { en: 'If you want to create and capture lasting value, don\'t build an undifferentiated commodity business. You must build a monopoly—a company so good at what it does that no other firm can offer a close substitute.', ta: 'நீங்கள் நீடித்த மதிப்பை உருவாக்கிப் பிடிக்க விரும்பினால், வேறுபடுத்தப்படாத பொருட்கள் வணிகத்தை உருவாக்க வேண்டாம். நீங்கள் ஒரு ஏகபோகத்தை உருவாக்க வேண்டும்—வேறு எந்த நிறுவனமும் நெருக்கமான மாற்றீட்டை வழங்க முடியாத அளவிற்கு அதன் வேலையில் மிகவும் சிறந்த ஒரு நிறுவனத்தை.' },
      example: { en: 'Google has a monopoly on search. Because it doesn\'t have to worry about competing on search, it can invest massive profits into self-driving cars and AI.', ta: 'கூகுள் தேடலில் ஏகபோக உரிமையைக் கொண்டுள்ளது. தேடலில் போட்டியிடுவது பற்றி அது கவலைப்பட வேண்டியதில்லை என்பதால், அது தானியங்கி கார்கள் மற்றும் செயற்கை நுண்ணறிவில் (AI) பாரிய லாபத்தை முதலீடு செய்ய முடியும்.' },
      actionStep: { en: 'Identify the specific niche where you or your business can be absolutely dominant, effectively creating a micro-monopoly.', ta: 'நீங்களோ அல்லது உங்கள் வணிகமோ முற்றிலும் ஆதிக்கம் செலுத்தக்கூடிய குறிப்பிட்ட இடத்தைக் கண்டறியவும், இது ஒரு குறு-ஏகபோகத்தை திறம்பட உருவாக்குகிறது.' },
      reflectionQuestion: { en: 'Are you entering a crowded market hoping to fight for a tiny slice of the pie?', ta: 'கடும் போட்டி நிறைந்த சந்தையில் நுழைந்து லாபத்தின் ஒரு சிறு பகுதியைப் பெறப் போராட நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Competition is for Losers', ta: 'போட்டி என்பது தோல்வியாளர்களுக்கானது' },
      explanation: { en: 'We preach competition, internalize its necessity, and enact its commandments; and as a result, we trap ourselves within it—even though the more we compete, the less we gain.', ta: 'நாம் போட்டியைப் போதிக்கிறோம், அதன் அவசியத்தை உள்வாங்குகிறோம், அதன் கட்டளைகளைச் செயல்படுத்துகிறோம்; இதன் விளைவாக, நாம் அதற்குள் நம்மைச் சிக்கவைக்கிறோம்—நாம் எவ்வளவு அதிகமாகப் போட்டியிடுகிறோமோ, அவ்வளவு குறைவாகவே பெறுகிறோம்.' },
      whyItMatters: { en: 'Rivalry causes us to overemphasize old opportunities and slavishly copy what has worked in the past. It blinds us to new, uncharted frontiers.', ta: 'போட்டி மனப்பான்மை பழைய வாய்ப்புகளை மிகைப்படுத்திக் காட்டவும், கடந்த காலத்தில் வேலை செய்தவற்றை அடிமைத்தனமாக நகலெடுக்கவும் செய்கிறது. இது புதிய, ஆராயப்படாத எல்லைகளுக்கு நம்மை குருடாக்குகிறது.' },
      example: { en: 'Airlines are highly competitive and barely make a few cents of profit per passenger. Software companies (like Microsoft in the 90s) avoid competition and enjoy massive profit margins.', ta: 'விமான நிறுவனங்கள் அதிக போட்டித்தன்மை கொண்டவை மற்றும் ஒரு பயணிக்குச் சில காசுகள் மட்டுமே லாபம் ஈட்டுகின்றன. மென்பொருள் நிறுவனங்கள் (90-களில் மைக்ரோசாப்ட் போல) போட்டியைத் தவிர்த்து, பெரிய லாப வரம்புகளை அனுபவிக்கின்றன.' },
      actionStep: { en: 'Stop obsessing over your competitors. Shift that energy toward expanding your unique value proposition.', ta: 'உங்கள் போட்டியாளர்கள் மீது வெறி கொள்வதை நிறுத்துங்கள். உங்களின் தனித்துவமான மதிப்பீட்டு முன்மொழிவை விரிவுபடுத்துவதில் அந்த ஆற்றலைச் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you defining your success merely by slightly beating the guy next to you?', ta: 'உங்களுக்குப் பக்கத்தில் இருப்பவரைச் சற்றே முறியடிப்பதன் மூலம் மட்டுமே உங்கள் வெற்றியை வரையறுக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Start Small and Monopolize', ta: 'சிறிதாகத் தொடங்கி ஏகபோகமாக மாறுங்கள்' },
      explanation: { en: 'Every startup should start with a very small market. It is easier to dominate a small market than a large one.', ta: 'ஒவ்வொரு ஸ்டார்ட்அப்பும் மிகச் சிறிய சந்தையில் தொடங்க வேண்டும். ஒரு பெரிய சந்தையை விட சிறிய சந்தையில் ஆதிக்கம் செலுத்துவது எளிது.' },
      whyItMatters: { en: 'If you try to capture 1% of a billion-dollar market, you will face ruthless competition and likely fail. If you capture 80% of a million-dollar market, you have a foundation to expand from.', ta: 'பில்லியன் டாலர் சந்தையில் 1% ஐப் பிடிக்க நீங்கள் முயற்சித்தால், நீங்கள் இரக்கமற்ற போட்டியை எதிர்கொள்வீர்கள், தோல்வியடைவீர்கள். மில்லியன் டாலர் சந்தையில் 80% ஐ நீங்கள் பிடித்தால், விரிவுபடுத்துவதற்கான அடித்தளம் உங்களுக்கு உள்ளது.' },
      example: { en: 'Amazon didn\'t start as the "everything store." It started strictly as an online bookstore, dominating that specific niche before expanding into CDs and DVDs.', ta: 'அமேசான் "எல்லாமே கிடைக்கும் கடை"யாகத் தொடங்கவில்லை. அது கண்டிப்பாக ஒரு ஆன்லைன் புத்தகக் கடையாகவே தொடங்கியது, சிடிக்கள் மற்றும் டிவிடிக்களாக விரிவடைவதற்கு முன்பு அந்தக் குறிப்பிட்ட சந்தையில் ஆதிக்கம் செலுத்தியது.' },
      actionStep: { en: 'Define the absolute smallest viable target audience for your product or service, and focus 100% of your energy on dominating that tiny group.', ta: 'உங்கள் தயாரிப்பு அல்லது சேவைக்கான சாத்தியமான மிகச்சிறிய இலக்குப் பார்வையாளர்களை வரையறுத்து, அந்தச் சிறிய குழுவில் ஆதிக்கம் செலுத்துவதில் உங்களின் 100% ஆற்றலைக் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Is your target market "everyone"? (Hint: If it is everyone, it is actually no one.)', ta: 'உங்கள் இலக்குச் சந்தை "அனைவரும்" தானா? (குறிப்பு: அது அனைவரும் என்றால், உண்மையில் அது யாருமில்லை.)' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Last Mover Advantage', ta: 'கடைசியாக நகர்பவரின் நன்மை' },
      explanation: { en: 'It\'s much better to be the last mover—that is, to make the last great development in a specific market and enjoy years or even decades of monopoly profits.', ta: 'கடைசியாக நகர்பவராக இருப்பது மிகவும் சிறந்தது—அதாவது, ஒரு குறிப்பிட்ட சந்தையில் கடைசிப் பெரிய வளர்ச்சியை உருவாக்குவது மற்றும் பல ஆண்டுகள் அல்லது பல தசாப்தங்களாக ஏகபோக லாபத்தை அனுபவிப்பது.' },
      whyItMatters: { en: 'Being the "first mover" is a tactic, not a goal. If someone comes along and does it 10x better, they steal your market. You want to build the final, unbeatable solution.', ta: '"முதலில் நகர்பவராக" இருப்பது ஒரு உத்தி, இலக்கு அல்ல. யாராவது வந்து அதை 10 மடங்குச் சிறப்பாகச் செய்தால், அவர்கள் உங்கள் சந்தையைத் திருடிவிடுவார்கள். நீங்கள் இறுதியான, வெல்ல முடியாத தீர்வை உருவாக்க வேண்டும்.' },
      example: { en: 'Google was not the first search engine (Yahoo, AltaVista were first). But Google was the last search engine, because their PageRank algorithm was a 10x improvement.', ta: 'கூகுள் முதல் தேடுபொறி அல்ல (யாகூ, அல்டாவிஸ்டா முதலில் வந்தன). ஆனால் கூகுள் கடைசித் தேடுபொறியாக இருந்தது, ஏனெனில் அவர்களின் பேஜ்ரேங்க் அல்காரிதம் 10 மடங்குச் சிறப்பாக இருந்தது.' },
      actionStep: { en: 'Don\'t rush to market with a half-baked product just to be "first." Focus on making a product so good that it effectively ends the category.', ta: 'வெறுமனே "முதலில்" இருக்க வேண்டும் என்பதற்காக அரைகுறையான தயாரிப்புடன் சந்தைக்கு விரைந்து செல்ல வேண்டாம். வகையையே திறம்பட முடிவுக்குக் கொண்டுவரும் அளவுக்குச் சிறந்த ஒரு தயாரிப்பை உருவாக்குவதில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you rushing a product out of fear someone else will do it first, compromising on the 10x quality required to dominate?', ta: 'ஆதிக்கம் செலுத்தத் தேவையான 10x தரத்தில் சமரசம் செய்து, வேறு யாராவது முதலில் செய்துவிடுவார்கள் என்ற பயத்தில் ஒரு தயாரிப்பை விரைவாக வெளியேற்றுகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Proprietary Technology', ta: 'காப்புரிமை பெற்ற தொழில்நுட்பம்' },
      explanation: { en: 'As a good rule of thumb, proprietary technology must be at least 10 times better than its closest substitute in some important dimension to lead to a real monopolistic advantage.', ta: 'ஒரு நல்ல கட்டைவிரல் விதியாக, ஒரு உண்மையான ஏகபோக நன்மைக்கு வழிவகுக்க, காப்புரிமை பெற்ற தொழில்நுட்பம் சில முக்கியமான பரிமாணங்களில் அதன் நெருக்கமான மாற்றீட்டை விடக் குறைந்தது 10 மடங்குச் சிறந்ததாக இருக்க வேண்டும்.' },
      whyItMatters: { en: 'Marginal improvements (20% better) are hard for users to notice and don\'t justify the switching costs. A 10x improvement is undeniable.', ta: 'விளிம்புநிலை மேம்பாடுகளை (20% சிறந்தது) பயனர்கள் கவனிப்பது கடினம் மற்றும் மாறுவதற்கான செலவுகளை நியாயப்படுத்தாது. ஒரு 10x மேம்பாடு மறுக்க முடியாதது.' },
      example: { en: 'PayPal made buying on eBay at least 10x better. Instead of mailing a physical check and waiting weeks, you could send money instantly.', ta: 'ஈபேயில் வாங்குவதைப் பேபால் குறைந்தபட்சம் 10 மடங்குச் சிறப்பாக்கியது. ஒரு காசோலையை அஞ்சலில் அனுப்பி வாரக்கணக்கில் காத்திருப்பதற்குப் பதிலாக, நீங்கள் உடனடியாகப் பணத்தை அனுப்ப முடியும்.' },
      actionStep: { en: 'Evaluate your current project. In what specific, measurable way is it 10x better than the status quo? If it isn\'t, redesign it.', ta: 'உங்கள் தற்போதைய திட்டத்தை மதிப்பிடுங்கள். தற்போதுள்ள நிலையை விட எந்தக் குறிப்பிட்ட, அளவிடக்கூடிய வழியில் இது 10 மடங்குச் சிறந்தது? இல்லையென்றால், அதை மறுவடிவமைப்பு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you building a feature or a fundamental breakthrough?', ta: 'நீங்கள் ஒரு அம்சத்தை உருவாக்குகிறீர்களா அல்லது ஒரு அடிப்படை முன்னேற்றத்தையா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Network Effects', ta: 'நெட்வொர்க் விளைவுகள்' },
      explanation: { en: 'Network effects make a product more useful as more people use it. But to get them, your product must be valuable to its very first users when the network is necessarily small.', ta: 'நெட்வொர்க் விளைவுகள் அதிக மக்கள் ஒரு தயாரிப்பைப் பயன்படுத்தும்போது அதை அதிக பயனுள்ளதாக்குகின்றன. ஆனால் அவற்றைப் பெற, நெட்வொர்க் கட்டாயமாகச் சிறியதாக இருக்கும்போது உங்கள் தயாரிப்பு அதன் முதல் பயனர்களுக்கு மதிப்புமிக்கதாக இருக்க வேண்டும்.' },
      whyItMatters: { en: 'Once a network effect is established, it becomes nearly impossible for competitors to overtake you, even if their core technology is slightly better.', ta: 'ஒரு நெட்வொர்க் விளைவு நிறுவப்பட்டவுடன், போட்டியாளர்கள் தங்களின் முக்கியத் தொழில்நுட்பம் சற்றுச் சிறந்ததாக இருந்தாலும், உங்களை முந்துவது கிட்டத்தட்ட சாத்தியமற்றதாகிவிடும்.' },
      example: { en: 'Facebook started only at Harvard. It was immediately useful to Harvard students. It didn\'t need the whole world on it to provide value on day one.', ta: 'பேஸ்புக் ஹார்வர்டில் மட்டுமே தொடங்கியது. ஹார்வர்டு மாணவர்களுக்கு இது உடனடியாகப் பயனுள்ளதாக இருந்தது. முதல் நாளிலேயே மதிப்பை வழங்க உலகம் முழுவதும் அதில் இருக்க வேண்டிய அவசியமில்லை.' },
      actionStep: { en: 'Design your product so that the single-player mode (the first user) is highly valuable even before their friends join.', ta: 'நண்பர்கள் சேருவதற்கு முன்பே சிங்கிள்-பிளேயர் பயன்முறை (முதல் பயனர்) மிகவும் மதிப்புமிக்கதாக இருக்கும் வகையில் உங்கள் தயாரிப்பை வடிவமைக்கவும்.' },
      reflectionQuestion: { en: 'Does your idea require a million users to be useful? How will you get the first hundred?', ta: 'உங்கள் யோசனை பயனுள்ளதாக இருக்க ஒரு மில்லியன் பயனர்கள் தேவையா? முதல் நூறு பேரை எப்படிப் பெறுவீர்கள்?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Economies of Scale', ta: 'அளவிலான பொருளாதாரங்கள்' },
      explanation: { en: 'A monopoly business gets stronger as it gets bigger: the fixed costs of creating a product can be spread out over ever greater quantities of sales.', ta: 'ஒரு ஏகபோக வணிகம் பெரிதாக வளர வளர வலுவடைகிறது: ஒரு தயாரிப்பை உருவாக்குவதற்கான நிலையான செலவுகளை எப்போதும் அதிக அளவிலான விற்பனையில் பரப்ப முடியும்.' },
      whyItMatters: { en: 'Software startups enjoy dramatic economies of scale because the marginal cost of producing another copy of the product is close to zero.', ta: 'தயாரிப்பின் மற்றொரு நகலை உருவாக்குவதற்கான விளிம்புச் செலவு பூஜ்ஜியத்திற்கு அருகில் இருப்பதால், மென்பொருள் ஸ்டார்ட்அப்கள் அளவிலான வியத்தகு பொருளாதாரங்களை அனுபவிக்கின்றன.' },
      example: { en: 'A yoga studio does not have economies of scale; you can only fit so many people in a room. A yoga app has infinite economies of scale.', ta: 'ஒரு யோகா ஸ்டுடியோவிற்கு அளவிலான பொருளாதாரங்கள் இல்லை; ஒரு அறையில் குறிப்பிட்ட நபர்களை மட்டுமே உங்களால் கொள்ள முடியும். ஒரு யோகா செயலிக்கு எல்லையற்ற அளவிலான பொருளாதாரங்கள் உள்ளன.' },
      actionStep: { en: 'Ensure your business model has the potential to scale infinitely without requiring a proportional linear increase in your fixed costs.', ta: 'உங்களின் நிலையான செலவுகளில் விகிதாச்சார நேரியல் அதிகரிப்பு தேவையில்லாமல், எல்லையற்ற அளவில் அளவிடக்கூடிய திறன் உங்கள் வணிக மாதிரிக்கு இருப்பதை உறுதிசெய்யுங்கள்.' },
      reflectionQuestion: { en: 'If your customer base multiplied by 10 tomorrow, would your business break under the operational cost?', ta: 'நாளை உங்களின் வாடிக்கையாளர் தளம் 10 மடங்காகப் பெருகினால், செயல்பாட்டுச் செலவில் உங்கள் வணிகம் உடைந்து போகுமா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Branding', ta: 'பிராண்டிங்' },
      explanation: { en: 'A company has a monopoly on its own brand by definition, so creating a strong brand is a powerful way to claim a monopoly.', ta: 'ஒரு நிறுவனம் வரையறையின்படி அதன் சொந்த பிராண்டில் ஏகபோகத்தைக் கொண்டுள்ளது, எனவே வலுவான பிராண்டை உருவாக்குவது ஏகபோகத்தைக் கோருவதற்கான சக்திவாய்ந்த வழியாகும்.' },
      whyItMatters: { en: 'However, brand without substance is a mirage. The brand must be backed by proprietary technology, network effects, or economies of scale.', ta: 'இருப்பினும், பொருள் இல்லாத பிராண்ட் ஒரு கானல் நீர். பிராண்ட் காப்புரிமை பெற்ற தொழில்நுட்பம், நெட்வொர்க் விளைவுகள் அல்லது அளவிலான பொருளாதாரங்களால் ஆதரிக்கப்பட வேண்டும்.' },
      example: { en: 'Apple’s brand is incredibly strong (minimalist design, premium feel). But this brand is backed by proprietary hardware (M-series chips) and a massive ecosystem.', ta: 'ஆப்பிளின் பிராண்ட் நம்பமுடியாத அளவிற்கு வலுவானது (குறைந்தபட்ச வடிவமைப்பு, பிரீமியம் உணர்வு). ஆனால் இந்த பிராண்ட் காப்புரிமை பெற்ற வன்பொருள் (M-தொடர் சில்லுகள்) மற்றும் பாரிய சுற்றுச்சூழல் அமைப்பால் ஆதரிக்கப்படுகிறது.' },
      actionStep: { en: 'Invest in your core product substance first. Let the brand be a natural reflection of your 10x improvement, not a marketing veneer to cover up a mediocre product.', ta: 'முதலில் உங்கள் முக்கிய தயாரிப்பின் பொருளில் முதலீடு செய்யுங்கள். ஒரு சுமாரான தயாரிப்பை மூடிமறைப்பதற்கான சந்தைப்படுத்தல் போர்வையாக இல்லாமல், உங்களின் 10x மேம்பாட்டின் இயல்பான பிரதிபலிப்பாக பிராண்ட் இருக்கட்டும்.' },
      reflectionQuestion: { en: 'Are you spending more time picking out logos and fonts than you are building a fundamentally superior product?', ta: 'அடிப்படையில் சிறந்த தயாரிப்பை உருவாக்குவதை விட லோகோக்கள் மற்றும் எழுத்துருக்களைத் தேர்ந்தெடுப்பதில் அதிக நேரம் செலவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'The Mechanics of Mafia', ta: 'மாஃபியாவின் இயக்கவியல்' },
      explanation: { en: 'A startup is a team of people on a mission, and a good culture is just what that looks like on the inside. You need a tightly knit group of people fiercely loyal to the mission (a "Mafia").', ta: 'ஸ்டார்ட்அப் என்பது ஒரு பணியில் உள்ள மனிதர்களின் குழுவாகும், ஒரு நல்ல கலாச்சாரம் என்பது உள்ளே எப்படி இருக்கும் என்பதுதான். அந்தப் பணிக்குத் தீவிர விசுவாசமுள்ள மனிதர்களின் நெருக்கமான குழு (ஒரு "மாஃபியா") உங்களுக்குத் தேவை.' },
      whyItMatters: { en: 'If a company is just a place where people collect a paycheck, it will not survive the intense struggles of going from 0 to 1.', ta: 'ஒரு நிறுவனம் மனிதர்கள் சம்பளத்தைப் பெறும் ஒரு இடமாக மட்டுமே இருந்தால், 0-லிருந்து 1-க்குச் செல்லும் தீவிரமான போராட்டங்களில் அது தப்பாது.' },
      example: { en: 'The "PayPal Mafia" (Elon Musk, Peter Thiel, Reid Hoffman, etc.) worked so tightly together that after selling PayPal, they went on to build Tesla, LinkedIn, Yelp, and YouTube.', ta: '"பேபால் மாஃபியா" (எலோன் மஸ்க், பீட்டர் தியேல், ரீட் ஹாஃப்மேன், முதலியோர்) எவ்வளவு நெருக்கமாகப் பணியாற்றினர் என்றால், பேபாலை விற்ற பிறகு, அவர்கள் டெஸ்லா, லிங்க்ட்இன், யெல்ப் மற்றும் யூடியூப்பை உருவாக்கச் சென்றனர்.' },
      actionStep: { en: 'Hire people who actually like each other and share a slightly weird, unique obsession with the problem you are solving.', ta: 'உண்மையில் ஒருவரையொருவர் விரும்பும் மற்றும் நீங்கள் தீர்க்கும் பிரச்சினையில் சற்றே விசித்திரமான, தனித்துவமான வெறியைப் பகிர்ந்து கொள்ளும் மனிதர்களை வேலைக்கு அமர்த்துங்கள்.' },
      reflectionQuestion: { en: 'Is your team a cult-like group on a mission, or just a collection of random resumes?', ta: 'உங்கள் குழு ஒரு பணியில் உள்ள வழிபாட்டு-போன்ற குழுவா, அல்லது சீரற்ற பயோடேட்டாக்கள் கொண்ட தொகுப்பா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Sales is Not a Bad Word', ta: 'விற்பனை ஒரு கெட்ட வார்த்தை அல்ல' },
      explanation: { en: 'Nerds are skeptical of advertising, marketing, and sales because they seem superficial and irrational. But customers will not come just because you build it.', ta: 'விளம்பரம், சந்தைப்படுத்தல் மற்றும் விற்பனை ஆகியவை மேலோட்டமானவையாகவும் பகுத்தறிவற்றவையாகவும் தோன்றுவதால் மேதைகள் அவற்றின் மீது சந்தேகம் கொள்கிறார்கள். ஆனால் நீங்கள் அதை உருவாக்கியதால் மட்டுமே வாடிக்கையாளர்கள் வந்துவிட மாட்டார்கள்.' },
      whyItMatters: { en: 'Even if you have the best product in the world, you still have to sell it. Superior sales and distribution by itself can create a monopoly, even with no product differentiation.', ta: 'உங்களிடம் உலகின் சிறந்த தயாரிப்பு இருந்தாலும், நீங்கள் அதை விற்க வேண்டும். எந்தவொரு தயாரிப்பு வேறுபாடும் இல்லாவிட்டாலும், சிறந்த விற்பனையும் விநியோகமும் தானாகவே ஒரு ஏகபோகத்தை உருவாக்க முடியும்.' },
      example: { en: 'Palantir sells complex software to governments. Their product is great, but their success relies heavily on Thiel’s and Karp’s ability to navigate high-stakes enterprise sales.', ta: 'பாலன்டிர் அரசாங்கங்களுக்குச் சிக்கலான மென்பொருளை விற்கிறது. அவர்களின் தயாரிப்பு சிறப்பானது, ஆனால் அவர்களின் வெற்றி தியேல் மற்றும் கார்ப் ஆகியோரின் அதிக-பங்குகள் உள்ள நிறுவன விற்பனையை வழிநடத்தும் திறனைப் பெரிதும் நம்பியுள்ளது.' },
      actionStep: { en: 'If you are the founder, you must be the first salesperson. Block out time today to personally pitch your product to a real human.', ta: 'நீங்கள் நிறுவனராக இருந்தால், நீங்களே முதல் விற்பனையாளராக இருக்க வேண்டும். உங்களின் தயாரிப்பை ஒரு உண்மையான மனிதரிடம் நீங்களே முன்வைக்க இன்று நேரத்தை ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'Are you hoping your product is so good that it will magically "sell itself"?', ta: 'உங்கள் தயாரிப்பு மாயாஜாலமாகத் "தன்னைத் தானே விற்றுக்கொள்ளும்" அளவுக்குச் சிறந்ததாக இருக்கும் என்று நீங்கள் நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Man and Machine', ta: 'மனிதனும் இயந்திரமும்' },
      explanation: { en: 'Computers are complements for human beings, not substitutes. The most valuable businesses of coming decades will be built by entrepreneurs who seek to empower people rather than make them obsolete.', ta: 'கணினிகள் மனிதர்களுக்கு நிரப்பிகள், மாற்று அல்ல. வரும் தசாப்தங்களின் மிகவும் மதிப்புமிக்க வணிகங்கள், மனிதர்களைப் பயனற்றவர்களாக ஆக்குவதை விட அவர்களை மேம்படுத்த முற்படும் தொழில்முனைவோரால் உருவாக்கப்படும்.' },
      whyItMatters: { en: 'Humans are good at complex strategy and pattern recognition; computers are good at processing massive amounts of data. Combining them is a 0 to 1 breakthrough.', ta: 'மனிதர்கள் சிக்கலான உத்தி மற்றும் முறை அங்கீகாரத்தில் வல்லவர்கள்; கணினிகள் பெருமளவிலான தரவைச் செயலாக்குவதில் வல்லவை. அவற்றை இணைப்பது 0-லிருந்து 1-க்கான முன்னேற்றமாகும்.' },
      example: { en: 'At PayPal, human analysts couldn\'t keep up with fraud. Pure algorithms flagged too many false positives. The solution was "Igor"—a system where computers flagged suspicious transactions for humans to review.', ta: 'பேபாலில், மனிதப் பகுப்பாய்வாளர்களால் மோசடியைக் கண்டுபிடிக்க முடியவில்லை. தூய அல்காரிதம்கள் பல தவறான நேர்மறைகளைக் கொடியிட்டன. இதற்கான தீர்வு "இகோர்"—கணினிகள் சந்தேகத்திற்கிடமான பரிவர்த்தனைகளை மனிதர்கள் மதிப்பாய்வு செய்வதற்குக் கொடியிடும் ஒரு அமைப்பு.' },
      actionStep: { en: 'Look at your AI or tech strategy. Ensure it is designed to give your human employees "superpowers" rather than just trying to replace them cheaply.', ta: 'உங்கள் AI அல்லது தொழில்நுட்ப உத்தியைப் பாருங்கள். அது உங்கள் மனித ஊழியர்களை மலிவாக மாற்ற முயற்சிப்பதற்குப் பதிலாக அவர்களுக்கு "சூப்பர் பவர்களை" கொடுக்க வடிவமைக்கப்பட்டுள்ளதா என்பதை உறுதிப்படுத்தவும்.' },
      reflectionQuestion: { en: 'Are you viewing technology purely as a cost-cutting tool, or as an enabler of unprecedented human capability?', ta: 'நீங்கள் தொழில்நுட்பத்தை வெறுமனே செலவைக் குறைக்கும் கருவியாகப் பார்க்கிறீர்களா, அல்லது முன்னெப்போதும் இல்லாத மனிதத் திறனைச் செயல்படுத்துபவராகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Founders are Different', ta: 'நிறுவனர்கள் வித்தியாசமானவர்கள்' },
      explanation: { en: 'A founder’s most important job is to formulate a vision and rally a cult-like following around it. True founders often appear extreme, eccentric, or polarizing.', ta: 'ஒரு நிறுவனரின் மிக முக்கியமான வேலை, ஒரு பார்வையை உருவாக்குவதும், அதைச் சுற்றி வழிபாட்டு-முறையிலான பின்பற்றுபவர்களைத் திரட்டுவதுமாகும். உண்மையான நிறுவனர்கள் பெரும்பாலும் தீவிரமானவர்களாக, விசித்திரமானவர்களாக அல்லது துருவப்படுத்துபவர்களாகத் தோன்றுவார்கள்.' },
      whyItMatters: { en: 'Normal, completely well-adjusted people rarely build 0 to 1 companies. You need a slightly obsessive, disagreeable personality to push an impossible vision into reality.', ta: 'சாதாரணமான, முழுமையாகச் சரிசெய்யப்பட்ட மனிதர்கள் 0-லிருந்து 1 நிறுவனங்களை உருவாக்குவது அரிது. சாத்தியமற்ற ஒரு பார்வையை யதார்த்தத்திற்குத் தள்ள உங்களுக்குச் சற்றே வெறித்தனமான, விரும்பத்தகாத ஆளுமை தேவை.' },
      example: { en: 'Steve Jobs was notorious for his eccentricities, intense demands, and polarizing personality. Yet, that exact nature is what allowed him to bend the universe to his will.', ta: 'ஸ்டீவ் ஜாப்ஸ் அவரது விசித்திரங்கள், தீவிர கோரிக்கைகள் மற்றும் துருவப்படுத்தும் ஆளுமைக்குப் பெயர் பெற்றவர். ஆயினும், அந்தச் சரியான தன்மைதான் பிரபஞ்சத்தை அவரது விருப்பத்திற்கு வளைக்க அனுமதித்தது.' },
      actionStep: { en: 'Lean into your weirdness. Don\'t try to act like a generic corporate manager if you are building something revolutionary.', ta: 'உங்களின் விசித்திரத்திற்குச் சாய்ந்துகொள்ளுங்கள். நீங்கள் புரட்சிகரமான ஒன்றை உருவாக்குகிறீர்கள் என்றால், ஒரு பொதுவான கார்ப்பரேட் மேலாளரைப் போலச் செயல்பட முயற்சிக்காதீர்கள்.' },
      reflectionQuestion: { en: 'Are you watering down your vision to make it sound "reasonable" to average people?', ta: 'சராசரி மனிதர்களுக்கு அது "நியாயமானதாக" ஒலிப்பதற்காக உங்கள் பார்வையை நீங்கள் நீர்த்துப்போகச் செய்கிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'The Power Law', ta: 'சக்தி விதி (The Power Law)' },
      explanation: { en: 'The biggest secret in venture capital is that the best investment in a successful fund equals or outperforms the entire rest of the fund combined.', ta: 'வென்ச்சர் மூலதனத்தின் மிகப்பெரிய ரகசியம் என்னவென்றால், ஒரு வெற்றிகரமான நிதியில் சிறந்த முதலீடு நிதியின் மீதமுள்ள முழுப் பகுதியையும் சமன் செய்கிறது அல்லது அதை விடச் சிறப்பாகச் செயல்படுகிறது.' },
      whyItMatters: { en: 'We don\'t live in a normal distribution world; we live under a Power Law. You should focus entirely on the few things that have massive, exponential potential.', ta: 'நாம் ஒரு சாதாரண விநியோக உலகில் வாழவில்லை; நாம் ஒரு சக்தி விதியின் கீழ் வாழ்கிறோம். பாரிய, அதிவேகத் திறனைக் கொண்ட சில விஷயங்களில் மட்டுமே நீங்கள் முழுமையாகக் கவனம் செலுத்த வேண்டும்.' },
      example: { en: 'An investor funds 10 companies. Nine go bankrupt. The 10th company is Facebook. The return on Facebook alone pays for all the failures and generates billions in profit.', ta: 'ஒரு முதலீட்டாளர் 10 நிறுவனங்களுக்கு நிதியளிக்கிறார். ஒன்பது திவாலாகின்றன. 10-வது நிறுவனம் பேஸ்புக். பேஸ்புக்கின் வருமானம் மட்டுமே அனைத்துத் தோல்விகளுக்கும் ஈடுகொடுத்துப் பில்லியன்கணக்கான லாபத்தை ஈட்டுகிறது.' },
      actionStep: { en: 'Identify the ONE project or skill in your life that possesses exponential upside (Power Law potential). Cut your time spent on linear, low-ceiling tasks.', ta: 'உங்கள் வாழ்க்கையில் அதிவேக வளர்ச்சியைக் கொண்ட (பவர் லா திறன்) ஒரு திட்டம் அல்லது திறனைக் கண்டறியவும். நேரியல், குறைந்த அளவிலான பணிகளில் நீங்கள் செலவிடும் நேரத்தைக் குறைக்கவும்.' },
      reflectionQuestion: { en: 'Are you spreading yourself too thin trying to diversify, instead of doubling down on your biggest winner?', ta: 'உங்களின் மிகப்பெரிய வெற்றியின் மீது அதிகக் கவனம் செலுத்துவதற்குப் பதிலாக, பல்வகைப்படுத்த முயற்சிப்பதில் உங்களை மிகவும் மெலிதாகப் பரப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Secrets', ta: 'ரகசியங்கள்' },
      explanation: { en: 'Great companies can be built on open but unsuspected secrets about how the world works. If there are no secrets left, there is no room for 0 to 1 innovation.', ta: 'உலகம் எப்படி இயங்குகிறது என்பது பற்றிய திறந்த ஆனால் சந்தேகத்திற்கு இடமில்லாத ரகசியங்களின் அடிப்படையில் சிறந்த நிறுவனங்களை உருவாக்க முடியும். ரகசியங்கள் எதுவும் எஞ்சியிருக்கவில்லை என்றால், 0-லிருந்து 1 கண்டுபிடிப்புக்கு இடமில்லை.' },
      whyItMatters: { en: 'When you find a secret—a truth that others don\'t see or refuse to believe—you have found the foundation of a monopoly.', ta: 'நீங்கள் ஒரு ரகசியத்தைக் கண்டறியும்போது—மற்றவர்கள் பார்க்காத அல்லது நம்ப மறுக்கும் ஒரு உண்மையை—நீங்கள் ஏகபோகத்தின் அடித்தளத்தைக் கண்டறிந்துவிட்டீர்கள்.' },
      example: { en: 'Airbnb’s secret was that people were actually willing to let strangers sleep in their homes if there was a trust verification system, a concept hotels thought was insane.', ta: 'நம்பகத்தன்மை சரிபார்ப்பு அமைப்பு இருந்தால், மக்கள் உண்மையில் அந்நியர்களைத் தங்கள் வீடுகளில் தூங்க அனுமதிக்கத் தயாராக இருக்கிறார்கள் என்பதே ஏர்பிஎன்பி-யின் (Airbnb) ரகசியமாகும், இது விடுதிகள் பைத்தியக்காரத்தனம் என்று நினைத்த ஒரு கருத்தாகும்.' },
      actionStep: { en: 'Look closely at your industry. Ask yourself: What is everybody doing just because "that is how it has always been done," which is actually highly inefficient?', ta: 'உங்கள் தொழில்துறையை உற்று நோக்குங்கள். உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "அது எப்போதும் அப்படித்தான் செய்யப்படுகிறது" என்பதற்காக மட்டுமே அனைவரும் என்ன செய்கிறார்கள், அது உண்மையில் மிகவும் திறமையற்றதா?' },
      reflectionQuestion: { en: 'Do you believe that all the great ideas have already been taken?', ta: 'அனைத்துச் சிறந்த யோசனைகளும் ஏற்கனவே எடுக்கப்பட்டுவிட்டன என்று நீங்கள் நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Foundation Matters', ta: 'அடித்தளம் முக்கியமானது' },
      explanation: { en: 'Thiel’s Law: A startup messed up at its foundation cannot be fixed. Early bad decisions—choosing the wrong partners, hiring the wrong people—are very hard to correct.', ta: 'தியேலின் விதி: அதன் அடித்தளத்தில் குழப்பமடைந்த ஒரு ஸ்டார்ட்அப்பை சரிசெய்ய முடியாது. தவறான கூட்டாளர்களைத் தேர்ந்தெடுப்பது, தவறான மனிதர்களை வேலைக்கு அமர்த்துவது போன்ற ஆரம்பகால மோசமான முடிவுகளைத் திருத்துவது மிகவும் கடினம்.' },
      whyItMatters: { en: 'Conflict between founders or board members will kill a company faster than competitors. Structural alignment is the prerequisite for 0 to 1 leaps.', ta: 'நிறுவனர்கள் அல்லது குழு உறுப்பினர்களுக்கிடையேயான மோதல் போட்டியாளர்களை விட வேகமாக ஒரு நிறுவனத்தைக் கொல்லும். கட்டமைப்புச் சீரமைப்பு என்பது 0-லிருந்து 1 பாய்ச்சல்களுக்கு முன்நிபந்தனையாகும்.' },
      example: { en: 'Two founders agreeing to a 50/50 split without vesting schedules, only for one to leave after a month and legally own half the company forever.', ta: 'வெஸ்டிங் அட்டவணைகள் இல்லாமல் 50/50 பிரிவுக்கு இரண்டு நிறுவனர்கள் ஒப்புக்கொள்கிறார்கள், ஒருவர் ஒரு மாதத்திற்குப் பிறகு வெளியேறி நிறுவனத்தின் பாதியை என்றென்றும் சட்டபூர்வமாகச் சொந்தமாக்கிக் கொள்வதற்காக.' },
      actionStep: { en: 'Have the hard, uncomfortable conversations about equity, roles, and expectations with your partners BEFORE you launch the project.', ta: 'நீங்கள் திட்டத்தைத் தொடங்குவதற்கு முன் உங்களின் கூட்டாளர்களுடன் சமபங்கு, பாத்திரங்கள் மற்றும் எதிர்பார்ப்புகள் பற்றிய கடினமான, சங்கடமான உரையாடல்களை மேற்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you ignoring fundamental misalignment with a co-founder just to keep the peace temporarily?', ta: 'தற்காலிகமாக அமைதியைக் காப்பதற்காக இணை நிறுவனருடனான அடிப்படை முரண்பாட்டை நீங்கள் புறக்கணிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Definite vs Indefinite Optimism', ta: 'திட்டவட்டமான vs காலவரையற்ற நம்பிக்கை' },
      explanation: { en: 'A definite optimist believes the future will be better than the present if they plan and work to make it better. An indefinite optimist believes the future will be better, but doesn\'t know how, so they just wait.', ta: 'ஒரு திட்டவட்டமான நம்பிக்கையாளர், எதிர்காலத்தைச் சிறப்பாக்கத் திட்டமிட்டுச் செயல்பட்டால் நிகழ்காலத்தை விட எதிர்காலம் சிறப்பாக இருக்கும் என்று நம்புகிறார். ஒரு காலவரையற்ற நம்பிக்கையாளர் எதிர்காலம் சிறப்பாக இருக்கும் என்று நம்புகிறார், ஆனால் எப்படி என்று தெரியவில்லை, அதனால் அவர் காத்திருக்கிறார்.' },
      whyItMatters: { en: 'Indefinite optimism leads to building nothing (just tweaking finance/portfolios). Definite optimism built the Apollo program, the Panama Canal, and the internet.', ta: 'காலவரையற்ற நம்பிக்கை எதையும் உருவாக்க வழிவகுக்காது (நிதி/போர்ட்ஃபோலியோக்களை மட்டுமே மாற்றியமைக்கிறது). திட்டவட்டமான நம்பிக்கைதான் அப்பல்லோ திட்டம், பனாமா கால்வாய் மற்றும் இணையத்தை உருவாக்கியது.' },
      example: { en: 'Definite: "We will put a man on the moon by 1969 by building the Saturn V rocket." Indefinite: "Technology will naturally improve over time, I\'ll just invest in index funds."', ta: 'திட்டவட்டமானது: "சாட்டர்ன் V ராக்கெட்டை உருவாக்குவதன் மூலம் 1969-க்குள் மனிதனை நிலவில் நிறுத்துவோம்." காலவரையற்றது: "காலப்போக்கில் தொழில்நுட்பம் இயற்கையாகவே மேம்படும், நான் குறியீட்டு நிதிகளில் மட்டுமே முதலீடு செய்வேன்."' },
      actionStep: { en: 'Create a specific, multi-year, grand plan for your life or business. Do not rely on "keeping your options open."', ta: 'உங்கள் வாழ்க்கை அல்லது வணிகத்திற்கு ஒரு குறிப்பிட்ட, பல ஆண்டு, பிரம்மாண்டமான திட்டத்தை உருவாக்குங்கள். "உங்கள் விருப்பங்களைத் திறந்து வைப்பதை" நம்பியிருக்க வேண்டாம்.' },
      reflectionQuestion: { en: 'Are you suffering from indefinite optimism, floating through life waiting for the future to magically arrange itself in your favor?', ta: 'எதிர்காலம் மாயாஜாலமாக உங்களுக்குச் சாதகமாக அமையும் என்று காத்திருந்து, காலவரையற்ற நம்பிக்கையால் நீங்கள் அவதிப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Sales is Hidden', ta: 'விற்பனை மறைக்கப்பட்டுள்ளது' },
      explanation: { en: 'The best sales is hidden. There is no "Sales" department for advertising (it’s called Marketing), or for selling a company to investors (it’s called Investment Banking).', ta: 'சிறந்த விற்பனை மறைக்கப்பட்டுள்ளது. விளம்பரங்களுக்கு "விற்பனை" துறை என்று ஒன்று இல்லை (அது சந்தைப்படுத்தல் என்று அழைக்கப்படுகிறது), அல்லது முதலீட்டாளர்களுக்கு ஒரு நிறுவனத்தை விற்பதற்கு (இது முதலீட்டு வங்கி என்று அழைக்கப்படுகிறது).' },
      whyItMatters: { en: 'People resist being sold to. The most effective sales strategies don’t look like sales at all. They look like education, entertainment, or relationship building.', ta: 'தங்களுக்கு விற்கப்படுவதை மக்கள் எதிர்க்கிறார்கள். மிகவும் பயனுள்ள விற்பனை உத்திகள் விற்பனை போலத் தெரிவதே இல்லை. அவை கல்வி, பொழுதுபோக்கு அல்லது உறவை உருவாக்குவது போல் தோன்றுகின்றன.' },
      example: { en: 'Tom Sawyer didn’t "sell" the job of painting a fence; he made it look like a highly exclusive privilege, and his friends paid him to do the work.', ta: 'டாம் சாயர் ஒரு வேலிக்குப் பெயிண்ட் அடிக்கும் வேலையை "விற்க" இல்லை; அவர் அதை மிகவும் பிரத்தியேகமான பாக்கியமாகத் தோன்றச் செய்தார், மேலும் வேலையைச் செய்ய அவருடைய நண்பர்கள் அவருக்குப் பணம் கொடுத்தனர்.' },
      actionStep: { en: 'Redesign your pitch so it feels like a consultation or a collaboration, rather than a hard close.', ta: 'உங்களின் பிட்ச்சை (Pitch) மறுவடிவமைப்பு செய்யுங்கள், அதனால் அது ஒரு கடினமான முடிவாக இல்லாமல், ஒரு ஆலோசனை அல்லது ஒத்துழைப்பாக உணரும்.' },
      reflectionQuestion: { en: 'Does your sales process feel aggressive and transactional, triggering the customer\'s defense mechanisms?', ta: 'வாடிக்கையாளரின் தற்காப்பு வழிமுறைகளைத் தூண்டும் வகையில் உங்கள் விற்பனைச் செயல்முறை ஆக்ரோஷமானதாகவும் பரிவர்த்தனை ரீதியாகவும் உணர்கிறதா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'You Are Not a Lottery Ticket', ta: 'நீங்கள் ஒரு லாட்டரி சீட்டு அல்ல' },
      explanation: { en: 'Success is not a matter of luck. If you believe your life is mostly a matter of chance, why read this book? Learning about startups is worthless if you are just reading stories about people who won the lottery.', ta: 'வெற்றி என்பது அதிர்ஷ்டம் பற்றியது அல்ல. உங்கள் வாழ்க்கை பெரும்பாலும் அதிர்ஷ்டத்தைப் பொறுத்தது என்று நீங்கள் நம்பினால், இந்தப் புத்தகத்தை ஏன் படிக்க வேண்டும்? லாட்டரியில் வெற்றி பெற்ற மனிதர்களைப் பற்றிய கதைகளை மட்டும் நீங்கள் படிக்கிறீர்கள் என்றால், ஸ்டார்ட்அப்களைப் பற்றிக் கற்றுக்கொள்வது பயனற்றது.' },
      whyItMatters: { en: 'Attributing success to luck is a coping mechanism for the lazy. Believing that you are the master of your fate forces you to take responsibility for engineering your own success.', ta: 'வெற்றியை அதிர்ஷ்டத்திற்குக் காரணம் கூறுவது சோம்பேறிகளுக்கான சமாளிப்பு வழிமுறையாகும். உங்கள் விதியின் எஜமானர் நீங்கள்தான் என்று நம்புவது உங்கள் சொந்த வெற்றியை உருவாக்குவதற்கான பொறுப்பை ஏற்க உங்களைத் தூண்டுகிறது.' },
      example: { en: 'Ralph Waldo Emerson said, "Shallow men believe in luck, believe in circumstances... Strong men believe in cause and effect."', ta: 'ரால்ப் வால்டோ எமர்சன் கூறினார், "ஆழமற்ற மனிதர்கள் அதிர்ஷ்டத்தை நம்புகிறார்கள், சூழ்நிலைகளை நம்புகிறார்கள்... வலிமையான மனிதர்கள் காரணத்தையும் விளைவையும் நம்புகிறார்கள்."' },
      actionStep: { en: 'Catch yourself next time you say someone is "just lucky." Instead, analyze the specific, deliberate actions they took to put themselves in a position to win.', ta: 'அடுத்த முறை யாராவது "வெறும் அதிர்ஷ்டசாலி" என்று சொல்லும்போது உங்களைப் பிடித்துக் கொள்ளுங்கள். அதற்குப் பதிலாக, தங்களை வெற்றிபெறும் நிலையில் வைத்துக்கொள்ள அவர்கள் எடுத்த குறிப்பிட்ட, திட்டமிட்ட நடவடிக்கைகளை பகுப்பாய்வு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you treating your career like a series of random coin flips, or are you executing a master plan?', ta: 'உங்கள் தொழில் வாழ்க்கையை சீரற்ற நாணய சுழற்சிகளின் தொடராகக் கருதுகிறீர்களா, அல்லது ஒரு மாஸ்டர் பிளானைச் செயல்படுத்துகிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Zero to One: Notes on Startups, or How to Build the Future' });
    if (existing) {
      console.log('Zero to One already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Zero to One: Notes on Startups, or How to Build the Future' });
    }
    
    await WisdomBook.create(zeroToOneBook);
    console.log('Zero to One added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
