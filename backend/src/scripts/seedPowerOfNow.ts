import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const powerOfNowBook = {
  title: 'The Power of Now: A Guide to Spiritual Enlightenment',
  author: 'Eckhart Tolle',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg',
  categories: ['Spirituality', 'Self-Help', 'Mindfulness'],
  themes: [
    { en: 'Presence', ta: 'நிகழ்காலம்' },
    { en: 'Ego', ta: 'அகந்தை' }
  ],
  overview: {
    en: 'To make the journey into the Now, we will need to leave our analytical mind and its false created self, the ego, behind. Eckhart Tolle\'s message is simple: living in the now is the truest path to happiness and enlightenment.',
    ta: 'நிகழ்காலத்திற்குள் பயணிக்க, நாம் நமது பகுப்பாய்வு மனதையும் அது உருவாக்கிய தவறான சுயமான அகந்தையையும் பின்னால் விட்டுச் செல்ல வேண்டும். எக்ஹார்ட் டோல்லின் செய்தி எளிமையானது: நிகழ்காலத்தில் வாழ்வதே மகிழ்ச்சி மற்றும் ஞானோதயத்திற்கான உண்மையான பாதையாகும்.'
  },
  topQuotes: [
    { en: 'Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.', ta: 'நிகழ்காலம் மட்டுமே உங்களிடம் உள்ளது என்பதை ஆழமாக உணருங்கள். நிகழ்காலத்தை உங்கள் வாழ்க்கையின் முதன்மைக் குவியமாக ஆக்குங்கள்.' },
    { en: 'Nothing has happened in the past; it happened in the Now. Nothing will ever happen in the future; it will happen in the Now.', ta: 'கடந்த காலத்தில் எதுவும் நடக்கவில்லை; அது நிகழ்காலத்திலேயே நடந்தது. எதிர்காலத்தில் எதுவும் நடக்காது; அது நிகழ்காலத்திலேயே நடக்கும்.' },
    { en: 'You are not your mind.', ta: 'நீங்கள் உங்கள் மனம் அல்ல.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'You Are Not Your Mind', ta: 'நீங்கள் உங்கள் மனம் அல்ல' },
      explanation: { en: 'The greatest obstacle to enlightenment is the belief that you are your thoughts. You are actually the awareness that observes the thoughts. Your mind is an instrument; you are supposed to use it, not let it use you.', ta: 'நீங்கள் உங்களின் எண்ணங்கள் தான் என்ற நம்பிக்கையே ஞானோதயத்திற்கு மிகப்பெரிய தடையாகும். நீங்கள் உண்மையில் அந்த எண்ணங்களைக் கவனிக்கும் விழிப்புணர்வு ஆவீர்கள். உங்கள் மனம் ஒரு கருவி; நீங்கள் அதைப் பயன்படுத்த வேண்டும், அது உங்களைப் பயன்படுத்த அனுமதிக்கக் கூடாது.' },
      whyItMatters: { en: 'Identifying completely with your mind creates a false self (the ego), which is highly vulnerable to fear and suffering. Realizing you are the observer frees you from the tyranny of constant mental chatter.', ta: 'உங்கள் மனதுடன் முழுமையாக உங்களை அடையாளம் கண்டுகொள்வது ஒரு தவறான சுயத்தை (அகந்தை) உருவாக்குகிறது, இது பயம் மற்றும் துன்பத்திற்கு மிகவும் பாதிக்கப்படக்கூடியது. நீங்களே பார்வையாளர் என்பதை உணர்ந்துகொள்வது தொடர்ச்சியான மன அரட்டையின் கொடுமையிலிருந்து உங்களை விடுவிக்கிறது.' },
      example: { en: 'When you feel angry, instead of saying "I am angry," saying "I observe anger arising in my mind." This creates space between you and the emotion.', ta: 'நீங்கள் கோபமாக உணரும்போது, "நான் கோபமாக இருக்கிறேன்" என்று சொல்வதற்குப் பதிலாக, "என் மனதில் கோபம் எழுவதை நான் கவனிக்கிறேன்" என்று சொல்வது. இது உங்களுக்கும் உணர்ச்சிக்கும் இடையே ஒரு இடைவெளியை உருவாக்குகிறது.' },
      actionStep: { en: 'Set a timer for 3 minutes today. Close your eyes and simply watch your thoughts as if they were clouds passing in the sky. Do not judge them, just observe.', ta: 'இன்று 3 நிமிடங்களுக்கு டைமரை அமைக்கவும். கண்களை மூடிக்கொண்டு, மேகங்கள் வானத்தில் கடந்து செல்வதைப் போல உங்கள் எண்ணங்களை வெறுமனே பாருங்கள். அவற்றை மதிப்பிடாதீர்கள், கவனிக்க மட்டுமே செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Are you constantly caught up in an involuntary stream of thoughts, unable to turn your mind off when you want to?', ta: 'நீங்கள் எப்போது மனதை அணைக்க விரும்புகிறீர்களோ அப்போதெல்லாம் முடியாமல், தன்னிச்சையான எண்ணங்களின் நீரோட்டத்தில் தொடர்ந்து சிக்கிக்கொள்கிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The Illusion of Time', ta: 'காலத்தின் மாயை' },
      explanation: { en: 'Past and future are illusions created by the mind. The past is just a memory trace stored in the mind, and the future is an imagined projection. The only thing that ever truly exists is the present moment.', ta: 'கடந்த காலம் மற்றும் எதிர்காலம் என்பவை மனதால் உருவாக்கப்பட்ட மாயைகள். கடந்த காலம் என்பது மனதில் சேமிக்கப்பட்ட ஒரு நினைவுச் சுவடு மட்டுமே, மற்றும் எதிர்காலம் என்பது கற்பனை செய்யப்பட்ட ஒரு கணிப்பு. எப்போதுமே உண்மையிலேயே இருப்பது நிகழ்காலம் மட்டுமே.' },
      whyItMatters: { en: 'Anxiety is always about the future. Guilt and regret are always about the past. By collapsing time and focusing entirely on the Now, you eliminate the vast majority of psychological suffering.', ta: 'கவலை எப்போதும் எதிர்காலத்தைப் பற்றியது. குற்ற உணர்வும் வருத்தமும் எப்போதும் கடந்த காலத்தைப் பற்றியது. காலத்தைச் சுருக்கி முழுமையாக நிகழ்காலத்தில் கவனம் செலுத்துவதன் மூலம், உங்களின் பெரும்பான்மையான உளவியல் துன்பங்களை நீங்கள் நீக்குகிறீர்கள்.' },
      example: { en: 'Worrying intensely about a job interview that happens next week. In the present moment, you are just sitting safely in your room; the interview only exists as a stressful thought.', ta: 'அடுத்த வாரம் நடக்கவிருக்கும் வேலை நேர்காணலைப் பற்றித் தீவிரமாகக் கவலைப்படுவது. நிகழ்காலத்தில், நீங்கள் உங்கள் அறையில் பாதுகாப்பாக உட்கார்ந்திருக்கிறீர்கள்; நேர்காணல் ஒரு மன அழுத்தமான எண்ணமாக மட்டுமே உள்ளது.' },
      actionStep: { en: 'Next time you feel stressed, ask yourself: "What is wrong with *this exact moment*?" Not tomorrow, not 5 minutes from now, but right this very second.', ta: 'அடுத்த முறை நீங்கள் மன அழுத்தத்தை உணரும்போது, உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "*இந்தச் சரியான தருணத்தில்* என்ன தவறு?" நாளை அல்ல, இனி 5 நிமிடங்கள் கழித்து அல்ல, ஆனால் இந்தச் சரியான நொடியில்.' },
      reflectionQuestion: { en: 'Are you spending most of your life mentally living in the past or the future, completely missing out on the present?', ta: 'உங்கள் வாழ்நாளின் பெரும்பகுதியைக் கடந்த காலத்திலோ அல்லது எதிர்காலத்திலோ மனதளவில் வாழ்ந்து, நிகழ்காலத்தை முற்றிலுமாகத் தவறவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'Accept the Present, Then Act', ta: 'நிகழ்காலத்தை ஏற்றுக்கொண்டு, பின்னர் செயல்படுங்கள்' },
      explanation: { en: 'Resistance to what *is* creates suffering. You must accept the present moment completely, as if you had chosen it. If the present moment is unacceptable, you have three options: remove yourself from the situation, change it, or accept it totally.', ta: '*உள்ளதை* எதிர்ப்பது துன்பத்தை உருவாக்குகிறது. நிகழ்காலத்தை நீங்களே தேர்ந்தெடுத்ததைப் போல அதை முழுமையாக ஏற்றுக்கொள்ள வேண்டும். நிகழ்காலம் ஏற்றுக்கொள்ள முடியாததாக இருந்தால், உங்களுக்கு மூன்று விருப்பங்கள் உள்ளன: அந்தச் சூழ்நிலையிலிருந்து விலகுங்கள், அதை மாற்றுங்கள் அல்லது முழுமையாக ஏற்றுக்கொள்ளுங்கள்.' },
      whyItMatters: { en: 'Complaining and inner resistance consume massive amounts of energy and solve nothing. Surrendering to the reality of the present allows you to take clear, effective action without negative emotion.', ta: 'குறை கூறுவதும் உள் எதிர்ப்பும் பெருமளவிலான ஆற்றலை உட்கொள்கின்றன மற்றும் எதையும் தீர்க்காது. நிகழ்காலத்தின் யதார்த்தத்திற்குச் சரணடைவது, எதிர்மறை உணர்ச்சிகள் இல்லாமல் தெளிவான, பயனுள்ள நடவடிக்கை எடுக்க உங்களை அனுமதிக்கிறது.' },
      example: { en: 'Getting stuck in traffic and screaming at the steering wheel (resistance) vs. accepting that you are in traffic, taking a deep breath, and putting on an audiobook (acceptance).', ta: 'போக்குவரத்து நெரிசலில் சிக்கிக்கொண்டு ஸ்டீயரிங்கைப் பார்த்து கத்துவது (எதிர்ப்பு) vs. போக்குவரத்து நெரிசலில் இருப்பதை ஏற்றுக்கொண்டு, ஆழ்ந்து மூச்சு விட்டு, ஒரு ஆடியோபுக்கைப் போடுவது (ஏற்றுக்கொள்ளுதல்).' },
      actionStep: { en: 'Find one thing you are currently complaining about in your head. Decide right now to either take action to fix it, walk away from it, or completely accept it. Drop the complaining.', ta: 'தற்போது உங்கள் மனதில் நீங்கள் குறை கூறும் ஒரு விஷயத்தைக் கண்டறியவும். அதைச் சரிசெய்ய நடவடிக்கை எடுக்கவோ, அதிலிருந்து விலகிச் செல்லவோ, அல்லது அதை முழுமையாக ஏற்றுக்கொள்ளவோ இப்போதே முடிவு செய்யுங்கள். குறை கூறுவதைக் கைவிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you unconsciously resisting the reality of your current situation, causing yourself unnecessary pain?', ta: 'உங்கள் தற்போதைய சூழ்நிலையின் யதார்த்தத்தை நீங்கள் அறியாமலேயே எதிர்த்து, உங்களுக்கு நீங்களே தேவையற்ற வலியை ஏற்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'The Ego\'s Need to Survive', ta: 'அகந்தையின் உயிர்வாழத் தேவை' },
      explanation: { en: 'The ego is the unobserved mind that runs your life when you are not present as the witnessing consciousness. It survives by creating conflict, seeking enemies, and constantly needing to feel superior or inferior.', ta: 'சாட்சி கூறும் விழிப்புணர்வாக நீங்கள் நிகழ்காலத்தில் இல்லாதபோது உங்கள் வாழ்க்கையை நடத்தும் கவனிக்கப்படாத மனமே அகந்தை ஆகும். மோதலை உருவாக்குவதன் மூலம், எதிரிகளைத் தேடுவதன் மூலம், மற்றும் தொடர்ந்து மேலானதாகவோ அல்லது கீழானதாகவோ உணர வேண்டிய அவசியத்தின் மூலம் அது வாழ்கிறது.' },
      whyItMatters: { en: 'The ego feeds on drama and suffering. If you do not recognize its mechanics, it will sabotage your relationships and your peace to keep itself feeling "alive" and important.', ta: 'அகந்தை நாடகம் மற்றும் துன்பத்தால் வளர்கிறது. அதன் வழிமுறைகளை நீங்கள் அங்கீகரிக்கவில்லை என்றால், தன்னை "உயிருடன்" மற்றும் முக்கியமானதாக உணர வைக்க உங்களின் உறவுகளையும் உங்களின் அமைதியையும் அது நாசமாக்கும்.' },
      example: { en: 'Starting a pointless argument with your partner over something trivial just because your ego felt ignored and needed to create drama to assert its existence.', ta: 'உங்கள் அகந்தை புறக்கணிக்கப்பட்டதாக உணர்ந்ததாலும், அதன் இருப்பை உறுதிப்படுத்த ஒரு நாடகத்தை உருவாக்க வேண்டியிருந்ததாலும் மட்டுமே, ஒரு அற்பமான விஷயத்திற்காக உங்கள் கூட்டாளருடன் தேவையற்ற வாக்குவாதத்தைத் தொடங்குவது.' },
      actionStep: { en: 'Catch your ego in the act today. Notice when you feel a sudden urge to be "right," to gossip, or to take offense. Just smile at it internally and let it go.', ta: 'இன்று உங்கள் அகந்தை செயல்படும்போது அதைப் பிடியுங்கள். "சரியாக" இருக்க வேண்டும், வதந்தி பேச வேண்டும், அல்லது புண்பட்டதாக உணர வேண்டும் என்ற திடீர் உந்துதலை நீங்கள் உணரும்போது கவனியுங்கள். அதை நினைத்து மனதிற்குள் புன்னகைத்துவிட்டு விட்டுவிடுங்கள்.' },
      reflectionQuestion: { en: 'Do you secretly enjoy feeling offended or victimized because it gives you a strong sense of identity?', ta: 'புண்படுத்தப்பட்டதாகவோ அல்லது பலியாக்கப்பட்டதாகவோ உணர்வது உங்களுக்கு ஒரு வலுவான அடையாள உணர்வைத் தருவதால், நீங்கள் அதை ரகசியமாக ரசிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The Pain-Body', ta: 'வலி-உடல் (Pain-Body)' },
      explanation: { en: 'The pain-body is an accumulation of old emotional pain that you carry inside you. It is a semi-autonomous energy field that periodically wakes up to feed on new negative emotions.', ta: 'வலி-உடல் என்பது உங்களுக்குள் நீங்கள் சுமந்து செல்லும் பழைய உணர்ச்சிகரமான வலிகளின் திரட்சியாகும். இது ஒரு அரை-தன்னாட்சி ஆற்றல் புலமாகும், இது புதிய எதிர்மறை உணர்ச்சிகளுக்கு உணவளிக்க அவ்வப்போது விழித்தெழுகிறது.' },
      whyItMatters: { en: 'When the pain-body takes over, you become irritable, angry, or deeply sad for seemingly no reason. It wants you to unconsciously create more pain for it to feed on.', ta: 'வலி-உடல் கட்டுப்பாட்டை எடுத்துக் கொள்ளும்போது, வெளிப்படையான காரணமே இல்லாமல் நீங்கள் எரிச்சலடைகிறீர்கள், கோபப்படுகிறீர்கள் அல்லது ஆழமாகச் சோகமடைகிறீர்கள். அது உணவளிக்க நீங்கள் அறியாமலேயே அதிக வலியை உருவாக்க வேண்டும் என்று அது விரும்புகிறது.' },
      example: { en: 'Waking up feeling a heavy cloud of depression or suddenly exploding in rage over a spilled cup of coffee. That is the pain-body feeding.', ta: 'ஒரு கனமான மனச்சோர்வு மேகத்துடன் எழுந்திருப்பது அல்லது சிந்திய ஒரு கப் காபிக்காகத் திடீரென்று கோபத்தில் வெடிப்பது. அதுதான் வலி-உடல் உணவருந்துகிறது.' },
      actionStep: { en: 'Next time you feel a heavy negative emotion rising, label it. Say to yourself, "The pain-body has been triggered." By observing it, you cut off its energy supply.', ta: 'அடுத்த முறை கனமான எதிர்மறை உணர்ச்சி எழுவதை நீங்கள் உணரும்போது, அதைப் பெயரிடுங்கள். "வலி-உடல் தூண்டப்பட்டுள்ளது" என்று உங்களுக்கு நீங்களே சொல்லிக்கொள்ளுங்கள். அதைக் கவனிப்பதன் மூலம், அதற்கான ஆற்றல் விநியோகத்தை நீங்கள் துண்டிக்கிறீர்கள்.' },
      reflectionQuestion: { en: 'Do you have moments where a dark, heavy energy takes over your mind and you lash out at the people you love?', ta: 'ஒரு இருண்ட, கனமான ஆற்றல் உங்கள் மனதைக் கட்டுப்பாட்டுக்குள் கொண்டுவந்து, நீங்கள் நேசிக்கும் மனிதர்களை நீங்கள் தாக்கும் தருணங்கள் உங்களுக்கு உண்டா?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'Clock Time vs. Psychological Time', ta: 'கடிகார நேரம் vs உளவியல் நேரம்' },
      explanation: { en: 'Clock time is using the past or future for practical purposes (scheduling a meeting, learning from a past mistake). Psychological time is dwelling on the past (regret) or obsessing over the future (anxiety).', ta: 'கடிகார நேரம் என்பது நடைமுறை நோக்கங்களுக்காகக் கடந்த காலத்தையோ அல்லது எதிர்காலத்தையோ பயன்படுத்துவதாகும் (ஒரு கூட்டத்தைத் திட்டமிடுவது, கடந்த காலத் தவறிலிருந்து கற்றுக்கொள்வது). உளவியல் நேரம் என்பது கடந்த காலத்திலேயே உழல்வது (வருத்தம்) அல்லது எதிர்காலத்தைப் பற்றியே வெறித்தனமாகச் சிந்திப்பது (கவலை).' },
      whyItMatters: { en: 'Clock time is essential for functioning in the world. Psychological time is a disease of the mind that destroys your ability to experience joy in the present.', ta: 'உலகில் இயங்குவதற்குக் கடிகார நேரம் அவசியம். உளவியல் நேரம் என்பது நிகழ்காலத்தில் மகிழ்ச்சியை அனுபவிக்கும் உங்கள் திறனை அழிக்கும் மனதின் நோயாகும்.' },
      example: { en: 'Clock time: Checking your calendar to prepare for a flight tomorrow. Psychological time: Spending the entire evening terrified that the plane might crash tomorrow.', ta: 'கடிகார நேரம்: நாளைப் விமானப் பயணத்திற்குத் தயாராக உங்கள் காலண்டரைச் சரிபார்ப்பது. உளவியல் நேரம்: நாளை விமானம் விபத்துக்குள்ளாகுமோ என்ற பயத்தில் முழு மாலையையும் கழிப்பது.' },
      actionStep: { en: 'Use clock time to plan your tasks for tomorrow. Once the plan is made, completely drop all thoughts of tomorrow and return your attention fully to whatever you are doing right now.', ta: 'நாளைய உங்கள் பணிகளைத் திட்டமிடக் கடிகார நேரத்தைப் பயன்படுத்துங்கள். திட்டம் வகுக்கப்பட்டதும், நாளைய பற்றிய அனைத்து எண்ணங்களையும் முற்றிலுமாகக் கைவிட்டுவிட்டு, இப்போது நீங்கள் என்ன செய்து கொண்டிருக்கிறீர்களோ அதில் முழுமையாக உங்கள் கவனத்தைத் திருப்புங்கள்.' },
      reflectionQuestion: { en: 'Are you polluting your present moments by constantly rehearsing future conversations or replaying past arguments in your head?', ta: 'எதிர்கால உரையாடல்களைத் தொடர்ந்து ஒத்திகை பார்ப்பதன் மூலமோ அல்லது கடந்த கால வாக்குவாதங்களை உங்கள் மனதில் மீண்டும் ஓடவிடுவதன் மூலமோ உங்கள் நிகழ்காலத் தருணங்களை நீங்கள் மாசுபடுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'Inner Body Awareness', ta: 'உள் உடல் விழிப்புணர்வு' },
      explanation: { en: 'One of the fastest ways to enter the Now is to take your attention away from thinking and direct it into the body. Feel the subtle energy field that pervades your physical body.', ta: 'நிகழ்காலத்திற்குள் நுழைவதற்கான அதிவேக வழிகளில் ஒன்று, உங்கள் கவனத்தைச் சிந்தனையிலிருந்து விலக்கி அதை உடலுக்குள் செலுத்துவதாகும். உங்கள் பௌதீக உடலில் பரவியுள்ள நுட்பமான ஆற்றல் புலத்தை உணருங்கள்.' },
      whyItMatters: { en: 'You cannot think and feel your inner body at the same time. Focusing on the aliveness inside your hands, feet, or chest acts as an anchor, pulling you out of the mind and into the present.', ta: 'உங்களால் ஒரே நேரத்தில் சிந்திக்கவும் உங்கள் உள் உடலை உணரவும் முடியாது. உங்கள் கைகள், கால்கள் அல்லது நெஞ்சுக்குள் இருக்கும் உயிரோட்டத்தின் மீது கவனம் செலுத்துவது ஒரு நங்கூரமாகச் செயல்பட்டு, உங்களை மனதிலிருந்து வெளியே இழுத்து நிகழ்காலத்திற்குள் கொண்டு வருகிறது.' },
      example: { en: 'During a stressful meeting, instead of getting lost in anxious thoughts, putting 50% of your attention on feeling the energy vibrating in your hands resting under the table.', ta: 'ஒரு மன அழுத்தமான கூட்டத்தின் போது, கவலையான எண்ணங்களில் தொலைந்து போவதற்குப் பதிலாக, மேசையின் அடியில் ஓய்வெடுக்கும் உங்கள் கைகளில் அதிரும் ஆற்றலை உணர்வதில் உங்கள் கவனத்தின் 50%-ஐச் செலுத்துவது.' },
      actionStep: { en: 'Right now, close your eyes and ask yourself: "Can I feel the life inside my hands? Can I feel my feet?" Feel the tingling energy for 60 seconds.', ta: 'இப்போதே, கண்களை மூடிக்கொண்டு உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "என் கைகளுக்குள் இருக்கும் உயிரை என்னால் உணர முடிகிறதா? என் பாதங்களை என்னால் உணர முடிகிறதா?" 60 வினாடிகளுக்கு அந்தச் கூச்ச உணர்வை உணருங்கள்.' },
      reflectionQuestion: { en: 'Do you treat your body merely as a vehicle to carry your head (your mind) around?', ta: 'உங்கள் உடலை வெறும் உங்களின் தலையை (உங்கள் மனதை) சுமந்து செல்லும் வாகனமாக மட்டுமே நீங்கள் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'Waiting is a State of Mind', ta: 'காத்திருப்பு என்பது ஒரு மனநிலை' },
      explanation: { en: 'There are two types of waiting. Small-scale waiting (in line at the post office) and large-scale waiting (waiting for the next vacation, a better job, or true love). Both imply that the present is not good enough.', ta: 'காத்திருப்பில் இரண்டு வகைகள் உள்ளன. சிறிய அளவிலான காத்திருப்பு (தபால் நிலையத்தில் வரிசையில் நிற்பது) மற்றும் பெரிய அளவிலான காத்திருப்பு (அடுத்த விடுமுறை, சிறந்த வேலை அல்லது உண்மையான காதலுக்காகக் காத்திருப்பது). இரண்டுமே நிகழ்காலம் போதுமானதாக இல்லை என்பதைக் குறிக்கின்றன.' },
      whyItMatters: { en: 'When you are waiting, you are unconsciously denying the Now. You are making the future more important than the present, which guarantees you will never be fulfilled, because the future never arrives.', ta: 'நீங்கள் காத்திருக்கும்போது, நீங்கள் அறியாமலேயே நிகழ்காலத்தை மறுக்கிறீர்கள். நீங்கள் நிகழ்காலத்தை விட எதிர்காலத்தை மிக முக்கியமாக்குகிறீர்கள், இது நீங்கள் ஒருபோதும் திருப்தியடைய மாட்டீர்கள் என்பதற்கு உத்தரவாதம் அளிக்கிறது, ஏனென்றால் எதிர்காலம் ஒருபோதும் வருவதில்லை.' },
      example: { en: 'Standing in a grocery line fuming with impatience because you want to be home (rejecting the Now) vs. standing in the same line, feeling your breathing and observing your surroundings (accepting the Now).', ta: 'வீட்டிற்குச் செல்ல வேண்டும் என்பதற்காக மளிகைக் கடை வரிசையில் பொறுமையின்றிப் புகைந்துகொண்டு நிற்பது (நிகழ்காலத்தை நிராகரிப்பது) vs. அதே வரிசையில் நின்று, உங்களின் சுவாசத்தை உணர்ந்து உங்களைச் சுற்றியுள்ளவற்றைக் கவனிப்பது (நிகழ்காலத்தை ஏற்றுக்கொள்வது).' },
      actionStep: { en: 'The next time you are forced to wait (in traffic or in a line), do not pull out your phone. Use it as an opportunity to practice deep presence and observe the world.', ta: 'அடுத்த முறை நீங்கள் காத்திருக்க வேண்டிய கட்டாயம் ஏற்படும்போது (போக்குவரத்தில் அல்லது வரிசையில்), உங்கள் தொலைபேசியை வெளியே எடுக்காதீர்கள். ஆழமான இருத்தலைப் பயிற்சி செய்வதற்கும் உலகைக் கவனிப்பதற்கும் இதை ஒரு வாய்ப்பாகப் பயன்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you treating the present moment merely as a stepping stone to get to a "better" future?', ta: '"சிறந்த" எதிர்காலத்திற்குச் செல்வதற்கான ஒரு படிக்கல்லாக மட்டுமே நிகழ்காலத் தருணத்தை நீங்கள் கருதுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Surrender, Don\'t Resign', ta: 'சரணடையுங்கள், ராஜினாமா செய்யாதீர்கள்' },
      explanation: { en: 'Surrender is not about weakness or giving up. It is the simple but profound wisdom of yielding to rather than opposing the flow of life. Resignation is a negative, defeated state; surrender is active and peaceful.', ta: 'சரணடைதல் என்பது பலவீனம் அல்லது விட்டுவிடுவது பற்றியதல்ல. இது வாழ்க்கையின் ஓட்டத்தை எதிர்ப்பதை விட அதற்கு விட்டுக் கொடுக்கும் எளிமையான ஆனால் ஆழமான ஞானமாகும். ராஜினாமா (Resignation) என்பது ஒரு எதிர்மறையான, தோற்கடிக்கப்பட்ட நிலை; சரணடைதல் சுறுசுறுப்பானது மற்றும் அமைதியானது.' },
      whyItMatters: { en: 'When you surrender to what is, your mind stops fighting reality. From that place of deep inner peace, your actions become much more effective and powerful.', ta: 'உள்ளதற்கு நீங்கள் சரணடையும்போது, உங்கள் மனம் யதார்த்தத்துடன் போராடுவதை நிறுத்துகிறது. அந்த ஆழமான உள் அமைதியின் இடத்திலிருந்து, உங்களின் செயல்கள் மிகவும் பயனுள்ளதாகவும் சக்திவாய்ந்ததாகவும் மாறும்.' },
      example: { en: 'Resignation: "I lost my job, my life is ruined, there\'s no point in trying." Surrender: "I lost my job. I accept this reality completely. Now, what is my best next step?"', ta: 'ராஜினாமா: "எனக்கு வேலை போய்விட்டது, என் வாழ்க்கை சீரழிந்துவிட்டது, முயற்சிப்பதில் அர்த்தமில்லை." சரணடைதல்: "எனக்கு வேலை போய்விட்டது. இந்த யதார்த்தத்தை நான் முழுமையாக ஏற்றுக்கொள்கிறேன். இப்போது, எனது சிறந்த அடுத்தக்கட்ட நடவடிக்கை என்ன?"' },
      actionStep: { en: 'Think of a challenging situation you are facing. Say aloud, "I completely surrender to the reality that this is happening." Notice how the tension drops in your body.', ta: 'நீங்கள் எதிர்கொள்ளும் சவாலான சூழ்நிலையைப் பற்றிச் சிந்தியுங்கள். "இது நடக்கிறது என்ற யதார்த்தத்திற்கு நான் முழுமையாகச் சரணடைகிறேன்" என்று சத்தமாகச் சொல்லுங்கள். உங்கள் உடலில் உள்ள பதற்றம் எப்படிக் குறைகிறது என்பதைக் கவனியுங்கள்.' },
      reflectionQuestion: { en: 'Are you confusing inner surrender with outward inaction?', ta: 'வெளிப்புறச் செயலற்ற தன்மையுடன் உள் சரணடைதலை நீங்கள் குழப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'The Source of All Creativity', ta: 'அனைத்துப் படைப்பாற்றலின் ஆதாரம்' },
      explanation: { en: 'True intelligence operates silently. Stillness is where creativity and solutions to problems are found. The mind can only rearrange old information; true novelty comes from the stillness beneath the mind.', ta: 'உண்மையான நுண்ணறிவு அமைதியாகச் செயல்படுகிறது. அமைதியில்தான் படைப்பாற்றலும் பிரச்சினைகளுக்கான தீர்வுகளும் காணப்படுகின்றன. மனதால் பழைய தகவல்களை மட்டுமே மறுசீரமைக்க முடியும்; உண்மையான புதுமை மனதிற்கு அடியில் உள்ள அமைதியிலிருந்தே வருகிறது.' },
      whyItMatters: { en: 'If you try to solve a complex problem by constantly thinking about it, you will just go in stressful circles. Stepping into mental stillness allows sudden inspiration to arise.', ta: 'ஒரு சிக்கலான பிரச்சினையைப் பற்றித் தொடர்ந்து சிந்திப்பதன் மூலம் அதைத் தீர்க்க நீங்கள் முயற்சித்தால், நீங்கள் மன அழுத்த வட்டங்களுக்குள்ளேயே செல்வீர்கள். மன அமைதிக்குள் நுழைவது திடீர் உத்வேகம் எழ அனுமதிக்கிறது.' },
      example: { en: 'A writer staring at a blank page getting frustrated (mind), vs. going for a silent walk without thinking about the book, and suddenly the perfect opening sentence drops into their head (stillness).', ta: 'வெற்றுப் பக்கத்தைப் பார்த்து விரக்தியடையும் (மனம்) ஒரு எழுத்தாளர், vs. புத்தகத்தைப் பற்றிச் சிந்திக்காமல் அமைதியாக நடைப்பயிற்சி மேற்கொள்வது, அப்போது திடீரென்று சரியான தொடக்க வாக்கியம் அவர்களின் தலைக்குள் விழுகிறது (அமைதி).' },
      actionStep: { en: 'When stuck on a problem today, stop thinking about it. Shift your focus to your breathing for 5 minutes. The solution will often present itself when the mind is quiet.', ta: 'இன்று ஒரு பிரச்சினையில் சிக்கிக்கொண்டால், அதைப் பற்றிச் சிந்திப்பதை நிறுத்துங்கள். 5 நிமிடங்களுக்கு உங்கள் கவனத்தை உங்கள் சுவாசத்திற்கு மாற்றுங்கள். மனம் அமைதியாக இருக்கும்போது தீர்வு பெரும்பாலும் தன்னைத்தானே வெளிப்படுத்தும்.' },
      reflectionQuestion: { en: 'Do you believe that thinking harder is the only way to find answers?', ta: 'கடினமாகச் சிந்திப்பது மட்டுமே பதில்களைக் கண்டறிவதற்கான ஒரே வழி என்று நீங்கள் நம்புகிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Relationship as Spiritual Practice', ta: 'ஆன்மீகப் பயிற்சியாக உறவு' },
      explanation: { en: 'Relationships are not here to make you happy; they are here to make you conscious. They act as mirrors, reflecting back your own ego and your own pain-body.', ta: 'உங்களை மகிழ்ச்சியடையச் செய்ய உறவுகள் இங்கே இல்லை; அவை உங்களை விழிப்புடன் ஆக்குவதற்காகவே இங்கே உள்ளன. அவை கண்ணாடிகளாகச் செயல்படுகின்றன, உங்களின் சொந்த அகந்தையையும் உங்களின் சொந்த வலி-உடலையும் பிரதிபலிக்கின்றன.' },
      whyItMatters: { en: 'If you expect your partner to complete you or make you happy, you will inevitably be disappointed and start blaming them. Using relationships to practice presence transforms conflict into growth.', ta: 'உங்கள் கூட்டாளர் உங்களை முழுமையாக்குவார் அல்லது உங்களை மகிழ்ச்சியடையச் செய்வார் என்று நீங்கள் எதிர்பார்த்தால், நீங்கள் தவிர்க்க முடியாமல் ஏமாற்றமடைந்து அவர்களைக் குறை கூறத் தொடங்குவீர்கள். இருத்தலைப் பயிற்சி செய்ய உறவுகளைப் பயன்படுத்துவது மோதலை வளர்ச்சியாக மாற்றுகிறது.' },
      example: { en: 'Instead of aggressively reacting when your partner criticizes you, simply observing the intense defensiveness rising in your body without acting on it.', ta: 'உங்கள் கூட்டாளர் உங்களை விமர்சிக்கும்போது ஆக்ரோஷமாகப் பதிலளிப்பதற்குப் பதிலாக, உங்கள் உடலில் எழும் தீவிரத் தற்காப்புணர்வைக் கவனித்து அதன்படிச் செயல்படாமல் இருப்பது.' },
      actionStep: { en: 'The next time your partner or a friend triggers you, do not speak for 5 seconds. Use those 5 seconds to feel the emotion in your body before you respond.', ta: 'அடுத்த முறை உங்கள் கூட்டாளரோ அல்லது நண்பரோ உங்களைத் தூண்டும்போது, 5 வினாடிகளுக்குப் பேச வேண்டாம். நீங்கள் பதிலளிப்பதற்கு முன் உங்கள் உடலில் உள்ள உணர்ச்சியை உணர அந்த 5 வினாடிகளைப் பயன்படுத்தவும்.' },
      reflectionQuestion: { en: 'Are you using your romantic relationships to escape from your own inner emptiness?', ta: 'உங்களின் சொந்த உள் வெறுமையிலிருந்து தப்பிக்க உங்களின் காதல் உறவுகளைப் பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'Forgiveness of the Present', ta: 'நிகழ்காலத்தை மன்னித்தல்' },
      explanation: { en: 'True forgiveness is not just about the past; it is about forgiving the present moment for being the way it is. It is relinquishing the grievance against reality.', ta: 'உண்மையான மன்னிப்பு என்பது கடந்த காலத்தைப் பற்றியது மட்டுமல்ல; அது நிகழ்காலத் தருணம் எப்படி இருக்கிறதோ அதற்காக அதை மன்னிப்பதாகும். இது யதார்த்தத்திற்கு எதிரான குறையைக் கைவிடுவதாகும்.' },
      whyItMatters: { en: 'Holding onto grievances is a primary fuel for the ego. By dropping the inner argument with "what is," you instantly liberate yourself from immense psychological weight.', ta: 'குறைகளைப் பிடித்துக்கொள்வது அகந்தைக்கான முதன்மை எரிபொருளாகும். "உள்ளதோடு" உள் விவாதத்தைக் கைவிடுவதன் மூலம், அபரிமிதமான உளவியல் எடையிலிருந்து உங்களை நீங்களே உடனடியாக விடுவித்துக் கொள்கிறீர்கள்.' },
      example: { en: 'Forgiving the fact that it is raining heavily on your long-planned wedding day. Dropping the mental story of "this shouldn\'t be happening" and just experiencing the rain.', ta: 'நீங்கள் நீண்ட நாட்களாகத் திட்டமிட்ட திருமணத்தன்று பலத்த மழை பெய்கிறது என்ற உண்மையை மன்னித்தல். "இது நடந்திருக்கக் கூடாது" என்ற மனக்கதையைக் கைவிட்டு மழையை வெறுமனே அனுபவிப்பது.' },
      actionStep: { en: 'Identify one aspect of your life today that you are silently arguing against (e.g., the weather, your physical pain, someone\'s behavior). Say, "I forgive this moment for being exactly as it is."', ta: 'இன்று உங்கள் வாழ்க்கையின் எந்த ஒரு அம்சத்தை நீங்கள் அமைதியாக விவாதிக்கிறீர்கள் என்பதைக் கண்டறியவும் (எ.கா., வானிலை, உங்கள் உடல் வலி, ஒருவரின் நடத்தை). "இந்தத் தருணம் சரியாக எப்படி இருக்கிறதோ அதற்காக நான் இதை மன்னிக்கிறேன்" என்று சொல்லுங்கள்.' },
      reflectionQuestion: { en: 'Do you carry a subtle underlying resentment against life itself when things don\'t go your way?', ta: 'விஷயங்கள் உங்கள் வழியில் செல்லாதபோது வாழ்க்கை மீதே ஒரு நுட்பமான அடிப்படை மனக்கசப்பை நீங்கள் சுமக்கிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'Moving from Reaction to Action', ta: 'எதிர்வினையிலிருந்து செயலுக்கு நகர்தல்' },
      explanation: { en: 'Reactions are unconscious, automatic responses dictated by your past conditioning and the ego. Actions are conscious choices made from a state of presence.', ta: 'எதிர்வினைகள் என்பவை உங்களின் கடந்த காலக் கண்டிஷனிங் மற்றும் அகந்தையால் கட்டளையிடப்பட்ட மயக்கமான, தானியங்கிப் பதில்கள். செயல்கள் என்பவை இருத்தல் நிலையிலிருந்து எடுக்கப்படும் நனவான தேர்வுகள்.' },
      whyItMatters: { en: 'When you react, you are a puppet to your emotions. When you take action from the Now, you bring intelligence and peace into the situation, no matter how chaotic it is.', ta: 'நீங்கள் எதிர்வினையாற்றும்போது, நீங்கள் உங்கள் உணர்ச்சிகளுக்கு ஒரு கைப்பாவை. நீங்கள் நிகழ்காலத்திலிருந்து நடவடிக்கை எடுக்கும்போது, அது எவ்வளவு குழப்பமாக இருந்தாலும், அந்தச் சூழ்நிலையில் நீங்கள் நுண்ணறிவையும் அமைதியையும் கொண்டு வருகிறீர்கள்.' },
      example: { en: 'Reaction: Yelling back at a rude customer immediately. Action: Pausing, taking a breath, observing their pain, and responding with firm but calm boundaries.', ta: 'எதிர்வினை: முரட்டுத்தனமான வாடிக்கையாளரிடம் உடனடியாகத் திரும்பக் கத்துவது. செயல்: இடைநிறுத்தி, மூச்சு விட்டு, அவர்களின் வலியைக் கவனித்து, உறுதியான ஆனால் அமைதியான எல்லைகளுடன் பதிலளிப்பது.' },
      actionStep: { en: 'Try to catch one automatic reaction today (like sighing when an email arrives). Pause, breathe, and consciously choose how to respond instead.', ta: 'இன்று ஒரு தானியங்கி எதிர்வினையைப் பிடிக்க முயற்சிக்கவும் (ஒரு மின்னஞ்சல் வரும்போது பெருமூச்சு விடுவது போல). இடைநிறுத்துங்கள், மூச்சு விடுங்கள், அதற்குப் பதிலாக எப்படிப் பதிலளிக்க வேண்டும் என்பதைப் பிரக்ஞையுடன் தேர்வு செய்யுங்கள்.' },
      reflectionQuestion: { en: 'How much of your day is spent acting consciously, versus simply playing out automatic conditioned programs?', ta: 'தானியங்கி முறையில் நிபந்தனைக்குட்பட்ட நிரல்களைச் செயல்படுத்துவதற்குப் பதிலாக, உங்கள் நாளின் எவ்வளவு நேரம் பிரக்ஞையுடன் செயல்படச் செலவிடப்படுகிறது?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'The Joy of Being', ta: 'இருத்தலின் மகிழ்ச்சி' },
      explanation: { en: 'Happiness depends on external conditions being perceived as positive. Joy is uncaused and arises from within. It is the joy of Being, independent of what happens.', ta: 'வெளிப்புற நிலைமைகள் நேர்மறையானதாக உணரப்படுவதைப் பொறுத்தே மகிழ்ச்சி அமைகிறது. ஆனந்தம் (Joy) காரணமற்றது மற்றும் உள்ளிருந்து எழுகிறது. இது என்ன நடந்தாலும் அதைச் சாராத இருத்தலின் ஆனந்தமாகும்.' },
      whyItMatters: { en: 'If you chase happiness through money, relationships, or success, you will always live in fear of losing those things. The joy of Being is permanent and cannot be taken away by circumstances.', ta: 'பணம், உறவுகள் அல்லது வெற்றியின் மூலம் நீங்கள் மகிழ்ச்சியைத் துரத்தினால், அந்த விஷயங்களை இழந்துவிடுவோமோ என்ற பயத்திலேயே நீங்கள் எப்போதும் வாழ்வீர்கள். இருத்தலின் ஆனந்தம் நிரந்தரமானது மற்றும் சூழ்நிலைகளால் அதை எடுத்துச் செல்ல முடியாது.' },
      example: { en: 'Sitting quietly on a park bench with no money in your pocket, yet feeling a profound, overflowing sense of peace and aliveness just because you exist.', ta: 'பையில் பணம் இல்லாமல் பூங்கா பெஞ்சில் அமைதியாக உட்கார்ந்திருந்தாலும், நீங்கள் இருப்பதாலேயே ஒரு ஆழமான, நிரம்பிவழியும் அமைதியையும் உயிரோட்டத்தையும் உணர்வது.' },
      actionStep: { en: 'Stop seeking a reason to be happy today. Just sit for two minutes and appreciate the sheer miracle that you are alive and breathing in this exact moment.', ta: 'இன்று மகிழ்ச்சியாக இருக்க ஒரு காரணத்தைத் தேடுவதை நிறுத்துங்கள். இரண்டு நிமிடங்கள் அமர்ந்து, இந்தச் சரியான தருணத்தில் நீங்கள் உயிருடன் இருப்பதும் சுவாசிப்பதும் ஒரு அற்புதம் என்பதைப் பாராட்டுங்கள்.' },
      reflectionQuestion: { en: 'Are you delaying your joy until some future event occurs ("I will be happy when I get that promotion")?', ta: 'சில எதிர்கால நிகழ்வுகள் நிகழும் வரை உங்கள் மகிழ்ச்சியைத் தாமதப்படுத்துகிறீர்களா ("அந்தப் பதவி உயர்வு கிடைக்கும்போது நான் மகிழ்ச்சியாக இருப்பேன்")?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'Accepting the Cycle of Life', ta: 'வாழ்க்கைச் சுழற்சியை ஏற்றுக்கொள்வது' },
      explanation: { en: 'All things in the physical world are subject to the law of impermanence. There are cycles of success and failure, growth and decay. You cannot have the upward cycle without the downward cycle.', ta: 'பௌதீக உலகில் உள்ள அனைத்தும் நிலையற்ற தன்மை என்ற விதிக்கு உட்பட்டவை. வெற்றி மற்றும் தோல்வி, வளர்ச்சி மற்றும் சிதைவு ஆகிய சுழற்சிகள் உள்ளன. கீழ்நோக்கிய சுழற்சி இல்லாமல் மேல்நோக்கிய சுழற்சி உங்களிடம் இருக்க முடியாது.' },
      whyItMatters: { en: 'Suffering occurs when we demand that things permanently stay in the upward, growth phase. Accepting the downward phases (loss, failure, illness) as natural parts of life brings deep peace.', ta: 'விஷயங்கள் நிரந்தரமாக மேல்நோக்கிய, வளர்ச்சிக் கட்டத்திலேயே இருக்க வேண்டும் என்று நாம் கோரும்போது துன்பம் ஏற்படுகிறது. கீழ்நோக்கிய கட்டங்களை (இழப்பு, தோல்வி, நோய்) வாழ்க்கையின் இயற்கையான பகுதியாக ஏற்றுக்கொள்வது ஆழமான அமைதியைத் தருகிறது.' },
      example: { en: 'Accepting that a business venture naturally ran its course and failed, rather than defining yourself as a "failure" and resisting the end of that cycle.', ta: 'உங்களை ஒரு "தோல்வியாளர்" என்று வரையறுத்து அந்தச் சுழற்சியின் முடிவை எதிர்ப்பதற்குப் பதிலாக, ஒரு தொழில்முயற்சி இயற்கையாகவே அதன் போக்கில் சென்று தோல்வியடைந்தது என்பதை ஏற்றுக்கொள்வது.' },
      actionStep: { en: 'Identify one thing in your life that is currently ending or decaying (a relationship, a job, a phase of life). Practice accepting its end without judgment.', ta: 'தற்போது உங்கள் வாழ்க்கையில் முடிவடையும் அல்லது சிதைந்து கொண்டிருக்கும் ஒரு விஷயத்தைக் கண்டறியவும் (ஒரு உறவு, ஒரு வேலை, வாழ்க்கையின் ஒரு கட்டம்). எந்தத் தீர்ப்பும் இல்லாமல் அதன் முடிவை ஏற்றுக்கொள்ளப் பழகுங்கள்.' },
      reflectionQuestion: { en: 'Do you attach your sense of self-worth exclusively to the "growth" cycles of your life?', ta: 'உங்களின் சுய மதிப்பு உணர்வை உங்கள் வாழ்க்கையின் "வளர்ச்சி" சுழற்சிகளுடன் மட்டுமே இணைக்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Dying Before You Die', ta: 'நீங்கள் இறக்கும் முன் இறத்தல்' },
      explanation: { en: 'To "die before you die" means to strip away all the false layers of identity (your job, your history, your ego) before physical death forces you to do so.', ta: 'பௌதீக மரணம் உங்களை அப்படிச் செய்ய வற்புறுத்துவதற்கு முன்பு, அடையாளத்தின் அனைத்துத் தவறான அடுக்குகளையும் (உங்கள் வேலை, உங்கள் வரலாறு, உங்கள் அகந்தை) உரிப்பதே "நீங்கள் இறக்கும் முன் இறத்தல்" என்பதாகும்.' },
      whyItMatters: { en: 'If you cling to your egoic identity, the thought of death is terrifying. If you realize you are the formless consciousness underneath, the fear of death vanishes, and you can truly live.', ta: 'உங்கள் அகந்தை அடையாளத்தை நீங்கள் பற்றிக்கொண்டால், மரணம் பற்றிய சிந்தனை பயமுறுத்துகிறது. நீங்கள் அடியில் உள்ள உருவமற்ற விழிப்புணர்வு என்பதை நீங்கள் உணர்ந்தால், மரண பயம் மறைந்து, உங்களால் உண்மையிலேயே வாழ முடியும்.' },
      example: { en: 'Realizing that if you lose your wealth, your title, and your reputation, the core of who you are (the watcher) remains completely untouched.', ta: 'உங்கள் செல்வம், உங்கள் பட்டம் மற்றும் உங்கள் நற்பெயரை நீங்கள் இழந்தாலும், நீங்கள் யார் என்ற மையப்பகுதி (பார்வையாளர்) முற்றிலும் தீண்டப்படாமல் இருப்பதாய் உணர்வது.' },
      actionStep: { en: 'Ask yourself: "If I lost my job, my possessions, and my social status today, who would I be?" Rest in the feeling of that formless presence.', ta: 'உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்: "இன்று நான் என் வேலை, என் உடைமைகள் மற்றும் என் சமூக அந்தஸ்தை இழந்தால், நான் யாராக இருப்பேன்?" அந்த உருவமற்ற இருப்பின் உணர்வில் ஓய்வெடுங்கள்.' },
      reflectionQuestion: { en: 'Are you terrified of losing your external labels because you don\'t know who you are without them?', ta: 'உங்களின் வெளிப்புற அடையாளங்களை இழக்க நீங்கள் பயப்படுகிறீர்களா, ஏனென்றால் அவை இல்லாமல் நீங்கள் யார் என்று உங்களுக்குத் தெரியாதா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'The Meaning of Compassion', ta: 'பச்சாதாபத்தின் அர்த்தம்' },
      explanation: { en: 'True compassion is recognizing the shared bond of mortality and the shared essence of the formless Being in both yourself and another person, simultaneously.', ta: 'உண்மையான பச்சாதாபம் (Compassion) என்பது உங்களிலும் மற்றொரு நபரிடமும் ஒரே நேரத்தில் உள்ள இறப்பின் பகிரப்பட்ட பிணைப்பையும், உருவமற்ற இருப்பின் பகிரப்பட்ட சாரத்தையும் அங்கீகரிப்பதாகும்.' },
      whyItMatters: { en: 'Without presence, "compassion" is often just pity or egoic superiority. True compassion bridges the gap between you and others because you see through the illusion of separation.', ta: 'இருத்தல் இல்லாமல், "பச்சாதாபம்" என்பது பெரும்பாலும் பரிதாபம் அல்லது அகந்தையின் மேலாதிக்கம் மட்டுமே. பிரிவினை என்ற மாயையை நீங்கள் ஊடுருவிப் பார்ப்பதால், உண்மையான பச்சாதாபம் உங்களுக்கும் மற்றவர்களுக்கும் இடையிலான இடைவெளியைக் குறைக்கிறது.' },
      example: { en: 'Looking at a homeless person and not just feeling sorry for their physical situation, but actively sensing the exact same divine consciousness in them that resides in you.', ta: 'வீடற்ற ஒருவரைப் பார்த்து அவர்களின் உடல்நிலைக்காகப் பரிதாபப்படுவதோடு மட்டுமல்லாமல், உங்களுக்குள் வசிக்கும் அதே தெய்வீக உணர்வை அவர்களிடமும் சுறுசுறுப்பாக உணர்வது.' },
      actionStep: { en: 'Make eye contact with a stranger today. For one brief second, silently acknowledge that the exact same awareness looking out of their eyes is looking out of yours.', ta: 'இன்று ஒரு அந்நியருடன் கண் தொடர்பு கொள்ளுங்கள். ஒரு சிறிய நொடிக்கு, அவர்களின் கண்களில் இருந்து பார்க்கும் அதே விழிப்புணர்வுதான் உங்கள் கண்களில் இருந்தும் பார்க்கிறது என்பதை அமைதியாக ஏற்றுக்கொள்ளுங்கள்.' },
      reflectionQuestion: { en: 'Does your empathy usually come with a subtle sense of feeling superior to the person you are pitying?', ta: 'நீங்கள் பரிதாபப்படும் நபரை விட மேலானவர் என்ற நுட்பமான உணர்வுடன் உங்கள் பச்சாதாபம் பொதுவாக வருகிறதா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'Withdrawal of Attention from the Mind', ta: 'மனதிலிருந்து கவனத்தைத் திரும்பப் பெறுதல்' },
      explanation: { en: 'You cannot fight the mind to stop thinking; that just creates more mental conflict. Instead, you simply withdraw your attention from the mind and place it on the Now.', ta: 'சிந்திப்பதை நிறுத்த உங்களால் மனதுடன் போராட முடியாது; அது அதிக மன மோதலையே உருவாக்குகிறது. அதற்குப் பதிலாக, உங்கள் கவனத்தை மனதிலிருந்து விலக்கிக் கொண்டு நிகழ்காலத்தில் வையுங்கள்.' },
      whyItMatters: { en: 'The mind operates on the energy of your attention. When you stop giving it attention, the compulsive stream of thought naturally slows down and stops on its own.', ta: 'உங்கள் கவனத்தின் ஆற்றலில்தான் மனம் செயல்படுகிறது. அதற்குக் கவனம் செலுத்துவதை நீங்கள் நிறுத்தும்போது, கட்டாய எண்ண நீரோட்டம் இயற்கையாகவே மெதுவாகித் தானாகவே நின்றுவிடும்.' },
      example: { en: 'Instead of thinking "I need to stop worrying," shifting your entire focus to the sensation of the wind on your face or the sound of a distant bird.', ta: '"நான் கவலைப்படுவதை நிறுத்த வேண்டும்" என்று நினைப்பதற்குப் பதிலாக, உங்கள் முழு கவனத்தையும் உங்கள் முகத்தில் வீசும் காற்றின் உணர்வு அல்லது தூரத்துப் பறவையின் சத்தத்திற்கு மாற்றுவது.' },
      actionStep: { en: 'Look around the room right now. Pick one object. Give it your absolute, 100% attention for 30 seconds without naming it or analyzing it. Just look.', ta: 'இப்போதே அறையைச் சுற்றிப் பாருங்கள். ஒரு பொருளைத் தேர்ந்தெடுக்கவும். அதற்குப் பெயரிடாமல் அல்லது பகுப்பாய்வு செய்யாமல் 30 வினாடிகளுக்கு உங்களின் முழுமையான, 100% கவனத்தை அதற்குக் கொடுங்கள். வெறுமனே பாருங்கள்.' },
      reflectionQuestion: { en: 'Are you constantly feeding your anxiety by giving it your undivided attention?', ta: 'உங்களின் பிரிக்கப்படாத கவனத்தை அதற்குக் கொடுப்பதன் மூலம் உங்களின் கவலைக்குத் தொடர்ந்து உணவளிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'The Insanity of the Normal Mind', ta: 'சாதாரண மனதின் பைத்தியக்காரத்தனம்' },
      explanation: { en: 'What society considers "normal" is actually a state of mild, chronic insanity. The constant mental chatter, the obsession with the past and future, and the need for conflict are highly dysfunctional.', ta: 'சமூகம் எதை "சாதாரணமானது" என்று கருதுகிறதோ அது உண்மையில் ஒரு லேசான, நாள்பட்ட பைத்தியக்கார நிலை. தொடர்ச்சியான மன அரட்டை, கடந்த காலம் மற்றும் எதிர்காலத்தின் மீதான வெறி, மற்றும் மோதலுக்கான தேவை ஆகியவை மிகவும் செயல்படாதவை.' },
      whyItMatters: { en: 'Realizing that the "normal" state of humanity is largely unconscious frees you from the pressure to conform. You don\'t need to be like everyone else; you need to wake up.', ta: 'மனிதகுலத்தின் "சாதாரண" நிலை பெருமளவு மயக்கமானது என்பதை உணர்ந்துகொள்வது உங்களை அதற்கேற்ப நடக்க வேண்டிய அழுத்தத்திலிருந்து விடுவிக்கிறது. நீங்கள் மற்றவர்களைப் போல இருக்க வேண்டியதில்லை; நீங்கள் விழித்தெழ வேண்டும்.' },
      example: { en: 'Millions of people spending their evenings yelling at the television over politics, completely unaware of the beautiful sunset happening outside their window.', ta: 'தங்கள் ஜன்னலுக்கு வெளியே நடக்கும் அழகான சூரிய அஸ்தமனத்தை முற்றிலுமாக அறியாமல், மில்லியன் கணக்கான மனிதர்கள் தங்கள் மாலைப் பொழுதை அரசியலுக்காகத் தொலைக்காட்சியைப் பார்த்துக் கத்துவதிலேயே கழிக்கிறார்கள்.' },
      actionStep: { en: 'Observe a crowd of people today (at a cafe or on the street). Notice how many are lost in thought or staring at screens, completely disconnected from the present moment.', ta: 'இன்று மக்கள் கூட்டத்தைக் கவனியுங்கள் (கபேயில் அல்லது தெருவில்). எத்தனை பேர் சிந்தனையில் தொலைந்து போயிருக்கிறார்கள் அல்லது நிகழ்காலத் தருணத்திலிருந்து முற்றிலுமாகத் துண்டிக்கப்பட்டுத் திரைகளையே உற்றுப் பார்த்துக் கொண்டிருக்கிறார்கள் என்பதைக் கவனியுங்கள்.' },
      reflectionQuestion: { en: 'Are you striving to be "normal" in a world that is deeply stressed, anxious, and unhappy?', ta: 'ஆழமான மன அழுத்தம், கவலை மற்றும் மகிழ்ச்சியற்ற ஒரு உலகில் நீங்கள் "சாதாரணமாக" இருக்க முயற்சிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'The Ultimate Freedom', ta: 'இறுதி சுதந்திரம்' },
      explanation: { en: 'True freedom is not getting everything you want in the external world. It is the realization that your inner state of peace is not dependent on anything external happening or not happening.', ta: 'உண்மையான சுதந்திரம் என்பது வெளி உலகில் நீங்கள் விரும்பும் அனைத்தையும் பெறுவது அல்ல. உங்களின் உள் அமைதிநிலை எதுவும் வெளியில் நடப்பதையோ அல்லது நடக்காமல் இருப்பதையோ சார்ந்திருக்கவில்லை என்பதை உணர்வதே ஆகும்.' },
      whyItMatters: { en: 'As long as you rely on the world to make you happy, you are a slave to it. Finding the power of Now within yourself makes you untouchable by circumstance.', ta: 'உலகம் உங்களை மகிழ்ச்சியடையச் செய்யும் என்று நீங்கள் நம்பியிருக்கும் வரை, நீங்கள் அதற்கு அடிமை. நிகழ்காலத்தின் சக்தியை உங்களுக்குள் கண்டறிவது சூழ்நிலைகளால் உங்களைத் தொட முடியாதவராக ஆக்குகிறது.' },
      example: { en: 'Facing a severe financial crisis or a health scare, and while taking practical steps to address it, maintaining a deep, unshakable inner stillness.', ta: 'ஒரு கடுமையான நிதி நெருக்கடி அல்லது உடல்நலப் பயத்தை எதிர்கொள்ளும்போது, அதைச் சமாளிக்க நடைமுறை நடவடிக்கைகளை எடுக்கும் அதே வேளையில், ஆழமான, அசைக்க முடியாத உள் அமைதியைப் பேணுவது.' },
      actionStep: { en: 'State aloud: "I give up the demand that the next moment should contain what this one does not." Rest in the completeness of right now.', ta: 'சத்தமாகக் கூறுங்கள்: "இந்தத் தருணத்தில் இல்லாத ஒன்று அடுத்தத் தருணத்தில் இருக்க வேண்டும் என்ற கோரிக்கையை நான் கைவிடுகிறேன்." இப்போதைய இந்த முழுமையில் ஓய்வெடுங்கள்.' },
      reflectionQuestion: { en: 'Are you secretly a hostage to your life circumstances, constantly demanding they change so you can finally relax?', ta: 'நீங்கள் இறுதியாக ஓய்வெடுக்க வேண்டி அவை மாற வேண்டும் என்று தொடர்ந்து கோரிக்கொண்டு, உங்கள் வாழ்க்கைச் சூழ்நிலைகளுக்கு நீங்கள் ரகசியமாகப் பணயக்கைதியாக இருக்கிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The Power of Now: A Guide to Spiritual Enlightenment' });
    if (existing) {
      console.log('The Power of Now already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The Power of Now: A Guide to Spiritual Enlightenment' });
    }
    
    await WisdomBook.create(powerOfNowBook);
    console.log('The Power of Now added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
