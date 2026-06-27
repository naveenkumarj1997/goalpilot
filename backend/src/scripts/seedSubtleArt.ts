import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const subtleArtBook = {
  title: 'The Subtle Art of Not Giving a F*ck',
  author: 'Mark Manson',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg',
  categories: ['Self-Help', 'Philosophy', 'Psychology'],
  themes: [
    { en: 'Values', ta: 'மதிப்புகள்' },
    { en: 'Acceptance', ta: 'ஏற்றுக்கொள்ளுதல்' }
  ],
  overview: {
    en: 'Mark Manson argues that life\'s struggles give it meaning, and that the mindless positivity of typical self-help books is neither practical nor helpful. It\'s a guide to figuring out what truly matters to you and letting go of everything else.',
    ta: 'வாழ்க்கையின் போராட்டங்களே அதற்கு அர்த்தத்தைத் தருகின்றன என்றும், வழக்கமான சுய முன்னேற்றப் புத்தகங்களின் அர்த்தமற்ற நேர்மறைத் தன்மை நடைமுறைக்கு உகந்ததோ அல்லது பயனுள்ளதோ அல்ல என்றும் மார்க் மான்சன் வாதிடுகிறார். உங்களுக்கு உண்மையிலேயே முக்கியமானது எது என்பதைக் கண்டுபிடித்து, மற்ற அனைத்தையும் விட்டுவிடுவதற்கான வழிகாட்டி இது.'
  },
  topQuotes: [
    { en: 'Who you are is defined by what you’re willing to struggle for.', ta: 'எதற்காகப் போராட நீங்கள் தயாராக இருக்கிறீர்கள் என்பதாலேயே நீங்கள் யார் என்பது வரையறுக்கப்படுகிறது.' },
    { en: 'The desire for more positive experience is itself a negative experience. And, paradoxically, the acceptance of one’s negative experience is itself a positive experience.', ta: 'அதிக நேர்மறையான அனுபவத்திற்கான ஆசையே ஒரு எதிர்மறையான அனுபவமாகும். மேலும் முரண்பாடாக, ஒருவரின் எதிர்மறை அனுபவத்தை ஏற்றுக்கொள்வதே ஒரு நேர்மறையான அனுபவமாகும்.' },
    { en: 'To not give a fuck is to stare down life’s most terrifying and difficult challenges and still take action.', ta: 'எதைப் பற்றியும் கவலைப்படாமல் இருப்பது என்பது வாழ்க்கையின் மிகவும் பயங்கரமான மற்றும் கடினமான சவால்களை முறைத்துப் பார்த்துவிட்டும் தொடர்ந்து செயல்படுவதாகும்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Feedback Loop from Hell', ta: 'நரகத்திலிருந்து வரும் பின்னூட்டச் சுழல்' },
      explanation: { en: 'Our culture today is obsessively focused on unrealistically positive expectations: Be happier, be healthier, be the best. When you feel bad about feeling bad, you enter a infinite loop of misery.', ta: 'நமது இன்றைய கலாச்சாரம் நம்பத்தகாத நேர்மறையான எதிர்பார்ப்புகளில் வெறித்தனமாகக் கவனம் செலுத்துகிறது: மகிழ்ச்சியாக இருங்கள், ஆரோக்கியமாக இருங்கள், சிறந்தவராக இருங்கள். மோசமாக உணர்வதைப் பற்றி நீங்கள் மோசமாக உணரும்போது, நீங்கள் துயரத்தின் முடிவற்ற சுழலுக்குள் நுழைகிறீர்கள்.' },
      whyItMatters: { en: 'Accepting that negative experiences are normal and inevitable stops the feedback loop. By not giving a f*ck about feeling bad, you short-circuit the loop and actually feel better.', ta: 'எதிர்மறையான அனுபவங்கள் சாதாரணமானவை மற்றும் தவிர்க்க முடியாதவை என்பதை ஏற்றுக்கொள்வது பின்னூட்டச் சுழலை நிறுத்துகிறது. மோசமாக உணர்வதைப் பற்றிக் கவலைப்படாமல் இருப்பதன் மூலம், நீங்கள் அந்தச் சுழலைச் சுருக்கி, உண்மையில் நன்றாக உணர்கிறீர்கள்.' },
      example: { en: 'Getting anxious about a presentation, then getting anxious *because* you are anxious. The solution is to just say, "I\'m anxious, and that\'s okay. Who cares?"', ta: 'ஒரு விளக்கக்காட்சியைப் பற்றிக் கவலைப்படுவது, பின்னர் நீங்கள் கவலையாக இருக்கிறீர்கள் *என்பதாலேயே* கவலைப்படுவது. "நான் கவலையாக இருக்கிறேன், அது பரவாயில்லை. யாருக்குக் கவலை?" என்று சொல்வதே இதற்கான தீர்வாகும்.' },
      actionStep: { en: 'Next time you feel a negative emotion (anger, sadness, anxiety), do not judge yourself for having it. Acknowledge it, accept it as a normal human experience, and move on.', ta: 'அடுத்த முறை நீங்கள் ஒரு எதிர்மறை உணர்ச்சியை (கோபம், சோகம், பதற்றம்) உணரும்போது, அதைக் கொண்டிருப்பதற்காக உங்களை நீங்களே மதிப்பிடாதீர்கள். அதை ஒப்புக்கொள்ளுங்கள், அதை ஒரு சாதாரண மனித அனுபவமாக ஏற்றுக்கொண்டு முன்னேறுங்கள்.' },
      reflectionQuestion: { en: 'Do you constantly beat yourself up for not being happy 100% of the time, as if sadness is a disease?', ta: 'சோகம் என்பது ஒரு நோயைப் போல, 100% நேரமும் மகிழ்ச்சியாக இல்லை என்பதற்காக உங்களை நீங்களே தொடர்ந்து தண்டித்துக்கொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The Backward Law', ta: 'பின்தங்கிய விதி (The Backward Law)' },
      explanation: { en: 'Coined by Alan Watts, the Backward Law states that pursuing something only reinforces the fact that you lack it in the first place. The more you pursue feeling better, the less satisfied you become.', ta: 'ஆலன் வாட்ஸ் உருவாக்கிய பின்தங்கிய விதியானது (Backward Law), ஒன்றைப் பின்தொடர்வது முதலிலேயே அது உங்களிடம் இல்லை என்ற உண்மையை மட்டுமே வலுப்படுத்துகிறது என்று கூறுகிறது. நீங்கள் நன்றாக உணர்வதை எவ்வளவு அதிகமாகத் தொடர்கிறீர்களோ, அவ்வளவு குறைவாகவே திருப்தி அடைகிறீர்கள்.' },
      whyItMatters: { en: 'Constantly chasing wealth makes you feel poor. Constantly chasing love makes you feel lonely. True wealth, love, and happiness come as byproducts of focusing on things greater than yourself.', ta: 'தொடர்ந்து செல்வத்தைத் துரத்துவது உங்களை ஏழையாக உணர வைக்கிறது. காதலைத் தொடர்ந்து துரத்துவது உங்களைத் தனிமையாக உணர வைக்கிறது. உண்மையான செல்வம், காதல் மற்றும் மகிழ்ச்சி ஆகியவை உங்களை விடப் பெரிய விஷயங்களில் கவனம் செலுத்துவதன் துணை தயாரிப்புகளாகவே வருகின்றன.' },
      example: { en: 'A person desperately trying to be confident at a party comes across as needy and awkward. A person who accepts their awkwardness instantly becomes more relaxed and confident.', ta: 'ஒரு பார்ட்டியில் நம்பிக்கையுடன் இருக்கத் தீவிரமாக முயற்சிக்கும் ஒரு நபர் தேவையுள்ளவராகவும் (needy) விகாரமாகவும் (awkward) காணப்படுகிறார். தங்களின் விகாரமான தன்மையை ஏற்றுக்கொள்ளும் நபர் உடனடியாக மிகவும் நிதானமாகவும் நம்பிக்கையுடனும் மாறுகிறார்.' },
      actionStep: { en: 'Identify one thing you are desperately chasing (money, approval, perfect health). Stop chasing it for one week. Focus entirely on the process of your daily work instead.', ta: 'நீங்கள் தீவிரமாகத் துரத்தும் ஒரு விஷயத்தைக் (பணம், ஒப்புதல், சரியான ஆரோக்கியம்) கண்டறியவும். ஒரு வாரத்திற்கு அதைத் துரத்துவதை நிறுத்துங்கள். அதற்குப் பதிலாக உங்கள் அன்றாட வேலையின் செயல்முறையில் முழுமையாகக் கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Is your intense desire for a better life the very thing that is making your current life feel so miserable?', ta: 'ஒரு சிறந்த வாழ்க்கைக்கான உங்களின் தீவிர ஆசைதான் உங்களின் தற்போதைய வாழ்க்கையை மிகவும் பரிதாபமாக உணர வைக்கிறதா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Not Giving a F*ck Doesn\'t Mean Being Indifferent', ta: 'கவலைப்படாமல் இருப்பது என்பது அலட்சியமாக இருப்பதை அர்த்தப்படுத்தாது' },
      explanation: { en: 'It means being comfortable with being different and caring about something more important than adversity. You have to give a f*ck about *something*. The key is choosing *what* to care about.', ta: 'இது வித்தியாசமாக வசதியாக இருப்பதையும், துன்பங்களை விட முக்கியமான ஒன்றைப் பற்றிக் கவலைப்படுவதையும் குறிக்கிறது. நீங்கள் *ஏதோ ஒன்றைப்* பற்றிக் கவலைப்பட வேண்டும். எதைப் பற்றிக் கவலைப்பட வேண்டும் என்பதைத் தேர்ந்தெடுப்பதே திறவுகோலாகும்.' },
      whyItMatters: { en: 'Indifference is the trait of a psychopath or an internet troll. True maturity is realizing you have a limited amount of f*cks to give, and reserving them only for what truly matters (family, purpose, values).', ta: 'அலட்சியம் என்பது ஒரு மனநோயாளி அல்லது இணைய ட்ராலின் (Troll) பண்பாகும். உண்மையான முதிர்ச்சி என்பது, உங்களிடம் கவலைப்படுவதற்கு ஒரு குறிப்பிட்ட அளவே உள்ளது என்பதை உணர்ந்து, உண்மையிலேயே முக்கியமானவற்றிற்கு (குடும்பம், நோக்கம், மதிப்புகள்) மட்டும் அவற்றை ஒதுக்குவதாகும்.' },
      example: { en: 'Not caring that your shirt has a stain on it because you are rushing to the hospital to be with a sick loved one. You care about the loved one, not the shirt.', ta: 'உடல்நிலை சரியில்லாத உங்களின் அன்புக்குரியவருடன் இருக்க நீங்கள் மருத்துவமனைக்கு விரைந்து கொண்டிருப்பதால், உங்கள் சட்டையில் ஒரு கறை இருப்பதைப் பற்றிக் கவலைப்படாமல் இருப்பது. நீங்கள் அன்புக்குரியவரைப் பற்றிக் கவலைப்படுகிறீர்கள், சட்டையைப் பற்றி அல்ல.' },
      actionStep: { en: 'List three trivial things that annoyed you yesterday (traffic, a rude comment, long lines). Consciously decide to revoke your "f*cks" from those things moving forward.', ta: 'நேற்று உங்களை எரிச்சலூட்டிய மூன்று அற்பமான விஷயங்களைப் பட்டியலிடுங்கள் (போக்குவரத்து, முரட்டுத்தனமான கருத்து, நீண்ட வரிசைகள்). இனிமேல் அந்த விஷயங்களிலிருந்து உங்கள் "கவலைகளை"த் திரும்பப் பெறப் பிரக்ஞையுடன் முடிவு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you spending your limited emotional energy on trivial nonsense because you don\'t have a meaningful purpose to care about?', ta: 'கவலைப்படுவதற்கு அர்த்தமுள்ள நோக்கம் இல்லாததால், உங்களின் வரையறுக்கப்பட்ட உணர்ச்சிகரமான ஆற்றலை அற்பமான முட்டாள்தனங்களில் செலவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'Happiness Comes from Solving Problems', ta: 'பிரச்சினைகளைத் தீர்ப்பதில் இருந்தே மகிழ்ச்சி வருகிறது' },
      explanation: { en: 'Problems never stop; they merely get exchanged or upgraded. Happiness is not the absence of problems, but the process of solving them.', ta: 'பிரச்சினைகள் ஒருபோதும் நிற்பதில்லை; அவை வெறுமனே மாற்றப்படுகின்றன அல்லது தரம் உயர்த்தப்படுகின்றன. மகிழ்ச்சி என்பது பிரச்சினைகள் இல்லாத நிலை அல்ல, மாறாக அவற்றைத் தீர்க்கும் செயல்முறையாகும்.' },
      whyItMatters: { en: 'If you think a perfect, problem-free life exists, you will always be disappointed. When you accept that life is essentially an endless series of problems, you can focus on choosing better problems.', ta: 'சரியான, பிரச்சினைகள் இல்லாத வாழ்க்கை இருக்கிறது என்று நீங்கள் நினைத்தால், நீங்கள் எப்போதும் ஏமாற்றமடைவீர்கள். வாழ்க்கை என்பது முடிவற்ற பிரச்சினைகளின் தொடர் என்பதை நீங்கள் ஏற்றுக்கொள்ளும்போது, சிறந்த பிரச்சினைகளைத் தேர்ந்தெடுப்பதில் உங்களால் கவனம் செலுத்த முடியும்.' },
      example: { en: 'Warren Buffett has money problems; a homeless person has money problems. Buffett\'s problems are just better. The goal is to upgrade your problems, not eliminate them.', ta: 'வாரன் பபெட்டிற்குப் பணப் பிரச்சினைகள் உள்ளன; வீடற்ற ஒருவருக்கும் பணப் பிரச்சினைகள் உள்ளன. பபெட்டின் பிரச்சினைகள் கொஞ்சம் சிறந்தவை. உங்களின் பிரச்சினைகளை மேம்படுத்துவதே குறிக்கோளாகும், அவற்றை ஒழிப்பதல்ல.' },
      actionStep: { en: 'Stop asking "How can I have a life with no problems?" Start asking, "What kind of problems do I enjoy solving?" and pursue the path that brings you those problems.', ta: '"பிரச்சினைகளே இல்லாத வாழ்க்கையை நான் எப்படிப் பெறுவது?" என்று கேட்பதை நிறுத்துங்கள். "எந்த மாதிரியான பிரச்சினைகளைத் தீர்க்க நான் விரும்புகிறேன்?" என்று கேட்கத் தொடங்குங்கள், மேலும் அந்தப் பிரச்சினைகளைக் கொண்டு வரும் பாதையைப் பின்தொடருங்கள்.' },
      reflectionQuestion: { en: 'Are you waiting for the day when all your problems disappear so you can finally be happy?', ta: 'உங்கள் பிரச்சினைகள் அனைத்தும் மறைந்து நீங்கள் இறுதியாக மகிழ்ச்சியாக இருக்கும் நாளுக்காகக் காத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'Choose Your Struggle', ta: 'உங்களின் போராட்டத்தைத் தேர்ந்தெடுங்கள்' },
      explanation: { en: 'Everything involves sacrifice. What determines your success isn\'t "What do you want to enjoy?" but "What pain do you want to sustain?"', ta: 'அனைத்தும் தியாகத்தை உள்ளடக்கியது. உங்கள் வெற்றியைத் தீர்மானிப்பது "நீங்கள் எதை அனுபவிக்க விரும்புகிறீர்கள்?" என்பதல்ல, "எந்த வலியை நீங்கள் தாங்கிக்கொள்ள விரும்புகிறீர்கள்?" என்பதே ஆகும்.' },
      whyItMatters: { en: 'Everyone wants a great physique, but not everyone wants to suffer through hours at the gym and eat bland food. If you want the reward without the struggle, you will get neither.', ta: 'எல்லோரும் ஒரு சிறந்த உடலமைப்பை விரும்புகிறார்கள், ஆனால் எல்லோரும் உடற்பயிற்சிக் கூடத்தில் பல மணிநேரம் கஷ்டப்படவும் சுவையற்ற உணவை உண்ணவும் விரும்புவதில்லை. போராட்டம் இல்லாமல் வெகுமதியை நீங்கள் விரும்பினால், உங்களுக்கு இரண்டும் கிடைக்காது.' },
      example: { en: 'Wanting to be a famous musician but refusing to practice for 10 hours a day and play in empty bars for years. You love the victory, but you don\'t love the fight.', ta: 'ஒரு பிரபலமான இசைக்கலைஞராக விரும்புகிறார், ஆனால் ஒரு நாளைக்கு 10 மணிநேரம் பயிற்சி செய்யவும் பல ஆண்டுகளாகக் காலியான பார்களில் (Bars) வாசிக்கவும் மறுக்கிறார். நீங்கள் வெற்றியை விரும்புகிறீர்கள், ஆனால் போராட்டத்தை நீங்கள் விரும்பவில்லை.' },
      actionStep: { en: 'Look at your biggest goal. Write down the ugliest, most boring, most painful aspects of achieving it. Commit to loving that painful process, or drop the goal entirely.', ta: 'உங்களின் மிகப்பெரிய இலக்கைப் பாருங்கள். அதை அடைவதில் உள்ள மிக மோசமான, மிகவும் சலிப்பான, மிகவும் வேதனையான அம்சங்களை எழுதுங்கள். அந்த வேதனையான செயல்முறையை நேசிக்க உறுதியளியுங்கள், அல்லது இலக்கை முற்றிலுமாகக் கைவிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you in love with the fantasy of the result, while completely despising the reality of the process?', ta: 'செயல்முறையின் யதார்த்தத்தை முற்றிலுமாக வெறுத்துக்கொண்டு, முடிவின் கற்பனையைக் காதலிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'You Are Not Special', ta: 'நீங்கள் சிறப்பானவர் அல்ல' },
      explanation: { en: 'The belief that you are entirely unique, destined for greatness without effort, or uniquely victimized by the universe is a form of narcissism. You are average at most things.', ta: 'நீங்கள் முற்றிலும் தனித்துவமானவர், முயற்சி இல்லாமல் மகத்துவத்திற்காகப் பிறந்தவர் அல்லது பிரபஞ்சத்தால் தனித்துவமாகப் பலியாக்கப்பட்டவர் என்ற நம்பிக்கை நாசீசிசத்தின் (Narcissism) ஒரு வடிவமாகும். நீங்கள் பெரும்பாலான விஷயங்களில் சராசரியானவரே.' },
      whyItMatters: { en: 'Accepting your mediocrity frees you from the crushing pressure to be extraordinary at everything. It allows you to pursue things simply because you enjoy them, leading to genuine improvement.', ta: 'உங்களின் சுமாரான தன்மையை (mediocrity) ஏற்றுக்கொள்வது, எல்லாவற்றிலும் அசாதாரணமாக இருக்க வேண்டும் என்ற கடுமையான அழுத்தத்திலிருந்து உங்களை விடுவிக்கிறது. நீங்கள் ஒரு விஷயத்தை ரசிக்கிறீர்கள் என்பதற்காகவே அதைப் பின்தொடர இது உங்களை அனுமதிக்கிறது, இது உண்மையான முன்னேற்றத்திற்கு வழிவகுக்கிறது.' },
      example: { en: 'Someone who thinks they are a misunderstood genius, blaming the world for not recognizing them, instead of doing the humble, hard work required to actually become good at their craft.', ta: 'தன்னை ஒரு தவறாகப் புரிந்துகொள்ளப்பட்ட மேதையாக நினைக்கும் ஒருவர், தங்களின் கலையில் நிபுணத்துவம் பெறத் தேவையான தாழ்மையான, கடினமான வேலையைச் செய்வதற்குப் பதிலாக, தங்களை அங்கீகரிக்காத உலகத்தைக் குறை கூறுகிறார்.' },
      actionStep: { en: 'Accept that you are perfectly average. Write down: "I am not special, and that is liberating." Let go of the need to prove your superiority to everyone.', ta: 'நீங்கள் ஒரு சரியான சராசரி என்பதை ஏற்றுக்கொள்ளுங்கள். எழுதுங்கள்: "நான் சிறப்பானவன் அல்ல, அது விடுதலையளிக்கிறது." அனைவருக்கும் உங்கள் மேலாதிக்கத்தை நிரூபிக்க வேண்டிய அவசியத்தை விட்டுவிடுங்கள்.' },
      reflectionQuestion: { en: 'Does the idea that you might just be a normal, average person deeply terrify your ego?', ta: 'நீங்கள் ஒரு சாதாரண, சராசரி நபராக இருக்கலாம் என்ற எண்ணம் உங்கள் அகந்தையை ஆழமாகப் பயமுறுத்துகிறதா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'The Value of Suffering', ta: 'துன்பத்தின் மதிப்பு' },
      explanation: { en: 'Suffering is biologically useful. It is nature\'s preferred agent for inspiring change. We only evolve and improve when we feel pain or discomfort.', ta: 'துன்பம் உயிரியல் ரீதியாகப் பயனுள்ளது. மாற்றத்தைத் தூண்டுவதற்கு இது இயற்கையின் விருப்பமான முகவராகும். நாம் வலியையோ அல்லது அசௌகரியத்தையோ உணரும்போது மட்டுமே நாம் பரிணாம வளர்ச்சியடைந்து மேம்படுகிறோம்.' },
      whyItMatters: { en: 'If we try to eliminate all suffering (through drugs, distractions, or delusion), we eliminate the very mechanism that forces us to grow. Pain is a teacher.', ta: 'அனைத்துத் துன்பங்களையும் (போதைப்பொருட்கள், கவனச்சிதறல்கள் அல்லது மாயைகள் மூலம்) அகற்ற நாம் முயற்சித்தால், நாம் வளர நம்மை வற்புறுத்தும் அதே பொறிமுறையையே நாம் அகற்றிவிடுகிறோம். வலி ஒரு ஆசிரியர்.' },
      example: { en: 'The physical pain of lifting weights tears muscle fibers so they can grow back stronger. Emotional pain works the exact same way for the psyche.', ta: 'எடைகளைத் தூக்குவதன் உடல் வலி தசை நார்களைக் கிழிப்பதால் அவை வலுவாக வளர முடியும். உணர்ச்சி வலியும் மனதிற்கு இதே முறையில்தான் செயல்படுகிறது.' },
      actionStep: { en: 'When you feel emotional pain today (rejection, failure), do not run to your phone or food to numb it. Sit with the pain for 10 minutes and ask, "What is this trying to teach me?"', ta: 'இன்று நீங்கள் உணர்ச்சி வலியை (நிராகரிப்பு, தோல்வி) உணரும்போது, அதை மரத்துப்போகச் செய்ய உங்கள் தொலைபேசிக்கோ அல்லது உணவுக்கோ ஓட வேண்டாம். அந்த வலியுடன் 10 நிமிடங்கள் உட்கார்ந்து, "இது எனக்கு என்ன கற்பிக்க முயற்சிக்கிறது?" என்று கேளுங்கள்.' },
      reflectionQuestion: { en: 'Are you systematically avoiding all discomfort, thereby stunting your own personal growth?', ta: 'நீங்கள் முறையாக அனைத்து அசௌகரியங்களையும் தவிர்க்கிறீர்களா, அதன் மூலம் உங்களின் சொந்தத் தனிப்பட்ட வளர்ச்சியைத் தடுக்கிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Shitty Values vs. Good Values', ta: 'மோசமான மதிப்புகள் vs நல்ல மதிப்புகள்' },
      explanation: { en: 'Good values are reality-based, socially constructive, and immediate/controllable (e.g., honesty, curiosity). Shitty values are superstitious, socially destructive, and not controllable (e.g., being universally liked, making a million dollars).', ta: 'நல்ல மதிப்புகள் யதார்த்த அடிப்படையிலானவை, சமூகம் சார்ந்த ஆக்கபூர்வமானவை மற்றும் உடனடியான/கட்டுப்படுத்தக்கூடியவை (எ.கா., நேர்மை, ஆர்வம்). மோசமான மதிப்புகள் மூடநம்பிக்கையானவை, சமூக அழிவுகரமானவை மற்றும் கட்டுப்படுத்த முடியாதவை (எ.கா., உலகளாவிய அளவில் விரும்பப்படுவது, ஒரு மில்லியன் டாலர்களைச் சம்பாதிப்பது).' },
      whyItMatters: { en: 'If your values are out of your control (like wanting everyone to like you), you will constantly suffer because the world will inevitably deny you. You must choose metrics you can actually control.', ta: 'உங்கள் மதிப்புகள் உங்கள் கட்டுப்பாட்டிற்கு வெளியே இருந்தால் (எல்லோரும் உங்களை விரும்ப வேண்டும் என்பது போல), உலகம் தவிர்க்க முடியாமல் உங்களை மறுக்கும் என்பதால் நீங்கள் தொடர்ந்து கஷ்டப்படுவீர்கள். உங்களால் உண்மையில் கட்டுப்படுத்தக்கூடிய அளவீடுகளை நீங்கள் தேர்ந்தெடுக்க வேண்டும்.' },
      example: { en: 'Shitty Value: "I want to be the most popular guy at the party." (Uncontrollable). Good Value: "I want to be a good listener and show genuine interest in others." (Controllable).', ta: 'மோசமான மதிப்பு: "பார்ட்டியில் நான் மிகவும் பிரபலமான நபராக இருக்க விரும்புகிறேன்." (கட்டுப்படுத்த முடியாதது). நல்ல மதிப்பு: "நான் ஒரு நல்ல கேட்பவராக இருக்க விரும்புகிறேன் மற்றும் மற்றவர்கள் மீது உண்மையான ஆர்வம் காட்ட விரும்புகிறேன்." (கட்டுப்படுத்தக்கூடியது).' },
      actionStep: { en: 'Write down the three things you value most in life right now. Are they entirely within your control? If not, rewrite them so that you have total agency over them.', ta: 'தற்போது வாழ்க்கையில் நீங்கள் அதிகம் மதிக்கும் மூன்று விஷயங்களை எழுதுங்கள். அவை முழுமையாக உங்கள் கட்டுப்பாட்டிற்குள் உள்ளனவா? இல்லையெனில், அவை மீது உங்களுக்கு முழுமையான முகவாண்மை (Agency) இருக்கும்படி அவற்றை மீண்டும் எழுதுங்கள்.' },
      reflectionQuestion: { en: 'Are you measuring your self-worth using a yardstick (like wealth or fame) that is largely determined by luck and other people?', ta: 'அதிர்ஷ்டம் மற்றும் பிற மனிதர்களால் பெருமளவு தீர்மானிக்கப்படும் ஒரு அளவுகோலைப் (செல்வம் அல்லது புகழ் போன்ற) பயன்படுத்தி உங்களின் சுய மதிப்பை நீங்கள் அளவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'You Are Always Choosing', ta: 'நீங்கள் எப்போதும் தேர்ந்தெடுக்கிறீர்கள்' },
      explanation: { en: 'We don\'t always control what happens to us. But we *always* control how we interpret what happens to us, as well as how we respond.', ta: 'நமக்கு என்ன நடக்கிறது என்பதை நாம் எப்போதும் கட்டுப்படுத்துவதில்லை. ஆனால் நமக்கு நடப்பதை நாம் எவ்வாறு புரிந்துகொள்கிறோம் என்பதையும், அதற்கு எவ்வாறு பதிலளிக்கிறோம் என்பதையும் நாம் *எப்போதும்* கட்டுப்படுத்துகிறோம்.' },
      whyItMatters: { en: 'The moment you take total responsibility for everything in your life, even the things that are not your fault, you instantly gain power over them. Blame is the opposite of empowerment.', ta: 'உங்கள் வாழ்க்கையில் உள்ள அனைத்திற்கும், உங்கள் தவறில்லாத விஷயங்களுக்குக் கூட நீங்கள் முழுப் பொறுப்பேற்கும் தருணத்தில், உடனடியாக அவற்றின் மீது அதிகாரத்தைப் பெறுவீர்கள். பழிசுமத்துதல் என்பது அதிகாரமளித்தலுக்கு நேர்மாறானது.' },
      example: { en: 'If someone leaves a baby on your doorstep, it is not your *fault*. But it is now your *responsibility* to choose what to do next. You cannot escape the choice.', ta: 'யாராவது உங்கள் வீட்டு வாசலில் ஒரு குழந்தையை விட்டுச் சென்றால், அது உங்கள் *தவறு* அல்ல. ஆனால் அடுத்து என்ன செய்ய வேண்டும் என்பதைத் தேர்ந்தெடுப்பது இப்போது உங்களின் *பொறுப்பாகும்*. தேர்விலிருந்து உங்களால் தப்ப முடியாது.' },
      actionStep: { en: 'Identify a problem in your life that you believe is 100% someone else\'s fault. Take responsibility for it anyway. How are *you* going to fix it or respond to it?', ta: 'உங்கள் வாழ்க்கையில் 100% வேறொருவரின் தவறு என்று நீங்கள் நம்பும் ஒரு பிரச்சினையைக் கண்டறியவும். எப்படியிருந்தாலும் அதற்கான பொறுப்பை ஏற்றுக்கொள்ளுங்கள். *நீங்கள்* எப்படி அதைச் சரிசெய்யப் போகிறீர்கள் அல்லது அதற்குப் பதிலளிக்கப் போகிறீர்கள்?' },
      reflectionQuestion: { en: 'Do you prefer the comfortable role of the victim, because it excuses you from the hard work of solving your own problems?', ta: 'பாதிக்கப்பட்டவர் என்ற வசதியான பாத்திரத்தை நீங்கள் விரும்புகிறீர்களா, ஏனென்றால் அது உங்களின் சொந்தப் பிரச்சினைகளைத் தீர்க்கும் கடின உழைப்பிலிருந்து உங்களை விடுவிக்கிறதா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Fault vs. Responsibility', ta: 'தவறு vs பொறுப்பு' },
      explanation: { en: 'Fault is past tense; responsibility is present tense. Fault results from choices that have already been made; responsibility results from the choices you are currently making.', ta: 'தவறு என்பது கடந்தகாலம்; பொறுப்பு என்பது நிகழ்காலம். ஏற்கனவே எடுக்கப்பட்ட தேர்வுகளின் விளைவே தவறு; நீங்கள் தற்போது எடுத்துக்கொண்டிருக்கும் தேர்வுகளின் விளைவே பொறுப்பு.' },
      whyItMatters: { en: 'Many people refuse to take responsibility for their trauma because they confuse it with fault. "It wasn\'t my fault I was abused, so I shouldn\'t have to fix it." But healing is still your responsibility.', ta: 'பலர் தங்கள் அதிர்ச்சிக்குப் (Trauma) பொறுப்பேற்க மறுக்கிறார்கள், ஏனெனில் அவர்கள் அதைத் தவறுடன் குழப்புகிறார்கள். "நான் துஷ்பிரயோகம் செய்யப்பட்டது என் தவறு அல்ல, அதனால் நான் அதைச் சரிசெய்ய வேண்டியதில்லை." ஆனால் குணமடைவது இன்னும் உங்களின் பொறுப்புதான்.' },
      example: { en: 'Getting hit by a drunk driver is entirely the driver\'s *fault*. But recovering physically and mentally from the crash is entirely your *responsibility*.', ta: 'குடிபோதையில் வாகனம் ஓட்டியவரால் இடிக்கப்படுவது முற்றிலும் அந்த ஓட்டுநரின் *தவறு*. ஆனால் விபத்தில் இருந்து உடல் மற்றும் மன ரீதியாக மீண்டு வருவது முற்றிலும் உங்களின் *பொறுப்பாகும்*.' },
      actionStep: { en: 'Say out loud: "I may not be at fault for this situation, but I am entirely responsible for how I handle it from this second forward."', ta: 'சத்தமாகச் சொல்லுங்கள்: "இந்தச் சூழ்நிலைக்கு நான் காரணமாக இல்லாமல் இருக்கலாம், ஆனால் இந்த நொடியிலிருந்து நான் அதை எப்படிக் கையாளுகிறேன் என்பதற்கு நான் முற்றிலும் பொறுப்பாவேன்."' },
      reflectionQuestion: { en: 'Are you using someone else\'s past mistakes as a permanent excuse for your current lack of progress?', ta: 'உங்களின் தற்போதைய முன்னேற்றமின்மைக்கு வேறொருவரின் கடந்தகாலத் தவறுகளை நிரந்தரக் காரணாக நீங்கள் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Uncertainty is the Root of All Progress', ta: 'அனைத்து முன்னேற்றத்திற்கும் நிச்சயமற்ற தன்மையே ஆணிவேர்' },
      explanation: { en: 'We don’t actually know what a positive or negative experience is. Some of the most difficult and stressful moments of our lives also end up being the most formative and motivating.', ta: 'நேர்மறை அல்லது எதிர்மறை அனுபவம் என்றால் என்ன என்பது நமக்கு உண்மையில் தெரியாது. நமது வாழ்க்கையின் மிகவும் கடினமான மற்றும் மன அழுத்தமான தருணங்களில் சில, முடிவில் மிகவும் வடிவமைக்கும் மற்றும் ஊக்கமளிக்கும் தருணங்களாக மாறிவிடுகின்றன.' },
      whyItMatters: { en: 'If you think you know everything, you cannot learn. The more you admit you don\'t know, the more opportunities you gain to learn and grow. Certainty is the enemy of growth.', ta: 'உங்களுக்கு எல்லாம் தெரியும் என்று நீங்கள் நினைத்தால், உங்களால் கற்றுக்கொள்ள முடியாது. உங்களுக்குத் தெரியாது என்று நீங்கள் எவ்வளவு அதிகமாக ஒப்புக்கொள்கிறீர்களோ, அவ்வளவு அதிகமாகக் கற்றுக்கொள்ளவும் வளரவும் வாய்ப்புகளைப் பெறுகிறீர்கள். நிச்சயத்தன்மை என்பது வளர்ச்சியின் எதிரி.' },
      example: { en: 'A scientist who is absolutely certain their hypothesis is correct will ignore contradictory data. A scientist who is comfortable being wrong will discover the actual truth.', ta: 'தங்களின் கருதுகோள் சரியானது என்று முற்றிலும் உறுதியாக இருக்கும் ஒரு விஞ்ஞானி முரண்பாடான தரவுகளைப் புறக்கணிப்பார். தவறு செய்வதில் சௌகரியமாக இருக்கும் ஒரு விஞ்ஞானி உண்மையான உண்மையைக் கண்டுபிடிப்பார்.' },
      actionStep: { en: 'Identify a strong belief you hold about yourself (e.g., "I am not a math person" or "I am naturally lazy"). Ask yourself: "What if I am completely wrong about this?"', ta: 'உங்களைப் பற்றி நீங்கள் வைத்திருக்கும் ஒரு வலுவான நம்பிக்கையைக் கண்டறியவும் (எ.கா., "நான் கணக்கு நபர் அல்ல" அல்லது "நான் இயற்கையாகவே சோம்பேறி"). உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "இதைப் பற்றி நான் முற்றிலும் தவறாக நினைத்திருந்தால் என்னவாகும்?"' },
      reflectionQuestion: { en: 'Are you clinging to your current beliefs because they are comfortable, even if they are holding you back from evolving?', ta: 'உங்கள் தற்போதைய நம்பிக்கைகள் உங்களை வளர்ச்சியடைய விடாமல் தடுத்து நிறுத்தினாலும், அவை வசதியாக இருப்பதனால் அவற்றை நீங்கள் பற்றிக்கொண்டிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The Architecture of Your Own Beliefs', ta: 'உங்கள் சொந்த நம்பிக்கைகளின் கட்டமைப்பு' },
      explanation: { en: 'Our brains are meaning machines. What we understand as "truth" is actually just our brain\'s imperfect attempt to organize patterns. Most of our beliefs are flawed, biased, or totally wrong.', ta: 'நமது மூளைகள் அர்த்தத்தைக் கண்டுபிடிக்கும் இயந்திரங்கள். "உண்மை" என்று நாம் புரிந்துகொள்வது உண்மையில் வடிவங்களை ஒழுங்கமைப்பதற்கான நமது மூளையின் அபூரண முயற்சியாகும். நமது பெரும்பாலான நம்பிக்கைகள் குறைபாடுடையவை, பாரபட்சமானவை அல்லது முற்றிலும் தவறானவை.' },
      whyItMatters: { en: 'When you realize that your internal narrative is largely made up, you stop taking your own thoughts so seriously. You become less defensive and more open to changing your mind.', ta: 'உங்கள் உள்-கதை பெருமளவில் உருவாக்கப்பட்டது என்பதை நீங்கள் உணரும்போது, உங்களின் சொந்த எண்ணங்களை இவ்வளவு தீவிரமாக எடுத்துக்கொள்வதை நிறுத்துகிறீர்கள். நீங்கள் குறைவான தற்காப்புத் தன்மையுடனும் உங்கள் மனதை மாற்றுவதற்கு அதிகத் திறந்த மனத்துடனும் மாறுகிறீர்கள்.' },
      example: { en: 'Believing your boss hates you because they didn\'t say "hi" in the hallway, when in reality, they just got terrible news about their family and didn\'t even see you.', ta: 'தாழ்வாரத்தில் "ஹாய்" சொல்லாததால் உங்கள் முதலாளி உங்களை வெறுக்கிறார் என்று நம்புவது, ஆனால் உண்மையில், அவர்கள் தங்கள் குடும்பத்தைப் பற்றிய பயங்கரமான செய்தியைப் பெற்றிருப்பார்கள், உங்களைப் பார்த்திருக்கவே மாட்டார்கள்.' },
      actionStep: { en: 'Notice when you make a massive assumption about someone\'s motives today. Remind yourself: "My brain is just guessing. I actually have no idea why they did that."', ta: 'இன்று ஒருவரின் நோக்கங்களைப் பற்றி நீங்கள் ஒரு பெரிய அனுமானத்தைச் செய்யும்போது கவனியுங்கள். உங்களை நீங்களே நினைவூட்டுங்கள்: "என் மூளை வெறுமனே யூகிக்கிறது. அவர்கள் ஏன் அப்படிச் செய்தார்கள் என்று எனக்கு உண்மையில் தெரியாது."' },
      reflectionQuestion: { en: 'Do you treat your feelings as if they are objective facts about the universe?', ta: 'உங்கள் உணர்வுகளைப் பிரபஞ்சத்தைப் பற்றிய புறநிலை உண்மைகளைப் போலக் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Manson\'s Law of Avoidance', ta: 'மான்சனின் தவிர்ப்பு விதி' },
      explanation: { en: 'The more something threatens your identity, the more you will avoid it. We avoid success just as much as we avoid failure, if that success contradicts who we believe we are.', ta: 'ஒரு விஷயம் உங்கள் அடையாளத்தை எவ்வளவு அதிகமாக அச்சுறுத்துகிறதோ, அவ்வளவு அதிகமாக நீங்கள் அதைத் தவிர்ப்பீர்கள். அந்த வெற்றி நாம் யார் என்று நம்புவதற்கு முரணாக இருந்தால், தோல்வியைத் தவிர்ப்பது போலவே வெற்றியையும் நாம் தவிர்க்கிறோம்.' },
      whyItMatters: { en: 'If you identify as a "starving artist," you will unconsciously sabotage opportunities to make money, because making money destroys your identity. You must keep your identity small.', ta: 'நீங்கள் ஒரு "பசியுள்ள கலைஞன்" என்று அடையாளப்படுத்திக்கொண்டால், நீங்கள் பணம் சம்பாதிக்கும் வாய்ப்புகளை அறியாமலேயே நாசமாக்குவீர்கள், ஏனென்றால் பணம் சம்பாதிப்பது உங்களின் அடையாளத்தை அழிக்கிறது. நீங்கள் உங்கள் அடையாளத்தைச் சிறியதாக வைத்திருக்க வேண்டும்.' },
      example: { en: 'A person who identifies as "socially awkward" getting invited to a great party, but deciding to stay home and watch Netflix so they don\'t have to risk changing their self-image.', ta: 'தங்களை "சமூகரீதியாக விகாரமானவர்கள்" என்று அடையாளப்படுத்திக்கொள்ளும் ஒருவர் ஒரு சிறந்த பார்ட்டிக்கு அழைக்கப்படுகிறார், ஆனால் தங்களின் சுய-பிம்பத்தை மாற்றும் அபாயத்தை எடுக்கக் கூடாது என்பதற்காக வீட்டில் தங்கி நெட்ஃபிக்ஸ் (Netflix) பார்க்க முடிவு செய்கிறார்.' },
      actionStep: { en: 'Stop labeling yourself. Don\'t be "the smart one," "the victim," or "the rebel." Just be a student of life. Let go of identities that force you to behave in rigid ways.', ta: 'உங்களை நீங்களே முத்திரையிடுவதை நிறுத்துங்கள். "புத்திசாலி", "பாதிக்கப்பட்டவர்" அல்லது "கிளர்ச்சியாளர்" என்று இருக்க வேண்டாம். வாழ்க்கையின் மாணவராக மட்டும் இருங்கள். கடினமான வழிகளில் நடந்துகொள்ள உங்களைக் கட்டாயப்படுத்தும் அடையாளங்களை விட்டுவிடுங்கள்.' },
      reflectionQuestion: { en: 'What positive changes in your life are you secretly sabotaging because they don\'t fit the story you tell yourself about who you are?', ta: 'நீங்கள் யார் என்பதைப் பற்றி உங்களுக்கு நீங்களே சொல்லிக்கொள்ளும் கதைக்குப் பொருந்தாததால், உங்கள் வாழ்க்கையில் எந்த நேர்மறையான மாற்றங்களை நீங்கள் ரகசியமாக நாசமாக்குகிறீர்கள்?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'Kill Yourself (Egoically)', ta: 'உங்களை நீங்களே கொல்லுங்கள் (அகந்தை ரீதியாக)' },
      explanation: { en: 'In order to truly change, the old version of you must die. You must let go of the beliefs, habits, and values that have defined you up to this point.', ta: 'உண்மையில் மாறுவதற்கு, உங்களின் பழைய பதிப்பு இறக்க வேண்டும். இதுவரை உங்களை வரையறுத்த நம்பிக்கைகள், பழக்கவழக்கங்கள் மற்றும் மதிப்புகளை நீங்கள் விட்டுவிட வேண்டும்.' },
      whyItMatters: { en: 'Growth is entirely destructive. You cannot build a new house without tearing down the old one. If you protect your ego at all costs, you will never grow.', ta: 'வளர்ச்சி முற்றிலும் அழிவுகரமானது. பழைய வீட்டை இடிக்காமல் புதிய வீட்டைக் கட்ட முடியாது. எந்த விலைகொடுத்தாவது உங்களின் அகந்தையை நீங்கள் பாதுகாத்தால், நீங்கள் ஒருபோதும் வளர மாட்டீர்கள்.' },
      example: { en: 'Realizing that your belief that "money is evil" is keeping you broke, and actively choosing to destroy that belief, even though it feels uncomfortable and feels like a loss of your old self.', ta: '"பணம் தீமையானது" என்ற உங்களின் நம்பிக்கை உங்களை ஏழையாக வைத்திருக்கிறது என்பதை உணர்ந்து, அது அசௌகரியமாக உணர்ந்தாலும் மற்றும் உங்களின் பழைய சுயத்தின் இழப்பாக உணர்ந்தாலும், அந்த நம்பிக்கையை அழிக்கத் தீவிரமாகத் தேர்ந்தெடுப்பது.' },
      actionStep: { en: 'Find one opinion you hold very strongly. Read a well-written book or article arguing the exact opposite point of view, with the goal of proving yourself wrong.', ta: 'நீங்கள் மிக வலுவாகக் கொண்டிருக்கும் ஒரு கருத்தைக் கண்டறியவும். உங்களை நீங்களே தவறு என்று நிரூபிக்கும் நோக்கத்துடன், முற்றிலும் நேர்மாறான பார்வையை வாதிடும் நன்கு எழுதப்பட்ட புத்தகம் அல்லது கட்டுரையைப் படியுங்கள்.' },
      reflectionQuestion: { en: 'Are you more committed to being "right" about your past than you are to being happy in your future?', ta: 'உங்கள் எதிர்காலத்தில் மகிழ்ச்சியாக இருப்பதை விட உங்கள் கடந்த காலத்தைப் பற்றி "சரியாக" இருப்பதில் அதிக உறுதியுடன் இருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'The "Do Something" Principle', ta: '"ஏதாவது செய்" கொள்கை' },
      explanation: { en: 'Action isn\'t just the effect of motivation; it’s also the cause of it. If you lack the motivation to make a change, do something—*anything*—and harness the reaction to that action to begin motivating yourself.', ta: 'செயல் என்பது உந்துதலின் விளைவு மட்டுமல்ல; அது அதன் காரணமும்கூட. மாற்றத்தைச் செய்வதற்கான உந்துதல் உங்களிடம் இல்லை என்றால், ஏதாவது செய்யுங்கள்—*எதுவாக இருந்தாலும்*—மேலும் உங்களை நீங்களே ஊக்கப்படுத்தத் தொடங்க அந்தச் செயலுக்கான எதிர்வினையைப் பயன்படுத்துங்கள்.' },
      whyItMatters: { en: 'People wait for inspiration to strike before they act. But inspiration comes from action. The cycle is: Action -> Inspiration -> Motivation. Just start.', ta: 'மனிதர்கள் செயல்படுவதற்கு முன்பு உத்வேகம் தாக்கக் காத்திருக்கிறார்கள். ஆனால் உத்வேகம் செயலிலிருந்தே வருகிறது. இதன் சுழற்சி: செயல் -> உத்வேகம் -> உந்துதல். வெறுமனே தொடங்குங்கள்.' },
      example: { en: 'Not wanting to write a 10-page essay. Instead of waiting for motivation, committing to writing just one crappy paragraph. Writing that paragraph creates the momentum to write the rest.', ta: '10-பக்கக் கட்டுரையை எழுத விரும்பவில்லை. உந்துதலுக்காகக் காத்திருப்பதற்குப் பதிலாக, ஒரு மோசமான பத்தியை மட்டும் எழுத உறுதியளிப்பது. அந்தப் பத்தியை எழுதுவது மீதமுள்ளதை எழுதுவதற்கான வேகத்தை உருவாக்குகிறது.' },
      actionStep: { en: 'Think of a task you are procrastinating on. Commit to working on it for just 2 minutes right now. You have permission to quit after 2 minutes. (You probably won\'t).', ta: 'நீங்கள் தள்ளிப்போடும் ஒரு பணியைப் பற்றிச் சிந்தியுங்கள். இப்போதே வெறும் 2 நிமிடங்கள் அதில் வேலை செய்ய உறுதியளிக்கவும். 2 நிமிடங்களுக்குப் பிறகு வெளியேற உங்களுக்கு அனுமதி உண்டு. (அநேகமாக நீங்கள் வெளியேற மாட்டீர்கள்).' },
      reflectionQuestion: { en: 'Are you sitting around waiting for an emotional epiphany to save you, instead of saving yourself through simple, physical momentum?', ta: 'எளிய, பௌதீக வேகத்தின் மூலம் உங்களை நீங்களே காப்பாற்றிக் கொள்வதற்குப் பதிலாக, ஒரு உணர்ச்சிகரமான வெளிப்பாடு உங்களைக் காப்பாற்றும் என்று காத்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'The Importance of Saying No', ta: 'இல்லை என்று சொல்வதன் முக்கியத்துவம்' },
      explanation: { en: 'Rejection makes our relationships better. To build trust, you have to be able to say no to people, and hear no from them. Without boundaries, a relationship is just manipulation.', ta: 'நிராகரிப்பு நமது உறவுகளைச் சிறப்பாக்குகிறது. நம்பிக்கையை வளர்க்க, உங்களால் மனிதர்களிடம் இல்லை என்று சொல்லவும், அவர்களிடமிருந்து இல்லை என்று கேட்கவும் முடிய வேண்டும். எல்லைகள் இல்லாமல், ஒரு உறவு என்பது வெறும் கையாளுதல் மட்டுமே.' },
      whyItMatters: { en: 'If you value everything, you value nothing. You must reject alternative options to truly commit to a career, a partner, or a belief. Commitment gives you depth.', ta: 'நீங்கள் அனைத்தையும் மதித்தால், நீங்கள் எதையும் மதிக்கவில்லை என்று அர்த்தம். ஒரு தொழில், ஒரு கூட்டாளர் அல்லது ஒரு நம்பிக்கைக்கு உண்மையாக அர்ப்பணிக்க நீங்கள் மாற்று விருப்பங்களை நிராகரிக்க வேண்டும். அர்ப்பணிப்பு உங்களுக்கு ஆழத்தைத் தருகிறது.' },
      example: { en: 'A "people pleaser" who says yes to every social invitation ends up exhausted, resentful, and unable to be a truly good friend to anyone. Saying "no" protects the things you care about.', ta: 'ஒவ்வொரு சமூக அழைப்புக்கும் ஆம் என்று சொல்லும் "மனிதர்களைப் பிரியப்படுத்துபவர்", இறுதியில் சோர்வடைந்து, மனக்கசப்புடன், யாருக்கும் உண்மையான நல்ல நண்பராக இருக்க முடியாமல் போகிறார். "இல்லை" என்று சொல்வது நீங்கள் அக்கறை கொள்ளும் விஷயங்களைப் பாதுகாக்கிறது.' },
      actionStep: { en: 'Find one thing you agreed to do this week out of guilt or obligation. Politely cancel it. Experience the slight discomfort of rejection, followed by the immense relief of freedom.', ta: 'குற்ற உணர்வு அல்லது கடமை உணர்வால் இந்த வாரம் நீங்கள் செய்ய ஒப்புக்கொண்ட ஒரு விஷயத்தைக் கண்டறியவும். அதை மரியாதையாக ரத்து செய்யுங்கள். நிராகரிப்பின் லேசான அசௌகரியத்தையும், அதைத் தொடர்ந்து சுதந்திரத்தின் அபரிமிதமான விடுதலையையும் அனுபவியுங்கள்.' },
      reflectionQuestion: { en: 'Are you terrified of conflict to the point that you will lie and sacrifice your own values just to keep the peace?', ta: 'அமைதியைக் காக்க வேண்டும் என்பதற்காகவே நீங்கள் பொய் சொல்வீர்கள் மற்றும் உங்களின் சொந்த மதிப்புகளைத் தியாகம் செய்வீர்கள் என்ற அளவுக்கு நீங்கள் மோதலை நினைத்துப் பயப்படுகிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'Commitment Offers Freedom', ta: 'அர்ப்பணிப்பு சுதந்திரத்தை வழங்குகிறது' },
      explanation: { en: 'Consumer culture tells us more is better (more options, more partners, more experiences). But deep meaning is only found through restriction—by choosing one thing and diving deep into it.', ta: 'நுகர்வோர் கலாச்சாரம் அதிகமிருப்பதே சிறந்தது என்று சொல்கிறது (அதிக விருப்பங்கள், அதிகக் கூட்டாளர்கள், அதிக அனுபவங்கள்). ஆனால் கட்டுப்பாட்டின் மூலமே ஆழமான அர்த்தம் காணப்படுகிறது—ஒரு விஷயத்தைத் தேர்ந்தெடுத்து அதனுள் ஆழமாக மூழ்குவதன் மூலம்.' },
      whyItMatters: { en: 'When you are overloaded with options, you suffer from FOMO (Fear Of Missing Out) and never commit to anything. Committing to one path liberates you from the anxiety of infinite choices.', ta: 'நீங்கள் விருப்பங்களால் நிரம்பியிருக்கும்போது, நீங்கள் FOMO (தவறவிட்டுவிடுவோமோ என்ற பயம்) நோயால் பாதிக்கப்படுகிறீர்கள் மற்றும் எதற்கும் அர்ப்பணிப்பதில்லை. ஒரு பாதையில் உறுதியாக இருப்பது முடிவற்ற தேர்வுகளின் கவலையிலிருந்து உங்களை விடுவிக்கிறது.' },
      example: { en: 'Dating 50 people casually over five years yields shallow experiences. Committing deeply to one person for five years forces you to confront your flaws and experience profound intimacy.', ta: 'ஐந்து வருடங்களில் 50 பேருடன் சாதாரணமாகப் பழகுவது ஆழமற்ற அனுபவங்களையே தரும். ஐந்து வருடங்கள் ஒருவருடன் ஆழமாக அர்ப்பணிப்புடன் இருப்பது உங்கள் குறைகளை எதிர்கொள்ளவும் ஆழமான நெருக்கத்தை அனுபவிக்கவும் உங்களைக் கட்டாயப்படுத்துகிறது.' },
      actionStep: { en: 'Choose one skill, hobby, or project. Commit to focusing exclusively on it for the next 3 months, completely ignoring all other shiny distractions.', ta: 'ஒரு திறன், பொழுதுபோக்கு அல்லது திட்டத்தைத் தேர்ந்தெடுக்கவும். மற்ற அனைத்து மினுமினுப்பான கவனச்சிதறல்களையும் முற்றிலுமாகப் புறக்கணித்துவிட்டு, அடுத்த 3 மாதங்களுக்கு இதில் பிரத்தியேகமாகக் கவனம் செலுத்த உறுதியளியுங்கள்.' },
      reflectionQuestion: { en: 'Are you keeping your options open in every area of your life, resulting in a life that is wide but incredibly shallow?', ta: 'உங்கள் வாழ்க்கையின் ஒவ்வொரு பகுதியிலும் உங்களின் விருப்பங்களைத் திறந்து வைத்திருக்கிறீர்களா, அதன் விளைவாக ஒரு பரந்த ஆனால் நம்பமுடியாத அளவிற்கு ஆழமற்ற வாழ்க்கை வாழ்கிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Trust is the Currency of Relationships', ta: 'நம்பிக்கையே உறவுகளின் நாணயம்' },
      explanation: { en: 'Without trust, relationships do not exist. Trust is built through honesty, vulnerability, and the willingness to face conflict together rather than hiding it.', ta: 'நம்பிக்கை இல்லாமல், உறவுகள் இருப்பதில்லை. நேர்மை, பாதிப்புக்குள்ளாகும் தன்மை, மற்றும் மோதலை மறைப்பதை விட ஒன்றாக எதிர்கொள்ளும் விருப்பம் ஆகியவற்றின் மூலம் நம்பிக்கை கட்டமைக்கப்படுகிறது.' },
      whyItMatters: { en: 'If someone cheats on you, it\'s not the sex that destroys the relationship, it\'s the destruction of trust. Trust is like a china plate; once broken, it takes immense effort to glue back together, and it will never look the same.', ta: 'யாராவது உங்களை ஏமாற்றினால், உறவை அழிப்பது உடலுறவு அல்ல, அது நம்பிக்கையின் அழிவாகும். நம்பிக்கை ஒரு பீங்கான் தட்டு போன்றது; உடைந்தால், அதை மீண்டும் ஒட்டுவதற்கு அபரிமிதமான முயற்சி தேவைப்படும், அது ஒருபோதும் பழையது போல் இருக்காது.' },
      example: { en: 'Telling your partner a difficult truth that might make them angry right now, in order to preserve the long-term bedrock of trust between you.', ta: 'உங்களுக்கிடையேயான நீண்டகால நம்பிக்கையின் அடித்தளத்தைப் பாதுகாப்பதற்காக, உங்களின் கூட்டாளரிடம் ஒரு கடினமான உண்மையைக் கூறுவது இப்போது அவர்களுக்குக் கோபத்தை ஏற்படுத்தலாம்.' },
      actionStep: { en: 'Admit a small mistake to someone you care about today. Don\'t make excuses for it. Just say, "I messed this up, and I\'m sorry." Watch how it actually builds trust.', ta: 'இன்று நீங்கள் அக்கறை கொள்ளும் ஒருவரிடம் ஒரு சிறிய தவறை ஒப்புக்கொள்ளுங்கள். அதற்காகச் சாக்குப்போக்கு சொல்லாதீர்கள். "நான் இதைக் குழப்பிவிட்டேன், என்னை மன்னித்துவிடுங்கள்" என்று சொல்லுங்கள். அது எப்படி உண்மையில் நம்பிக்கையை உருவாக்குகிறது என்பதைப் பாருங்கள்.' },
      reflectionQuestion: { en: 'Are you lying by omission to your loved ones just to avoid an uncomfortable 5-minute conversation?', ta: 'ஒரு சங்கடமான 5-நிமிட உரையாடலைத் தவிர்ப்பதற்காக உங்கள் அன்புக்குரியவர்களிடம் எதையும் சொல்லாமல் பொய் சொல்கிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'And Then You Die', ta: 'பின்னர் நீங்கள் இறக்கிறீர்கள்' },
      explanation: { en: 'Death is the only certainty in life. Everything we do is driven by our fear of death—our desire to build monuments, write books, and have children is an attempt to achieve "immortality projects."', ta: 'வாழ்க்கையில் உறுதியானது மரணம் மட்டுமே. நாம் செய்யும் ஒவ்வொரு காரியமும் மரணத்தின் மீதான நமது பயத்தால் உந்தப்படுகிறது—நினைவுச்சின்னங்களைக் கட்டுதல், புத்தகங்கள் எழுதுதல் மற்றும் குழந்தைகளைப் பெறுதல் போன்ற நமது ஆசைகள் "அழியாத திட்டங்களை" அடைவதற்கான முயற்சியாகும்.' },
      whyItMatters: { en: 'When you accept the reality of your own death, it eliminates the fear of trivial things. Suddenly, getting rejected, failing at a business, or looking stupid at a party don\'t seem to matter at all.', ta: 'உங்களின் சொந்த மரணத்தின் யதார்த்தத்தை நீங்கள் ஏற்றுக்கொள்ளும்போது, அது அற்பமான விஷயங்களின் பயத்தை நீக்குகிறது. திடீரென்று, நிராகரிக்கப்படுவது, வியாபாரத்தில் தோல்வியடைவது அல்லது ஒரு பார்ட்டியில் முட்டாள்தனமாகத் தெரிவது ஆகியவை ஒரு பொருட்டாகவே தெரியாது.' },
      example: { en: 'Standing on the edge of a cliff, realizing that your life is incredibly fragile and brief. This realization makes you want to stop wasting time on Twitter arguments and tell your family you love them.', ta: 'ஒரு குன்றின் விளிம்பில் நின்று, உங்களின் வாழ்க்கை நம்பமுடியாத அளவிற்கு உடையக்கூடியது மற்றும் சுருக்கமானது என்பதை உணர்வது. இந்த உணர்தல், ட்விட்டர் (Twitter) விவாதங்களில் நேரத்தை வீணடிப்பதை நிறுத்திவிட்டு, உங்கள் குடும்பத்தினரிடம் அவர்களை நீங்கள் நேசிப்பதாகச் சொல்லத் தூண்டுகிறது.' },
      actionStep: { en: 'Meditate on your own death for 3 minutes. Imagine the world going on perfectly fine without you. Use that stark reality to clarify what you actually want to do with today.', ta: 'உங்கள் சொந்த மரணத்தைப் பற்றி 3 நிமிடங்கள் தியானியுங்கள். நீங்கள் இல்லாமல் உலகம் கச்சிதமாக இயங்குவதைக் கற்பனை செய்து பாருங்கள். இன்றைய தினத்தை நீங்கள் உண்மையில் என்ன செய்ய விரும்புகிறீர்கள் என்பதைத் தெளிவுபடுத்த அந்தச் சுருக்கமான யதார்த்தத்தைப் பயன்படுத்தவும்.' },
      reflectionQuestion: { en: 'Are you living your life as if you have an infinite amount of time, delaying your true passions for "someday"?', ta: 'உங்களுக்கு எல்லையற்ற நேரம் இருப்பது போல் உங்கள் வாழ்க்கையை வாழ்கிறீர்களா, உங்களின் உண்மையான ஆர்வங்களை "ஏதோ ஒரு நாளுக்காகத்" தாமதப்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'The Sunny Side of Death', ta: 'மரணத்தின் பிரகாசமான பக்கம்' },
      explanation: { en: 'Because you are going to die, there is no reason not to be entirely yourself. Death is the light by which the shadow of all of life\'s meaning is measured.', ta: 'நீங்கள் இறக்கப் போகிறீர்கள் என்பதால், நீங்கள் முழுமையாக நீங்களாகவே இருக்கக் கூடாது என்பதற்குக் காரணமே இல்லை. மரணம் என்பது ஒரு ஒளி, அதைக் கொண்டு வாழ்க்கையின் அனைத்து அர்த்தங்களின் நிழலும் அளவிடப்படுகிறது.' },
      whyItMatters: { en: 'Embracing death destroys your ego. It forces you to choose values that are larger than yourself. It allows you to finally let go of all the f*cks you give about meaningless things.', ta: 'மரணத்தைத் தழுவுவது உங்களின் அகந்தையை அழிக்கிறது. உங்களை விடப் பெரிய மதிப்புகளைத் தேர்ந்தெடுக்க அது உங்களைக் கட்டாயப்படுத்துகிறது. அர்த்தமற்ற விஷயங்களைப் பற்றிக் கவலைப்படுவதை இறுதியாக விட்டுவிட இது உங்களை அனுமதிக்கிறது.' },
      example: { en: 'Someone getting a terminal diagnosis and immediately quitting a job they hate to spend their final year painting and playing with their kids. They finally stopped giving a f*ck about societal expectations.', ta: 'ஒருவர் தங்களுக்குக் குணப்படுத்த முடியாத நோய் இருப்பதைக் கண்டறிந்து, தங்களின் இறுதி ஆண்டை ஓவியம் வரைவதிலும் குழந்தைகளுடன் விளையாடுவதிலும் கழிப்பதற்காகத் தாங்கள் வெறுக்கும் வேலையை உடனடியாக விட்டுவிடுவது. அவர்கள் இறுதியாகச் சமூகத்தின் எதிர்பார்ப்புகளைப் பற்றிக் கவலைப்படுவதை நிறுத்திவிட்டார்கள்.' },
      actionStep: { en: 'Ask yourself: "If I found out I only had one year left to live, what would I instantly stop caring about? What would I start doing today?" Make the change now.', ta: 'உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "நான் வாழ்வதற்கு ஒரு வருடம் மட்டுமே உள்ளது என்று எனக்குத் தெரிந்தால், எதைப் பற்றிக் கவலைப்படுவதை நான் உடனடியாக நிறுத்துவேன்? இன்று நான் எதைச் செய்யத் தொடங்குவேன்?" இப்போது அந்த மாற்றத்தைச் செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Is your fear of doing something "embarrassing" stronger than your realization that you and everyone watching you will eventually be dead and forgotten?', ta: 'நீங்களும் உங்களைப் பார்க்கும் அனைவரும் இறுதியில் இறந்து மறக்கப்படுவீர்கள் என்ற உங்களின் உணர்தலை விட, "தர்மசங்கடமான" ஒன்றைச் செய்வதைப் பற்றிய உங்களின் பயம் வலுவானதா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The Subtle Art of Not Giving a F*ck' });
    if (existing) {
      console.log('The Subtle Art already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The Subtle Art of Not Giving a F*ck' });
    }
    
    await WisdomBook.create(subtleArtBook);
    console.log('The Subtle Art added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
