import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const howToWinFriendsBook = {
  title: 'How to Win Friends and Influence People',
  author: 'Dale Carnegie',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg',
  categories: ['Communication', 'Self-Help', 'Business'],
  themes: [
    { en: 'Empathy & Influence', ta: 'பச்சாதாபம் மற்றும் செல்வாக்கு' },
    { en: 'Human Relations', ta: 'மனித உறவுகள்' }
  ],
  overview: {
    en: 'Since its release in 1936, Dale Carnegie\'s classic has helped millions achieve maximum potential in the complex world of human relations. It teaches you how to handle people smoothly, win them over to your way of thinking, and become a better leader without causing resentment.',
    ta: '1936 இல் வெளியானதிலிருந்து, டேல் கார்னகியின் இந்த உன்னதமான புத்தகம் சிக்கலான மனித உறவுகள் உலகில் பல மில்லியன் மக்கள் தங்கள் அதிகபட்ச திறனை அடைய உதவியுள்ளது. மனிதர்களை எவ்வாறு சுமூகமாகக் கையாளுவது, உங்கள் சிந்தனைக்கு அவர்களை எவ்வாறு வெல்வது மற்றும் மனக்கசப்பை ஏற்படுத்தாமல் சிறந்த தலைவராக மாறுவது எப்படி என்பதை இது கற்பிக்கிறது.'
  },
  topQuotes: [
    { en: 'You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.', ta: 'மற்றவர்களை உங்கள் மீது அக்கறை கொள்ளச் செய்ய இரண்டு வருடங்கள் முயற்சி செய்வதை விட, மற்றவர்கள் மீது நீங்கள் அக்கறை கொள்வதன் மூலம் இரண்டு மாதங்களில் அதிக நண்பர்களை உருவாக்க முடியும்.' },
    { en: 'When dealing with people, let us remember we are not dealing with creatures of logic. We are dealing with creatures of emotion.', ta: 'மனிதர்களுடன் பழகும்போது, நாம் தர்க்கரீதியான உயிரினங்களைக் கையாளவில்லை என்பதை நினைவில் கொள்வோம். நாம் உணர்ச்சிபூர்வமான உயிரினங்களைக் கையாளுகிறோம்.' },
    { en: 'Talk to someone about themselves and they\'ll listen for hours.', ta: 'ஒருவரிடம் அவர்களைப் பற்றிப் பேசுங்கள், அவர்கள் மணிக்கணக்கில் கேட்பார்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'Don\'t Criticize, Condemn, or Complain', ta: 'விமர்சிக்கவோ, கண்டிக்கவோ அல்லது புகார் செய்யவோ வேண்டாம்' },
      explanation: { en: 'Criticism puts people on the defensive and makes them strive to justify themselves. It wounds a person\'s precious pride, hurts their sense of importance, and arouses resentment.', ta: 'விமர்சனம் மனிதர்களைத் தற்காப்பு நிலைக்குத் தள்ளுகிறது மற்றும் அவர்களைத் தாங்களே நியாயப்படுத்திக் கொள்ளத் தூண்டுகிறது. இது ஒரு நபரின் விலைமதிப்பற்ற பெருமையைக் காயப்படுத்துகிறது, அவர்களின் முக்கியத்துவ உணர்வைப் புண்படுத்துகிறது மற்றும் மனக்கசப்பைத் தூண்டுகிறது.' },
      whyItMatters: { en: 'Any fool can criticize, condemn, and complain—and most fools do. But it takes character and self-control to be understanding and forgiving.', ta: 'எந்தவொரு முட்டாளும் விமர்சிக்கலாம், கண்டிக்கலாம் மற்றும் புகார் செய்யலாம்—பெரும்பாலான முட்டாள்கள் அதையே செய்கிறார்கள். ஆனால் புரிந்துகொள்ளவும் மன்னிக்கவும் நல்ல குணமும் சுயக்கட்டுப்பாடும் தேவை.' },
      example: { en: 'Instead of yelling at an employee for making a mistake, trying to understand why they made the mistake and helping them fix it.', ta: 'ஒரு தவறு செய்ததற்காக ஊழியரைத் திட்டுவதற்குப் பதிலாக, அவர் ஏன் அந்தத் தவறைச் செய்தார் என்பதைப் புரிந்து கொள்ள முயற்சிப்பதும், அதைச் சரிசெய்ய அவருக்கு உதவுவதும்.' },
      actionStep: { en: 'For the next 24 hours, completely ban the words "you should have" from your vocabulary and refrain from complaining about anyone.', ta: 'அடுத்த 24 மணி நேரத்திற்கு, "நீங்கள் இப்படிச் செய்திருக்க வேண்டும்" என்ற வார்த்தைகளை உங்கள் அகராதியிலிருந்து முற்றிலுமாகத் தடைசெய்து, யாரைப் பற்றியும் புகார் செய்வதைத் தவிர்க்கவும்.' },
      reflectionQuestion: { en: 'When was the last time criticism actually made someone change their mind enthusiastically?', ta: 'விமர்சனம் கடைசியாக எப்போது ஒருவரை உற்சாகமாக மனமாற்றம் செய்ய வைத்தது?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Give Honest and Sincere Appreciation', ta: 'நேர்மையான மற்றும் உண்மையான பாராட்டை வழங்குங்கள்' },
      explanation: { en: 'The deepest urge in human nature is the desire to be important. Flattery is fake and selfish, but sincere appreciation comes from the heart and makes people feel truly valued.', ta: 'மனித இயல்பின் ஆழ்ந்த உந்துதல் முக்கியமானவராக இருக்க வேண்டும் என்ற ஆசையாகும். முகஸ்துதி என்பது போலியானது மற்றும் சுயநலமானது, ஆனால் உண்மையான பாராட்டு இதயத்திலிருந்து வருகிறது மற்றும் மனிதர்களை உண்மையிலேயே மதிப்புமிக்கவர்களாக உணர வைக்கிறது.' },
      whyItMatters: { en: 'People will rarely work at their maximum potential under criticism, but they will blossom under sincere approval.', ta: 'விமர்சனத்தின் கீழ் மனிதர்கள் தங்கள் அதிகபட்ச திறனில் வேலை செய்வது அரிது, ஆனால் உண்மையான அங்கீகாரத்தின் கீழ் அவர்கள் மலருவார்கள்.' },
      example: { en: 'Thanking a janitor for keeping the office clean specifically pointing out how nice the lobby looked that morning, instead of just walking past them.', ta: 'அலுவலகத்தை சுத்தமாக வைத்திருப்பதற்காக துப்புரவுப் பணியாளரைக் கடந்து செல்வதற்குப் பதிலாக, இன்று காலை லாபி எவ்வளவு அழகாக இருந்தது என்பதைக் குறிப்பிட்டு நன்றி கூறுவது.' },
      actionStep: { en: 'Find one person today whose daily effort you usually take for granted, and give them a specific, heartfelt compliment.', ta: 'இன்று நீங்கள் வழக்கமாக சாதாரணமாக எடுத்துக்கொள்ளும் தினசரி முயற்சியைச் செய்யும் ஒருவரைக் கண்டறிந்து, அவர்களுக்கு ஒரு குறிப்பிட்ட, மனமார்ந்த பாராட்டைக் கொடுங்கள்.' },
      reflectionQuestion: { en: 'Are you withholding praise because you are too focused on your own problems?', ta: 'உங்களின் சொந்தப் பிரச்சனைகளில் அதிக கவனம் செலுத்துவதால் நீங்கள் பாராட்டுவதைத் தடுத்து நிறுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Arouse in the Other Person an Eager Want', ta: 'மற்றவரிடம் ஒரு ஆர்வமுள்ள விருப்பத்தைத் தூண்டுங்கள்' },
      explanation: { en: 'The only way to influence other people is to talk about what they want and show them how to get it. People don\'t care what you want; they care what they want.', ta: 'மற்றவர்களைச் செல்வாக்கு செலுத்துவதற்கான ஒரே வழி அவர்கள் விரும்புவதைப் பற்றி பேசுவதும், அதை எப்படிப் பெறுவது என்று அவர்களுக்குக் காட்டுவதுமே. நீங்கள் விரும்புவதை மக்கள் பொருட்படுத்துவதில்லை; அவர்கள் விரும்புவதையே அவர்கள் பொருட்படுத்துகிறார்கள்.' },
      whyItMatters: { en: 'If you want someone to do something, frame it entirely around how it benefits them, not how it benefits you.', ta: 'யாராவது ஒன்றைச் செய்ய வேண்டும் என்று நீங்கள் விரும்பினால், அது உங்களுக்கு எப்படிப் பயனளிக்கும் என்பதை விட, அவர்களுக்கு அது எப்படிப் பயனளிக்கும் என்பதைச் சுற்றி அதை முழுமையாக வடிவமைக்கவும்.' },
      example: { en: 'Instead of telling your child "Eat your vegetables because I said so," telling them "Eating vegetables will make you strong enough to beat your friends at basketball."', ta: 'உங்கள் குழந்தையிடம் "நான் சொல்கிறேன் காய்கறிகளைச் சாப்பிடு" என்று சொல்வதற்குப் பதிலாக, "காய்கறிகளைச் சாப்பிடுவது கூடைப்பந்தில் உன் நண்பர்களைத் தோற்கடிக்கும் அளவுக்கு உன்னை வலிமையாக்கும்" என்று சொல்வது.' },
      actionStep: { en: 'Before you ask someone for a favor today, pause and ask yourself: "How can I make this person want to do it?"', ta: 'இன்று யாரிடமாவது உதவி கேட்பதற்கு முன், இடைநிறுத்தி உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "இந்த நபர் இதைச் செய்ய விரும்புமாறு நான் எப்படிச் செய்வது?"' },
      reflectionQuestion: { en: 'Do your emails or requests start with "I need" or "I want"?', ta: 'உங்கள் மின்னஞ்சல்கள் அல்லது கோரிக்கைகள் "எனக்குத் தேவை" அல்லது "நான் விரும்புகிறேன்" என்று தொடங்குகின்றனவா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Become Genuinely Interested in Other People', ta: 'மற்றவர்கள் மீது உண்மையான ஆர்வம் கொள்ளுங்கள்' },
      explanation: { en: 'You can make more friends in two months by being interested in them than in two years by trying to make them interested in you. Everyone likes a good listener.', ta: 'உங்களைப் பற்றி மற்றவர்களை அக்கறை கொள்ளச் செய்ய இரண்டு வருடங்கள் முயற்சி செய்வதை விட, அவர்கள் மீது அக்கறை கொள்வதன் மூலம் இரண்டு மாதங்களில் நீங்கள் அதிக நண்பர்களை உருவாக்க முடியும். அனைவரும் நல்ல செவிமடுப்பவரை விரும்புகிறார்கள்.' },
      whyItMatters: { en: 'Trying to impress people pushes them away. Showing genuine curiosity about their lives draws them to you like a magnet.', ta: 'மக்களை ஈர்க்க முயற்சிப்பது அவர்களை விலகிச் செல்ல வைக்கிறது. அவர்களின் வாழ்க்கையைப் பற்றிய உண்மையான ஆர்வத்தைக் காட்டுவது ஒரு காந்தத்தைப் போல அவர்களை உங்களை நோக்கி ஈர்க்கிறது.' },
      example: { en: 'Remembering a coworker’s child’s name and asking how their recent soccer game went.', ta: 'ஒரு சக ஊழியரின் குழந்தையின் பெயரை நினைவில் வைத்துக்கொண்டு அவர்களின் சமீபத்திய கால்பந்து விளையாட்டு எப்படி இருந்தது என்று கேட்பது.' },
      actionStep: { en: 'In your next conversation, ask three consecutive follow-up questions about the other person\'s life before talking about yourself.', ta: 'உங்களின் அடுத்த உரையாடலில், உங்களைப் பற்றி பேசுவதற்கு முன் மற்றவரின் வாழ்க்கையைப் பற்றி தொடர்ந்து மூன்று பின்தொடர்தல் கேள்விகளைக் கேளுங்கள்.' },
      reflectionQuestion: { en: 'When someone is talking, are you listening, or are you just waiting for your turn to speak?', ta: 'யாராவது பேசும்போது, நீங்கள் கேட்கிறீர்களா, அல்லது நீங்கள் பேசுவதற்கான முறைக்காகக் காத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Smile', ta: 'புன்னகை' },
      explanation: { en: 'A smile says, "I like you. You make me happy. I am glad to see you." It costs nothing but creates much. It happens in a flash and the memory of it sometimes lasts forever.', ta: 'ஒரு புன்னகை, "எனக்கு உன்னைப் பிடிக்கும். நீ என்னை மகிழ்விக்கிறாய். உன்னைப் பார்த்ததில் மகிழ்ச்சி" என்று கூறுகிறது. அதற்கு எந்தச் செலவும் இல்லை ஆனால் நிறைய உருவாக்குகிறது. அது ஒரு நொடியில் நடக்கும், அதன் நினைவு சில நேரங்களில் என்றென்றும் நிலைத்திருக்கும்.' },
      whyItMatters: { en: 'Your expression is more important than the clothes you wear. A sincere smile makes people drop their guard and feel warmly toward you instantly.', ta: 'நீங்கள் அணியும் ஆடைகளை விட உங்கள் முகபாவனை முக்கியமானது. ஒரு உண்மையான புன்னகை மக்களை அவர்களின் தற்காப்பை கைவிடச் செய்து, உடனடியாக உங்கள் மீது அன்பான உணர்வை ஏற்படுத்துகிறது.' },
      example: { en: 'Greeting a grumpy receptionist with a massive, warm smile, completely changing the tone of the interaction.', ta: 'கோபமாக இருக்கும் வரவேற்பாளரை ஒரு பெரிய, அன்பான புன்னகையுடன் வாழ்த்துவது, உரையாடலின் தொனியை முழுமையாக மாற்றுகிறது.' },
      actionStep: { en: 'Smile at the first three strangers you make eye contact with today.', ta: 'இன்று நீங்கள் கண் தொடர்பு கொள்ளும் முதல் மூன்று அந்நியர்களைப் பார்த்துப் புன்னகைக்கவும்.' },
      reflectionQuestion: { en: 'Does your resting face look unapproachable to others?', ta: 'உங்களின் இயல்பான முகம் மற்றவர்கள் நெருங்க முடியாதது போல் தோன்றுகிறதா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Remember Their Name', ta: 'அவர்களின் பெயரை நினைவில் கொள்ளுங்கள்' },
      explanation: { en: 'A person\'s name is, to that person, the sweetest and most important sound in any language. Remembering it pays a subtle and very effective compliment.', ta: 'ஒரு நபரின் பெயர், அந்த நபருக்கு, எந்த மொழியிலும் இனிமையான மற்றும் மிக முக்கியமான ஒலியாகும். அதை நினைவில் கொள்வது நுட்பமான மற்றும் மிகவும் பயனுள்ள பாராட்டாகும்.' },
      whyItMatters: { en: 'Forgetting a name or misspelling it shows you don\'t care. Remembering it makes the person feel important and respected.', ta: 'ஒரு பெயரை மறந்துவிடுவது அல்லது தவறாக எழுதுவது உங்களுக்கு அக்கறை இல்லை என்பதைக் காட்டுகிறது. அதை நினைவில் கொள்வது அந்த நபரை முக்கியமானவராகவும் மதிக்கப்படுபவராகவும் உணர வைக்கிறது.' },
      example: { en: 'Franklin D. Roosevelt making it a point to remember the names of even the mechanics who worked on his car.', ta: 'பிராங்க்ளின் டி. ரூஸ்வெல்ட் தனது காரில் பணிபுரிந்த மெக்கானிக்குகளின் பெயர்களைக் கூட நினைவில் வைத்துக்கொள்வதை ஒரு கடமையாகக் கொண்டிருந்தார்.' },
      actionStep: { en: 'When you meet someone new today, repeat their name twice in the conversation to cement it in your memory.', ta: 'இன்று நீங்கள் புதிய ஒருவரைச் சந்திக்கும் போது, உங்கள் நினைவில் நிறுத்த உரையாடலில் அவர்களின் பெயரை இரண்டு முறை மீண்டும் சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Do you use the excuse "I\'m bad with names" to justify being too lazy to listen?', ta: 'கவனிக்க சோம்பேறித்தனமாக இருப்பதை நியாயப்படுத்த "எனக்குப் பெயர்கள் நினைவிருக்காது" என்ற சாக்குப்போக்கை நீங்கள் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Be a Good Listener', ta: 'ஒரு நல்ல செவிமடுப்பவராக இருங்கள்' },
      explanation: { en: 'Encourage others to talk about themselves. Exclusive attention to the person who is speaking is very important. Nothing else is so flattering as that.', ta: 'மற்றவர்களைத் தங்களைப் பற்றிப் பேச ஊக்குவியுங்கள். பேசும் நபர் மீது முழுமையான கவனம் செலுத்துவது மிகவும் முக்கியம். வேறு எதுவும் அந்த அளவுக்கு முகஸ்துதியானது அல்ல.' },
      whyItMatters: { en: 'Most people don\'t want advice or to be fixed; they just want to be heard and understood.', ta: 'பெரும்பாலான மக்கள் ஆலோசனையையோ அல்லது திருத்தப்படுவதையோ விரும்புவதில்லை; அவர்கள் கேட்கப்படவும் புரிந்து கொள்ளப்படவும் மட்டுமே விரும்புகிறார்கள்.' },
      example: { en: 'Sitting with a friend going through a tough time and just nodding and listening for an hour, without offering a single piece of advice.', ta: 'கடினமான நேரத்தைக் கடந்து செல்லும் நண்பருடன் உட்கார்ந்து, ஒரு வார்த்தை அறிவுரை கூட வழங்காமல், ஒரு மணிநேரம் தலையாட்டி மட்டும் கேட்பது.' },
      actionStep: { en: 'In your next conversation, aim to do 20% of the talking and 80% of the listening.', ta: 'உங்களின் அடுத்த உரையாடலில், 20% பேசவும் 80% கேட்கவும் இலக்கு வையுங்கள்.' },
      reflectionQuestion: { en: 'When someone tells a story, do you immediately follow up with a story about yourself?', ta: 'யாராவது ஒரு கதையைச் சொல்லும்போது, உடனடியாக உங்களைப் பற்றிய ஒரு கதையைத் தொடர்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Talk in Terms of the Other Person\'s Interests', ta: 'மற்ற நபரின் ஆர்வங்களுக்கு ஏற்பப் பேசுங்கள்' },
      explanation: { en: 'The royal road to a person\'s heart is to talk about the things they treasure most. Find out what they love and direct the conversation there.', ta: 'ஒரு நபரின் இதயத்திற்கான அரச பாதை என்பது அவர்கள் மிகவும் பொக்கிஷமாகக் கருதும் விஷயங்களைப் பற்றி பேசுவதாகும். அவர்கள் எதை விரும்புகிறார்கள் என்பதைக் கண்டுபிடித்து உரையாடலை அங்குத் திருப்புங்கள்.' },
      whyItMatters: { en: 'It instantly breaks the ice, creates a bond, and makes the other person favorably disposed toward you before you even ask for anything.', ta: 'இது உடனடியாகத் தயக்கத்தை உடைக்கிறது, ஒரு பிணைப்பை உருவாக்குகிறது, மேலும் நீங்கள் எதையும் கேட்பதற்கு முன்பே மற்ற நபரை உங்களுக்குச் சாதகமாக மாற்றுகிறது.' },
      example: { en: 'Reading up on a client\'s favorite sports team before a meeting so you can casually bring it up and connect with them.', ta: 'ஒரு சந்திப்பிற்கு முன் வாடிக்கையாளருக்குப் பிடித்த விளையாட்டுக் குழுவைப் பற்றிப் படிப்பது, இதனால் நீங்கள் சாதாரணமாக அதைப் பற்றிப் பேசி அவர்களுடன் இணையலாம்.' },
      actionStep: { en: 'Before meeting someone important, find out one thing they are passionate about and bring it up early in the conversation.', ta: 'முக்கியமான ஒருவரைச் சந்திப்பதற்கு முன், அவர்கள் அதிக ஆர்வமாக உள்ள ஒரு விஷயத்தைக் கண்டுபிடித்து உரையாடலின் ஆரம்பத்திலேயே அதைக் கொண்டு வாருங்கள்.' },
      reflectionQuestion: { en: 'Do you expect people to be interested in your hobbies while completely ignoring theirs?', ta: 'மக்களின் பொழுதுபோக்குகளை முற்றிலுமாகப் புறக்கணித்துவிட்டு, அவர்கள் உங்கள் பொழுதுபோக்குகளில் ஆர்வமாக இருக்க வேண்டும் என்று எதிர்பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Make the Other Person Feel Important', ta: 'மற்ற நபரை முக்கியமானவராக உணரச் செய்யுங்கள்' },
      explanation: { en: 'Do it sincerely. Almost all the people you meet feel themselves superior to you in some way, and a sure way to their hearts is to let them realize in some subtle way that you recognize their importance.', ta: 'அதை உண்மையாகச் செய்யுங்கள். நீங்கள் சந்திக்கும் ஏறக்குறைய அனைத்து மக்களும் ஏதோ ஒரு வகையில் உங்களை விடத் தங்களை உயர்ந்தவர்களாக உணர்கிறார்கள், அவர்களின் முக்கியத்துவத்தை நீங்கள் அங்கீகரிக்கிறீர்கள் என்பதைச் சில நுட்பமான வழிகளில் அவர்களை உணர வைப்பதே அவர்களின் இதயங்களுக்கான ஒரு உறுதியான வழியாகும்.' },
      whyItMatters: { en: 'Everyone craves appreciation and significance. When you fulfill that craving, they will do almost anything for you.', ta: 'அனைவரும் பாராட்டையும் முக்கியத்துவத்தையும் விரும்புகிறார்கள். அந்த ஏக்கத்தை நீங்கள் பூர்த்தி செய்யும்போது, அவர்கள் உங்களுக்காக ஏறக்குறைய எதையும் செய்வார்கள்.' },
      example: { en: 'Asking a junior employee for their advice on a problem, showing that you value their specific expertise.', ta: 'ஒரு பிரச்சினையில் ஜூனியர் ஊழியரிடம் அவர்களின் ஆலோசனையைக் கேட்பது, அவர்களின் குறிப்பிட்ட நிபுணத்துவத்தை நீங்கள் மதிக்கிறீர்கள் என்பதைக் காட்டுகிறது.' },
      actionStep: { en: 'Ask a colleague or friend for their advice on a subject you know they are good at, explicitly stating you value their opinion.', ta: 'உங்களுக்குத் தெரிந்த ஒரு விஷயத்தில் அவர்களின் கருத்து மதிப்புமிக்கது என்று வெளிப்படையாகக் கூறி, ஒரு சக ஊழியர் அல்லது நண்பரிடம் ஆலோசனை கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you make people feel small to make yourself feel big?', ta: 'உங்களை பெரியவராக உணர வைப்பதற்காக மற்றவர்களைச் சிறியவர்களாக உணர வைக்கிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Only Way to Get the Best of an Argument is to Avoid It', ta: 'ஒரு விவாதத்தில் வெற்றிபெறுவதற்கான ஒரே வழி அதைத் தவிர்ப்பதுதான்' },
      explanation: { en: 'You can\'t win an argument. If you lose it, you lose it; and if you win it, you lose it because you have made the other person feel inferior and hurt their pride.', ta: 'உங்களால் ஒரு விவாதத்தில் வெற்றிபெற முடியாது. நீங்கள் தோற்றால், நீங்கள் தோற்றீர்கள்; நீங்கள் வென்றாலும், நீங்கள் தோற்றீர்கள், ஏனென்றால் நீங்கள் மற்ற நபரைத் தாழ்வாக உணரச் செய்து அவர்களின் பெருமையைக் காயப்படுத்தியுள்ளீர்கள்.' },
      whyItMatters: { en: 'Arguments rarely change minds; they only solidify existing opinions and breed resentment. A man convinced against his will is of the same opinion still.', ta: 'விவாதங்கள் அரிதாகவே மனதை மாற்றுகின்றன; அவை இருக்கும் கருத்துக்களை மட்டுமே உறுதிப்படுத்துகின்றன மற்றும் மனக்கசப்பை வளர்க்கின்றன. தன் விருப்பத்திற்கு மாறாக ஒப்புக்கொள்ள வைக்கப்பட்ட ஒரு மனிதன் இன்னும் அதே கருத்தில்தான் இருப்பான்.' },
      example: { en: 'Agreeing with a customer that a process is frustrating, rather than arguing with them about why the company policy is actually correct.', ta: 'நிறுவனத்தின் கொள்கை ஏன் உண்மையில் சரியானது என்று வாடிக்கையாளரிடம் வாதிடுவதை விட, ஒரு செயல்முறை எரிச்சலூட்டுகிறது என்பதை அவர்களுடன் ஏற்றுக்கொள்வது.' },
      actionStep: { en: 'Next time you disagree with someone over a trivial matter, simply say "You might be right" and let the conversation move on.', ta: 'அடுத்த முறை நீங்கள் ஒரு சிறிய விஷயத்திற்காக ஒருவருடன் உடன்படாத போது, "நீங்கள் சொல்வது சரியாக இருக்கலாம்" என்று எளிமையாகச் சொல்லிவிட்டு உரையாடலைத் தொடர அனுமதியுங்கள்.' },
      reflectionQuestion: { en: 'Would you rather be "right," or would you rather be well-liked and effective?', ta: 'நீங்கள் "சரியானவராக" இருக்க விரும்புவீர்களா, அல்லது அனைவராலும் விரும்பப்படுபவராகவும் பயனுள்ளவராகவும் இருக்க விரும்புவீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Show Respect for the Other Person\'s Opinions', ta: 'மற்ற நபரின் கருத்துக்களுக்கு மரியாதை காட்டுங்கள்' },
      explanation: { en: 'Never say, "You\'re wrong." That is a direct blow to their intelligence and pride. It makes them want to strike back.', ta: 'ஒருபோதும் "நீங்கள் தவறானவர்" என்று சொல்லாதீர்கள். அது அவர்களின் புத்திசாலித்தனத்திற்கும் பெருமைக்கும் விடப்படும் நேரடி அடியாகும். அது அவர்களைப் பதிலடி கொடுக்கத் தூண்டும்.' },
      whyItMatters: { en: 'Telling someone they are wrong shuts down communication. Approaching it with curiosity ("I thought otherwise, but let\'s look at the facts") keeps their mind open.', ta: 'ஒருவரிடம் அவர்கள் தவறு என்று சொல்வது தகவல் தொடர்பை நிறுத்துகிறது. அதை ஆர்வத்துடன் அணுகுவது ("நான் வேறுவிதமாக நினைத்தேன், ஆனால் உண்மைகளைப் பார்ப்போம்") அவர்களின் மனதைத் திறந்த நிலையில் வைத்திருக்கும்.' },
      example: { en: 'Saying, "I might be wrong, I frequently am. Let\'s examine the facts together," instead of "You have absolutely no idea what you are talking about."', ta: '"நான் தவறாக இருக்கலாம், நான் அடிக்கடி தவறு செய்கிறேன். நாம் உண்மைகளை ஒன்றாக ஆராய்வோம்" என்று சொல்வது, "நீங்கள் எதைப் பற்றி பேசுகிறீர்கள் என்று உங்களுக்குத் துளியும் தெரியவில்லை" என்று சொல்வதற்குப் பதிலாக.' },
      actionStep: { en: 'If someone makes a statement you know is false today, gently say, "That\'s interesting, how did you come to that conclusion?" instead of correcting them.', ta: 'இன்று யாராவது தவறானது என்று உங்களுக்குத் தெரிந்த ஒரு கருத்தைக் கூறினால், அவர்களைத் திருத்துவதற்குப் பதிலாக, மென்மையாக, "அது சுவாரஸ்யமானது, நீங்கள் எப்படி அந்த முடிவுக்கு வந்தீர்கள்?" என்று கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you correct people just to prove how smart you are?', ta: 'நீங்கள் எவ்வளவு புத்திசாலி என்பதை நிரூபிக்க மட்டுமே மக்களைத் திருத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'If You Are Wrong, Admit It Quickly and Emphatically', ta: 'நீங்கள் தவறு செய்தால், அதை விரைவாகவும் உறுதியாகவும் ஒப்புக்கொள்ளுங்கள்' },
      explanation: { en: 'When you are wrong, beating the other person to the punch by admitting your mistake disarms them. There is nothing left for them to fight against.', ta: 'நீங்கள் தவறு செய்யும் போது, மற்ற நபர் உங்களைக் குற்றம் சாட்டும் முன் உங்கள் தவறை ஒப்புக்கொள்வது அவர்களை நிராயுதபாணியாக்குகிறது. அவர்களுக்கு எதிர்த்துப் போராட எதுவும் இல்லை.' },
      whyItMatters: { en: 'Defending your mistakes makes you look weak and stubborn. Owning them quickly makes you look confident, responsible, and trustworthy.', ta: 'உங்கள் தவறுகளைத் தற்காத்துக்கொள்வது உங்களை பலவீனமாகவும் பிடிவாதக்காரராகவும் காட்டுகிறது. அவற்றை விரைவாக ஏற்றுக்கொள்வது உங்களை நம்பிக்கையானவராகவும், பொறுப்பானவராகவும், நம்பகமானவராகவும் காட்டுகிறது.' },
      example: { en: 'Calling your boss to say, "I messed up that report completely, it was entirely my fault," before they even have a chance to bring it up.', ta: 'உங்கள் முதலாளியை அழைத்து, "நான் அந்த அறிக்கையை முழுமையாகக் கெடுத்துவிட்டேன், இது முற்றிலும் என் தவறு" என்று அவர்கள் அதைப் பற்றிக் கேட்பதற்கு முன்பே சொல்வது.' },
      actionStep: { en: 'The next time you make an error at work or home, take 100% blame for it immediately before anyone else can point it out.', ta: 'அடுத்த முறை வேலையிலோ அல்லது வீட்டிலோ நீங்கள் ஒரு தவறு செய்யும்போது, மற்றவர்கள் அதைச் சுட்டிக்காட்டுவதற்கு முன்பே உடனடியாக அதற்கான 100% பழியையும் ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Do you waste energy making excuses instead of just apologizing and fixing the problem?', ta: 'மன்னிப்பு கேட்டு பிரச்சனையைச் சரிசெய்வதற்குப் பதிலாக, சாக்குப்போக்குகள் சொல்லி ஆற்றலை வீணடிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Begin in a Friendly Way', ta: 'நட்பான முறையில் தொடங்குங்கள்' },
      explanation: { en: 'If your heart is full of discord and ill feeling toward someone, no amount of logic will win them to your way of thinking. Kindness and friendliness change minds faster than bluster.', ta: 'உங்கள் இதயம் ஒருவர் மீதுள்ள கருத்து வேறுபாட்டாலும் தீய உணர்வாலும் நிறைந்திருந்தால், எந்த தர்க்கமும் அவர்களை உங்கள் சிந்தனைக்கு வெல்ல முடியாது. மிரட்டலை விட அன்பும் நட்பும் மனதை வேகமாக மாற்றும்.' },
      whyItMatters: { en: 'A drop of honey catches more flies than a gallon of gall. Starting a difficult conversation with anger guarantees the other person will shut down.', ta: 'ஒரு கேலன் கசப்பை விட ஒரு துளி தேன் அதிக ஈக்களைப் பிடிக்கும். கோபத்துடன் ஒரு கடினமான உரையாடலைத் தொடங்குவது மற்ற நபர் செவிசாய்க்க மாட்டார் என்பதற்கு உத்தரவாதம் அளிக்கிறது.' },
      example: { en: 'Starting a complaint about a noisy neighbor by bringing them cookies and complimenting their garden, before gently mentioning the noise.', ta: 'சத்தமிடும் அண்டை வீட்டார் பற்றிய புகாரைத் தொடங்குவதற்கு முன், அவர்களுக்கு குக்கீகளைக் கொண்டு சென்று அவர்களின் தோட்டத்தைப் பாராட்டி, பின்னர் சத்தத்தைப் பற்றி மென்மையாகக் குறிப்பிடுவது.' },
      actionStep: { en: 'When you need to bring up a problem with someone, start the conversation by acknowledging something you genuinely appreciate about them.', ta: 'யாரிடமாவது ஒரு பிரச்சினையைக் கொண்டுவர வேண்டியிருக்கும் போது, அவர்களைப் பற்றி நீங்கள் உண்மையிலேயே பாராட்டும் ஒன்றை ஒப்புக்கொண்டு உரையாடலைத் தொடங்குங்கள்.' },
      reflectionQuestion: { en: 'Do you storm into conflict, or do you take a moment to soften your approach first?', ta: 'நீங்கள் மோதலில் புயலென நுழைகிறீர்களா, அல்லது முதலில் உங்கள் அணுகுமுறையை மென்மையாக்க ஒரு கணம் எடுத்துக்கொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Get the Other Person Saying "Yes, Yes" Immediately', ta: 'மற்ற நபரை உடனடியாக "ஆம், ஆம்" என்று சொல்ல வையுங்கள்' },
      explanation: { en: 'In starting a conversation, don\'t begin by discussing the things on which you differ. Begin by emphasizing the things on which you agree.', ta: 'ஒரு உரையாடலைத் தொடங்கும் போது, நீங்கள் மாறுபடும் விஷயங்களைப் பற்றி விவாதிப்பதன் மூலம் தொடங்க வேண்டாம். நீங்கள் உடன்படும் விஷயங்களை வலியுறுத்துவதன் மூலம் தொடங்குங்கள்.' },
      whyItMatters: { en: 'When a person says "No," all their pride demands they remain consistent with it. Getting them in a "Yes" momentum makes them more open and agreeable.', ta: '"இல்லை" என்று ஒரு நபர் கூறும்போது, அவர்களின் அனைத்துப் பெருமையும் அதனுடன் நிலைத்திருக்கக் கோருகிறது. அவர்களை "ஆம்" என்ற வேகத்தில் கொண்டு செல்வது அவர்களை மேலும் திறந்த மனதுடனும் ஏற்றுக்கொள்ளக்கூடியவர்களாகவும் ஆக்குகிறது.' },
      example: { en: 'A salesperson asking, "You want the best safety for your family, right?" (Yes) "And you want to save money on gas?" (Yes) before pitching a car.', ta: 'ஒரு விற்பனையாளர் காரை விற்பதற்கு முன், "உங்கள் குடும்பத்திற்குச் சிறந்த பாதுகாப்பை நீங்கள் விரும்புகிறீர்கள், இல்லையா?" (ஆம்) "மேலும் நீங்கள் பெட்ரோல் செலவை மிச்சப்படுத்த விரும்புகிறீர்களா?" (ஆம்) என்று கேட்பது.' },
      actionStep: { en: 'Before pitching an idea today, ask two questions that the listener absolutely has to agree with and answer "Yes" to.', ta: 'இன்று ஒரு யோசனையை முன்வைப்பதற்கு முன், கேட்பவர் முற்றிலும் உடன்பட்டு "ஆம்" என்று பதிலளிக்க வேண்டிய இரண்டு கேள்விகளைக் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Do you lead with points of friction instead of finding common ground first?', ta: 'முதலில் பொதுவான விஷயங்களைக் கண்டுபிடிப்பதற்குப் பதிலாக முரண்பாடான கருத்துக்களுடன் தொடங்குகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Let the Other Person Do a Great Deal of the Talking', ta: 'மற்றவரை அதிகமாகப் பேச அனுமதியுங்கள்' },
      explanation: { en: 'Most people trying to win others to their way of thinking do too much talking themselves. Let the other people talk themselves out. They know more about their business and problems than you do.', ta: 'மற்றவர்களைத் தங்களின் சிந்தனைக்கு மாற்ற முயற்சிக்கும் பெரும்பாலான மக்கள் தாங்களே அதிகமாகப் பேசுகிறார்கள். மற்றவர்களைப் பேச அனுமதியுங்கள். உங்களை விட அவர்களின் வணிகம் மற்றும் பிரச்சனைகள் பற்றி அவர்களுக்கு அதிகம் தெரியும்.' },
      whyItMatters: { en: 'People love the sound of their own voice. Letting them talk makes them feel important and clears their mind so they are eventually ready to listen to you.', ta: 'மக்கள் தங்களின் சொந்தக் குரலின் ஒலியை விரும்புகிறார்கள். அவர்களைப் பேச அனுமதிப்பது அவர்களை முக்கியமானவர்களாக உணர வைக்கிறது மற்றும் அவர்களின் மனதைத் தெளிவாக்குகிறது, இதனால் அவர்கள் இறுதியில் உங்கள் பேச்சைக் கேட்கத் தயாராகிறார்கள்.' },
      example: { en: 'A salesman letting a complaining customer vent for 15 minutes straight without interrupting, after which the customer calmly bought the product.', ta: 'புகார் கூறும் வாடிக்கையாளரை குறுக்கிடாமல் தொடர்ந்து 15 நிமிடங்கள் பேச அனுமதித்த ஒரு விற்பனையாளர், அதன் பிறகு வாடிக்கையாளர் அமைதியாகப் பொருளை வாங்கினார்.' },
      actionStep: { en: 'Next time someone comes to you with a complaint, do not interrupt them or offer a solution until they have completely run out of words.', ta: 'அடுத்த முறை யாராவது உங்களிடம் புகாருடன் வரும்போது, அவர்களின் வார்த்தைகள் முற்றிலும் தீரும் வரை அவர்களைக் குறுக்கிடாதீர்கள் அல்லது தீர்வு சொல்லாதீர்கள்.' },
      reflectionQuestion: { en: 'Do you talk over people to prove you know the answer?', ta: 'உங்களுக்கு பதில் தெரியும் என்பதை நிரூபிக்க மக்களின் பேச்சின் குறுக்கே நீங்கள் பேசுகிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Let the Other Person Feel the Idea is Theirs', ta: 'யோசனை தங்களுடையது என்று மற்ற நபரை உணரச் செய்யுங்கள்' },
      explanation: { en: 'No one likes to feel that they are being sold something or told to do a thing. We much prefer to feel that we are buying of our own accord or acting on our own ideas.', ta: 'தங்களுக்கு ஒன்று விற்கப்படுகிறது அல்லது ஒன்றைச் செய்யச் சொல்லப்படுகிறது என்று உணர யாரும் விரும்புவதில்லை. நாம் சொந்த விருப்பத்தின் பேரில் வாங்குகிறோம் அல்லது நமது சொந்த யோசனைகளின்படி செயல்படுகிறோம் என்று உணரவே நாம் அதிகம் விரும்புகிறோம்.' },
      whyItMatters: { en: 'People will defend an idea fiercely if they believe they came up with it. Planting the seed and letting them claim it is the ultimate influence.', ta: 'ஒரு யோசனையைத் தாங்களே உருவாக்கியதாக மக்கள் நம்பினால் அதை கடுமையாகப் பாதுகாப்பார்கள். விதையை விதைத்து அவர்களை உரிமை கோரச் செய்வதே இறுதி செல்வாக்கு.' },
      example: { en: 'A manager subtly guiding a brainstorming session so the team "discovers" the solution the manager wanted all along, leading to high enthusiasm.', ta: 'ஒரு மேலாளர் மூளைச்சலவை அமர்வை நுட்பமாக வழிநடத்துகிறார், இதனால் மேலாளர் எதிர்பார்த்த தீர்வை குழு "கண்டுபிடிக்கிறது", இது அதிக உற்சாகத்திற்கு வழிவகுக்கிறது.' },
      actionStep: { en: 'Instead of giving a direct instruction today, ask a guiding question: "What do you think would happen if we tried doing it this way?"', ta: 'இன்று நேரடி அறிவுறுத்தல் வழங்குவதற்குப் பதிலாக, வழிகாட்டும் கேள்வியைக் கேளுங்கள்: "நாம் இதை இந்த வழியில் செய்ய முயற்சித்தால் என்ன நடக்கும் என்று நீங்கள் நினைக்கிறீர்கள்?"' },
      reflectionQuestion: { en: 'Do you care more about getting the credit for a good idea, or getting the result?', ta: 'ஒரு நல்ல யோசனைக்கான பாராட்டப் பெறுவதில் அதிக அக்கறை காட்டுகிறீர்களா, அல்லது முடிவைப் பெறுவதிலா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Try Honestly to See Things from the Other Person\'s Point of View', ta: 'நேர்மையாக மற்ற நபரின் கண்ணோட்டத்தில் இருந்து விஷயங்களைப் பார்க்க முயற்சிக்கவும்' },
      explanation: { en: 'There is a reason why the other man thinks and acts as he does. Ferret out that reason, and you have the key to his actions, perhaps to his personality.', ta: 'மற்ற மனிதன் அவன் செய்வது போலச் சிந்திப்பதற்கும் செயல்படுவதற்கும் ஒரு காரணம் இருக்கிறது. அந்தக் காரணத்தைக் கண்டறியுங்கள், அவனது செயல்களுக்கான, ஒருவேளை அவனது ஆளுமைக்கான திறவுகோல் உங்களிடம் இருக்கும்.' },
      whyItMatters: { en: 'Empathy diffuses anger. When you truly understand why someone is behaving a certain way, it becomes impossible to hate them.', ta: 'பச்சாதாபம் கோபத்தைத் தணிக்கிறது. ஒருவர் ஏன் ஒரு குறிப்பிட்ட வழியில் நடந்துகொள்கிறார் என்பதை நீங்கள் உண்மையாகப் புரிந்து கொள்ளும்போது, அவர்களை வெறுப்பது சாத்தியமற்றதாகிவிடும்.' },
      example: { en: 'Understanding that a rude clerk is just exhausted from working a double shift to feed their kids, responding with kindness instead of snapping back.', ta: 'ஒரு முரட்டுத்தனமான எழுத்தர் தங்கள் குழந்தைகளுக்கு உணவளிக்க இரட்டை ஷிப்ட் வேலை செய்வதால் சோர்வடைந்துள்ளார் என்பதைப் புரிந்துகொண்டு, பதிலுக்குக் கோபப்படுவதற்குப் பதிலாக அன்புடன் பதிலளிப்பது.' },
      actionStep: { en: 'Before you get mad at someone today, close your eyes and ask: "If I were in their exact situation, with their background, how would I feel?"', ta: 'இன்று நீங்கள் ஒருவர் மீது கோபப்படுவதற்கு முன், கண்களை மூடிக்கொண்டு கேளுங்கள்: "அவர்களின் பின்னணியுடன், அவர்களின் சரியான சூழ்நிலையில் நான் இருந்தால், நான் எப்படி உணர்வேன்?"' },
      reflectionQuestion: { en: 'Do you judge others based on their actions, while judging yourself based on your intentions?', ta: 'மற்றவர்களை அவர்களின் செயல்களின் அடிப்படையிலும், உங்களை உங்கள் நோக்கங்களின் அடிப்படையிலும் தீர்மானிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Appeal to the Nobler Motives', ta: 'உன்னதமான நோக்கங்களை ஈர்க்கவும்' },
      explanation: { en: 'People generally have two reasons for doing a thing: one that sounds good, and a real one. Appeal to the one that sounds good to make them want to live up to it.', ta: 'மக்கள் பொதுவாக ஒரு காரியத்தைச் செய்வதற்கு இரண்டு காரணங்களைக் கொண்டுள்ளனர்: ஒன்று நன்றாகத் தோன்றும் காரணம், மற்றொன்று உண்மையானது. அவர்கள் அதற்கு ஏற்றபடி வாழ விரும்புவதற்காக நன்றாகத் தோன்றும் காரணத்தை ஈர்க்கவும்.' },
      whyItMatters: { en: 'Most people believe they are good and moral. If you appeal to their sense of honor and fairness, they will often rise to the occasion to prove you right.', ta: 'பெரும்பாலான மக்கள் தங்களை நல்லவர்களாகவும் தார்மீகமானவர்களாகவும் கருதுகிறார்கள். அவர்களின் மரியாதை மற்றும் நியாய உணர்வை நீங்கள் ஈர்த்தால், நீங்கள் சொல்வது சரி என்பதை நிரூபிக்க அவர்கள் பெரும்பாலும் அதற்கேற்ப நடந்துகொள்வார்கள்.' },
      example: { en: 'A landlord appealing to a tenant breaking a lease by saying, "I know you are a man of your word and wouldn\'t break a contract," resulting in the tenant staying.', ta: 'குத்தகை ஒப்பந்தத்தை முறிக்கும் வாடகைதாரரிடம் ஒரு வீட்டு உரிமையாளர், "நீங்கள் சொன்ன சொல்லைக் காப்பாற்றும் மனிதர், ஒரு ஒப்பந்தத்தை முறிக்க மாட்டீர்கள் என்று எனக்குத் தெரியும்" என்று கூறி ஈர்ப்பது, இதன் விளைவாக வாடகைதாரர் தங்குவார்.' },
      actionStep: { en: 'Instead of accusing someone of dodging a responsibility, say, "I know you are someone who prides themselves on reliability, so I wanted to check in on this."', ta: 'யாராவது ஒரு பொறுப்பிலிருந்து தப்பிப்பதாகக் குற்றம் சாட்டுவதற்குப் பதிலாக, "நம்பகத்தன்மை குறித்துப் பெருமைப்படும் ஒருவர் நீங்கள் என்று எனக்குத் தெரியும், அதனால் இதைச் சரிபார்க்க விரும்பினேன்" என்று சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Do you assume the worst in people, bringing out their worst in return?', ta: 'மக்களிடம் மோசமானதையே கருதி, பதிலுக்கு அவர்களின் மோசமான குணத்தையே வெளிக்கொண்டு வருகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Dramatize Your Ideas', ta: 'உங்கள் யோசனைகளை நாடகமாக்குங்கள்' },
      explanation: { en: 'Merely stating a truth isn\'t enough. The truth has to be made vivid, interesting, dramatic. You have to use showmanship. The movies do it. Television does it. You will have to do it if you want attention.', ta: 'ஒரு உண்மையை வெறுமனே கூறுவது போதாது. உண்மை தெளிவானதாக, சுவாரஸ்யமானதாக, நாடகத்தனமாக மாற்றப்பட வேண்டும். நீங்கள் காட்சிப்படுத்தலைப் பயன்படுத்த வேண்டும். திரைப்படங்கள் அதைச் செய்கின்றன. தொலைக்காட்சி அதைச் செய்கிறது. நீங்கள் கவனம் ஈர்க்க விரும்பினால் நீங்களும் அதைச் செய்ய வேண்டும்.' },
      whyItMatters: { en: 'In a world full of noise, pure logic is often ignored. Visual, dramatic demonstrations stick in people\'s minds.', ta: 'சத்தங்கள் நிறைந்த உலகில், தூய்மையான தர்க்கம் பெரும்பாலும் புறக்கணிக்கப்படுகிறது. காட்சி மற்றும் நாடக ரீதியான விளக்கங்கள் மக்களின் மனதில் பதிகின்றன.' },
      example: { en: 'A vacuum salesman not just saying "it sucks up dirt," but pouring dirt on a white carpet and instantly making it vanish with the machine.', ta: 'ஒரு வேக்யூம் கிளீனர் விற்பனையாளர் "இது அழுக்கை உறிஞ்சும்" என்று மட்டும் சொல்லாமல், வெள்ளைக் கம்பளத்தின் மீது அழுக்கைக் கொட்டி அதை உடனடியாக இயந்திரத்தின் மூலம் மறையச் செய்வது.' },
      actionStep: { en: 'Next time you present an idea or data, find a physical prop, an analogy, or a visual aid to make the point unforgettable.', ta: 'அடுத்த முறை நீங்கள் ஒரு யோசனை அல்லது தரவை முன்வைக்கும்போது, கருத்தை மறக்க முடியாததாக மாற்ற ஒரு உடல்ரீதியான பொருள், ஒரு ஒப்புமை அல்லது ஒரு காட்சி உதவியைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'Are your presentations accurate but completely boring?', ta: 'உங்கள் விளக்கக்காட்சிகள் துல்லியமானதாக இருந்தாலும் முற்றிலும் சலிப்பை ஏற்படுத்துகிறதா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Throw Down a Challenge', ta: 'ஒரு சவாலை விடுங்கள்' },
      explanation: { en: 'When nothing else works, stimulate competition. Not in a sordid, money-getting way, but in the desire to excel. The one major factor that motivates people is the work itself, if it is exciting and interesting.', ta: 'வேறு எதுவும் பலனளிக்காத போது, போட்டியைத் தூண்டுங்கள். ஒரு கேவலமான, பணம் சம்பாதிக்கும் வழியில் அல்ல, ஆனால் சிறந்து விளங்க வேண்டும் என்ற விருப்பத்தில். மக்களை ஊக்குவிக்கும் ஒரு முக்கிய காரணி வேலையே ஆகும், அது உற்சாகமாகவும் சுவாரஸ்யமாகவும் இருந்தால்.' },
      whyItMatters: { en: 'People love a game, a chance for self-expression, a chance to prove their worth, to excel, to win.', ta: 'மக்கள் ஒரு விளையாட்டை விரும்புகிறார்கள், சுய வெளிப்பாட்டிற்கான வாய்ப்பு, தங்கள் மதிப்பை நிரூபிக்க, சிறந்து விளங்க, வெற்றிபெற ஒரு வாய்ப்பு.' },
      example: { en: 'Charles Schwab getting a slow steel mill to produce more simply by writing a big "6" on the floor for the day shift\'s output, making the night shift want to beat it with a "7".', ta: 'சார்லஸ் ஷ்வாப் பகல் ஷிப்ட் உற்பத்திக்காக தரையில் ஒரு பெரிய "6" என்று எழுதி வைத்து ஒரு மெதுவான எஃகு ஆலையை அதிகமாக உற்பத்தி செய்ய வைத்தார், இது இரவு ஷிப்டை "7" மூலம் அதை வெல்ல விரும்பச் செய்தது.' },
      actionStep: { en: 'If a team or individual is unmotivated, turn the task into a measurable game or issue a friendly challenge to beat a specific goal.', ta: 'ஒரு குழு அல்லது தனிநபர் உந்துதல் இல்லாமல் இருந்தால், பணியை அளவிடக்கூடிய விளையாட்டாக மாற்றவும் அல்லது குறிப்பிட்ட இலக்கை வெல்ல ஒரு நட்பு ரீதியான சவாலை விடுக்கவும்.' },
      reflectionQuestion: { en: 'Are you trying to manage people purely through authority, instead of tapping into their natural competitive spirit?', ta: 'மக்களின் இயற்கையான போட்டி மனப்பான்மையைத் தட்டியெழுப்புவதற்குப் பதிலாக, முற்றிலும் அதிகாரத்தின் மூலம் அவர்களை நிர்வகிக்க முயற்சிக்கிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'How to Win Friends and Influence People' });
    if (existing) {
      console.log('How to Win Friends already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'How to Win Friends and Influence People' });
    }
    
    await WisdomBook.create(howToWinFriendsBook);
    console.log('How to Win Friends added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
