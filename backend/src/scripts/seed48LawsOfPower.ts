import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const lawsOfPowerBook = {
  title: 'The 48 Laws of Power',
  author: 'Robert Greene',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9780140280197-L.jpg',
  categories: ['Psychology', 'Strategy', 'Business', 'Philosophy'],
  themes: [
    { en: 'Power Dynamics', ta: 'அதிகார இயக்கவியல்' },
    { en: 'Human Nature', ta: 'மனித இயல்பு' }
  ],
  overview: {
    en: 'Amoral, cunning, ruthless, and instructive, this multi-million-copy New York Times bestseller is the definitive manual for anyone interested in gaining, observing, or defending against ultimate control. Robert Greene distills three thousand years of the history of power into 48 essential laws.',
    ta: 'அறநெறியற்ற, தந்திரமான, இரக்கமற்ற மற்றும் அறிவுறுத்தலான, பல மில்லியன் பிரதிகள் விற்பனையான இந்த நியூயார்க் டைம்ஸ் பெஸ்ட்செல்லர் புத்தகம், இறுதி கட்டுப்பாட்டைப் பெற, கவனிக்க அல்லது தற்காத்துக் கொள்ள ஆர்வமுள்ள எவருக்கும் ஒரு உறுதியான கையேடாகும். ராபர்ட் கிரீன் மூவாயிரம் ஆண்டுகால அதிகாரத்தின் வரலாற்றை 48 அத்தியாவசிய விதிகளாக வடிகட்டுகிறார்.'
  },
  topQuotes: [
    { en: 'Always make those above you feel comfortably superior.', ta: 'எப்பொழுதும் உங்களுக்கு மேலிருப்பவர்கள் தாங்கள் வசதியாக உங்களை விட உயர்ந்தவர்கள் என்று உணரச் செய்யுங்கள்.' },
    { en: 'Do not leave your reputation to chance or gossip; it is your life\'s artwork, and you must craft it, hone it, and display it with the care of an artist.', ta: 'உங்கள் நற்பெயரை வாய்ப்பு அல்லது கிசுகிசுக்களுக்கு விட்டுவிடாதீர்கள்; அது உங்கள் வாழ்க்கையின் கலைப்படைப்பு, நீங்கள் அதை ஒரு கலைஞரின் அக்கறையுடன் உருவாக்க வேண்டும், கூர்மைப்படுத்த வேண்டும் மற்றும் காட்சிப்படுத்த வேண்டும்.' },
    { en: 'When you show yourself to the world and display your talents, you naturally stir all kinds of resentment, envy, and other manifestations of insecurity.', ta: 'நீங்கள் உங்களை உலகிற்குக் காட்டி, உங்கள் திறமைகளை வெளிப்படுத்தும்போது, இயல்பாகவே நீங்கள் அனைத்து வகையான மனக்கசப்பு, பொறாமை மற்றும் பாதுகாப்பின்மையின் பிற வெளிப்பாடுகளைத் தூண்டுகிறீர்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'Never Outshine the Master', ta: 'ஒருபோதும் எஜமானனை விட மிளிர வேண்டாம்' },
      explanation: { en: 'Always make those above you feel comfortably superior. In your desire to please and impress them, do not go too far in displaying your talents or you might accomplish the opposite—inspire fear and insecurity.', ta: 'எப்பொழுதும் உங்களுக்கு மேலிருப்பவர்கள் தாங்கள் வசதியாக உயர்ந்தவர்கள் என்று உணரச் செய்யுங்கள். அவர்களை மகிழ்விக்கவும் ஈர்க்கவும் வேண்டும் என்ற ஆசையில், உங்கள் திறமைகளை வெளிப்படுத்துவதில் அதிக தூரம் செல்ல வேண்டாம், இல்லையெனில் நீங்கள் எதிர்பார்த்ததற்கு நேர்மாறானதை அடையலாம்—அதாவது பயம் மற்றும் பாதுகாப்பின்மையைத் தூண்டலாம்.' },
      whyItMatters: { en: 'People in power have fragile egos. If you make them look bad or feel insecure by being too brilliant, they will find a way to replace or destroy you.', ta: 'அதிகாரத்தில் இருப்பவர்களுக்கு உடையக்கூடிய ஈகோக்கள் இருக்கும். நீங்கள் மிகவும் புத்திசாலியாக இருந்து அவர்களை மோசமாகக் காட்டினாலோ அல்லது பாதுகாப்பற்றவர்களாக உணரச் செய்தாலோ, அவர்கள் உங்களை மாற்ற அல்லது அழிக்க ஒரு வழியைக் கண்டுபிடிப்பார்கள்.' },
      example: { en: 'A junior employee taking all the credit for a successful project during a meeting, making their boss look incompetent in front of the CEO.', ta: 'ஒரு சந்திப்பின் போது வெற்றிகரமான திட்டத்திற்கான முழு நற்பெயரையும் ஒரு ஜூனியர் ஊழியர் எடுத்துக்கொண்டு, தலைமை நிர்வாக அதிகாரிக்கு முன்னால் அவர்களின் முதலாளியைத் திறமையற்றவராகக் காட்டுவது.' },
      actionStep: { en: 'In your next interaction with a superior, ask for their advice or attribute a good idea to their leadership to stroke their ego.', ta: 'உங்களுக்கு மேலதிகாரியுடனான அடுத்த உரையாடலில், அவர்களின் ஆலோசனையைக் கேளுங்கள் அல்லது அவர்களின் ஈகோவைத் திருப்திப்படுத்த ஒரு நல்ல யோசனையை அவர்களின் தலைமைத்துவத்திற்குக் காரணம் காட்டுங்கள்.' },
      reflectionQuestion: { en: 'Have you ever unintentionally made a boss or teacher feel threatened by showing off how much you know?', ta: 'உங்களுக்கு எவ்வளவு தெரியும் என்பதைக் காட்டுவதன் மூலம் நீங்கள் எப்போதாவது ஒரு முதலாளியையோ அல்லது ஆசிரியரையோ அறியாமல் அச்சுறுத்தப்பட்டதாக உணரச் செய்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'Never Put Too Much Trust in Friends, Learn How to Use Enemies', ta: 'நண்பர்களை அதிகம் நம்பாதீர்கள், எதிரிகளை எப்படிப் பயன்படுத்துவது என்று கற்றுக்கொள்ளுங்கள்' },
      explanation: { en: 'Friends will quickly betray you, for they are easily aroused to envy. But hire a former enemy and they will be more loyal than a friend, because they have more to prove.', ta: 'நண்பர்கள் விரைவாக உங்களுக்குத் துரோகம் செய்வார்கள், ஏனென்றால் அவர்கள் எளிதில் பொறாமைப்படத் தூண்டப்படுவார்கள். ஆனால் ஒரு முன்னாள் எதிரியை வேலைக்கு அமர்த்துங்கள், அவர்கள் ஒரு நண்பரை விட விசுவாசமாக இருப்பார்கள், ஏனென்றால் அவர்கள் நிரூபிக்க நிறைய இருக்கிறது.' },
      whyItMatters: { en: 'We blind ourselves to our friends\' flaws and assume they will always be loyal. In business and power, relying on friendship over competence is dangerous.', ta: 'நமது நண்பர்களின் குறைகளை நாம் குருடாக்கிக் கொண்டு, அவர்கள் எப்போதும் விசுவாசமாக இருப்பார்கள் என்று கருதுகிறோம். வணிகம் மற்றும் அதிகாரத்தில், திறமையை விட நட்பை நம்பியிருப்பது ஆபத்தானது.' },
      example: { en: 'Starting a business with your best friend, only to have the friendship ruined when money and power dynamics enter the picture.', ta: 'உங்கள் நெருங்கிய நண்பருடன் ஒரு தொழிலைத் தொடங்குவது, பணமும் அதிகார இயக்கவியலும் படத்திற்கு வரும்போது அந்த நட்பு பாழாவதற்கு மட்டுமே.' },
      actionStep: { en: 'Evaluate your team or inner circle based strictly on competence and results, rather than who you like spending time with.', ta: 'நீங்கள் யாருடன் நேரத்தைச் செலவிட விரும்புகிறீர்கள் என்பதை விட, திறமை மற்றும் முடிவுகளின் அடிப்படையில் உங்கள் குழு அல்லது உள் வட்டத்தைக் கண்டிப்பாக மதிப்பிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you keeping an incompetent person around just because you consider them a friend?', ta: 'திறமையற்ற ஒருவரை நீங்கள் உங்கள் நண்பர் என்று கருதுவதற்காக மட்டுமே உங்களைச் சுற்றி வைத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Conceal Your Intentions', ta: 'உங்கள் நோக்கங்களை மறைத்து வையுங்கள்' },
      explanation: { en: 'Keep people off-balance and in the dark by never revealing the purpose behind your actions. If they have no clue what you are up to, they cannot prepare a defense.', ta: 'உங்கள் செயல்களுக்குப் பின்னால் உள்ள நோக்கத்தை ஒருபோதும் வெளிப்படுத்தாமல் மனிதர்களை நிலைதடுமாறச் செய்து இருளில் வைத்திருங்கள். நீங்கள் என்ன செய்கிறீர்கள் என்பது அவர்களுக்குத் தெரியாவிட்டால், அவர்களால் ஒரு தற்காப்பைத் தயாரிக்க முடியாது.' },
      whyItMatters: { en: 'Oversharing your plans allows competitors to steal your ideas or thwart your efforts. Mystery gives you an advantage.', ta: 'உங்கள் திட்டங்களை அதிகமாகப் பகிர்வது போட்டியாளர்கள் உங்கள் யோசனைகளைத் திருட அல்லது உங்கள் முயற்சிகளை முறியடிக்க அனுமதிக்கிறது. மர்மம் உங்களுக்கு ஒரு நன்மையைத் தருகிறது.' },
      example: { en: 'A company secretly developing a revolutionary new product while publicly pretending to focus on updating their old, failing software.', ta: 'ஒரு நிறுவனம் பகிரங்கமாகத் தங்களின் பழைய, தோல்வியடைந்து வரும் மென்பொருளைப் புதுப்பிப்பதில் கவனம் செலுத்துவதாகப் பாசாங்கு செய்துகொண்டே, ரகசியமாக ஒரு புரட்சிகரமான புதிய தயாரிப்பை உருவாக்குவது.' },
      actionStep: { en: 'Pick one major goal you are working on right now and resolve to tell absolutely no one about it until it is finished.', ta: 'இப்போது நீங்கள் செயல்பட்டுக் கொண்டிருக்கும் ஒரு முக்கிய இலக்கைத் தேர்ந்தெடுத்து, அது முடியும் வரை அதைப் பற்றி யாரிடமும் சொல்லப் போவதில்லை என்று உறுதியளிக்கவும்.' },
      reflectionQuestion: { en: 'Do you talk about your plans just to get validation from others before you even start?', ta: 'நீங்கள் தொடங்குவதற்கு முன்பே மற்றவர்களிடமிருந்து அங்கீகாரம் பெறுவதற்காக மட்டுமே உங்கள் திட்டங்களைப் பற்றி பேசுகிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Always Say Less Than Necessary', ta: 'தேவையானதை விட எப்போதும் குறைவாகப் பேசுங்கள்' },
      explanation: { en: 'When you are trying to impress people with words, the more you say, the more common you appear, and the less in control. Powerful people impress and intimidate by saying less.', ta: 'வார்த்தைகளால் மக்களை ஈர்க்க நீங்கள் முயற்சிக்கும்போது, நீங்கள் எவ்வளவு அதிகமாகப் பேசுகிறீர்களோ, அவ்வளவு சாதாரணமாகத் தோன்றுவீர்கள், மேலும் கட்டுப்பாடில்லாதவராகவும் தெரிவீர்கள். சக்திவாய்ந்த மனிதர்கள் குறைவாகப் பேசுவதன் மூலம் ஈர்க்கிறார்கள் மற்றும் அச்சுறுத்துகிறார்கள்.' },
      whyItMatters: { en: 'Silence makes people uncomfortable; they will talk to fill the void and reveal valuable information. Once words are out of your mouth, you cannot take them back.', ta: 'மௌனம் மனிதர்களை அசௌகரியப்படுத்துகிறது; வெற்றிடத்தை நிரப்பவும் மதிப்புமிக்க தகவல்களை வெளிப்படுத்தவும் அவர்கள் பேசுவார்கள். வார்த்தைகள் உங்கள் வாயிலிருந்து வெளியே வந்தவுடன், அவற்றை உங்களால் திரும்பப் பெற முடியாது.' },
      example: { en: 'King Louis XIV would listen to his ministers debate for hours and simply end the meeting with "I shall see," offering no commitments.', ta: 'கிங் லூயிஸ் XIV தனது அமைச்சர்கள் மணிக்கணக்கில் விவாதிப்பதைக் கேட்டுவிட்டு, எந்த உறுதிப்பாடும் அளிக்காமல் "நான் பார்க்கிறேன்" என்று கூட்டத்தை முடித்துக்கொள்வார்.' },
      actionStep: { en: 'In your next meeting or negotiation, state your point briefly and then remain completely silent, letting the other person fill the quiet.', ta: 'உங்களின் அடுத்த சந்திப்பு அல்லது பேச்சுவார்த்தையில், உங்கள் கருத்தைச் சுருக்கமாகக் கூறிவிட்டு, மற்றவர் அமைதியை நிரப்ப அனுமதித்து முழுமையாக மௌனமாக இருங்கள்.' },
      reflectionQuestion: { en: 'Have you ever ruined a strong position by continuing to talk after you had already won?', ta: 'நீங்கள் ஏற்கனவே வெற்றிபெற்ற பிறகும் தொடர்ந்து பேசுவதன் மூலம் வலுவான நிலையை எப்போதாவது கெடுத்துள்ளீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'So Much Depends on Reputation—Guard It With Your Life', ta: 'நற்பெயரை நம்பியே நிறைய இருக்கிறது—அதை உயிரைக் கொடுத்துப் பாதுகாக்கவும்' },
      explanation: { en: 'Reputation is the cornerstone of power. Through reputation alone you can intimidate and win; once it slips, however, you are vulnerable and will be attacked on all sides.', ta: 'நற்பெயரே அதிகாரத்தின் அடித்தளம். நற்பெயரின் மூலமாக மட்டுமே உங்களால் அச்சுறுத்தவும் வெற்றிபெறவும் முடியும்; இருப்பினும் அது ஒருமுறை நழுவிவிட்டால், நீங்கள் பாதிக்கப்படக்கூடியவர் ஆவீர்கள், மேலும் எல்லா பக்கங்களிலிருந்தும் தாக்கப்படுவீர்கள்.' },
      whyItMatters: { en: 'A strong reputation precedes you. If you are known as ruthless, people won\'t mess with you. If you are known as a pushover, people will constantly test you.', ta: 'வலுவான நற்பெயர் உங்களுக்கு முன்பாகவே செல்லும். நீங்கள் இரக்கமற்றவர் என்று அறியப்பட்டால், மனிதர்கள் உங்களுடன் வம்பு செய்ய மாட்டார்கள். நீங்கள் எளிதில் ஏமாற்றக்கூடியவர் என்று அறியப்பட்டால், மனிதர்கள் தொடர்ந்து உங்களைச் சோதிப்பார்கள்.' },
      example: { en: 'A lawyer who has never lost a case often wins settlements before a trial even begins because the opposing side is terrified of their reputation.', ta: 'எந்தவொரு வழக்கிலும் இதுவரை தோற்காத ஒரு வழக்கறிஞர், எதிர்த்தரப்பு அவரது நற்பெயரைக் கண்டு பயப்படுவதால், வழக்கு தொடங்குவதற்கு முன்பே பெரும்பாலும் சமரசங்களில் வெற்றி பெறுகிறார்.' },
      actionStep: { en: 'Identify one trait you want to be known for (e.g., punctuality, intense focus). Take one overt action today to reinforce that specific reputation.', ta: 'நீங்கள் எதற்காக அறியப்பட வேண்டும் என்று விரும்புகிறீர்களோ அந்த ஒரு பண்பைக் கண்டறியவும் (எ.கா., நேரந்தவறாமை, தீவிரக் கவனம்). அந்த குறிப்பிட்ட நற்பெயரை வலுப்படுத்த இன்று ஒரு வெளிப்படையான நடவடிக்கையை எடுக்கவும்.' },
      reflectionQuestion: { en: 'What is your current reputation among your peers, and is it serving your goals?', ta: 'உங்கள் சக நண்பர்களிடையே உங்களின் தற்போதைய நற்பெயர் என்ன, அது உங்கள் இலக்குகளுக்குச் சேவை செய்கிறதா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Court Attention at All Costs', ta: 'எந்த விலை கொடுத்தாவது கவனத்தை ஈர்க்கவும்' },
      explanation: { en: 'Everything is judged by its appearance; what is unseen counts for nothing. Never let yourself get lost in the crowd or buried in oblivion. Stand out.', ta: 'எல்லாமே அதன் தோற்றத்தால் மதிப்பிடப்படுகிறது; காணப்படாதது எதற்கும் கணக்கிடப்படுவதில்லை. கூட்டத்தில் தொலைந்து போகவோ அல்லது மறதியில் புதைக்கப்படவோ உங்களை ஒருபோதும் அனுமதிக்காதீர்கள். தனித்து நில்லுங்கள்.' },
      whyItMatters: { en: 'If you are invisible, you have no power. It is better to be attacked or slandered than to be ignored entirely.', ta: 'நீங்கள் கண்ணுக்குத் தெரியாமல் இருந்தால், உங்களுக்கு எந்த அதிகாரமும் இல்லை. முற்றிலுமாகப் புறக்கணிக்கப்படுவதை விடத் தாக்கப்படுவதோ அல்லது அவதூறு செய்யப்படுவதோ மேலானது.' },
      example: { en: 'P.T. Barnum planting bizarre stories in newspapers just to get people talking about his circus, knowing that all publicity is good publicity.', ta: 'எல்லா விளம்பரங்களும் நல்ல விளம்பரங்களே என்பதை அறிந்து, தனது சர்க்கஸைப் பற்றி மக்கள் பேச வேண்டும் என்பதற்காகவே செய்தித்தாள்களில் விசித்திரமான கதைகளை பி.டி. பர்னம் வெளியிட்டார்.' },
      actionStep: { en: 'Speak up clearly and propose a bold idea in your next group setting, ensuring you are noticed rather than fading into the background.', ta: 'பின்னணியில் மங்கிப்போவதற்குப் பதிலாக, உங்களின் அடுத்த குழுச் சந்திப்பில் தெளிவாகப் பேசுங்கள் மற்றும் ஒரு தைரியமான யோசனையை முன்மொழியுங்கள், நீங்கள் கவனிக்கப்படுவதை உறுதிசெய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you playing it too safe and blending in so much that nobody remembers you were there?', ta: 'நீங்கள் இருந்ததை யாரும் நினைவில் கொள்ளாத அளவுக்கு மிகவும் பாதுகாப்பாக விளையாடி மற்றவர்களுடன் கலந்துவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Get Others to Do the Work for You, But Always Take the Credit', ta: 'மற்றவர்களை உங்களுக்காக வேலை செய்ய வையுங்கள், ஆனால் எப்போதும் நீங்களே நற்பெயரை எடுத்துக்கொள்ளுங்கள்' },
      explanation: { en: 'Use the wisdom, knowledge, and legwork of other people to further your own cause. Not only will such assistance save you valuable time and energy, it will give you a godlike aura of efficiency.', ta: 'உங்களின் சொந்த நோக்கத்தை முன்னெடுக்க மற்றவர்களின் ஞானம், அறிவு மற்றும் உடல் உழைப்பைப் பயன்படுத்துங்கள். இத்தகைய உதவி உங்கள் மதிப்புமிக்க நேரத்தையும் ஆற்றலையும் மிச்சப்படுத்துவதோடு மட்டுமல்லாமல், அது உங்களுக்குத் திறன் பற்றிய ஒரு தெய்வீக ஒளியைக் கொடுக்கும்.' },
      whyItMatters: { en: 'Fools do all the hard work themselves and burn out. The powerful delegate the grueling work and position themselves as the master orchestrator.', ta: 'முட்டாள்கள் அனைத்துக் கடின உழைப்பையும் தாங்களே செய்து சோர்வடைகிறார்கள். சக்திவாய்ந்தவர்கள் சோர்வடையச் செய்யும் வேலைகளைப் பிரித்துக்கொடுத்து, தங்களை ஒரு தலைசிறந்த அமைப்பாளராக நிலைநிறுத்திக் கொள்கிறார்கள்.' },
      example: { en: 'Thomas Edison taking the credit and patents for inventions that were largely engineered by Nikola Tesla and his other brilliant assistants.', ta: 'நிகோலா டெஸ்லா மற்றும் அவரது பிற சிறந்த உதவியாளர்களால் பெருமளவில் வடிவமைக்கப்பட்ட கண்டுபிடிப்புகளுக்கான நற்பெயரையும் காப்புரிமையையும் தாமஸ் எடிசன் எடுத்துக்கொண்டார்.' },
      actionStep: { en: 'Find a task on your plate that drains your energy and delegate or outsource it today.', ta: 'உங்கள் ஆற்றலை உறிஞ்சும் ஒரு பணியை உங்களிடம் கண்டறிந்து, அதை இன்று பிரித்துக்கொடுங்கள் அல்லது அவுட்சோர்ஸ் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you acting as the "doer" instead of the "director" of your life?', ta: 'உங்கள் வாழ்க்கையின் "இயக்குனருக்கு" பதிலாக "செய்பவராக" நீங்கள் செயல்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Make Other People Come to You', ta: 'மற்றவர்களை உங்களிடம் வர வையுங்கள்' },
      explanation: { en: 'When you force the other person to act, you are the one in control. It is always better to make your opponent come to you, abandoning their own plans in the process.', ta: 'மற்ற நபரைச் செயல்படும்படி நீங்கள் கட்டாயப்படுத்தும்போது, கட்டுப்பாட்டில் இருப்பவர் நீங்களே. உங்கள் எதிரியை உங்களிடம் வரச் செய்வது எப்போதும் சிறந்தது, அந்தச் செயல்பாட்டில் அவர்கள் தங்கள் சொந்தத் திட்டங்களைக் கைவிடுகிறார்கள்.' },
      whyItMatters: { en: 'Chasing people puts you in a position of weakness. Making them come to your territory gives you the psychological and strategic advantage.', ta: 'மனிதர்களைத் துரத்துவது உங்களை பலவீனமான நிலையில் நிறுத்துகிறது. அவர்களை உங்கள் எல்லைக்கு வரச் செய்வது உங்களுக்கு உளவியல் மற்றும் உத்திரீதியான நன்மையை அளிக்கிறது.' },
      example: { en: 'A master negotiator refusing to travel to the client\'s office, insisting the meeting happen at their own headquarters where they control the environment.', ta: 'வாடிக்கையாளரின் அலுவலகத்திற்குச் செல்ல மறுத்து, தாங்கள் சூழலைக் கட்டுப்படுத்தும் தங்கள் சொந்தத் தலைமையகத்தில் சந்திப்பு நடக்க வேண்டும் என்று வலியுறுத்தும் ஒரு தலைசிறந்த பேச்சுவார்த்தையாளர்.' },
      actionStep: { en: 'Bait a hook. Post something intriguing or offer something valuable that requires the other party to initiate contact with you.', ta: 'ஒரு தூண்டில் போடுங்கள். ஆர்வத்தைத் தூண்டும் எதையாவது பதிவு செய்யுங்கள் அல்லது உங்களைத் தொடர்புகொள்ள மற்ற தரப்பினரைக் கோரும் மதிப்புமிக்க ஒன்றை வழங்குங்கள்.' },
      reflectionQuestion: { en: 'Are you constantly the one reaching out, applying, and asking, or are you creating demand so people come to you?', ta: 'நீங்கள் தொடர்ந்து தொடர்புகொள்வது, விண்ணப்பிப்பது மற்றும் கேட்பது போன்றவற்றைச் செய்கிறீர்களா, அல்லது மனிதர்கள் உங்களிடம் வரும்படி தேவையை உருவாக்குகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Win Through Your Actions, Never Through Argument', ta: 'உங்கள் செயல்களின் மூலம் வெற்றி பெறுங்கள், ஒருபோதும் விவாதத்தின் மூலம் அல்ல' },
      explanation: { en: 'Any momentary triumph you think you have gained through argument is really a Pyrrhic victory. The resentment you stir up is stronger and lasts longer than any momentary change of opinion.', ta: 'விவாதத்தின் மூலம் நீங்கள் பெற்றதாக நினைக்கும் எந்தவொரு தற்காலிக வெற்றியும் உண்மையில் பெரிய இழப்புடன் கூடிய வெற்றியாகும். நீங்கள் தூண்டும் மனக்கசப்பு, எந்தவொரு தற்காலிகக் கருத்து மாற்றத்தையும் விட வலுவானது மற்றும் நீண்ட காலம் நீடிக்கும்.' },
      whyItMatters: { en: 'Words are cheap and often interpreted as insults. Demonstrating your point physically forces the other person to see the truth without bruising their ego.', ta: 'வார்த்தைகள் மலிவானவை மற்றும் பெரும்பாலும் அவமானங்களாகவே புரிந்துகொள்ளப்படுகின்றன. உங்கள் கருத்தை உடல்ரீதியாக விளக்குவது, மற்ற நபர் தங்களின் ஈகோவை காயப்படுத்தாமல் உண்மையைப் பார்க்கக் கட்டாயப்படுத்துகிறது.' },
      example: { en: 'Michelangelo, when told by the mayor that a statue\'s nose was too big, didn\'t argue. He climbed up, dropped some marble dust while pretending to chisel, and asked, "How is it now?" The mayor loved it.', ta: 'மைக்கேலேஞ்சலோவிடம், சிலையொன்றின் மூக்கு மிகவும் பெரிதாக இருப்பதாக மேயர் கூறியபோது, அவர் வாதிடவில்லை. அவர் மேலே ஏறி, உளியால் செதுக்குவது போலப் பாசாங்கு செய்துகொண்டே சில பளிங்குத் தூளைக் கீழே போட்டுவிட்டு, "இப்போது எப்படி இருக்கிறது?" என்று கேட்டார். மேயருக்கு அது மிகவும் பிடித்திருந்தது.' },
      actionStep: { en: 'Instead of arguing with someone today about why your idea is better, build a small prototype or show them an example to prove it silently.', ta: 'உங்கள் யோசனை ஏன் சிறந்தது என்று இன்று ஒருவருடன் வாதிடுவதற்குப் பதிலாக, ஒரு சிறிய முன்மாதிரியை உருவாக்கவும் அல்லது அமைதியாக அதை நிரூபிக்க அவர்களுக்கு ஒரு உதாரணத்தைக் காட்டவும்.' },
      reflectionQuestion: { en: 'Do you waste hours arguing on the internet instead of just building something undeniable?', ta: 'மறுக்க முடியாத ஒன்றை உருவாக்குவதற்குப் பதிலாக இணையத்தில் வாதிட்டு மணிநேரங்களை வீணாக்குகிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Infection: Avoid the Unhappy and Unlucky', ta: 'தொற்று: மகிழ்ச்சியற்ற மற்றும் அதிர்ஷ்டமில்லாதவர்களைத் தவிர்க்கவும்' },
      explanation: { en: 'You can die from someone else\'s misery—emotional states are as infectious as diseases. You may feel you are helping the drowning man, but you are only precipitating your own disaster.', ta: 'வேறொருவரின் துன்பத்தால் நீங்கள் இறக்க நேரிடலாம்—உணர்ச்சி நிலைகள் நோய்களைப் போலவே தொற்றுநோயானவை. மூழ்கும் மனிதனுக்கு நீங்கள் உதவுவதாக நீங்கள் உணரலாம், ஆனால் நீங்கள் உங்களின் சொந்தப் பேரழிவையே துரிதப்படுத்துகிறீர்கள்.' },
      whyItMatters: { en: 'People who are chronically unhappy or attract drama will drag you down with them. Their bad habits and negative mindset will slowly infect you.', ta: 'நாள்பட்ட மகிழ்ச்சியற்ற அல்லது நாடகத்தனத்தை ஈர்க்கும் மனிதர்கள் தங்களோடு சேர்த்து உங்களையும் கீழே இழுப்பார்கள். அவர்களின் கெட்ட பழக்கங்களும் எதிர்மறையான மனநிலையும் மெதுவாக உங்களைத் தொற்றிக்கொள்ளும்.' },
      example: { en: 'Staying friends with a chronic complainer who constantly plays the victim, until you start seeing the whole world as unfair and stop trying.', ta: 'தொடர்ந்து பலியாகும் நாடகமாடும் நாள்பட்ட புகார் செய்பவருடன் நண்பராக இருப்பது, உலகம் முழுவதையும் நியாயமற்றதாகப் பார்த்து நீங்கள் முயற்சி செய்வதை நிறுத்தும் வரை.' },
      actionStep: { en: 'Identify one "infectious" person in your life who constantly brings drama or negativity. Distance yourself from them immediately.', ta: 'தொடர்ந்து நாடகத்தனம் அல்லது எதிர்மறையைக் கொண்டுவரும் "தொற்று" நபர் ஒருவரை உங்கள் வாழ்க்கையில் அடையாளம் காணவும். அவர்களிடமிருந்து உடனடியாக விலகி இருங்கள்.' },
      reflectionQuestion: { en: 'Are you playing the "savior" to toxic people at the expense of your own mental health?', ta: 'உங்கள் சொந்த மன ஆரோக்கியத்தைப் பணயம் வைத்து நச்சு மனிதர்களுக்கு நீங்கள் "இரட்சகராக" விளையாடுகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Learn to Keep People Dependent on You', ta: 'மனிதர்களை உங்களைச் சார்ந்திருக்க வைக்கக் கற்றுக்கொள்ளுங்கள்' },
      explanation: { en: 'To maintain your independence you must always be needed and wanted. The more you are relied on, the more freedom you have.', ta: 'உங்கள் சுதந்திரத்தைப் பேண நீங்கள் எப்போதும் தேவைப்படுபவராகவும் விரும்பப்படுபவராகவும் இருக்க வேண்டும். நீங்கள் எவ்வளவு அதிகமாகச் சார்ந்து இருக்கப்படுகிறீர்களோ, அவ்வளவு அதிக சுதந்திரம் உங்களுக்குக் கிடைக்கும்.' },
      whyItMatters: { en: 'If you teach someone everything you know, they no longer need you and can replace you. If you possess a unique skill they cannot survive without, you hold the power.', ta: 'உங்களுக்குத் தெரிந்த அனைத்தையும் ஒருவருக்குக் கற்றுக் கொடுத்தால், அவர்களுக்கு இனி நீங்கள் தேவையில்லை, அவர்கள் உங்களுக்குப் பதிலாக வேறொருவரை நியமிக்கலாம். அவர்கள் உயிர்வாழ முடியாத ஒரு தனித்துவமான திறனை நீங்கள் பெற்றிருந்தால், அதிகாரம் உங்களிடமே இருக்கும்.' },
      example: { en: 'A software engineer who writes the core algorithm for a tech startup but keeps the deepest intricacies of the code to themselves so they cannot be fired.', ta: 'ஒரு தொழில்நுட்ப ஸ்டார்ட்அப்பிற்கான முக்கிய அல்காரிதத்தை எழுதும் ஒரு மென்பொருள் பொறியாளர், ஆனால் குறியீட்டின் ஆழமான நுணுக்கங்களை தங்களுக்குள்ளேயே வைத்துக் கொள்வதன் மூலம் அவர்கள் பணிநீக்கம் செய்யப்படுவதைத் தவிர்க்கிறார்கள்.' },
      actionStep: { en: 'Develop a rare, highly valuable skill at your job that nobody else possesses, ensuring you are irreplaceable.', ta: 'உங்களைத் தவிர வேறு யாரிடமும் இல்லாத, அரிதான, மிகவும் மதிப்புமிக்க ஒரு திறனை உங்கள் வேலையில் வளர்த்துக் கொள்ளுங்கள், உங்களை ஈடுசெய்ய முடியாது என்பதை உறுதிப்படுத்திக் கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you easily replaceable in your current role, or does the system collapse without you?', ta: 'உங்களின் தற்போதைய பாத்திரத்தில் நீங்கள் எளிதில் மாற்றப்படக்கூடியவரா, அல்லது நீங்கள் இல்லாமல் அமைப்பு சரிந்துவிடுமா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Use Selective Honesty and Generosity to Disarm Your Victim', ta: 'உங்கள் பலியாடை நிராயுதபாணியாக்கத் தேர்ந்தெடுக்கப்பட்ட நேர்மையையும் தாராள மனப்பான்மையையும் பயன்படுத்துங்கள்' },
      explanation: { en: 'One sincere and honest move will cover over dozens of dishonest ones. Open-hearted gestures of honesty and generosity bring down the guard of even the most suspicious people.', ta: 'ஒரு உண்மையான மற்றும் நேர்மையான நகர்வு டஜன் கணக்கான நேர்மையற்ற செயல்களை மறைக்கும். நேர்மை மற்றும் தாராள மனப்பான்மையின் திறந்த மனதுடனான சைகைகள் மிகவும் சந்தேகப்படும் மனிதர்களின் தற்காப்பைக் கூட வீழ்த்திவிடும்.' },
      whyItMatters: { en: 'If you want to deceive or outmaneuver someone, you must first earn their trust. Giving them a small gift or admitting a minor fault makes them think you are completely transparent.', ta: 'நீங்கள் ஒருவரை ஏமாற்ற அல்லது சூழ்ச்சியால் வெல்ல விரும்பினால், நீங்கள் முதலில் அவர்களின் நம்பிக்கையைப் பெற வேண்டும். அவர்களுக்கு ஒரு சிறிய பரிசைக் கொடுப்பது அல்லது ஒரு சிறிய தவற்றை ஒப்புக்கொள்வது நீங்கள் முற்றிலும் வெளிப்படையானவர் என்று அவர்களை நினைக்க வைக்கும்.' },
      example: { en: 'A con artist returning a "dropped" wallet to a wealthy target to prove their honesty, only to scam them out of thousands later once trust is established.', ta: 'நம்பிக்கை ஏற்பட்ட பிறகு ஆயிரக்கணக்கில் மோசடி செய்வதற்காக மட்டுமே, ஒரு மோசடிப் பேர்வழி தனது நேர்மையை நிரூபிக்க "கீழே விழுந்த" பணப்பையை பணக்கார இலக்கிடம் திருப்பிக் கொடுப்பது.' },
      actionStep: { en: 'To win someone\'s favor, voluntarily confess to a minor weakness or mistake to prove your "honesty" to them.', ta: 'ஒருவரின் ஆதரவைப் பெற, அவர்களுக்கு உங்களின் "நேர்மையை" நிரூபிக்க ஒரு சிறிய பலவீனம் அல்லது தவற்றைத் தாமாகவே ஒப்புக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you easily manipulated by small acts of kindness from people you should be wary of?', ta: 'நீங்கள் எச்சரிக்கையாக இருக்க வேண்டிய மனிதர்களின் சிறிய கருணைச் செயல்களால் எளிதில் கையாளப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'When Asking for Help, Appeal to People\'s Self-Interest', ta: 'உதவி கேட்கும்போது, மனிதர்களின் சுயநலத்தை ஈர்க்கவும்' },
      explanation: { en: 'Never appeal to their mercy or gratitude. If you need to turn to an ally for help, do not remind them of your past assistance. Uncover something in your request that will benefit them.', ta: 'அவர்களின் கருணையையோ அல்லது நன்றியையோ ஒருபோதும் ஈர்க்காதீர்கள். உதவிக்காக நீங்கள் ஒரு கூட்டாளியை நாட வேண்டியிருந்தால், நீங்கள் கடந்த காலத்தில் செய்த உதவியை அவர்களுக்கு நினைவூட்டாதீர்கள். உங்கள் கோரிக்கையில் அவர்களுக்குப் பயனளிக்கும் எதையாவது வெளிப்படுத்துங்கள்.' },
      whyItMatters: { en: 'People are primarily driven by self-interest. Guilt-tripping them about the past breeds resentment, but showing them how they will get rich or famous guarantees their enthusiastic help.', ta: 'மக்கள் முதன்மையாகச் சுயநலத்தால் உந்தப்படுகிறார்கள். கடந்த காலத்தைப் பற்றி அவர்களைக் குற்ற உணர்ச்சிக்கு ஆளாக்குவது மனக்கசப்பை வளர்க்கிறது, ஆனால் அவர்கள் எப்படிப் பணக்காரர்களாக அல்லது பிரபலமானவர்களாக மாறுவார்கள் என்பதை அவர்களுக்குக் காட்டுவது அவர்களின் உற்சாகமான உதவிக்கு உத்தரவாதம் அளிக்கிறது.' },
      example: { en: 'Instead of saying "You owe me because I helped you last year," saying "If you fund my new project, you will get a 50% cut of the profits."', ta: '"கடந்த ஆண்டு நான் உங்களுக்கு உதவியதால் நீங்கள் எனக்குக் கடன்பட்டிருக்கிறீர்கள்" என்று சொல்வதற்குப் பதிலாக, "நீங்கள் எனது புதிய திட்டத்திற்கு நிதியளித்தால், உங்களுக்கு 50% லாபம் கிடைக்கும்" என்று சொல்வது.' },
      actionStep: { en: 'Before pitching an idea or asking for a favor, write down three distinct ways the other person will personally profit from saying yes.', ta: 'ஒரு யோசனையை முன்வைப்பதற்கு அல்லது உதவி கேட்பதற்கு முன், மற்ற நபர் ஆம் என்று சொல்வதன் மூலம் தனிப்பட்ட முறையில் லாபம் அடையும் மூன்று வெவ்வேறு வழிகளை எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Do you expect the world to help you out of the goodness of its heart, or do you strategically align interests?', ta: 'உலகம் தனது இதயத்தின் நன்மையிலிருந்து உங்களுக்கு உதவும் என்று நீங்கள் எதிர்பார்க்கிறீர்களா, அல்லது நீங்கள் உத்திரீதியாக ஆர்வங்களைச் சீரமைக்கிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Pose as a Friend, Work as a Spy', ta: 'நண்பனைப் போலப் பாசாங்கு செய்யுங்கள், ஒற்றனைப் போல வேலை செய்யுங்கள்' },
      explanation: { en: 'Knowing about your rival is critical. Use spies to gather valuable information that will keep you a step ahead. Better still: play the spy yourself. In polite social encounters, learn to probe.', ta: 'உங்கள் போட்டியாளரைப் பற்றி அறிவது மிகவும் முக்கியமானது. உங்களை ஒரு படி முன்னே வைத்திருக்க மதிப்புமிக்க தகவல்களைச் சேகரிக்க ஒற்றர்களைப் பயன்படுத்துங்கள். இன்னும் சிறந்தது: நீங்களே ஒற்றனாகச் செயல்படுங்கள். கண்ணியமான சமூக சந்திப்புகளில், துருவி ஆராயக் கற்றுக்கொள்ளுங்கள்.' },
      whyItMatters: { en: 'Information is power. If you know your opponent\'s weaknesses, fears, and intentions, you can anticipate their moves and defeat them effortlessly.', ta: 'தகவலே அதிகாரம். உங்கள் எதிரியின் பலவீனங்கள், பயங்கள் மற்றும் நோக்கங்கள் உங்களுக்குத் தெரிந்தால், அவர்களின் நகர்வுகளை உங்களால் முன்கூட்டியே கணிக்க முடியும் மற்றும் அவர்களை சிரமமின்றி தோற்கடிக்க முடியும்.' },
      example: { en: 'At a dinner party, asking seemingly innocent questions to a competitor to figure out their company\'s upcoming launch dates and financial struggles.', ta: 'ஒரு இரவு விருந்தில், ஒரு போட்டியாளரிடம் அவர்களின் நிறுவனத்தின் வரவிருக்கும் வெளியீட்டுத் தேதிகள் மற்றும் நிதிப் போராட்டங்களைக் கண்டறிய வெளிப்படையாகத் தீங்கற்ற கேள்விகளைக் கேட்பது.' },
      actionStep: { en: 'In a conversation today, talk less and ask strategic, open-ended questions to uncover what the other person truly values or fears.', ta: 'இன்று ஒரு உரையாடலில், குறைவாகப் பேசுங்கள் மற்றும் மற்ற நபர் உண்மையாகவே எதை மதிக்கிறார் அல்லது எதற்குப் பயப்படுகிறார் என்பதைக் கண்டறிய உத்திரீதியான, திறந்த கேள்விகளைக் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Are you giving away all your secrets in casual conversation while learning nothing about the people around you?', ta: 'உங்களைச் சுற்றியுள்ள மனிதர்களைப் பற்றி எதையும் தெரிந்துகொள்ளாமல், சாதாரண உரையாடலில் உங்களின் அனைத்து ரகசியங்களையும் விட்டுக்கொடுக்கிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Crush Your Enemy Totally', ta: 'உங்கள் எதிரியை முற்றிலுமாக நசுக்குங்கள்' },
      explanation: { en: 'All great leaders since Moses have known that a feared enemy must be crushed completely. If one ember is left alight, no matter how dimly it smolders, a fire will eventually break out.', ta: 'மோசே முதற்கொண்டு அனைத்துச் சிறந்த தலைவர்களும் அஞ்சப்படும் எதிரியை முற்றிலுமாக நசுக்க வேண்டும் என்பதை அறிந்திருக்கிறார்கள். ஒரு தணல் எரிந்துகொண்டிருந்தால், அது எவ்வளவு மங்கலாகக் புகைந்தாலும், இறுதியில் நெருப்பு வெடிக்கும்.' },
      whyItMatters: { en: 'Showing mercy to a bitter rival gives them time to recover, nurse their hatred, and seek revenge when you least expect it.', ta: 'ஒரு கடுமையான போட்டியாளருக்குக் கருணை காட்டுவது, அவர்கள் மீண்டு வரவும், தங்கள் வெறுப்பை வளர்க்கவும், நீங்கள் சற்றும் எதிர்பாராத நேரத்தில் பழிவாங்கவும் நேரத்தைக் கொடுக்கிறது.' },
      example: { en: 'A corporation not just beating a competitor, but buying out their suppliers and poaching their top talent to ensure they go bankrupt and can never return.', ta: 'ஒரு நிறுவனம் ஒரு போட்டியாளரைத் தோற்கடிப்பது மட்டுமின்றி, அவர்களின் சப்ளையர்களை விலைக்கு வாங்குவதும், அவர்களின் தலைசிறந்த திறமையாளர்களைத் திருடுவதும், அவர்கள் திவாலாகி ஒருபோதும் திரும்ப முடியாது என்பதை உறுதிப்படுத்துவதற்காக.' },
      actionStep: { en: 'If you are dealing with a toxic situation or person, cut ties completely. No "staying friends," no half-measures. Block, delete, and remove them entirely.', ta: 'நீங்கள் ஒரு நச்சு நிலைமை அல்லது நபரை எதிர்கொண்டால், உறவுகளை முற்றிலுமாகத் துண்டிக்கவும். "நண்பர்களாகத் தொடர்வது" இல்லை, அரைகுறை நடவடிக்கைகள் இல்லை. அவர்களைத் தடுத்து, நீக்கி, முற்றிலுமாக அகற்றவும்.' },
      reflectionQuestion: { en: 'Are you keeping enemies around out of false pity, only for them to stab you in the back later?', ta: 'தவறான பரிதாபத்தால் நீங்கள் எதிரிகளைச் சுற்றி வைத்திருக்கிறீர்களா, பின்னர் அவர்கள் உங்களை முதுகில் குத்துவதற்காக மட்டுமா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Use Absence to Increase Respect and Honor', ta: 'மரியாதை மற்றும் மதிப்பினை அதிகரிக்க இல்லாமையைப் பயன்படுத்துங்கள்' },
      explanation: { en: 'Too much circulation makes the price go down: The more you are seen and heard from, the more common you appear. You must learn when to leave.', ta: 'அதிகப்படியான புழக்கம் விலையைக் குறைக்கிறது: நீங்கள் எவ்வளவு அதிகமாகக் காணப்படுகிறீர்களோ, கேட்கப்படுகிறீர்களோ, அவ்வளவு சாதாரணமாகத் தோன்றுவீர்கள். எப்போது வெளியேற வேண்டும் என்பதை நீங்கள் கற்றுக்கொள்ள வேண்டும்.' },
      whyItMatters: { en: 'Scarcity creates value. If you are always available and always talking, people stop appreciating you. Withdrawing creates a mystique and makes people demand your presence.', ta: 'பற்றாக்குறை மதிப்பை உருவாக்குகிறது. நீங்கள் எப்போதும் கிடைப்பவராகவும் எப்போதும் பேசுபவராகவும் இருந்தால், மக்கள் உங்களைப் பாராட்டுவதை நிறுத்துகிறார்கள். விலகி இருப்பது ஒரு மர்மத்தை உருவாக்குகிறது மற்றும் உங்கள் இருப்பை மக்கள் கோரச் செய்கிறது.' },
      example: { en: 'A successful consultant who only accepts a few clients a year and is hard to reach, causing their hourly rate and prestige to skyrocket.', ta: 'ஆண்டுக்குச் சில வாடிக்கையாளர்களை மட்டுமே ஏற்றுக்கொள்ளும் மற்றும் தொடர்புகொள்ளக் கடினமாக இருக்கும் ஒரு வெற்றிகரமான ஆலோசகர், அவர்களின் மணிநேரக் கட்டணமும் கௌரவமும் விண்ணை முட்டக் காரணமாகிறார்.' },
      actionStep: { en: 'Stop replying to emails and texts instantly. Give people a chance to miss your presence and realize your time is valuable.', ta: 'மின்னஞ்சல்கள் மற்றும் குறுஞ்செய்திகளுக்கு உடனடியாகப் பதிலளிப்பதை நிறுத்துங்கள். உங்கள் இருப்பை மக்கள் இழக்கவும், உங்கள் நேரம் மதிப்புமிக்கது என்பதை உணரவும் அவர்களுக்கு ஒரு வாய்ப்பைக் கொடுங்கள்.' },
      reflectionQuestion: { en: 'Are you so overly available that people take your presence for granted?', ta: 'நீங்கள் மிக எளிதாகக் கிடைப்பவராகி, உங்கள் இருப்பை மக்கள் சாதாரணமாக எடுத்துக்கொள்கிறார்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Keep Others in Suspended Terror: Cultivate an Air of Unpredictability', ta: 'மற்றவர்களை இடைநிறுத்தப்பட்ட பீதியில் வைத்திருங்கள்: கணிக்க முடியாத தன்மையை வளர்த்துக் கொள்ளுங்கள்' },
      explanation: { en: 'Humans are creatures of habit with an insatiable need to see familiarity in other people\'s actions. Your predictability gives them a sense of control. Turn the tables.', ta: 'மனிதர்கள் மற்றவர்களின் செயல்களில் பழக்கத்தைப் பார்க்கும் திருப்தியற்ற தேவையைக் கொண்ட பழக்கவழக்க உயிரினங்கள். உங்கள் கணிக்கக்கூடிய தன்மை அவர்களுக்கு ஒரு கட்டுப்பாட்டு உணர்வைத் தருகிறது. நிலைமையை மாற்றுங்கள்.' },
      whyItMatters: { en: 'If people can predict your next move, they can prepare a counter-attack. Unpredictability causes fear, confusion, and forces others to constantly stay on their toes.', ta: 'மக்கள் உங்களின் அடுத்த நகர்வைக் கணிக்க முடிந்தால், அவர்கள் ஒரு எதிர்த் தாக்குதலைத் தயார் செய்யலாம். கணிக்க முடியாத தன்மை பயத்தையும், குழப்பத்தையும் ஏற்படுத்துகிறது, மேலும் மற்றவர்களைத் தொடர்ந்து விழிப்புடன் இருக்க வற்புறுத்துகிறது.' },
      example: { en: 'A boss who is usually strict suddenly giving the team a day off, then randomly firing someone a week later. The staff remains utterly obedient out of sheer confusion and terror.', ta: 'பொதுவாகக் கண்டிப்பாக இருக்கும் ஒரு முதலாளி திடீரெனக் குழுவிற்கு ஒரு நாள் விடுப்பு அளித்து, பின்னர் ஒரு வாரம் கழித்து யாரோ ஒருவரைத் தற்செயலாக வேலையிலிருந்து நீக்குவது. ஊழியர்கள் வெறும் குழப்பம் மற்றும் பீதியால் முற்றிலும் கீழ்ப்படிந்து இருப்பார்கள்.' },
      actionStep: { en: 'Do something completely out of character today (positively or neutrally) to remind people that they do not have you entirely figured out.', ta: 'மனிதர்கள் உங்களை முற்றிலுமாகக் கணிக்கவில்லை என்பதை அவர்களுக்கு நினைவூட்ட, இன்று உங்களின் இயல்புக்கு மாறான ஒன்றை (நேர்மறையாக அல்லது நடுநிலையாக) செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you so boringly predictable that people easily manipulate you?', ta: 'மனிதர்கள் உங்களை எளிதாகக் கையாளும் அளவுக்கு நீங்கள் சலிப்படையச் செய்யும் வகையில் கணிக்கக்கூடியவரா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Do Not Build Fortresses to Protect Yourself—Isolation is Dangerous', ta: 'உங்களைப் பாதுகாத்துக் கொள்ள கோட்டைகளைக் கட்டாதீர்கள்—தனிமைப்படுத்தல் ஆபத்தானது' },
      explanation: { en: 'The world is dangerous and enemies are everywhere, but isolation exposes you to more dangers than it protects you from. It cuts you off from valuable information.', ta: 'உலகம் ஆபத்தானது மற்றும் எதிரிகள் எங்கும் இருக்கிறார்கள், ஆனால் தனிமைப்படுத்தல் உங்களை எதிலிருந்து பாதுகாக்கிறதோ அதை விட அதிக ஆபத்துக்களுக்கு உங்களை வெளிப்படுத்துகிறது. இது மதிப்புமிக்க தகவல்களிலிருந்து உங்களைத் துண்டிக்கிறது.' },
      whyItMatters: { en: 'A leader who hides in their office loses touch with reality. Mingling with the crowd makes you invisible, provides you with allies, and acts as a shield.', ta: 'தங்கள் அலுவலகத்தில் ஒளிந்துகொள்ளும் ஒரு தலைவர் யதார்த்தத்துடனான தொடர்பை இழக்கிறார். கூட்டத்துடன் கலப்பது உங்களைக் கண்ணுக்குத் தெரியாமல் ஆக்குகிறது, உங்களுக்குக் கூட்டாளிகளை வழங்குகிறது மற்றும் ஒரு கேடயமாகச் செயல்படுகிறது.' },
      example: { en: 'A king who locks himself in a castle is easily overthrown because he doesn\'t hear the whispers of rebellion in the streets until the mob is at the gate.', ta: 'கோட்டைக்குள் தன்னை அடைத்துக்கொள்ளும் ஒரு அரசன் எளிதில் தூக்கியெறியப்படுவான், ஏனென்றால் கூட்டம் வாசலுக்கு வரும் வரை தெருக்களில் நடக்கும் கிளர்ச்சியின் கிசுகிசுக்களை அவன் கேட்க மாட்டான்.' },
      actionStep: { en: 'Get out of your bubble today. Go to a social event, talk to people in different departments, and gather information on the ground.', ta: 'இன்று உங்கள் குமிழியை விட்டு வெளியே வாருங்கள். ஒரு சமூக நிகழ்வுக்குச் செல்லுங்கள், வெவ்வேறு துறைகளில் உள்ள மனிதர்களிடம் பேசுங்கள், களத்தில் உள்ள தகவல்களைச் சேகரியுங்கள்.' },
      reflectionQuestion: { en: 'Are you hiding from the world out of fear, losing touch with what is actually happening?', ta: 'உண்மையில் என்ன நடக்கிறது என்ற தொடர்பை இழந்து, பயத்தால் நீங்கள் உலகத்திலிருந்து ஒளிந்துகொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Know Who You\'re Dealing With—Do Not Offend the Wrong Person', ta: 'நீங்கள் யாரைக் கையாளுகிறீர்கள் என்பதைத் தெரிந்துகொள்ளுங்கள்—தவறான நபரைப் புண்படுத்தாதீர்கள்' },
      explanation: { en: 'There are many different kinds of people in the world, and you can never assume that everyone will react to your strategies in the same way. Deceive or outmaneuver some people and they will spend the rest of their lives seeking revenge.', ta: 'உலகில் பல வகையான மனிதர்கள் உள்ளனர், உங்களின் உத்திகளுக்கு அனைவரும் ஒரே மாதிரியாகப் பதிலளிப்பார்கள் என்று நீங்கள் ஒருபோதும் கருத முடியாது. சில மனிதர்களை ஏமாற்றுங்கள் அல்லது சூழ்ச்சியால் வெல்லுங்கள், அவர்கள் தங்கள் வாழ்நாள் முழுவதையும் பழிவாங்குவதிலேயே செலவிடுவார்கள்.' },
      whyItMatters: { en: 'Pride and ego make some people incredibly dangerous. If you accidentally insult a deeply insecure, vindictive person, they will destroy you.', ta: 'பெருமை மற்றும் ஈகோ சில மனிதர்களை நம்பமுடியாத அளவிற்கு ஆபத்தானவர்களாக ஆக்குகிறது. ஆழமான பாதுகாப்பற்ற, பழிவாங்கும் குணமுள்ள ஒருவரை நீங்கள் தற்செயலாக அவமதித்தால், அவர்கள் உங்களை அழித்துவிடுவார்கள்.' },
      example: { en: 'A con artist attempting to scam a ruthless mafia boss, completely misjudging their target, and ending up at the bottom of a river.', ta: 'ஒரு இரக்கமற்ற மாஃபியா முதலாளியை மோசடி செய்ய முயற்சிக்கும் ஒரு மோசடிப் பேர்வழி, தங்கள் இலக்கை முற்றிலும் தவறாக மதிப்பிட்டு, இறுதியில் ஒரு நதியின் அடியில் முடிகிறார்.' },
      actionStep: { en: 'Before engaging in conflict or negotiation, thoroughly research the person\'s background, reputation, and ego triggers. Never rely on first impressions.', ta: 'மோதல் அல்லது பேச்சுவார்த்தையில் ஈடுபடுவதற்கு முன், அந்த நபரின் பின்னணி, நற்பெயர் மற்றும் ஈகோ தூண்டுதல்களை முழுமையாக ஆராயுங்கள். முதல் தோற்றங்களை ஒருபோதும் நம்பாதீர்கள்.' },
      reflectionQuestion: { en: 'Do you treat everyone exactly the same, ignoring the fact that some people are silent predators?', ta: 'சில மனிதர்கள் அமைதியான வேட்டையாடுபவர்கள் என்ற உண்மையை புறக்கணித்து, எல்லோரையும் நீங்கள் ஒரே மாதிரியாக நடத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Do Not Commit to Anyone', ta: 'யாரிடமும் உறுதியளிக்க வேண்டாம்' },
      explanation: { en: 'It is the fool who always rushes to take sides. Do not commit to any side or cause but yourself. By maintaining your independence, you become the master of others.', ta: 'எப்பொழுதும் ஒரு தரப்பை எடுக்க விரைபவன் முட்டாள். உங்களைத் தவிர எந்தத் தரப்புக்கும் அல்லது நோக்கத்துக்கும் உறுதியளிக்க வேண்டாம். உங்கள் சுதந்திரத்தைப் பேணுவதன் மூலம், நீங்கள் மற்றவர்களின் எஜமானராக ஆவீர்கள்.' },
      whyItMatters: { en: 'When you take a side, you make enemies of the other side and become a pawn to your allies. By staying aloof, both sides will court your favor and try to win you over.', ta: 'நீங்கள் ஒரு தரப்பை எடுக்கும்போது, மற்ற தரப்பினரை எதிரிகளாக்குகிறீர்கள், உங்கள் கூட்டாளிகளுக்கு ஒரு பகடையாக்குகிறீர்கள். ஒதுங்கியிருப்பதன் மூலம், இரு தரப்பினரும் உங்கள் ஆதரவைக் கோருவார்கள், உங்களை வெல்ல முயற்சிப்பார்கள்.' },
      example: { en: 'Queen Elizabeth I refusing to marry any European monarch. By staying single, she kept Spain, France, and others dangling, maintaining ultimate power in Europe.', ta: 'எந்தவொரு ஐரோப்பிய மன்னரையும் மணக்க ராணி முதலாம் எலிசபெத் மறுத்தது. தனித்திருப்பதன் மூலம், அவர் ஸ்பெயின், பிரான்ஸ் மற்றும் பிறரை ஊசலாட வைத்து, ஐரோப்பாவில் இறுதி அதிகாரத்தைத் தக்கவைத்துக்கொண்டார்.' },
      actionStep: { en: 'When two colleagues are arguing, refuse to take a side. Nod, listen, but remain completely neutral so you keep the respect of both.', ta: 'இரண்டு சக ஊழியர்கள் வாதிடும்போது, ஒரு தரப்பை எடுக்க மறுக்கவும். தலையாட்டுங்கள், கேளுங்கள், ஆனால் முற்றிலும் நடுநிலையாக இருங்கள், இதனால் நீங்கள் இருவரின் மரியாதையையும் தக்கவைத்துக்கொள்வீர்கள்.' },
      reflectionQuestion: { en: 'Are you desperately aligning yourself with groups just to feel like you belong, sacrificing your own power?', ta: 'உங்கள் சொந்த அதிகாரத்தை தியாகம் செய்து, நீங்கள் ஒரு குழுவைச் சேர்ந்தவர் என்று உணருவதற்காக மட்டுமே குழுக்களுடன் உங்களைத் தீவிரமாக இணைத்துக் கொள்கிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The 48 Laws of Power' });
    if (existing) {
      console.log('The 48 Laws of Power already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The 48 Laws of Power' });
    }
    
    await WisdomBook.create(lawsOfPowerBook);
    console.log('The 48 Laws of Power added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
