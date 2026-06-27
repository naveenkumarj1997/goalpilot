import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const thinkAndGrowRichBook = {
  title: 'Think and Grow Rich',
  author: 'Napoleon Hill',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg',
  categories: ['Wealth', 'Personal Development', 'Success'],
  themes: [
    { en: 'Desire', ta: 'விருப்பம்' },
    { en: 'Faith', ta: 'நம்பிக்கை' }
  ],
  overview: {
    en: 'Based on interviews with 500 of the most successful people of his time, Napoleon Hill reveals the secret to great wealth. Think and Grow Rich is the foundational text of modern self-help, proving that success begins with a specific state of mind.',
    ta: 'தமது காலத்தில் மிகவும் வெற்றிகரமான 500 நபர்களுடனான நேர்காணல்களின் அடிப்படையில், நெப்போலியன் ஹில் பெரும் செல்வத்திற்கான ரகசியத்தை வெளிப்படுத்துகிறார். திங்க் அண்ட் குரோ ரிச் என்பது நவீனச் சுய முன்னேற்றத்தின் அடிப்படை நூலாகும், இது வெற்றி ஒரு குறிப்பிட்ட மனநிலையிலிருந்து தொடங்குகிறது என்பதை நிரூபிக்கிறது.'
  },
  topQuotes: [
    { en: 'Whatever the mind of man can conceive and believe, it can achieve.', ta: 'மனித மனம் எதைச் சிந்தித்து நம்ப முடிகிறதோ, அதை அடையவும் முடியும்.' },
    { en: 'The starting point of all achievement is DESIRE. Keep this constantly in mind.', ta: 'அனைத்துச் சாதனைகளுக்கும் தொடக்கப் புள்ளி விருப்பமே. இதை எப்போதும் நினைவில் கொள்ளுங்கள்.' },
    { en: 'Every adversity, every failure, every heartbreak, carries with it the seed of an equal or greater benefit.', ta: 'ஒவ்வொரு துன்பமும், ஒவ்வொரு தோல்வியும், ஒவ்வொரு மனவேதனையும் தனக்குள் அதற்குச் சமமான அல்லது அதைவிடப் பெரிய நன்மையின் விதையைக் கொண்டுள்ளன.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'Desire: The Starting Point of All Achievement', ta: 'விருப்பம்: அனைத்துச் சாதனைகளுக்கும் தொடக்கப் புள்ளி' },
      explanation: { en: 'Wishing will not bring riches. But desiring riches with a state of mind that becomes an obsession, then planning definite ways to acquire it, and backing those plans with persistence, will yield wealth.', ta: 'ஆசைப்படுவது செல்வத்தைக் கொண்டு வராது. ஆனால் வெறித்தனமாக மாறும் மனநிலையுடன் செல்வத்தை விரும்புவது, பின்னர் அதைப் பெறுவதற்கான திட்டவட்டமான வழிகளைத் திட்டமிடுவது, மற்றும் அந்தத் திட்டங்களை விடாமுயற்சியுடன் ஆதரிப்பது செல்வத்தைத் தரும்.' },
      whyItMatters: { en: 'A weak desire brings weak results, just as a small fire makes a small amount of heat. You must want your goal as badly as a drowning person wants air.', ta: 'சிறிய நெருப்புச் சிறிய அளவிலான வெப்பத்தை உருவாக்குவது போல, பலவீனமான விருப்பம் பலவீனமான விளைவுகளையே தரும். நீரில் மூழ்கும் ஒருவருக்குக் காற்று எவ்வளவு தேவையோ அவ்வளவு தீவிரமாக உங்கள் இலக்கை நீங்கள் விரும்ப வேண்டும்.' },
      example: { en: 'Thomas Edison failed 10,000 times before inventing the lightbulb because his desire to find the solution was an absolute obsession, not just a passing interest.', ta: 'தாமஸ் எடிசன் மின்விளக்கைக் கண்டுபிடிப்பதற்கு முன்பு 10,000 முறை தோல்வியடைந்தார், ஏனெனில் தீர்வைக் கண்டறிய வேண்டும் என்ற அவரது விருப்பம் வெறுமனே கடந்துபோகும் ஆர்வம் அல்ல, அது ஒரு முழுமையான வெறியாகும்.' },
      actionStep: { en: 'Write down the exact amount of money you desire or the exact position you want. Vague goals like "I want to be rich" do not trigger the power of desire.', ta: 'நீங்கள் விரும்பும் சரியான பணத்தின் அளவை அல்லது நீங்கள் விரும்பும் சரியான நிலையை எழுதுங்கள். "நான் பணக்காரனாக வேண்டும்" போன்ற தெளிவற்ற இலக்குகள் விருப்பத்தின் சக்தியைத் தூண்டாது.' },
      reflectionQuestion: { en: 'Do you merely "hope" to succeed, or is your goal a burning obsession that occupies your mind daily?', ta: 'நீங்கள் வெற்றிபெற வெறுமனே "நம்புகிறீர்களா", அல்லது உங்களின் இலக்கு ஒவ்வொரு நாளும் உங்கள் மனதை ஆக்கிரமிக்கும் ஒரு எரியும் வெறியா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Faith: Visualization of, and Belief in Attainment of Desire', ta: 'நம்பிக்கை: விருப்பத்தை அடைவதைக் காட்சிப்படுத்துதல் மற்றும் நம்புதல்' },
      explanation: { en: 'Faith is the head chemist of the mind. When faith is blended with the vibration of thought, the subconscious mind instantly picks up the vibration and translates it into its spiritual equivalent.', ta: 'நம்பிக்கை என்பது மனதின் தலைமைக் வேதியியலாளர். நம்பிக்கையானது எண்ணத்தின் அதிர்வுடன் கலக்கும்போது, ஆழ்மனம் உடனடியாக அந்த அதிர்வை எடுத்து அதற்கான ஆன்மீகச் சமமாக மாற்றுகிறது.' },
      whyItMatters: { en: 'You cannot achieve what you secretly believe is impossible for you. Faith removes the self-imposed limitations that hold you back from taking massive action.', ta: 'உங்களுக்குச் சாத்தியமற்றது என்று நீங்கள் ரகசியமாக நம்புவதை உங்களால் அடைய முடியாது. பெரிய நடவடிக்கைகளை எடுப்பதிலிருந்து உங்களைத் தடுத்து நிறுத்தும் சுயமாக-விதிக்கப்பட்ட வரம்புகளை நம்பிக்கை நீக்குகிறது.' },
      example: { en: 'Mahatma Gandhi had no money and no army, but his absolute faith in non-violent resistance moved 200 million people to action and freed a nation.', ta: 'மகாத்மா காந்தியிடம் பணமோ ராணுவமோ இல்லை, ஆனால் அகிம்சைப் போராட்டத்தின் மீதான அவரது முழுமையான நம்பிக்கை 200 மில்லியன் மக்களைச் செயல்பட வைத்து ஒரு தேசத்தை விடுவித்தது.' },
      actionStep: { en: 'Repeat your primary goal out loud every morning and night. Demand of yourself that you actually believe it is already yours.', ta: 'ஒவ்வொரு நாள் காலையிலும் இரவிலும் உங்களின் முதன்மை இலக்கைச் சத்தமாகத் திரும்பச் சொல்லுங்கள். அது ஏற்கனவே உங்களுடையதுதான் என்று நீங்கள் உண்மையிலேயே நம்ப வேண்டும் என்று உங்களுக்கு நீங்களே கட்டளையிடுங்கள்.' },
      reflectionQuestion: { en: 'Do you secretly harbor doubts that you are "good enough" to achieve your grandest dreams?', ta: 'உங்களின் பிரம்மாண்டமான கனவுகளை அடைய நீங்கள் "போதுமான தகுதி" உடையவர் தானா என்ற சந்தேகங்களை ரகசியமாக வளர்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Auto-Suggestion: The Medium for Influencing the Subconscious Mind', ta: 'தன்-பரிந்துரை: ஆழ்மனதைச் செல்வாக்குச் செலுத்துவதற்கான ஊடகம்' },
      explanation: { en: 'Auto-suggestion is the agency of control through which an individual may voluntarily feed their subconscious mind on thoughts of a creative nature.', ta: 'தன்-பரிந்துரை (Auto-suggestion) என்பது ஒரு கட்டுப்பாட்டு முகமையாகும், இதன் மூலம் ஒரு தனிநபர் தானாகவே ஆக்கபூர்வமான தன்மை கொண்ட எண்ணங்களைத் தங்களின் ஆழ்மனதிற்கு ஊட்டுவார்.' },
      whyItMatters: { en: 'Your subconscious mind takes whatever instructions you give it. If you constantly say "I am broke," it will create situations to keep you broke. You must intentionally program it for wealth.', ta: 'நீங்கள் கொடுக்கும் எந்த அறிவுறுத்தல்களையும் உங்களின் ஆழ்மனம் எடுத்துக்கொள்கிறது. "நான் ஏழையாக இருக்கிறேன்" என்று நீங்கள் தொடர்ந்து சொன்னால், அது உங்களை ஏழையாகவே வைத்திருக்கச் சூழ்நிலைகளை உருவாக்கும். நீங்கள் வேண்டுமென்றே அதைச் செல்வத்திற்காக நிரல்படுத்த (Program) வேண்டும்.' },
      example: { en: 'Muhammad Ali constantly telling himself and the world "I am the greatest!" long before he actually was the greatest, forcing his subconscious to act like a champion.', ta: 'முகமது அலி உண்மையில் சிறந்தவராக மாறுவதற்கு நீண்ட காலத்திற்கு முன்பே தனக்கும் உலகிற்கும் "நானே சிறந்தவன்!" என்று தொடர்ந்து சொல்லிக்கொண்டு, சாம்பியனைப் போலச் செயல்படத் தன் ஆழ்மனதைக் கட்டாயப்படுத்தினார்.' },
      actionStep: { en: 'Write a one-paragraph statement of your exact goal, the price you are willing to pay for it, and the date you will achieve it. Read it aloud twice daily.', ta: 'உங்களின் சரியான இலக்கு, அதற்காக நீங்கள் கொடுக்கத் தயாராக உள்ள விலை மற்றும் அதை நீங்கள் அடையும் தேதி ஆகியவற்றைக் கொண்ட ஒரு பத்தி அறிக்கையை எழுதுங்கள். அதைத் தினமும் இருமுறை சத்தமாகப் படியுங்கள்.' },
      reflectionQuestion: { en: 'Are you passively allowing negative news and pessimistic people to program your subconscious mind?', ta: 'எதிர்மறையான செய்திகளும் அவநம்பிக்கையான மனிதர்களும் உங்கள் ஆழ்மனதை நிரல்படுத்த நீங்கள் செயலற்ற முறையில் அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Specialized Knowledge: Personal Experiences or Observations', ta: 'சிறப்பு அறிவு: தனிப்பட்ட அனுபவங்கள் அல்லது அவதானிப்புகள்' },
      explanation: { en: 'General knowledge, no matter how great in quantity or variety, is of little use in the accumulation of money. Knowledge must be organized and intelligently directed through practical plans of action.', ta: 'பொதுவான அறிவு, எவ்வளவு பெரிய அளவில் அல்லது பலவகைகளில் இருந்தாலும், பணத்தைக் குவிப்பதில் சிறிதளவே பயன்படுகிறது. அறிவு ஒழுங்கமைக்கப்பட்டு, நடைமுறைச் செயல் திட்டங்கள் மூலம் புத்திசாலித்தனமாக வழிநடத்தப்பட வேண்டும்.' },
      whyItMatters: { en: 'Schools teach general knowledge. Wealth is built by specialized knowledge—knowing exactly how to solve a specific problem better than anyone else.', ta: 'பள்ளிகள் பொது அறிவைக் கற்பிக்கின்றன. சிறப்பு அறிவால்தான் செல்வம் கட்டமைக்கப்படுகிறது—வேறு யாரையும் விட ஒரு குறிப்பிட்ட பிரச்சினையை எப்படிச் சரியாகத் தீர்ப்பது என்பதைத் தெரிந்துகொள்வது.' },
      example: { en: 'Henry Ford had very little formal education, but he surrounded himself with specialized experts (engineers, accountants) that allowed him to build a massive empire.', ta: 'ஹென்றி போர்டு மிகக் குறைவான முறையான கல்வியையே பெற்றிருந்தார், ஆனால் அவர் தன்னைச் சுற்றிச் சிறப்பு நிபுணர்களை (பொறியாளர்கள், கணக்காளர்கள்) வைத்திருந்தார், இது அவருக்கு ஒரு பெரிய பேரரசை உருவாக்க அனுமதித்தது.' },
      actionStep: { en: 'Identify the exact specialized knowledge you need to achieve your goal. If you don\'t have it, figure out how to learn it or who you can hire that has it.', ta: 'உங்கள் இலக்கை அடைய உங்களுக்குத் தேவையான சரியான சிறப்பு அறிவைக் கண்டறியவும். அது உங்களிடம் இல்லையென்றால், அதை எப்படிக் கற்றுக்கொள்வது அல்லது அதைக் கொண்டிருப்பவர்களை எப்படி வேலைக்கு அமர்த்துவது என்பதைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'Are you relying on your college degree to make you rich, rather than acquiring highly specific, market-driven skills?', ta: 'மிகவும் குறிப்பிட்ட, சந்தை-உந்துதல் திறன்களைப் பெறுவதற்குப் பதிலாக, உங்களைப் பணக்காரராக்க உங்களின் கல்லூரிப் பட்டத்தை நீங்கள் நம்பியிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Imagination: The Workshop of the Mind', ta: 'கற்பனை: மனதின் பட்டறை' },
      explanation: { en: 'Man can create anything which he can imagine. The imagination is the workshop where all plans created by man are fashioned.', ta: 'மனிதன் கற்பனை செய்யக்கூடிய எதையும் அவனால் உருவாக்க முடியும். கற்பனை என்பது மனிதனால் உருவாக்கப்படும் அனைத்துத் திட்டங்களும் வடிவமைக்கப்படும் பட்டறையாகும்.' },
      whyItMatters: { en: 'There are two forms: Synthetic Imagination (rearranging old ideas) and Creative Imagination (receiving sudden hunches/inspirations). You must exercise both to see opportunities others miss.', ta: 'இதில் இரண்டு வடிவங்கள் உள்ளன: செயற்கைக் கற்பனை (பழைய யோசனைகளை மறுசீரமைப்பது) மற்றும் ஆக்கபூர்வக் கற்பனை (திடீர் உள்ளுணர்வுகளைப் பெறுவது). மற்றவர்கள் தவறவிடும் வாய்ப்புகளைப் பார்க்க நீங்கள் இரண்டையும் பயிற்சி செய்ய வேண்டும்.' },
      example: { en: 'The creator of Coca-Cola didn\'t invent the drink; he used his synthetic imagination to buy the formula from a pharmacist and brilliantly market it to the world.', ta: 'கோகோ-கோலாவை உருவாக்கியவர் அந்தப் பானத்தைக் கண்டுபிடிக்கவில்லை; ஒரு மருந்தாளரிடமிருந்து அந்தச் சூத்திரத்தை வாங்குவதற்கும் அதை உலகிற்குச் சிறப்பாகச் சந்தைப்படுத்துவதற்கும் தனது செயற்கைக் கற்பனையைப் பயன்படுத்தினார்.' },
      actionStep: { en: 'Spend 15 minutes today with a blank piece of paper just brainstorming wild, out-of-the-box ways to overcome your current biggest obstacle.', ta: 'உங்கள் தற்போதைய மிகப்பெரிய தடையைக் கடக்கப் பைத்தியக்காரத்தனமான, பெட்டிக்கு வெளியேயான (out-of-the-box) வழிகளை மூளைச்சலவை செய்ய இன்று ஒரு வெற்றுத் தாளுடன் 15 நிமிடங்களைச் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'Has your imagination become sluggish because you spend all your time consuming other people\'s content instead of creating your own?', ta: 'உங்களுடைய சொந்த உள்ளடக்கத்தை உருவாக்குவதற்குப் பதிலாக, மற்றவர்களின் உள்ளடக்கத்தைப் பயன்படுத்துவதிலேயே உங்கள் நேரத்தையெல்லாம் செலவிடுவதால் உங்களின் கற்பனை மந்தமாகிவிட்டதா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Organized Planning: The Crystallization of Desire into Action', ta: 'ஒழுங்கமைக்கப்பட்ட திட்டமிடல்: விருப்பத்தைச் செயலாகப் படிகமாக்குதல்' },
      explanation: { en: 'Desire must be translated into practical, definite plans. If your first plan fails, replace it with a new one. Defeat only means your plan was not sound.', ta: 'விருப்பமானது நடைமுறை, திட்டவட்டமான திட்டங்களாக மொழிபெயர்க்கப்பட வேண்டும். உங்கள் முதல் திட்டம் தோல்வியடைந்தால், அதை ஒரு புதிய திட்டத்தால் மாற்றவும். தோல்வி என்பது உங்களின் திட்டம் சரியாக இல்லை என்பதை மட்டுமே குறிக்கிறது.' },
      whyItMatters: { en: 'A goal without a plan is just a wish. The most successful people in history were simply those who created superior plans and executed them relentlessly.', ta: 'திட்டமில்லாத இலக்கு ஒரு வெறும் ஆசை மட்டுமே. வரலாற்றில் மிகவும் வெற்றிகரமான மனிதர்கள் வெறுமனே சிறந்த திட்டங்களை உருவாக்கி அவற்றை இடைவிடாமல் செயல்படுத்தியவர்கள்தான்.' },
      example: { en: 'Abraham Lincoln failed in business, lost multiple elections, and suffered a nervous breakdown. He constantly adjusted his plans until he finally became President.', ta: 'ஆபிரகாம் லிங்கன் வியாபாரத்தில் தோல்வியடைந்தார், பல தேர்தல்களில் தோற்றார், நரம்புத் தளர்ச்சியால் அவதிப்பட்டார். இறுதியாக அவர் ஜனாதிபதியாகும் வரை அவர் தொடர்ந்து தனது திட்டங்களைச் சரிசெய்தார்.' },
      actionStep: { en: 'Break your big goal down into a step-by-step 30-day plan. Know exactly what you are going to do tomorrow morning to move closer to it.', ta: 'உங்களின் பெரிய இலக்கைப் படிப்படியான 30-நாள் திட்டமாகப் பிரிக்கவும். அதை நெருங்குவதற்கு நாளைக் காலை நீங்கள் என்ன செய்யப் போகிறீர்கள் என்பதைச் சரியாகத் தெரிந்துகொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'When you face a setback, do you quit your goal, or do you just realize you need a better plan?', ta: 'நீங்கள் ஒரு பின்னடைவைச் சந்திக்கும்போது, உங்கள் இலக்கைக் கைவிடுகிறீர்களா, அல்லது உங்களுக்குச் சிறந்த திட்டம் தேவை என்பதை உணர்கிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Decision: The Mastery of Procrastination', ta: 'முடிவு: தள்ளிப்போடுதலை வெல்லுதல்' },
      explanation: { en: 'Analysis of hundreds of people who accumulated fortunes disclosed that every one of them had the habit of reaching decisions promptly, and changing these decisions slowly.', ta: 'செல்வத்தைக் குவித்த நூற்றுக்கணக்கான மனிதர்களின் பகுப்பாய்வு, அவர்கள் ஒவ்வொருவருக்கும் உடனடியாக முடிவுகளை எடுக்கும் பழக்கம் இருப்பதையும், இந்த முடிவுகளை மெதுவாக மாற்றும் பழக்கம் இருப்பதையும் வெளிப்படுத்தியது.' },
      whyItMatters: { en: 'People who fail to accumulate money have the habit of reaching decisions very slowly, and changing them frequently and quickly. Indecision is a wealth killer.', ta: 'பணத்தைக் குவிக்கத் தவறியவர்கள் மிகவும் மெதுவாக முடிவுகளை எடுக்கும் பழக்கத்தையும், அவற்றை அடிக்கடி மற்றும் விரைவாக மாற்றும் பழக்கத்தையும் கொண்டுள்ளனர். முடிவெடுக்காமை என்பது செல்வத்தைக் கொல்லும் ஒரு கொலையாளி.' },
      example: { en: 'Henry Ford made the prompt decision to build the V-8 motor. His engineers said it was impossible. He said, "Produce it anyway," and refused to change his decision. He won.', ta: 'ஹென்றி போர்டு V-8 மோட்டாரை உருவாக்க உடனடி முடிவெடுத்தார். அது சாத்தியமற்றது என்று அவரது பொறியாளர்கள் கூறினர். அவர், "எப்படியாவது அதை உருவாக்குங்கள்" என்று கூறி, தனது முடிவை மாற்ற மறுத்துவிட்டார். அவர் வென்றார்.' },
      actionStep: { en: 'Identify one decision you have been putting off for weeks. Make the decision today, right now, and stick to it.', ta: 'பல வாரங்களாக நீங்கள் தள்ளிப்போடும் ஒரு முடிவைக் கண்டறியவும். இன்று, இப்போதே அந்த முடிவை எடுங்கள், அதில் உறுதியாக இருங்கள்.' },
      reflectionQuestion: { en: 'Are you easily swayed by the opinions of others, changing your mind every time someone criticizes your path?', ta: 'மற்றவர்களின் கருத்துக்களால் நீங்கள் எளிதில் திசைதிருப்பப்பட்டு, ஒவ்வொரு முறையும் யாராவது உங்கள் பாதையை விமர்சிக்கும்போது உங்கள் மனதை மாற்றிக்கொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Persistence: The Sustained Effort Necessary to Induce Faith', ta: 'விடாமுயற்சி: நம்பிக்கையைத் தூண்டத் தேவையான நீடித்த முயற்சி' },
      explanation: { en: 'The basis of persistence is the power of will. Willpower and desire, when properly combined, make an irresistible pair. Persistence is the direct antidote to failure.', ta: 'விடாமுயற்சியின் அடிப்படை விருப்பத்தின் சக்தியாகும். மன உறுதியும் விருப்பமும் சரியாக இணைக்கப்படும்போது, ஒரு தவிர்க்க முடியாத ஜோடியை உருவாக்குகின்றன. விடாமுயற்சியே தோல்விக்கான நேரடி மாற்று மருந்தாகும்.' },
      whyItMatters: { en: 'Most people are ready to throw their aims and purposes overboard and give up at the first sign of opposition or misfortune. Wealth flows only to those who refuse to quit.', ta: 'பெரும்பாலான மக்கள் எதிர்ப்பு அல்லது துரதிர்ஷ்டத்தின் முதல் அறிகுறி தெரிந்தவுடனேயே தங்களின் நோக்கங்களையும் குறிக்கோள்களையும் தூக்கி எறிந்துவிட்டுக் கைவிடத் தயாராக இருக்கிறார்கள். கைவிட மறுப்பவர்களுக்கு மட்டுமே செல்வம் பாய்கிறது.' },
      example: { en: 'A gold miner digging for months, finally quitting and selling his machinery. The new owner dug just "three feet from gold" and found a massive vein. The first man lacked persistence.', ta: 'ஒரு தங்கச் சுரங்கத் தொழிலாளி பல மாதங்களாகத் தோண்டி, இறுதியாகக் கைவிட்டுத் தனது இயந்திரங்களை விற்கிறார். புதிய உரிமையாளர் "தங்கத்திலிருந்து மூன்று அடி" தூரம் தோண்டி ஒரு பெரிய நரம்பைக் (vein) கண்டுபிடித்தார். முதல் மனிதருக்கு விடாமுயற்சி இல்லை.' },
      actionStep: { en: 'Close off all your escape routes. Tell yourself that quitting is fundamentally not an option, no matter how hard it gets.', ta: 'உங்களின் அனைத்துத் தப்பிக்கும் வழிகளையும் மூடுங்கள். எவ்வளவு கடினமாக இருந்தாலும், கைவிடுவது அடிப்படையில் ஒரு விருப்பமே இல்லை என்று உங்களுக்கு நீங்களே சொல்லிக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Do you treat temporary defeat as permanent failure?', ta: 'தற்காலிகத் தோல்வியை நிரந்தரத் தோல்வியாகக் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Power of the Master Mind: The Driving Force', ta: 'மாஸ்டர் மைண்டின் சக்தி: உந்து சக்தி' },
      explanation: { en: 'A "Master Mind" is the coordination of knowledge and effort, in a spirit of harmony, between two or more people, for the attainment of a definite purpose.', ta: 'ஒரு "மாஸ்டர் மைண்ட்" என்பது ஒரு திட்டவட்டமான நோக்கத்தை அடைவதற்காக, நல்லிணக்க உணர்வுடன், இரண்டு அல்லது அதற்கு மேற்பட்ட மனிதர்களுக்கிடையேயான அறிவு மற்றும் முயற்சியின் ஒருங்கிணைப்பு ஆகும்.' },
      whyItMatters: { en: 'No two minds ever come together without thereby creating a third, invisible intangible force, which may be likened to a third mind. You multiply your brainpower by associating with smart people.', ta: 'எந்த இரண்டு மனங்களும் மூன்றாவது, கண்ணுக்குத் தெரியாத புலனாகாத சக்தியை உருவாக்காமல் ஒன்றுசேர்வதில்லை, அது மூன்றாவது மனதுடன் ஒப்பிடப்படலாம். புத்திசாலி மனிதர்களுடன் தொடர்புகொள்வதன் மூலம் உங்கள் மூளைத் திறனைப் பெருக்குகிறீர்கள்.' },
      example: { en: 'Andrew Carnegie surrounded himself with a Master Mind group of 50 men who knew everything about manufacturing and marketing steel. Their combined brains made him the richest man in the world.', ta: 'எஃகு தயாரிப்பு மற்றும் சந்தைப்படுத்தல் பற்றி அனைத்தையும் அறிந்த 50 மனிதர்களைக் கொண்ட மாஸ்டர் மைண்ட் குழுவை ஆண்ட்ரூ கார்னகி தன்னைச் சுற்றி வைத்திருந்தார். அவர்களின் ஒருங்கிணைந்த மூளைகள் அவரை உலகின் மிகப் பெரிய பணக்காரராக ஆக்கியது.' },
      actionStep: { en: 'Form a Master Mind group. Find 2-3 ambitious people and agree to meet weekly to discuss goals, share knowledge, and hold each other accountable.', ta: 'ஒரு மாஸ்டர் மைண்ட் குழுவை உருவாக்குங்கள். 2-3 லட்சியமுள்ள மனிதர்களைக் கண்டுபிடித்து, இலக்குகளைப் பற்றி விவாதிக்கவும், அறிவைப் பகிர்ந்து கொள்ளவும், ஒருவரையொருவர் பொறுப்புக்கூற வைக்கவும் வாரந்தோறும் சந்திக்க ஒப்புக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are the people you spend the most time with dragging you down to mediocrity, or pushing you toward greatness?', ta: 'நீங்கள் அதிக நேரம் செலவிடும் மனிதர்கள் உங்களைச் சுமாரான நிலைக்குக் கீழே இழுக்கிறார்களா, அல்லது மகத்துவத்தை நோக்கித் தள்ளுகிறார்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Mystery of Sex Transmutation', ta: 'பாலியல் மாற்றத்தின் மர்மம்' },
      explanation: { en: 'Sex transmutation means the switching of the mind from thoughts of physical expression to thoughts of some other nature. It is the redirecting of the most powerful human drive into creative energy.', ta: 'பாலியல் மாற்றம் என்பது இயற்பியல் வெளிப்பாட்டின் எண்ணங்களிலிருந்து வேறு சில தன்மையின் எண்ணங்களுக்கு மனதை மாற்றுவதாகும். இது மிகவும் சக்திவாய்ந்த மனித உந்துதலை ஆக்கபூர்வமான ஆற்றலாகத் திருப்பிவிடுவதாகும்.' },
      whyItMatters: { en: 'The desire for sex is the most powerful of human desires. When this desire is harnessed and redirected toward a career or a goal, it produces immense willpower, courage, and creativity.', ta: 'பாலியல் ஆசை மனித ஆசைகளில் மிகவும் சக்தி வாய்ந்தது. இந்த ஆசை கட்டுப்படுத்தப்பட்டு, ஒரு தொழில் அல்லது இலக்கை நோக்கித் திருப்பிவிடப்படும்போது, அது அபரிமிதமான மன உறுதி, தைரியம் மற்றும் படைப்பாற்றலை உருவாக்குகிறது.' },
      example: { en: 'Many great leaders and artists achieved their greatest successes after learning to channel their intense romantic or physical passions into their life\'s work.', ta: 'பல சிறந்த தலைவர்களும் கலைஞர்களும் தங்களின் தீவிரமான காதல் அல்லது உடல்சார்ந்த உணர்ச்சிகளைத் தங்களின் வாழ்க்கை வேலையில் செலுத்துவதற்குக் கற்றுக்கொண்ட பிறகு தங்களின் மிகப்பெரிய வெற்றிகளை அடைந்தனர்.' },
      actionStep: { en: 'When you feel intense physical desire or romantic frustration, immediately sit down and channel that exact intense energy into doing deep, creative work on your biggest goal.', ta: 'நீங்கள் தீவிரமான உடல்சார்ந்த ஆசை அல்லது காதல் விரக்தியை உணரும்போது, உடனடியாக உட்கார்ந்து உங்களின் மிகப்பெரிய இலக்கில் ஆழமான, ஆக்கபூர்வமான வேலையைச் செய்ய அந்தச் சரியான தீவிர ஆற்றலைச் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you wasting your most potent biological energy on temporary physical gratification rather than building a lasting legacy?', ta: 'ஒரு நீடித்த மரபை உருவாக்குவதற்குப் பதிலாக, உங்களின் மிகவும் சக்திவாய்ந்த உயிரியல் ஆற்றலைத் தற்காலிக உடல்சார்ந்த திருப்திக்காக வீணாக்குகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'The Subconscious Mind: The Connecting Link', ta: 'ஆழ்மனம்: இணைக்கும் இணைப்பு' },
      explanation: { en: 'The subconscious mind consists of a field of consciousness in which every impulse of thought that reaches the objective mind through any of the five senses is classified and recorded.', ta: 'ஆழ்மனம் என்பது ஐந்து புலன்களில் ஏதேனும் ஒன்றின் மூலம் புறநிலை மனதை அடையும் ஒவ்வொரு எண்ணத் தூண்டலும் வகைப்படுத்தப்பட்டுப் பதிவுசெய்யப்படும் ஒரு நனவுப் புலத்தைக் கொண்டுள்ளது.' },
      whyItMatters: { en: 'You cannot entirely control your subconscious, but you can voluntarily hand over any plan, desire, or purpose which you wish transformed into concrete form. It works day and night.', ta: 'உங்கள் ஆழ்மனதை உங்களால் முழுமையாகக் கட்டுப்படுத்த முடியாது, ஆனால் கான்கிரீட் வடிவமாக மாற்ற நீங்கள் விரும்பும் எந்தவொரு திட்டத்தையும், ஆசையையும் அல்லது நோக்கத்தையும் உங்களால் விருப்பத்துடன் ஒப்படைக்க முடியும். அது இரவும் பகலும் வேலை செய்கிறது.' },
      example: { en: 'Going to sleep deeply focused on a problem, only to wake up in the middle of the night with the exact solution seemingly dropped into your mind by a higher power.', ta: 'ஒரு பிரச்சினையில் ஆழமாகக் கவனம் செலுத்தித் தூங்கச் செல்வது, ஆனால் நள்ளிரவில் விழித்தெழுந்து அதற்கான சரியான தீர்வு உயர்சக்தியால் உங்கள் மனதில் விடப்பட்டிருப்பதை உணர்வது.' },
      actionStep: { en: 'Never go to sleep feeling fearful or defeated. Feed your subconscious mind a clear, positive image of your desired future in the 5 minutes before you fall asleep.', ta: 'ஒருபோதும் பயத்தோடோ அல்லது தோற்றுவிட்டதாக உணர்ந்தோ தூங்கச் செல்ல வேண்டாம். நீங்கள் தூங்குவதற்கு முன் 5 நிமிடங்களில் உங்களின் ஆழ்மனதிற்கு நீங்கள் விரும்பும் எதிர்காலத்தின் தெளிவான, நேர்மறையான பிம்பத்தை ஊட்டுங்கள்.' },
      reflectionQuestion: { en: 'Are you polluting your subconscious mind by watching horrific news or arguing angrily right before bed?', ta: 'தூங்குவதற்கு சற்று முன்பு கொடூரமான செய்திகளைப் பார்ப்பதன் மூலமோ அல்லது கோபமாக வாதிடுவதன் மூலமோ உங்கள் ஆழ்மனதை மாசுபடுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The Brain: A Broadcasting and Receiving Station for Thought', ta: 'மூளை: எண்ணங்களுக்கான ஒலிபரப்பு மற்றும் பெறும் நிலையம்' },
      explanation: { en: 'Through the medium of the ether, every human brain is both a broadcasting and receiving station for the vibration of thought.', ta: 'ஈதரின் (Ether) ஊடகத்தின் மூலம், ஒவ்வொரு மனித மூளையும் எண்ணத்தின் அதிர்வுக்கான ஒலிபரப்பு மற்றும் பெறும் நிலையமாகும்.' },
      whyItMatters: { en: 'When your mind is vibrating at a high rate (stimulated by emotion, desire, or faith), it can pick up the thoughts and ideas broadcast by other minds. This is the source of "hunches."', ta: 'உங்கள் மனம் அதிக விகிதத்தில் அதிர்வுறும்போது (உணர்ச்சி, ஆசை அல்லது நம்பிக்கையால் தூண்டப்படும்போது), மற்ற மனங்களால் ஒலிபரப்பப்படும் எண்ணங்களையும் யோசனைகளையும் அதால் எடுத்துக்கொள்ள முடியும். இதுவே "உள்ளுணர்வுகளின்" மூலமாகும்.' },
      example: { en: 'When two people who are deeply connected say the exact same sentence at the same time; their brains were operating on the same frequency.', ta: 'ஆழமாக இணைக்கப்பட்டுள்ள இருவர் ஒரே நேரத்தில் அதே வாக்கியத்தைச் சொல்வது; அவர்களின் மூளைகள் ஒரே அலைவரிசையில் இயங்கின.' },
      actionStep: { en: 'To increase the "receptivity" of your brain, learn to step away from noise. Take silent walks without headphones to allow your brain to "receive" new ideas.', ta: 'உங்கள் மூளையின் "கிரகிக்கும் தன்மையை" அதிகரிக்க, சத்தத்திலிருந்து விலகிச் செல்லக் கற்றுக்கொள்ளுங்கள். உங்கள் மூளை புதிய யோசனைகளை "பெற" அனுமதிக்க, ஹெட்ஃபோன்கள் இல்லாமல் அமைதியாக நடக்கவும்.' },
      reflectionQuestion: { en: 'Is your brain operating on a low frequency of fear and poverty, thereby only attracting similar thoughts?', ta: 'உங்கள் மூளை பயம் மற்றும் வறுமையின் குறைந்த அலைவரிசையில் இயங்குகிறதா, அதன் மூலம் அது போன்ற எண்ணங்களை மட்டுமே ஈர்க்கிறதா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'The Sixth Sense: The Door to the Temple of Wisdom', ta: 'ஆறாவது அறிவு: ஞானக் கோயிலின் கதவு' },
      explanation: { en: 'The sixth sense is that portion of the subconscious mind referred to as the Creative Imagination. It is through this that Infinite Intelligence communicates voluntarily.', ta: 'ஆறாவது அறிவு என்பது ஆக்கபூர்வமான கற்பனை என்று குறிப்பிடப்படும் ஆழ்மனதின் பகுதியாகும். இதன் மூலமே எல்லையற்ற நுண்ணறிவு தானாகத் தொடர்புகொள்கிறது.' },
      whyItMatters: { en: 'You cannot force the sixth sense. It comes only as you master the other 12 principles in the book. It acts as a guardian angel, warning you of impending dangers and notifying you of opportunities.', ta: 'ஆறாவது அறிவை உங்களால் கட்டாயப்படுத்த முடியாது. புத்தகத்தில் உள்ள மற்ற 12 கொள்கைகளை நீங்கள் மாஸ்டர் செய்யும்போது மட்டுமே அது வருகிறது. இது ஒரு பாதுகாவலர் தேவதையாகச் செயல்படுகிறது, வரவிருக்கும் ஆபத்துக்களைப் பற்றி உங்களை எச்சரிக்கிறது மற்றும் வாய்ப்புகளைப் பற்றி உங்களுக்கு அறிவிக்கிறது.' },
      example: { en: 'An entrepreneur getting a sudden, inexplicable "bad feeling" about a highly lucrative deal, backing out, and later finding out the partners were running a massive fraud.', ta: 'ஒரு தொழில்முனைவோர் அதிக லாபம் தரும் ஒப்பந்தத்தைப் பற்றி திடீரென்று, விவரிக்க முடியாத "கெட்ட உணர்வைப்" பெறுவது, பின்வாங்குவது மற்றும் அந்தப் கூட்டாளர்கள் ஒரு பெரிய மோசடியை நடத்துவதை பின்னர் கண்டுபிடிப்பது.' },
      actionStep: { en: 'When you get a strong, sudden "gut feeling" to take action or avoid something, do not ignore it. Write it down and analyze it. Learn to trust your intuition.', ta: 'செயல்படவோ அல்லது ஏதேனும் ஒன்றைத் தவிர்க்கவோ உங்களுக்கு வலுவான, திடீர் "உள்ளுணர்வு" கிடைக்கும்போது, அதைப் புறக்கணிக்காதீர்கள். அதை எழுதிப் பகுப்பாய்வு செய்யுங்கள். உங்கள் உள்ளுணர்வை நம்பக் கற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Have you been trying to solve all your problems purely with cold logic, entirely ignoring the quiet voice of your intuition?', ta: 'உங்கள் உள்ளுணர்வின் அமைதியான குரலை முற்றிலுமாகப் புறக்கணித்துவிட்டு, உங்கள் பிரச்சினைகள் அனைத்தையும் தூய தர்க்கரீதியாக மட்டுமே தீர்க்க முயற்சிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Outwitting the Six Ghosts of Fear', ta: 'ஆறு பயப் பேய்களை விஞ்சுதல்' },
      explanation: { en: 'Before you can put any philosophy of success into use, you must conquer the six basic fears: Poverty, Criticism, Ill Health, Loss of Love, Old Age, and Death.', ta: 'வெற்றியின் எந்தவொரு தத்துவத்தையும் நீங்கள் பயன்படுத்துவதற்கு முன்பு, நீங்கள் ஆறு அடிப்படைப் பயங்களை வெல்ல வேண்டும்: வறுமை, விமர்சனம், மோசமான உடல்நலம், காதலை இழப்பது, முதுமை மற்றும் மரணம்.' },
      whyItMatters: { en: 'Fear is just a state of mind, but it is paralyzing. You cannot desire wealth and fear poverty at the same time. The mind can only hold one dominant thought.', ta: 'பயம் என்பது ஒரு மனநிலை மட்டுமே, ஆனால் அது முடக்குகிறது. நீங்கள் ஒரே நேரத்தில் செல்வத்தை விரும்பவும் வறுமைக்குப் பயப்படவும் முடியாது. மனதிற்குள் ஒரு மேலாதிக்க எண்ணத்தை மட்டுமே வைத்திருக்க முடியும்.' },
      example: { en: 'Someone abandoning their dream of starting a business because they are terrified of what their family and friends will say if they fail (Fear of Criticism).', ta: 'தாங்கள் தோற்றால் தங்களின் குடும்பத்தினரும் நண்பர்களும் என்ன சொல்வார்களோ என்று அஞ்சி, தொழில் தொடங்கும் தங்களின் கனவைக் கைவிடுவது (விமர்சனத்தின் மீதான பயம்).' },
      actionStep: { en: 'Identify which of the six fears is currently holding you back the most. Write down the absolute worst-case scenario. Accept it, and move forward anyway.', ta: 'ஆறு பயங்களில் எது தற்போது உங்களை அதிகம் தடுத்து நிறுத்துகிறது என்பதைக் கண்டறியவும். முழுமையான மோசமான-சூழ்நிலையை எழுதுங்கள். அதை ஏற்றுக்கொண்டு, எப்படியும் முன்னேறிச் செல்லுங்கள்.' },
      reflectionQuestion: { en: 'Are you letting the fear of criticism from people who haven\'t achieved anything dictate how you live your life?', ta: 'எதையும் சாதிக்காத மனிதர்களின் விமர்சனத்திற்குப் பயந்து, நீங்கள் எப்படி வாழ வேண்டும் என்பதைத் தீர்மானிக்க அவர்களை அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'The Devil\'s Workshop: Susceptibility to Negative Influences', ta: 'பிசாசின் பட்டறை: எதிர்மறைத் தாக்கங்களுக்கு எளிதில் பாதிக்கப்படுதல்' },
      explanation: { en: 'In addition to the six basic fears, you must protect yourself against the negative influences of others. Misery loves company.', ta: 'ஆறு அடிப்படைப் பயங்களுக்கு மேலதிகமாக, மற்றவர்களின் எதிர்மறைத் தாக்கங்களிலிருந்து உங்களை நீங்களே பாதுகாத்துக் கொள்ள வேண்டும். துயரம் துணையை விரும்புகிறது.' },
      whyItMatters: { en: 'If you allow pessimistic, complaining, or cynical people to pour their negativity into your mind, they will extinguish your burning desire and destroy your faith.', ta: 'நம்பிக்கையற்ற, குறை கூறுகிற, அல்லது இகழ்ச்சியான மனிதர்கள் தங்களின் எதிர்மறைத்தன்மையை உங்கள் மனதில் ஊற்ற நீங்கள் அனுமதித்தால், அவர்கள் உங்களின் எரியும் ஆசையை அணைத்து, உங்களின் நம்பிக்கையை அழித்துவிடுவார்கள்.' },
      example: { en: 'A person gets a great idea for a product, excitedly tells a cynical friend, and the friend immediately lists 10 reasons it will fail. The person gives up without even trying.', ta: 'ஒரு நபர் ஒரு தயாரிப்புக்கான சிறந்த யோசனையைப் பெறுகிறார், உற்சாகமாக ஒரு இகழ்ச்சியான நண்பரிடம் கூறுகிறார், அந்த நண்பர் அது தோல்வியடைவதற்கான 10 காரணங்களை உடனடியாகப் பட்டியலிடுகிறார். அந்த நபர் முயற்சி செய்யாமலேயே விட்டுவிடுகிறார்.' },
      actionStep: { en: 'Build a mental "firewall." When someone starts complaining or telling you why your goal is impossible, physically walk away or politely change the subject.', ta: 'ஒரு மன "ஃபயர்வால்" (firewall) உருவாக்குங்கள். யாராவது குறை கூறத் தொடங்கினால் அல்லது உங்கள் இலக்கு ஏன் சாத்தியமற்றது என்று உங்களிடம் கூறினால், শারীরিকভাবে அங்கிருந்து விலகிச் செல்லுங்கள் அல்லது கண்ணியமாகப் பாடத்தை மாற்றுங்கள்.' },
      reflectionQuestion: { en: 'Are you keeping toxic people in your life out of a sense of obligation, sacrificing your own mental environment in the process?', ta: 'அந்தச் செயல்முறையில் உங்களின் சொந்த மனச் சூழலைத் தியாகம் செய்து, கடமை உணர்வின் காரணமாக நச்சுத்தன்மையான மனிதர்களை உங்கள் வாழ்க்கையில் வைத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'The Importance of Definiteness of Purpose', ta: 'நோக்கத்தின் திட்டவட்டத்தின் முக்கியத்துவம்' },
      explanation: { en: 'You must know exactly what you want. Generalities are the enemy of success. A definite purpose creates a track for your mind to run on.', ta: 'உங்களுக்குச் சரியாக என்ன வேண்டும் என்பதை நீங்கள் அறிந்திருக்க வேண்டும். பொதுமைப்படுத்துதல் வெற்றியின் எதிரியாகும். ஒரு திட்டவட்டமான நோக்கம் உங்கள் மனம் ஓடுவதற்கான ஒரு பாதையை உருவாக்குகிறது.' },
      whyItMatters: { en: 'A ship without a destination will just drift and eventually sink or crash. Without a definite purpose, you will drift through life reacting to whatever happens to you.', ta: 'இலக்கு இல்லாத கப்பல் வெறுமனே மிதந்து, இறுதியில் மூழ்கிவிடும் அல்லது மோதிவிடும். திட்டவட்டமான நோக்கம் இல்லாமல், உங்களுக்கு நடக்கும் எதற்கும் எதிர்வினையாற்றி வாழ்க்கையில் நீங்கள் மிதப்பீர்கள்.' },
      example: { en: 'Instead of "I want to help people," stating "I will build a software company that provides clean water logistics to 1 million people by 2030." This provides a clear direction.', ta: '"நான் மனிதர்களுக்கு உதவ விரும்புகிறேன்" என்பதற்குப் பதிலாக, "2030-ஆம் ஆண்டிற்குள் 1 மில்லியன் மக்களுக்குச் சுத்தமான நீர் தளவாடங்களை வழங்கும் மென்பொருள் நிறுவனத்தை நான் உருவாக்குவேன்" என்று கூறுவது. இது ஒரு தெளிவான திசையை வழங்குகிறது.' },
      actionStep: { en: 'Write down your Major Definite Purpose in one clear sentence. It must be specific, measurable, and have a deadline.', ta: 'உங்களின் முக்கியத் திட்டவட்டமான நோக்கத்தை ஒரு தெளிவான வாக்கியத்தில் எழுதுங்கள். அது குறிப்பிட்டதாக, அளவிடக்கூடியதாக மற்றும் ஒரு காலக்கெடுவைக் கொண்டிருக்க வேண்டும்.' },
      reflectionQuestion: { en: 'Are you currently a "drifter," letting the winds of circumstance blow your life wherever they please?', ta: 'நீங்கள் தற்போது ஒரு "நாடோடியாக" இருக்கிறீர்களா, சூழ்நிலையின் காற்று உங்களின் வாழ்க்கையை அவர்கள் விரும்பும் இடத்திற்கு வீச அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'The Subconscious Speaks in Emotion', ta: 'ஆழ்மனம் உணர்ச்சியில் பேசுகிறது' },
      explanation: { en: 'The subconscious mind does not understand dry logic or words alone. It only responds to thoughts that have been well mixed with feeling or emotion.', ta: 'ஆழ்மனம் வறண்ட தர்க்கத்தையோ அல்லது வார்த்தைகளையோ மட்டும் புரிந்துகொள்வதில்லை. உணர்வு அல்லது உணர்ச்சிகளுடன் நன்றாகக் கலந்த எண்ணங்களுக்கு மட்டுமே அது பதிலளிக்கிறது.' },
      whyItMatters: { en: 'Saying affirmations like a robot will do absolutely nothing. You must *feel* the joy, the excitement, and the reality of your goal as you state it.', ta: 'ஒரு ரோபோவைப் போல உறுதிமொழிகளைக் கூறுவது முற்றிலும் எதையும் செய்யாது. உங்களின் இலக்கைக் கூறும்போது அதன் மகிழ்ச்சியையும், உற்சாகத்தையும், யதார்த்தத்தையும் நீங்கள் *உணர* வேண்டும்.' },
      example: { en: 'An athlete visualizing winning a gold medal doesn\'t just see the medal; they feel the heavy weight of it on their neck, hear the crowd roaring, and feel tears of joy.', ta: 'தங்கப் பதக்கம் வெல்வதைக் காட்சிப்படுத்தும் ஒரு தடகள வீரர் பதக்கத்தை மட்டும் பார்ப்பதில்லை; அவர்கள் தங்களின் கழுத்தில் அதன் பெரும் எடையை உணர்கிறார்கள், கூட்டம் கர்ஜிப்பதைக் கேட்கிறார்கள், மற்றும் மகிழ்ச்சிக் கண்ணீரை உணர்கிறார்கள்.' },
      actionStep: { en: 'When you visualize your goal today, engage your senses. What does it smell like? What does it feel like? Force yourself to feel the emotion of having already achieved it.', ta: 'இன்று உங்கள் இலக்கைக் காட்சிப்படுத்தும்போது, உங்கள் புலன்களை ஈடுபடுத்துங்கள். அது எப்படி மணக்கிறது? அது எப்படி உணர்கிறது? அதை ஏற்கனவே அடைந்துவிட்ட உணர்வை உணர உங்களை நீங்களே கட்டாயப்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'When you think about your goals, do you feel an intense emotional thrill, or just a dry sense of obligation?', ta: 'உங்கள் இலக்குகளைப் பற்றி நீங்கள் சிந்திக்கும்போது, நீங்கள் தீவிரமான உணர்ச்சிகரமான சிலிர்ப்பை உணர்கிறீர்களா, அல்லது வெறும் வறண்ட கடமை உணர்வா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Failure is a Trickster', ta: 'தோல்வி ஒரு ஏமாற்றுக்காரன்' },
      explanation: { en: 'Failure is nature\'s plan to prepare you for great responsibilities. It is a trickster with a keen sense of irony and cunning. It takes great delight in tripping one when success is almost within reach.', ta: 'தோல்வி என்பது பெரிய பொறுப்புகளுக்கு உங்களைத் தயார்படுத்தும் இயற்கையின் திட்டமாகும். இது முரண்பாடும் தந்திரமும் கொண்ட ஒரு ஏமாற்றுக்காரன். வெற்றி கிட்டதட்ட எட்டும் தூரத்தில் இருக்கும்போது ஒருவரைத் தடுமாறச் செய்வதில் அது மிகுந்த மகிழ்ச்சி அடைகிறது.' },
      whyItMatters: { en: 'When defeat overtakes a person, the easiest and most logical thing to do is to quit. But success is often exactly one step beyond the point of your greatest defeat.', ta: 'ஒரு நபரைத் தோல்வி முந்தும்போது, செய்ய வேண்டிய எளிதான மற்றும் தர்க்கரீதியான விஷயம் கைவிடுவதாகும். ஆனால் வெற்றி என்பது பெரும்பாலும் உங்களின் மிகப்பெரிய தோல்வியின் புள்ளிக்குச் சரியாக ஒரு படி அப்பால் உள்ளது.' },
      example: { en: 'Henry Ford\'s first two automobile companies went bankrupt and left him broke. If he had quit there, the Ford Motor Company would never have existed.', ta: 'ஹென்றி போர்டின் முதல் இரண்டு ஆட்டோமொபைல் நிறுவனங்கள் திவாலாகி அவரை ஏழையாக்கின. அவர் அங்கேயே கைவிட்டிருந்தால், போர்டு மோட்டார் நிறுவனம் (Ford Motor Company) இருந்திருக்காது.' },
      actionStep: { en: 'Look at a recent "failure" in your life. Write down three specific, valuable lessons you learned from it that you could not have learned if you succeeded.', ta: 'உங்கள் வாழ்க்கையில் சமீபத்தில் நடந்த ஒரு "தோல்வியைப்" பாருங்கள். நீங்கள் வெற்றிபெற்றிருந்தால் கற்றுக்கொண்டிருக்க முடியாத, அதிலிருந்து நீங்கள் கற்றுக்கொண்ட மூன்று குறிப்பிட்ட, மதிப்புமிக்கப் பாடங்களை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Are you allowing a temporary defeat to convince you that your entire plan is flawed?', ta: 'ஒரு தற்காலிகத் தோல்வி, உங்களின் முழுத் திட்டமும் குறைபாடுடையது என்று உங்களை நம்பவைக்க நீங்கள் அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'The Mystery of Personal Magnetism', ta: 'தனிப்பட்ட காந்தத்தின் மர்மம்' },
      explanation: { en: 'A person whose mind is saturated with a burning desire and absolute faith develops a "personal magnetism" that attracts other people and opportunities to them.', ta: 'எரியும் ஆசை மற்றும் முழுமையான நம்பிக்கையுடன் மனம் நிரம்பிய ஒரு நபர், மற்ற மனிதர்களையும் வாய்ப்புகளையும் தன்பால் ஈர்க்கும் "தனிப்பட்ட காந்தத்தை" வளர்த்துக் கொள்கிறார்.' },
      whyItMatters: { en: 'People are unconsciously drawn to those who know exactly where they are going. This magnetism makes selling, leading, and negotiating infinitely easier.', ta: 'தாங்கள் எங்குச் செல்கிறோம் என்று சரியாகத் தெரிந்தவர்களிடம் மனிதர்கள் தங்களை அறியாமலேயே ஈர்க்கப்படுகிறார்கள். இந்தக் காந்தத்தன்மை விற்பனை செய்வதையும், வழிநடத்துவதையும், பேச்சுவார்த்தை நடத்துவதையும் முடிவில்லாமல் எளிதாக்குகிறது.' },
      example: { en: 'Steve Jobs\' "Reality Distortion Field." His belief in his vision was so absolute that he could convince engineers to do the impossible just by speaking to them.', ta: 'ஸ்டீவ் ஜாப்ஸின் "யதார்த்தத்தைத் திரிக்கும் புலம்" (Reality Distortion Field). தனது பார்வையின் மீதான அவரது நம்பிக்கை மிகவும் முழுமையானதாக இருந்தது, அவர் பொறியாளர்களிடம் பேசுவதன் மூலமே சாத்தியமற்றதைச் செய்ய அவர்களை நம்பவைக்க முடிந்தது.' },
      actionStep: { en: 'Before your next meeting or presentation, spend 2 minutes visualizing a successful outcome and pumping yourself full of absolute conviction. Watch how people respond to your energy.', ta: 'உங்களின் அடுத்தச் சந்திப்பு அல்லது விளக்கக்காட்சிக்கு முன், வெற்றிகரமான முடிவைக் காட்சிப்படுத்த 2 நிமிடங்கள் செலவிடுங்கள் மற்றும் முழுமையான நம்பிக்கையுடன் உங்களை நிரப்புங்கள். உங்களின் ஆற்றலுக்கு மனிதர்கள் எவ்வாறு பதிலளிக்கிறார்கள் என்று பாருங்கள்.' },
      reflectionQuestion: { en: 'Are you approaching opportunities with desperate, needy energy, which repels people, instead of confident magnetism?', ta: 'நம்பிக்கையான காந்தத்திற்குப் பதிலாக, மனிதர்களை விரட்டும் அவநம்பிக்கையான, தேவையுள்ள ஆற்றலுடன் வாய்ப்புகளை நீங்கள் அணுகுகிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Alibis are the Enemy', ta: 'சாக்குப்போக்குகளே எதிரி' },
      explanation: { en: 'People who do not succeed have one distinguishing trait in common: they know all the reasons for failure, and have what they believe to be airtight alibis to explain away their lack of achievement.', ta: 'வெற்றிபெறாத மனிதர்களுக்கு ஒரு பொதுவான பண்பு உள்ளது: தோல்விக்கான எல்லாக் காரணங்களும் அவர்களுக்குத் தெரியும், மேலும் தங்களின் சாதனை இன்மையை விளக்கத் தங்களுக்குள் காற்றுகூடப் புகமுடியாத சாக்குப்போக்குகள் இருப்பதாக அவர்கள் நம்புகிறார்கள்.' },
      whyItMatters: { en: 'Building alibis (excuses) is a deeply rooted habit. It is fatal to success because it removes your agency. If it\'s "the economy\'s fault," you don\'t have to try to improve yourself.', ta: 'சாக்குப்போக்குகளை உருவாக்குவது ஆழமாக வேரூன்றிய பழக்கமாகும். இது உங்கள் முகவாண்மையை (Agency) நீக்குவதால் இது வெற்றிக்கு ஆபத்தானது. "பொருளாதாரத்தின் தவறு" என்றால், உங்களை மேம்படுத்திக்கொள்ள நீங்கள் முயற்சிக்க வேண்டியதில்லை.' },
      example: { en: '"If only I had money," "If only I had a better education," "If only my boss liked me." These are fatal alibis. Successful people say, "Despite not having money, I will figure it out."', ta: '"என்னிடம் மட்டும் பணம் இருந்திருந்தால்", "எனக்கு மட்டும் ஒரு சிறந்த கல்வி இருந்திருந்தால்", "என் முதலாளிக்கு மட்டும் என்னைப் பிடித்திருந்தால்." இவை ஆபத்தான சாக்குப்போக்குகள். வெற்றிபெற்ற மனிதர்கள் சொல்வார்கள், "பணம் இல்லை என்றாலும், நான் அதைக் கண்டுபிடிப்பேன்."' },
      actionStep: { en: 'Identify your favorite "If only..." alibi. Cross it out and replace it with "How can I succeed despite..."', ta: 'உங்களுக்குப் பிடித்தமான "அது மட்டும் இருந்திருந்தால்..." என்ற சாக்குப்போக்கைக் கண்டறியவும். அதைக் குறுக்கே அடித்துவிட்டு, "...இருந்தாலும் நான் எப்படி வெற்றி பெற முடியும்" என்று மாற்றவும்.' },
      reflectionQuestion: { en: 'Are you using your past disadvantages as a comfortable shield to protect you from the hard work required to succeed today?', ta: 'இன்று வெற்றிபெறத் தேவையான கடின உழைப்பிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ள உங்களின் கடந்த காலக் குறைபாடுகளை வசதியான கேடயமாகப் பயன்படுத்துகிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Think and Grow Rich' });
    if (existing) {
      console.log('Think and Grow Rich already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Think and Grow Rich' });
    }
    
    await WisdomBook.create(thinkAndGrowRichBook);
    console.log('Think and Grow Rich added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
