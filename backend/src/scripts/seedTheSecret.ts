import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const theSecretBook = {
  title: 'The Secret',
  author: 'Rhonda Byrne',
  coverImage: 'https://m.media-amazon.com/images/I/81fdQIY6ykL._AC_UF1000,1000_QL80_.jpg',
  categories: ['Self-Help', 'Spirituality', 'Manifestation'],
  themes: [
    { en: 'Law of Attraction', ta: 'ஈர்ப்பு விதி' },
    { en: 'Power of Thoughts', ta: 'எண்ணங்களின் சக்தி' }
  ],
  overview: {
    en: 'The Secret reveals the most powerful law in the universe: The Law of Attraction. It explains how you can use this law in every aspect of your life—money, health, relationships, and happiness.',
    ta: '"தி சீக்ரெட்" பிரபஞ்சத்தின் மிக சக்திவாய்ந்த விதியை வெளிப்படுத்துகிறது: ஈர்ப்பு விதி. பணம், ஆரோக்கியம், உறவுகள் மற்றும் மகிழ்ச்சி என உங்கள் வாழ்க்கையின் ஒவ்வொரு அம்சத்திலும் இந்த விதியை எவ்வாறு பயன்படுத்தலாம் என்பதை இது விளக்குகிறது.'
  },
  topQuotes: [
    { en: 'Thoughts become things. If you see it in your mind, you will hold it in your hand.', ta: 'எண்ணங்கள் பொருள்களாக மாறுகின்றன. உங்கள் மனதில் ஒரு விஷயத்தை உங்களால் பார்க்க முடிந்தால், அதை உங்கள் கைகளில் வைத்திருப்பீர்கள்.' },
    { en: 'Your current reality or your current life is a result of the thoughts you have been thinking.', ta: 'உங்கள் தற்போதைய யதார்த்தம் அல்லது தற்போதைய வாழ்க்கை என்பது நீங்கள் இதுவரை நினைத்த எண்ணங்களின் விளைவு.' },
    { en: 'Be grateful for what you have now. As you begin to think about all the things in your life you are grateful for, you will be amazed at the never-ending thoughts that come back to you of more things to be grateful for.', ta: 'இப்போது உங்களிடம் இருப்பதற்காய் நன்றியுடன் இருங்கள். நீங்கள் நன்றியுடன் இருக்கும் விஷயங்களை நினைக்கத் தொடங்கும்போது, மேலும் நன்றி சொல்ல எண்ணற்ற விஷயங்கள் உங்களைத் தேடி வருவதைக் கண்டு நீங்கள் ஆச்சரியப்படுவீர்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Law of Attraction', ta: 'ஈர்ப்பு விதி' },
      explanation: { en: 'The great secret of life is the Law of Attraction. Like attracts like, so when you think a thought, you are also attracting like thoughts to you.', ta: 'வாழ்க்கையின் பெரிய ரகசியம் ஈர்ப்பு விதி. ஒரே மாதிரியானவை ஈர்க்கின்றன, எனவே நீங்கள் ஒரு எண்ணத்தை நினைக்கும் போது, அதே போன்ற எண்ணங்களையும் உங்களை நோக்கி ஈர்க்கிறீர்கள்.' },
      whyItMatters: { en: 'You act like a human transmission tower, broadcasting a frequency with your thoughts. If you want to change anything in your life, change the frequency by changing your thoughts.', ta: 'உங்கள் எண்ணங்கள் மூலம் அதிர்வெண்ணை ஒளிபரப்பும் மனித கோபுரமாக நீங்கள் செயல்படுகிறீர்கள். உங்கள் வாழ்க்கையில் எதையும் மாற்ற விரும்பினால், உங்கள் எண்ணங்களை மாற்றுவதன் மூலம் அதிர்வெண்ணை மாற்றவும்.' },
      example: { en: 'Thinking constantly about debt attracts more debt. Thinking constantly about wealth attracts wealth.', ta: 'கடனைப் பற்றி தொடர்ந்து சிந்திப்பது அதிக கடனை ஈர்க்கிறது. செல்வத்தைப் பற்றி தொடர்ந்து சிந்திப்பது செல்வத்தை ஈர்க்கிறது.' },
      actionStep: { en: 'Notice what you are thinking about right now. Is it what you want, or what you don\'t want?', ta: 'இப்போது நீங்கள் எதைப் பற்றி சிந்திக்கிறீர்கள் என்பதைக் கவனியுங்கள். அது உங்களுக்கு வேண்டியதா அல்லது வேண்டாததா?' },
      reflectionQuestion: { en: 'What is the dominant thought you have had today?', ta: 'இன்று நீங்கள் நினைத்த மிக ஆழமான எண்ணம் என்ன?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Thoughts Become Things', ta: 'எண்ணங்கள் நிஜமாகின்றன' },
      explanation: { en: 'Your thoughts have a magnetic power and a frequency. As they are sent out into the Universe, they attract everything that is on the same frequency.', ta: 'உங்கள் எண்ணங்களுக்கு காந்த சக்தியும் அதிர்வெண்ணும் உள்ளது. அவை பிரபஞ்சத்திற்கு அனுப்பப்படும்போது, அதே அதிர்வெண்ணில் உள்ள அனைத்தையும் அவை ஈர்க்கின்றன.' },
      whyItMatters: { en: 'You are the creator of your own reality. Nothing can come into your experience unless you summon it through persistent thoughts.', ta: 'உங்கள் யதார்த்தத்தை நீங்களே உருவாக்குகிறீர்கள். நீங்கள் தொடர்ச்சியான எண்ணங்கள் மூலம் எதையும் அழைக்காவிட்டால் உங்கள் அனுபவத்திற்கு எதுவும் வராது.' },
      example: { en: 'Inventors seeing the invention in their mind before it ever exists in physical form.', ta: 'கண்டுபிடிப்பாளர்கள் ஒரு பொருளை பௌதீக வடிவத்தில் உருவாக்கும் முன்பே தங்கள் மனதில் அதை உருவாக்குவது.' },
      actionStep: { en: 'Close your eyes for 2 minutes and vividly imagine holding or experiencing the one thing you want most.', ta: '2 நிமிடங்கள் கண்களை மூடிக்கொண்டு, நீங்கள் மிகவும் விரும்பும் ஒன்றை வைத்திருப்பதாக அல்லது அனுபவிப்பதாக தெளிவாக கற்பனை செய்து பாருங்கள்.' },
      reflectionQuestion: { en: 'If your thoughts instantly became physical objects, what would your room look like right now?', ta: 'உங்கள் எண்ணங்கள் உடனடியாக பொருட்களாக மாறினால், உங்கள் அறை இப்போது எப்படி இருக்கும்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'The Universe Doesn\'t Hear "No"', ta: 'பிரபஞ்சத்திற்கு "இல்லை" என்று கேட்காது' },
      explanation: { en: 'When you focus on what you don\'t want (e.g., "I don\'t want to be late"), the Law of Attraction receives the focus of your thought ("late") and manifests it.', ta: 'நீங்கள் விரும்பாதவற்றில் கவனம் செலுத்தும்போது (எ.கா., "நான் தாமதமாக செல்ல விரும்பவில்லை"), ஈர்ப்பு விதி உங்கள் எண்ணத்தின் மையத்தைப் ("தாமதம்") பெற்று அதை உருவாக்குகிறது.' },
      whyItMatters: { en: 'You must focus entirely on the positive outcome you desire, rather than avoiding the negative outcome.', ta: 'எதிர்மறை விளைவைத் தவிர்ப்பதை விட, நீங்கள் விரும்பும் நேர்மறையான விளைவில் முழுமையாக கவனம் செலுத்த வேண்டும்.' },
      example: { en: 'Saying "I want to be healthy" instead of "I don\'t want to be sick".', ta: '"நான் நோய்வாய்ப்பட விரும்பவில்லை" என்று சொல்வதற்குப் பதிலாக "நான் ஆரோக்கியமாக இருக்க விரும்புகிறேன்" என்று சொல்வது.' },
      actionStep: { en: 'Catch yourself using negative phrasing today and instantly rephrase it into what you *do* want.', ta: 'இன்று நீங்கள் எதிர்மறையான சொற்றொடர்களைப் பயன்படுத்துவதைக் கவனித்து, உடனடியாக அதை நீங்கள் *விரும்பும்* நேர்மறையான வார்த்தைகளாக மாற்றவும்.' },
      reflectionQuestion: { en: 'How often do you complain about what you don\'t want versus talking about what you do want?', ta: 'நீங்கள் விரும்புவதைப் பற்றி பேசுவதை விட, உங்களுக்கு வேண்டாததைப் பற்றி எவ்வளவு அடிக்கடி புகார் செய்கிறீர்கள்?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Your Feelings are a Feedback Mechanism', ta: 'உங்கள் உணர்வுகளே பின்னூட்டம்' },
      explanation: { en: 'It is impossible to monitor every single thought you have. Instead, use your feelings. Good feelings mean you are thinking good thoughts.', ta: 'உங்களுக்கு வரும் ஒவ்வொரு எண்ணத்தையும் கண்காணிப்பது சாத்தியமற்றது. அதற்குப் பதிலாக உங்கள் உணர்வுகளைப் பயன்படுத்துங்கள். நல்ல உணர்வுகள் என்றால் நீங்கள் நல்ல எண்ணங்களை நினைக்கிறீர்கள் என்று அர்த்தம்.' },
      whyItMatters: { en: 'Your emotions immediately tell you what frequency you are on. If you feel bad, you are attracting bad things. If you feel good, you are attracting good things.', ta: 'உங்கள் உணர்வுகள் நீங்கள் எந்த அதிர்வெண்ணில் இருக்கிறீர்கள் என்பதை உடனடியாக சொல்கின்றன. நீங்கள் மோசமாக உணர்ந்தால், மோசமான விஷயங்களை ஈர்க்கிறீர்கள்.' },
      example: { en: 'Feeling joyful and relaxed means you are on the frequency of receiving more joy and relaxation.', ta: 'மகிழ்ச்சியாகவும் நிதானமாகவும் உணர்வது என்பது, மேலும் மகிழ்ச்சியையும் நிதானத்தையும் ஈர்க்கும் அதிர்வெண்ணில் நீங்கள் இருக்கிறீர்கள் என்பதாகும்.' },
      actionStep: { en: 'Check in with your feelings right now. If you feel bad, put on a song you love or think of a happy memory to shift your frequency.', ta: 'இப்போது உங்கள் உணர்வுகளைக் கவனியுங்கள். நீங்கள் மோசமாக உணர்ந்தால், உங்களுக்குப் பிடித்த பாடலைக் கேளுங்கள் அல்லது உங்கள் அதிர்வெண்ணை மாற்ற ஒரு மகிழ்ச்சியான நினைவை நினைத்துப் பாருங்கள்.' },
      reflectionQuestion: { en: 'What activity instantly shifts your mood from bad to good?', ta: 'எந்த செயல் உடனடியாக உங்கள் மனநிலையை மோசமானதிலிருந்து நல்லதாக மாற்றும்?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Ask, Believe, Receive', ta: 'கேளுங்கள், நம்புங்கள், பெறுங்கள்' },
      explanation: { en: 'The Creative Process is simple: Ask the Universe for what you want. Believe that it is already yours. Receive it by feeling the way you will feel once it arrives.', ta: 'படைப்பு செயல்முறை எளிமையானது: நீங்கள் விரும்புவதை பிரபஞ்சத்திடம் கேளுங்கள். அது ஏற்கனவே உங்களுடையது என்று நம்புங்கள். அது கிடைத்தவுடன் நீங்கள் எப்படி உணர்வீர்களோ அதை இப்போதே உணர்ந்து அதைப் பெறுங்கள்.' },
      whyItMatters: { en: 'This three-step process aligns your thoughts, actions, and feelings with the reality you are trying to manifest.', ta: 'இந்த மூன்று-படி செயல்முறை உங்கள் எண்ணங்கள், செயல்கள் மற்றும் உணர்வுகளை நீங்கள் உருவாக்க முயற்சிக்கும் யதார்த்தத்துடன் இணைக்கிறது.' },
      example: { en: 'Asking for a new job, preparing your clothes for the first day of that job (believing), and feeling the excitement of being hired (receiving).', ta: 'புதிய வேலை கேட்பது, அந்த வேலையின் முதல் நாளுக்காக உங்கள் துணிகளை தயார் செய்வது (நம்புவது) மற்றும் வேலை கிடைத்த மகிழ்ச்சியை உணர்வது (பெறுவது).' },
      actionStep: { en: 'Write down one specific desire on a piece of paper starting with "I am so happy and grateful now that..."', ta: '"இப்போது நான் மிகவும் மகிழ்ச்சியாகவும் நன்றியுடனும் இருக்கிறேன், ஏனென்றால்..." என்று தொடங்கி ஒரு குறிப்பிட்ட ஆசையை ஒரு தாளில் எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Which step is hardest for you: Asking clearly, believing completely, or receiving joyfully?', ta: 'உங்களுக்கு மிகவும் கடினமான படி எது: தெளிவாகக் கேட்பது, முழுமையாக நம்புவது அல்லது மகிழ்ச்சியுடன் பெறுவது?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'The Power of Gratitude', ta: 'நன்றியுணர்வின் சக்தி' },
      explanation: { en: 'Gratitude is the quickest way to shift your frequency. It focuses your mind on abundance rather than lack.', ta: 'உங்கள் அதிர்வெண்ணை மாற்றுவதற்கான விரைவான வழி நன்றியுணர்வு. இது உங்கள் மனதை குறையை விட நிறைவின் மீது செலுத்துகிறது.' },
      whyItMatters: { en: 'You cannot attract wealth or happiness if you are ungrateful for what you have now. Gratitude brings more to be grateful for.', ta: 'இப்போது உங்களிடம் இருப்பதற்காய் நீங்கள் நன்றியற்றவராக இருந்தால் உங்களால் செல்வத்தையோ மகிழ்ச்சியையோ ஈர்க்க முடியாது. நன்றியுணர்வு மேலும் நன்றி சொல்ல பல விஷயங்களைக் கொண்டுவருகிறது.' },
      example: { en: 'Being grateful for your current old car sets the frequency to receive a new, better car.', ta: 'உங்கள் தற்போதைய பழைய காருக்கு நன்றி சொல்வது புதிய, சிறந்த காரைப் பெறுவதற்கான அதிர்வெண்ணை அமைக்கிறது.' },
      actionStep: { en: 'List 10 things you are genuinely grateful for right now, and feel the gratitude for each one.', ta: 'இப்போது நீங்கள் உண்மையிலேயே நன்றி செலுத்தும் 10 விஷயங்களைப் பட்டியலிட்டு, ஒவ்வொன்றுக்கும் நன்றியுணர்வை உணருங்கள்.' },
      reflectionQuestion: { en: 'When was the last time you said "thank you" and truly felt it in your heart?', ta: 'நீங்கள் கடைசியாக எப்போது "நன்றி" என்று சொல்லி அதை உங்கள் இதயத்தில் உண்மையாக உணர்ந்தீர்கள்?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Visualization', ta: 'கற்பனை செய்தல்' },
      explanation: { en: 'Visualization is the process of creating pictures in your mind of yourself enjoying what you want. When you visualize, you generate powerful thoughts and feelings of having it now.', ta: 'காட்சிப்படுத்துதல் என்பது நீங்கள் விரும்புவதை அனுபவிப்பது போன்ற படங்களை உங்கள் மனதில் உருவாக்கும் செயல்முறை. நீங்கள் கற்பனை செய்யும் போது, அதை இப்போதே பெற்றிருப்பதைப் போன்ற சக்திவாய்ந்த எண்ணங்களையும் உணர்வுகளையும் உருவாக்குகிறீர்கள்.' },
      whyItMatters: { en: 'The mind cannot distinguish between what is real and what is vividly imagined. Visualization programs your subconscious.', ta: 'உண்மையானது எது, கற்பனை எது என்பதை மனதால் வேறுபடுத்திப் பார்க்க முடியாது. கற்பனை உங்கள் ஆழ்மனதை நிரல்படுத்துகிறது.' },
      example: { en: 'Olympic athletes who visualize their entire race perfectly before stepping onto the track.', ta: 'களத்தில் இறங்குவதற்கு முன்பே தங்கள் முழு ஓட்டப் பந்தயத்தையும் சரியாகக் கற்பனை செய்து பார்க்கும் ஒலிம்பிக் வீரர்கள்.' },
      actionStep: { en: 'Create a "Vision Board" with pictures of the things you want to attract and look at it every day.', ta: 'நீங்கள் ஈர்க்க விரும்பும் விஷயங்களின் படங்களுடன் ஒரு "விஷன் போர்டு" உருவாக்கி அதை தினமும் பாருங்கள்.' },
      reflectionQuestion: { en: 'If you close your eyes, can you see your dream life in vivid detail?', ta: 'கண்களை மூடினால், உங்கள் கனவு வாழ்க்கையை உங்களால் தெளிவாகப் பார்க்க முடிகிறதா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Act As If', ta: 'அது போலவே செயல்படுங்கள்' },
      explanation: { en: 'To attract something, you must act as if you already have it. Your actions must match your desires.', ta: 'ஒரு விஷயத்தை ஈர்க்க, அது உங்களிடம் ஏற்கனவே இருப்பதைப் போல நீங்கள் செயல்பட வேண்டும். உங்கள் செயல்கள் உங்கள் ஆசைகளுடன் பொருந்த வேண்டும்.' },
      whyItMatters: { en: 'If you ask for wealth but constantly act poor (complaining about prices, being cheap), your actions contradict your request.', ta: 'நீங்கள் செல்வத்தைக் கேட்டுவிட்டு எப்போதும் ஏழையாகவே செயல்பட்டால், உங்கள் செயல்கள் உங்கள் கோரிக்கைக்கு முரணாக இருக்கும்.' },
      example: { en: 'Making space in your closet for the clothes of your future partner to show you are ready for a relationship.', ta: 'நீங்கள் ஒரு உறவுக்குத் தயாராக இருப்பதைக் காட்ட உங்கள் அலமாரியில் உங்கள் வருங்கால துணையின் ஆடைகளுக்கு இடம் ஒதுக்குவது.' },
      actionStep: { en: 'Do one physical action today that demonstrates you already have what you are asking for.', ta: 'நீங்கள் கேட்கும் விஷயம் ஏற்கனவே உங்களிடம் இருப்பதை நிரூபிக்கும் ஒரு பௌதீக செயலை இன்று செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are your daily actions aligned with a person who has already achieved your goal?', ta: 'உங்கள் அன்றாட செயல்கள் ஏற்கனவே உங்கள் இலக்கை அடைந்த ஒரு நபரின் செயல்களுடன் பொருந்துகிறதா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'The Secret to Money', ta: 'பணத்திற்கான ரகசியம்' },
      explanation: { en: 'To attract money, you must focus on wealth. It is impossible to bring more money into your life when you are focused on the lack of it.', ta: 'பணத்தை ஈர்க்க, நீங்கள் செல்வத்தின் மீது கவனம் செலுத்த வேண்டும். பணப் பற்றாக்குறையில் கவனம் செலுத்தும்போது உங்கள் வாழ்க்கையில் அதிக பணத்தைக் கொண்டு வருவது சாத்தியமற்றது.' },
      whyItMatters: { en: 'Focusing on debt or bills creates more debt and bills. You must shift your focus to abundance.', ta: 'கடன் அல்லது பில்களில் கவனம் செலுத்துவது அதிக கடன்களையும் பில்களையும் உருவாக்குகிறது. நீங்கள் உங்கள் கவனத்தை வளத்தின் மீது மாற்ற வேண்டும்.' },
      example: { en: 'Looking at bills and imagining they are checks you are receiving.', ta: 'பில்களைப் பார்க்கும்போது அவற்றை நீங்கள் பெறும் காசோலைகளாக கற்பனை செய்து பார்ப்பது.' },
      actionStep: { en: 'Give some money away today. Giving tells the Universe that you have plenty.', ta: 'இன்று கொஞ்சம் பணத்தை தானமாக கொடுங்கள். கொடுப்பது பிரபஞ்சத்திற்கு உங்களிடம் நிறைய இருப்பதைக் கூறுகிறது.' },
      reflectionQuestion: { en: 'Do you feel anxious or excited when you think about money?', ta: 'பணத்தைப் பற்றி நினைக்கும் போது நீங்கள் கவலையாக உணர்கிறீர்களா அல்லது உற்சாகமாக உணர்கிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Secret to Relationships', ta: 'உறவுகளுக்கான ரகசியம்' },
      explanation: { en: 'When you want to attract a relationship, make sure your thoughts, words, actions, and surroundings don\'t contradict your desire.', ta: 'நீங்கள் ஒரு உறவை ஈர்க்க விரும்பினால், உங்கள் எண்ணங்கள், வார்த்தைகள், செயல்கள் மற்றும் சூழல் ஆகியவை உங்கள் விருப்பத்திற்கு முரணாக இல்லை என்பதை உறுதிப்படுத்திக் கொள்ளுங்கள்.' },
      whyItMatters: { en: 'You must treat yourself the way you want others to treat you. If you don\'t love yourself, you project a frequency of not being worthy of love.', ta: 'மற்றவர்கள் உங்களை எப்படி நடத்த வேண்டும் என்று விரும்புகிறீர்களோ அப்படியே உங்களை நீங்களும் நடத்த வேண்டும். நீங்கள் உங்களை நேசிக்காவிட்டால், அன்பிற்கு தகுதியற்றவர் என்ற அதிர்வெண்ணை வெளியிடுகிறீர்கள்.' },
      example: { en: 'Respecting your own boundaries so that a partner will respect them too.', ta: 'உங்கள் சொந்த எல்லைகளை மதிப்பதன் மூலம் உங்கள் துணையும் அவற்றை மதிப்பார்.' },
      actionStep: { en: 'Write down 5 things you love and appreciate about yourself.', ta: 'உங்களைப் பற்றி நீங்கள் விரும்பும் மற்றும் பாராட்டும் 5 விஷயங்களை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Do you enjoy your own company?', ta: 'உங்களுடனான உங்களுடைய தனிமையை நீங்கள் ரசிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Focus on the Good in Others', ta: 'மற்றவர்களிடம் உள்ள நல்லதில் கவனம் செலுத்துங்கள்' },
      explanation: { en: 'To make a relationship work, focus on what you appreciate about the other person, not what you complain about.', ta: 'ஒரு உறவைச் சிறப்பாகச் செயல்பட வைக்க, மற்ற நபரைப் பற்றி நீங்கள் குறை கூறுவதில் கவனம் செலுத்தாமல், அவர்களைப் பாராட்டும் விஷயங்களில் கவனம் செலுத்துங்கள்.' },
      whyItMatters: { en: 'When you focus on their positive traits, you get more of them. When you complain, you get more reasons to complain.', ta: 'அவர்களின் நேர்மறையான பண்புகளில் நீங்கள் கவனம் செலுத்தும்போது, நீங்கள் அவர்களை இன்னும் அதிகமாகப் பெறுவீர்கள். நீங்கள் புகார் செய்யும்போது, புகார் செய்ய உங்களுக்கு பல காரணங்கள் கிடைக்கும்.' },
      example: { en: 'Praising your partner for making coffee instead of criticizing them for leaving a cup on the counter.', ta: 'காபி போட்டதற்காக உங்கள் துணையைப் பாராட்டுவது, அதைப் பயன்படுத்திவிட்டு கோப்பையை அப்படியே வைத்துவிட்டதற்காக விமர்சிப்பதற்கு பதிலாக.' },
      actionStep: { en: 'Think of someone you are having trouble with and list 3 good things about them.', ta: 'நீங்கள் சிக்கலில் இருக்கும் ஒருவரைப் பற்றி நினைத்து, அவர்களைப் பற்றிய 3 நல்ல விஷயங்களைப் பட்டியலிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you looking for faults or looking for strengths in the people you love?', ta: 'நீங்கள் நேசிக்கும் நபர்களிடம் குறைகளைத் தேடுகிறீர்களா அல்லது பலங்களைத் தேடுகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The Secret to Health', ta: 'ஆரோக்கியத்திற்கான ரகசியம்' },
      explanation: { en: 'The placebo effect is proof of the Law of Attraction in healing. When a patient believes a pill is a cure, they receive what they believe and are cured.', ta: 'குணப்படுத்துவதில் பிளாசிபோ விளைவு ஈர்ப்பு விதியின் சான்றாகும். ஒரு நோயாளி ஒரு மாத்திரையை மருந்து என்று நம்பும்போது, அவர் நம்புவதைப் பெற்று குணமடைகிறார்.' },
      whyItMatters: { en: 'Focusing on perfect health creates perfect health. Focusing on disease creates disease.', ta: 'சரியான ஆரோக்கியத்தில் கவனம் செலுத்துவது சரியான ஆரோக்கியத்தை உருவாக்குகிறது. நோயின் மீது கவனம் செலுத்துவது நோயை உருவாக்குகிறது.' },
      example: { en: 'Laughing and watching comedy shows to cure illness by filling the body with joy instead of stress.', ta: 'மன அழுத்தத்திற்குப் பதிலாக உடலை மகிழ்ச்சியால் நிரப்புவதன் மூலம் நோயைக் குணப்படுத்த சிரிப்பது மற்றும் நகைச்சுவை நிகழ்ச்சிகளைப் பார்ப்பது.' },
      actionStep: { en: 'Instead of saying "I am sick," say "My body is healing and restoring itself to perfect health."', ta: '"நான் நோய்வாய்ப்பட்டிருக்கிறேன்" என்று சொல்வதற்குப் பதிலாக, "என் உடல் தன்னைத்தானே குணப்படுத்தி சரியான ஆரோக்கியத்திற்குத் திரும்புகிறது" என்று கூறுங்கள்.' },
      reflectionQuestion: { en: 'Do you talk about your ailments constantly, or do you talk about your wellness?', ta: 'நீங்கள் தொடர்ந்து உங்கள் நோய்களைப் பற்றி பேசுகிறீர்களா, அல்லது உங்கள் ஆரோக்கியத்தைப் பற்றி பேசுகிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Resist Nothing', ta: 'எதையும் எதிர்க்காதீர்கள்' },
      explanation: { en: 'What you resist, persists. Because you are putting powerful emotional focus on the very thing you don\'t want.', ta: 'நீங்கள் எதை எதிர்க்கிறீர்களோ அது நிலைத்திருக்கும். ஏனென்றால், நீங்கள் விரும்பாத விஷயத்தின் மீதே சக்திவாய்ந்த உணர்ச்சிகரமான கவனத்தை செலுத்துகிறீர்கள்.' },
      whyItMatters: { en: 'Anti-war movements often create more war. You must be pro-peace instead of anti-war.', ta: 'போர் எதிர்ப்பு இயக்கங்கள் பெரும்பாலும் அதிக போரை உருவாக்குகின்றன. நீங்கள் போர் எதிர்ப்பாளராக இருப்பதை விட அமைதி ஆதரவாளராக இருக்க வேண்டும்.' },
      example: { en: 'Focusing on "anti-poverty" keeps you in lack. Focusing on "pro-wealth" brings abundance.', ta: '"வறுமை ஒழிப்பு" என்பதில் கவனம் செலுத்துவது உங்களை பற்றாக்குறையிலேயே வைத்திருக்கும். "செல்வ உருவாக்கம்" என்பதில் கவனம் செலுத்துவது வளத்தைக் கொண்டுவரும்.' },
      actionStep: { en: 'Stop fighting against what you hate. Start supporting what you love.', ta: 'நீங்கள் வெறுப்பதற்கு எதிராகப் போராடுவதை நிறுத்துங்கள். நீங்கள் விரும்புவதை ஆதரிக்கத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'What negative thing in your life are you currently giving too much attention to by fighting it?', ta: 'உங்கள் வாழ்க்கையில் எந்த எதிர்மறையான விஷயத்தை எதிர்த்துப் போராடுவதன் மூலம் அதற்கு அதிக கவனம் செலுத்துகிறீர்கள்?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'The Universe is Abundant', ta: 'பிரபஞ்சம் வளமானது' },
      explanation: { en: 'There is more than enough for everyone. The idea of lack is a lie created by fear.', ta: 'அனைவருக்கும் போதுமானதை விட அதிகமாகவே உள்ளது. பற்றாக்குறை என்ற எண்ணம் பயத்தால் உருவாக்கப்பட்ட ஒரு பொய்.' },
      whyItMatters: { en: 'If you think someone else getting rich means there is less money for you, you are living in a mindset of lack.', ta: 'இன்னொருவர் பணக்காரர் ஆவது உங்களுக்கான பணம் குறைகிறது என்று நீங்கள் நினைத்தால், நீங்கள் பற்றாக்குறை மனநிலையில் வாழ்கிறீர்கள்.' },
      example: { en: 'Rejoicing when someone else wins the lottery, because it shows wealth is flowing around you.', ta: 'வேறொருவர் லாட்டரியில் வெற்றிபெறும் போது மகிழ்ச்சியடைவது, ஏனென்றால் செல்வம் உங்களைச் சுற்றி பாய்கிறது என்பதை அது காட்டுகிறது.' },
      actionStep: { en: 'When you see someone who has what you want, bless them and feel genuinely happy for them.', ta: 'நீங்கள் விரும்பும் ஒன்றை வைத்திருக்கும் ஒருவரை நீங்கள் காணும்போது, அவர்களை வாழ்த்தி அவர்களுக்காக உண்மையிலேயே மகிழ்ச்சியடையுங்கள்.' },
      reflectionQuestion: { en: 'Do you feel jealous or inspired when you see others succeed?', ta: 'மற்றவர்கள் வெற்றி பெறுவதைப் பார்க்கும்போது நீங்கள் பொறாமைப்படுகிறீர்களா அல்லது ஈர்க்கப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Time is an Illusion', ta: 'நேரம் ஒரு மாயை' },
      explanation: { en: 'It takes no time for the Universe to manifest what you want. Any delay is due to your delay in getting to the place of believing, knowing, and feeling that you already have it.', ta: 'நீங்கள் விரும்புவதை பிரபஞ்சம் வெளிப்படுத்த நேரமே எடுக்காது. எந்தவொரு தாமதமும் அது உங்களிடம் ஏற்கனவே இருக்கிறது என்று நம்பும், அறியும், மற்றும் உணரும் நிலைக்கு நீங்கள் வருவதில் ஏற்படும் தாமதமே.' },
      whyItMatters: { en: 'Size and time mean nothing to the Universe. It is as easy to manifest $1 as it is $1,000,000.', ta: 'அளவும் நேரமும் பிரபஞ்சத்திற்கு ஒன்றுமில்லை. $1 ஐ உருவாக்குவது எவ்வளவு எளிதோ அதே அளவு $1,000,000 ஐ உருவாக்குவதும் எளிது.' },
      example: { en: 'Healing from an illness overnight because the patient completely shifted their belief system instantly.', ta: 'நோயாளி தனது நம்பிக்கையை உடனடியாக முழுமையாக மாற்றியதால் ஒரே இரவில் நோயிலிருந்து குணமடைவது.' },
      actionStep: { en: 'Stop putting a deadline on your desires. Let the Universe handle the "how" and "when".', ta: 'உங்கள் ஆசைகளுக்கு காலக்கெடு வைப்பதை நிறுத்துங்கள். "எப்படி", "எப்போது" என்பதை பிரபஞ்சம் கையாளட்டும்.' },
      reflectionQuestion: { en: 'Are you impatient about your goals, or do you trust they will arrive at the perfect time?', ta: 'உங்கள் இலக்குகள் குறித்து நீங்கள் பொறுமையிழந்து இருக்கிறீர்களா, அல்லது அவை சரியான நேரத்தில் வரும் என்று நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Inspired Action', ta: 'உந்துதல் பெற்ற செயல்' },
      explanation: { en: 'Action is required, but it should feel effortless. Inspired action is when you act because the Universe is nudging you, not out of struggle or desperation.', ta: 'செயல் தேவை, ஆனால் அது சிரமமின்றி உணர வேண்டும். உந்துதல் பெற்ற செயல் என்பது பிரபஞ்சம் உங்களைத் தூண்டுவதால் நீங்கள் செயல்படுவது, போராட்டத்தாலோ விரக்தியாலோ அல்ல.' },
      whyItMatters: { en: 'Forcing action against the flow is exhausting. Inspired action brings joy and immediate results.', ta: 'ஓட்டத்திற்கு எதிராகச் செயல்படக் கட்டாயப்படுத்துவது சோர்வளிக்கிறது. உந்துதல் பெற்ற செயல் மகிழ்ச்சியையும் உடனடி முடிவுகளையும் தருகிறது.' },
      example: { en: 'Suddenly feeling the urge to go to a specific coffee shop, where you happen to meet the perfect business partner.', ta: 'திடீரென்று ஒரு குறிப்பிட்ட காபி ஷாப்பிற்குச் செல்ல வேண்டும் என்ற உந்துதல் ஏற்பட்டு, அங்கே சரியான வணிக கூட்டாளரை சந்திப்பது.' },
      actionStep: { en: 'Listen to your intuition today. If you feel a sudden positive urge to call someone or go somewhere, do it.', ta: 'இன்று உங்கள் உள்ளுணர்வைக் கேளுங்கள். யாரையாவது அழைக்கவோ அல்லது எங்காவது செல்லவோ திடீர் நேர்மறையான உந்துதல் ஏற்பட்டால், அதைச் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you forcing your way towards your goals, or allowing yourself to be guided?', ta: 'உங்கள் இலக்குகளை நோக்கி உங்களை நீங்களே கட்டாயப்படுத்துகிறீர்களா, அல்லது உங்களை வழிநடத்த அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'You are Energy', ta: 'நீங்கள் ஒரு ஆற்றல்' },
      explanation: { en: 'Everything in the universe is energy. You are an energy magnet, so you electrically energize everything to you and energize yourself to everything you want.', ta: 'பிரபஞ்சத்தில் உள்ள அனைத்தும் ஆற்றல். நீங்கள் ஒரு ஆற்றல் காந்தம், எனவே நீங்கள் உங்களுக்குத் தேவையான அனைத்தையும் மின்னூட்டம் செய்கிறீர்கள் மற்றும் நீங்கள் விரும்பும் அனைத்திற்கும் உங்களை மின்னூட்டம் செய்கிறீர்கள்.' },
      whyItMatters: { en: 'Since energy cannot be created or destroyed, the reality you want already exists. You just have to tune into its frequency.', ta: 'ஆற்றலை உருவாக்கவோ அழிக்கவோ முடியாது என்பதால், நீங்கள் விரும்பும் யதார்த்தம் ஏற்கனவே உள்ளது. நீங்கள் அதன் அதிர்வெண்ணுக்கு மாற வேண்டும்.' },
      example: { en: 'Tuning a radio to 98.6 FM to hear that specific station. Tuning your mind to joy to experience a joyful life.', ta: 'குறிப்பிட்ட வானொலி நிலையத்தைக் கேட்க 98.6 FM க்கு மாற்றுவது போல. மகிழ்ச்சியான வாழ்க்கையை அனுபவிக்க உங்கள் மனதை மகிழ்ச்சிக்கு மாற்றுவது.' },
      actionStep: { en: 'See yourself as a glowing magnet pulling exactly what you want towards you.', ta: 'நீங்கள் விரும்புவதை உங்களை நோக்கி இழுக்கும் ஒளிரும் காந்தமாக உங்களை நீங்களே பாருங்கள்.' },
      reflectionQuestion: { en: 'What kind of energy are you radiating right now?', ta: 'இப்போது நீங்கள் எவ்வகையான ஆற்றலை வெளிப்படுத்துகிறீர்கள்?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'The Secret to You', ta: 'உங்களுக்கான ரகசியம்' },
      explanation: { en: 'You are the master of your life, and the Universe is answering your every command. Let go of past hardships and cultural codes.', ta: 'உங்கள் வாழ்க்கையின் எஜமானர் நீங்களே, உங்கள் ஒவ்வொரு கட்டளைக்கும் பிரபஞ்சம் பதிலளிக்கிறது. கடந்த கால கஷ்டங்களையும் கலாச்சார குறியீடுகளையும் விட்டுவிடுங்கள்.' },
      whyItMatters: { en: 'You are not your past. The only thing that matters is what you are choosing to think right now.', ta: 'நீங்கள் உங்கள் கடந்த காலம் அல்ல. இப்போது நீங்கள் எதை நினைக்கத் தேர்ந்தெடுக்கிறீர்கள் என்பது மட்டுமே முக்கியம்.' },
      example: { en: 'Refusing to let a past failure dictate your belief in future success.', ta: 'கடந்த கால தோல்வி உங்களின் எதிர்கால வெற்றியின் நம்பிக்கையை தீர்மானிக்க மறுப்பது.' },
      actionStep: { en: 'Forgive someone from your past today to release that negative energy from your life.', ta: 'உங்கள் வாழ்க்கையிலிருந்து எதிர்மறை ஆற்றலை விடுவிக்க இன்று உங்கள் கடந்த காலத்திலிருந்து ஒருவரை மன்னியுங்கள்.' },
      reflectionQuestion: { en: 'Are you using your past as an excuse for your present situation?', ta: 'உங்கள் தற்போதைய நிலைமைக்கு உங்கள் கடந்த காலத்தை சாக்காகப் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Embrace Your Joy', ta: 'உங்கள் மகிழ்ச்சியைத் தழுவுங்கள்' },
      explanation: { en: 'Your purpose is what you say it is. Your mission is the mission you give yourself. If it ain\'t fun, don\'t do it.', ta: 'உங்கள் நோக்கம் நீங்கள் சொல்வதுதான். உங்கள் பணி உங்களுக்கு நீங்களே கொடுக்கும் பணி. அது வேடிக்கையாக இல்லாவிட்டால், அதைச் செய்யாதீர்கள்.' },
      whyItMatters: { en: 'Joy is the highest frequency. When you follow your joy, you attract abundance effortlessly.', ta: 'மகிழ்ச்சியே மிக உயர்ந்த அதிர்வெண். நீங்கள் உங்கள் மகிழ்ச்சியைத் தொடரும்போது, நீங்கள் சிரமமின்றி வளத்தை ஈர்க்கிறீர்கள்.' },
      example: { en: 'Quitting a prestigious job that makes you miserable to start a bakery that makes you happy.', ta: 'உங்களை மகிழ்ச்சியடையச் செய்யும் பேக்கரியைத் தொடங்க உங்களை துயரப்படுத்தும் ஒரு கௌரவமான வேலையை விட்டுவிடுவது.' },
      actionStep: { en: 'Do one thing today simply because it brings you pure joy, with no other purpose.', ta: 'வேறு எந்த நோக்கமும் இல்லாமல், உங்களுக்கு தூய்மையான மகிழ்ச்சியைத் தருகிறது என்பதற்காகவே இன்று ஒரு காரியத்தைச் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'What makes you lose track of time because you are enjoying it so much?', ta: 'நீங்கள் மிகவும் ரசிப்பதன் காரணமாக நேரத்தை மறக்கச் செய்வது எது?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'The Blank Canvas', ta: 'வெற்று கேன்வாஸ்' },
      explanation: { en: 'The earth turns on its orbit for You. The oceans ebb and flow for You. The sun rises and sets for You. You are the perfection of life.', ta: 'பூமி உங்களுக்காகவே சுழல்கிறது. கடல்கள் உங்களுக்காகவே அலைகின்றன. சூரியன் உங்களுக்காகவே உதிக்கிறது, மறைகிறது. நீங்கள் வாழ்க்கையின் முழுமை.' },
      whyItMatters: { en: 'Your life is a blank canvas, and you are the artist. You can paint whatever you want on it starting today.', ta: 'உங்கள் வாழ்க்கை ஒரு வெற்று கேன்வாஸ், நீங்கள் தான் ஓவியர். இன்று முதல் நீங்கள் அதில் என்ன வேண்டுமானாலும் வரையலாம்.' },
      example: { en: 'Waking up tomorrow morning and deciding completely reinvent your personality and goals.', ta: 'நாளை காலை விழித்தெழுந்து உங்கள் ஆளுமையையும் இலக்குகளையும் முற்றிலுமாக மாற்றியமைக்க முடிவு செய்வது.' },
      actionStep: { en: 'Write down a new description of yourself as if you were writing a character for a movie.', ta: 'ஒரு திரைப்படத்திற்கு ஒரு கதாபாத்திரத்தை எழுதுவது போல் உங்களைப் பற்றிய புதிய விளக்கத்தை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'If there were absolutely no limits, what would you paint on your canvas?', ta: 'முற்றிலும் எல்லைகள் இல்லை என்றால், உங்கள் கேன்வாஸில் நீங்கள் எதை வரைவீர்கள்?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The Secret' });
    if (existing) {
      console.log('The Secret already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The Secret' });
    }
    
    await WisdomBook.create(theSecretBook);
    console.log('The Secret added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
