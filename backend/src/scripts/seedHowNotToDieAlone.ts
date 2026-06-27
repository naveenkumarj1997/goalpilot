import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const howNotToDieAloneBook = {
  title: 'How to Not Die Alone',
  author: 'Logan Ury',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781982120627-L.jpg',
  categories: ['Relationships', 'Psychology', 'Self-Help'],
  themes: [
    { en: 'Dating Science', ta: 'டேட்டிங் அறிவியல்' },
    { en: 'Behavioral Psychology', ta: 'நடத்தை உளவியல்' }
  ],
  overview: {
    en: 'A step-by-step guide to modern dating based on behavioral science. Logan Ury explains the invisible forces driving our bad dating habits and provides practical tools to help you find, build, and keep a great relationship.',
    ta: 'நடத்தை அறிவியலை அடிப்படையாகக் கொண்ட நவீன டேட்டிங்கிற்கான ஒரு படிப்படியான வழிகாட்டி. நமது மோசமான டேட்டிங் பழக்கங்களைத் தூண்டும் கண்ணுக்குத் தெரியாத சக்திகளை லோகன் யூரி விளக்குகிறார், மேலும் ஒரு சிறந்த உறவைக் கண்டறியவும், உருவாக்கவும், பாதுகாக்கவும் நடைமுறை கருவிகளை வழங்குகிறார்.'
  },
  topQuotes: [
    { en: 'Great relationships are built, not discovered.', ta: 'சிறந்த உறவுகள் உருவாக்கப்படுகின்றன, கண்டுபிடிக்கப்படுவதில்லை.' },
    { en: 'Stop looking for a prom date and start looking for a life partner.', ta: 'ஒரு நாள் கொண்டாட்டத்திற்கான துணையைத் தேடுவதை நிறுத்திவிட்டு, வாழ்க்கைத்துணையைத் தேடத் தொடங்குங்கள்.' },
    { en: 'The spark is a myth. Don\'t reject someone just because you didn\'t feel fireworks on the first date.', ta: 'ஆரம்ப ஈர்ப்பு ஒரு மாயை. முதல் சந்திப்பிலேயே பட்டாசு வெடிப்பதைப் போல உணரவில்லை என்பதற்காக யாரையும் நிராகரிக்காதீர்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Romanticizer', ta: 'ரொமான்டிசைசர்' },
      explanation: { en: 'Romanticizers believe in soulmates and the "meet-cute." They expect love to happen effortlessly and magically, just like in the movies.', ta: 'ரொமான்டிசைசர்கள் ஆத்ம துணைகள் மற்றும் "சினிமாத்தனமான சந்திப்புகளை" நம்புகிறார்கள். திரைப்படங்களில் வருவது போல காதல் சிரமமின்றியும் மாயாஜாலமாகவும் நடக்கும் என்று அவர்கள் எதிர்பார்க்கிறார்கள்.' },
      whyItMatters: { en: 'This mindset sets you up for disappointment because real relationships require effort, compromise, and work, not just a magical spark.', ta: 'உண்மையான உறவுகளுக்கு முயற்சி, சமரசம் மற்றும் வேலை தேவை, மாயாஜால ஈர்ப்பு மட்டுமல்ல என்பதால், இந்த மனநிலை உங்களை ஏமாற்றத்திற்கு ஆளாக்குகிறது.' },
      example: { en: 'Rejecting a perfectly good partner because the way you met wasn\'t a "good enough story" for your friends.', ta: 'நீங்கள் சந்தித்த விதம் உங்கள் நண்பர்களுக்குச் சொல்ல "போதுமான நல்ல கதையாக" இல்லை என்பதற்காக முற்றிலும் நல்ல ஒரு துணையை நிராகரிப்பது.' },
      actionStep: { en: 'Acknowledge that true love is built through shared experiences and hard work, not found fully formed on day one.', ta: 'உண்மையான காதல் பகிரப்பட்ட அனுபவங்கள் மற்றும் கடின உழைப்பின் மூலம் கட்டமைக்கப்படுகிறது, முதல் நாளிலேயே முழுமையாக உருவாவதில்லை என்பதை ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you waiting for a fairy tale instead of building a real relationship?', ta: 'உண்மையான உறவை உருவாக்குவதற்குப் பதிலாக நீங்கள் ஒரு விசித்திரக் கதைக்காகக் காத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The Maximizer', ta: 'மாக்ஸிமைசர்' },
      explanation: { en: 'Maximizers want to make the 100% perfect choice. They endlessly search for the "best" partner and fear settling for someone when someone better might be out there.', ta: 'மாக்ஸிமைசர்கள் 100% சரியான தேர்வைச் செய்ய விரும்புகிறார்கள். அவர்கள் "சிறந்த" துணையை முடிவில்லாமல் தேடுகிறார்கள், சிறந்த ஒருவர் வெளியில் இருக்கும்போது ஒருவருடன் செட்டில் ஆக பயப்படுகிறார்கள்.' },
      whyItMatters: { en: 'Maximizers are prone to decision paralysis and chronic dissatisfaction because there is always a hypothetical "better" option.', ta: 'எப்போதும் ஒரு கற்பனையான "சிறந்த" விருப்பம் இருப்பதால், மாக்ஸிமைசர்கள் முடிவெடுக்க முடியாமலும் நாள்பட்ட அதிருப்திக்கும் ஆளாகிறார்கள்.' },
      example: { en: 'Going on 50 Tinder dates and finding a flaw in every single person because you think date #51 will be flawless.', ta: '51வது நபர் குறையற்றவராக இருப்பார் என்று நினைத்து 50 பேரைச் சந்தித்து ஒவ்வொருவரிடமும் ஒரு குறையைக் கண்டுபிடிப்பது.' },
      actionStep: { en: 'Become a "Satisficer" — decide what criteria are most important, and commit to the first person who meets them.', ta: 'ஒரு "சாட்டிஸ்ஃபைசர்"-ஆக மாறுங்கள் — எந்த அளவுகோல்கள் மிக முக்கியமானவை என்பதை முடிவு செய்து, அவற்றைச் சந்திக்கும் முதல் நபருக்கு அர்ப்பணியுங்கள்.' },
      reflectionQuestion: { en: 'Are you letting the illusion of the "perfect" partner ruin a potentially great relationship?', ta: 'கச்சிதமான துணை என்ற மாயை ஒரு சிறந்த உறவை அழிக்க அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'The Hesitater', ta: 'தயங்குபவர்' },
      explanation: { en: 'Hesitaters feel they are not ready to date until they are perfectly polished (lose weight, get a better job, fix their apartment).', ta: 'தயங்குபவர்கள் தாங்கள் முழுமையாகத் தயாராகும் வரை (எடை குறைப்பது, நல்ல வேலை கிடைப்பது, வீட்டைச் சரிசெய்வது) டேட்டிங் செய்யத் தயாராக இல்லை என்று உணர்கிறார்கள்.' },
      whyItMatters: { en: 'You will never feel 100% ready. By waiting for perfection, you are missing out on learning how to date through actual practice.', ta: 'நீங்கள் ஒருபோதும் 100% தயாராக உணர மாட்டீர்கள். முழுமைக்காக காத்திருப்பதன் மூலம், உண்மையான பயிற்சி மூலம் டேட்டிங் செய்வது எப்படி என்பதைக் கற்றுக்கொள்வதை நீங்கள் இழக்கிறீர்கள்.' },
      example: { en: 'Putting off downloading a dating app until you lose 10 pounds, which turns into waiting for two years.', ta: '10 பவுண்டுகள் எடை குறையும் வரை டேட்டிங் ஆப்பை டவுன்லோட் செய்வதை ஒத்திவைப்பது, அது இரண்டு வருடக் காத்திருப்பாக மாறுகிறது.' },
      actionStep: { en: 'Set a deadline to go on one date this month, exactly as you are right now, without fixing anything about yourself.', ta: 'உங்களைப் பற்றி எதையும் சரிசெய்யாமல், இப்போது நீங்கள் இருக்கும் நிலையிலேயே இந்த மாதம் ஒருவரைச் சந்திக்க ஒரு காலக்கெடுவை அமைக்கவும்.' },
      reflectionQuestion: { en: 'What excuse are you using right now to avoid putting yourself out there?', ta: 'உங்களை வெளிப்படுத்திக்கொள்வதைத் தவிர்க்க இப்போது நீங்கள் என்ன சாக்குப்போக்கு சொல்கிறீர்கள்?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'The Spark is a Myth', ta: 'ஆரம்ப ஈர்ப்பு ஒரு மாயை' },
      explanation: { en: 'Many people look for an instant, overwhelming feeling of chemistry ("the spark") on a first date. If it’s not there, they don’t go on a second date.', ta: 'பலர் முதல் சந்திப்பிலேயே உடனடி, அதீத உணர்வை ("தீப்பொறி") தேடுகிறார்கள். அது இல்லையென்றால், அவர்கள் இரண்டாவது சந்திப்பிற்குச் செல்வதில்லை.' },
      whyItMatters: { en: 'The "spark" is often just anxiety or physical attraction. Deep connection takes time to grow; some of the best relationships start as a slow burn.', ta: '"தீப்பொறி" என்பது பெரும்பாலும் வெறும் பதட்டம் அல்லது உடல் ஈர்ப்பு மட்டுமே. ஆழமான பிணைப்பு வளர நேரம் எடுக்கும்; சில சிறந்த உறவுகள் மெதுவாகவே தொடங்குகின்றன.' },
      example: { en: 'Rejecting someone who is kind and reliable just because you didn\'t feel "butterflies" immediately.', ta: 'அன்பான மற்றும் நம்பகமான ஒருவரை உடனடியாக "வண்ணத்துப்பூச்சிகள் பறப்பது போல்" உணரவில்லை என்பதற்காக நிராகரிப்பது.' },
      actionStep: { en: 'Commit to going on a second date with someone if the first date was just "fine," even if there were no fireworks.', ta: 'முதல் சந்திப்பில் பட்டாசு வெடிக்கவில்லை என்றாலும் அது "பரவாயில்லை" என்று தோன்றினால், இரண்டாவது முறை சந்திக்க உறுதியளிக்கவும்.' },
      reflectionQuestion: { en: 'Have you confused anxiety (the fear of being rejected) with "the spark"?', ta: 'பதட்டத்தை (நிராகரிக்கப்படுவோம் என்ற பயம்) "தீப்பொறி" என்று நீங்கள் குழப்பிக்கொண்டீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Prom Date vs. Life Partner', ta: 'ஒரு நாள் கொண்டாட்டம் vs வாழ்க்கைத்துணை' },
      explanation: { en: 'We often date people who are fun for a night (good looking, charismatic) rather than people who are good for a lifetime (loyal, kind, emotionally stable).', ta: 'வாழ்நாள் முழுவதும் நல்லவராக இருப்பவர்களை விட (விசுவாசமானவர், அன்பானவர், உணர்ச்சிபூர்வமாக நிலையானவர்) ஒரு இரவு கொண்டாட்டத்திற்கு ஏற்றவர்களையே (அழகானவர், கவர்ச்சியானவர்) நாம் அடிக்கடி சந்திக்கிறோம்.' },
      whyItMatters: { en: 'The traits that make someone a great Prom Date often make them a terrible Life Partner when real-world problems arise.', ta: 'ஒருவரை சிறந்த கொண்டாட்டத் துணையாக மாற்றும் குணநலன்கள், நிஜ உலகப் பிரச்சனைகள் எழும்போது அவர்களை மோசமான வாழ்க்கைத்துணையாக ஆக்குகின்றன.' },
      example: { en: 'Choosing the exciting bad boy/girl over the reliable accountant who would actually show up when you are sick in the hospital.', ta: 'நீங்கள் மருத்துவமனையில் நோய்வாய்ப்பட்டிருக்கும்போது உண்மையில் உங்களைப் பார்க்க வரும் நம்பகமான கணக்காளரை விட, உற்சாகமூட்டும் முரட்டுப் பையன்/பெண்ணைத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Make a list of traits you want in a Life Partner. Are you currently prioritizing those over superficial traits?', ta: 'ஒரு வாழ்க்கைத்துணையிடம் நீங்கள் விரும்பும் பண்புகளின் பட்டியலை உருவாக்குங்கள். மேலோட்டமான பண்புகளை விட அவற்றுக்கு நீங்கள் முன்னுரிமை அளிக்கிறீர்களா?' },
      reflectionQuestion: { en: 'Are your dating criteria designed to impress your friends or to build a happy home?', ta: 'உங்கள் டேட்டிங் அளவுகோல்கள் உங்கள் நண்பர்களை ஈர்க்கவா அல்லது மகிழ்ச்சியான வீட்டை உருவாக்கவா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Fuck the Spark, Look for the Glow', ta: 'தீப்பொறியை விடுங்கள், ஒளியைத் தேடுங்கள்' },
      explanation: { en: 'Instead of looking for an explosive spark, look for someone who makes you feel calm, secure, and heard — this is the "glow."', ta: 'வெடிக்கும் தீப்பொறியைத் தேடுவதற்குப் பதிலாக, உங்களை அமைதியாகவும், பாதுகாப்பாகவும், கேட்கப்பட்டதாகவும் உணரவைக்கும் ஒருவரைத் தேடுங்கள் — இதுவே "ஒளி".' },
      whyItMatters: { en: 'The glow implies a secure attachment style. You want someone who feels like home, not someone who feels like a rollercoaster.', ta: 'ஒளி என்பது பாதுகாப்பான பிணைப்பு பாணியைக் குறிக்கிறது. உங்களுக்கு ரோலர்கோஸ்டர் போன்றவர் அல்ல, வீட்டைப் போன்ற உணர்வைத் தருபவரே தேவை.' },
      example: { en: 'Feeling deeply relaxed and authentic around someone, even if your heart isn\'t pounding out of your chest.', ta: 'இதயம் வேகமாகத் துடிக்கவில்லை என்றாலும், ஒருவருடன் இருக்கும்போது ஆழமான நிம்மதியையும் உண்மையான தன்மையையும் உணர்வது.' },
      actionStep: { en: 'After a date, ask yourself: "How did I feel about myself around them?" rather than "How impressive were they?"', ta: 'ஒருவரைச் சந்தித்த பிறகு, "அவர்கள் எவ்வளவு ஈர்க்கக்கூடியவர்கள்?" என்று கேட்பதற்குப் பதிலாக, "அவர்களுடன் இருக்கும்போது என்னைப் பற்றி நான் எப்படி உணர்ந்தேன்?" என்று உங்களைக் கேட்டுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Do you associate love with drama and anxiety, or with peace and comfort?', ta: 'நீங்கள் காதலை நாடகம் மற்றும் பதட்டத்துடன் தொடர்புபடுத்துகிறீர்களா, அல்லது அமைதி மற்றும் வசதியுடன் தொடர்புபடுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Attachment Styles Matter', ta: 'பிணைப்பு பாணிகள் முக்கியம்' },
      explanation: { en: 'People fall into three main attachment styles: Anxious (fear abandonment), Avoidant (fear intimacy), and Secure (comfortable with intimacy).', ta: 'மக்கள் மூன்று முக்கிய பிணைப்பு பாணிகளில் வருகிறார்கள்: கவலை (கைவிடப்படுவோம் என்ற பயம்), தவிர்ப்பு (நெருக்கத்தின் மீதான பயம்) மற்றும் பாதுகாப்பானது (நெருக்கத்துடன் வசதியாக இருப்பது).' },
      whyItMatters: { en: 'Anxious and Avoidant people often attract each other, creating a toxic cycle. Seeking out Secure partners is the key to relationship stability.', ta: 'கவலை மற்றும் தவிர்க்கும் நபர்கள் பெரும்பாலும் ஒருவரையொருவர் ஈர்க்கிறார்கள், இது ஒரு நச்சு சுழற்சியை உருவாக்குகிறது. பாதுகாப்பான துணையைத் தேடுவதே உறவின் நிலைத்தன்மைக்கு முக்கியமாகும்.' },
      example: { en: 'An Anxious person constantly texting an Avoidant person who keeps pulling away for "space."', ta: '"இடைவெளிக்காக" தொடர்ந்து விலகிச் செல்லும் தவிர்க்கும் நபருக்கு ஒரு கவலையான நபர் தொடர்ந்து மெசேஜ் அனுப்புவது.' },
      actionStep: { en: 'Identify your own attachment style so you can recognize your triggers when dating.', ta: 'உங்களின் சொந்த பிணைப்பு பாணியை அடையாளம் காணுங்கள், இதனால் டேட்டிங் செய்யும் போது உங்களின் தூண்டுதல்களை நீங்கள் அறிய முடியும்.' },
      reflectionQuestion: { en: 'Are you chronically attracted to people who are emotionally unavailable?', ta: 'உணர்ச்சிபூர்வமாகக் கிடைக்காத நபர்களால் நீங்கள் நாள்பட்ட அளவில் ஈர்க்கப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'The Post-Date Eight', ta: 'சந்திப்பிற்குப் பிந்தைய எட்டு கேள்விகள்' },
      explanation: { en: 'Instead of asking "Is he/she the one?", ask yourself 8 specific questions after a date, focusing on how the person made you feel.', ta: 'அவர் தான் உங்களுக்கானவரா என்று கேட்பதற்குப் பதிலாக, சந்திப்பிற்குப் பிறகு அந்த நபர் உங்களை எப்படி உணர வைத்தார் என்பதில் கவனம் செலுத்தி 8 குறிப்பிட்ட கேள்விகளை உங்களைக் கேட்டுக்கொள்ளுங்கள்.' },
      whyItMatters: { en: 'This shifts your focus from evaluating their resume (job, height, looks) to evaluating the actual connection and your own emotional state.', ta: 'இது அவர்களின் பயோடேட்டாவை (வேலை, உயரம், தோற்றம்) மதிப்பிடுவதிலிருந்து உண்மையான பிணைப்பு மற்றும் உங்கள் சொந்த உணர்ச்சி நிலையை மதிப்பிடுவதற்கு உங்கள் கவனத்தை மாற்றுகிறது.' },
      example: { en: 'Asking: "Did I feel attractive?", "Did they make me laugh?", "Did I feel heard?"', ta: '"நான் கவர்ச்சியாக உணர்ந்தேனா?", "அவர்கள் என்னை சிரிக்க வைத்தார்களா?", "நான் சொல்வது கேட்கப்பட்டதா?" என்று கேட்பது.' },
      actionStep: { en: 'Write down the Post-Date Eight questions and answer them immediately after your next first date.', ta: 'சந்திப்பிற்குப் பிந்தைய எட்டு கேள்விகளை எழுதி, உங்களின் அடுத்த முதல் சந்திப்பிற்குப் பிறகு உடனடியாக அவற்றுக்குப் பதிலளிக்கவும்.' },
      reflectionQuestion: { en: 'Are you spending dates evaluating the other person, or paying attention to how you feel in their presence?', ta: 'நீங்கள் மற்ற நபரை மதிப்பிடுவதிலேயே நேரத்தைச் செலவிடுகிறீர்களா, அல்லது அவர்கள் முன்னிலையில் நீங்கள் எப்படி உணர்கிறீர்கள் என்பதில் கவனம் செலுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Design Your Dates', ta: 'உங்கள் சந்திப்புகளை வடிவமைக்கவும்' },
      explanation: { en: 'Coffee dates are terrible because they feel like job interviews. Design experiential dates where you can actually see the person in action.', ta: 'காபி டேட்டிங் மோசமானது, ஏனென்றால் அது வேலைக்கான நேர்காணல் போல் தோன்றும். நபரை செயலில் பார்க்கக்கூடிய அனுபவபூர்வமான சந்திப்புகளை வடிவமைக்கவும்.' },
      whyItMatters: { en: 'Sitting face-to-face across a table forces awkward small talk. Doing an activity side-by-side allows for natural conversation and reveals their true personality.', ta: 'மேசைக்கு குறுக்கே நேருக்கு நேர் உட்கார்ந்திருப்பது சங்கடமான சிறிய பேச்சைக் கட்டாயப்படுத்துகிறது. பக்கத்துப்பக்கமாக ஒரு செயலைச் செய்வது இயல்பான உரையாடலை அனுமதிக்கிறது மற்றும் அவர்களின் உண்மையான ஆளுமையை வெளிப்படுத்துகிறது.' },
      example: { en: 'Going to an arcade, visiting a flea market, or taking a cooking class instead of just getting drinks.', ta: 'வெறும் மது அருந்துவதற்குப் பதிலாக கேளிக்கை விடுதிக்குச் செல்வது, சந்தைக்குச் செல்வது அல்லது சமையல் வகுப்பு எடுப்பது.' },
      actionStep: { en: 'Ban coffee dates. Plan an interactive, side-by-side activity for your next date.', ta: 'காபி டேட்டிங்கைத் தடை செய்யுங்கள். உங்களின் அடுத்த சந்திப்பிற்கு ஒரு ஊடாடும், பக்கத்துப்பக்கச் செயலைத் திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'Do your current dates feel like fun adventures or high-pressure interviews?', ta: 'உங்கள் தற்போதைய சந்திப்புகள் வேடிக்கையான சாகசங்களைப் போல் உள்ளதா அல்லது அதிக அழுத்தமான நேர்காணல்களைப் போல் உள்ளதா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Overcome the Secretary Problem', ta: 'செயலாளர் பிரச்சனையை வெல்வது' },
      explanation: { en: 'A mathematical theory in dating: to find the best partner, date around for the first 37% of your dating window (exploring), then commit to the next person who is better than everyone you’ve met so far.', ta: 'டேட்டிங்கில் ஒரு கணிதக் கோட்பாடு: சிறந்த துணையைக் கண்டறிய, உங்களின் டேட்டிங் காலத்தின் முதல் 37% காலம் பலரைச் சந்தித்து (ஆராய்ந்து), பின்னர் இதுவரை நீங்கள் சந்தித்த அனைவரையும் விடச் சிறந்த அடுத்த நபருக்கு உறுதியளிக்கவும்.' },
      whyItMatters: { en: 'It prevents you from settling too early (without knowing what’s out there) and prevents you from searching forever (and missing out on great people).', ta: 'இது உங்களை முன்கூட்டியே செட்டில் ஆவதைத் தடுக்கிறது (வெளியில் என்ன இருக்கிறது என்று தெரியாமல்) மற்றும் என்றென்றும் தேடிக்கொண்டே இருப்பதையும் (மற்றும் சிறந்த மனிதர்களை இழப்பதையும்) தடுக்கிறது.' },
      example: { en: 'If you plan to date between ages 18 and 40, spend ages 18-26 discovering what you like, then lock in the next great match you find.', ta: 'நீங்கள் 18 முதல் 40 வயது வரை டேட்டிங் செய்யத் திட்டமிட்டால், 18-26 வயதிற்குள் உங்களுக்கு என்ன பிடிக்கும் என்பதைக் கண்டறிந்து, பின்னர் நீங்கள் காணும் அடுத்த சிறந்த துணையை முடிவு செய்யுங்கள்.' },
      actionStep: { en: 'Assess where you are in your "dating window." Are you still exploring, or is it time to start committing?', ta: 'உங்கள் "டேட்டிங் காலத்தில்" நீங்கள் எங்கே இருக்கிறீர்கள் என்பதை மதிப்பிடுங்கள். நீங்கள் இன்னும் ஆராய்கிறீர்களா, அல்லது உறுதியளிக்கத் தொடங்கும் நேரமா?' },
      reflectionQuestion: { en: 'Are you endlessly exploring because you are afraid of making a final choice?', ta: 'இறுதித் தேர்வை எடுக்கப் பயந்து நீங்கள் முடிவில்லாமல் ஆராய்ந்து கொண்டிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Decide, Don\'t Slide', ta: 'முடிவெடுங்கள், நழுவாதீர்கள்' },
      explanation: { en: 'Transitions in relationships (moving in together, getting a dog, getting married) should be conscious decisions, not just things that happen because it’s "the next logical step."', ta: 'உறவுகளில் மாற்றங்கள் (ஒன்றாகக் குடியேறுவது, நாய் வாங்குவது, திருமணம் செய்வது) நனவான முடிவுகளாக இருக்க வேண்டும், மாறாக அது "அடுத்த தர்க்கரீதியான படி" என்பதற்காக மட்டுமே நடக்கும் விஷயங்களாக இருக்கக்கூடாது.' },
      whyItMatters: { en: 'Sliding leads to people getting married simply because their lease was up and they already lived together, not because they are deeply compatible.', ta: 'நழுவிச் செல்வது என்பது அவர்கள் ஒருவருக்கொருவர் ஆழமாகப் பொருந்துகிறார்கள் என்பதற்காக அல்லாமல், அவர்களின் வாடகை ஒப்பந்தம் முடிந்து அவர்கள் ஏற்கனவே ஒன்றாக வாழ்ந்ததால் மட்டுமே திருமணம் செய்துகொள்வதற்கு வழிவகுக்கிறது.' },
      example: { en: 'Having a serious conversation about why you are moving in together, rather than doing it just to save money on rent.', ta: 'வாடகைப் பணத்தை மிச்சப்படுத்த வேண்டும் என்பதற்காக மட்டுமே அவ்வாறு செய்வதற்குப் பதிலாக, நீங்கள் ஏன் ஒன்றாகக் குடியேறுகிறீர்கள் என்பது பற்றி தீவிரமாகப் பேசுவது.' },
      actionStep: { en: 'Before taking the next step in any relationship, explicitly state your intentions and ensure your partner’s align.', ta: 'எந்தவொரு உறவிலும் அடுத்த படியை எடுப்பதற்கு முன், உங்கள் நோக்கங்களை வெளிப்படையாகக் கூறி, உங்கள் துணையின் நோக்கங்களும் பொருந்துகிறதா என்பதை உறுதிப்படுத்திக் கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Have you ever stayed in a relationship longer than you should have just because it was convenient?', ta: 'அது வசதியாக இருந்தது என்பதற்காக மட்டுமே நீங்கள் எப்போதாவது ஒரு உறவில் இருக்க வேண்டியதை விட அதிக காலம் இருந்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The Sunk Cost Fallacy', ta: 'செலவிட்டதற்கான வருத்தம் என்ற மாயை' },
      explanation: { en: 'Continuing an unhappy relationship just because you have already invested a lot of time, money, or effort into it.', ta: 'நீங்கள் ஏற்கனவே நிறைய நேரம், பணம் அல்லது முயற்சியை முதலீடு செய்துள்ளீர்கள் என்பதற்காக மட்டுமே மகிழ்ச்சியற்ற உறவைத் தொடர்வது.' },
      whyItMatters: { en: 'Time already spent is gone. Don\'t waste your future just because you wasted your past.', ta: 'ஏற்கனவே செலவழித்த நேரம் போய்விட்டது. உங்கள் கடந்த காலத்தை வீணடித்துவிட்டீர்கள் என்பதற்காக உங்கள் எதிர்காலத்தை வீணாக்காதீர்கள்.' },
      example: { en: 'Staying engaged to someone you don\'t love because you’ve been together for 5 years and the wedding is already paid for.', ta: 'நீங்கள் 5 வருடங்களாக ஒன்றாக இருந்தீர்கள், திருமணத்திற்கு ஏற்கனவே பணம் செலுத்தப்பட்டுவிட்டது என்பதற்காக நீங்கள் நேசிக்காத ஒருவருடன் நிச்சயதார்த்தத்தில் இருப்பது.' },
      actionStep: { en: 'Ask yourself: "If I met this person today, knowing what I know now, would I choose to start a relationship with them?" If no, leave.', ta: 'உங்களைக் கேட்டுக்கொள்ளுங்கள்: "இப்போது எனக்குத் தெரிந்த விஷயங்களுடன் இன்று இந்த நபரை நான் சந்தித்தால், அவர்களுடன் உறவைத் தொடங்கத் தேர்ந்தெடுப்பேனா?" இல்லை என்றால், விலகிவிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you holding onto someone out of love, or out of fear of starting over?', ta: 'காதலால் ஒருவரைப் பிடித்துக் கொண்டிருக்கிறீர்களா, அல்லது புதிதாகத் தொடங்க வேண்டும் என்ற பயத்திலா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Ditch the "Type"', ta: '"வகை"யை கைவிடுங்கள்' },
      explanation: { en: 'Having a strict "type" (e.g., tall, dark-haired, creative) severely limits your dating pool and prevents you from meeting highly compatible people who don\'t fit the mold.', ta: 'ஒரு கடுமையான "வகையை" (எ.கா., உயரமான, கருமையான முடி, ஆக்கபூர்வமான) வைத்திருப்பது உங்கள் டேட்டிங் வட்டத்தைக் கடுமையாகக் கட்டுப்படுத்துகிறது மற்றும் அச்சுக்கு பொருந்தாத மிகவும் இணக்கமான நபர்களைச் சந்திப்பதைத் தடுக்கிறது.' },
      whyItMatters: { en: 'Your "type" hasn\'t worked out for you so far. Why keep repeating the same failed experiment?', ta: 'உங்கள் "வகை" இதுவரை உங்களுக்கு வேலை செய்யவில்லை. அதே தோல்வியுற்ற பரிசோதனையை ஏன் மீண்டும் மீண்டும் செய்ய வேண்டும்?' },
      example: { en: 'Swiping left on a wonderful, kind person just because they are 1 inch shorter than your arbitrary height requirement.', ta: 'உங்கள் தன்னிச்சையான உயரத் தேவையைக் காட்டிலும் 1 அங்குலம் குறைவாக இருப்பதற்காக மட்டுமே ஒரு அற்புதமான, அன்பான நபரை நிராகரிப்பது.' },
      actionStep: { en: 'Go on a date with someone you normally wouldn\'t look twice at, just to challenge your assumptions.', ta: 'உங்கள் அனுமானங்களுக்கு சவால் விடுவதற்காக மட்டுமே, நீங்கள் வழக்கமாகத் திரும்பிப் பார்க்காத ஒருவருடன் டேட்டிங் செல்லுங்கள்.' },
      reflectionQuestion: { en: 'Is your "type" actually a pattern of toxic traits you keep falling for?', ta: 'உங்கள் "வகை" உண்மையில் நீங்கள் தொடர்ந்து விழும் நச்சுப் பண்புகளின் ஒரு வடிவமா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Stop Playing Games', ta: 'விளையாட்டு காட்டுவதை நிறுத்துங்கள்' },
      explanation: { en: 'Waiting three days to text back, acting aloof, and pretending not to care are childish games that repel Secure partners.', ta: 'பதிலளிக்க மூன்று நாட்கள் காத்திருப்பது, ஒதுங்கி இருப்பது போல் செயல்படுவது, அக்கறை இல்லாதது போல் நடிப்பது ஆகியவை பாதுகாப்பான துணையை விரட்டும் குழந்தைத்தனமான விளையாட்டுகள்.' },
      whyItMatters: { en: 'Games only attract Anxious and Avoidant people who thrive on drama. Secure people prefer clear communication and will walk away from games.', ta: 'நாடகங்களை விரும்பும் கவலை மற்றும் தவிர்க்கும் நபர்களை மட்டுமே விளையாட்டுகள் ஈர்க்கின்றன. பாதுகாப்பான மனிதர்கள் தெளிவான தகவல்தொடர்புகளை விரும்புகிறார்கள் மற்றும் விளையாட்டுகளிலிருந்து விலகிச் செல்வார்கள்.' },
      example: { en: 'Texting back immediately because you like them, rather than waiting 4 hours to appear "busy."', ta: '"பிஸியாக" இருப்பதாகக் காட்டிக் கொள்ள 4 மணிநேரம் காத்திருப்பதற்குப் பதிலாக, உங்களுக்கு அவர்களைப் பிடித்திருப்பதால் உடனடியாகப் பதிலளிப்பது.' },
      actionStep: { en: 'Be radically transparent. If you like someone, tell them. If you want to see them again, ask them.', ta: 'தீவிரமாக வெளிப்படையாக இருங்கள். ஒருவரைப் பிடித்திருந்தால், அவர்களிடம் சொல்லுங்கள். மீண்டும் அவர்களைப் பார்க்க விரும்பினால், அவர்களிடம் கேளுங்கள்.' },
      reflectionQuestion: { en: 'Are you hiding your true feelings to protect your ego?', ta: 'உங்கள் ஈகோவைப் பாதுகாக்க உங்கள் உண்மையான உணர்வுகளை மறைக்கிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Shift from Evaluator to Experiencer', ta: 'மதிப்பீட்டாளரிலிருந்து அனுபவிப்பவராக மாறுங்கள்' },
      explanation: { en: 'Don\'t go into a date with a checklist, interrogating the person to see if they fit your criteria. Go in to experience their company.', ta: 'அவர்கள் உங்கள் அளவுகோல்களுக்குப் பொருந்துகிறார்களா என்பதைப் பார்க்க அந்த நபரை விசாரித்து, ஒரு சரிபார்ப்புப் பட்டியலுடன் டேட்டிங் செல்ல வேண்டாம். அவர்களின் சகவாசத்தை அனுபவிக்கச் செல்லுங்கள்.' },
      whyItMatters: { en: 'When you are evaluating, you are entirely in your head. When you are experiencing, you are in the present moment, which allows connection to form.', ta: 'நீங்கள் மதிப்பிடும்போது, நீங்கள் முற்றிலும் உங்கள் சிந்தனையில் இருக்கிறீர்கள். நீங்கள் அனுபவிக்கும் போது, நீங்கள் நிகழ்காலத்தில் இருக்கிறீர்கள், இது பிணைப்பை உருவாக்க அனுமதிக்கிறது.' },
      example: { en: 'Instead of asking "What are your 5-year career goals?", ask "What’s something you are really excited about lately?"', ta: '"உங்களின் 5 வருட தொழில் இலக்குகள் என்ன?" என்று கேட்பதற்குப் பதிலாக, "சமீபகாலமாக உங்களை மிகவும் உற்சாகப்படுத்தியது என்ன?" என்று கேளுங்கள்.' },
      actionStep: { en: 'Leave the checklist at home. Focus on being curious and playful on your next date.', ta: 'சரிபார்ப்புப் பட்டியலை வீட்டில் வைத்துவிடுங்கள். உங்களின் அடுத்த சந்திப்பில் ஆர்வமாகவும் விளையாட்டுத்தனமாகவும் இருப்பதில் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Do you treat dates more like job interviews than social interactions?', ta: 'டேட்டிங்கை சமூக தொடர்புகளை விட வேலை நேர்காணல்களைப் போலக் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'How to Break Up Gracefully', ta: 'கண்ணியமாக பிரிவது எப்படி' },
      explanation: { en: 'Ghosting is cruel and cowardly. If you’ve gone on more than two dates, you owe the person a clear, compassionate text or conversation to end it.', ta: 'சொல்லாமல் கொள்ளாமல் காணாமல் போவது கொடூரமானது மற்றும் கோழைத்தனமானது. நீங்கள் இரண்டு முறைக்கு மேல் சந்தித்திருந்தால், அதை முடிவுக்குக் கொண்டுவர அந்த நபருக்கு தெளிவான, இரக்கமுள்ள குறுஞ்செய்தி அல்லது உரையாடலைக் கொடுக்க கடமைப்பட்டுள்ளீர்கள்.' },
      whyItMatters: { en: 'Leaving someone hanging causes immense anxiety. Being honest, even if it hurts, provides closure and shows character.', ta: 'யாரையாவது தவிக்க விடுவது அதீத கவலையை ஏற்படுத்துகிறது. நேர்மையாக இருப்பது, அது காயப்படுத்தினாலும், ஒரு முடிவை வழங்குகிறது மற்றும் நல்ல குணத்தைக் காட்டுகிறது.' },
      example: { en: 'Texting: "I’ve enjoyed getting to know you, but I don’t feel a romantic connection. I wish you the best," instead of just ignoring their texts.', ta: 'அவர்களின் மெசேஜ்களைப் புறக்கணிப்பதற்குப் பதிலாக, "உங்களை அறிந்துகொண்டது மகிழ்ச்சியாக இருந்தது, ஆனால் நான் ஒரு காதல் பிணைப்பை உணரவில்லை. உங்களுக்கு நல்வாழ்த்துக்கள்" என்று மெசேஜ் அனுப்புவது.' },
      actionStep: { en: 'Send a clear, kind rejection message to anyone you are currently fading out on or keeping on the back burner.', ta: 'நீங்கள் தற்போது விலகிக் கொண்டிருக்கும் அல்லது காத்திருப்பில் வைத்திருக்கும் எவருக்கும் தெளிவான, அன்பான நிராகரிப்பு செய்தியை அனுப்பவும்.' },
      reflectionQuestion: { en: 'Would you rather receive a polite rejection, or be ghosted?', ta: 'நீங்கள் ஒரு கண்ணியமான நிராகரிப்பைப் பெற விரும்புவீர்களா, அல்லது காரணமே சொல்லாமல் நிராகரிக்கப்படுவதை விரும்புவீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Build a Relationship Agreement', ta: 'ஒரு உறவு ஒப்பந்தத்தை உருவாக்குங்கள்' },
      explanation: { en: 'Couples should explicitly discuss and agree upon their expectations regarding finances, chores, sex, and family boundaries.', ta: 'தம்பதிகள் நிதி, வீட்டு வேலைகள், தாம்பத்தியம் மற்றும் குடும்ப எல்லைகள் தொடர்பான தங்கள் எதிர்பார்ப்புகளை வெளிப்படையாக விவாதித்து ஒப்புக்கொள்ள வேண்டும்.' },
      whyItMatters: { en: 'Unspoken expectations are premeditated resentments. Assuming your partner knows what you want leads to conflict.', ta: 'பேசப்படாத எதிர்பார்ப்புகள் திட்டமிடப்பட்ட அதிருப்திகளாகும். உங்களுக்கு என்ன வேண்டும் என்று உங்கள் துணைக்குத் தெரியும் என்று கருதுவது மோதலுக்கு வழிவகுக்கும்.' },
      example: { en: 'Sitting down and agreeing that Partner A cooks and Partner B does the dishes, rather than silently fuming when the dishes pile up.', ta: 'பாத்திரங்கள் குவியும்போது அமைதியாகக் கோபப்படுவதற்குப் பதிலாக, உட்கார்ந்து துணை A சமைக்க வேண்டும் மற்றும் துணை B பாத்திரங்களைக் கழுவ வேண்டும் என்று ஒப்புக்கொள்வது.' },
      actionStep: { en: 'If in a relationship, schedule a "State of the Union" meeting this week to calmly discuss one area of friction.', ta: 'ஒரு உறவில் இருந்தால், முரண்பாடுள்ள ஒரு பகுதியை அமைதியாக விவாதிக்க இந்த வாரம் "உறவின் நிலை" கூட்டத்தைத் திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'What expectation do you currently have of your partner that you have never clearly communicated?', ta: 'நீங்கள் இதுவரை தெளிவாகத் தெரிவிக்காத என்ன எதிர்பார்ப்பு உங்கள் துணையிடம் உங்களுக்கு உள்ளது?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Anticipate the Dip', ta: 'சரிவை எதிர்பாருங்கள்' },
      explanation: { en: 'Every relationship goes through a "dip" after the honeymoon phase ends. The excitement fades, and reality sets in.', ta: 'தேன்நிலவு கட்டம் முடிந்த பிறகு ஒவ்வொரு உறவும் ஒரு "சரிவை" சந்திக்கிறது. உற்சாகம் மங்கி, யதார்த்தம் தொடங்குகிறது.' },
      whyItMatters: { en: 'Many people mistake the dip for the end of the relationship. It is actually normal; it’s the transition from passionate love to deeper companionate love.', ta: 'பலர் இந்தச் சரிவை உறவின் முடிவு என்று தவறாக நினைக்கிறார்கள். இது உண்மையில் சாதாரணமானது; இது உணர்ச்சிபூர்வமான காதலிலிருந்து ஆழமான தோழமையான காதலுக்கான மாற்றமாகும்.' },
      example: { en: 'Feeling bored on a Friday night with your partner and realizing it means you are comfortable and stable, not that the relationship is dead.', ta: 'வெள்ளிக்கிழமை இரவு உங்கள் துணையுடன் சலிப்பாக உணர்வதும், உறவு இறந்துவிட்டது என்பதல்லாமல், நீங்கள் வசதியாகவும் நிலையாகவும் இருக்கிறீர்கள் என்று உணர்வது.' },
      actionStep: { en: 'Understand that excitement is temporary. Commit to doing one novel activity this weekend to inject some intentional fun back into the relationship.', ta: 'உற்சாகம் தற்காலிகமானது என்பதைப் புரிந்து கொள்ளுங்கள். உறவில் சில வேண்டுமென்றே வேடிக்கைகளை புகுத்துவதற்கு இந்த வார இறுதியில் ஒரு புதிய செயலைச் செய்ய உறுதியளிக்கவும்.' },
      reflectionQuestion: { en: 'Do you run away the moment a relationship requires effort?', ta: 'ஒரு உறவுக்கு முயற்சி தேவைப்படும் கணத்தில் நீங்கள் ஓடிவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'Pre-Engagement Counseling', ta: 'நிச்சயதார்த்தத்திற்கு முந்தைய ஆலோசனை' },
      explanation: { en: 'Go to couples counseling before you get engaged, while things are good, to uncover potential blind spots and align on major life goals.', ta: 'நீங்கள் நிச்சயதார்த்தம் செய்வதற்கு முன்பு, காரியங்கள் நன்றாக இருக்கும்போதே, சாத்தியமான குருட்டுப் புள்ளிகளைக் கண்டறியவும், முக்கிய வாழ்க்கை இலக்குகளில் ஒத்துப்போகவும் தம்பதிகள் ஆலோசனைக்குச் செல்லுங்கள்.' },
      whyItMatters: { en: 'Therapy shouldn\'t just be a last resort when the relationship is failing. It should be a tool to build a strong foundation.', ta: 'உறவு தோல்வியடையும் போது சிகிச்சை ஒரு கடைசி முயற்சியாக இருக்கக்கூடாது. இது ஒரு வலுவான அடித்தளத்தை உருவாக்குவதற்கான கருவியாக இருக்க வேண்டும்.' },
      example: { en: 'Discussing whether you both want children, and how you will raise them, with a neutral third party before buying a ring.', ta: 'மோதிரம் வாங்குவதற்கு முன், நடுநிலையான மூன்றாம் நபருடன் உங்கள் இருவருக்கும் குழந்தைகள் வேண்டுமா, அவர்களை எப்படி வளர்ப்பீர்கள் என்பது பற்றி விவாதிப்பது.' },
      actionStep: { en: 'Have the "Hard Conversation" (kids, religion, money, location) before you officially commit to forever.', ta: 'என்றென்றைக்கும் அதிகாரப்பூர்வமாக உறுதியளிக்கும் முன் "கடினமான உரையாடலை" (குழந்தைகள், மதம், பணம், இருப்பிடம்) மேற்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Are you ignoring major incompatibilities just because you are in love?', ta: 'காதலில் இருக்கிறீர்கள் என்பதற்காக மட்டுமே முக்கிய பொருந்தின்மைகளை நீங்கள் புறக்கணிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Intentional Love', ta: 'நோக்கத்துடன் கூடிய காதல்' },
      explanation: { en: 'Happily ever after doesn\'t just happen. It is a daily choice. You have to actively choose your partner and work on the relationship every single day.', ta: 'என்றென்றும் மகிழ்ச்சியாக இருப்பது தானாக நடந்துவிடாது. அது ஒரு தினசரித் தேர்வு. ஒவ்வொரு நாளும் உங்கள் துணையை நீங்கள் தீவிரமாகத் தேர்ந்தெடுத்து உறவுக்காக உழைக்க வேண்டும்.' },
      whyItMatters: { en: 'Love is an action, not just a feeling. Relying solely on feelings will fail, because feelings fluctuate.', ta: 'காதல் என்பது ஒரு செயல், வெறும் உணர்வு மட்டுமல்ல. உணர்வுகளை மட்டுமே நம்பியிருப்பது தோல்வியடையும், ஏனெனில் உணர்வுகள் ஏற்ற இறக்கமானவை.' },
      example: { en: 'Choosing to make them coffee in the morning even after you had a frustrating argument the night before.', ta: 'முந்தைய நாள் இரவு ஏமாற்றமளிக்கும் வாக்குவாதம் நடந்த பிறகும், காலையில் அவர்களுக்குக் காபி போடத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Do one small, intentional act of kindness for your partner today without expecting anything in return.', ta: 'பதிலுக்கு எதையும் எதிர்பார்க்காமல், இன்று உங்கள் துணைக்கு ஒரு சிறிய, நோக்கத்துடன் கூடிய அன்பான செயலைச் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you passively waiting for a great relationship, or are you actively building one?', ta: 'நீங்கள் ஒரு சிறந்த உறவுக்காகக் செயலற்று காத்திருக்கிறீர்களா, அல்லது சுறுசுறுப்பாக ஒன்றை உருவாக்குகிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'How to Not Die Alone' });
    if (existing) {
      console.log('How to Not Die Alone already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'How to Not Die Alone' });
    }
    
    await WisdomBook.create(howNotToDieAloneBook);
    console.log('How to Not Die Alone added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
