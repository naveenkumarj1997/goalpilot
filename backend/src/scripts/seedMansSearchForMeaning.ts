import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const mansSearchBook = {
  title: 'Man\'s Search for Meaning',
  author: 'Viktor E. Frankl',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg',
  categories: ['Psychology', 'Philosophy', 'Biography'],
  themes: [
    { en: 'Finding Purpose', ta: 'நோக்கத்தைக் கண்டறிதல்' },
    { en: 'Resilience & Hope', ta: 'மீள்திறன் மற்றும் நம்பிக்கை' }
  ],
  overview: {
    en: 'Psychiatrist Viktor Frankl\'s memoir of his life in Nazi death camps and its lessons for spiritual survival. Based on his own experience and the stories of his patients, Frankl argues that we cannot avoid suffering but we can choose how to cope with it, find meaning in it, and move forward with renewed purpose.',
    ta: 'நாஜி மரண முகாம்களில் மனநல மருத்துவர் விக்டர் பிராங்க்லின் வாழ்க்கை மற்றும் ஆன்மீக ரீதியாக உயிர்வாழ்வதற்கான அதன் பாடங்கள் பற்றிய நினைவுக்குறிப்பு. அவரது சொந்த அனுபவம் மற்றும் நோயாளிகளின் கதைகளின் அடிப்படையில், நாம் துன்பத்தைத் தவிர்க்க முடியாது, ஆனால் அதை எவ்வாறு சமாளிப்பது, அதில் ஒரு அர்த்தத்தைக் கண்டுபிடிப்பது மற்றும் புதுப்பிக்கப்பட்ட நோக்கத்துடன் முன்னேறுவது ஆகியவற்றை நாமே தேர்ந்தெடுக்கலாம் என்று அவர் வாதிடுகிறார்.'
  },
  topQuotes: [
    { en: 'He who has a why to live for can bear almost any how.', ta: 'வாழ்வதற்கு ஒரு "ஏன்" என்ற காரணத்தைக் கொண்டவன் ஏறக்குறைய எந்தவொரு "எப்படி" என்ற கடினமான சூழ்நிலையையும் தாங்கிக் கொள்ள முடியும்.' },
    { en: 'When we are no longer able to change a situation, we are challenged to change ourselves.', ta: 'ஒரு சூழ்நிலையை நம்மால் மாற்ற முடியாத போது, நம்மை நாமே மாற்றிக்கொள்ள நமக்கு சவால் விடப்படுகிறது.' },
    { en: 'Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances.', ta: 'ஒரு மனிதனிடமிருந்து அனைத்தையும் பறிக்கலாம் ஆனால் ஒன்றை மட்டும் பறிக்க முடியாது: மனித சுதந்திரத்தின் இறுதி அம்சம்—எந்தவொரு சூழ்நிலையிலும் தனது அணுகுமுறையைத் தேர்ந்தெடுக்கும் உரிமை.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Last of Human Freedoms', ta: 'மனித சுதந்திரத்தின் இறுதி அம்சம்' },
      explanation: { en: 'No matter what happens to you externally, nobody can control how you choose to react to it. Your attitude is your ultimate, untouchable freedom.', ta: 'வெளிப்புறமாக உங்களுக்கு என்ன நடந்தாலும், அதற்கு நீங்கள் எப்படி எதிர்வினையாற்றுகிறீர்கள் என்பதை யாராலும் கட்டுப்படுத்த முடியாது. உங்கள் அணுகுமுறையே உங்கள் இறுதி, தொட முடியாத சுதந்திரமாகும்.' },
      whyItMatters: { en: 'When you realize that your internal response is always under your control, you stop being a victim of your circumstances.', ta: 'உங்களின் உள்ளகப் பிரதிபலிப்பு எப்போதும் உங்கள் கட்டுப்பாட்டில்தான் இருக்கிறது என்பதை நீங்கள் உணரும்போது, உங்கள் சூழ்நிலைகளுக்குப் பலியாவதை நீங்கள் நிறுத்துகிறீர்கள்.' },
      example: { en: 'A prisoner in a concentration camp choosing to give away his last piece of bread to someone who is starving, asserting his humanity in an inhumane place.', ta: 'ஒரு வதை முகாமில் உள்ள ஒரு கைதி, மனிதாபிமானமற்ற ஒரு இடத்தில் தனது மனிதத்தன்மையை நிலைநிறுத்தி, தனது கடைசித் துண்டு ரொட்டியை பசியால் வாடும் ஒருவருக்குக் கொடுக்கத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'The next time you face a frustrating delay (like traffic), consciously choose to remain calm rather than reacting with anger.', ta: 'அடுத்த முறை நீங்கள் ஒரு எரிச்சலூட்டும் தாமதத்தை (போக்குவரத்து நெரிசல் போல) எதிர்கொள்ளும்போது, கோபத்துடன் எதிர்வினையாற்றுவதற்குப் பதிலாக அமைதியாக இருக்க நனவுடன் தேர்ந்தெடுங்கள்.' },
      reflectionQuestion: { en: 'Are you letting external events dictate your internal emotional state?', ta: 'வெளிப்புற நிகழ்வுகள் உங்கள் உள்ளக உணர்ச்சி நிலையைத் தீர்மானிக்க நீங்கள் அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'He Who Has a "Why"', ta: '"ஏன்" என்ற காரணத்தைக் கொண்டவன்' },
      explanation: { en: 'Quoting Nietzsche, Frankl explains that if a person has a strong enough reason (a "why") to live, they can endure almost any amount of suffering (the "how").', ta: 'நீட்சேயை மேற்கோள் காட்டி பிராங்க்ல் விளக்குகிறார், ஒரு நபருக்கு வாழப் போதுமான வலுவான காரணம் ("ஏன்") இருந்தால், அவர் எந்த அளவிலான துன்பத்தையும் ("எப்படி") தாங்கிக் கொள்ள முடியும்.' },
      whyItMatters: { en: 'Without a clear purpose, suffering becomes unbearable despair. With a purpose, suffering becomes a necessary sacrifice.', ta: 'தெளிவான நோக்கமின்றி, துன்பம் சகிக்க முடியாத விரக்தியாக மாறுகிறது. ஒரு நோக்கத்துடன், துன்பம் அவசியமான தியாகமாக மாறுகிறது.' },
      example: { en: 'Enduring the brutal conditions of the camp because Frankl was determined to survive and publish his manuscript on logotherapy.', ta: 'லாகோதெரபி பற்றிய தனது கையெழுத்துப் பிரதியை உயிர்பிழைத்து வெளியிட வேண்டும் என்று பிராங்க்ல் உறுதியாக இருந்ததால் முகாமின் கொடூரமான சூழ்நிலைகளைத் தாங்கிக்கொண்டார்.' },
      actionStep: { en: 'Write down three deep reasons why your life is necessary and who is depending on you.', ta: 'உங்கள் வாழ்க்கை ஏன் அவசியமானது மற்றும் உங்களை யார் நம்பியிருக்கிறார்கள் என்பதற்கான மூன்று ஆழமான காரணங்களை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'If everything was taken from you tomorrow, what reason would keep you fighting to live?', ta: 'நாளை உங்களிடமிருந்து அனைத்தும் பறிக்கப்பட்டால், வாழப் போராட எந்தக் காரணம் உங்களைத் தூண்டும்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Meaning is Not Given, It is Created', ta: 'அர்த்தம் கொடுக்கப்படுவதில்லை, அது உருவாக்கப்படுகிறது' },
      explanation: { en: 'There is no single "meaning of life" that applies to everyone. Meaning is unique to each individual and must be discovered by them.', ta: 'அனைவருக்கும் பொருந்தும் ஒரே "வாழ்க்கையின் அர்த்தம்" என்று ஏதுமில்லை. அர்த்தம் ஒவ்வொரு தனிநபருக்கும் தனித்துவமானது மற்றும் அது அவர்களாலேயே கண்டறியப்பட வேண்டும்.' },
      whyItMatters: { en: 'You cannot wait for life to hand you a purpose. You are responsible for answering life’s questions through your actions.', ta: 'வாழ்க்கை உங்களுக்கு ஒரு நோக்கத்தை அளிக்கும் என்று நீங்கள் காத்திருக்க முடியாது. உங்கள் செயல்கள் மூலம் வாழ்க்கையின் கேள்விகளுக்குப் பதிலளிக்க நீங்கள் பொறுப்பானவர்.' },
      example: { en: 'Finding meaning in raising a child, creating art, or doing a difficult job with dignity and care.', ta: 'ஒரு குழந்தையை வளர்ப்பதில், கலையை உருவாக்குவதில் அல்லது ஒரு கடினமான வேலையை கண்ணியத்துடனும் கவனத்துடனும் செய்வதில் அர்த்தத்தைக் கண்டறிவது.' },
      actionStep: { en: 'Stop asking "What does life expect from me?" and ask "What task can I dedicate myself to today?"', ta: '"வாழ்க்கை என்னிடம் என்ன எதிர்பார்க்கிறது?" என்று கேட்பதை நிறுத்திவிட்டு, "இன்று என்னை நான் எந்தப் பணிக்கு அர்ப்பணிக்க முடியும்?" என்று கேளுங்கள்.' },
      reflectionQuestion: { en: 'Are you waiting for a grand purpose to appear, or are you creating meaning in your daily tasks?', ta: 'ஒரு மாபெரும் நோக்கம் தோன்றும் என்று காத்திருக்கிறீர்களா, அல்லது உங்களின் அன்றாடப் பணிகளில் அர்த்தத்தை உருவாக்குகிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Three Ways to Find Meaning', ta: 'அர்த்தத்தைக் கண்டறிய மூன்று வழிகள்' },
      explanation: { en: 'Meaning can be found in 1) creating a work or doing a deed, 2) experiencing something or encountering someone (love), and 3) the attitude we take toward unavoidable suffering.', ta: 'அர்த்தத்தை 1) ஒரு வேலையை உருவாக்குவதில் அல்லது செய்வதில், 2) ஒன்றை அனுபவிப்பதில் அல்லது ஒருவரை சந்திப்பதில் (காதல்), மற்றும் 3) தவிர்க்க முடியாத துன்பத்தை நோக்கிய நமது அணுகுமுறையில் காணலாம்.' },
      whyItMatters: { en: 'This provides a framework. If you cannot work, you can love. If you lose your loved ones, you can still find meaning in how bravely you endure the loss.', ta: 'இது ஒரு கட்டமைப்பை வழங்குகிறது. உங்களால் வேலை செய்ய முடியாவிட்டால், நீங்கள் நேசிக்கலாம். உங்கள் அன்புக்குரியவர்களை நீங்கள் இழந்தால், அந்த இழப்பை நீங்கள் எவ்வளவு தைரியமாகத் தாங்குகிறீர்கள் என்பதில் நீங்கள் இன்னும் அர்த்தத்தைக் கண்டறியலாம்.' },
      example: { en: 'A paralyzed person finding meaning not in physical work, but in the love they give their family and the courage they show daily.', ta: 'பக்கவாதத்தால் பாதிக்கப்பட்ட ஒருவர் உடல் உழைப்பில் அல்லாமல், அவர்கள் தங்கள் குடும்பத்தின் மீது காட்டும் அன்பிலும், அவர்கள் தினமும் காட்டும் தைரியத்திலும் அர்த்தத்தைக் கண்டறிவது.' },
      actionStep: { en: 'Identify which of the three paths (work, love, or bearing suffering) is your primary source of meaning right now.', ta: 'மூன்று பாதைகளில் (வேலை, காதல் அல்லது துன்பத்தைத் தாங்குவது) எது இப்போது உங்களின் அர்த்தத்திற்கான முதன்மை ஆதாரம் என்பதை அடையாளம் காணவும்.' },
      reflectionQuestion: { en: 'If you could no longer work, how would you find meaning in your life?', ta: 'உங்களால் இனி வேலை செய்ய முடியாவிட்டால், உங்கள் வாழ்க்கையில் எப்படி அர்த்தத்தைக் காண்பீர்கள்?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The Meaning of Suffering', ta: 'துன்பத்தின் அர்த்தம்' },
      explanation: { en: 'When suffering is unavoidable, it is an opportunity for the highest human achievement. Suffering ceases to be suffering at the moment it finds a meaning.', ta: 'துன்பம் தவிர்க்க முடியாததாக இருக்கும்போது, அது மனிதனின் மிக உயர்ந்த சாதனைக்கான ஒரு வாய்ப்பாகும். துன்பம் ஒரு அர்த்தத்தைக் கண்டுபிடிக்கும் கணத்தில் அது துன்பமாக இருப்பதிலிருந்து முற்றுப்பெறுகிறது.' },
      whyItMatters: { en: 'We often try to escape pain. But if we can find a noble reason for our pain, we can bear it with dignity instead of despair.', ta: 'நாம் பெரும்பாலும் வலியிலிருந்து தப்பிக்க முயற்சிக்கிறோம். ஆனால் நம் வலிக்கான உன்னதமான காரணத்தை நம்மால் கண்டறிய முடிந்தால், விரக்திக்கு பதிலாக கண்ணியத்துடன் அதை நாம் தாங்கிக்கொள்ளலாம்.' },
      example: { en: 'An elderly doctor mourning his wife finding peace when Frankl pointed out that by outliving her, he spared her the immense pain of mourning him.', ta: 'மனைவியை இழந்து தவிக்கும் வயதான மருத்துவர் ஒருவர், தன் மனைவி இறந்து தான் உயிருடன் இருப்பதால், அவள் தனக்காகத் துக்கப்படும் பெரும் வலியைத் தான் தவிர்த்துவிட்டதாக பிராங்க்ல் சுட்டிக்காட்டியபோது அமைதியடைந்தார்.' },
      actionStep: { en: 'Look at a difficult situation in your life right now and ask, "How can I bear this in a way that makes me proud of myself?"', ta: 'இப்போது உங்கள் வாழ்க்கையில் உள்ள கடினமான சூழ்நிலையைப் பார்த்து, "என்னைப் பற்றி நானே பெருமைப்படும் விதத்தில் இதை நான் எப்படித் தாங்குவது?" என்று கேளுங்கள்.' },
      reflectionQuestion: { en: 'What recent hardship can you reframe as a necessary sacrifice for a greater good?', ta: 'ஒரு பெரிய நன்மைக்காக அவசியமான தியாகமாக உங்களின் சமீபத்திய எந்தக் கஷ்டத்தை நீங்கள் மறுவடிவமைக்க முடியும்?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Love as the Ultimate Goal', ta: 'காதலே இறுதி இலக்கு' },
      explanation: { en: 'Frankl realized that love is the ultimate and highest goal to which a human can aspire. The salvation of man is through love and in love.', ta: 'ஒரு மனிதன் ஆசைப்படக்கூடிய இறுதியான மற்றும் மிக உயர்ந்த இலக்கு காதல் என்பதை பிராங்க்ல் உணர்ந்தார். மனிதனின் இரட்சிப்பு காதல் மூலமாகவும் காதலிலுமே உள்ளது.' },
      whyItMatters: { en: 'Even when everything is stripped away, the inner image of a loved one can sustain a person in the darkest moments.', ta: 'அனைத்தும் பறிக்கப்பட்டாலும் கூட, அன்புக்குரிய ஒருவரின் உள் உருவம் இருண்ட தருணங்களில் ஒருவரைத் தாங்கிப் பிடிக்க முடியும்.' },
      example: { en: 'Frankl surviving freezing marches by silently conversing with the memory of his wife, not even knowing if she was still alive.', ta: 'தன்னுடைய மனைவி இன்னும் உயிருடன் இருக்கிறாளா என்று கூடத் தெரியாமல், அவளின் நினைவோடு மௌனமாக உரையாடி, உறையும் குளிரிலான அணிவகுப்புகளில் பிராங்க்ல் உயிர் பிழைத்தது.' },
      actionStep: { en: 'Spend five minutes today quietly reflecting on a profound moment of love you have experienced.', ta: 'நீங்கள் அனுபவித்த ஒரு ஆழமான காதல் தருணத்தை அமைதியாக நினைத்துப்பார்க்க இன்று ஐந்து நிமிடங்கள் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'Whose memory brings you immediate comfort when you are in distress?', ta: 'நீங்கள் துன்பத்தில் இருக்கும்போது யாருடைய நினைவு உங்களுக்கு உடனடி ஆறுதலைத் தருகிறது?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'The Inner Hold', ta: 'உள்ளகப் பிடிப்பு' },
      explanation: { en: 'Prisoners who lost their "inner hold"—their faith in the future or their sense of purpose—rapidly declined physically and died.', ta: 'தங்களது "உள்ளகப் பிடிப்பை"—எதிர்காலத்தின் மீதான நம்பிக்கையை அல்லது நோக்கத்தின் உணர்வை—இழந்த கைதிகள் விரைவாக உடல்நிலை குறைந்து இறந்தனர்.' },
      whyItMatters: { en: 'Mental and physical health are deeply connected. Hopelessness literally kills. Maintaining hope is a survival requirement.', ta: 'மன மற்றும் உடல் ஆரோக்கியம் ஆழமாக இணைக்கப்பட்டுள்ளது. நம்பிக்கையின்மை நிஜமாகவே கொல்லும். நம்பிக்கையைப் பேணுவது உயிர்வாழ்வதற்கான ஒரு தேவையாகும்.' },
      example: { en: 'A prisoner who dreamed he would be liberated on March 30th. When the day came and he was not freed, he suddenly fell ill and died the next day.', ta: 'மார்ச் 30 ஆம் தேதி தான் விடுவிக்கப்படுவோம் என்று கனவு கண்ட ஒரு கைதி. அந்த நாள் வந்து அவன் விடுவிக்கப்படாதபோது, அவன் திடீரென நோய்வாய்ப்பட்டு அடுத்த நாளே இறந்தான்.' },
      actionStep: { en: 'Create a vivid, specific goal for your future that excites you enough to get you through today’s difficulties.', ta: 'இன்றைய சிரமங்களைச் சமாளிக்கும் அளவுக்கு உங்களை உற்சாகப்படுத்தும் உங்களின் எதிர்காலத்திற்கான தெளிவான, குறிப்பிட்ட இலக்கை உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'Are you keeping your "inner hold" strong, or are you letting despair weaken your spirit?', ta: 'உங்கள் "உள்ளகப் பிடிப்பை" வலுவாக வைத்திருக்கிறீர்களா, அல்லது விரக்தி உங்கள் ஆன்மாவை பலவீனப்படுத்த அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Logotherapy', ta: 'லாகோதெரபி (அர்த்த சிகிச்சை)' },
      explanation: { en: 'Frankl’s psychological school of thought. While Freud believed humans are driven by the pursuit of pleasure (psychoanalysis), Frankl believed we are driven by the pursuit of meaning.', ta: 'பிராங்க்லின் உளவியல் சிந்தனைப் பள்ளி. மனிதர்கள் இன்பத்தைத் தேடுவதால் தூண்டப்படுகிறார்கள் என்று பிராய்ட் நம்பியபோது (உளப்பகுப்பாய்வு), மனிதர்கள் அர்த்தத்தைத் தேடுவதால் தூண்டப்படுகிறார்கள் என்று பிராங்க்ல் நம்பினார்.' },
      whyItMatters: { en: 'Pleasure is fleeting and ultimately leaves us empty. Meaning provides lasting satisfaction and the strength to endure hardship.', ta: 'இன்பம் விரைந்து செல்லக்கூடியது மற்றும் இறுதியில் நம்மை வெறுமையாக்குகிறது. அர்த்தம் நீடித்த திருப்தியையும் கஷ்டத்தைத் தாங்கும் வலிமையையும் தருகிறது.' },
      example: { en: 'A billionaire who is deeply depressed because their life lacks meaning, versus a poor teacher who is deeply fulfilled by educating children.', ta: 'தங்கள் வாழ்க்கையில் அர்த்தம் இல்லாததால் ஆழ்ந்த மனச்சோர்வடைந்த ஒரு கோடீஸ்வரர், vs குழந்தைகளுக்குக் கற்பிப்பதன் மூலம் ஆழ்ந்த திருப்தி அடைந்த ஒரு ஏழை ஆசிரியர்.' },
      actionStep: { en: 'Evaluate your current goals. Are you chasing them for temporary pleasure, or for lasting meaning?', ta: 'உங்கள் தற்போதைய இலக்குகளை மதிப்பிடுங்கள். நீங்கள் தற்காலிக இன்பத்திற்காக அவற்றைத் துரத்துகிறீர்களா அல்லது நீடித்த அர்த்தத்திற்காகவா?' },
      reflectionQuestion: { en: 'If you had unlimited money and pleasure tomorrow, what would you do to make your life meaningful?', ta: 'நாளை உங்களிடம் வரம்பற்ற பணமும் இன்பமும் இருந்தால், உங்கள் வாழ்க்கையை அர்த்தமுள்ளதாக்க நீங்கள் என்ன செய்வீர்கள்?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Responsibleness', ta: 'பொறுப்புணர்வு' },
      explanation: { en: 'Freedom is only half of the truth. Freedom without responsibility threatens to degenerate into arbitrariness. Frankl suggested a Statue of Responsibility on the West Coast to balance the Statue of Liberty.', ta: 'சுதந்திரம் என்பது பாதி உண்மை மட்டுமே. பொறுப்பு இல்லாத சுதந்திரம் எதேச்சாதிகாரமாகச் சீரழியும் அச்சுறுத்தலைக் கொண்டுள்ளது. சுதந்திர தேவி சிலைக்கு சமநிலையாக மேற்கு கடற்கரையில் பொறுப்புணர்வுக்கான சிலை ஒன்றை அமைக்க பிராங்க்ல் பரிந்துரைத்தார்.' },
      whyItMatters: { en: 'You are free to choose, but you are also responsible for the choices you make and the impact they have on the world and others.', ta: 'தேர்வு செய்ய உங்களுக்கு சுதந்திரம் உள்ளது, ஆனால் நீங்கள் செய்யும் தேர்வுகளுக்கும் அவை உலகத்தின் மீதும் மற்றவர்கள் மீதும் ஏற்படுத்தும் தாக்கத்திற்கும் நீங்களே பொறுப்பு.' },
      example: { en: 'Choosing not to retaliate when someone insults you, taking responsibility for maintaining peace rather than exercising your freedom to be cruel.', ta: 'யாராவது உங்களை அவமதிக்கும்போது பதிலடி கொடுக்க வேண்டாம் என்று தேர்ந்தெடுப்பது, கொடூரமானவராக இருக்க உங்கள் சுதந்திரத்தைப் பயன்படுத்துவதற்குப் பதிலாக அமைதியைப் பேணுவதற்கான பொறுப்பை ஏற்றுக்கொள்வது.' },
      actionStep: { en: 'Identify one area where you demand freedom but avoid taking responsibility. Commit to owning the consequences.', ta: 'நீங்கள் சுதந்திரத்தைக் கோரும் ஆனால் பொறுப்பை ஏற்கத் தவிர்க்கும் ஒரு பகுதியைக் கண்டறியவும். அதன் விளைவுகளை ஏற்றுக்கொள்ள உறுதியளியுங்கள்.' },
      reflectionQuestion: { en: 'Are you using your freedom to build something meaningful, or just to do whatever you want?', ta: 'ஏதேனும் அர்த்தமுள்ள ஒன்றை உருவாக்க உங்கள் சுதந்திரத்தைப் பயன்படுத்துகிறீர்களா, அல்லது நீங்கள் விரும்புவதைச் செய்ய மட்டுமா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Existential Vacuum', ta: 'இருத்தலியல் வெற்றிடம்' },
      explanation: { en: 'A state of emptiness and boredom that occurs when a person lacks a sense of meaning. It often manifests as depression, aggression, or addiction.', ta: 'ஒரு நபருக்கு அர்த்த உணர்வு இல்லாதபோது ஏற்படும் வெறுமை மற்றும் சலிப்பு நிலை. இது பெரும்பாலும் மனச்சோர்வு, ஆக்கிரமிப்பு அல்லது அடிமைத்தனம் என வெளிப்படுகிறது.' },
      whyItMatters: { en: 'Modern society provides us with the means to live, but often fails to provide us with a reason to live. Boredom is a warning sign of an empty life.', ta: 'நவீன சமூகம் நமக்கு வாழ வழிகளை வழங்குகிறது, ஆனால் பெரும்பாலும் வாழ்வதற்கான காரணத்தை வழங்கத் தவறிவிடுகிறது. சலிப்பு என்பது வெற்று வாழ்க்கையின் எச்சரிக்கை அறிகுறியாகும்.' },
      example: { en: '"Sunday neurosis"—that feeling of emptiness people get at the end of the workweek when they realize their life has no content outside of their job.', ta: '"ஞாயிறு நரம்பியல்"—தங்கள் வேலைக்கு வெளியே தங்கள் வாழ்க்கையில் எந்த உள்ளடக்கமும் இல்லை என்பதை உணரும்போது வேலை வாரத்தின் முடிவில் மக்கள் பெறும் வெறுமை உணர்வு.' },
      actionStep: { en: 'Notice when you feel bored or empty. Instead of scrolling on your phone to distract yourself, ask what meaningful task you are avoiding.', ta: 'நீங்கள் சலிப்பாகவோ அல்லது வெறுமையாகவோ உணரும்போது கவனியுங்கள். உங்களை திசைதிருப்ப உங்கள் தொலைபேசியை ஸ்க்ரோலிங் செய்வதற்குப் பதிலாக, நீங்கள் எந்த அர்த்தமுள்ள பணியைத் தவிர்க்கிறீர்கள் என்று கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you fill your free time with mindless entertainment to avoid facing the emptiness of your goals?', ta: 'உங்கள் இலக்குகளின் வெறுமையை எதிர்கொள்வதைத் தவிர்ப்பதற்காக உங்களின் ஓய்வு நேரத்தை அர்த்தமற்ற பொழுதுபோக்குகளால் நிரப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Tragic Optimism', ta: 'துயரமான நம்பிக்கையவாதம்' },
      explanation: { en: 'The concept of remaining optimistic in spite of the "tragic triad": pain, guilt, and death. It means making the best of any given situation.', ta: 'வலி, குற்ற உணர்வு மற்றும் மரணம் என்ற "துயர மூவமைப்பு" இருந்தபோதிலும் நம்பிக்கையுடன் இருப்பதற்கான கருத்து. அதாவது எந்தவொரு சூழ்நிலையிலும் சிறந்ததை உருவாக்குவது.' },
      whyItMatters: { en: 'You cannot avoid pain, you cannot erase your past mistakes, and you will eventually die. But you can choose to extract meaning from all three.', ta: 'வலியிலிருந்து உங்களால் தப்பிக்க முடியாது, உங்கள் கடந்த கால தவறுகளை உங்களால் அழிக்க முடியாது, இறுதியில் நீங்கள் இறக்க நேரிடும். ஆனால் இந்த மூன்றிலிருந்தும் அர்த்தத்தைப் பெற நீங்கள் தேர்ந்தெடுக்கலாம்.' },
      example: { en: 'Turning suffering into a human achievement; deriving from guilt the opportunity to change for the better; taking life\'s transitoriness as an incentive to take responsible action.', ta: 'துன்பத்தை மனித சாதனையாக மாற்றுவது; குற்ற உணர்விலிருந்து சிறந்த முறையில் மாறுவதற்கான வாய்ப்பைப் பெறுவது; வாழ்க்கையின் நிலையற்ற தன்மையை பொறுப்பான நடவடிக்கை எடுப்பதற்கான ஊக்ககமாக எடுத்துக்கொள்வது.' },
      actionStep: { en: 'Forgive yourself for a past mistake (guilt) by committing to helping someone else avoid that same mistake today.', ta: 'அதே தவறை இன்று வேறொருவர் தவிர்க்க உதவுவதாக உறுதியளிப்பதன் மூலம் கடந்த கால தவறுக்காக (குற்ற உணர்வு) உங்களை நீங்களே மன்னியுங்கள்.' },
      reflectionQuestion: { en: 'Are you paralyzed by the tragedies of life, or are you using them as fuel to live more intentionally?', ta: 'வாழ்க்கையின் துயரங்களால் நீங்கள் முடங்கிப் போயிருக்கிறீர்களா, அல்லது அவற்றை அதிக நோக்கத்துடன் வாழ எரிபொருளாகப் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The Delusion of Reprieve', ta: 'தண்டனை குறைப்பு என்ற மாயை' },
      explanation: { en: 'A psychological condition where condemned people believe, right up until the very end, that they will be saved at the last minute.', ta: 'மரண தண்டனை விதிக்கப்பட்டவர்கள் கடைசி நிமிடம் வரை தாங்கள் காப்பாற்றப்படுவோம் என்று நம்பும் ஒரு உளவியல் நிலை.' },
      whyItMatters: { en: 'While hope is necessary, false hope based on denial prevents you from accepting reality and dealing with it effectively.', ta: 'நம்பிக்கை அவசியமான அதேவேளையில், மறுப்பை அடிப்படையாகக் கொண்ட தவறான நம்பிக்கை யதார்த்தத்தை ஏற்றுக்கொண்டு அதைத் திறம்படக் கையாளுவதைத் தடுக்கிறது.' },
      example: { en: 'Prisoners arriving at Auschwitz believing the chimneys were just factories, blinding themselves to the horrific reality to protect their minds.', ta: 'ஆஷ்விட்ஸ் முகாமிற்கு வந்த கைதிகள் அங்குள்ள புகைபோக்கிகள் வெறும் தொழிற்சாலைகள் என்று நம்பியது, தங்கள் மனதைப் பாதுகாக்க பயங்கரமான யதார்த்தத்திலிருந்து தங்களைக் குருடாக்கிக்கொண்டது.' },
      actionStep: { en: 'Confront a harsh reality in your life that you have been in denial about. Face the truth so you can actually do something about it.', ta: 'நீங்கள் மறுத்துக்கொண்டிருக்கும் உங்கள் வாழ்க்கையின் கடுமையான யதார்த்தத்தை எதிர்கொள்ளுங்கள். உண்மையை எதிர்கொள்ளுங்கள், அப்போதுதான் உங்களால் அதைச் சரிசெய்ய முடியும்.' },
      reflectionQuestion: { en: 'What comforting lie are you telling yourself to avoid a difficult action?', ta: 'ஒரு கடினமான செயலைத் தவிர்ப்பதற்காக உங்களுக்கு நீங்களே என்ன ஆறுதலான பொய்யைச் சொல்கிறீர்கள்?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'The Depersonalization of Survival', ta: 'உயிர்வாழ்வதற்கான ஆளுமை இழப்பு' },
      explanation: { en: 'After release, prisoners experienced depersonalization—everything felt unreal, like a dream. They had lost the ability to feel joy because their emotions had been numbed for so long.', ta: 'விடுவிக்கப்பட்ட பிறகு, கைதிகள் ஆளுமை இழப்பை அனுபவித்தனர் - எல்லாம் ஒரு கனவு போல உண்மையற்றதாக உணர்ந்தனர். அவர்களின் உணர்ச்சிகள் நீண்ட காலமாக மரத்துப்போயிருந்ததால் மகிழ்ச்சியை உணரும் திறனை அவர்கள் இழந்திருந்தனர்.' },
      whyItMatters: { en: 'Healing takes time. You cannot instantly switch from survival mode to thriving mode. The capacity for joy must be slowly relearned.', ta: 'குணமடைய நேரம் எடுக்கும். தப்பிப்பிழைக்கும் பயன்முறையிலிருந்து செழிப்பான பயன்முறைக்கு உங்களால் உடனடியாக மாற முடியாது. மகிழ்ச்சிக்கான திறன் மெதுவாக மீண்டும் கற்றுக்கொள்ளப்பட வேண்டும்.' },
      example: { en: 'Walking through a beautiful meadow after liberation and feeling completely numb, unable to appreciate the beauty of freedom.', ta: 'விடுதலைக்குப் பிறகு ஒரு அழகான புல்வெளி வழியாக நடக்கும்போது முற்றிலும் உணர்ச்சியற்றுப் போய், சுதந்திரத்தின் அழகைப் பாராட்ட முடியாமல் இருப்பது.' },
      actionStep: { en: 'If you are recovering from a hard time, be patient with yourself. Do not force yourself to feel "happy" immediately.', ta: 'நீங்கள் ஒரு கடினமான காலகட்டத்திலிருந்து மீண்டு வருகிறீர்கள் என்றால், உங்களிடம் பொறுமையாக இருங்கள். உடனடியாக "மகிழ்ச்சியாக" உணர உங்களை வற்புறுத்த வேண்டாம்.' },
      reflectionQuestion: { en: 'Are you frustrated with yourself for not feeling joyous, instead of giving yourself time to heal?', ta: 'குணமடைய உங்களுக்கு நேரம் கொடுப்பதற்குப் பதிலாக, மகிழ்ச்சியாக உணரவில்லை என்பதற்காக உங்களின் மீது நீங்கள் விரக்தியடைகிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'No Man Has the Right to Do Wrong', ta: 'தவறு செய்ய எந்த மனிதனுக்கும் உரிமையில்லை' },
      explanation: { en: 'Even if you have suffered terribly, that suffering does not give you the right to inflict suffering on others.', ta: 'நீங்கள் பயங்கரமாகத் துன்பப்பட்டிருந்தாலும், அந்தத் துன்பம் மற்றவர்களுக்குத் துன்பத்தை ஏற்படுத்தும் உரிமையை உங்களுக்கு வழங்காது.' },
      whyItMatters: { en: 'The cycle of abuse must stop with you. Justifying cruel behavior because you were a victim turns you into the oppressor.', ta: 'துஷ்பிரயோகத்தின் சுழற்சி உங்களுடன் நிற்க வேண்டும். நீங்கள் பலியாக இருந்தீர்கள் என்பதற்காக கொடூரமான நடத்தையை நியாயப்படுத்துவது உங்களை ஒடுக்குபவராக மாற்றுகிறது.' },
      example: { en: 'A liberated prisoner destroying a farmer\'s crops out of anger for what he endured. Frankl corrected him, saying suffering doesn\'t justify further destruction.', ta: 'விடுவிக்கப்பட்ட ஒரு கைதி, தான் அனுபவித்த துன்பத்திற்கான கோபத்தில் ஒரு விவசாயியின் பயிர்களை அழிப்பது. பிராங்க்ல் அவரைத் திருத்தி, துன்பம் மேலும் அழிவை நியாயப்படுத்தாது என்று கூறினார்.' },
      actionStep: { en: 'Catch yourself before you snap at someone today just because you are having a bad day. Stop the cycle.', ta: 'இன்று உங்களுக்கு ஒரு மோசமான நாளாக இருக்கிறது என்பதற்காக மட்டுமே நீங்கள் யாரையாவது கோபமாகத் திட்டுவதற்கு முன்பு உங்களைக் கட்டுப்படுத்துங்கள். சுழற்சியை நிறுத்துங்கள்.' },
      reflectionQuestion: { en: 'Do you use your past trauma as an excuse to treat people poorly today?', ta: 'இன்று மக்களை மோசமாக நடத்துவதற்கு உங்கள் கடந்த கால அதிர்ச்சியை நீங்கள் ஒரு சாக்காகப் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Paradoxical Intention', ta: 'முரண்பாடான நோக்கம்' },
      explanation: { en: 'A therapeutic technique where you try to make your fear happen on purpose. By wishing for the thing you fear, the fear itself disappears.', ta: 'உங்கள் பயத்தை வேண்டுமென்றே நடக்க வைக்க முயற்சிக்கும் ஒரு சிகிச்சை நுட்பம். நீங்கள் பயப்படும் விஷயத்தை விரும்புவதன் மூலம், பயமே மறைந்துவிடும்.' },
      whyItMatters: { en: 'Anticipatory anxiety causes the very thing you are afraid of (e.g., fearing you will stutter makes you stutter). Embracing it breaks the cycle.', ta: 'எதிர்பார்ப்பு கவலை நீங்கள் பயப்படும் விஷயத்தையே ஏற்படுத்துகிறது (எ.கா., திக்குவாய் ஆகிவிடுவோமோ என்று பயப்படுவது உங்களை திக்குவாய் ஆக்குகிறது). அதை ஏற்றுக்கொள்வது சுழற்சியை உடைக்கிறது.' },
      example: { en: 'A person who sweats excessively from anxiety is told to try and sweat as much as humanly possible on purpose. Once they try to do it, they can\'t.', ta: 'கவலையால் அதிகமாக வியர்க்கும் ஒரு நபரிடம், வேண்டுமென்றே முடிந்தவரை அதிகமாக வியர்க்க முயற்சிக்குமாறு கூறப்படுகிறது. அவர்கள் அதைச் செய்ய முயற்சிக்கும்போது, அவர்களால் முடியாது.' },
      actionStep: { en: 'The next time you are nervous about a physical symptom (blushing, shaking), challenge yourself to do it as much as you can. Watch the fear vanish.', ta: 'அடுத்த முறை நீங்கள் உடல் ரீதியான அறிகுறியைப் பற்றி (முகம் சிவப்பது, நடுங்குவது) பதட்டமாக உணரும்போது, முடிந்தவரை அதைச் செய்ய உங்களுக்கு நீங்களே சவால் விடுங்கள். பயம் மறைவதைப் பாருங்கள்.' },
      reflectionQuestion: { en: 'Is your fear of failure the exact thing that is making you fail?', ta: 'உங்களின் தோல்வி பயம்தான் உங்களைத் தோல்வியடையச் செய்கிறதா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'The Past is Safe', ta: 'கடந்த காலம் பாதுகாப்பானது' },
      explanation: { en: 'Nothing in the past can be changed, but everything you have experienced, learned, and loved is safely stored there forever. It cannot be taken away.', ta: 'கடந்த காலத்தில் எதையும் மாற்ற முடியாது, ஆனால் நீங்கள் அனுபவித்த, கற்றுக்கொண்ட மற்றும் நேசித்த அனைத்தும் அங்கு நிரந்தரமாகப் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன. அதை பறிக்க முடியாது.' },
      whyItMatters: { en: 'Instead of viewing the past with regret, view it as a granary where you have safely stored your harvest. A full past is a rich life.', ta: 'கடந்த காலத்தை வருத்தத்துடன் பார்ப்பதற்குப் பதிலாக, உங்கள் அறுவடையை நீங்கள் பாதுகாப்பாக சேமித்து வைக்கும் களஞ்சியமாக அதைப் பாருங்கள். ஒரு முழுமையான கடந்த காலம் ஒரு வளமான வாழ்க்கை.' },
      example: { en: 'An old man feeling proud of the good deeds he has done and the love he has shared, knowing neither time nor death can erase that reality.', ta: 'நேரமோ அல்லது மரணமோ அந்த யதார்த்தத்தை அழிக்க முடியாது என்பதை அறிந்து, தான் செய்த நற்செயல்களையும் பகிர்ந்த அன்பையும் எண்ணிப் பெருமைப்படும் ஒரு முதியவர்.' },
      actionStep: { en: 'Write down three beautiful memories that are "safely stored" in your past, things nobody can ever rob you of.', ta: 'உங்கள் கடந்த காலத்தில் "பாதுகாப்பாக சேமிக்கப்பட்ட" மூன்று அழகான நினைவுகளை எழுதுங்கள், அதை யாராலும் உங்களிடமிருந்து கொள்ளையடிக்க முடியாது.' },
      reflectionQuestion: { en: 'Do you view aging as losing the future, or as safely storing away a rich past?', ta: 'வயதாவதை எதிர்காலத்தை இழப்பதாகப் பார்க்கிறீர்களா, அல்லது வளமான கடந்த காலத்தைப் பாதுகாப்பாகச் சேமிப்பதாகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Tension is Necessary', ta: 'பதற்றம் அவசியமானது' },
      explanation: { en: 'Mental health does not require a tension-less state. It requires the tension of striving for a worthwhile goal.', ta: 'மன ஆரோக்கியத்திற்கு பதற்றமற்ற நிலை தேவையில்லை. ஒரு தகுதியான இலக்கை அடைய பாடுபடும் பதற்றம் அதற்குத் தேவை.' },
      whyItMatters: { en: 'People seek a stress-free life, but absolute lack of stress leads to the existential vacuum. We need the pull of meaning to keep us alive.', ta: 'மக்கள் மன அழுத்தமில்லாத வாழ்க்கையைத் தேடுகிறார்கள், ஆனால் மன அழுத்தத்தின் முழுமையான இல்லாமை இருத்தலியல் வெற்றிடத்திற்கு வழிவகுக்கிறது. நம்மை உயிர்ப்புடன் வைத்திருக்க நமக்கு அர்த்தத்தின் ஈர்ப்பு தேவை.' },
      example: { en: 'An architect feeling the healthy stress of designing a beautiful building, versus a retiree sitting at home feeling completely useless.', ta: 'ஒரு அழகான கட்டிடத்தை வடிவமைப்பதன் ஆரோக்கியமான அழுத்தத்தை உணரும் ஒரு கட்டிடக் கலைஞர், vs வீட்டில் முற்றிலும் பயனற்றவராக உணரும் ஒரு ஓய்வு பெற்றவர்.' },
      actionStep: { en: 'Stop trying to eliminate all stress. Embrace "eustress" (positive stress) by taking on a challenging project that matters to you.', ta: 'அனைத்து மன அழுத்தங்களையும் அகற்றும் முயற்சியை நிறுத்துங்கள். உங்களுக்கு முக்கியமான சவாலான திட்டத்தை மேற்கொள்வதன் மூலம் "நல்ல அழுத்தத்தை" (நேர்மறையான மன அழுத்தம்) ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Is your goal to be comfortable, or is your goal to be useful?', ta: 'உங்கள் இலக்கு வசதியாக இருப்பதா, அல்லது பயனுள்ளதாக இருப்பதா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Two Races of Men', ta: 'இரண்டு இன மனிதர்கள்' },
      explanation: { en: 'There are only two races of men in this world: the "decent" man and the "indecent" man. Both are found in every group, nationality, and society.', ta: 'இந்த உலகில் இரண்டு இன மனிதர்கள் மட்டுமே உள்ளனர்: "கண்ணியமான" மனிதன் மற்றும் "கண்ணியமற்ற" மனிதன். ஒவ்வொரு குழு, தேசியம் மற்றும் சமூகத்திலும் இவர்கள் இருவரும் காணப்படுகிறார்கள்.' },
      whyItMatters: { en: 'You cannot judge a person purely by their group affiliation. Good and evil run through the heart of every human being.', ta: 'ஒரு நபரின் குழு இணைப்பை வைத்து மட்டுமே அவரை உங்களால் மதிப்பிட முடியாது. நன்மையும் தீமையும் ஒவ்வொரு மனிதனின் இதயத்திலும் ஓடுகிறது.' },
      example: { en: 'Frankl noting that there were cruel prisoners (Capos) and also kind camp guards who secretly smuggled food to the inmates.', ta: 'கொடூரமான கைதிகளும் (காபோக்கள்), கைதிகளுக்கு ரகசியமாக உணவைக் கடத்திய அன்பான முகாம்க் காவலர்களும் இருந்ததை பிராங்க்ல் குறிப்பிட்டார்.' },
      actionStep: { en: 'Judge individuals only by their specific actions, not by the label or group they belong to.', ta: 'தனிநபர்களை அவர்கள் சார்ந்திருக்கும் முத்திரை அல்லது குழுவின் மூலம் அல்லாமல், அவர்களின் குறிப்பிட்ட செயல்களால் மட்டுமே மதிப்பிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you prejudiced against certain groups, ignoring the fact that decency is an individual choice?', ta: 'கண்ணியம் என்பது தனிப்பட்ட தேர்வு என்ற உண்மையை புறக்கணித்து, குறிப்பிட்ட குழுக்களுக்கு எதிராக நீங்கள் பாரபட்சம் காட்டுகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Live as if for the Second Time', ta: 'இரண்டாவது முறை வாழ்வதைப் போல வாழுங்கள்' },
      explanation: { en: 'Live as if you were living already for the second time and as if you had acted the first time as wrongly as you are about to act now.', ta: 'நீங்கள் ஏற்கனவே இரண்டாவது முறையாக வாழ்வதைப் போலவும், இப்போது நீங்கள் எவ்வளவு தவறாகச் செயல்படப் போகிறீர்களோ அதே போல முதல் முறையும் தவறாகச் செயல்பட்டதைப் போலவும் வாழுங்கள்.' },
      whyItMatters: { en: 'This perspective forces you to realize the finality of your choices and gives you the opportunity to correct your path before it’s too late.', ta: 'இந்தக் கண்ணோட்டம் உங்கள் தேர்வுகளின் இறுதியை உணர உங்களை வற்புறுத்துகிறது மற்றும் மிகவும் தாமதமாகிவிடும் முன் உங்கள் பாதையைத் திருத்திக்கொள்ளும் வாய்ப்பை வழங்குகிறது.' },
      example: { en: 'About to yell at your spouse, imagining that you are on your deathbed regretting it, and then choosing to speak kindly instead.', ta: 'உங்கள் துணையிடம் கத்தப் போகிறீர்கள், நீங்கள் மரணப்படுக்கையில் அதை எண்ணி வருந்துவதைக் கற்பனை செய்து பார்த்துவிட்டு, அதற்குப் பதிலாக அன்பாகப் பேசத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Before making a major decision today, ask yourself: "If I was at the end of my life looking back, would I regret this action?"', ta: 'இன்று ஒரு முக்கிய முடிவை எடுப்பதற்கு முன், உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "நான் என் வாழ்க்கையின் முடிவில் இருந்து திரும்பிப் பார்த்தால், இந்தச் செயலுக்காக நான் வருந்துவேனா?"' },
      reflectionQuestion: { en: 'If you could redo yesterday knowing what you know now, what would you have done differently?', ta: 'இப்போது உங்களுக்குத் தெரிந்த விஷயங்களை வைத்துக்கொண்டு நேற்றைய நாளை உங்களால் மீண்டும் செய்ய முடிந்தால், எதை வித்தியாசமாகச் செய்திருப்பீர்கள்?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'The Future is Open', ta: 'எதிர்காலம் திறந்திருக்கிறது' },
      explanation: { en: 'Humans are not fully conditioned or determined by their environment. We ultimately decide what our existence will be, what we will become in the next moment.', ta: 'மனிதர்கள் முழுமையாக நிலைநிறுத்தப்பட்டவர்களோ அல்லது அவர்களின் சூழலால் தீர்மானிக்கப்பட்டவர்களோ அல்ல. இறுதியில் நம் இருப்பு என்னவாக இருக்கும், அடுத்த கணத்தில் நாம் என்னவாக மாறுவோம் என்பதை நாமே தீர்மானிக்கிறோம்.' },
      whyItMatters: { en: 'You are not a helpless victim of your biology or your past. You have the ultimate freedom to change your trajectory right now.', ta: 'நீங்கள் உங்கள் உயிரியல் அல்லது கடந்த காலத்தின் ஆதரவற்ற பலியாடை அல்ல. இப்போது உங்கள் பாதையை மாற்றுவதற்கான இறுதி சுதந்திரம் உங்களுக்கு உள்ளது.' },
      example: { en: 'A person born into poverty and abuse choosing to become a loving, educated, and generous adult despite their conditioning.', ta: 'வறுமையிலும் துஷ்பிரயோகத்திலும் பிறந்த ஒருவர், தனது நிலைமைகள் எப்படி இருந்தாலும், ஒரு அன்பான, படித்த மற்றும் தாராள மனப்பான்மை கொண்ட நபராக மாறத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Acknowledge one negative trait you have always blamed on your "upbringing." Take ownership of changing it today.', ta: 'உங்கள் "வளர்ப்பு" மீது நீங்கள் எப்போதும் பழி சுமத்திய ஒரு எதிர்மறைப் பண்பை ஒப்புக்கொள்ளுங்கள். அதை இன்று மாற்றுவதற்கான பொறுப்பை ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you using the past as a cage, or do you recognize that the door to the future is wide open?', ta: 'கடந்த காலத்தை ஒரு கூண்டாகப் பயன்படுத்துகிறீர்களா, அல்லது எதிர்காலத்திற்கான கதவு அகலமாகத் திறந்திருப்பதை நீங்கள் அங்கீகரிக்கிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'Man\'s Search for Meaning' });
    if (existing) {
      console.log('Man\'s Search for Meaning already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'Man\'s Search for Meaning' });
    }
    
    await WisdomBook.create(mansSearchBook);
    console.log('Man\'s Search for Meaning added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
