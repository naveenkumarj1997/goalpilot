import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const ikigaiBook = {
  title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
  author: 'Héctor García and Francesc Miralles',
  coverImage: 'https://m.media-amazon.com/images/I/814L+vq01mL._AC_UF1000,1000_QL80_.jpg',
  categories: ['Philosophy', 'Wellbeing', 'Self-Help'],
  themes: [
    { en: 'Finding Purpose', ta: 'நோக்கத்தை கண்டறிதல்' },
    { en: 'Longevity', ta: 'நீண்ட ஆயுள்' }
  ],
  overview: {
    en: 'A guide to finding your purpose in life, inspired by the Japanese concept of Ikigai, the intersection of what you love, what you are good at, what the world needs, and what you can be paid for.',
    ta: 'வாழ்க்கையின் நோக்கத்தை கண்டறியும் வழிகாட்டி, ஜப்பானிய "இக்கிகாய்" தத்துவத்தின் அடிப்படையில். இது உங்களுக்குப் பிடித்தவை, நீங்கள் சிறந்து விளங்குபவை, உலகிற்குத் தேவையானவை மற்றும் உங்களால் சம்பாதிக்கக்கூடியவை ஆகியவற்றின் கலவையாகும்.'
  },
  topQuotes: [
    { en: 'Only staying active will make you want to live a hundred years.', ta: 'சுறுசுறுப்பாக இருப்பது மட்டுமே உங்களை நூறு ஆண்டுகள் வாழ தூண்டும்.' },
    { en: 'He who has a why to live for can bear with almost any how.', ta: 'வாழ்வதற்கான காரணம் உள்ளவன் எதையும் தாங்கிக் கொள்வான்.' },
    { en: 'There is no future, no past. There is only the present.', ta: 'எதிர்காலமும் இல்லை, கடந்த காலமும் இல்லை. நிகழ்காலம் மட்டுமே உள்ளது.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'Find your Ikigai', ta: 'உங்கள் இக்கிகாயை கண்டறியுங்கள்' },
      explanation: { en: 'Ikigai is the intersection of what you love, what you are good at, what the world needs, and what you can be paid for. Finding it brings meaning to your life.', ta: 'இக்கிகாய் என்பது உங்களுக்குப் பிடித்தவை, நீங்கள் சிறந்து விளங்குபவை, உலகிற்குத் தேவையானவை மற்றும் உங்களால் சம்பாதிக்கக்கூடியவை ஆகியவற்றின் கலவையாகும். இதை கண்டறிவது உங்கள் வாழ்க்கைக்கு அர்த்தம் தருகிறது.' },
      whyItMatters: { en: 'It gives you a reason to jump out of bed each morning.', ta: 'ஒவ்வொரு காலையிலும் படுக்கையிலிருந்து உற்சாகமாக எழுந்திருக்க இது ஒரு காரணத்தை அளிக்கிறது.' },
      example: { en: 'An artist who creates inspiring work, makes a living from it, and brings joy to the community.', ta: 'உத்வேகம் தரும் படைப்புகளை உருவாக்கி, அதன் மூலம் வாழ்வாதாரம் பெற்று, சமூகத்திற்கு மகிழ்ச்சியைத் தரும் ஒரு கலைஞர்.' },
      actionStep: { en: 'Draw four circles for passion, mission, vocation, and profession. Fill them in to find where they overlap.', ta: 'ஆர்வம், நோக்கம், தொழில் மற்றும் வேலைக்கான நான்கு வட்டங்களை வரைந்து அவை எங்கு இணைகின்றன என்பதைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'What is the one activity that makes you forget time?', ta: 'நேரத்தை மறக்கச் செய்யும் அந்த ஒரு செயல் எது?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Take it Slow', ta: 'படிப்படியாக செல்லுங்கள்' },
      explanation: { en: 'Being in a hurry is inversely proportional to quality of life. Walk slowly and you will go far.', ta: 'அவசரப்படுவது வாழ்க்கைத் தரத்திற்கு எதிரானது. மெதுவாக நடந்தால் வெகுதூரம் செல்லலாம்.' },
      whyItMatters: { en: 'Rushing leads to stress, while slowing down helps you appreciate life.', ta: 'அவசரம் மன அழுத்தத்திற்கு வழிவகுக்கிறது, அதேசமயம் நிதானம் வாழ்க்கையை ரசிக்க உதவுகிறது.' },
      example: { en: 'Taking time to enjoy a cup of tea instead of drinking it while working.', ta: 'வேலை செய்யும் போது குடிப்பதற்கு பதிலாக ஒரு கோப்பை தேநீரை ரசித்து குடிக்க நேரம் ஒதுக்குவது.' },
      actionStep: { en: 'Leave your urgent mentality behind and focus on the present moment.', ta: 'உங்கள் அவசர மனநிலையை விட்டுவிட்டு நிகழ்காலத்தில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'When was the last time you did something without rushing?', ta: 'கடைசியாக நீங்கள் அவசரப்படாமல் எப்போது ஒன்றை செய்தீர்கள்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Don\'t Fill Your Stomach', ta: 'வயிற்றை முழுமையாக நிரப்பாதீர்கள்' },
      explanation: { en: 'Hara hachi bu is the 80% rule. Stop eating when you feel 80% full to live longer.', ta: 'ஹரா ஹச்சி பு என்பது 80% விதி. நீண்ட காலம் வாழ 80% வயிறு நிரம்பியவுடன் சாப்பிடுவதை நிறுத்துங்கள்.' },
      whyItMatters: { en: 'Overeating wears down the body with long digestive processes and accelerates cellular oxidation.', ta: 'அதிகமாக சாப்பிடுவது உடலை சோர்வடையச் செய்து உயிரணுக்களின் வயதாவதை துரிதப்படுத்துகிறது.' },
      example: { en: 'Skipping the dessert when you already feel comfortably satisfied.', ta: 'நீங்கள் ஏற்கனவே திருப்தியாக உணரும்போது இனிப்பை தவிர்ப்பது.' },
      actionStep: { en: 'Serve yourself slightly less than you think you need.', ta: 'உங்களுக்குத் தேவையானது என்று நினைப்பதை விட சற்று குறைவாகவே பரிமாறவும்.' },
      reflectionQuestion: { en: 'Do you often feel sluggish after meals? Why?', ta: 'சாப்பிட்ட பிறகு நீங்கள் அடிக்கடி சோர்வாக உணர்கிறீர்களா? ஏன்?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Surround Yourself with Good Friends', ta: 'நல்ல நண்பர்களைச் சுற்றி இருங்கள்' },
      explanation: { en: 'Close relationships and strong community ties (Moai) are vital for emotional health and longevity.', ta: 'நெருக்கமான உறவுகள் மற்றும் வலுவான சமூக பிணைப்புகள் (மோவாய்) உணர்ச்சி ஆரோக்கியத்திற்கும் நீண்ட ஆயுளுக்கும் இன்றியமையாதவை.' },
      whyItMatters: { en: 'Friends help relieve stress, share joy, and provide a sense of belonging.', ta: 'நண்பர்கள் மன அழுத்தத்தை குறைக்கவும், மகிழ்ச்சியை பகிர்ந்து கொள்ளவும் உதவுகிறார்கள்.' },
      example: { en: 'Meeting weekly with a group of friends just to talk and support each other.', ta: 'ஒவ்வொரு வாரமும் நண்பர்களுடன் பேசி ஒருவருக்கொருவர் ஆதரவளிக்க சந்திப்பது.' },
      actionStep: { en: 'Reach out to a friend you haven\'t spoken to in a while.', ta: 'நீண்ட நாட்களாக பேசாத நண்பரை தொடர்பு கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Who are the people in your life that truly uplift you?', ta: 'உங்கள் வாழ்க்கையில் உங்களை உண்மையிலேயே உயர்த்துபவர்கள் யார்?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Get in Shape for Your Next Birthday', ta: 'உங்கள் அடுத்த பிறந்தநாளுக்கு உங்களை தயார்படுத்துங்கள்' },
      explanation: { en: 'Water moves; it is at its best when it flows fresh. Your body needs daily movement to stay healthy.', ta: 'தண்ணீர் நகர்கிறது; அது பாயும் போது தான் சிறப்பாக இருக்கும். உங்கள் உடல் ஆரோக்கியமாக இருக்க தினசரி இயக்கம் தேவை.' },
      whyItMatters: { en: 'Exercise releases hormones that make us feel happy and keeps the physical body resilient.', ta: 'உடற்பயிற்சி ஹார்மோன்களை வெளியிடுகிறது, அது நம்மை மகிழ்ச்சியாக உணர வைக்கிறது.' },
      example: { en: 'Taking a 20-minute daily walk instead of an extreme workout once a week.', ta: 'வாரத்திற்கு ஒரு முறை கடுமையான உடற்பயிற்சிக்கு பதிலாக தினமும் 20 நிமிடம் நடப்பது.' },
      actionStep: { en: 'Add 15 minutes of light stretching or walking to your daily routine.', ta: 'உங்கள் அன்றாட வழக்கத்தில் 15 நிமிடம் நடைப்பயிற்சியை சேர்க்கவும்.' },
      reflectionQuestion: { en: 'How much of your day is spent sitting down?', ta: 'உங்கள் நாளின் எவ்வளவு நேரத்தை உட்கார்ந்தபடியே கழிக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Smile and Acknowledge Others', ta: 'புன்னகைத்து மற்றவர்களை அங்கீகரியுங்கள்' },
      explanation: { en: 'A cheerful attitude is relaxing and helps you make friends. Recognize the people around you.', ta: 'மகிழ்ச்சியான அணுகுமுறை நிதானமாக இருக்கவும் நண்பர்களை உருவாக்கவும் உதவுகிறது.' },
      whyItMatters: { en: 'Smiling reduces stress hormones and creates a positive environment.', ta: 'புன்னகை மன அழுத்த ஹார்மோன்களைக் குறைத்து நேர்மறையான சூழலை உருவாக்குகிறது.' },
      example: { en: 'Greeting your neighbors warmly every morning.', ta: 'தினமும் காலையில் உங்கள் அண்டை வீட்டார்களை அன்பாக வாழ்த்துவது.' },
      actionStep: { en: 'Smile at the first three people you see tomorrow morning.', ta: 'நாளை காலை நீங்கள் பார்க்கும் முதல் மூன்று பேரைப் பார்த்து புன்னகைக்கவும்.' },
      reflectionQuestion: { en: 'When was the last time a stranger\'s smile made your day better?', ta: 'ஒரு அந்நியரின் புன்னகை கடைசியாக எப்போது உங்கள் நாளை சிறப்பாக்கியது?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Reconnect with Nature', ta: 'இயற்கையுடன் மீண்டும் இணையுங்கள்' },
      explanation: { en: 'Human beings are made to be part of the natural world. Return to it often to recharge your soul.', ta: 'மனிதர்கள் இயற்கையின் ஒரு பகுதியாக இருக்கவே உருவாக்கப்பட்டவர்கள். உங்கள் ஆன்மாவை புதுப்பிக்க அடிக்கடி இயற்கையிடம் திரும்புங்கள்.' },
      whyItMatters: { en: 'Nature lowers anxiety, improves focus, and reminds us of the bigger picture.', ta: 'இயற்கை கவலையை குறைக்கிறது மற்றும் கவனத்தை மேம்படுத்துகிறது.' },
      example: { en: 'Spending Sunday morning hiking in a forest instead of scrolling on a phone.', ta: 'ஞாயிறு காலையை செல்போனில் செலவிடுவதற்கு பதிலாக காட்டில் நடப்பது.' },
      actionStep: { en: 'Spend at least 30 minutes outside in a green space this week.', ta: 'இந்த வாரம் குறைந்தது 30 நிமிடங்களாவது ஒரு பசுமையான இடத்தில் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'How do you feel after spending time outdoors compared to indoors?', ta: 'உள்ளே இருப்பதை விட வெளியில் நேரம் செலவழித்த பிறகு நீங்கள் எப்படி உணர்கிறீர்கள்?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Give Thanks', ta: 'நன்றி செலுத்துங்கள்' },
      explanation: { en: 'To your ancestors, to nature which provides you with air and food, to your friends and family.', ta: 'உங்கள் முன்னோர்களுக்கு, உங்களுக்கு காற்றையும் உணவையும் தரும் இயற்கைக்கு, உங்கள் நண்பர்களுக்கு நன்றி சொல்லுங்கள்.' },
      whyItMatters: { en: 'Gratitude shifts your focus from what you lack to what you have.', ta: 'நன்றியுணர்வு நீங்கள் இல்லாதவற்றிலிருந்து உங்களிடம் உள்ளவற்றிற்கு கவனத்தை மாற்றுகிறது.' },
      example: { en: 'Keeping a journal where you write three things you are grateful for each night.', ta: 'ஒவ்வொரு இரவும் நீங்கள் நன்றி செலுத்தும் மூன்று விஷயங்களை ஒரு குறிப்பேட்டில் எழுதுவது.' },
      actionStep: { en: 'Say thank you to someone who helped you today.', ta: 'இன்று உங்களுக்கு உதவிய ஒருவருக்கு நன்றி சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'What is one privilege you have that you rarely think about?', ta: 'நீங்கள் அரிதாகவே சிந்திக்கும் ஒரு பாக்கியம் உங்களிடம் என்ன இருக்கிறது?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Live in the Moment', ta: 'நிகழ்காலத்தில் வாழுங்கள்' },
      explanation: { en: 'Stop regretting the past and fearing the future. Today is all you have. Make the most of it.', ta: 'கடந்த காலத்தை நினைத்து வருந்துவதையும் எதிர்காலத்தை நினைத்து பயப்படுவதையும் நிறுத்துங்கள். இன்று மட்டுமே உங்களிடம் உள்ளது.' },
      whyItMatters: { en: 'The present moment is the only place where you can actually take action and experience joy.', ta: 'நிகழ்காலத்தில் மட்டுமே உங்களால் செயல்படவும் மகிழ்ச்சியை அனுபவிக்கவும் முடியும்.' },
      example: { en: 'Fully listening to a friend speaking without thinking about what to say next.', ta: 'அடுத்து என்ன சொல்வது என்று யோசிக்காமல் நண்பர் சொல்வதை முழுமையாகக் கேட்பது.' },
      actionStep: { en: 'Put your phone away during your next meal and focus only on the food.', ta: 'உங்கள் அடுத்த உணவின் போது உங்கள் மொபைலை தள்ளி வைத்துவிட்டு உணவில் மட்டும் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'How much time do you spend worrying about things that haven\'t happened yet?', ta: 'இன்னும் நடக்காத விஷயங்களை நினைத்து கவலைப்படுவதில் எவ்வளவு நேரம் செலவிடுகிறீர்கள்?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Follow Your Ikigai', ta: 'உங்கள் இக்கிகாயை பின்பற்றுங்கள்' },
      explanation: { en: 'There is a passion inside you, a unique talent that gives meaning to your days and drives you to share the best of yourself.', ta: 'உங்களுக்குள் ஒரு ஆர்வம் உள்ளது, உங்கள் நாட்களுக்கு அர்த்தம் தரும் ஒரு தனித்துவமான திறமை உள்ளது.' },
      whyItMatters: { en: 'Ignoring your calling leads to emptiness; following it leads to fulfillment.', ta: 'உங்கள் இலக்கை புறக்கணிப்பது வெறுமைக்கு வழிவகுக்கும்; அதைப் பின்பற்றுவது நிறைவுக்கு வழிவகுக்கும்.' },
      example: { en: 'A software developer who codes by day but teaches children robotics on weekends.', ta: 'பகலில் வேலை செய்துவிட்டு வார இறுதியில் குழந்தைகளுக்கு ரோபோட்டிக்ஸ் சொல்லிக்கொடுக்கும் ஒருவர்.' },
      actionStep: { en: 'Dedicate 1 hour this weekend strictly to a hobby you love.', ta: 'இந்த வார இறுதியில் உங்களுக்குப் பிடித்த ஒரு பொழுதுபோக்கிற்காக 1 மணிநேரம் ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'If money were not an issue, how would you spend your days?', ta: 'பணம் ஒரு பிரச்சனையாக இல்லாவிட்டால், உங்கள் நாட்களை எப்படி கழிப்பீர்கள்?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Find Flow in Every Task', ta: 'ஒவ்வொரு செயலிலும் ஓட்டத்தைக் கண்டறியுங்கள்' },
      explanation: { en: 'Flow is the state in which people are so involved in an activity that nothing else seems to matter.', ta: 'ஓட்டம் என்பது மக்கள் ஒரு செயலில் மிகவும் ஈடுபாடு கொண்டு வேறு எதுவும் முக்கியமில்லை என்று தோன்றும் நிலை.' },
      whyItMatters: { en: 'Being in a state of flow increases productivity and immense satisfaction.', ta: 'இந்த நிலையில் இருப்பது உற்பத்தித்திறனையும் மிகப்பெரிய திருப்தியையும் அதிகரிக்கிறது.' },
      example: { en: 'Losing track of time while painting, writing, or coding.', ta: 'ஓவியம் வரையும்போது அல்லது வேலை செய்யும்போது நேரத்தை மறப்பது.' },
      actionStep: { en: 'Remove all distractions (phone, tabs) for 30 minutes while working on a single task.', ta: 'ஒரு வேலையைச் செய்யும்போது 30 நிமிடங்களுக்கு மொபைல் போன்ற அனைத்தையும் தள்ளி வைக்கவும்.' },
      reflectionQuestion: { en: 'When did you last experience "Flow"?', ta: 'நீங்கள் கடைசியாக எப்போது நேரத்தை மறந்து வேலை செய்தீர்கள்?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Anti-fragility', ta: 'உடையாத தன்மை' },
      explanation: { en: 'Don\'t just be resilient (resisting shocks); be anti-fragile (getting better from shocks).', ta: 'வெறும் உறுதியுடன் மட்டும் இருக்காதீர்கள்; அதிர்ச்சிகளிலிருந்து மேம்பட்டு உடையாத தன்மையுடன் இருங்கள்.' },
      whyItMatters: { en: 'Challenges and failures make you stronger instead of breaking you.', ta: 'சவால்களும் தோல்விகளும் உங்களை உடைப்பதற்குப் பதிலாக உங்களை வலிமையாக்குகின்றன.' },
      example: { en: 'Using the critique of a failed project to build an even better product next time.', ta: 'தோல்வியடைந்த திட்டத்தின் விமர்சனத்தைப் பயன்படுத்தி அடுத்த முறை சிறந்ததை உருவாக்குவது.' },
      actionStep: { en: 'Reflect on a recent failure and list 3 ways it made you better.', ta: 'சமீபத்திய தோல்வியைப் பற்றி சிந்தித்து, அது உங்களை மேம்படுத்திய 3 வழிகளைப் பட்டியலிடுங்கள்.' },
      reflectionQuestion: { en: 'How do you currently react when things go completely wrong?', ta: 'விஷயங்கள் முற்றிலும் தவறாக நடக்கும்போது நீங்கள் எப்படி செயல்படுகிறீர்கள்?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Wabi-Sabi: Finding Beauty in Imperfection', ta: 'வாபி-சாபி: குறைகளில் அழகைக் காணுதல்' },
      explanation: { en: 'Wabi-sabi is the Japanese concept of seeing beauty in the fleeting, changeable, and imperfect nature of things.', ta: 'வாபி-சாபி என்பது நிலையற்ற, மாறக்கூடிய மற்றும் குறையுள்ள விஷயங்களில் அழகைக் காணும் ஜப்பானிய தத்துவம்.' },
      whyItMatters: { en: 'It frees you from the exhausting pursuit of absolute perfection.', ta: 'இது முழுமையை நோக்கிய சோர்வூட்டும் தேடலிலிருந்து உங்களை விடுவிக்கிறது.' },
      example: { en: 'Appreciating a cracked teacup that has been repaired with gold (Kintsugi).', ta: 'தங்கத்தால் சரிசெய்யப்பட்ட விரிசல் அடைந்த தேநீர் கோப்பையை ரசிப்பது.' },
      actionStep: { en: 'Embrace a flaw in your current work instead of trying to make it 100% perfect.', ta: 'உங்கள் வேலையில் 100% சரியாக இருக்க முயற்சிப்பதற்கு பதிலாக அதில் உள்ள சிறிய குறையை ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'What imperfection in yourself can you start to accept today?', ta: 'உங்களில் உள்ள எந்த குறையை இன்று நீங்கள் ஏற்றுக்கொள்ள முடியும்?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Ichi-go Ichi-e: This Moment Exists Only Once', ta: 'இச்சி-கோ இச்சி-இ: இந்த தருணம் ஒருமுறை மட்டுமே' },
      explanation: { en: 'Every encounter is unique and will never be repeated exactly the same way again.', ta: 'ஒவ்வொரு சந்திப்பும் தனித்துவமானது, அது மீண்டும் அதே வழியில் நடக்காது.' },
      whyItMatters: { en: 'It forces you to pay attention to the people you are with, right now.', ta: 'இது நீங்கள் இப்போது யாருடன் இருக்கிறீர்களோ அவர்கள் மீது கவனம் செலுத்த வைக்கிறது.' },
      example: { en: 'Treating a routine dinner with your family as a special event that will never happen exactly like this again.', ta: 'உங்கள் குடும்பத்தினருடனான வழக்கமான இரவு உணவை ஒரு சிறப்பு நிகழ்வாக கருதுவது.' },
      actionStep: { en: 'During your next conversation, make active eye contact and listen without interrupting.', ta: 'அடுத்த உரையாடலின் போது, கண்ணோடு கண் பார்த்து குறுக்கிடாமல் கேளுங்கள்.' },
      reflectionQuestion: { en: 'If this was the last time you saw a friend, how would you treat them?', ta: 'ஒரு நண்பரை நீங்கள் பார்ப்பது இதுதான் கடைசி முறை என்றால், அவர்களை எப்படி நடத்துவீர்கள்?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Maintain Active Habits', ta: 'சுறுசுறுப்பான பழக்கங்களை பராமரியுங்கள்' },
      explanation: { en: 'Even after retirement, Okinawans keep busy with gardening, socializing, and community roles.', ta: 'ஓகினாவா மக்கள் ஓய்வு பெற்ற பிறகும் தோட்டம் அமைப்பது, சமூகத்தில் பழகுவது என சுறுசுறுப்பாக இருக்கிறார்கள்.' },
      whyItMatters: { en: 'Having a daily routine and responsibilities keeps the mind sharp and the body moving.', ta: 'தினசரி வழக்கமும் பொறுப்புகளும் மனதைக் கூர்மையாகவும் உடலை சுறுசுறுப்பாகவும் வைத்திருக்கும்.' },
      example: { en: 'A retired grandfather who wakes up daily to tend to his vegetable garden.', ta: 'தினமும் காலையில் எழுந்து தனது காய்கறி தோட்டத்தை பராமரிக்கும் ஓய்வுபெற்ற தாத்தா.' },
      actionStep: { en: 'Create a small daily routine that you must complete every morning.', ta: 'ஒவ்வொரு காலையிலும் நீங்கள் செய்ய வேண்டிய ஒரு சிறிய தினசரி வழக்கத்தை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'What is a positive habit you can maintain for the rest of your life?', ta: 'உங்கள் வாழ்நாள் முழுவதும் நீங்கள் பராமரிக்கக்கூடிய நேர்மறையான பழக்கம் என்ன?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Micro-Flow: Enjoying Routine Tasks', ta: 'மைக்ரோ-ஃப்ளோ: அன்றாட வேலைகளை ரசித்தல்' },
      explanation: { en: 'Finding joy and state of flow in mundane tasks like washing dishes or sweeping.', ta: 'பாத்திரம் கழுவுதல் அல்லது பெருக்குதல் போன்ற அன்றாட வேலைகளில் மகிழ்ச்சியையும் கவனத்தையும் கண்டறிதல்.' },
      whyItMatters: { en: 'It turns boring chores into meditative practices.', ta: 'இது சலிப்பான வேலைகளை தியானப் பயிற்சிகளாக மாற்றுகிறது.' },
      example: { en: 'Washing dishes carefully, paying attention to the temperature of the water and the soap bubbles.', ta: 'தண்ணீரின் வெப்பம் மற்றும் குமிழிகளை கவனித்து பாத்திரங்களை கவனமாக கழுவுவது.' },
      actionStep: { en: 'Do your next household chore with complete focus, without listening to music or podcasts.', ta: 'அடுத்த வீட்டு வேலையை பாட்டு கேட்காமல் முழு கவனத்துடன் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Which daily chore do you hate most, and how can you make it a mindful practice?', ta: 'நீங்கள் மிகவும் வெறுக்கும் தினசரி வேலை எது, அதை எப்படி ஒரு கவனப் பயிற்சியாக மாற்ற முடியும்?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Nurture Your Moai (Community)', ta: 'உங்கள் சமூகத்தை வளர்க்கவும்' },
      explanation: { en: 'A Moai is an informal group of people with common interests who look out for one another.', ta: 'மோவாய் என்பது ஒருவருக்கொருவர் உதவிக்கொள்ளும் பொதுவான ஆர்வமுள்ள மக்களின் குழு.' },
      whyItMatters: { en: 'Financial and emotional support from a group reduces stress and increases life expectancy.', ta: 'குழுவின் நிதி மற்றும் உணர்ச்சி ஆதரவு மன அழுத்தத்தைக் குறைத்து ஆயுளை அதிகரிக்கிறது.' },
      example: { en: 'A neighborhood group that pools money together and helps whoever is in need that month.', ta: 'மாதந்தோறும் பணத்தை சேர்த்து அந்த மாதம் யாருக்கு தேவையோ அவர்களுக்கு உதவும் அண்டை வீட்டுக் குழு.' },
      actionStep: { en: 'Initiate a small gathering or group chat with 3-4 close, like-minded friends.', ta: '3-4 நெருங்கிய நண்பர்களுடன் ஒரு சிறிய சந்திப்பு அல்லது உரையாடலைத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'Do you have a group of people who would help you in an emergency?', ta: 'அவசரக்காலத்தில் உங்களுக்கு உதவும் நபர்களின் குழு உங்களிடம் உள்ளதா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Gentle Movements (Radio Taiso)', ta: 'மென்மையான அசைவுகள்' },
      explanation: { en: 'Okinawans practice gentle daily exercises to warm up the body, rather than extreme heavy lifting.', ta: 'ஓகினாவா மக்கள் கடுமையான உடற்பயிற்சிகளுக்குப் பதிலாக உடலை சூடாக்க தினமும் மென்மையான பயிற்சிகளை செய்கிறார்கள்.' },
      whyItMatters: { en: 'Consistency in gentle movement is better for long-term joint health than sporadic intense exercise.', ta: 'அவ்வப்போது செய்யும் கடினமான பயிற்சியை விட மென்மையான இயக்கத்தில் உள்ள நிலைத்தன்மை நீண்ட கால மூட்டு ஆரோக்கியத்திற்கு சிறந்தது.' },
      example: { en: 'Doing 5 minutes of stretching every morning immediately after getting out of bed.', ta: 'தினமும் காலையில் படுக்கையிலிருந்து எழுந்தவுடன் 5 நிமிடம் உடலை நீட்டுவது.' },
      actionStep: { en: 'Learn a simple 5-minute morning stretch routine.', ta: 'ஒரு எளிய 5 நிமிட காலை நீட்சிப் பயிற்சியைக் கற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Does your current exercise routine feel sustainable for the next 20 years?', ta: 'உங்கள் தற்போதைய உடற்பயிற்சி அடுத்த 20 ஆண்டுகளுக்கு நிலையானதாக இருக்குமா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Eat Antioxidants and Diverse Foods', ta: 'ஆக்ஸிஜனேற்ற மற்றும் பலவகை உணவுகள்' },
      explanation: { en: 'The Okinawan diet is rich in tofu, sweet potatoes, fish, and a wide variety of vegetables.', ta: 'ஓகினாவா உணவுமுறையில் டோஃபு, இனிப்பு உருளைக்கிழங்கு, மீன் மற்றும் பலவிதமான காய்கறிகள் நிறைந்துள்ளன.' },
      whyItMatters: { en: 'A diverse, plant-heavy diet prevents disease and slows the aging process.', ta: 'பலவகையான, தாவர அடிப்படையிலான உணவு நோயைத் தடுத்து வயதாவதைக் குறைக்கிறது.' },
      example: { en: 'Eating a colorful salad with 5 different vegetables instead of just plain rice and meat.', ta: 'வெறும் சாதம் மற்றும் இறைச்சிக்கு பதிலாக 5 வகையான காய்கறிகளுடன் பல வண்ண சாலட் சாப்பிடுவது.' },
      actionStep: { en: 'Add one new vegetable to your dinner tonight.', ta: 'இன்று இரவு உங்கள் உணவில் ஒரு புதிய காய்கறியை சேர்க்கவும்.' },
      reflectionQuestion: { en: 'How many different types of vegetables did you eat this week?', ta: 'இந்த வாரம் எத்தனை வகையான காய்கறிகளை சாப்பிட்டீர்கள்?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Never Truly Retire', ta: 'எப்போதும் முழுமையாக ஓய்வு பெறாதீர்கள்' },
      explanation: { en: 'There is no word for "retire" (in the sense of leaving the workforce forever) in Japanese. Keep doing what you love.', ta: 'ஜப்பானிய மொழியில் "ஓய்வு" என்ற வார்த்தை இல்லை. உங்களுக்குப் பிடித்ததைச் செய்து கொண்டே இருங்கள்.' },
      whyItMatters: { en: 'Stopping all productive work can lead to a loss of purpose and rapid physical/mental decline.', ta: 'அனைத்து வேலைகளையும் நிறுத்துவது நோக்கத்தை இழக்கச் செய்து உடல்/மன வீழ்ச்சிக்கு வழிவகுக்கும்.' },
      example: { en: 'A successful doctor who steps down from the hospital but continues to write medical books and mentor students.', ta: 'மருத்துவமனையிலிருந்து விலகினாலும் மருத்துவப் புத்தகங்களை எழுதி மாணவர்களுக்கு வழிகாட்டும் மருத்துவர்.' },
      actionStep: { en: 'Identify a skill you have that you can teach or share with others for free.', ta: 'நீங்கள் மற்றவர்களுக்கு இலவசமாக கற்பிக்கக்கூடிய அல்லது பகிரக்கூடிய ஒரு திறனைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'If you won the lottery tomorrow, what work would you still continue to do?', ta: 'நாளை லாட்டரியில் வெற்றி பெற்றாலும், எந்த வேலையைத் தொடர்ந்து செய்வீர்கள்?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Ikigai: The Japanese Secret to a Long and Happy Life' });
    if (existing) {
      console.log('Ikigai already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Ikigai: The Japanese Secret to a Long and Happy Life' });
    }
    
    await WisdomBook.create(ikigaiBook);
    console.log('Ikigai added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
