import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from './src/models/WisdomBook';
import { connectDB } from './src/config/db';

dotenv.config();

const seedData = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
    categories: ["Productivity", "Habits", "Psychology"],
    themes: [
      { en: "Compounding Returns", ta: "சிறு முயற்சிகளின் பெரும் பலன்" },
      { en: "Systems over Goals", ta: "இலக்கை விட செயல்முறை முக்கியம்" }
    ],
    overview: {
      en: "Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      ta: "அணு அளவிலான பழக்கங்கள் எப்படி பெரிய மாற்றங்களை உருவாக்குகின்றன என்பதை இந்தப் புத்தகம் விளக்குகிறது. தினமும் 1% முன்னேற்றம் அடைவதன் மூலம், நமது வாழ்க்கை எப்படி தலைகீழாக மாறப்போகிறது என்பதை ஜேம்ஸ் கிளியர் மிகத் தெளிவாக விளக்குகிறார்."
    },
    topQuotes: [
      { en: "You do not rise to the level of your goals. You fall to the level of your systems.", ta: "நீங்கள் உங்கள் இலக்குகளின் உயரத்திற்கு செல்வதில்லை, மாறாக உங்கள் பழக்கங்களின் தரத்திற்கு கீழிறங்குகிறீர்கள்." },
      { en: "Habits are the compound interest of self-improvement.", ta: "பழக்கங்கள் என்பவை சுய முன்னேற்றத்தின் கூட்டு வட்டி ஆகும்." }
    ],
    lessons: [
  {
    lessonNumber: 1,
    title: { en: "The 1% Rule", ta: "1 சதவீத விதி (1% Rule)" },
    explanation: { 
      en: "Improving by 1 percent isn't particularly notable—sometimes it isn't even noticeable—but it can be far more meaningful, especially in the long run.", 
      ta: "ஒரே நாளில் பெரிய வெற்றியை அடைய நினைப்பதை விட, தினமும் 1% முன்னேற்றம் அடைவது நீண்ட கால அடிப்படையில் மிகப்பெரிய வளர்ச்சியை கொடுக்கும்." 
    },
    whyItMatters: { 
      en: "Small daily habits compound over time. A 1% improvement daily leads to being 37x better in a year.", 
      ta: "நாம் செய்யும் சிறுசிறு செயல்கள் எல்லாம் ஒன்று சேர்ந்து, ஒரு வருடம் கழித்து நாம் நினைத்து பார்க்க முடியாத அளவுக்கு நம்மை உயர்த்தி இருக்கும்." 
    },
    example: { 
      en: "Instead of trying to read a whole book in a day, commit to reading just 2 pages every night before bed.", 
      ta: "உதாரணமாக, ஒரே நாளில் 10 மணி நேரம் ஜிம்மில் உடற்பயிற்சி செய்வதை விட, தினமும் 20 நிமிடம் நடைபயிற்சி செய்வது உடல் ஆரோக்கியத்திற்கு மிகவும் நல்லது." 
    },
    actionStep: { 
      en: "Identify one tiny habit you can improve by 1% today.", 
      ta: "இன்று நீங்கள் செய்யக்கூடிய ஒரு மிகச்சிறிய நல்ல பழக்கத்தை தேர்ந்தெடுத்து, அதை இப்போதே தொடங்குங்கள்." 
    },
    reflectionQuestion: { 
      en: "What is one small habit that, if done daily, would drastically improve your life in 5 years?", 
      ta: "எந்த ஒரு சிறிய பழக்கத்தை தினமும் செய்தால், 5 வருடங்கள் கழித்து உங்கள் வாழ்க்கை மிகச் சிறப்பாக இருக்கும்?" 
    }
  },
  {
    lessonNumber: 2,
    title: { en: "Forget Goals, Focus on Systems", ta: "இலக்கை மறங்கள், செயல்முறையில் கவனம் செலுத்துங்கள்" },
    explanation: { 
      en: "Goals are about the results you want to achieve. Systems are about the processes that lead to those results.", 
      ta: "இலக்கு என்பது நாம் எதை அடைய வேண்டும் என்பது. ஆனால் செயல்முறை (System) என்பது அந்த இலக்கை எப்படி அடையப்போகிறோம் என்பது. செயல்முறை சரியாக இருந்தால் இலக்கு தானாக நிறைவேறும்." 
    },
    whyItMatters: { 
      en: "Winners and losers have the same goals. The system is what differentiates them.", 
      ta: "ஜெயித்தவனுக்கும் தோற்றவனுக்கும் ஒரே இலக்கு தான் இருந்திருக்கும். ஆனால் ஜெயித்தவனின் படிக்கும் முறை (System) சிறப்பாக இருந்ததால் அவன் ஜெயித்தான்." 
    },
    example: { 
      en: "If you're a coach, your goal might be to win a championship. Your system is the way you recruit players, manage assistant coaches, and conduct practice.", 
      ta: "உடல் எடையை குறைக்க வேண்டும் என்பது உங்கள் இலக்காக இருந்தால், தினமும் ஆரோக்கியமான உணவை சாப்பிடுவதும், உடற்பயிற்சி செய்வதும் தான் உங்கள் செயல்முறை." 
    },
    actionStep: { 
      en: "Write down the system/process required for your biggest current goal.", 
      ta: "உங்களுடைய தற்போதைய பெரிய இலக்கை அடைய என்னென்ன செயல்களை தினமும் செய்ய வேண்டும் என்று எழுதுங்கள்." 
    },
    reflectionQuestion: { 
      en: "Are your daily routines perfectly aligned with the goals you claim to want?", 
      ta: "நீங்கள் ஆசைப்படும் இலக்கிற்கும், நீங்கள் தினமும் செய்யும் செயல்களுக்கும் சம்பந்தம் இருக்கிறதா?" 
    }
  },
  {
    lessonNumber: 3,
    title: { en: "Make It Obvious", ta: "கண்ணில் படும்படி வையுங்கள்" },
    explanation: { 
      en: "The most common cues are time and location. Creating an implementation intention helps trigger the habit automatically.", 
      ta: "ஒரு நல்ல பழக்கத்தை உருவாக்க வேண்டும் என்றால், அதற்கான பொருளை உங்கள் கண்ணில் படும்படி வைக்க வேண்டும். அது உங்களை அந்த செயலை செய்ய தூண்டும்." 
    },
    whyItMatters: { 
      en: "Environment design is more powerful than willpower.", 
      ta: "சுற்றுச்சூழலை சரியாக அமைப்பது, நமது மனக்கட்டுப்பாட்டை (willpower) விட மிகவும் சக்தி வாய்ந்தது." 
    },
    example: { 
      en: "If you want to drink more water, fill up water bottles every morning and place them in common locations around the house.", 
      ta: "நீங்கள் தினமும் புத்தகம் படிக்க வேண்டும் என்று நினைத்தால், அந்த புத்தகத்தை அலமாரியில் வைக்காமல், உங்கள் படுக்கையின் அருகிலோ அல்லது மேசையின் மீதோ கண்ணில் படும்படி வைக்க வேண்டும்." 
    },
    actionStep: { 
      en: "Use the formula: 'I will [BEHAVIOR] at [TIME] in [LOCATION]'.", 
      ta: "நான் [இந்த செயலை] [இந்த நேரத்தில்] [இந்த இடத்தில்] செய்வேன் என்று தெளிவாக எழுதி வையுங்கள்." 
    },
    reflectionQuestion: { 
      en: "How can you redesign your room to make your good habits more obvious?", 
      ta: "உங்கள் நல்ல பழக்கங்களை தூண்டும்படி உங்கள் அறையை எப்படி மாற்றியமைக்கலாம்?" 
    }
  },
  {
    lessonNumber: 4,
    title: { en: "Make It Attractive", ta: "பழக்கத்தை கவர்ச்சிகரமானதாக மாற்றுங்கள்" },
    explanation: {
      en: "The more attractive an opportunity is, the more likely it is to become habit-forming. Dopamine spikes when we anticipate a reward.",
      ta: "ஒரு செயல் எவ்வளவு கவர்ச்சிகரமானதாக இருக்கிறதோ, அது ஒரு பழக்கமாக மாறுவதற்கு வாய்ப்புகள் அதிகம். எதிர்பார்ப்பு தான் மூளையில் டோபமைனை (Dopamine) சுரக்கச் செய்கிறது."
    },
    whyItMatters: {
      en: "Temptation bundling works by linking an action you want to do with an action you need to do.",
      ta: "உங்களுக்கு பிடித்த ஒரு செயலோடு (உதாரணமாக பாட்டு கேட்பது), நீங்கள் செய்ய வேண்டிய ஒரு கஷ்டமான செயலை (உதாரணமாக உடற்பயிற்சி) இணைப்பது பழக்கத்தை எளிதாக்கும்."
    },
    example: {
      en: "Only listen to your favorite podcast while working out at the gym.",
      ta: "உங்களுக்கு மிகவும் பிடித்த பாடல்களை, நீங்கள் உடற்பயிற்சி செய்யும்போது மட்டுமே கேட்க வேண்டும் என்று ஒரு விதியை உருவாக்குங்கள்."
    },
    actionStep: {
      en: "Pair an action you want to do with an action you need to do today.",
      ta: "இன்று நீங்கள் செய்ய வேண்டிய ஒரு கடினமான வேலையை, உங்களுக்கு பிடித்த ஒரு செயலோடு இணைத்து செய்யுங்கள்."
    },
    reflectionQuestion: {
      en: "What is one 'want to do' activity you can bundle with a 'need to do' habit?",
      ta: "நீங்கள் செய்ய வேண்டிய முக்கியமான வேலை என்ன? அதனுடன் நீங்கள் செய்ய விரும்பும் எந்த செயலை இணைக்கலாம்?"
    }
  },
  {
    lessonNumber: 5,
    title: { en: "Make It Easy", ta: "செயலை எளிமையாக்குங்கள்" },
    explanation: {
      en: "Human behavior follows the Law of Least Effort. We naturally gravitate toward the option that requires the least amount of work.",
      ta: "மனித மூளை எப்போதுமே எளிதான வேலைகளை செய்யவே விரும்பும். எந்த ஒரு செயலை செய்ய குறைந்த முயற்சி தேவையோ, அதையே நாம் தேர்ந்தெடுப்போம்."
    },
    whyItMatters: {
      en: "By reducing the friction associated with good behaviors, you increase the likelihood of doing them.",
      ta: "ஒரு நல்ல பழக்கத்தை தொடங்குவதில் உள்ள தடைகளை குறைப்பதன் மூலம், அந்த செயலை நீங்கள் செய்வதற்கான வாய்ப்பு அதிகரிக்கும்."
    },
    example: {
      en: "Pack your gym clothes and shoes the night before so you can just grab them and go in the morning.",
      ta: "காலையில் உடற்பயிற்சி செய்ய வேண்டும் என்றால், முந்தைய நாள் இரவே உங்கள் உடற்பயிற்சி உடைகளையும் ஷூவையும் தயார் செய்து வையுங்கள்."
    },
    actionStep: {
      en: "Remove one step of friction from a good habit you want to build.",
      ta: "நீங்கள் உருவாக்க விரும்பும் ஒரு நல்ல பழக்கத்தை செய்வதற்கு தடையாக இருக்கும் ஒரு சிறு விஷயத்தை இன்று நீக்குங்கள்."
    },
    reflectionQuestion: {
      en: "How can you design an environment where doing the right thing is the easiest thing to do?",
      ta: "சரியான செயலை செய்வதை மிகவும் எளிதான ஒன்றாக மாற்ற உங்கள் சூழ்நிலையை எப்படி மாற்றலாம்?"
    }
  },
  {
    lessonNumber: 6,
    title: { en: "Make It Satisfying", ta: "பழக்கத்தை திருப்திகரமானதாக மாற்றுங்கள்" },
    explanation: {
      en: "We are more likely to repeat a behavior when the experience is satisfying. What is immediately rewarded is repeated.",
      ta: "ஒரு செயலை செய்து முடித்தவுடன் நமக்கு சந்தோஷமோ திருப்தியோ கிடைத்தால், அந்த செயலை நாம் மீண்டும் செய்ய விரும்புவோம்."
    },
    whyItMatters: {
      en: "The human brain evolved to prioritize immediate rewards over delayed rewards.",
      ta: "நமது மூளை நீண்ட கால பலன்களை விட, உடனடியாக கிடைக்கும் பலன்களுக்கே அதிக முக்கியத்துவம் கொடுக்கும்."
    },
    example: {
      en: "After finishing a difficult work task, reward yourself immediately with a 5-minute break or a cup of tea.",
      ta: "ஒரு கடினமான வேலையை முடித்தவுடன், உங்களுக்கு நீங்களே ஒரு சின்ன பரிசை (டீ குடிப்பது அல்லது 5 நிமிடம் ஓய்வு) கொடுத்துக் கொள்ளுங்கள்."
    },
    actionStep: {
      en: "Set up an immediate small reward for completing your habit today.",
      ta: "இன்று நீங்கள் உங்களின் இலக்கை முடித்தவுடன், உடனடியாக ஒரு சின்ன பரிசை உங்களுக்கு நீங்களே கொடுத்துக்கொள்ளுங்கள்."
    },
    reflectionQuestion: {
      en: "How can you make a difficult long-term habit feel rewarding today?",
      ta: "நீண்ட காலம் கழித்து பலன் தரக்கூடிய ஒரு கடினமான செயலை, இப்போதே திருப்திகரமானதாக எப்படி மாற்றலாம்?"
    }
  },
  {
    lessonNumber: 7,
    title: { en: "The 2-Minute Rule", ta: "2 நிமிட விதி (2-Minute Rule)" },
    explanation: {
      en: "When you start a new habit, it should take less than two minutes to do.",
      ta: "புதிதாக ஒரு பழக்கத்தை தொடங்கும்போது, அந்த செயல் இரண்டு நிமிடங்களுக்குள் செய்து முடிப்பதாக இருக்க வேண்டும்."
    },
    whyItMatters: {
      en: "A new habit should not feel like a challenge. The actions that follow can be challenging, but the first two minutes should be easy.",
      ta: "ஒரு செயலை தொடங்குவது தான் மிகவும் கடினம். அந்த தொடக்கத்தை 2 நிமிடத்திற்குள் சுருக்கினால், நாம் அதை தள்ளிப்போட மாட்டோம்."
    },
    example: {
      en: "'Read before bed each night' becomes 'Read one page'. 'Do 30 minutes of yoga' becomes 'Take out my yoga mat'.",
      ta: "'தினமும் ஒரு மணி நேரம் படிக்க வேண்டும்' என்பதற்கு பதிலாக, 'தினமும் ஒரே ஒரு பக்கம் படிப்பேன்' என்று தொடங்குங்கள்."
    },
    actionStep: {
      en: "Scale down your biggest habit into a 2-minute version.",
      ta: "உங்கள் மிகப்பெரிய இலக்கை அல்லது பழக்கத்தை, வெறும் 2 நிமிடங்களில் செய்யக்கூடிய ஒரு சிறு செயலாக மாற்றுங்கள்."
    },
    reflectionQuestion: {
      en: "What is the 2-minute version of the habit you've been procrastinating on?",
      ta: "நீங்கள் தள்ளிப்போடும் வேலையை தொடங்க, ஒரு 2 நிமிட செயலாக அதை எப்படி சுருக்கலாம்?"
    }
  },
  {
    lessonNumber: 8,
    title: { en: "Identity-Based Habits", ta: "அடையாளம் சார்ந்த பழக்கங்கள்" },
    explanation: {
      en: "True behavior change is identity change. The ultimate form of intrinsic motivation is when a habit becomes part of your identity.",
      ta: "உண்மையான மாற்றம் என்பது உங்களின் அடையாளத்தை (Identity) மாற்றுவதாகும். ஒரு செயல் உங்களின் ஒரு அங்கமாக மாறும் போது, அது நிரந்தர பழக்கமாகிறது."
    },
    whyItMatters: {
      en: "You might start a habit because of motivation, but the only reason you'll stick with one is that it becomes part of your identity.",
      ta: "'நான் இதை செய்ய வேண்டும்' என்று நினைப்பதை விட, 'நான் இப்படிப்பட்டவன்' என்று நினைப்பது மிக பெரிய உந்துதலை தரும்."
    },
    example: {
      en: "Instead of saying 'I'm trying to quit smoking', say 'I am not a smoker'.",
      ta: "'நான் சிகரெட் பிடிப்பதை விட முயற்சிக்கிறேன்' என்று சொல்வதற்கு பதிலாக, 'நான் சிகரெட் பிடிப்பவன் அல்ல' என்று முழுமையாக நம்புங்கள்."
    },
    actionStep: {
      en: "Decide the type of person you want to be, and prove it to yourself with small wins.",
      ta: "நீங்கள் எப்படிப்பட்ட நபராக மாற விரும்புகிறீர்கள் என்பதை முடிவு செய்து, சிறு சிறு செயல்கள் மூலம் அதை நிரூபியுங்கள்."
    },
    reflectionQuestion: {
      en: "Who is the type of person that could achieve the goals you desire?",
      ta: "நீங்கள் அடைய நினைக்கும் இலக்கை அடையக்கூடிய நபரின் அடையாளம் (Identity) என்னவாக இருக்கும்?"
    }
  },
  {
    lessonNumber: 9,
    title: { en: "Habit Stacking", ta: "பழக்கங்களை இணைத்தல் (Habit Stacking)" },
    explanation: {
      en: "One of the best ways to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top.",
      ta: "ஒரு புதிய பழக்கத்தை உருவாக்க, ஏற்கனவே நீங்கள் தினமும் செய்து வரும் ஒரு பழக்கத்தோடு அந்த புதிய செயலை இணைப்பது மிகச் சிறந்த வழியாகும்."
    },
    whyItMatters: {
      en: "It uses the natural momentum of behavior. You already have the neural networks for the old habit built.",
      ta: "ஏற்கனவே உள்ள பழக்கங்கள் மூளையில் ஆழமாக பதிந்திருக்கும். அதனுடன் புதிய செயலை சேர்க்கும் போது மூளை அதை எளிதாக ஏற்றுக்கொள்ளும்."
    },
    example: {
      en: "After I pour my cup of coffee each morning, I will meditate for one minute.",
      ta: "தினமும் காலையில் காபி குடித்தவுடன் (பழைய பழக்கம்), 5 நிமிடம் தியானம் செய்வேன் (புதிய பழக்கம்)."
    },
    actionStep: {
      en: "Create your own habit stack: 'After [CURRENT HABIT], I will [NEW HABIT]'.",
      ta: "'நான் [பழைய பழக்கம்] செய்தவுடன், [புதிய பழக்கம்] செய்வேன்' என்று எழுதி வையுங்கள்."
    },
    reflectionQuestion: {
      en: "What is an unbreakable daily habit you can stack a new tiny habit onto?",
      ta: "நீங்கள் ஒருபோதும் மறக்காமல் செய்யும் எந்த பழக்கத்தோடு, ஒரு புதிய பழக்கத்தை இன்று இணைக்கலாம்?"
    }
  },
  {
    lessonNumber: 10,
    title: { en: "Environment Design", ta: "சுற்றுச்சூழலை வடிவமைத்தல்" },
    explanation: {
      en: "Make the cues of good habits obvious and visible. If you want to make a habit a big part of your life, make the cue a big part of your environment.",
      ta: "நல்ல பழக்கங்களை தூண்டும் பொருட்களை உங்கள் கண்களில் படும்படி வையுங்கள். தீய பழக்கங்களை தூண்டும் பொருட்களை உங்கள் பார்வையில் இருந்து மறைத்து வையுங்கள்."
    },
    whyItMatters: {
      en: "You don't need more discipline, you need a better environment.",
      ta: "உங்களுக்கு அதிக சுயக்கட்டுப்பாடு தேவை இல்லை, உங்களுக்கு தேவை ஒரு சரியான சுற்றுச்சூழல் மட்டுமே."
    },
    example: {
      en: "If you want to practice guitar more frequently, place your guitar stand in the middle of the living room.",
      ta: "நீங்கள் தினமும் பழங்கள் சாப்பிட வேண்டும் என்று நினைத்தால், பழங்களை ஒரு பாத்திரத்தில் வைத்து மேசையின் மீது வையுங்கள் (பிரிட்ஜில் மறைத்து வைக்காதீர்கள்)."
    },
    actionStep: {
      en: "Alter one aspect of your physical environment today to make a good habit easier.",
      ta: "இன்று உங்கள் அறையில் உள்ள ஒரு பொருளின் இடத்தை மாற்றுவதன் மூலம் உங்கள் நல்ல பழக்கத்தை எப்படி எளிதாக்கலாம் என்று யோசியுங்கள்."
    },
    reflectionQuestion: {
      en: "Is your current environment designed for the person you want to become?",
      ta: "உங்கள் தற்போதைய சூழ்நிலை, நீங்கள் மாற நினைக்கும் நபருக்கு ஏற்றவாறு அமைக்கப்பட்டிருக்கிறதா?"
    }
  },
  {
    lessonNumber: 11,
    title: { en: "The Law of Least Effort", ta: "குறைந்தபட்ச முயற்சியின் விதி" },
    explanation: {
      en: "Create an environment where doing the right thing is as easy as possible.",
      ta: "சரியான செயலை செய்வதை எவ்வளவு முடியுமோ அவ்வளவு எளிதாக்குங்கள்."
    },
    whyItMatters: {
      en: "Friction is the enemy of action. Reduce the friction for good habits, increase it for bad habits.",
      ta: "சிரமம் தான் செயலுக்கு எதிரி. நல்ல பழக்கங்களை செய்ய எந்த சிரமமும் இல்லாமல் பார்த்துக்கொள்ளுங்கள், கெட்ட பழக்கங்களை செய்வதற்கு சிரமத்தை அதிகமாக்குங்கள்."
    },
    example: {
      en: "Unplug your TV and take the batteries out of the remote after every use to make watching TV harder.",
      ta: "டிவி பார்ப்பதை குறைக்க வேண்டும் என்றால், தினமும் டிவி பார்த்த பிறகு ரிமோட்டில் உள்ள பேட்டரியை கழற்றி வையுங்கள்."
    },
    actionStep: {
      en: "Add friction to a bad habit so that it takes more effort to perform.",
      ta: "உங்கள் தீய பழக்கத்தை தொடங்குவதை மிகவும் கடினமானதாக மாற்ற ஒரு தடையை ஏற்படுத்துங்கள்."
    },
    reflectionQuestion: {
      en: "Where is the unnecessary friction in your good habits?",
      ta: "உங்கள் நல்ல பழக்கங்களை செய்வதில் தேவையில்லாமல் உள்ள தடைகள் என்னென்ன?"
    }
  },
  {
    lessonNumber: 12,
    title: { en: "Habit Tracking", ta: "பழக்கங்களை பின்தொடர்தல் (Habit Tracking)" },
    explanation: {
      en: "A habit tracker is a simple way to measure whether you did a habit.",
      ta: "நீங்கள் நினைத்த செயலை தினமும் செய்கிறீர்களா என்பதை கண்காணிக்க (Track) ஒரு எளிய வழிமுறையை பின்பற்றுங்கள்."
    },
    whyItMatters: {
      en: "Visual evidence of your progress is highly motivating. It feels good to see a streak grow.",
      ta: "நாம் எவ்வளவு தூரம் முன்னேறி இருக்கிறோம் என்பதை கண்கூடாக பார்ப்பது மிகப்பெரிய உந்துதலைத் தரும்."
    },
    example: {
      en: "Marking an X on a calendar every day you work out.",
      ta: "தினமும் உடற்பயிற்சி செய்த பிறகு, கேலண்டரில் ஒரு பெரிய 'X' குறியிடுவது உங்களை தொடர்ந்து செய்ய வைக்கும்."
    },
    actionStep: {
      en: "Start tracking one essential habit using a calendar or an app today.",
      ta: "உங்கள் முக்கியமான ஒரு பழக்கத்தை கேலண்டர் அல்லது நோட்டு புத்தகத்தில் தினமும் குறித்து வாருங்கள்."
    },
    reflectionQuestion: {
      en: "What is one metric you can visually track every day to ensure progress?",
      ta: "உங்கள் முன்னேற்றத்தை கண்கூடாக பார்க்க தினமும் நீங்கள் என்ன விஷயத்தை பின்தொடர (Track) போகிறீர்கள்?"
    }
  },
  {
    lessonNumber: 13,
    title: { en: "Never Miss Twice", ta: "இரண்டு முறை தவற விடாதீர்கள்" },
    explanation: {
      en: "If you miss one day, try to get back on track as quickly as possible.",
      ta: "ஒரு நாள் உங்களின் பழக்கத்தை செய்ய தவறினால், அடுத்த நாளே அதை மீண்டும் தொடங்க முயற்சி செய்யுங்கள். தொடர்ந்து இரண்டு நாட்கள் தவற விடாதீர்கள்."
    },
    whyItMatters: {
      en: "Missing once is an accident. Missing twice is the start of a new (bad) habit.",
      ta: "ஒரு நாள் தவற விடுவது விபத்து. ஆனால் இரண்டாவது நாளும் தவற விட்டால், அது கெட்ட பழக்கத்தின் தொடக்கமாகிவிடும்."
    },
    example: {
      en: "If you eat junk food for lunch, make sure to eat a healthy dinner.",
      ta: "மதியம் உடலுக்கு கேடான உணவை சாப்பிட்டுவிட்டால், இரவிலாவது ஆரோக்கியமான உணவை சாப்பிட வேண்டும்."
    },
    actionStep: {
      en: "Forgive yourself for yesterday's slip-up and focus on executing the habit today.",
      ta: "நேற்று செய்யத் தவறியதை நினைத்து கவலைப்படுவதை விட்டுவிட்டு, இன்றே மீண்டும் தொடங்குங்கள்."
    },
    reflectionQuestion: {
      en: "How quickly do you bounce back after breaking a good streak?",
      ta: "ஒரு நல்ல பழக்கம் தடைபடும்போது, நீங்கள் எவ்வளவு சீக்கிரம் அதை மீண்டும் தொடங்குவீர்கள்?"
    }
  },
  {
    lessonNumber: 14,
    title: { en: "The Role of Family and Friends", ta: "நண்பர்கள் மற்றும் குடும்பத்தின் பங்கு" },
    explanation: {
      en: "We tend to imitate the habits of three social groups: the close (family and friends), the many (the tribe), and the powerful (those with status).",
      ta: "நாம் நம்மை சுற்றியுள்ள நெருக்கமானவர்கள், சமுதாயத்தில் உள்ள பெரும்பான்மையானவர்கள், மற்றும் புகழ்பெற்றவர்களின் பழக்கவழக்கங்களை அறியாமலேயே பின்பற்றுவோம்."
    },
    whyItMatters: {
      en: "One of the most effective things you can do to build better habits is to join a culture where your desired behavior is the normal behavior.",
      ta: "உங்கள் இலக்கை அடைய மிகச் சிறந்த வழி, நீங்கள் செய்ய நினைக்கும் பழக்கங்களை ஏற்கனவே வழக்கமாக வைத்திருக்கும் மனிதர்களுடன் பழகுவது தான்."
    },
    example: {
      en: "If you want to read more, join a book club.",
      ta: "நீங்கள் அதிகம் படிக்க வேண்டும் என்று நினைத்தால், படிப்பதை வழக்கமாக கொண்ட நண்பர்களுடன் சேருங்கள்."
    },
    actionStep: {
      en: "Find a community or a person who already has the habits you want to build.",
      ta: "நீங்கள் அடைய நினைக்கும் இலக்கை ஏற்கனவே சாதித்த ஒரு நபரையோ அல்லது குழுவையோ தேடி அவர்களுடன் இணையுங்கள்."
    },
    reflectionQuestion: {
      en: "Are the people you spend the most time with elevating you or pulling you down?",
      ta: "உங்களுடன் இருப்பவர்கள் உங்களை மேலே உயர்த்துகிறார்களா அல்லது கீழே இழுக்கிறார்களா?"
    }
  },
  {
    lessonNumber: 15,
    title: { en: "The Goldilocks Rule", ta: "கோல்டிலாக்ஸ் விதி" },
    explanation: {
      en: "Humans experience peak motivation when working on tasks that are right on the edge of their current abilities. Not too hard. Not too easy. Just right.",
      ta: "ஒரு வேலை மிகவும் எளிதாகவும் இருக்கக்கூடாது, மிகவும் கடினமாகவும் இருக்கக்கூடாது. உங்களின் தற்போதைய திறமைக்கு சவால் விடும் வகையில் நடுத்தரமாக இருந்தால் மூளை அதில் அதிக கவனம் செலுத்தும்."
    },
    whyItMatters: {
      en: "If a habit is too easy, you'll get bored. If it's too hard, you'll get discouraged.",
      ta: "செயல் மிகவும் எளிதாக இருந்தால் சலிப்பு ஏற்படும். மிகவும் கடினமாக இருந்தால் விரக்தி ஏற்படும். சவாலான செயல்கள் மட்டுமே உங்களை உற்சாகமாக வைத்திருக்கும்."
    },
    example: {
      en: "Playing tennis against someone exactly your skill level keeps you engaged and motivated.",
      ta: "உங்களுக்கு நிகரான திறமை உள்ள ஒருவருடன் செஸ் விளையாடுவது தான் விறுவிறுப்பாக இருக்கும்."
    },
    actionStep: {
      en: "Adjust the difficulty of your current habit so it remains slightly challenging.",
      ta: "நீங்கள் தினமும் செய்யும் பழக்கம் உங்களுக்கு சலிப்பு தட்டினால், அதன் கடினத்தன்மையை சிறிது அதிகமாக்குங்கள்."
    },
    reflectionQuestion: {
      en: "Is your daily routine too boring, too stressful, or in the perfect 'flow' state?",
      ta: "உங்களின் அன்றாட வேலைகள் சலிப்பாக இருக்கிறதா, மனஅழுத்தமாக இருக்கிறதா, அல்லது உற்சாகமாக இருக்கிறதா?"
    }
  },
  {
    lessonNumber: 16,
    title: { en: "Downside of Good Habits", ta: "நல்ல பழக்கங்களின் மறுபக்கம்" },
    explanation: {
      en: "The upside of habits is that we can do things without thinking. The downside is that you get used to doing things a certain way and stop paying attention to little errors.",
      ta: "பழக்கங்களின் நன்மை என்னவென்றால் யோசிக்காமலேயே செயல்படலாம். ஆனால் தீமை என்னவென்றால், பழகிவிட்ட காரணத்தால் சிறு சிறு தவறுகளை நாம் கவனிக்கத் தவறிவிடுவோம்."
    },
    whyItMatters: {
      en: "Habits + Deliberate Practice = Mastery. You need to review and reflect to keep improving.",
      ta: "பழக்கம் + விழிப்புணர்வுடன் கூடிய பயிற்சி = நிபுணத்துவம். உங்களை நீங்களே தொடர்ந்து ஆய்வு செய்ய வேண்டும்."
    },
    example: {
      en: "A surgeon might have performed 1,000 surgeries (habit) but still reviews outcomes to improve (deliberate practice).",
      ta: "ஒரு மருத்துவர் 1000 அறுவை சிகிச்சைகள் செய்திருந்தாலும், அடுத்த அறுவை சிகிச்சையில் எப்படி சிறப்பாக செய்யலாம் என்று சிந்திப்பது தான் நிபுணத்துவம்."
    },
    actionStep: {
      en: "Schedule a yearly or monthly 'integrity report' to review your habits.",
      ta: "மாதத்திற்கு ஒரு முறையாவது நீங்கள் செய்யும் பழக்கங்களில் என்ன முன்னேற்றம் ஏற்பட்டுள்ளது என்று சுய ஆய்வு செய்யுங்கள்."
    },
    reflectionQuestion: {
      en: "Where have you been operating on 'autopilot' instead of consciously improving?",
      ta: "எந்தெந்த வேலைகளில் நீங்கள் எந்தவித முன்னேற்றமும் இல்லாமல் ஒரே மாதிரியாக இயந்திரத்தனமாக செயல்படுகிறீர்கள்?"
    }
  },
  {
    lessonNumber: 17,
    title: { en: "Make Bad Habits Invisible", ta: "கெட்ட பழக்கங்களை பார்வையிலிருந்து மறையுங்கள்" },
    explanation: {
      en: "Once a habit is formed, it is unlikely to be forgotten. The best way to break a bad habit is to reduce exposure to the cue that causes it.",
      ta: "மூளை ஒரு கெட்ட பழக்கத்தை கற்றுக் கொண்டால் அதை எளிதில் மறக்காது. அதை நிறுத்த ஒரே வழி, அந்த பழக்கத்தை தூண்டும் பொருட்களை உங்கள் கண்களில் படாமல் செய்வது தான்."
    },
    whyItMatters: {
      en: "Self-control is a short-term strategy. You can't out-willpower a bad environment forever.",
      ta: "மனக்கட்டுப்பாடு என்பது தற்காலிகமானது. ஒரு கெட்ட சூழ்நிலையில் வைத்துக்கொண்டு உங்களால் நீண்ட காலம் அதை எதிர்க்க முடியாது."
    },
    example: {
      en: "If you spend too much time on your phone, leave it in another room while you work.",
      ta: "நீங்கள் அதிகம் மொபைல் போன் பயன்படுத்துபவர் என்றால், படிக்கும்போதோ வேலை செய்யும்போதோ மொபைலை வேறு அறையில் வைத்துவிடுங்கள்."
    },
    actionStep: {
      en: "Identify the trigger for your worst habit and remove it from your environment today.",
      ta: "உங்கள் கெட்ட பழக்கத்தை தூண்டும் பொருள் எது என்று கண்டுபிடித்து, இன்றே அதை உங்களிடமிருந்து தூரப்படுத்துங்கள்."
    },
    reflectionQuestion: {
      en: "What triggers your worst habit, and how can you completely remove the trigger?",
      ta: "எந்த விஷயம் உங்களை கெட்ட பழக்கத்தை செய்ய தூண்டுகிறது? அதை எப்படி உங்கள் பார்வையில் இருந்து மறைக்கலாம்?"
    }
  },
  {
    lessonNumber: 18,
    title: { en: "Make Bad Habits Unattractive", ta: "கெட்ட பழக்கங்களை கவர்ச்சியற்றதாக மாற்றுங்கள்" },
    explanation: {
      en: "Highlight the benefits of avoiding a bad habit to make it seem less appealing.",
      ta: "ஒரு கெட்ட பழக்கத்தை தவிர்ப்பதால் ஏற்படும் நன்மைகளை உங்கள் மூளைக்கு தொடர்ந்து நினைவூட்டுங்கள். அது அந்த பழக்கத்தின் மீதான ஆசையை குறைக்கும்."
    },
    whyItMatters: {
      en: "Every behavior has a surface level craving and a deeper underlying motive.",
      ta: "ஒவ்வொரு செயலின் பின்பும் ஒரு ஆழமான காரணம் இருக்கும். அந்த காரணத்தை மாற்றி அமைத்தால் கெட்ட பழக்கத்தை விடலாம்."
    },
    example: {
      en: "Instead of thinking 'I am restricted from eating sweets', think 'I am choosing foods that give me energy and health'.",
      ta: "'என்னால் இனிப்பு சாப்பிட முடியாது' என்று நினைப்பதற்குப் பதிலாக, 'நான் ஆரோக்கியம் தரும் உணவை விரும்பித் தேர்ந்தெடுக்கிறேன்' என்று நினையுங்கள்."
    },
    actionStep: {
      en: "Reframe your mindset about a bad habit by writing down 3 benefits of quitting it.",
      ta: "உங்கள் கெட்ட பழக்கத்தை விட்டால் கிடைக்கும் 3 பெரிய நன்மைகளை ஒரு தாளில் எழுதி வையுங்கள்."
    },
    reflectionQuestion: {
      en: "What deep emotional need is your bad habit satisfying, and how else can you fulfill it?",
      ta: "உங்கள் கெட்ட பழக்கம் எந்த ஒரு மன அழுத்தத்தை குறைக்கிறது? அந்த அமைதியை வேறு எந்த நல்ல வழியில் நீங்கள் பெறலாம்?"
    }
  },
  {
    lessonNumber: 19,
    title: { en: "Make Bad Habits Difficult", ta: "கெட்ட பழக்கங்களை கடினமாக்குங்கள்" },
    explanation: {
      en: "Increase the friction associated with your bad habits. When the friction is high, the habit becomes difficult.",
      ta: "கெட்ட பழக்கங்களை செய்ய நினைக்கும்போது, அதற்கு இடையில் பல தடைகளை உருவாக்குங்கள். தடைகள் அதிகமாக இருந்தால் மூளை அதை செய்ய தயங்கும்."
    },
    whyItMatters: {
      en: "A commitment device is a choice you make in the present that controls your actions in the future.",
      ta: "உங்களை நீங்களே கட்டுப்படுத்த ஒரு 'Commitment Device' (கட்டுப்பாட்டு வழிமுறை) தேவை."
    },
    example: {
      en: "If you spend too much money, leave your credit cards at home and only carry a small amount of cash.",
      ta: "நீங்கள் அளவுக்கு அதிகமாக செலவு செய்பவர் என்றால், வெளியே செல்லும்போது உங்கள் கிரெடிட் கார்டுகளை வீட்டிலேயே வைத்துவிட்டு தேவையான பணத்தை மட்டும் கொண்டு செல்லுங்கள்."
    },
    actionStep: {
      en: "Introduce a massive point of friction between you and your bad habit.",
      ta: "உங்கள் கெட்ட பழக்கத்திற்கும் உங்களுக்குமான இடைவெளியை (friction) இன்று அதிகமாக்குங்கள்."
    },
    reflectionQuestion: {
      en: "How can you lock yourself into good behavior and lock yourself out of bad behavior?",
      ta: "நல்ல பழக்கங்களை மட்டுமே செய்யும்படியும், கெட்ட பழக்கங்களை செய்ய முடியாதபடியும் உங்கள் சூழ்நிலையை எப்படி மாற்றலாம்?"
    }
  },
  {
    lessonNumber: 20,
    title: { en: "Make Bad Habits Unsatisfying", ta: "கெட்ட பழக்கங்களை திருப்தியற்றதாக மாற்றுங்கள்" },
    explanation: {
      en: "Get an accountability partner or create a habit contract. We care deeply about what others think of us.",
      ta: "ஒரு கெட்ட பழக்கத்தை செய்யும்போது அதற்கான தண்டனை உடனே கிடைத்தால் அதை நாம் செய்ய மாட்டோம். இதைச் செய்ய ஒரு பொறுப்பாளரை (Accountability Partner) நியமிக்கலாம்."
    },
    whyItMatters: {
      en: "The cost of your bad habits must become public and painful for you to stop.",
      ta: "கெட்ட பழக்கங்களை செய்வதால் ஏற்படும் நஷ்டம் உங்களுக்கு வலியைக் கொடுத்தால் மட்டுமே நீங்கள் அதை நிறுத்துவீர்கள்."
    },
    example: {
      en: "Give a friend ₹1000 and tell them they can keep it if you miss a workout.",
      ta: "உங்கள் நண்பனிடம் ரூ.1000 கொடுத்துவிட்டு, 'நான் இன்று உடற்பயிற்சி செய்யவில்லை என்றால் அந்த பணத்தை நீயே வைத்துக்கொள்' என்று கூறுங்கள்."
    },
    actionStep: {
      en: "Create a habit contract with a friend holding you accountable to a financial penalty.",
      ta: "நீங்கள் செய்ய நினைத்ததை செய்யவில்லை என்றால், நீங்கள் அபராதம் கட்டும் வகையில் உங்கள் நண்பருடன் ஒரு ஒப்பந்தம் செய்துகொள்ளுங்கள்."
    },
    reflectionQuestion: {
      en: "Who can you ask to hold you accountable for the bad habit you want to break?",
      ta: "உங்கள் கெட்ட பழக்கங்களை நீங்கள் நிறுத்துவதை கண்காணிக்கவும் உங்களை கேட்கவும் யாரை பொறுப்பாளராக நியமிக்கலாம்?"
    }
  }
]
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    categories: ["Focus", "Career", "Productivity"],
    themes: [
      { en: "Focus in a Distracted World", ta: "கவனச்சிதறல் நிறைந்த உலகில் கவனம் செலுத்துதல்" }
    ],
    overview: {
      en: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a superpower in our increasingly competitive twenty-first century economy.",
      ta: "எந்த ஒரு கவனச்சிதறலும் இல்லாமல், ஒரு கடினமான வேலையை முழு கவனத்துடன் செய்யும் திறனைப் பற்றி இந்தப் புத்தகம் பேசுகிறது. இது இன்றைய போட்டி நிறைந்த உலகில் ஒரு சூப்பர் பவர் ஆகும்."
    },
    topQuotes: [
      { en: "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.", ta: "உங்கள் முழு திறமையையும் வெளிப்படுத்த, கவனச்சிதறல் இல்லாமல் நீண்ட நேரம் ஒரு வேலையில் மட்டுமே கவனம் செலுத்த வேண்டும்." }
    ],
    lessons: [
      {
        lessonNumber: 1,
        title: { en: "Deep vs Shallow Work", ta: "ஆழமான வேலை vs ஆழமற்ற வேலை" },
        explanation: { 
          en: "Deep Work is professional activities performed in a state of distraction-free concentration. Shallow Work is non-cognitively demanding, logistical-style tasks.", 
          ta: "ஆழமான வேலை (Deep Work) என்பது முழு கவனத்துடன் மூளைக்கு வேலை கொடுப்பது. ஆழமற்ற வேலை (Shallow Work) என்பது மின்னஞ்சல் அனுப்புவது, சமூக வலைத்தளங்களை பார்ப்பது போன்ற சாதாரண வேலைகள்." 
        },
        whyItMatters: { 
          en: "Deep work creates new value, improves your skill, and is hard to replicate. Shallow work is easy to replicate and doesn't create much value.", 
          ta: "ஆழமான வேலைகள் தான் உங்கள் மதிப்பை உயர்த்தும். ஆழமற்ற வேலைகளை யார் வேண்டுமானாலும் செய்யலாம், அதனால் உங்களுக்கு பெரிய பலன் இல்லை." 
        },
        example: { 
          en: "Writing a research paper is deep work. Replying to slack messages is shallow work.", 
          ta: "ஒரு புதிய மென்பொருளை (Software) உருவாக்குவது அல்லது ஒரு கட்டுரையை எழுதுவது ஆழமான வேலை. வாட்ஸ்அப் மெசேஜ்களுக்கு பதில் அளிப்பது ஆழமற்ற வேலை." 
        },
        actionStep: { 
          en: "Schedule a 90-minute block of deep work for tomorrow morning with your phone in another room.", 
          ta: "நாளை காலை 90 நிமிடங்கள் உங்கள் போனை வேறு அறையில் வைத்துவிட்டு, முழு கவனத்துடன் ஒரு முக்கியமான வேலையை செய்யுங்கள்." 
        },
        reflectionQuestion: { 
          en: "What percentage of your day is currently spent on shallow work vs deep work?", 
          ta: "உங்கள் ஒரு நாளில் எவ்வளவு நேரம் ஆழமான வேலைக்கும், எவ்வளவு நேரம் சாதாரண வேலைக்கும் செலவிடுகிறீர்கள்?" 
        }
      }
    ]
  }
];

const seedWisdom = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    await WisdomBook.deleteMany();
    console.log('Cleared existing wisdom books');

    await WisdomBook.insertMany(seedData);
    console.log('Successfully seeded Wisdom Library');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedWisdom();
