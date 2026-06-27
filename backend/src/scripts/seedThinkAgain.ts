import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const thinkAgainBook = {
  title: 'Think Again: The Power of Knowing What You Don\'t Know',
  author: 'Adam Grant',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781984878106-L.jpg',
  categories: ['Psychology', 'Self-Help', 'Business'],
  themes: [
    { en: 'Mental Flexibility', ta: 'மன நெகிழ்வுத்தன்மை' },
    { en: 'Unlearning', ta: 'கற்றதை மறத்தல்' }
  ],
  overview: {
    en: 'In a rapidly changing world, the ability to rethink and unlearn is more critical than the ability to think and learn. Adam Grant explores how we can embrace the joy of being wrong and encourage others to rethink their positions.',
    ta: 'வேகமாக மாறிவரும் உலகில், சிந்திக்கும் மற்றும் கற்கும் திறனை விட, மறுபரிசீலனை செய்யும் மற்றும் கற்றதை மறக்கும் திறன் மிகவும் முக்கியமானது. தவறு செய்வதன் மகிழ்ச்சியை நாம் எவ்வாறு தழுவிக்கொள்வது மற்றும் மற்றவர்களை அவர்களின் நிலைப்பாடுகளை மறுபரிசீலனை செய்ய எவ்வாறு ஊக்குவிப்பது என்பதை ஆடம் கிராண்ட் ஆராய்கிறார்.'
  },
  topQuotes: [
    { en: 'Intelligence is traditionally viewed as the ability to think and learn. Yet in a turbulent world, there\'s another set of cognitive skills that might matter more: the ability to rethink and unlearn.', ta: 'புத்திசாலித்தனம் பாரம்பரியமாகச் சிந்திக்கும் மற்றும் கற்கும் திறனாகப் பார்க்கப்படுகிறது. ஆயினும் ஒரு கொந்தளிப்பான உலகில், இன்னும் முக்கியமானதாக இருக்கக்கூடிய மற்றொரு அறிவாற்றல் திறன்களின் தொகுப்பு உள்ளது: மறுபரிசீலனை செய்யும் மற்றும் கற்றதை மறக்கும் திறன்.' },
    { en: 'If knowledge is power, knowing what we don\'t know is wisdom.', ta: 'அறிவு அதிகாரமாக இருந்தால், நமக்குத் தெரியாததைத் தெரிந்துகொள்வது ஞானமாகும்.' },
    { en: 'Arrogance is ignorance plus conviction. Humility is a permeable filter that absorbs life experience and converts it into knowledge and wisdom.', ta: 'அகந்தை என்பது அறியாமை கூட்டல் நம்பிக்கை. பணிவு என்பது வாழ்க்கை அனுபவத்தை உள்வாங்கி, அதை அறிவாகவும் ஞானமாகவும் மாற்றும் ஒரு ஊடுருவக்கூடிய வடிகட்டியாகும்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Preacher, Prosecutor, and Politician', ta: 'போதகர், வழக்கறிஞர் மற்றும் அரசியல்வாதி' },
      explanation: { en: 'Under pressure, we slip into three modes: Preachers (defending our sacred beliefs), Prosecutors (attacking others\' flaws), and Politicians (seeking approval). None of these modes help us discover the truth.', ta: 'அழுத்தத்தின் கீழ், நாம் மூன்று முறைகளில் நழுவுகிறோம்: போதகர்கள் (நமது புனிதமான நம்பிக்கைகளைப் பாதுகாப்பது), வழக்கறிஞர்கள் (மற்றவர்களின் குறைகளைத் தாக்குவது) மற்றும் அரசியல்வாதிகள் (அங்கீகாரம் தேடுவது). இந்த முறைகள் எதுவும் உண்மையைக் கண்டறிய நமக்கு உதவாது.' },
      whyItMatters: { en: 'When you are a preacher or prosecutor, your mind is closed. When you are a politician, you just say what others want to hear. True learning requires stepping out of these roles.', ta: 'நீங்கள் ஒரு போதகராகவோ அல்லது வழக்கறிஞராகவோ இருக்கும்போது, உங்கள் மனம் மூடிக்கொள்கிறது. நீங்கள் ஒரு அரசியல்வாதியாக இருக்கும்போது, மற்றவர்கள் கேட்க விரும்புவதை மட்டுமே நீங்கள் சொல்கிறீர்கள். உண்மையான கற்றலுக்கு இந்தப் பாத்திரங்களிலிருந்து வெளியேறுவது அவசியம்.' },
      example: { en: 'Arguing fiercely on the internet to prove someone wrong (Prosecutor) instead of trying to understand why they hold that belief.', ta: 'ஒருவர் ஏன் அந்த நம்பிக்கையைக் கொண்டிருக்கிறார் என்பதைப் புரிந்து கொள்ள முயற்சிப்பதற்குப் பதிலாக, அவர் தவறு என்பதை நிரூபிக்க இணையத்தில் கடுமையாக வாதிடுவது (வழக்கறிஞர்).' },
      actionStep: { en: 'Catch yourself the next time you try to "win" an argument. Stop acting like a prosecutor and start acting like a curious scientist.', ta: 'அடுத்த முறை நீங்கள் ஒரு விவாதத்தில் "வெற்றி பெற" முயற்சிக்கும் போது உங்களைப் பிடித்துக் கொள்ளுங்கள். வழக்கறிஞரைப் போலச் செயல்படுவதை நிறுத்திவிட்டு, ஆர்வமுள்ள விஞ்ஞானியைப் போலச் செயல்படத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'Which of the three modes do you default to most often when someone challenges your ideas?', ta: 'யாராவது உங்கள் யோசனைகளுக்கு சவால் விடும்போது, மூன்று முறைகளில் எதற்கு நீங்கள் அடிக்கடி இயல்பாகச் செல்கிறீர்கள்?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Think Like a Scientist', ta: 'ஒரு விஞ்ஞானியைப் போலச் சிந்தியுங்கள்' },
      explanation: { en: 'Scientists don\'t let their ideas become their identity. They form hypotheses, test them with data, and are thrilled when they are proven wrong because it means they learned something new.', ta: 'விஞ்ஞானிகள் தங்கள் யோசனைகளைத் தங்களின் அடையாளமாக மாற அனுமதிப்பதில்லை. அவர்கள் கருதுகோள்களை உருவாக்குகிறார்கள், அவற்றைச் தரவுகளுடன் சோதிக்கிறார்கள், மேலும் அவை தவறானவை என்று நிரூபிக்கப்படும்போது மகிழ்ச்சியடைகிறார்கள், ஏனெனில் அவர்கள் புதிதாக ஒன்றைக் கற்றுக்கொண்டார்கள் என்று அதற்கர்த்தம்.' },
      whyItMatters: { en: 'If your belief is a hypothesis rather than a hard fact, you won\'t feel personally attacked when someone provides evidence against it.', ta: 'உங்களின் நம்பிக்கை ஒரு உறுதியான உண்மை என்பதற்குப் பதிலாக ஒரு கருதுகோளாக இருந்தால், யாராவது அதற்கு எதிராக ஆதாரங்களை வழங்கும்போது நீங்கள் தனிப்பட்ட முறையில் தாக்கப்பட்டதாக உணர மாட்டீர்கள்.' },
      example: { en: 'Instead of saying "My marketing strategy is perfect," saying "I hypothesize this strategy will increase sales by 10%; let\'s test it and find out."', ta: '"எனது சந்தைப்படுத்தல் உத்தி சரியானது" என்று சொல்வதற்குப் பதிலாக, "இந்த உத்தி விற்பனையை 10% அதிகரிக்கும் என்று நான் கருதுகிறேன்; அதைச் சோதித்துப் பார்ப்போம்" என்று சொல்வது.' },
      actionStep: { en: 'Treat your strongest opinion today as a mere hypothesis. Actively search for one piece of data that could disprove it.', ta: 'இன்று உங்களின் வலுவான கருத்தை வெறும் கருதுகோளாகக் கருதுங்கள். அதைத் தவறானது என்று நிரூபிக்கக்கூடிய ஒரு தரவைத் தீவிரமாகத் தேடுங்கள்.' },
      reflectionQuestion: { en: 'Are you searching for truth, or are you just searching for evidence to prove you are already right?', ta: 'நீங்கள் உண்மையைத் தேடுகிறீர்களா, அல்லது நீங்கள் ஏற்கனவே சரியானவர் என்பதை நிரூபிக்க ஆதாரங்களைத் தேடுகிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'The Mount Stupid Effect (Dunning-Kruger)', ta: 'மவுண்ட் ஸ்டுபிட் விளைவு (டன்னிங்-க்ரூகர்)' },
      explanation: { en: 'When we know a little bit about a subject, our confidence skyrockets, putting us at the peak of "Mount Stupid." As we learn more, we realize how complex it is, and our confidence plummets.', ta: 'ஒரு விஷயத்தைப் பற்றி நமக்குக் கொஞ்சம் தெரிந்திருக்கும் போது, நமது நம்பிக்கை விண்ணை முட்டுகிறது, நம்மை "மவுண்ட் ஸ்டுபிட்" (முட்டாள் மலையின்) உச்சியில் நிறுத்துகிறது. நாம் மேலும் கற்றுக்கொள்ளும்போது, அது எவ்வளவு சிக்கலானது என்பதை உணர்கிறோம், நமது நம்பிக்கை குறைகிறது.' },
      whyItMatters: { en: 'A tiny bit of knowledge is dangerous. It gives us the illusion of mastery, making us arrogant and blind to our own ignorance.', ta: 'சிறிதளவு அறிவு ஆபத்தானது. இது நமக்குத் தேர்ச்சி பெற்ற மாயையை அளிக்கிறது, நம்மை அகங்காரம் கொண்டவர்களாகவும் நமது சொந்த அறியாமைக்குக் குருடர்களாகவும் ஆக்குகிறது.' },
      example: { en: 'Someone who read two articles about vaccines suddenly believing they know more than immunologists with decades of experience.', ta: 'தடுப்பூசிகளைப் பற்றி இரண்டு கட்டுரைகளைப் படித்த ஒருவர் திடீரென்று பல தசாப்த கால அனுபவமுள்ள நோயெதிர்ப்பு நிபுணர்களை விடத் தங்களுக்கு அதிகம் தெரியும் என்று நம்புவது.' },
      actionStep: { en: 'Identify a topic you recently learned about and feel very confident in. Remind yourself that you are likely on Mount Stupid and seek out an expert\'s counter-opinion.', ta: 'நீங்கள் சமீபத்தில் கற்றுக்கொண்ட மற்றும் மிகவும் நம்பிக்கையுடன் உணரும் ஒரு தலைப்பைக் கண்டறியவும். நீங்கள் மவுண்ட் ஸ்டுபிட்டில் இருக்க வாய்ப்புள்ளது என்பதை உங்களுக்கு நினைவூட்டிக் கொள்ளுங்கள் மற்றும் ஒரு நிபுணரின் எதிர்க் கருத்தைத் தேடுங்கள்.' },
      reflectionQuestion: { en: 'Where in your life is your confidence vastly exceeding your actual competence?', ta: 'உங்கள் வாழ்க்கையில் எந்த இடத்தில் உங்களின் உண்மையான திறனை விட உங்களின் நம்பிக்கை அதிகமாக உள்ளது?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'The Joy of Being Wrong', ta: 'தவறு செய்வதன் மகிழ்ச்சி' },
      explanation: { en: 'Most people hate being wrong because it bruises their ego. But discovering you are wrong is actually the only way to become less wrong in the future.', ta: 'பெரும்பாலான மக்கள் தவறு செய்வதை வெறுக்கிறார்கள், ஏனென்றால் அது அவர்களின் ஈகோவைக் காயப்படுத்துகிறது. ஆனால் நீங்கள் தவறு செய்கிறீர்கள் என்பதைக் கண்டறிவதுதான் எதிர்காலத்தில் குறைவான தவறுகளைச் செய்வதற்கான ஒரே வழியாகும்.' },
      whyItMatters: { en: 'If you refuse to be wrong, you refuse to grow. Embracing errors with joy removes the fear of learning.', ta: 'நீங்கள் தவறு செய்ய மறுத்தால், நீங்கள் வளர மறுக்கிறீர்கள். தவறுகளை மகிழ்ச்சியுடன் ஏற்றுக்கொள்வது கற்றல் மீதான பயத்தை நீக்குகிறது.' },
      example: { en: 'Ray Dalio, a billionaire investor, built his success on constantly asking, "How do I know I\'m right?" and celebrating when someone proved his investments wrong before he lost money.', ta: 'பில்லியனர் முதலீட்டாளர் ரே டாலியோ, "நான் சொல்வது சரி என்று எனக்கு எப்படித் தெரியும்?" என்று தொடர்ந்து கேட்டு, தான் பணத்தை இழக்கும் முன் யாராவது தனது முதலீடுகளைத் தவறு என்று நிரூபிக்கும்போது அதைக் கொண்டாடுவதன் அடிப்படையில் தனது வெற்றியைக் கட்டியெழுப்பினார்.' },
      actionStep: { en: 'The next time someone proves you wrong, instantly smile and say, "Thank you, I just learned something new today," instead of getting defensive.', ta: 'அடுத்த முறை யாராவது நீங்கள் தவறு என்று நிரூபிக்கும் போது, உடனடியாகப் புன்னகைத்து, தற்காப்புடன் செயல்படுவதற்குப் பதிலாக, "நன்றி, நான் இன்று புதிதாக ஒன்றைக் கற்றுக்கொண்டேன்" என்று சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Would you rather protect your ego by staying ignorant, or hurt your ego for 5 seconds to become smarter?', ta: 'அறியாமையிலேயே இருந்து உங்கள் ஈகோவைப் பாதுகாக்க விரும்புவீர்களா, அல்லது புத்திசாலியாக மாறுவதற்காக 5 வினாடிகள் உங்கள் ஈகோவைக் காயப்படுத்திக்கொள்ள விரும்புவீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Task Conflict vs. Relationship Conflict', ta: 'பணி மோதல் vs உறவு மோதல்' },
      explanation: { en: 'Task conflict is arguing about ideas and how to solve a problem (healthy). Relationship conflict is attacking the person and holding grudges (toxic).', ta: 'பணி மோதல் என்பது யோசனைகள் மற்றும் ஒரு பிரச்சினையை எவ்வாறு தீர்ப்பது என்பது பற்றி வாதிடுவது (ஆரோக்கியமானது). உறவு மோதல் என்பது அந்த நபரைத் தாக்குவதும் வன்மங்களை வைத்திருப்பதும் ஆகும் (நச்சுத்தன்மையானது).' },
      whyItMatters: { en: 'High-performing teams have high task conflict but low relationship conflict. They fight passionately about the work, but respect each other deeply as individuals.', ta: 'அதிகச் செயல்திறன் கொண்ட குழுக்களுக்கு அதிகப் பணி மோதல் இருக்கும், ஆனால் குறைந்த உறவு மோதலே இருக்கும். அவர்கள் வேலைக்காக ஆர்வத்துடன் சண்டையிடுகிறார்கள், ஆனால் தனிநபர்களாக ஒருவரையொருவர் ஆழமாக மதிக்கிறார்கள்.' },
      example: { en: 'Task conflict: "This software architecture won\'t scale well." Relationship conflict: "You always design terrible software because you\'re lazy."', ta: 'பணி மோதல்: "இந்த மென்பொருள் கட்டமைப்பு நன்றாக அளவிடப்படாது." உறவு மோதல்: "நீங்கள் சோம்பேறியாக இருப்பதால் எப்போதும் மோசமான மென்பொருளை வடிவமைக்கிறீர்கள்."' },
      actionStep: { en: 'When arguing with a coworker or partner today, explicitly state: "I am arguing about the idea, not criticizing you as a person."', ta: 'இன்று ஒரு சக ஊழியர் அல்லது கூட்டாளருடன் வாதிடும் போது, "நான் யோசனையைப் பற்றி வாதிடுகிறேன், உங்களை ஒரு நபராக விமர்சிக்கவில்லை" என்று வெளிப்படையாகக் கூறுங்கள்.' },
      reflectionQuestion: { en: 'Do you take it personally when someone criticizes your work, confusing task conflict with relationship conflict?', ta: 'பணி மோதலை உறவு மோதலுடன் குழப்பிக்கொண்டு, யாராவது உங்கள் வேலையை விமர்சிக்கும்போது நீங்கள் அதைத் தனிப்பட்ட முறையில் எடுத்துக்கொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Confident Humility', ta: 'நம்பிக்கையான பணிவு' },
      explanation: { en: 'Confident humility is believing in your capability to achieve a goal while acknowledging that your current knowledge or strategy might be completely wrong.', ta: 'நம்பிக்கையான பணிவு என்பது, உங்களின் தற்போதைய அறிவு அல்லது உத்தி முற்றிலும் தவறாக இருக்கலாம் என்பதை ஒப்புக்கொண்டே, ஒரு இலக்கை அடைவதற்கான உங்களின் திறனை நம்புவதாகும்.' },
      whyItMatters: { en: 'Pure confidence makes you blind. Pure humility makes you weak. Confident humility makes you unstoppable because you have the drive to win but the openness to adapt.', ta: 'முழுமையான நம்பிக்கை உங்களைக் குருடாக்குகிறது. முழுமையான பணிவு உங்களை பலவீனமாக்குகிறது. நம்பிக்கையான பணிவு உங்களைத் தடுக்க முடியாதவராக ஆக்குகிறது, ஏனென்றால் உங்களுக்கு வெற்றிபெறும் உந்துதலும், ஆனால் தழுவிக்கொள்ளும் திறந்த மனப்பான்மையும் உள்ளது.' },
      example: { en: 'A CEO saying, "I am 100% sure we will dominate this market eventually, but I am not sure if our current product is the right way to do it. Let\'s find out."', ta: '"இறுதியில் நாம் இந்தச் சந்தையில் ஆதிக்கம் செலுத்துவோம் என்பதில் நான் 100% உறுதியாக இருக்கிறேன், ஆனால் நமது தற்போதைய தயாரிப்பு அதைச் செய்வதற்கான சரியான வழியா என்று எனக்குத் தெரியவில்லை. நாம் கண்டுபிடிப்போம்" என்று சொல்லும் ஒரு தலைமை நிர்வாக அதிகாரி.' },
      actionStep: { en: 'Write down a major goal. Affirm your belief that you can reach it, but list three things you still need to learn or might be wrong about.', ta: 'ஒரு முக்கிய இலக்கை எழுதுங்கள். நீங்கள் அதை அடைய முடியும் என்ற உங்கள் நம்பிக்கையை உறுதிப்படுத்துங்கள், ஆனால் நீங்கள் இன்னும் கற்றுக்கொள்ள வேண்டிய அல்லது தவறாக இருக்கக்கூடிய மூன்று விஷயங்களைப் பட்டியலிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you confusing confidence in your overall ability with stubbornness in your current methods?', ta: 'உங்களின் ஒட்டுமொத்தத் திறனின் மீதான நம்பிக்கையை உங்களின் தற்போதைய முறைகளில் உள்ள பிடிவாதத்துடன் சேர்த்துக் குழப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Ask "How" Instead of "Why"', ta: '"ஏன்" என்பதற்குப் பதிலாக "எப்படி" என்று கேளுங்கள்' },
      explanation: { en: 'When people hold extreme views, asking them *why* they believe it makes them defensive and doubles down on their reasons. Asking them *how* their policy would actually work exposes the gaps in their knowledge.', ta: 'மக்கள் தீவிரக் கருத்துக்களைக் கொண்டிருக்கும் போது, அவர்கள் *ஏன்* அதை நம்புகிறார்கள் என்று கேட்பது அவர்களைத் தற்காப்புக்கு உள்ளாக்குகிறது மற்றும் அவர்களின் காரணங்களை இரட்டிப்பாக்குகிறது. அவர்களின் கொள்கை உண்மையில் *எப்படி* வேலை செய்யும் என்று கேட்பது அவர்களின் அறிவில் உள்ள இடைவெளிகளை வெளிப்படுத்துகிறது.' },
      whyItMatters: { en: 'Explaining the mechanics of a complex problem bursts the illusion of explanatory depth. People realize they don\'t understand the issue as well as they thought.', ta: 'ஒரு சிக்கலான பிரச்சினையின் வழிமுறைகளை விளக்குவது விளக்கமளிக்கும் ஆழத்தின் மாயையை உடைக்கிறது. தாங்கள் நினைத்த அளவுக்குப் பிரச்சினையைத் தாங்கள் புரிந்து கொள்ளவில்லை என்பதை மக்கள் உணர்கிறார்கள்.' },
      example: { en: 'Instead of asking a relative *why* they hate a new tax law, asking them to explain step-by-step *how* the law will be implemented and affect the economy.', ta: 'ஒரு உறவினரிடம் அவர்கள் *ஏன்* புதிய வரிக் சட்டத்தை வெறுக்கிறார்கள் என்று கேட்பதற்குப் பதிலாக, அந்தச் சட்டம் *எப்படி* செயல்படுத்தப்படும் மற்றும் பொருளாதாரத்தை பாதிக்கும் என்பதைப் படிப்படியாக விளக்கச் சொல்வது.' },
      actionStep: { en: 'Next time someone states a strong opinion, calmly ask them to walk you through exactly *how* their solution would physically work in the real world.', ta: 'அடுத்த முறை யாராவது ஒரு வலுவான கருத்தைக் கூறும்போது, அவர்களின் தீர்வு நிஜ உலகில் நேரடியாக *எப்படி* வேலை செய்யும் என்பதைத் துல்லியமாக விளக்குமாறு அமைதியாகக் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you actually know how the things you have strong opinions about work behind the scenes?', ta: 'நீங்கள் வலுவான கருத்துக்களைக் கொண்டுள்ள விஷயங்கள் திரைக்குப் பின்னால் எப்படி வேலை செய்கின்றன என்பது உங்களுக்கு உண்மையிலேயே தெரியுமா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Acknowledge Complexity', ta: 'சிக்கலான தன்மையை ஒப்புக்கொள்ளுங்கள்' },
      explanation: { en: 'We love binary, black-and-white thinking because it is easy. But most issues are highly complex and exist in shades of gray.', ta: 'நாம் இரும (Binary), கருப்பு-வெள்ளை சிந்தனையை விரும்புகிறோம், ஏனெனில் அது எளிதானது. ஆனால் பெரும்பாலான பிரச்சினைகள் மிகவும் சிக்கலானவை மற்றும் சாம்பல் நிற நிழல்களில் உள்ளன.' },
      whyItMatters: { en: 'Presenting a controversial topic as a simple two-sided debate polarizes people. Highlighting the nuances and caveats actually makes people more open-minded and willing to listen.', ta: 'ஒரு சர்ச்சைக்குரிய தலைப்பை ஒரு எளிய இருபக்க விவாதமாக முன்வைப்பது மக்களைத் துருவப்படுத்துகிறது. நுணுக்கங்களையும் எச்சரிக்கைகளையும் முன்னிலைப்படுத்துவது உண்மையில் மக்களை அதிகத் திறந்த மனதுடையவர்களாகவும் கேட்கத் தயாராகவும் ஆக்குகிறது.' },
      example: { en: 'A journalist writing an article that says "Both sides of the climate debate have valid economic concerns, but here is where the data points," rather than "Side A is evil, Side B is good."', ta: '"காலநிலை விவாதத்தின் இரு தரப்பினருக்கும் முறையான பொருளாதாரக் கவலைகள் உள்ளன, ஆனால் தரவு எங்குச் சுட்டிக்காட்டுகிறது என்பது இங்கே" என்று எழுதும் ஒரு பத்திரிகையாளர், "பக்கம் ஏ தீயது, பக்கம் பி நல்லது" என்று எழுதுவதற்குப் பதிலாக.' },
      actionStep: { en: 'Take a divisive issue you care about. Write down one valid point the opposing side makes, acknowledging that the issue isn\'t 100% simple.', ta: 'நீங்கள் அக்கறை கொள்ளும் ஒரு பிளவுபடுத்தும் பிரச்சினையை எடுத்துக் கொள்ளுங்கள். அந்தப் பிரச்சினை 100% எளிமையானது அல்ல என்பதை ஒப்புக்கொண்டு, எதிர்த்தரப்பு கூறும் ஒரு சரியான கருத்தை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Are you attracted to politicians or leaders who offer dangerously simple solutions to massively complex problems?', ta: 'மிகப்பெரிய சிக்கலான பிரச்சினைகளுக்கு ஆபத்தான எளிய தீர்வுகளை வழங்கும் அரசியல்வாதிகள் அல்லது தலைவர்களால் நீங்கள் ஈர்க்கப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'The Illusion of Explanatory Depth', ta: 'விளக்கமளிக்கும் ஆழத்தின் மாயை' },
      explanation: { en: 'We think we understand how a toilet, a zipper, or a bicycle works. But if asked to draw a detailed diagram of the mechanics, we fail miserably. We confuse familiarity with understanding.', ta: 'கழிப்பறை, ஜிப்பர் அல்லது மிதிவண்டி எப்படி வேலை செய்கிறது என்பதை நாம் புரிந்துகொண்டதாக நினைக்கிறோம். ஆனால் அதன் வழிமுறைகளின் விரிவான வரைபடத்தை வரையச் சொன்னால், நாம் பரிதாபமாகத் தோல்வியடைகிறோம். பரிச்சயத்தைப் புரிதலுடன் சேர்த்துக் குழப்புகிறோம்.' },
      whyItMatters: { en: 'This illusion makes us overly confident in our political and social beliefs. Realizing how little we know about everyday objects should make us humbler about complex global issues.', ta: 'இந்த மாயை நமது அரசியல் மற்றும் சமூக நம்பிக்கைகளில் நம்மை அதிக நம்பிக்கைக்கு உள்ளாக்குகிறது. அன்றாடப் பொருட்களைப் பற்றி நாம் எவ்வளவு குறைவாக அறிந்திருக்கிறோம் என்பதை உணர்வது, சிக்கலான உலகளாவிய பிரச்சினைகளைப் பற்றி நம்மை மேலும் பணிவானவர்களாக மாற்ற வேண்டும்.' },
      example: { en: 'Trying to explain exactly how Wi-Fi travels through walls and realizing you actually just know how to type in a password.', ta: 'சுவர்கள் வழியாக வைஃபை எப்படித் துல்லியமாகப் பயணிக்கிறது என்பதை விளக்க முயற்சிப்பது மற்றும் உண்மையில் கடவுச்சொல்லை எப்படி உள்ளிடுவது என்பது மட்டுமே உங்களுக்குத் தெரியும் என்பதை உணர்வது.' },
      actionStep: { en: 'Pick an everyday object you use (like a microwave) and try to explain out loud, step-by-step, exactly how it works. Notice where your knowledge stops.', ta: 'நீங்கள் பயன்படுத்தும் ஒரு அன்றாடப் பொருளைத் (மைக்ரோவேவ் போன்றது) தேர்ந்தெடுத்து, அது எப்படிச் சரியாக வேலை செய்கிறது என்பதைப் படிப்படியாக, சத்தமாக விளக்க முயற்சிக்கவும். உங்கள் அறிவு எங்கு நிற்கிறது என்பதைக் கவனியுங்கள்.' },
      reflectionQuestion: { en: 'Are your strong opinions built on deep understanding, or just the illusion of it?', ta: 'உங்களின் வலுவான கருத்துக்கள் ஆழமான புரிதலின் அடிப்படையில் கட்டமைக்கப்பட்டுள்ளதா, அல்லது அதன் மாயையின் அடிப்படையிலா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Build a Challenge Network', ta: 'ஒரு சவால் வலையமைப்பை உருவாக்குங்கள்' },
      explanation: { en: 'We naturally surround ourselves with a "support network" of people who agree with us and make us feel good. We also need a "challenge network" of people we trust to point out our blind spots.', ta: 'நம்முடன் உடன்படும் மற்றும் நம்மை நன்றாக உணர வைக்கும் மனிதர்களின் "ஆதரவு வலையமைப்பால்" நாம் இயற்கையாகவே நம்மைச் சூழ்ந்துகொள்கிறோம். நமது பார்வையற்ற இடங்களைச் சுட்டிக்காட்ட நாம் நம்பும் மனிதர்களின் "சவால் வலையமைப்பும்" நமக்குத் தேவை.' },
      whyItMatters: { en: 'Without thoughtful critics, we become trapped in echo chambers. A challenge network keeps us grounded and prevents us from launching bad ideas.', ta: 'சிந்தனையுள்ள விமர்சகர்கள் இல்லாமல், நாம் எதிரொலி அறைகளில் சிக்கிக் கொள்கிறோம். ஒரு சவால் வலையமைப்பு நம்மை நிலைநிறுத்துகிறது மற்றும் மோசமான யோசனைகளைத் தொடங்குவதைத் தடுக்கிறது.' },
      example: { en: 'Pixar’s "Braintrust" meetings, where directors show their unfinished movies to other directors specifically to have the plot brutally torn apart and improved.', ta: 'பிக்ஸரின் "ப்ரைன்ட்ரஸ்ட்" சந்திப்புகள், அங்கு இயக்குநர்கள் தங்களின் முடிக்கப்படாத திரைப்படங்களை மற்ற இயக்குநர்களிடம் குறிப்பாகக் கதைக்களத்தைக் கடுமையாகக் கிழித்தெறிந்து மேம்படுத்துவதற்காகக் காட்டுகிறார்கள்.' },
      actionStep: { en: 'Identify one person in your life who is smart, honest, and unafraid to disagree with you. Explicitly ask them to review your next big decision.', ta: 'உங்கள் வாழ்க்கையில் புத்திசாலியான, நேர்மையான மற்றும் உங்களுடன் கருத்து வேறுபடுவதற்குப் பயப்படாத ஒருவரைக் கண்டறியவும். உங்களின் அடுத்தப் பெரிய முடிவை மதிப்பாய்வு செய்யும்படி வெளிப்படையாக அவர்களிடம் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you secretly resent the people who give you constructive feedback?', ta: 'உங்களுக்கு ஆக்கபூர்வமான கருத்துக்களை வழங்கும் மனிதர்களை நீங்கள் ரகசியமாக வெறுக்கிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'The Platinum Rule', ta: 'பிளாட்டினம் விதி' },
      explanation: { en: 'The Golden Rule says: "Treat others as you want to be treated." The Platinum Rule says: "Treat others as *they* want to be treated." This requires listening and rethinking your assumptions.', ta: 'பொன்விதி கூறுகிறது: "நீங்கள் எப்படி நடத்தப்பட விரும்புகிறீர்களோ அப்படியே மற்றவர்களையும் நடத்துங்கள்." பிளாட்டினம் விதி கூறுகிறது: "மற்றவர்கள் எப்படி நடத்தப்பட *விரும்புகிறார்களோ* அப்படியே அவர்களை நடத்துங்கள்." இதற்குச் செவிமடுப்பதும் உங்களின் அனுமானங்களை மறுபரிசீலனை செய்வதும் தேவை.' },
      whyItMatters: { en: 'Assuming everyone wants what you want is a failure of empathy. To persuade or comfort someone, you have to understand their specific value system, not project your own.', ta: 'நீங்கள் விரும்புவதையே அனைவரும் விரும்புகிறார்கள் என்று கருதுவது பச்சாதாபத்தின் தோல்வியாகும். ஒருவரை வற்புறுத்தவோ அல்லது ஆறுதல்படுத்தவோ, அவர்களின் குறிப்பிட்ட மதிப்பு அமைப்பை நீங்கள் புரிந்துகொள்ள வேண்டும், உங்களுடையதை முன்னிறுத்தக்கூடாது.' },
      example: { en: 'Buying a highly introverted friend a massive surprise party because *you* love parties, completely ignoring that it would give them intense anxiety.', ta: '*நீங்கள்* பார்ட்டிகளை விரும்புவதால் மிகவும் உள்முக சிந்தனையுள்ள நண்பருக்கு ஒரு பெரிய சர்ப்ரைஸ் பார்ட்டியை ஏற்பாடு செய்வது, அது அவர்களுக்குத் தீவிரமான பதட்டத்தைக் கொடுக்கும் என்பதை முற்றிலுமாகப் புறக்கணிப்பது.' },
      actionStep: { en: 'Before giving advice or a gift to someone today, pause and ask yourself if it fits their personality, or if you are just giving them what you would want.', ta: 'இன்று ஒருவருக்கு ஆலோசனை அல்லது பரிசு வழங்குவதற்கு முன், இடைநிறுத்தி அது அவர்களின் ஆளுமைக்குப் பொருந்துமா, அல்லது நீங்கள் விரும்புவதையே அவர்களுக்குக் கொடுக்கிறீர்களா என்று உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are your acts of kindness actually self-serving?', ta: 'உங்களின் கருணைச் செயல்கள் உண்மையில் சுயநலமானவையா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Dance with Your Opponent', ta: 'உங்கள் எதிரியுடன் நடனமாடுங்கள்' },
      explanation: { en: 'A debate is not a war where you destroy the enemy. It is a dance. If you step on your partner’s toes, they will fight you. If you lead gently, they might follow.', ta: 'விவாதம் என்பது நீங்கள் எதிரியை அழிக்கும் போர் அல்ல. அது ஒரு நடனம். உங்கள் கூட்டாளியின் கால்களை மிதித்தால், அவர்கள் உங்களுடன் சண்டையிடுவார்கள். நீங்கள் மென்மையாக வழிநடத்தினால், அவர்கள் பின்தொடரலாம்.' },
      whyItMatters: { en: 'Overwhelming an opponent with 20 different logical points doesn\'t work; it makes them defensive. Acknowledging their good points and focusing on a few shared truths creates harmony.', ta: '20 வெவ்வேறு தர்க்கரீதியான கருத்துக்களுடன் எதிராளியை மூழ்கடிப்பது வேலை செய்யாது; அது அவர்களைத் தற்காப்புக்கு உள்ளாக்குகிறது. அவர்களின் நல்ல கருத்துக்களை ஏற்றுக்கொள்வதும், பகிரப்பட்ட சில உண்மைகளில் கவனம் செலுத்துவதும் நல்லிணக்கத்தை உருவாக்குகிறது.' },
      example: { en: 'Expert negotiators don\'t argue every minor detail. They establish common ground first ("We both want the company to succeed") and build from there.', ta: 'நிபுணத்துவப் பேச்சுவார்த்தையாளர்கள் ஒவ்வொரு சிறிய விவரத்தையும் வாதிடுவதில்லை. அவர்கள் முதலில் பொதுவான தளத்தை நிறுவுகிறார்கள் ("நிறுவனம் வெற்றிபெற வேண்டும் என்று நாம் இருவரும் விரும்புகிறோம்") மேலும் அங்கிருந்து கட்டமைக்கிறார்கள்.' },
      actionStep: { en: 'In your next disagreement, concede one valid point to the other person early in the conversation to show you are willing to yield.', ta: 'உங்களின் அடுத்தக் கருத்து வேறுபாட்டில், நீங்கள் விட்டுக்கொடுக்கத் தயாராக இருப்பதைக் காட்ட உரையாடலின் தொடக்கத்திலேயே மற்ற நபருக்கு ஒரு சரியான கருத்தை விட்டுக்கொடுங்கள்.' },
      reflectionQuestion: { en: 'Do you view arguments as battles to be won, or collaborations to find the truth?', ta: 'நீங்கள் விவாதங்களை வெல்ல வேண்டிய போர்களாகப் பார்க்கிறீர்களா, அல்லது உண்மையைக் கண்டறியும் ஒத்துழைப்பாகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Motivation Interviewing', ta: 'உந்துதல் நேர்காணல்' },
      explanation: { en: 'Instead of telling someone to change, ask them open-ended questions that lead them to find their own reasons for changing. You act as a guide, not a commander.', ta: 'ஒருவரை மாறச் சொல்வதற்குப் பதிலாக, அவர்கள் மாறுவதற்கான தங்களின் சொந்தக் காரணங்களைக் கண்டறிய வழிவகுக்கும் திறந்த கேள்விகளை அவர்களிடம் கேளுங்கள். நீங்கள் ஒரு தளபதியாக அல்லாமல், ஒரு வழிகாட்டியாகச் செயல்படுகிறீர்கள்.' },
      whyItMatters: { en: 'People are much more likely to change their behavior if the idea comes from their own mouth rather than being forced upon them by someone else.', ta: 'வேறு ஒருவரால் கட்டாயப்படுத்தப்படுவதை விட, யோசனை தங்களின் சொந்த வாயிலிருந்து வந்தால் மனிதர்கள் தங்களின் நடத்தை மாற்றிக்கொள்ள அதிக வாய்ப்புள்ளது.' },
      example: { en: 'Instead of "You need to quit smoking, it\'s killing you," asking "What are some reasons you might want to quit? How would your life look if you did?"', ta: '"நீங்கள் புகைபிடிப்பதை நிறுத்த வேண்டும், அது உங்களைக் கொல்லும்" என்று சொல்வதற்குப் பதிலாக, "நீங்கள் விட்டுவிட விரும்புவதற்கான சில காரணங்கள் என்ன? நீங்கள் அப்படிச் செய்தால் உங்கள் வாழ்க்கை எப்படி இருக்கும்?" என்று கேட்பது.' },
      actionStep: { en: 'Try to persuade someone today using ONLY questions. Guide them toward the conclusion without ever stating the conclusion yourself.', ta: 'கேள்விகளை மட்டுமே பயன்படுத்தி இன்று ஒருவரை வற்புறுத்த முயற்சிக்கவும். நீங்களே முடிவைக் கூறாமல் அவர்களை முடிவை நோக்கி வழிநடத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you exhausting yourself trying to drag people toward change, instead of letting them walk there themselves?', ta: 'மனிதர்கள் தாங்களாகவே அங்கு நடக்க அனுமதிப்பதற்குப் பதிலாக, அவர்களை மாற்றத்தை நோக்கி இழுக்க முயற்சிப்பதில் நீங்கள் உங்களைச் சோர்வடையச் செய்கிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Abandon Best Practices', ta: 'சிறந்த நடைமுறைகளைக் கைவிடுங்கள்' },
      explanation: { en: 'Once something becomes a "best practice," it stops evolving. Rethinking requires us to search for "better practices" continuously.', ta: 'ஒன்று "சிறந்த நடைமுறையாக" மாறியதும், அது பரிணமிப்பதை நிறுத்துகிறது. மறுபரிசீலனை செய்வதற்கு நாம் தொடர்ந்து "இன்னும் சிறந்த நடைமுறைகளைத்" தேட வேண்டும்.' },
      whyItMatters: { en: 'Clinging to best practices creates rigid routines. In a dynamic environment, the best practice from five years ago is often the roadmap to failure today.', ta: 'சிறந்த நடைமுறைகளைப் பற்றிக்கொள்வது கடுமையான நடைமுறைகளை உருவாக்குகிறது. மாறும் சூழலில், ஐந்து ஆண்டுகளுக்கு முந்தைய சிறந்த நடைமுறை பெரும்பாலும் இன்றைய தோல்விக்கான வரைபடமாக இருக்கிறது.' },
      example: { en: 'Blockbuster strictly following the "best practice" of late fees to drive revenue, completely blinding them to the better practice of subscription streaming (Netflix).', ta: 'வருவாயைப் பெருக்கத் தாமதக் கட்டணங்கள் என்ற "சிறந்த நடைமுறையை" பிளாக்பஸ்டர் கண்டிப்பாகப் பின்பற்றியது, சந்தா ஸ்ட்ரீமிங் (நெட்ஃபிக்ஸ்) என்ற சிறந்த நடைமுறைக்கு அவர்களை முற்றிலுமாகக் குருடாக்கியது.' },
      actionStep: { en: 'Identify a routine at your job that is done simply because "it is the standard best practice." Brainstorm one way to completely reinvent it.', ta: '"இது நிலையான சிறந்த நடைமுறை" என்பதற்காக மட்டுமே செய்யப்படும் உங்கள் வேலையின் ஒரு வழக்கத்தைக் கண்டறியவும். அதை முழுமையாக மறுவடிவமைப்பு செய்ய ஒரு வழியை மூளைச்சலவை செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you using "best practices" as an excuse to stop thinking creatively?', ta: 'ஆக்கபூர்வமாகச் சிந்திப்பதை நிறுத்துவதற்கான ஒரு சாக்குப்போக்காக "சிறந்த நடைமுறைகளை" நீங்கள் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Detach Your Identity from Your Ideas', ta: 'உங்கள் யோசனைகளிலிருந்து உங்களின் அடையாளத்தைப் பிரித்தெடுங்கள்' },
      explanation: { en: 'Define yourself by your values, not your beliefs. Values are core principles (curiosity, integrity). Beliefs are specific ideas that should change as new evidence emerges.', ta: 'உங்களின் நம்பிக்கைகளால் அல்லாமல், உங்கள் மதிப்புகளால் உங்களை வரையறுக்கவும். மதிப்புகள் என்பவை முக்கியக் கோட்பாடுகள் (ஆர்வம், நேர்மை). நம்பிக்கைகள் என்பவை புதிய சான்றுகள் வெளிவரும்போது மாற வேண்டிய குறிப்பிட்ட யோசனைகளாகும்.' },
      whyItMatters: { en: 'If your identity is tied to a specific policy or diet (e.g., "I am a Vegan" vs "I value health and animal welfare"), changing your mind feels like a death of the self.', ta: 'உங்களின் அடையாளம் ஒரு குறிப்பிட்ட கொள்கை அல்லது உணவுமுறையுடன் பிணைக்கப்பட்டிருந்தால் (எ.கா., "நான் ஆரோக்கியம் மற்றும் விலங்கு நலனை மதிக்கிறேன்" என்பதை விட "நான் ஒரு வீகன்"), உங்கள் மனதை மாற்றுவது உங்களின் மரணம் போல் உணர வைக்கும்.' },
      example: { en: 'A scientist identifying as a "seeker of truth" rather than a "string theorist." If string theory is disproven, their identity remains completely intact.', ta: 'ஒரு விஞ்ஞானி தன்னை ஒரு "ஸ்ட்ரிங் தியரிஸ்ட்" என்பதை விட "உண்மையைத் தேடுபவர்" என்று அடையாளம் கண்டுகொள்வது. ஸ்ட்ரிங் கோட்பாடு நிராகரிக்கப்பட்டால், அவர்களின் அடையாளம் முற்றிலும் அப்படியே இருக்கும்.' },
      actionStep: { en: 'Check your social media bios or how you introduce yourself. Are you defining yourself by rigid beliefs (politics, diets) or by core values?', ta: 'உங்கள் சமூக ஊடக பயோக்கள் அல்லது உங்களை நீங்கள் எப்படி அறிமுகப்படுத்துகிறீர்கள் என்பதைச் சரிபார்க்கவும். கடுமையான நம்பிக்கைகளால் (அரசியல், உணவுமுறைகள்) அல்லது முக்கிய மதிப்புகளால் உங்களை நீங்களே வரையறுக்கிறீர்களா?' },
      reflectionQuestion: { en: 'If you were proven wrong about your strongest belief tomorrow, would you feel like you lost your identity?', ta: 'நாளைய தினம் உங்களின் வலுவான நம்பிக்கையைப் பற்றி நீங்கள் தவறானவர் என்று நிரூபிக்கப்பட்டால், உங்கள் அடையாளத்தை இழந்தது போல் உணர்வீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'The Danger of Binary Thinking', ta: 'இரும சிந்தனையின் ஆபத்து' },
      explanation: { en: 'Humans naturally categorize things into two opposing bins (good/bad, left/right, us/them). This cognitive bias destroys our ability to rethink complex issues.', ta: 'மனிதர்கள் இயற்கையாகவே விஷயங்களை இரண்டு எதிரெதிர் தொட்டிகளாக (நல்லது/கெட்டது, இடது/வலது, நாம்/அவர்கள்) வகைப்படுத்துகிறார்கள். இந்த அறிவாற்றல் சார்பு சிக்கலான பிரச்சினைகளை மறுபரிசீலனை செய்யும் நமது திறனை அழிக்கிறது.' },
      whyItMatters: { en: 'Complex problems rarely have simple A or B answers. Recognizing that an issue has three, four, or five different perspectives prevents radicalization and fosters collaboration.', ta: 'சிக்கலான பிரச்சினைகளுக்கு அரிதாகவே எளிமையான A அல்லது B பதில்கள் உள்ளன. ஒரு பிரச்சினைக்கு மூன்று, நான்கு அல்லது ஐந்து வெவ்வேறு கண்ணோட்டங்கள் இருப்பதை அங்கீகரிப்பது தீவிரவாதத்தைத் தடுக்கிறது மற்றும் ஒத்துழைப்பை வளர்க்கிறது.' },
      example: { en: 'Viewing the economy not as just "capitalism vs. socialism," but exploring a spectrum of mixed models that balance innovation with social safety nets.', ta: 'பொருளாதாரத்தை "முதலாளித்துவம் vs சோசலிசம்" என்று மட்டும் பார்க்காமல், புதுமையைச் சமூக பாதுகாப்பு வலைகளுடன் சமன்படுத்தும் கலப்பு மாதிரிகளின் ஸ்பெக்ட்ரத்தை ஆராய்வது.' },
      actionStep: { en: 'When someone asks you to take a side in a polarized debate today, intentionally propose a "Third Option" that blends aspects of both sides.', ta: 'இன்று துருவப்படுத்தப்பட்ட விவாதத்தில் யாராவது உங்களிடம் ஒரு தரப்பை எடுக்குமாறு கேட்கும்போது, இரு தரப்பின் அம்சங்களையும் கலக்கும் "மூன்றாவது விருப்பத்தை" வேண்டுமென்றே முன்மொழியுங்கள்.' },
      reflectionQuestion: { en: 'Do you instantly categorize new ideas into "with me" or "against me"?', ta: 'புதிய யோசனைகளை உடனடியாக "என்னுடன்" அல்லது "எனக்கு எதிராக" என்று வகைப்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Interpersonal Rethinking', ta: 'தனிப்பட்ட மறுபரிசீலனை' },
      explanation: { en: 'We often hold onto stereotypes about people based on first impressions. We need to continuously update our mental models of the people in our lives as they grow and change.', ta: 'முதல் தோற்றங்களின் அடிப்படையில் மனிதர்களைப் பற்றிய ஒரே மாதிரியான எண்ணங்களை நாம் பெரும்பாலும் பிடித்துக் கொள்கிறோம். நமது வாழ்க்கையில் உள்ள மனிதர்கள் வளரும்போதும் மாறும்போதும் அவர்களைப் பற்றிய நமது மன மாதிரிகளை நாம் தொடர்ந்து புதுப்பிக்க வேண்டும்.' },
      whyItMatters: { en: 'Treating a colleague like they are still the naive intern they were five years ago stunts their growth and ruins your relationship with them.', ta: 'ஒரு சக ஊழியரை ஐந்து ஆண்டுகளுக்கு முன்பு இருந்த அப்பாவிப் பயிற்சியாளரைப் போலவே நடத்துவது அவர்களின் வளர்ச்சியைத் தடுக்கிறது மற்றும் அவர்களுடனான உங்கள் உறவைச் சீரழிக்கிறது.' },
      example: { en: 'Parents recognizing that their 25-year-old child is now an autonomous adult with valid opinions, rather than treating them like a teenager.', ta: 'பெற்றோர்கள் தங்களின் 25 வயது குழந்தையை இப்போது சரியான கருத்துக்களைக் கொண்ட தன்னாட்சி பெற்ற வயது வந்தவர் என்று அங்கீகரிப்பது, அவர்களை ஒரு பதின்ம வயதினரைப்போல நடத்துவதற்குப் பதிலாக.' },
      actionStep: { en: 'Think of a colleague you have written off as "difficult" or "lazy." Assume they have completely changed in the last 6 months and interact with a blank slate today.', ta: 'நீங்கள் "கடினமானவர்" அல்லது "சோம்பேறி" என்று ஒதுக்கிவிட்ட ஒரு சக ஊழியரைப் பற்றி சிந்தியுங்கள். கடந்த 6 மாதங்களில் அவர்கள் முற்றிலும் மாறிவிட்டார்கள் என்று கருதிக்கொண்டு, இன்று ஒரு வெற்றுப் பலகையுடன் உரையாடுங்கள்.' },
      reflectionQuestion: { en: 'Are you punishing the people in your life today for the mistakes they made years ago?', ta: 'உங்கள் வாழ்க்கையில் உள்ள மனிதர்கள் பல ஆண்டுகளுக்கு முன்பு செய்த தவறுகளுக்காக இன்று அவர்களைத் தண்டிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Time-Travel to Your Past Self', ta: 'உங்கள் கடந்த கால சுயத்திற்குப் காலப்பயணம் செய்யுங்கள்' },
      explanation: { en: 'If you look back at what you believed a year ago and don\'t feel mildly embarrassed, you haven\'t learned enough. Frequent rethinking ensures you outgrow your old self.', ta: 'ஒரு வருடத்திற்கு முன்பு நீங்கள் நம்பியதைத் திரும்பிப் பார்த்து நீங்கள் லேசாக வெட்கப்படாவிட்டால், நீங்கள் போதுமான அளவு கற்றுக்கொள்ளவில்லை. அடிக்கடி மறுபரிசீலனை செய்வது உங்களின் பழைய சுயத்தை மீறி நீங்கள் வளர்வதை உறுதிசெய்கிறது.' },
      whyItMatters: { en: 'It is easy to judge others for being wrong, but reminding yourself of how spectacularly wrong *you* used to be builds deep empathy and humility.', ta: 'தவறு செய்ததற்காக மற்றவர்களைத் தீர்ப்பது எளிது, ஆனால் முன்பு *நீங்கள்* எவ்வளவு பெரிய தவறுகளைச் செய்தீர்கள் என்பதை உங்களுக்கு நீங்களே நினைவூட்டிக்கொள்வது ஆழமான பச்சாதாபத்தையும் பணிவையும் உருவாக்குகிறது.' },
      example: { en: 'Reading a journal entry from 5 years ago where you confidently predicted a career path you now realize was entirely wrong for you.', ta: '5 ஆண்டுகளுக்கு முந்தைய உங்கள் நாட்குறிப்பைப் படிப்பது, அதில் நீங்கள் இப்போது உங்களுக்கு முற்றிலும் தவறானது என்று உணரும் ஒரு தொழில் பாதையை நம்பிக்கையுடன் கணித்திருந்தீர்கள்.' },
      actionStep: { en: 'Identify one strong conviction you held 3-5 years ago that you have completely abandoned. Take a moment to appreciate the process that changed your mind.', ta: '3-5 ஆண்டுகளுக்கு முன்பு நீங்கள் கொண்டிருந்த, இப்போது நீங்கள் முற்றிலும் கைவிட்ட ஒரு வலுவான நம்பிக்கையை அடையாளம் காணவும். உங்கள் மனதை மாற்றிய செயல்முறையைப் பாராட்ட ஒரு கணம் ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'Are you so afraid of looking foolish that you cling to outdated versions of yourself?', ta: 'முட்டாள்தனமாகத் தெரிவோமோ என்ற பயத்தில் உங்களின் காலாவதியான பதிப்புகளையே நீங்கள் பிடித்துக் கொண்டிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Rethinking Your Career Path', ta: 'உங்கள் தொழில் பாதையை மறுபரிசீலனை செய்தல்' },
      explanation: { en: 'We are often told to pick a career at 18 and stick to it forever. Escaping identity foreclosure means being willing to change your life plan when your interests or the world changes.', ta: '18 வயதில் ஒரு தொழிலைத் தேர்ந்தெடுத்து அதிலேயே என்றென்றும் ஒட்டிக்கொள்ளுமாறு நமக்கு அடிக்கடி சொல்லப்படுகிறது. அடையாள முன்கூட்டிய அடைப்பிலிருந்து தப்பிப்பது என்பது, உங்கள் ஆர்வங்களோ அல்லது உலகமோ மாறும்போது உங்கள் வாழ்க்கைத்திட்டத்தை மாற்றிக்கொள்ளத் தயாராக இருப்பதைக் குறிக்கிறது.' },
      whyItMatters: { en: 'The sunk cost fallacy traps people in miserable careers just because they spent 4 years getting a degree in it. It is never too late to unlearn your original plan.', ta: 'ஒரு பட்டத்தைப் பெற 4 வருடங்கள் செலவழித்தார்கள் என்பதற்காகவே, செலவழித்த செலவு மாயை மக்களை பரிதாபகரமான தொழில்களில் சிக்கவைக்கிறது. உங்களின் அசல் திட்டத்தைக் கற்றதை மறக்க எப்போதுமே தாமதமாகாது.' },
      example: { en: 'A successful lawyer realizing at age 40 they actually hate law and taking a massive pay cut to become a high school teacher because it brings them genuine joy.', ta: 'ஒரு வெற்றிகரமான வழக்கறிஞர் 40 வயதில் தான் உண்மையில் சட்டத்தை வெறுக்கிறோம் என்பதை உணர்ந்து, உயர்நிலைப் பள்ளி ஆசிரியராக மாறுவதற்காகப் பெரிய ஊதியக் குறைப்பை ஏற்றுக்கொள்வது, ஏனெனில் அது அவர்களுக்கு உண்மையான மகிழ்ச்சியைத் தருகிறது.' },
      actionStep: { en: 'Imagine your current career disappeared tomorrow. Write down three completely different, bizarre career paths you would find exciting to explore.', ta: 'உங்கள் தற்போதைய தொழில் நாளை மறைந்துவிட்டதாகக் கற்பனை செய்து பாருங்கள். நீங்கள் ஆராயக் சுவாரஸ்யமாகக் கருதும் முற்றிலும் மாறுபட்ட, விசித்திரமான மூன்று தொழில் பாதைகளை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Are you living the dream of the 18-year-old version of yourself, even though the 30-year-old you wants something entirely different?', ta: '30 வயதான நீங்கள் முற்றிலும் மாறுபட்ட ஒன்றை விரும்பினாலும், 18 வயதான உங்களின் கனவை நீங்கள் வாழ்கிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Psychological Safety', ta: 'உளவியல் பாதுகாப்பு' },
      explanation: { en: 'For a team to rethink and innovate, they need an environment where it is safe to take risks, ask questions, and admit mistakes without fear of being punished or humiliated.', ta: 'ஒரு குழு மறுபரிசீலனை செய்யவும் புதுமைப்படுத்தவும், தண்டிக்கப்படுவோம் அல்லது அவமானப்படுத்தப்படுவோம் என்ற பயம் இல்லாமல் இடர்பாடுகளை எடுக்கவும், கேள்விகளைக் கேட்கவும், தவறுகளை ஒப்புக்கொள்ளவும் பாதுகாப்பான சூழல் அவர்களுக்குத் தேவை.' },
      whyItMatters: { en: 'In a culture of fear, people hide their errors (leading to massive disasters) and suppress their creative ideas. Psychological safety is the bedrock of continuous learning.', ta: 'பயம் உள்ள கலாச்சாரத்தில், மனிதர்கள் தங்கள் பிழைகளை மறைக்கிறார்கள் (இது பெரிய பேரழிவுகளுக்கு வழிவகுக்கிறது) மற்றும் தங்களின் ஆக்கபூர்வமான யோசனைகளை அடக்குகிறார்கள். உளவியல் பாதுகாப்பு என்பது தொடர்ச்சியான கற்றலின் அடித்தளமாகும்.' },
      example: { en: 'A hospital ward where nurses feel completely safe pointing out a senior doctor\'s dosage error, saving a patient\'s life without facing any professional retaliation.', ta: 'ஒரு மருத்துவமனை வார்டில் செவிலியர்கள் மூத்த மருத்துவரின் மருந்து அளவு பிழையைச் சுட்டிக்காட்டுவது முற்றிலும் பாதுகாப்பானது என்று உணர்கிறார்கள், எந்தத் தொழில்முறைப் பழிவாங்கலையும் எதிர்கொள்ளாமல் ஒரு நோயாளியின் உயிரைக் காப்பாற்றுகிறார்கள்.' },
      actionStep: { en: 'If you manage people or have kids, publicly share a mistake you made this week and explain what you learned from it, signaling that it is safe to be imperfect.', ta: 'நீங்கள் மனிதர்களை நிர்வகிக்கிறீர்கள் அல்லது குழந்தைகளை வைத்திருந்தால், இந்த வாரம் நீங்கள் செய்த ஒரு தவற்றை பகிரங்கமாகப் பகிர்ந்து கொள்ளுங்கள், அதிலிருந்து நீங்கள் என்ன கற்றுக்கொண்டீர்கள் என்பதை விளக்குங்கள், முழுமையற்றவராக இருப்பது பாதுகாப்பானது என்பதை உணர்த்துங்கள்.' },
      reflectionQuestion: { en: 'Do the people around you hide bad news from you because they are terrified of your reaction?', ta: 'உங்களைச் சுற்றியுள்ளவர்கள் உங்கள் எதிர்வினையைக் கண்டு அஞ்சி உங்களிடமிருந்து கெட்ட செய்திகளை மறைக்கிறார்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Think Again: The Power of Knowing What You Don\'t Know' });
    if (existing) {
      console.log('Think Again already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Think Again: The Power of Knowing What You Don\'t Know' });
    }
    
    await WisdomBook.create(thinkAgainBook);
    console.log('Think Again added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
