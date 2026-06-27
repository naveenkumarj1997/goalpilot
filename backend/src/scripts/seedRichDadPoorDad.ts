import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const richDadBook = {
  title: 'Rich Dad Poor Dad',
  author: 'Robert T. Kiyosaki',
  coverImage: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
  categories: ['Finance', 'Business', 'Self-Help'],
  themes: [
    { en: 'Financial Education', ta: 'நிதி கல்வி' },
    { en: 'Assets vs Liabilities', ta: 'சொத்துக்கள் vs பொறுப்புகள்' }
  ],
  overview: {
    en: 'The story of Robert Kiyosaki growing up with two dads — his real father (poor dad) and his best friend\'s father (rich dad) — and the ways in which both men shaped his thoughts about money and investing.',
    ta: 'ராபர்ட் கியோசாகியின் கதையில் இரண்டு தந்தைகள் உள்ளனர் — அவரது உண்மையான தந்தை (ஏழை தந்தை) மற்றும் அவரது சிறந்த நண்பரின் தந்தை (பணக்கார தந்தை) — இவர்கள் இருவரும் பணம் மற்றும் முதலீடு குறித்த அவரது எண்ணங்களை எவ்வாறு வடிவமைத்தார்கள் என்பது பற்றியது.'
  },
  topQuotes: [
    { en: 'The poor and the middle-class work for money. The rich have money work for them.', ta: 'ஏழைகளும் நடுத்தர வர்க்கத்தினரும் பணத்திற்காக வேலை செய்கிறார்கள். பணக்காரர்களுக்கு பணம் வேலை செய்கிறது.' },
    { en: 'It\'s not how much money you make, but how much money you keep.', ta: 'நீங்கள் எவ்வளவு பணம் சம்பாதிக்கிறீர்கள் என்பது முக்கியமல்ல, எவ்வளவு பணத்தை சேமிக்கிறீர்கள் என்பதே முக்கியம்.' },
    { en: 'In school we learn that mistakes are bad, and we are punished for making them. Yet, if you look at the way humans are designed to learn, we learn by making mistakes.', ta: 'பள்ளியில் தவறுகள் செய்வது கெட்டது என்று கற்றுக்கொள்கிறோம், அதற்காக தண்டிக்கப்படுகிறோம். ஆனால் மனிதர்கள் தவறுகள் செய்வதன் மூலமே கற்றுக்கொள்கிறார்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Rich Don\'t Work For Money', ta: 'பணக்காரர்கள் பணத்திற்காக வேலை செய்வதில்லை' },
      explanation: { en: 'Most people let fear and greed dictate their lives, keeping them stuck in the Rat Race, working endlessly for a paycheck. The rich learn how to make money work for them.', ta: 'பெரும்பாலான மக்கள் பயம் மற்றும் பேராசை தங்கள் வாழ்க்கையை கட்டுப்படுத்த அனுமதிக்கின்றனர். இதனால் அவர்கள் ஒரு சம்பளத்திற்காக முடிவில்லாமல் வேலை செய்கிறார்கள். பணக்காரர்கள் பணத்தை தங்களுக்கு வேலை செய்ய வைப்பது எப்படி என்று கற்றுக்கொள்கிறார்கள்.' },
      whyItMatters: { en: 'Working only for a salary limits your earning potential and ties your income directly to your time.', ta: 'சம்பளத்திற்காக மட்டுமே வேலை செய்வது உங்கள் வருமானத்தை கட்டுப்படுத்துகிறது மற்றும் உங்கள் நேரத்தை நேரடியாக உங்கள் வருமானத்துடன் இணைக்கிறது.' },
      example: { en: 'Instead of asking for a raise, a rich mindset looks for ways to build a side business or invest in assets that generate passive income.', ta: 'சம்பள உயர்வை கேட்பதற்கு பதிலாக, ஒரு பணக்கார மனநிலை ஒரு தொழிலை தொடங்க அல்லது வருமானம் ஈட்டும் சொத்துக்களில் முதலீடு செய்ய வழிகளைத் தேடுகிறது.' },
      actionStep: { en: 'Identify one way you can make money without directly trading your time for it (e.g., investing, creating a product).', ta: 'உங்கள் நேரத்தை நேரடியாக செலவிடாமல் பணம் சம்பாதிக்க ஒரு வழியை அடையாளம் காணவும் (எ.கா. முதலீடு செய்தல், ஒரு பொருளை உருவாக்குதல்).' },
      reflectionQuestion: { en: 'Are you working to learn, or just working to earn?', ta: 'நீங்கள் கற்றுக்கொள்வதற்காக வேலை செய்கிறீர்களா அல்லது சம்பாதிக்க மட்டுமே வேலை செய்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Financial Literacy is Essential', ta: 'நிதி அறிவு மிகவும் அவசியம்' },
      explanation: { en: 'Intelligence solves problems and produces money, but money without financial intelligence is money soon gone.', ta: 'புத்திசாலித்தனம் பிரச்சனைகளைத் தீர்த்து பணத்தை உருவாக்குகிறது, ஆனால் நிதி அறிவு இல்லாத பணம் விரைவில் மறைந்துவிடும்.' },
      whyItMatters: { en: 'Schools teach you how to work for money, but not how to manage it. You must educate yourself.', ta: 'பணத்திற்காக எப்படி வேலை செய்வது என்று பள்ளிகள் கற்றுக்கொடுக்கின்றன, ஆனால் அதை எப்படி நிர்வகிப்பது என்று அல்ல. நீங்கள் தான் கற்றுக்கொள்ள வேண்டும்.' },
      example: { en: 'Lottery winners who go broke within a few years because they don\'t understand how to manage wealth.', ta: 'செல்வத்தை எவ்வாறு நிர்வகிப்பது என்று தெரியாததால் சில ஆண்டுகளில் பணத்தை இழக்கும் லாட்டரி வெற்றியாளர்கள்.' },
      actionStep: { en: 'Read one book or take one course on personal finance or investing this month.', ta: 'இந்த மாதம் தனிப்பட்ட நிதி அல்லது முதலீடு குறித்த ஒரு புத்தகத்தை படிக்கவும் அல்லது ஒரு பாடத்தை எடுக்கவும்.' },
      reflectionQuestion: { en: 'How much time do you spend managing your money compared to earning it?', ta: 'பணம் சம்பாதிப்பதை விட அதை நிர்வகிக்க எவ்வளவு நேரம் செலவிடுகிறீர்கள்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Assets vs. Liabilities', ta: 'சொத்துக்கள் vs பொறுப்புகள்' },
      explanation: { en: 'Rule #1: You must know the difference between an asset and a liability, and buy assets. An asset puts money in your pocket. A liability takes money out of your pocket.', ta: 'விதி #1: சொத்து மற்றும் பொறுப்புக்கு உள்ள வித்தியாசத்தை நீங்கள் அறிந்து கொள்ள வேண்டும், மேலும் சொத்துக்களை வாங்க வேண்டும். சொத்து உங்கள் பாக்கெட்டில் பணத்தை போடுகிறது. பொறுப்பு உங்கள் பாக்கெட்டிலிருந்து பணத்தை எடுக்கிறது.' },
      whyItMatters: { en: 'Rich people acquire assets. The poor and middle class acquire liabilities that they think are assets.', ta: 'பணக்காரர்கள் சொத்துக்களை வாங்குகிறார்கள். ஏழைகளும் நடுத்தர வர்க்கத்தினரும் சொத்துக்கள் என்று நினைத்து பொறுப்புகளை வாங்குகிறார்கள்.' },
      example: { en: 'A house you live in with a massive mortgage is a liability (it takes money out). A rental property that pays you monthly is an asset.', ta: 'நீங்கள் வாழும் வீடு பெரிய கடனுடன் இருந்தால் அது ஒரு பொறுப்பு (அது பணத்தை எடுக்கிறது). உங்களுக்கு மாதந்தோறும் வருமானம் தரும் வாடகை வீடு ஒரு சொத்து.' },
      actionStep: { en: 'Make a list of everything you own. Separate them into true assets (makes you money) and liabilities (costs you money).', ta: 'உங்களிடம் உள்ள அனைத்தையும் பட்டியலிடுங்கள். அவற்றை உண்மையான சொத்துக்கள் மற்றும் பொறுப்புகள் என பிரிக்கவும்.' },
      reflectionQuestion: { en: 'Is your biggest purchase making you money or costing you money?', ta: 'நீங்கள் வாங்கிய விலையுயர்ந்த பொருள் உங்களுக்கு பணத்தை தருகிறதா அல்லது செலவை வைக்கிறதா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Mind Your Own Business', ta: 'உங்கள் சொந்த தொழிலில் கவனம் செலுத்துங்கள்' },
      explanation: { en: 'The rich focus on their asset columns while everyone else focuses on their income statements. Your job is not your business; your asset column is your business.', ta: 'மற்ற அனைவரும் தங்கள் வருமான அறிக்கைகளில் கவனம் செலுத்தும் போது பணக்காரர்கள் தங்கள் சொத்துக்களில் கவனம் செலுத்துகிறார்கள். உங்கள் வேலை உங்கள் தொழில் அல்ல; உங்கள் சொத்துக்களே உங்கள் தொழில்.' },
      whyItMatters: { en: 'Working hard for someone else will never make you truly wealthy. You must build your own portfolio.', ta: 'மற்றொருவருக்காக கடின உழைப்பு செய்வது உங்களை ஒருபோதும் பணக்காரனாக்காது. நீங்கள் உங்கள் சொந்த சொத்துக்களை உருவாக்க வேண்டும்.' },
      example: { en: 'Keeping your day job (your profession) but using the extra money to buy stocks or real estate (your business).', ta: 'பகல் நேர வேலையைத் (உங்கள் தொழில்) தொடர்ந்துகொண்டே, கூடுதல் பணத்தைப் பயன்படுத்தி பங்குகள் அல்லது ரியல் எஸ்டேட் வாங்குவது (உங்கள் வியாபாரம்).' },
      actionStep: { en: 'Start allocating at least 10% of your salary directly into an investment portfolio.', ta: 'உங்கள் சம்பளத்தில் குறைந்தது 10% ஐ நேரடியாக ஒரு முதலீட்டு போர்ட்ஃபோலியோவில் ஒதுக்கத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'If you lost your job today, does your "business" (your assets) generate enough to support you?', ta: 'இன்று நீங்கள் உங்கள் வேலையை இழந்தால், உங்கள் "தொழில்" (உங்கள் சொத்துக்கள்) உங்களை ஆதரிக்க போதுமான வருமானத்தை உருவாக்குமா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The History of Taxes and the Power of Corporations', ta: 'வரிகளின் வரலாறு மற்றும் நிறுவனங்களின் சக்தி' },
      explanation: { en: 'Employees earn, get taxed, and live on what is left. Corporations earn, spend everything they can, and are taxed on anything that is left.', ta: 'பணியாளர்கள் சம்பாதிக்கிறார்கள், வரி செலுத்துகிறார்கள், மீதமுள்ளதில் வாழ்கிறார்கள். நிறுவனங்கள் சம்பாதிக்கின்றன, தங்களால் முடிந்த அனைத்தையும் செலவிடுகின்றன, மீதமுள்ளவற்றிற்கு மட்டுமே வரி செலுத்துகின்றன.' },
      whyItMatters: { en: 'Understanding corporate structures and tax laws allows the rich to legally keep more of their money.', ta: 'நிறுவன அமைப்புகள் மற்றும் வரி சட்டங்களை புரிந்துகொள்வது பணக்காரர்கள் தங்களின் பணத்தை சட்டபூர்வமாக பாதுகாத்துக்கொள்ள அனுமதிக்கிறது.' },
      example: { en: 'A business owner writing off their car, travel, and internet as business expenses before paying taxes.', ta: 'ஒரு வணிக உரிமையாளர் வரி செலுத்துவதற்கு முன்பு கார், பயணம் மற்றும் இணைய கட்டணங்களை வணிக செலவுகளாக கழிப்பது.' },
      actionStep: { en: 'Learn the basic tax deductions available to you or consult a tax professional to optimize your taxes.', ta: 'உங்களுக்கு கிடைக்கும் அடிப்படை வரி விலக்குகளை அறியவும் அல்லது உங்கள் வரிகளை மேம்படுத்த வரி நிபுணரை அணுகவும்.' },
      reflectionQuestion: { en: 'Are you paying more in taxes simply because you lack the financial education to minimize them legally?', ta: 'சட்டபூர்வமாக வரியைக் குறைக்க நிதி அறிவு இல்லாததால் மட்டுமே நீங்கள் அதிக வரி செலுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'The Rich Invent Money', ta: 'பணக்காரர்கள் பணத்தை உருவாக்குகிறார்கள்' },
      explanation: { en: 'Often in the real world, it\'s not the smart who get ahead, but the bold. Financial genius requires both technical knowledge and courage.', ta: 'பெரும்பாலும் நிஜ உலகில், புத்திசாலிகள் அல்ல, தைரியமானவர்களே முன்னேறுகிறார்கள். நிதி மேதைக்கு தொழில்நுட்ப அறிவும் தைரியமும் தேவை.' },
      whyItMatters: { en: 'Opportunities are not always seen with your eyes; they are seen with your mind.', ta: 'வாய்ப்புகள் எப்போதும் உங்கள் கண்களால் காணப்படுவதில்லை; அவை உங்கள் மனதால் காணப்படுகின்றன.' },
      example: { en: 'Finding a rundown house, buying it below market value, fixing it, and selling it for a large profit.', ta: 'ஒரு பாழடைந்த வீட்டைக் கண்டுபிடித்து, சந்தை மதிப்பை விடக் குறைவாக வாங்கி, அதைச் சரிசெய்து பெரிய லாபத்திற்கு விற்பது.' },
      actionStep: { en: 'Train your brain to look for financial opportunities in everyday problems.', ta: 'அன்றாட பிரச்சனைகளில் நிதி வாய்ப்புகளைத் தேட உங்கள் மூளைக்கு பயிற்சி அளிக்கவும்.' },
      reflectionQuestion: { en: 'What is a problem you see around you that you could create a profitable solution for?', ta: 'உங்களைச் சுற்றி நீங்கள் காணும் எந்த பிரச்சனைக்கு உங்களால் ஒரு லாபகரமான தீர்வை உருவாக்க முடியும்?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Work to Learn, Don\'t Work for Money', ta: 'கற்றுக்கொள்ள வேலை செய்யுங்கள், பணத்திற்காக வேலை செய்யாதீர்கள்' },
      explanation: { en: 'Job security meant everything to Poor Dad. Learning meant everything to Rich Dad. Seek jobs for what you will learn, not what you will earn.', ta: 'வேலை பாதுகாப்பு ஏழை தந்தைக்கு எல்லாமே. கற்றுக்கொள்வது பணக்கார தந்தைக்கு எல்லாமே. என்ன கற்றுக்கொள்வீர்கள் என்பதற்காக வேலை தேடுங்கள், என்ன சம்பாதிப்பீர்கள் என்பதற்காக அல்ல.' },
      whyItMatters: { en: 'Skills are more valuable long-term than a slightly higher starting salary.', ta: 'சற்று அதிக ஆரம்ப சம்பளத்தை விட திறன்கள் நீண்ட காலத்திற்கு அதிக மதிப்புமிக்கவை.' },
      example: { en: 'Taking a lower-paying job in sales just to master the art of selling and communication.', ta: 'விற்பனை மற்றும் தகவல்தொடர்பு கலையில் தேர்ச்சி பெறுவதற்காக மட்டுமே குறைந்த சம்பளமுள்ள விற்பனை வேலையை எடுப்பது.' },
      actionStep: { en: 'Identify a skill you are weak in (sales, marketing, accounting) and find a way to learn it hands-on.', ta: 'நீங்கள் பலவீனமாக உள்ள ஒரு திறனை (விற்பனை, மார்க்கெட்டிங், கணக்கியல்) கண்டறிந்து அதை செய்முறையாக கற்றுக்கொள்ள ஒரு வழியைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'What skill are you currently learning at your job that will make you wealthy later?', ta: 'உங்கள் தற்போதைய வேலையில் நீங்கள் எந்த திறனைக் கற்றுக்கொள்கிறீர்கள், அது உங்களை பணக்காரனாக்கும்?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Overcoming Fear', ta: 'பயத்தை வெல்வது' },
      explanation: { en: 'The primary difference between a rich person and a poor person is how they manage fear. The fear of losing money is real, but how you handle it dictates your success.', ta: 'ஒரு பணக்காரனுக்கும் ஏழைக்கும் உள்ள முக்கிய வேறுபாடு அவர்கள் பயத்தை எவ்வாறு கையாளுகிறார்கள் என்பதே. பணத்தை இழக்கும் பயம் உண்மையானது, ஆனால் அதை நீங்கள் எப்படி கையாளுகிறீர்கள் என்பதே உங்கள் வெற்றியை தீர்மானிக்கிறது.' },
      whyItMatters: { en: 'If you are too afraid of losing, you will never play to win; you will only play not to lose.', ta: 'தோற்றுப்போவோம் என்று நீங்கள் மிகவும் பயந்தால், நீங்கள் ஒருபோதும் வெற்றிபெற விளையாட மாட்டீர்கள்; தோற்கக்கூடாது என்பதற்காக மட்டுமே விளையாடுவீர்கள்.' },
      example: { en: 'Keeping all your money in a savings account earning 1% (playing not to lose) instead of investing in the market (playing to win).', ta: 'உங்கள் பணத்தை சந்தையில் முதலீடு செய்வதற்குப் பதிலாக 1% வருமானம் தரும் சேமிப்புக் கணக்கில் வைப்பது.' },
      actionStep: { en: 'Acknowledge your financial fears and logically calculate the worst-case scenario before taking a risk.', ta: 'உங்கள் நிதி அச்சங்களை ஏற்றுக்கொண்டு, ரிஸ்க் எடுப்பதற்கு முன் மோசமான விளைவுகளை தர்க்கரீதியாக கணக்கிடுங்கள்.' },
      reflectionQuestion: { en: 'Has the fear of losing money ever stopped you from taking a great opportunity?', ta: 'பணத்தை இழக்க நேரிடும் என்ற பயம் எப்போதாவது ஒரு சிறந்த வாய்ப்பைப் பயன்படுத்துவதிலிருந்து உங்களைத் தடுத்துள்ளதா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Overcoming Cynicism', ta: 'சந்தேகத்தை வெல்வது' },
      explanation: { en: 'Cynics criticize, and winners analyze. Doubts and "what ifs" keep most people poor and playing it safe.', ta: 'சந்தேகவாதிகள் விமர்சிக்கிறார்கள், வெற்றியாளர்கள் பகுப்பாய்வு செய்கிறார்கள். சந்தேகங்களும் "அப்படி நடந்தால் என்ன ஆகும்" என்ற எண்ணமும் பெரும்பாலான மக்களை ஏழைகளாகவே வைத்திருக்கிறது.' },
      whyItMatters: { en: 'Listening to "Chicken Littles" (people who think the sky is always falling) paralyzes you from taking action.', ta: 'எப்போதும் வானம் இடிந்து விழும் என்று நினைப்பவர்களின் பேச்சைக் கேட்பது உங்களை செயல்பட விடாமல் முடக்குகிறது.' },
      example: { en: 'Not buying a great property because a friend told you the housing market "might" crash.', ta: 'ரியல் எஸ்டேட் சந்தை "வீழ்ச்சியடையலாம்" என்று ஒரு நண்பர் கூறியதால் ஒரு நல்ல சொத்தை வாங்காமல் இருப்பது.' },
      actionStep: { en: 'When you hear negative advice, ask yourself if the person giving it is where you want to be financially.', ta: 'எதிர்மறையான ஆலோசனைகளைக் கேட்கும்போது, அந்த ஆலோசனையை வழங்குபவர் நிதி ரீதியாக நீங்கள் இருக்க விரும்பும் இடத்தில் இருக்கிறாரா என்று உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Whose doubts are you letting dictate your financial decisions?', ta: 'யாருடைய சந்தேகங்கள் உங்கள் நிதி முடிவுகளைக் கட்டுப்படுத்த அனுமதிக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Overcoming Laziness', ta: 'சோம்பலை வெல்வது' },
      explanation: { en: 'Busy people are often the most lazy. They stay busy to avoid facing what they really need to do—manage their wealth or fix their lives.', ta: 'சுறுசுறுப்பான மக்கள் பெரும்பாலும் மிகவும் சோம்பேறிகளாக இருப்பார்கள். அவர்கள் தங்கள் செல்வத்தை நிர்வகிப்பது போன்ற அவர்கள் உண்மையில் செய்ய வேண்டியதை தவிர்ப்பதற்காக சுறுசுறுப்பாக இருக்கிறார்கள்.' },
      whyItMatters: { en: 'Instead of saying "I can\'t afford it," you must ask "How can I afford it?" The first is lazy; the second forces your brain to work.', ta: '"என்னால் அதை வாங்க முடியாது" என்று சொல்வதற்குப் பதிலாக, "நான் எப்படி அதை வாங்க முடியும்?" என்று கேட்க வேண்டும். முதலாவது சோம்பேறித்தனம்; இரண்டாவது உங்கள் மூளையை வேலை செய்யத் தூண்டுகிறது.' },
      example: { en: 'Working 60 hours a week at a job you hate because you are "too busy" to look for a better opportunity.', ta: 'சிறந்த வாய்ப்பைத் தேட "மிகவும் பிஸியாக" இருப்பதால் உங்களுக்குப் பிடிக்காத வேலையில் வாரத்திற்கு 60 மணிநேரம் வேலை செய்வது.' },
      actionStep: { en: 'Replace the phrase "I can\'t afford it" with "How can I afford it?" in your daily vocabulary.', ta: 'உங்கள் தினசரி பேச்சில் "என்னால் அதை வாங்க முடியாது" என்ற சொற்றொடரை "நான் எப்படி அதை வாங்க முடியும்?" என்று மாற்றவும்.' },
      reflectionQuestion: { en: 'What important financial task are you currently avoiding by pretending to be "too busy"?', ta: '"மிகவும் பிஸியாக" இருப்பதாகக் காட்டிக் கொண்டு நீங்கள் தற்போது எந்த முக்கியமான நிதிப் பணியைத் தவிர்க்கிறீர்கள்?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Overcoming Bad Habits', ta: 'தீய பழக்கங்களை வெல்வது' },
      explanation: { en: 'Our lives are a reflection of our habits more than our education. Rich Dad taught to pay yourself first, even when short of money.', ta: 'நம் கல்வி அறிவை விட நம் பழக்கவழக்கங்களே நம் வாழ்க்கையின் பிரதிபலிப்பாகும். பணக்கார தந்தை பணம் இல்லாத போதிலும் முதலில் உங்களுக்கு நீங்களே பணம் செலுத்த கற்றுக்கொடுத்தார்.' },
      whyItMatters: { en: 'If you pay everyone else first (bills, taxes, landlords), you will never have anything left for your asset column.', ta: 'நீங்கள் மற்ற அனைவருக்கும் (பில்கள், வரிகள், வாடகை) முதலில் பணம் செலுத்தினால், உங்கள் சொத்துக்களுக்காக உங்களிடம் எதுவும் மீதமிருக்காது.' },
      example: { en: 'Automatically routing 10% of your paycheck to an investment account before you pay your rent or buy groceries.', ta: 'வாடகை செலுத்துவதற்கு அல்லது மளிகைப் பொருட்கள் வாங்குவதற்கு முன்பு உங்கள் சம்பளத்தின் 10% ஐ ஒரு முதலீட்டுக் கணக்கிற்கு தானாகவே மாற்றுவது.' },
      actionStep: { en: 'Set up an automatic transfer from your checking to your investment account on payday.', ta: 'சம்பளம் வரும் நாளில் உங்கள் வங்கி கணக்கிலிருந்து முதலீட்டுக் கணக்கிற்கு தானாக பணம் மாற்றும்படி அமைக்கவும்.' },
      reflectionQuestion: { en: 'Do you pay yourself first, or do you save whatever is left over at the end of the month?', ta: 'நீங்கள் முதலில் உங்களுக்கு பணம் செலுத்துகிறீர்களா, அல்லது மாத இறுதியில் மீதமிருப்பதை சேமிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Overcoming Arrogance', ta: 'ஆணவத்தை வெல்வது' },
      explanation: { en: 'Arrogance is ego plus ignorance. What you know makes you money. What you don\'t know loses you money.', ta: 'ஆணவம் என்பது ஈகோ மற்றும் அறியாமை. உங்களுக்குத் தெரிந்தவை பணத்தை சம்பாதிக்க வைக்கின்றன. உங்களுக்குத் தெரியாதவை பணத்தை இழக்கச் செய்கின்றன.' },
      whyItMatters: { en: 'Many people use arrogance to hide their own ignorance about money. It’s okay to not know, but it’s not okay to pretend you do.', ta: 'பணம் பற்றிய அறியாமையை மறைக்க பலரும் ஆணவத்தை பயன்படுத்துகிறார்கள். தெரியாமல் இருப்பது பரவாயில்லை, ஆனால் தெரிந்தது போல் நடிப்பது தவறானது.' },
      example: { en: 'Refusing to hire an accountant because you think you can do it all, then making a massive tax mistake.', ta: 'உங்களால் அனைத்தையும் செய்ய முடியும் என்று நினைத்து கணக்காளரை நியமிக்க மறுப்பது, பின்னர் பெரும் வரித் தவறை செய்வது.' },
      actionStep: { en: 'When you are ignorant in a subject, admit it and educate yourself by finding an expert in the field.', ta: 'ஒரு விஷயத்தில் உங்களுக்கு அறியாமை இருக்கும்போது, அதை ஒப்புக்கொண்டு அந்த துறையில் நிபுணரைக் கண்டுபிடித்து கற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'What financial topic do you pretend to understand but actually know very little about?', ta: 'உண்மையில் உங்களுக்குக் குறைவாகவே தெரிந்திருந்தாலும், எந்த நிதித் தலைப்பை நீங்கள் புரிந்துகொண்டதாக நடிக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Find a Reason Greater Than Reality', ta: 'யதார்த்தத்தை விடப் பெரிய காரணத்தைக் கண்டறியவும்' },
      explanation: { en: 'The power of spirit. If you don\'t have a strong reason or purpose, the reality of life (the hard work) will beat you down.', ta: 'ஆன்மாவின் சக்தி. உங்களிடம் வலுவான காரணமோ நோக்கமோ இல்லாவிட்டால், வாழ்க்கையின் யதார்த்தம் (கடின உழைப்பு) உங்களை வீழ்த்திவிடும்.' },
      whyItMatters: { en: 'You need deep emotional reasons ("I want to be free", "I don\'t want to work like my parents did") to stay motivated.', ta: 'ஊக்கத்துடன் இருக்க உங்களுக்கு ஆழமான உணர்ச்சிகரமான காரணங்கள் தேவை ("நான் சுதந்திரமாக இருக்க விரும்புகிறேன்", "என் பெற்றோரைப் போல நான் கஷ்டப்பட விரும்பவில்லை").' },
      example: { en: 'Enduring long nights building a business because your "why" is giving your children a better life.', ta: 'உங்கள் குழந்தைகளுக்கு சிறந்த வாழ்க்கையைத் தருவது என்ற காரணத்தினால் இரவு பகலாக உழைத்து ஒரு தொழிலை உருவாக்குவது.' },
      actionStep: { en: 'Write down your deepest "wants" and "don\'t wants" regarding your financial future.', ta: 'உங்கள் நிதி எதிர்காலம் குறித்து உங்கள் ஆழ்ந்த "விருப்பங்கள்" மற்றும் "விரும்பாதவை" ஆகியவற்றை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'What is the real emotional reason you want to be wealthy?', ta: 'நீங்கள் பணக்காரராக விரும்பும் உண்மையான உணர்ச்சிகரமான காரணம் என்ன?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Choose Friends Carefully', ta: 'நண்பர்களை கவனமாக தேர்ந்தெடுங்கள்' },
      explanation: { en: 'The power of association. Don\'t choose friends based on their financial statements, but do consciously learn from the people you associate with.', ta: 'சேர்க்கையின் சக்தி. நண்பர்களின் நிதி நிலையை வைத்து அவர்களைத் தேர்ந்தெடுக்காதீர்கள், ஆனால் நீங்கள் பழகும் நபர்களிடமிருந்து நனவுடன் கற்றுக்கொள்ளுங்கள்.' },
      whyItMatters: { en: 'You become like the people you spend the most time with. If they talk about money negatively, you will too.', ta: 'நீங்கள் அதிக நேரம் செலவிடும் நபர்களைப் போலவே நீங்களும் மாறுவீர்கள். அவர்கள் பணத்தைப் பற்றி எதிர்மறையாகப் பேசினால், நீங்களும் அவ்வாறே பேசுவீர்கள்.' },
      example: { en: 'Hanging out with investors who discuss opportunities vs. hanging out with people who just complain about their bosses.', ta: 'வாய்ப்புகளைப் பற்றி விவாதிக்கும் முதலீட்டாளர்களுடன் பழகுவது vs தங்கள் முதலாளிகளைப் பற்றி புகார் கூறுபவர்களுடன் பழகுவது.' },
      actionStep: { en: 'Find a community or group of people who are actively trying to improve their financial literacy.', ta: 'தங்கள் நிதி அறிவை மேம்படுத்த தீவிரமாக முயற்சிக்கும் ஒரு சமூகம் அல்லது குழுவைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'Do your current friends elevate your mindset or drag it down?', ta: 'உங்கள் தற்போதைய நண்பர்கள் உங்கள் மனநிலையை உயர்த்துகிறார்களா அல்லது கீழே இழுக்கிறார்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Master a Formula, Then Learn a New One', ta: 'ஒரு சூத்திரத்தில் தேர்ச்சி பெறுங்கள், பின்னர் புதியதைக் கற்றுக்கொள்ளுங்கள்' },
      explanation: { en: 'The power of learning quickly. In today\'s fast-changing world, it\'s not so much what you know anymore that counts, because often what you know is old. It is how fast you learn.', ta: 'வேகமாக கற்றுக்கொள்வதன் சக்தி. இன்றைய வேகமாக மாறிவரும் உலகில், உங்களுக்கு என்ன தெரியும் என்பது அவ்வளவு முக்கியமல்ல, ஏனென்றால் உங்களுக்குத் தெரிந்தவை பெரும்பாலும் பழையதாக இருக்கும். நீங்கள் எவ்வளவு வேகமாக கற்றுக்கொள்கிறீர்கள் என்பதே முக்கியம்.' },
      whyItMatters: { en: 'Most people learn one way to make money (a job) and stop. You must continuously learn new formulas (real estate, stocks, business).', ta: 'பெரும்பாலான மக்கள் பணம் சம்பாதிக்க ஒரு வழியை (வேலை) கற்றுக்கொண்டு நிறுத்திவிடுகிறார்கள். நீங்கள் தொடர்ந்து புதிய சூத்திரங்களை (ரியல் எஸ்டேட், பங்குகள், தொழில்) கற்றுக்கொள்ள வேண்டும்.' },
      example: { en: 'Mastering mutual fund investing, then moving on to study real estate foreclosures.', ta: 'மியூச்சுவல் ஃபண்ட் முதலீட்டில் தேர்ச்சி பெறுவது, பின்னர் ரியல் எஸ்டேட் பற்றி படிப்பது.' },
      actionStep: { en: 'Pick one specific investment vehicle (e.g., index funds) and dedicate 3 months to mastering how it works.', ta: 'ஒரு குறிப்பிட்ட முதலீட்டை (எ.கா. குறியீட்டு நிதிகள்) தேர்ந்தெடுத்து, அது எவ்வாறு செயல்படுகிறது என்பதை அறிய 3 மாதங்கள் ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'When was the last time you learned a completely new way to generate income?', ta: 'கடைசியாக வருமானம் ஈட்ட முற்றிலும் புதிய வழியை நீங்கள் எப்போது கற்றுக்கொண்டீர்கள்?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Pay Your Brokers Well', ta: 'உங்கள் நிபுணர்களுக்கு நல்ல ஊதியம் வழங்குங்கள்' },
      explanation: { en: 'The power of good advice. True professionals will save you time and make you money. It’s foolish to cheap out on the people who make you rich.', ta: 'நல்ல ஆலோசனையின் சக்தி. உண்மையான தொழில் வல்லுநர்கள் உங்கள் நேரத்தை மிச்சப்படுத்தி உங்களுக்கு பணத்தை சம்பாதித்து தருவார்கள். உங்களை பணக்காரராக்கும் நபர்களிடம் கஞ்சத்தனம் காட்டுவது முட்டாள்தனம்.' },
      whyItMatters: { en: 'A good accountant, lawyer, or broker will make you far more money than they cost.', ta: 'ஒரு நல்ல கணக்காளர், வழக்கறிஞர் அல்லது தரகர் அவர்கள் செலவழிக்கும் தொகையை விட அதிக பணத்தை உங்களுக்கு சம்பாதித்து தருவார்கள்.' },
      example: { en: 'Paying a top-tier accountant $1,000 to save you $10,000 in taxes.', ta: 'வரிகளில் $10,000 ஐ மிச்சப்படுத்த ஒரு சிறந்த கணக்காளருக்கு $1,000 செலுத்துவது.' },
      actionStep: { en: 'Don\'t look for the cheapest professional; look for the one with the best track record.', ta: 'மலிவான நிபுணரைத் தேடாதீர்கள்; சிறந்த சாதனைப் பதிவு உள்ளவரைத் தேடுங்கள்.' },
      reflectionQuestion: { en: 'Are you trying to save pennies by doing things yourself that an expert could do better and faster?', ta: 'ஒரு நிபுணர் சிறப்பாகவும் வேகமாகவும் செய்யக்கூடிய விஷயங்களை நீங்களே செய்வதன் மூலம் சில்லறைகளை சேமிக்க முயற்சிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Be an Indian Giver', ta: 'ஆரம்ப முதலீட்டை திரும்பப் பெறுங்கள்' },
      explanation: { en: 'The power of getting something for nothing. Return on Investment (ROI) is important, but how fast you get your initial money back is crucial.', ta: 'முதலீட்டின் மீதான வருவாய் (ROI) முக்கியமானது, ஆனால் உங்கள் ஆரம்ப முதலீட்டை எவ்வளவு வேகமாக திரும்பப் பெறுகிறீர்கள் என்பது மிக முக்கியம்.' },
      whyItMatters: { en: 'Sophisticated investors ask, "How fast do I get my money back?" Once they do, they are playing with "house money."', ta: 'அனுபவமிக்க முதலீட்டாளர்கள் "என் பணத்தை எவ்வளவு வேகமாக திரும்பப் பெறுவேன்?" என்று கேட்கிறார்கள். அதை செய்தவுடன், அவர்கள் லாபத்தை வைத்து விளையாடுகிறார்கள்.' },
      example: { en: 'Buying a stock that doubles, selling half to recoup your initial cash, and letting the rest ride risk-free.', ta: 'இரட்டிப்பாகும் ஒரு பங்கை வாங்குவது, உங்கள் ஆரம்ப பணத்தை திரும்பப் பெற பாதியை விற்பது, மீதமுள்ளதை ரிஸ்க் இல்லாமல் அப்படியே விடுவது.' },
      actionStep: { en: 'Before investing, calculate not just the profit, but the timeline to recoup your initial capital.', ta: 'முதலீடு செய்வதற்கு முன், லாபத்தை மட்டும் கணக்கிடாமல், உங்கள் ஆரம்ப மூலதனத்தை திரும்பப் பெறுவதற்கான காலவரிசையையும் கணக்கிடுங்கள்.' },
      reflectionQuestion: { en: 'Are your investments tying up your cash forever, or returning it quickly?', ta: 'உங்கள் முதலீடுகள் உங்கள் பணத்தை நிரந்தரமாக முடக்குகிறதா அல்லது விரைவாக திருப்பித் தருகிறதா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Assets Buy Luxuries', ta: 'சொத்துக்கள் ஆடம்பரங்களை வாங்குகின்றன' },
      explanation: { en: 'The power of focus. If you want a luxury item, don\'t buy it with your hard-earned salary. Buy an asset that generates the cash flow to buy the luxury.', ta: 'கவனத்தின் சக்தி. நீங்கள் ஒரு ஆடம்பரப் பொருளை விரும்பினால், உங்களின் கடின உழைப்பால் கிடைத்த சம்பளத்தில் அதை வாங்க வேண்டாம். அந்த ஆடம்பரத்தை வாங்குவதற்கான பணப்புழக்கத்தை உருவாக்கும் ஒரு சொத்தை வாங்குங்கள்.' },
      whyItMatters: { en: 'This forces you to build wealth before enjoying the fruits of it, rather than going into debt for instant gratification.', ta: 'உடனடி திருப்திக்காக கடனில் சிக்குவதற்குப் பதிலாக, அதன் பலன்களை அனுபவிக்கும் முன் செல்வத்தை உருவாக்க இது உங்களை வற்புறுத்துகிறது.' },
      example: { en: 'Instead of buying a Porsche on credit, Kiyosaki bought a real estate property that generated enough monthly rent to pay for the Porsche.', ta: 'கடனில் போர்ஷே வாங்குவதற்குப் பதிலாக, கியோசாகி அந்த காருக்கு பணம் செலுத்த போதுமான மாத வாடகையை உருவாக்கும் ஒரு ரியல் எஸ்டேட் சொத்தை வாங்கினார்.' },
      actionStep: { en: 'Delay your next big luxury purchase until your investments can pay for it entirely.', ta: 'உங்கள் முதலீடுகள் முழுமையாக பணம் செலுத்தும் வரை உங்களின் அடுத்த பெரிய ஆடம்பரப் பொருள் வாங்குவதைத் தாமதப்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'How many of your luxuries were bought with your sweat, instead of your assets\' sweat?', ta: 'உங்கள் சொத்துக்களின் வியர்வையால் அல்லாமல், உங்கள் வியர்வையால் வாங்கப்பட்ட ஆடம்பரங்கள் எத்தனை?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'The Need for Heroes', ta: 'முன்னோடிகளின் தேவை' },
      explanation: { en: 'The power of myth. Heroes do more than simply inspire us. They make things look easy. If they can do it, so can I.', ta: 'ஹீரோக்கள் நம்மை ஊக்குவிப்பதோடு மட்டும் நிற்பதில்லை. அவர்கள் விஷயங்களை எளிதாகக் காட்டுகிறார்கள். அவர்களால் முடியும் என்றால், என்னாலும் முடியும்.' },
      whyItMatters: { en: 'Having financial heroes makes investing and building wealth seem approachable rather than impossible.', ta: 'நிதி சார்ந்த முன்னோடிகளைக் கொண்டிருப்பது முதலீடு செய்வதையும் செல்வத்தை உருவாக்குவதையும் சாத்தியமற்றது என்பதற்குப் பதிலாக அணுகக்கூடியதாகத் தோன்றும்.' },
      example: { en: 'Studying Warren Buffett\'s letters or listening to Charlie Munger to absorb their mindset.', ta: 'வாரன் பஃபெட்டின் கடிதங்களைப் படிப்பது அல்லது சார்லி முங்கரின் மனநிலையை உள்வாங்குவதற்காக அவர் சொல்வதைக் கேட்பது.' },
      actionStep: { en: 'Pick a financial hero whose path aligns with your goals and study everything they have written or said.', ta: 'உங்கள் இலக்குகளுடன் ஒத்துப் போகும் ஒரு நிதி முன்னோடியைத் தேர்ந்தெடுத்து அவர்கள் எழுதிய அல்லது சொன்ன அனைத்தையும் படியுங்கள்.' },
      reflectionQuestion: { en: 'Who are you imitating in your financial life?', ta: 'உங்கள் நிதி வாழ்க்கையில் நீங்கள் யாரைப் பின்பற்றுகிறீர்கள்?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Teach and You Shall Receive', ta: 'கற்பியுங்கள், நீங்கள் பெறுவீர்கள்' },
      explanation: { en: 'The power of giving. If you want something, you first need to give it. If you want money, give money. If you want to learn, teach.', ta: 'கொடுப்பதன் சக்தி. உங்களுக்கு ஏதேனும் வேண்டுமென்றால், முதலில் நீங்கள் அதைக் கொடுக்க வேண்டும். உங்களுக்கு பணம் வேண்டுமென்றால், பணம் கொடுங்கள். நீங்கள் கற்றுக்கொள்ள விரும்பினால், கற்பியுங்கள்.' },
      whyItMatters: { en: 'Giving opens up the universe to give back to you. Generosity is a trait of the truly wealthy.', ta: 'கொடுப்பது என்பது பிரபஞ்சம் உங்களுக்குத் திரும்பக் கொடுக்க வழி வகுக்கிறது. தாராள மனப்பான்மை என்பது உண்மையான பணக்காரர்களின் பண்பு.' },
      example: { en: 'Mentoring someone younger in business, which forces you to clarify your own thoughts and often brings unexpected new opportunities.', ta: 'வியாபாரத்தில் இளைய ஒருவருக்கு வழிகாட்டுவது, இது உங்கள் சொந்த எண்ணங்களை தெளிவுபடுத்த உங்களை வற்புறுத்துகிறது மற்றும் பெரும்பாலும் எதிர்பாராத புதிய வாய்ப்புகளைக் கொண்டுவருகிறது.' },
      actionStep: { en: 'Share a financial lesson you learned this week with a friend or family member.', ta: 'இந்த வாரம் நீங்கள் கற்றுக்கொண்ட ஒரு நிதிப் பாடத்தை நண்பர் அல்லது குடும்பத்தினருடன் பகிர்ந்து கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'What are you hoarding (knowledge, time, money) that you should be giving away?', ta: 'நீங்கள் கொடுக்க வேண்டிய எதை (அறிவு, நேரம், பணம்) பதுக்கி வைத்திருக்கிறீர்கள்?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Rich Dad Poor Dad' });
    if (existing) {
      console.log('Rich Dad Poor Dad already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Rich Dad Poor Dad' });
    }
    
    await WisdomBook.create(richDadBook);
    console.log('Rich Dad Poor Dad added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
