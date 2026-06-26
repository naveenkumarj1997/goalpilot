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
  },
  {
    lessonNumber: 2,
    title: { en: "Deep Work is Valuable", ta: "ஆழமான வேலை மிகவும் மதிப்புமிக்கது" },
    explanation: {
      en: "In the new economy, three groups will thrive: those who can work well with intelligent machines, the superstars, and the owners. Deep work is the key to joining them.",
      ta: "தற்போதைய தொழில்நுட்ப உலகில் வெற்றி பெற, கடினமான விஷயங்களை விரைவாக கற்கும் திறனும், உயர்தர வேலையை செய்யும் திறனும் தேவை. இவை இரண்டிற்கும் ஆழமான வேலை அவசியம்."
    },
    whyItMatters: {
      en: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
      ta: "இன்றைய உலகில் பலருக்கும் கவனச்சிதறல் இருப்பதால் ஆழமான வேலை செய்ய முடிவதில்லை. இதை யார் செய்கிறார்களோ அவர்களுக்கு மிகப்பெரிய மதிப்பும் வெற்றியும் கிடைக்கும்."
    },
    example: {
      en: "Learning a complex new programming language quickly requires intense, distraction-free focus.",
      ta: "புதிதாக வந்திருக்கும் செயற்கை நுண்ணறிவு (AI) தொழில்நுட்பத்தை கற்றுக்கொள்ள, நீங்கள் பல மணிநேரம் எந்த கவனச்சிதறலும் இல்லாமல் படிக்க வேண்டும்."
    },
    actionStep: {
      en: "Identify the single most valuable skill in your field right now and dedicate 1 hour today to mastering it.",
      ta: "உங்கள் துறையில் மிகவும் முக்கியமான ஒரு திறமையை தேர்ந்தெடுத்து, இன்று 1 மணி நேரம் எந்த கவனச்சிதறலும் இல்லாமல் அதை கற்றுக்கொள்ளுங்கள்."
    },
    reflectionQuestion: {
      en: "What skill would make you irreplaceable in your career if you mastered it through deep work?",
      ta: "எந்த ஒரு திறமையை ஆழமாக கற்றுக்கொண்டால், உங்கள் வேலையில் உங்களை யாராலும் அசைக்க முடியாது?"
    }
  },
  {
    lessonNumber: 3,
    title: { en: "Deep Work is Rare", ta: "ஆழமான வேலை இப்போது அரிதாகிவிட்டது" },
    explanation: {
      en: "Modern workplaces are designed around constant connectivity (Slack, emails, open offices), making deep focus nearly impossible.",
      ta: "தற்போதைய அலுவலகங்கள் மற்றும் தொழில்நுட்பங்கள் நம்மை தொடர்ந்து பிஸியாக வைத்திருக்கின்றன. ஆனால் அது நாம் சிறப்பான வேலை செய்வதை தடுக்கிறது."
    },
    whyItMatters: {
      en: "If you can cultivate the ability to focus in a distracted world, you will easily outpace your peers.",
      ta: "மற்றவர்கள் அனைவரும் வாட்ஸ்அப்பிலும், சமூக வலைத்தளங்களிலும் மூழ்கிக் கிடக்கும் போது, நீங்கள் ஆழமாக வேலை செய்தால் அவர்களை விட மிக எளிதாக முன்னேறி விடலாம்."
    },
    example: {
      en: "An open-plan office encourages collaboration but destroys the silence needed for complex problem-solving.",
      ta: "தொடர்ந்து நோட்டிபிகேஷன் வரும் மொபைலை பக்கத்தில் வைத்துக்கொண்டு ஒரு சிக்கலான கணக்கை தீர்க்க நினைப்பது முட்டாள்தனம்."
    },
    actionStep: {
      en: "Turn off all non-essential notifications on your computer and phone.",
      ta: "உங்கள் மொபைல் மற்றும் கணிப்பொறியில் உள்ள தேவையற்ற நோட்டிபிகேஷன்களை (Notifications) உடனே ஆஃப் (Off) செய்யுங்கள்."
    },
    reflectionQuestion: {
      en: "How does your current work environment prevent you from doing deep work?",
      ta: "நீங்கள் வேலை செய்யும் சூழ்நிலை, உங்களின் கவனத்தை சிதறடிக்கும் வகையில் எப்படி அமைந்திருக்கிறது?"
    }
  },
  {
    lessonNumber: 4,
    title: { en: "Deep Work is Meaningful", ta: "ஆழமான வேலை மனநிறைவை தரும்" },
    explanation: {
      en: "A deep life is a good life. Craftsmanship and total immersion in a task lead to a state of 'flow' and deep satisfaction.",
      ta: "ஒரு வேலையில் முழுமையாக மூழ்கி செய்யும் போது, நமது மனது முழுமையான அமைதியையும் திருப்தியையும் (Flow state) அடைகிறது."
    },
    whyItMatters: {
      en: "Constant distraction makes you anxious and fractured. Deep work provides a sense of purpose and craftsmanship.",
      ta: "கவனச்சிதறல் உங்களுக்கு மனஅழுத்தத்தை தரும். ஆனால் முழு கவனத்துடன் வேலை செய்வது ஒரு சிற்பியை போல உங்களுக்கு மனநிறைவை தரும்."
    },
    example: {
      en: "A blacksmith shaping iron or a programmer writing elegant code experiences the same psychological reward of deep craftsmanship.",
      ta: "ஒரு ஓவியர் எந்த சிந்தனையும் இல்லாமல் ஒரு அழகான ஓவியத்தை வரையும் போது அவருக்கு கிடைக்கும் ஆனந்தம் தான் ஆழமான வேலையின் பலன்."
    },
    actionStep: {
      en: "Engage in a difficult but enjoyable hobby today without checking your phone.",
      ta: "இன்று உங்களுக்கு பிடித்த ஒரு கடினமான வேலையை (உதாரணம்: புத்தகம் படிப்பது, எழுதுவது), உங்கள் போனை பார்க்காமல் முழு மனதுடன் செய்யுங்கள்."
    },
    reflectionQuestion: {
      en: "When was the last time you lost track of time because you were so immersed in a task?",
      ta: "கடைசியாக எந்த வேலையை செய்யும்போது, நேரம் போனதே தெரியாமல் முழுமையாக அதில் மூழ்கினீர்கள்?"
    }
  },
  {
    lessonNumber: 5,
    title: { en: "The Monastic Philosophy", ta: "முனிவர் போன்ற அணுகுமுறை (Monastic)" },
    explanation: {
      en: "This approach involves eliminating all shallow obligations and isolating yourself completely to focus on deep work.",
      ta: "முனிவர்கள் தியானம் செய்வது போல, சமூகத் தொடர்புகள் அனைத்தையும் துண்டித்துவிட்டு முழுமையாக தனது வேலையில் மட்டுமே கவனம் செலுத்துவது."
    },
    whyItMatters: {
      en: "This is the most extreme and productive form of deep work, ideal for writers, scientists, and academics.",
      ta: "மிகப்பெரிய ஆராய்ச்சிகள் மற்றும் நாவல்களை எழுத இந்த கடுமையான முறை தேவைப்படுகிறது."
    },
    example: {
      en: "Science fiction writer Neal Stephenson doesn't have an email address so he can write his novels without interruption.",
      ta: "ஒரு மாபெரும் நாவலை எழுத நினைக்கும் எழுத்தாளர், மொபைல் சிக்னல் இல்லாத ஒரு மலைப்பகுதிக்கு சென்று தங்கி எழுதுவது."
    },
    actionStep: {
      en: "Identify one day this month where you can be completely unreachable to everyone.",
      ta: "இந்த மாதத்தில் ஒரே ஒரு நாள் மட்டும் உங்களை யாராலும் தொடர்புகொள்ள முடியாதபடி மொபைலை அணைத்து வையுங்கள்."
    },
    reflectionQuestion: {
      en: "What major project could you complete if you went into total isolation for two weeks?",
      ta: "உங்களுக்கு இரண்டு வாரங்கள் எந்த தொந்தரவும் இல்லாத தனிமை கிடைத்தால், எந்த ஒரு பெரிய வேலையை முடிப்பீர்கள்?"
    }
  },
  {
    lessonNumber: 6,
    title: { en: "The Bimodal Philosophy", ta: "இரட்டை அணுகுமுறை (Bimodal)" },
    explanation: {
      en: "You divide your time, dedicating some clearly defined stretches to deep pursuits and leaving the rest open to everything else.",
      ta: "உங்கள் நேரத்தை இரண்டாக பிரிப்பது. சில நாட்கள் அல்லது வாரங்கள் முனிவர் போல வேலை செய்வது, மற்ற நாட்களில் சாதாரண வாழ்க்கையை வாழ்வது."
    },
    whyItMatters: {
      en: "It allows for extreme focus while still maintaining necessary business or social connections.",
      ta: "இந்த முறையில், உங்கள் முக்கியமான வேலையையும் சிறப்பாக செய்ய முடியும், சமூகத் தொடர்புகளையும் விட்டுவிடாமல் பார்த்துக்கொள்ள முடியும்."
    },
    example: {
      en: "Carl Jung had a clinic in the city for regular days, and a stone tower in the woods for his deep work periods.",
      ta: "ஒரு கல்லூரி பேராசிரியர், வாரம் 4 நாட்கள் மாணவர்களுக்கு பாடம் எடுப்பார், மீதமுள்ள 3 நாட்கள் வெளியுலக தொடர்பு இல்லாமல் தனது ஆராய்ச்சியை செய்வார்."
    },
    actionStep: {
      en: "Block out two consecutive days this month entirely for deep work.",
      ta: "இந்த மாதத்தில் ஒரு சனி, ஞாயிறு இரண்டு நாட்களையும் எந்த தொந்தரவும் இல்லாமல் உங்கள் லட்சியத்திற்காக மட்டும் ஒதுக்குங்கள்."
    },
    reflectionQuestion: {
      en: "How can you divide your week or year to have periods of intense isolation and periods of connection?",
      ta: "உங்கள் வாரத்தை ஆழமான வேலைகளுக்கும், சாதாரண வேலைகளுக்கும் எப்படி பிரித்து ஒதுக்கலாம்?"
    }
  },
  {
    lessonNumber: 7,
    title: { en: "The Rhythmic Philosophy", ta: "தினசரி வழக்க முறை (Rhythmic)" },
    explanation: {
      en: "This approach creates a strict daily habit, doing deep work at the same time every day to build a rhythm.",
      ta: "தினமும் ஒரு குறிப்பிட்ட நேரத்தை ஆழமான வேலைக்காக (Deep Work) ஒதுக்கி, அதை ஒரு சங்கிலித் தொடர் போல தவறாமல் பின்பற்றுவது."
    },
    whyItMatters: {
      en: "By making it a regular habit, you remove the need for willpower to decide *when* to work deep.",
      ta: "நேரத்தை நிரந்தரமாக ஒதுக்குவதன் மூலம், 'எப்போது செய்வது' என்று யோசிக்க வேண்டியதில்லை. அதுவே ஒரு பழக்கமாக மாறிவிடும்."
    },
    example: {
      en: "Waking up at 5:00 AM every single day to write for 90 minutes before going to your regular job.",
      ta: "தினமும் அதிகாலை 5 மணி முதல் 6.30 மணி வரை எந்த ஒரு கவனச்சிதறலும் இல்லாமல் படித்துவிட்டு பிறகு மற்ற வேலைகளை பார்ப்பது."
    },
    actionStep: {
      en: "Set a specific 1-hour time slot for deep work that you will commit to every day this week.",
      ta: "இந்த வாரம் முழுவதும் தினமும் 1 மணி நேரம் ஆழமான வேலைக்காக ஒரு குறிப்பிட்ட நேரத்தை ஒதுக்குங்கள்."
    },
    reflectionQuestion: {
      en: "What time of day are you naturally most focused and least likely to be interrupted?",
      ta: "உங்கள் ஒரு நாளில், தொந்தரவுகள் இல்லாமல் நீங்கள் முழு கவனத்துடன் இருக்கக்கூடிய நேரம் எது?"
    }
  },
  {
    lessonNumber: 8,
    title: { en: "The Journalistic Philosophy", ta: "பத்திரிகையாளர் அணுகுமுறை (Journalistic)" },
    explanation: {
      en: "You fit deep work wherever you can into your schedule, switching into deep mode whenever free time opens up.",
      ta: "ஒரு பத்திரிகையாளர் எப்போது நேரம் கிடைக்கிறதோ அப்போது எழுதுவது போல, உங்களுக்கு எப்போதெல்லாம் ஓய்வு நேரம் கிடைக்கிறதோ அப்போதெல்லாம் ஆழமான வேலையை செய்வது."
    },
    whyItMatters: {
      en: "It allows highly busy people to still achieve deep work, but it requires massive mental flexibility and practice.",
      ta: "மிகவும் பிஸியான நபர்களுக்கு இது உதவியாக இருக்கும். ஆனால், திடீரென்று சாதாரண மனநிலையில் இருந்து ஆழமான மனநிலைக்கு மாறுவது கடினம்."
    },
    example: {
      en: "Using a 45-minute flight delay to instantly pull out your laptop and code a complex feature.",
      ta: "பேருந்தில் பயணம் செய்யும் ஒரு மணி நேரத்தையோ, அல்லது யாரோ ஒருவருக்காக காத்திருக்கும் நேரத்தையோ வீணாக்காமல் புத்தகம் படிக்க பயன்படுத்துவது."
    },
    actionStep: {
      en: "Keep your most important project immediately accessible so you can work on it if you suddenly get 30 free minutes.",
      ta: "உங்கள் முக்கியமான வேலையை உடனே ஆரம்பிக்கும்படி தயாராக வையுங்கள். 30 நிமிடம் ஓய்வு கிடைத்தால் உடனே அதை தொடங்க வேண்டும்."
    },
    reflectionQuestion: {
      en: "Are you skilled enough to switch from 'distracted' to 'deeply focused' on a moment's notice?",
      ta: "திடீரென்று நேரம் கிடைத்தால், உடனே உங்களால் ஒரு கடினமான வேலையை கவனத்துடன் செய்ய முடியுமா?"
    }
  },
  {
    lessonNumber: 9,
    title: { en: "Ritualize Your Deep Work", ta: "வேலைக்கு ஒரு சடங்கை உருவாக்குங்கள்" },
    explanation: {
      en: "Create strict rituals around your deep work. Where you'll work, for how long, and what rules you'll follow.",
      ta: "ஆழமான வேலையை தொடங்குவதற்கு முன் சில வழக்கங்களை (Rituals) உருவாக்குங்கள். எங்கே உட்கார்வது, என்ன குடிப்பது போன்ற விதிகளை பின்பற்றுவது உங்கள் மனதை தயார்படுத்தும்."
    },
    whyItMatters: {
      en: "Rituals tell your brain it's time to shift into deep focus, reducing the friction of starting.",
      ta: "இந்த பழக்கங்கள் உங்களின் மூளைக்கு 'இது கவனமாக வேலை செய்யும் நேரம்' என்று ஒரு சிக்னல் கொடுக்கும்."
    },
    example: {
      en: "Clearing your desk, making a cup of black coffee, and putting on noise-canceling headphones before starting.",
      ta: "படிக்க தொடங்குவதற்கு முன், அறையை சுத்தம் செய்துவிட்டு, ஒரு காபி குடித்துவிட்டு உங்களின் லேப்டாப்பை திறப்பது."
    },
    actionStep: {
      en: "Design your deep work ritual: location, duration, rules (no internet), and support (coffee/water).",
      ta: "நீங்கள் ஆழமான வேலையை எங்கு, எவ்வளவு நேரம் செய்யப் போகிறீர்கள்? என்ன விதிகளை (இணையம் பயன்படுத்தக்கூடாது) பின்பற்றப் போகிறீர்கள் என்று எழுதுங்கள்."
    },
    reflectionQuestion: {
      en: "What simple action can act as a trigger to tell your brain 'it is time to focus'?",
      ta: "எந்த ஒரு சிறிய செயலை செய்தால், உங்கள் மூளை முழு கவனத்துடன் வேலை செய்ய தயாராகும்?"
    }
  },
  {
    lessonNumber: 10,
    title: { en: "Execute Like a Business", ta: "ஒரு நிறுவனத்தை போல செயல்படுங்கள் (4DX)" },
    explanation: {
      en: "Focus on the wildly important, act on lead measures, keep a compelling scoreboard, and create a cadence of accountability.",
      ta: "மிக முக்கியமான இலக்கில் கவனம் செலுத்துங்கள், அதற்கான வேலைகளை அளவிடுங்கள், உங்கள் வெற்றிகளை ஒரு போர்டில் குறித்து வையுங்கள்."
    },
    whyItMatters: {
      en: "Execution is harder than strategizing. These principles ensure you actually DO the deep work instead of just planning it.",
      ta: "திட்டம் போடுவதை விட அதை செயல்படுத்துவது தான் கடினம். இந்த முறைகள் நீங்கள் திட்டமிட்டதை உறுதியாக செயல்படுத்த உதவும்."
    },
    example: {
      en: "Tracking the number of hours you spent in deep work (lead measure) instead of pages written (lag measure).",
      ta: "பரீட்சையில் எவ்வளவு மதிப்பெண் எடுத்தோம் என்று பார்ப்பதை விட, ஒரு நாளைக்கு எத்தனை மணி நேரம் படித்தோம் என்று அளவிடுவது சிறந்தது."
    },
    actionStep: {
      en: "Create a simple scoreboard tracking how many hours of deep work you complete this week.",
      ta: "இந்த வாரம் எத்தனை மணி நேரம் நீங்கள் எந்த கவனச்சிதறலும் இல்லாமல் உழைத்தீர்கள் என்று ஒரு போர்டில் குறித்து வையுங்கள்."
    },
    reflectionQuestion: {
      en: "What is your 'lead measure' (the daily action you can control) for your biggest goal?",
      ta: "உங்கள் இலக்கை அடைய, நீங்கள் தினமும் செய்யக்கூடிய, உங்கள் கட்டுப்பாட்டில் உள்ள வேலை (Lead measure) என்ன?"
    }
  },
  {
    lessonNumber: 11,
    title: { en: "Embrace Boredom", ta: "சலிப்பை ஏற்றுக்கொள்ளுங்கள்" },
    explanation: {
      en: "Stop constantly entertaining yourself. If you train your brain to expect a distraction every time you feel bored, you will never be able to focus.",
      ta: "எப்போதெல்லாம் சலிப்பு (Boredom) ஏற்படுகிறதோ அப்போதெல்லாம் மொபைலை எடுப்பதை நிறுத்துங்கள். சலிப்பை சகித்துக்கொள்ள பழக வேண்டும்."
    },
    whyItMatters: {
      en: "Deep work requires enduring boredom. If you are addicted to novel stimuli, deep work feels physically painful.",
      ta: "ஆழமான வேலை செய்வது சலிப்பானதாகவே இருக்கும். நீங்கள் மொபைலில் வரும் ஷார்ட்ஸ் (Shorts) வீடியோக்களுக்கு அடிமையாகி விட்டால், உங்களால் படிக்க முடியாது."
    },
    example: {
      en: "Standing in line at the grocery store without pulling out your phone to look at social media.",
      ta: "பஸ்ஸிற்காக காத்திருக்கும் போது அல்லது கடையில் வரிசையில் நிற்கும் போது, மொபைலை நோண்டாமல் உங்களை சுற்றி என்ன நடக்கிறது என்று வேடிக்கை பாருங்கள்."
    },
    actionStep: {
      en: "The next time you have a free moment waiting for something, do not look at your phone. Just wait.",
      ta: "இன்று நீங்கள் எதற்காகவாவது காத்திருக்கும் சூழ்நிலை வந்தால், தவறுதலாக கூட உங்கள் மொபைலை எடுக்காதீர்கள். அமைதியாக காத்திருங்கள்."
    },
    reflectionQuestion: {
      en: "How quickly do you reach for your phone when a task gets slightly difficult or boring?",
      ta: "ஒரு வேலை சிறிது கடினமாகவோ அல்லது சலிப்பாகவோ மாறினால், எவ்வளவு சீக்கிரம் நீங்கள் மொபைலை எடுக்கிறீர்கள்?"
    }
  },
  {
    lessonNumber: 12,
    title: { en: "Roosevelt Dashes", ta: "ரூஸ்வெல்ட் டேஷ் (Roosevelt Dash)" },
    explanation: {
      en: "Identify a deep task, estimate how long it normally takes, and then give yourself a hard deadline that is drastically shorter.",
      ta: "ஒரு வேலையை முடிக்க எவ்வளவு நேரம் ஆகும் என்று கணக்கிடுங்கள். பின்னர் அதை விட மிகக் குறைவான நேரத்தை இலக்காக வைத்து, முழு வேகத்தில் வேலை செய்யுங்கள்."
    },
    whyItMatters: {
      en: "Artificial urgency forces your brain into a state of intense concentration, leaving no room for distraction.",
      ta: "குறைந்த நேரத்தை ஒதுக்கும்போது, மூளை எந்த கவனச்சிதறலுக்கும் இடம் கொடுக்காமல் அசாதாரண வேகத்தில் செயல்படும்."
    },
    example: {
      en: "If an essay usually takes 3 hours, set a timer for 90 minutes and try to finish it with intense focus.",
      ta: "ஒரு பாடத்தை படிக்க 2 மணி நேரம் ஆகும் என்றால், 'நான் இதை 1 மணி நேரத்திற்குள் முடிப்பேன்' என்று டைமர் (Timer) வைத்துக்கொண்டு முழு வேகத்தில் படிப்பது."
    },
    actionStep: {
      en: "Pick a task for today, cut your normal time estimate in half, and race the clock to finish it.",
      ta: "இன்று நீங்கள் செய்ய வேண்டிய ஒரு வேலையை எடுத்துக்கொண்டு, அதை வழக்கமாக எடுக்கும் நேரத்தை விட பாதி நேரத்தில் முடிக்க முயற்சி செய்யுங்கள்."
    },
    reflectionQuestion: {
      en: "When was the last time you worked with a sense of intense, hyper-focused urgency?",
      ta: "கடைசியாக எப்போது ஒரு வேலையை மிகக் குறைந்த நேரத்தில் செய்து முடிக்க வேண்டும் என்று முழு மூச்சுடன் உழைத்தீர்கள்?"
    }
  },
  {
    lessonNumber: 13,
    title: { en: "Productive Meditation", ta: "பயனுள்ள தியானம் (Productive Meditation)" },
    explanation: {
      en: "Take a period of physical activity (like walking or driving) and focus your attention on a single, well-defined professional problem.",
      ta: "நடைப்பயிற்சி செய்யும்போதோ அல்லது வாகனம் ஓட்டும்போதோ, உங்களின் ஒரு முக்கியமான பிரச்சினையை எப்படி தீர்ப்பது என்று ஆழமாக சிந்திப்பது."
    },
    whyItMatters: {
      en: "It trains your ability to bring your attention back to a problem repeatedly when it wanders.",
      ta: "இது உங்கள் கவனத்தை ஒரே விஷயத்தில் குவித்து வைக்கும் திறனை வளர்க்கும்."
    },
    example: {
      en: "Thinking through the structure of a difficult article while walking the dog.",
      ta: "காலையில் வாக்கிங் (Walking) செல்லும்போது பாட்டு கேட்பதற்கு பதிலாக, உங்கள் அலுவலகத்தில் உள்ள ஒரு சிக்கலான கணக்கை எப்படி முடிப்பது என்று யோசிப்பது."
    },
    actionStep: {
      en: "Go for a 20-minute walk today without music or podcasts, and think through a specific problem.",
      ta: "இன்று மொபைல் இல்லாமல் 20 நிமிடம் நடந்து கொண்டே, உங்களின் ஒரு முக்கியமான வேலையை பற்றி சிந்தியுங்கள்."
    },
    reflectionQuestion: {
      en: "What complex problem could you solve just by thinking deeply about it while commuting?",
      ta: "பயணம் செய்யும்போது ஆழமாக சிந்திப்பதன் மூலமே உங்களால் தீர்க்கக்கூடிய ஒரு முக்கியமான பிரச்சினை என்ன?"
    }
  },
  {
    lessonNumber: 14,
    title: { en: "Quit Social Media", ta: "சமூக வலைத்தளங்களை விலக்குங்கள்" },
    explanation: {
      en: "Adopt a craftsman approach to your tools. Only use a tool if its positive impacts on your core goals substantially outweigh its negative impacts.",
      ta: "உங்கள் இலக்கை அடைய ஒரு செயலி (App) உண்மையாகவே உதவினால் மட்டுமே அதைப் பயன்படுத்துங்கள். நேரத்தை வீணாக்கும் எந்த செயலியையும் பயன்படுத்தாதீர்கள்."
    },
    whyItMatters: {
      en: "Social media is engineered to fracture your attention, making deep work incredibly difficult.",
      ta: "சமூக வலைத்தளங்கள் (Facebook, Instagram) உங்களின் கவனத்தை சிதறடிக்கவே உருவாக்கப்பட்டவை. அவை உங்கள் ஆழமான வேலைக்கு மிகப்பெரிய எதிரிகள்."
    },
    example: {
      en: "A writer might need Twitter to connect with publishers, but a programmer does not need Instagram to write better code.",
      ta: "ஒரு வீடியோ எடிட்டருக்கு (Video Editor) யூடியூப் தேவைப்படலாம். ஆனால் ஒரு மாணவனுக்கு இன்ஸ்டாகிராம் படிப்பை கெடுக்கும் ஒரு கருவி மட்டுமே."
    },
    actionStep: {
      en: "Delete the one social media app that wastes the most of your time from your phone right now.",
      ta: "உங்கள் நேரத்தை அதிக அளவில் வீணடிக்கும் ஒரு சமூக வலைத்தள செயலியை இப்போதே உங்கள் போனில் இருந்து அழித்துவிடுங்கள் (Delete)."
    },
    reflectionQuestion: {
      en: "If you quit social media for 30 days, would anyone genuinely care, and would your life be noticeably worse?",
      ta: "நீங்கள் 30 நாட்கள் எந்த சமூக வலைத்தளத்தையும் பயன்படுத்தவில்லை என்றால், நிஜமாகவே உங்கள் வாழ்க்கையில் ஏதாவது இழப்பு ஏற்படுமா?"
    }
  },
  {
    lessonNumber: 15,
    title: { en: "The Any-Benefit Approach is Flawed", ta: "'ஏதோ ஒரு லாபம்' என்ற எண்ணம் தவறானது" },
    explanation: {
      en: "People justify social media by saying 'it gives me some benefit.' But they ignore the massive opportunity cost.",
      ta: "'இதை பயன்படுத்துவதால் எனக்கு ஏதோ ஒரு சிறிய பயன் இருக்கிறது' என்று கூறி நேரத்தை வீணடிப்பதை நியாயப்படுத்தாதீர்கள்."
    },
    whyItMatters: {
      en: "A farmer doesn't buy a tractor just because it has a radio. The tool must serve the primary goal efficiently.",
      ta: "ஒரு செயலி உங்களுக்கு ஒரு சிறு லாபத்தை தந்தாலும், அது உங்களின் பல மணிநேரத்தை திருடுகிறது என்றால் அது உங்களுக்கு நஷ்டம் தான்."
    },
    example: {
      en: "Staying on Facebook to 'keep in touch with friends' while it costs you 2 hours of focus every day.",
      ta: "'நண்பர்களுடன் பேசுவதற்கு' என்று கூறிக்கொண்டு இன்ஸ்டாகிராமில் தினமும் 2 மணி நேரத்தை வீணாக்குவது மிகப் பெரிய நஷ்டம்."
    },
    actionStep: {
      en: "List the top 3 goals of your life. For each social network you use, ask if it positively contributes to those goals.",
      ta: "உங்களின் 3 முக்கிய இலக்குகளை எழுதுங்கள். நீங்கள் பயன்படுத்தும் செயலிகள் அந்த இலக்குகளை அடைய உதவுகிறதா என்று உங்களை நீங்களே கேட்டுக்கொள்ளுங்கள்."
    },
    reflectionQuestion: {
      en: "What is the true 'cost' (in hours and lost focus) of the 'benefits' you get from social media?",
      ta: "சமூக வலைத்தளங்கள் மூலம் நீங்கள் அடையும் சிறு லாபத்திற்காக, எத்தனை மணிநேரங்களை நீங்கள் விலையாக கொடுக்கிறீர்கள்?"
    }
  },
  {
    lessonNumber: 16,
    title: { en: "Drain the Shallows", ta: "ஆழமற்ற வேலைகளை குறையுங்கள்" },
    explanation: {
      en: "Aggressively reduce the amount of shallow work in your schedule. You cannot avoid it entirely, but you can minimize it.",
      ta: "உங்கள் நாள் முழுவதும் உள்ள தேவையற்ற சாதாரண வேலைகளை பெருமளவு குறைத்துக்கொள்ளுங்கள்."
    },
    whyItMatters: {
      en: "Every minute spent on shallow work is a minute stolen from deep, meaningful work.",
      ta: "சாதாரண வேலைகளில் நீங்கள் செலவிடும் ஒவ்வொரு நிமிடமும், நீங்கள் சாதிக்க வேண்டிய ஆழமான வேலையிலிருந்து திருடப்படுகிறது."
    },
    example: {
      en: "Batching all your email replies into two 30-minute windows instead of checking your inbox all day.",
      ta: "நாள் முழுவதும் இமெயில்களை (Email) பார்த்துக்கொண்டிருக்காமல், அதற்கென மதியம் 30 நிமிடம் மட்டும் ஒதுக்கி மொத்தமாக பதில் அளிப்பது."
    },
    actionStep: {
      en: "Schedule every minute of your day using time-blocking so shallow work doesn't expand to fill your time.",
      ta: "உங்கள் நாளை ஒவ்வொரு நிமிடமும் திட்டமிடுங்கள் (Time-blocking). எந்த நேரத்தில் எந்த வேலை என்று சரியாக குறித்து வையுங்கள்."
    },
    reflectionQuestion: {
      en: "How much of your 8-hour workday is actually spent creating true value?",
      ta: "உங்கள் 8 மணி நேர வேலையில், உண்மையாகவே உங்கள் மதிப்பை உயர்த்தும் வேலைக்காக எவ்வளவு நேரம் செலவிடுகிறீர்கள்?"
    }
  },
  {
    lessonNumber: 17,
    title: { en: "Schedule Every Minute of Your Day", ta: "உங்கள் நாளின் ஒவ்வொரு நிமிடத்தையும் திட்டமிடுங்கள்" },
    explanation: {
      en: "Use time-blocking to plan your entire day. This doesn't mean you can't change the plan, but you should always have a plan.",
      ta: "உங்கள் நாள் முழுவதும் என்ன செய்யப்போகிறீர்கள் என்பதை ஒரு காகிதத்தில் அட்டவணைப்படுத்துங்கள் (Time-blocking)."
    },
    whyItMatters: {
      en: "When you don't plan your time, you default to what is easiest (shallow work and distractions).",
      ta: "நீங்கள் நேரத்தை திட்டமிடவில்லை என்றால், உங்கள் மூளை தானாகவே எளிதான மற்றும் தேவையற்ற வேலைகளை செய்யவே தூண்டும்."
    },
    example: {
      en: "Writing out a schedule where 9-11 is Deep Work, 11-12 is Emails, and 12-1 is Lunch.",
      ta: "காலை 9-11 மணி வரை படிப்பு, 11-12 வரை மற்ற வேலைகள், 12-1 மணி வரை உணவு என்று தெளிவாக எழுதி வைத்து பின்பற்றுவது."
    },
    actionStep: {
      en: "Before you sleep tonight, draw blocks on a piece of paper planning out tomorrow's schedule.",
      ta: "இன்று இரவு தூங்குவதற்கு முன், நாளை எந்தெந்த நேரத்தில் என்னென்ன வேலைகளை செய்யப்போகிறீர்கள் என்று எழுதி வையுங்கள்."
    },
    reflectionQuestion: {
      en: "Do you run your day, or does your day (and other people's requests) run you?",
      ta: "உங்கள் நாளை நீங்கள் கட்டுப்படுத்துகிறீர்களா? அல்லது மற்றவர்களின் தேவைகள் உங்கள் நாளை வீணாக்குகிறதா?"
    }
  },
  {
    lessonNumber: 18,
    title: { en: "Finish Your Work by 5:30", ta: "உங்கள் வேலையை மாலை 5:30-க்குள் முடியுங்கள்" },
    explanation: {
      en: "Fixed-schedule productivity: set a firm limit on when you stop working, and ruthlessly prioritize to finish within that time.",
      ta: "உங்கள் வேலை செய்யும் நேரத்திற்கு ஒரு எல்லையை (Limit) நிர்ணயித்துக் கொள்ளுங்கள். மாலை 5.30 மணிக்கு மேல் வேலையை பற்றி சிந்திக்கக் கூடாது."
    },
    whyItMatters: {
      en: "It forces you to be highly efficient and eliminates the tendency to let work drag on into the evening.",
      ta: "ஒரு குறிப்பிட்ட நேரத்திற்குள் முடிக்க வேண்டும் என்ற நெருக்கடி இருந்தால், நீங்கள் தேவையற்ற வேலைகளை செய்யாமல் முழு கவனத்துடன் உழைப்பீர்கள்."
    },
    example: {
      en: "Refusing to take a late-afternoon meeting because it violates your 5:30 PM cutoff rule.",
      ta: "மாலை 5.30 மணிக்கு மேல் எந்த ஒரு அலுவலக அழைப்புகளையும் (Calls) தவிர்ப்பது மற்றும் குடும்பத்துடன் நேரம் செலவிடுவது."
    },
    actionStep: {
      en: "Set a strict shutdown time for today, after which you will not check emails or do any work.",
      ta: "இன்று உங்களின் வேலைகளை முடிக்க ஒரு நேரத்தை முடிவு செய்து, அதற்கு மேல் வேலையை பற்றி சிந்திக்காமல் உங்களின் மூளைக்கு ஓய்வு கொடுங்கள்."
    },
    reflectionQuestion: {
      en: "If you had to leave work by 5:00 PM every day, what useless tasks would you immediately stop doing?",
      ta: "தினமும் மாலை 5 மணிக்கே வேலையை முடிக்க வேண்டும் என்ற சூழ்நிலை வந்தால், எந்தெந்த தேவையற்ற வேலைகளை நீங்கள் உடனே நிறுத்துவீர்கள்?"
    }
  },
  {
    lessonNumber: 19,
    title: { en: "The Shutdown Ritual", ta: "வேலையை முடிக்கும் சடங்கு (Shutdown Ritual)" },
    explanation: {
      en: "Have a strict ritual at the end of the workday to signify that work is over, ensuring your brain stops thinking about incomplete tasks.",
      ta: "தினமும் வேலையை முடித்தவுடன் உங்களின் மூளைக்கு 'இன்றைய வேலை முடிந்தது' என்று ஒரு கட்டளை கொடுக்க ஒரு சிறு வழக்கத்தை உருவாக்குங்கள்."
    },
    whyItMatters: {
      en: "Your brain needs true rest to recharge for the next day's deep work. Lingering anxiety prevents this recovery.",
      ta: "உங்கள் மூளைக்கு முழுமையான ஓய்வு தேவை. முடிக்காத வேலைகளைப் பற்றிய சிந்தனையே இருந்தால் உங்களால் மறுநாள் ஆழமாக வேலை செய்ய முடியாது."
    },
    example: {
      en: "Reviewing your tasks for tomorrow, closing your laptop, and saying out loud 'Shutdown complete'.",
      ta: "நாளை செய்ய வேண்டிய வேலைகளை எழுதி வைத்துவிட்டு, லேப்டாப்பை மூடி 'இன்றைய வேலை முழுமையாக முடிந்தது' என்று சத்தமாக சொல்வது."
    },
    actionStep: {
      en: "Create a 5-minute shutdown routine to mentally separate your workday from your evening.",
      ta: "வேலையை முடிக்கும்போது, உங்கள் மூளைக்கு அமைதி தரக்கூடிய 5 நிமிட வழக்கத்தை (Shutdown routine) உருவாக்குங்கள்."
    },
    reflectionQuestion: {
      en: "How often do you ruin your evening rest by checking 'just one more email'?",
      ta: "வீட்டிற்கு வந்த பிறகும் 'ஒரே ஒரு மெசேஜ் மட்டும் பார்த்து விடுகிறேன்' என்று சொல்லி உங்கள் ஓய்வை எவ்வளவு முறை கெடுத்துள்ளீர்கள்?"
    }
  },
  {
    lessonNumber: 20,
    title: { en: "Become Hard to Reach", ta: "எளிதில் தொடர்புகொள்ள முடியாத நபராக மாறுங்கள்" },
    explanation: {
      en: "Make people do more work to contact you. Do not feel obligated to reply to every email or message.",
      ta: "மற்றவர்கள் உங்களை எளிதில் தொடர்புகொள்ள முடியாதபடி ஒரு இடைவெளியை ஏற்படுத்துங்கள். ஒவ்வொரு சாதாரண மெசேஜுக்கும் உடனே பதில் அளிக்க வேண்டும் என்ற அவசியம் இல்லை."
    },
    whyItMatters: {
      en: "If you are constantly available to others, your attention is at the mercy of their priorities, not yours.",
      ta: "நீங்கள் எப்போது கூப்பிட்டாலும் வருபவராக இருந்தால், மற்றவர்கள் உங்கள் நேரத்தை அவர்களின் தேவைக்காக எளிதாக திருடி விடுவார்கள்."
    },
    example: {
      en: "Setting an email autoresponder saying 'I check email twice a day. If urgent, call my assistant.'",
      ta: "உங்கள் வாட்ஸ்அப் அல்லது சமூக வலைத்தளங்களில் 'அவசரம் என்றால் மட்டும் அழைக்கவும்' என்று கூறி நோட்டிபிகேஷனை ஆஃப் (Off) செய்து வைப்பது."
    },
    actionStep: {
      en: "Leave an email or text message unread today if it doesn't align with your deep work priorities.",
      ta: "உங்கள் முக்கியமான வேலையை பாதிக்கக்கூடிய சாதாரண மெசேஜ்களுக்கு இன்று உடனே பதில் அளிக்காமல் தள்ளிப் போடுங்கள்."
    },
    reflectionQuestion: {
      en: "Are you sacrificing your own deep work just to please others with fast reply times?",
      ta: "மற்றவர்களை திருப்திப்படுத்த வேண்டும் என்பதற்காக, உடனுக்குடன் பதில் அளித்து உங்களின் முக்கியமான வேலையை கெடுத்துக்கொள்கிறீர்களா?"
    }
  }
]
  }
,
  {
  title: "The Magic of Thinking Big",
  author: "David J. Schwartz",
  coverImage: "https://covers.openlibrary.org/b/isbn/0671646788-L.jpg",
  categories: ["Success", "Mindset", "Personal Development"],
  themes: [
    { en: "Belief is Power", ta: "நம்பிக்கையே சக்தி" },
    { en: "Cure Excusitis", ta: "சாக்குப்போக்கு சொல்வதை நிறுத்துங்கள்" }
  ],
  overview: {
    en: "The Magic of Thinking Big gives you useful methods, not empty promises. Dr. Schwartz presents a carefully designed program for getting the most out of your job, your marriage and family life, and your community. He proves that you don't need to be an intellectual or have innate talent to attain great success.",
    ta: "பெரிதாக சிந்திப்பதன் மூலம் நீங்கள் எப்படி பெரிய வெற்றிகளை அடையலாம் என்பதை இந்தப் புத்தகம் விளக்குகிறது. வெற்றிக்கு அதீத அறிவோ திறமையோ தேவையில்லை, சரியான சிந்தனை முறை மட்டுமே தேவை என்பதை டாக்டர் ஸ்வார்ட்ஸ் நிரூபிக்கிறார்."
  },
  topQuotes: [
    { en: "Believe it can be done. When you believe something can be done, really believe, your mind will find the ways to do it.", ta: "உங்களால் முடியும் என்று முழுமையாக நம்புங்கள். அப்படி நம்பும்போது, அதை எப்படி செய்வது என்று உங்கள் மனமே ஒரு வழியை கண்டுபிடிக்கும்." },
    { en: "Action cures fear.", ta: "செயல் பயத்தை குணப்படுத்தும்." }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: "Believe You Can Succeed", ta: "உங்களால் வெற்றி பெற முடியும் என்று நம்புங்கள்" },
      explanation: {
        en: "Belief is the thermostat that regulates what we accomplish in life. If you believe you are worth little, you will receive little. If you believe you can succeed, you will.",
        ta: "நம்பிக்கை தான் உங்களின் வெற்றியை தீர்மானிக்கிறது. உங்களை நீங்களே குறைவாக மதிப்பிட்டால், உங்களுக்கு கிடைப்பதும் குறைவாகவே இருக்கும். உங்களால் முடியும் என்று நம்பினால் கண்டிப்பாக வெற்றி பெறுவீர்கள்."
      },
      whyItMatters: {
        en: "Your brain finds ways to achieve what you truly believe is possible. Doubt creates obstacles; belief creates pathways.",
        ta: "நீங்கள் எதை முடியும் என்று நம்புகிறீர்களோ, அதை செய்து முடிக்க உங்கள் மூளை வழிகளைத் தேடும். சந்தேகம் தடைகளை உருவாக்கும்; நம்பிக்கை வழிகளை உருவாக்கும்."
      },
      example: {
        en: "A salesperson who truly believes they have the best product will naturally sell more than someone who doubts it.",
        ta: "தன்னால் வெற்றி பெற முடியும் என்று முழுமையாக நம்பும் ஒரு நபர், அதிக திறமை இருந்தும் சந்தேகம் கொண்டவரை விட எளிதாக வெற்றி பெறுவார்."
      },
      actionStep: {
        en: "Write down your biggest goal and say out loud 'I believe I will achieve this' three times.",
        ta: "உங்கள் மிகப்பெரிய இலக்கை ஒரு தாளில் எழுதி, 'இதை என்னால் அடைய முடியும் என்று நான் நம்புகிறேன்' என்று மூன்று முறை சத்தமாக சொல்லுங்கள்."
      },
      reflectionQuestion: {
        en: "What is one big goal you have secretly given up on because you didn't believe you could do it?",
        ta: "உங்களால் முடியாது என்று நம்பி, நீங்கள் பாதியிலேயே கைவிட்ட ஒரு பெரிய கனவு என்ன?"
      }
    },
    {
      lessonNumber: 2,
      title: { en: "Cure Yourself of Excusitis", ta: "சாக்குப்போக்கு வியாதியை குணப்படுத்துங்கள்" },
      explanation: {
        en: "Unsuccessful people suffer from 'excusitis' - the disease of making excuses about age, intelligence, health, or luck.",
        ta: "தோல்வியடைபவர்கள் அனைவரும் 'சாக்குப்போக்கு வியாதியால்' (Excusitis) பாதிக்கப்பட்டவர்கள். எனக்கு வயது இல்லை, அதிர்ஷ்டம் இல்லை, அறிவு இல்லை என்று அவர்கள் தொடர்ந்து காரணங்களை சொல்வார்கள்."
      },
      whyItMatters: {
        en: "Every time you make an excuse, you reinforce the belief that you are powerless to change your life.",
        ta: "ஒவ்வொரு முறை நீங்கள் சாக்குப்போக்கு சொல்லும்போதும், உங்களால் உங்கள் வாழ்க்கையை மாற்ற முடியாது என்ற எண்ணத்தை உங்களுக்கு நீங்களே உறுதிப்படுத்துகிறீர்கள்."
      },
      example: {
        en: "Instead of saying 'I'm too old to start a business', say 'I have more experience now than ever before.'",
        ta: "'நான் ஒரு தொழிலை தொடங்க எனக்கு வயது அதிகமாகிவிட்டது' என்று சொல்வதற்கு பதிலாக, 'இப்போது தான் எனக்கு அதிக அனுபவம் இருக்கிறது' என்று கூறுங்கள்."
      },
      actionStep: {
        en: "Identify your most common excuse (e.g., 'I don't have time') and completely ban it from your vocabulary today.",
        ta: "நீங்கள் அடிக்கடி சொல்லும் ஒரு காரணத்தை (உதாரணம்: எனக்கு நேரமில்லை) கண்டறிந்து, இன்று முதல் அதை சொல்லவே கூடாது என்று உறுதி எடுங்கள்."
      },
      reflectionQuestion: {
        en: "What excuse have you been using to justify staying in your current situation?",
        ta: "நீங்கள் இப்போது இருக்கும் சூழ்நிலையிலேயே தேங்கி கிடப்பதற்கு, எந்த சாக்குப்போக்கை காரணமாக கூறி உங்களை நீங்களே ஏமாற்றிக்கொள்கிறீர்கள்?"
      }
    },
    {
      lessonNumber: 3,
      title: { en: "Intelligence Excusitis", ta: "அறிவு இல்லை என்ற சாக்குப்போக்கு" },
      explanation: {
        en: "People overestimate the brainpower of others and underestimate their own. What matters is not how much intelligence you have, but how you use what you have.",
        ta: "மக்கள் மற்றவர்களின் புத்திசாலித்தனத்தை அதிகமாகவும், தங்களின் புத்திசாலித்தனத்தை குறைவாகவும் மதிப்பிடுகிறார்கள். உங்களுக்கு எவ்வளவு அறிவு இருக்கிறது என்பதை விட, இருக்கும் அறிவை எப்படி பயன்படுத்துகிறீர்கள் என்பதே முக்கியம்."
      },
      whyItMatters: {
        en: "Attitude is more important than intelligence. A highly intelligent person with a negative attitude will achieve less than an average person with a positive attitude.",
        ta: "அறிவை விட உங்கள் அணுகுமுறை (Attitude) முக்கியம். சிறந்த அறிவாளியாக இருந்து எதிர்மறையாக சிந்திப்பதை விட, சாதாரண ஆளாக இருந்து நேர்மறையாக சிந்திப்பதே சிறந்தது."
      },
      example: {
        en: "A passionate average student will outwork and eventually outperform a lazy genius.",
        ta: "கடினமாக உழைக்கும் ஒரு சாதாரண மாணவன், உழைக்க விரும்பாத ஒரு அதிபுத்திசாலியை விட வாழ்க்கையில் எளிதாக முன்னேறிவிடுவான்."
      },
      actionStep: {
        en: "Stop comparing your intelligence to others. Focus on applying the knowledge you already have.",
        ta: "உங்கள் அறிவை மற்றவர்களுடன் ஒப்பிடுவதை நிறுத்துங்கள். உங்களுக்கு தெரிந்த விஷயங்களை சரியாக செயல்படுத்துவதில் கவனம் செலுத்துங்கள்."
      },
      reflectionQuestion: {
        en: "Do you focus more on how smart you are, or on how well you think?",
        ta: "நீங்கள் எவ்வளவு புத்திசாலி என்று யோசிக்கிறீர்களா? அல்லது உங்கள் சிந்தனைகள் எவ்வளவு சிறப்பாக இருக்கிறது என்று யோசிக்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 4,
      title: { en: "Build Confidence and Destroy Fear", ta: "நம்பிக்கையை வளர்த்து பயத்தை ஒழிக்கவும்" },
      explanation: {
        en: "Fear is real, but action cures fear. Indecision and postponement fertilize fear.",
        ta: "பயம் என்பது நிஜம் தான், ஆனால் எந்த ஒரு செயலிலும் இறங்கி வேலை செய்வது பயத்தை போக்கும். தயக்கமும், வேலையை தள்ளிப்போடுதலும் பயத்தை அதிகரிக்கும்."
      },
      whyItMatters: {
        en: "If you wait until you are no longer afraid, you will never start. Confidence is acquired through doing the things you fear.",
        ta: "பயம் போன பிறகு தொடங்கலாம் என்று காத்திருந்தால், உங்களால் எதையுமே தொடங்க முடியாது. நீங்கள் எதைக்கண்டு பயப்படுகிறீர்களோ, அதை செய்வதன் மூலமே தன்னம்பிக்கை வளரும்."
      },
      example: {
        en: "If you are afraid of public speaking, the only cure is to start speaking in public.",
        ta: "மேடையில் பேச பயமாக இருந்தால், தைரியமாக ஒரு மேடையில் ஏறி பேசுவது மட்டுமே அந்த பயத்தை போக்க ஒரே வழி."
      },
      actionStep: {
        en: "Identify one small thing you fear doing today (e.g., making a difficult phone call) and do it immediately.",
        ta: "இன்று நீங்கள் பயப்படும் ஒரு சிறிய விஷயத்தை (உதாரணம்: ஒரு கடினமான போன் கால் பேசுவது) தேர்ந்தெடுத்து, அதை உடனே செய்து முடியுங்கள்."
      },
      reflectionQuestion: {
        en: "What is one thing you would do today if you knew you could not fail?",
        ta: "நீங்கள் தோற்கவே மாட்டீர்கள் என்று தெரிந்தால், இன்று எந்த ஒரு கடினமான செயலை நீங்கள் தைரியமாக செய்வீர்கள்?"
      }
    },
    {
      lessonNumber: 5,
      title: { en: "How to Think Big", ta: "பெரிதாக சிந்திப்பது எப்படி" },
      explanation: {
        en: "Use big, positive, cheerful words. Picture success, not failure. See what can be, not just what is.",
        ta: "எப்போதும் பெரிய, நேர்மறையான, உற்சாகமான வார்த்தைகளை பயன்படுத்துங்கள். தோல்வியை அல்ல, வெற்றியை கற்பனை செய்து பாருங்கள். இருப்பதை மட்டும் பார்க்காமல், இனி என்னவாக முடியும் என்று சிந்தித்து பாருங்கள்."
      },
      whyItMatters: {
        en: "Your mind operates on pictures. If you think small thoughts, you get small results. Thinking big expands your possibilities.",
        ta: "உங்கள் மனம் நீங்கள் கற்பனை செய்யும் படங்களை வைத்தே வேலை செய்கிறது. நீங்கள் சிறியதாக சிந்தித்தால் சிறிய முடிவுகளே கிடைக்கும். பெரிதாக சிந்தித்தால் பெரிய வாய்ப்புகள் தேடி வரும்."
      },
      example: {
        en: "Instead of thinking 'I want to survive this month', think 'I want to double my income this year.'",
        ta: "'இந்த மாதம் எப்படியாவது செலவை சமாளித்து விட வேண்டும்' என்று சிந்திக்காமல், 'இந்த வருடம் எனது வருமானத்தை இரண்டு மடங்காக ஆக்குவேன்' என்று பெரிதாக சிந்தியுங்கள்."
      },
      actionStep: {
        en: "Replace negative words in your vocabulary today. Instead of 'it's impossible', use 'how can we make it possible?'",
        ta: "இன்று எதிர்மறையான வார்த்தைகளை தவிர்த்து விடுங்கள். 'இது முடியாது' என்று சொல்வதற்கு பதிலாக, 'இதை எப்படி சாத்தியமாக்கலாம்?' என்று கேட்டுப் பழகவும்."
      },
      reflectionQuestion: {
        en: "When you imagine your future, do you see limitations or opportunities?",
        ta: "உங்களின் எதிர்காலத்தை கற்பனை செய்யும்போது, தடைகள் உங்கள் கண்ணுக்கு தெரிகிறதா? அல்லது வாய்ப்புகள் தெரிகிறதா?"
      }
    },
    {
      lessonNumber: 6,
      title: { en: "Add Value to Things", ta: "விஷயங்களின் மதிப்பை கூட்டுங்கள்" },
      explanation: {
        en: "A big thinker always visualizes what can be done in the future. See the potential in yourself, in others, and in situations.",
        ta: "பெரிதாக சிந்திப்பவர் எப்போதுமே, எதிர்காலத்தில் ஒரு விஷயத்தை எப்படி இன்னும் சிறப்பாக மாற்றலாம் என்று தான் யோசிப்பார். உங்களிலும், மற்றவர்களிலும் உள்ள திறமைகளை கண்டறியுங்கள்."
      },
      whyItMatters: {
        en: "Adding value makes you indispensable. People pay for value, not just time or effort.",
        ta: "மதிப்பை கூட்டுவது உங்களை யாருடனும் ஒப்பிட முடியாத நபராக மாற்றும். மக்கள் உங்களிடம் உள்ள திறமைக்கு தான் மதிப்பு கொடுப்பார்களே தவிர, உங்கள் நேரத்திற்கு அல்ல."
      },
      example: {
        en: "A small thinker sees a barren plot of land. A big thinker sees a thriving shopping mall.",
        ta: "சிறிய சிந்தனை உள்ளவர் ஒரு காலியான நிலத்தை பார்ப்பார். ஆனால் பெரிதாக சிந்திப்பவர் அந்த இடத்தில் ஒரு பெரிய வணிக வளாகம் (Shopping mall) அமைவதை கற்பனை செய்வார்."
      },
      actionStep: {
        en: "Look at one project or task today and ask yourself, 'How can I add 10% more value to this?'",
        ta: "இன்று நீங்கள் செய்யும் ஒரு வேலையை எடுத்துக்கொண்டு, 'இதை இன்னும் எப்படி 10 சதவீதம் சிறப்பாக செய்யலாம்?' என்று யோசியுங்கள்."
      },
      reflectionQuestion: {
        en: "Are you seeing yourself as you are now, or as the highly successful person you can become?",
        ta: "நீங்கள் உங்களை இப்போதிருக்கும் சாதாரண நிலையிலேயே பார்க்கிறீர்களா? அல்லது எதிர்காலத்தில் நீங்கள் அடையப்போகும் மிக உயர்ந்த நிலையில் வைத்துப் பார்க்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 7,
      title: { en: "Look Important, Think Important", ta: "முக்கியமானவராக தோன்றுங்கள், முக்கியமானதாக சிந்தியுங்கள்" },
      explanation: {
        en: "Your appearance talks to you. When you look successful, you feel and think successfully.",
        ta: "உங்கள் தோற்றம் உங்களுடனேயே பேசும். நீங்கள் நேர்த்தியாக உடை அணிந்திருக்கும் போது, உங்களின் தன்னம்பிக்கை தானாகவே அதிகரிக்கும்."
      },
      whyItMatters: {
        en: "How you treat yourself dictates how others treat you. If you dress poorly, you feel inferior.",
        ta: "உங்களை நீங்கள் எப்படி நடத்துகிறீர்களோ, அப்படித்தான் மற்றவர்களும் உங்களை நடத்துவார்கள். நீங்கள் சிறப்பாக உடை அணிந்தால், உங்களுக்குள் ஒரு சக்தி உருவாகும்."
      },
      example: {
        en: "Wearing a well-fitted suit to a meeting instantly changes your posture and the respect you command.",
        ta: "ஒரு முக்கியமான கூட்டத்திற்கு நல்ல சுத்தமான, நேர்த்தியான ஆடைகளை அணிந்து சென்றால், உங்களின் பேச்சிலும் ஒரு தைரியம் பிறக்கும்."
      },
      actionStep: {
        en: "Dress 20% better than usual today, even if you are just working from home.",
        ta: "இன்று வழக்கத்தை விட 20 சதவீதம் நேர்த்தியாக உடை அணிந்து பாருங்கள். உங்கள் தன்னம்பிக்கை எப்படி உயர்கிறது என்பதை கவனிப்பீர்கள்."
      },
      reflectionQuestion: {
        en: "Does your physical appearance match the level of success you want to achieve?",
        ta: "நீங்கள் அடைய நினைக்கும் மிகப்பெரிய வெற்றிக்கு தகுந்தாற்போல் உங்களின் தோற்றமும் பழக்கவழக்கங்களும் உள்ளதா?"
      }
    },
    {
      lessonNumber: 8,
      title: { en: "Think Like a Leader", ta: "ஒரு தலைவரை போல சிந்தியுங்கள்" },
      explanation: {
        en: "Trade minds with the people you want to influence. Think: 'What would I think of this if I were the other person?'",
        ta: "மற்றவர்களை புரிந்து கொள்ள அவர்கள் நிலையில் இருந்து சிந்தியுங்கள். 'நான் அவர்கள் இடத்தில் இருந்தால் எப்படி யோசிப்பேன்?' என்று சிந்திப்பதே ஒரு சிறந்த தலைவரின் குணம்."
      },
      whyItMatters: {
        en: "Leadership is about understanding people. You cannot influence others if you only see things from your perspective.",
        ta: "உங்களின் கோணத்தில் மட்டுமே பார்த்தால் யாரையும் உங்களால் ஈர்க்க முடியாது. மற்றவர்கள் என்ன நினைக்கிறார்கள் என்பதை புரிந்து கொண்டால் மட்டுமே வெற்றி கிடைக்கும்."
      },
      example: {
        en: "Before writing an email to a client, ask yourself how they will feel reading it.",
        ta: "ஒருவரிடம் பேசுவதற்கு முன்போ அல்லது ஒரு வேலை கொடுப்பதற்கு முன்போ, 'எனக்கு இந்த வேலையை கொடுத்தால் நான் எப்படி உணர்வேன்?' என்று யோசிப்பது."
      },
      actionStep: {
        en: "In your next interaction, consciously try to see the situation entirely from the other person's point of view.",
        ta: "இன்று நீங்கள் அடுத்தவருடன் பேசும்போது, அந்த சூழ்நிலையை அவர்களின் பார்வையில் இருந்து முழுமையாக புரிந்து கொள்ள முயற்சி செய்யுங்கள்."
      },
      reflectionQuestion: {
        en: "Do you listen to understand, or do you just listen to reply?",
        ta: "நீங்கள் மற்றவர்கள் சொல்வதை புரிந்து கொள்ள காது கொடுத்து கேட்கிறீர்களா? அல்லது உடனே பதில் சொல்ல வேண்டும் என்பதற்காக கேட்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 9,
      title: { en: "Manage Your Environment", ta: "உங்களைச் சுற்றியுள்ள சூழ்நிலையை மாற்றுங்கள்" },
      explanation: {
        en: "Your mind reflects your environment. Associate with positive, ambitious people. Avoid gossip and negative thinkers.",
        ta: "உங்கள் மனநிலை நீங்கள் இருக்கும் சூழ்நிலையை பொறுத்தே அமையும். நேர்மறையான எண்ணம் கொண்ட மனிதர்களுடன் பழகுங்கள். புறம் பேசுபவர்கள் மற்றும் எதிர்மறையான நபர்களை விட்டு விலகுங்கள்."
      },
      whyItMatters: {
        en: "You become like the people you spend the most time with. Negative people will drag you down to their level.",
        ta: "நீங்கள் யாருடன் அதிக நேரம் செலவிடுகிறீர்களோ, அவர்களைப் போலவே நீங்களும் மாறுவீர்கள். எதிர்மறையான மனிதர்கள் உங்களின் நம்பிக்கையையும் அழித்துவிடுவார்கள்."
      },
      example: {
        en: "Spending time with entrepreneurs will make you want to start a business. Spending time with complainers will make you complain.",
        ta: "சாதிக்க துடிக்கும் மனிதர்களுடன் இருந்தால் உங்களுக்கும் சாதிக்க வேண்டும் என்ற ஆசை வரும். எதற்கெடுத்தாலும் குறை சொல்பவர்களுடன் இருந்தால் நீங்களும் அப்படியே மாறுவீர்கள்."
      },
      actionStep: {
        en: "Identify one negative person in your life and limit your interaction with them starting today.",
        ta: "உங்கள் வாழ்வில் உள்ள ஒரு எதிர்மறையான நபரை அடையாளம் கண்டு, இன்று முதல் அவர்களிடம் பேசுவதையும் பழகுவதையும் குறைத்துக்கொள்ளுங்கள்."
      },
      reflectionQuestion: {
        en: "Are your close friends helping you grow, or are they keeping you exactly where you are?",
        ta: "உங்களின் நெருங்கிய நண்பர்கள் நீங்கள் வாழ்க்கையில் முன்னேற உதவுகிறார்களா? அல்லது உங்களை அதே இடத்திலேயே முடக்கி வைக்கிறார்களா?"
      }
    },
    {
      lessonNumber: 10,
      title: { en: "Make Your Attitudes Your Allies", ta: "உங்கள் மனப்பான்மையை நண்பனாக்குங்கள்" },
      explanation: {
        en: "Grow the 'I'm activated' attitude. Grow the 'You are important' attitude. Grow the 'Service first' attitude.",
        ta: "'நான் எப்போதும் தயார்', 'நீங்களும் முக்கியமானவர்', 'முதலில் சிறந்த சேவை' - என்ற இந்த மூன்று மனப்பான்மைகளை (Attitude) வளர்த்துக்கொள்ளுங்கள்."
      },
      whyItMatters: {
        en: "People can read your attitude. If you are enthusiastic, others will be too. If you show people they are important, they will support you.",
        ta: "உங்களின் மனப்பான்மையை மக்கள் எளிதாக உணர்ந்து கொள்வார்கள். நீங்கள் உற்சாகமாக இருந்தால், உங்களை சுற்றியுள்ளவர்களும் உற்சாகமாக இருப்பார்கள்."
      },
      example: {
        en: "A waiter who genuinely cares about giving great service earns more tips than one who is just doing a job.",
        ta: "வாடிக்கையாளர்களை மனதார உபசரித்து சிறப்பான சேவை வழங்கும் ஒரு கடைக்காரர், வெறும் லாபத்திற்காக மட்டும் கடை நடத்துவபரை விட அதிக வாடிக்கையாளர்களை பெறுவார்."
      },
      actionStep: {
        en: "Treat the next person you meet today as if they are the most important person in the world.",
        ta: "இன்று நீங்கள் சந்திக்கும் அடுத்த நபரை, அவரே இந்த உலகின் மிக முக்கியமான மனிதர் என்பது போல மரியாதையுடன் நடத்துங்கள்."
      },
      reflectionQuestion: {
        en: "Does your attitude inspire energy in others, or does it drain them?",
        ta: "உங்களின் பேச்சும் செயலும் மற்றவர்களுக்கு உற்சாகத்தை தருகிறதா? அல்லது அவர்களின் ஆற்றலை உறிஞ்சுகிறதா?"
      }
    },
    {
      lessonNumber: 11,
      title: { en: "Think Right Toward People", ta: "மக்களைப் பற்றி சரியாக சிந்தியுங்கள்" },
      explanation: {
        en: "Success depends on the support of other people. The only hurdle between you and what you want to be is the support of others.",
        ta: "வெற்றி என்பது மற்றவர்களின் ஆதரவைப் பொறுத்தே அமையும். உங்களுக்கும் உங்கள் வெற்றிக்கும் இடையில் உள்ள ஒரே பாலம் மற்ற மனிதர்களின் ஆதரவு தான்."
      },
      whyItMatters: {
        en: "You cannot achieve massive success alone. If people like you, they will help you. If they don't, they will block you.",
        ta: "யாராலும் தனியாக மிகப்பெரிய வெற்றியை அடைய முடியாது. மக்கள் உங்களை விரும்பினால் தான் உங்களுக்கு உதவுவார்கள்."
      },
      example: {
        en: "Taking the time to remember people's names and asking about their families builds incredible loyalty.",
        ta: "ஒருவரின் பெயரை நினைவில் வைத்துக்கொண்டு அவரை பெயர் சொல்லி அழைப்பதும், அன்புடன் விசாரிப்பதும் பெரிய விசுவாசத்தை உருவாக்கும்."
      },
      actionStep: {
        en: "Find something genuinely good about a person you dislike, and sincerely compliment them mentally.",
        ta: "உங்களுக்கு பிடிக்காத ஒரு நபரிடம் உள்ள ஒரு நல்ல குணத்தை கண்டுபிடித்து, இன்று மனதிற்குள் அவர்களைப் பாராட்டுங்கள்."
      },
      reflectionQuestion: {
        en: "Do you genuinely like people, or do you view them merely as tools for your success?",
        ta: "நீங்கள் உண்மையாகவே மனிதர்களை மதிக்கிறீர்களா? அல்லது அவர்கள் உங்கள் வெற்றிக்கு பயன்படும் கருவிகள் என்று நினைக்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 12,
      title: { en: "Get the Action Habit", ta: "செயல்படும் பழக்கத்தை உருவாக்குங்கள்" },
      explanation: {
        en: "Do not wait until conditions are perfect. They never will be. Expect future obstacles and solve them as they arise.",
        ta: "எல்லா சூழ்நிலைகளும் சரியாக மாறும் வரை காத்திருக்காதீர்கள். அது ஒருபோதும் நடக்காது. வேலையைத் தொடங்குங்கள், தடைகள் வரும்போது அதைப் பார்த்துக்கொள்ளலாம்."
      },
      whyItMatters: {
        en: "Ideas alone are worthless. Only action brings results. Procrastination kills ambition.",
        ta: "வெறும் எண்ணங்களுக்கு எந்த மதிப்பும் இல்லை. செயல்கள் மட்டுமே முடிவுகளைத் தரும். தள்ளிப்போடும் பழக்கம் உங்கள் லட்சியத்தையே கொன்றுவிடும்."
      },
      example: {
        en: "Instead of planning a diet for a month, throw out all junk food in your house today.",
        ta: "உடற்பயிற்சி செய்ய அடுத்த வாரம் ஜிம்மில் (Gym) சேரலாம் என்று யோசிப்பதற்கு பதிலாக, இன்று மாலையே ஒரு அரை மணி நேரம் வாக்கிங் செல்லுங்கள்."
      },
      actionStep: {
        en: "Take one physical action right now towards a goal you have been planning for a long time.",
        ta: "நீங்கள் பல நாட்களாக திட்டமிட்டுக்கொண்டிருக்கும் ஒரு செயலை எடுத்துக்கொண்டு, அதற்கான முதல் படியை இப்போதே எடுத்து வையுங்கள்."
      },
      reflectionQuestion: {
        en: "What is one project you are delaying because you are waiting for the 'perfect time'?",
        ta: "சரியான நேரம் வரட்டும் என்று காத்திருந்து, எந்த வேலையை நீங்கள் பல நாட்களாக தள்ளிப் போடுகிறீர்கள்?"
      }
    },
    {
      lessonNumber: 13,
      title: { en: "Use the Mechanical Way to Accomplish Things", ta: "ஒரு வேலையை இயந்திரத்தனமாக தொடங்குங்கள்" },
      explanation: {
        en: "Don't wait for the 'spirit' to move you. Start working mechanically, and the spirit will follow.",
        ta: "ஒரு வேலையை செய்ய 'மூட்' (Mood) வரட்டும் என்று காத்திருக்காதீர்கள். முதலில் எந்த எண்ணமும் இல்லாமல் வேலையை தொடங்குங்கள், ஆர்வம் தானாகவே வரும்."
      },
      whyItMatters: {
        en: "Motivation often comes *after* you start taking action, not before.",
        ta: "உந்துதல் (Motivation) என்பது வேலையை தொடங்குவதற்கு முன் வருவதில்லை. ஒரு வேலையை செய்யத் தொடங்கிய பின்பே அது உருவாகிறது."
      },
      example: {
        en: "If you don't want to write, just sit down and mechanically type nonsense for 5 minutes. Soon, real ideas will flow.",
        ta: "படிக்க பிடிக்கவில்லை என்றால், மூளைக்கு வேலை கொடுக்காமல் சும்மா புத்தகத்தை திறந்து வைத்து 5 நிமிடம் பாருங்கள். பின்பு தானாகவே படிக்க தோன்றும்."
      },
      actionStep: {
        en: "Commit to doing just 5 minutes of a dreaded task today. Stop after 5 minutes if you still want to.",
        ta: "உங்களுக்கு சுத்தமாக செய்யப் பிடிக்காத ஒரு வேலையை இன்று வெறும் 5 நிமிடம் மட்டும் செய்யுங்கள். 5 நிமிடம் முடிந்ததும் வேண்டுமானால் நிறுத்திவிடுங்கள்."
      },
      reflectionQuestion: {
        en: "How much time do you waste trying to get 'in the mood' to work?",
        ta: "வேலை செய்வதற்கான சரியான மனநிலை வர வேண்டும் என்று நினைத்து, எவ்வளவு நேரத்தை நீங்கள் வீணடிக்கிறீர்கள்?"
      }
    },
    {
      lessonNumber: 14,
      title: { en: "Turn Defeat Into Victory", ta: "தோல்வியை வெற்றியாக மாற்றுங்கள்" },
      explanation: {
        en: "Defeat is only a state of mind, and nothing more. Learn from your setbacks. Find the lesson and apply it next time.",
        ta: "தோல்வி என்பது மனதின் ஒரு நிலைப்பாடு மட்டுமே. உங்களின் சறுக்கல்களில் இருந்து பாடங்களைக் கற்றுக் கொள்ளுங்கள். அடுத்த முறை அதை சரியாகப் பயன்படுத்துங்கள்."
      },
      whyItMatters: {
        en: "Successful people don't avoid failure; they use it as feedback. Every failure brings you closer to what works.",
        ta: "வெற்றியாளர்கள் தோல்வியை கண்டு பயப்படுவதில்லை; அதை ஒரு பாடமாக எடுத்துக்கொள்கிறார்கள். ஒவ்வொரு தோல்வியும் வெற்றிக்கான சரியான வழியை உங்களுக்கு காட்டும்."
      },
      example: {
        en: "A failed product launch isn't the end of a business; it's valuable data on what customers *don't* want.",
        ta: "தேர்வில் தோல்வி அடைந்தால் அது வாழ்க்கையின் முடிவல்ல; நீங்கள் எப்படி படிக்கக்கூடாது என்பதற்கான ஒரு பாடம் அது."
      },
      actionStep: {
        en: "Think of your most recent failure. Write down 3 positive lessons you learned from it.",
        ta: "சமீபத்தில் நீங்கள் சந்தித்த ஒரு தோல்வியை நினைத்துப்பாருங்கள். அந்த தோல்வி உங்களுக்கு கற்றுக்கொடுத்த 3 நல்ல பாடங்களை எழுதுங்கள்."
      },
      reflectionQuestion: {
        en: "Do you view failure as a permanent personal flaw, or simply as an experiment that didn't work?",
        ta: "தோல்வியை உங்களின் நிரந்தர குறையாகப் பார்க்கிறீர்களா? அல்லது அது வேலை செய்யாத ஒரு முயற்சி என்று மட்டும் பார்க்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 15,
      title: { en: "Use Goals to Help You Grow", ta: "இலக்குகளை உங்களின் வளர்ச்சிக்காக பயன்படுத்துங்கள்" },
      explanation: {
        en: "A goal is an objective, a purpose. A goal is more than a dream; it's a dream being acted upon. You must have a goal to go anywhere.",
        ta: "இலக்கு என்பது வெறும் கனவு அல்ல; செயல்படத் தயாரான ஒரு கனவு. நீங்கள் வாழ்க்கையில் எங்கேயாவது செல்ல வேண்டும் என்றால், முதலில் ஒரு இலக்கு இருக்க வேண்டும்."
      },
      whyItMatters: {
        en: "Without a clear goal, you wander aimlessly. Goals give you direction, energy, and a reason to wake up.",
        ta: "தெளிவான இலக்கு இல்லாவிட்டால் உங்கள் வாழ்க்கை திசையின்றி போய்விடும். இலக்குகள் தான் உங்களுக்கு ஆற்றலையும் திசையையும் தரும்."
      },
      example: {
        en: "Building a house requires a blueprint. Building a successful life requires clear 1-year, 5-year, and 10-year goals.",
        ta: "வீடு கட்ட ஒரு வரைபடம் தேவையோ, அதுபோல ஒரு சிறந்த வாழ்க்கையை அமைக்க 5 வருட, 10 வருட இலக்குகள் தேவை."
      },
      actionStep: {
        en: "Write down exactly where you want to be in 5 years in three areas: Work, Home, and Social.",
        ta: "இன்னும் 5 வருடங்களில் உங்கள் வேலை, குடும்பம் மற்றும் சமூக வாழ்க்கையில் எந்த இடத்தில் இருக்க வேண்டும் என்று தெளிவாக எழுதுங்கள்."
      },
      reflectionQuestion: {
        en: "Are your daily actions actively moving you toward a specific destination, or are you just drifting?",
        ta: "உங்கள் தினசரி செயல்கள் உங்களை ஒரு குறிப்பிட்ட இலக்கை நோக்கி நகர்த்துகிறதா? அல்லது வாழ்க்கையை காற்றடிக்கும் திசையில் விட்டுவிட்டீர்களா?"
      }
    },
    {
      lessonNumber: 16,
      title: { en: "Invest in Yourself", ta: "உங்கள் மீது முதலீடு செய்யுங்கள்" },
      explanation: {
        en: "Spend money and time on things that build your mental power and efficiency. Education and self-improvement are investments.",
        ta: "உங்கள் மூளையின் திறனையும் அறிவையும் வளர்க்கும் விஷயங்களில் நேரத்தையும் பணத்தையும் செலவிடுங்கள். சுய முன்னேற்றமே சிறந்த முதலீடு."
      },
      whyItMatters: {
        en: "You are your greatest asset. Improving your skills yields the highest return on investment in life.",
        ta: "நீங்கள் தான் உங்களின் மிகப்பெரிய சொத்து. உங்கள் திறமையை வளர்த்துக்கொள்வது தான் வாழ்க்கையில் அதிக லாபத்தை தரும்."
      },
      example: {
        en: "Buying a $20 book that teaches you a skill to earn an extra $10,000 a year.",
        ta: "புதிய ஆடைகள் வாங்குவதற்கு பதிலாக, உங்கள் திறமையை வளர்க்கும் ஒரு பயிற்சி வகுப்பிற்கோ அல்லது நல்ல புத்தகங்களுக்கோ பணம் செலவிடுவது."
      },
      actionStep: {
        en: "Buy one book or course today that will specifically improve a skill related to your main goal.",
        ta: "உங்கள் இலக்கை அடைய உதவும் ஒரு திறமையை வளர்த்துக்கொள்ள, இன்று ஒரு புத்தகத்தையோ அல்லது பயிற்சியையோ தேடிப் படியுங்கள்."
      },
      reflectionQuestion: {
        en: "How much of your income do you spend on entertainment vs. self-education?",
        ta: "உங்களின் வருமானத்தில் எவ்வளவு பணத்தை பொழுதுபோக்கிற்காகவும், எவ்வளவு பணத்தை உங்களை வளர்த்துக்கொள்ளவும் செலவிடுகிறீர்கள்?"
      }
    },
    {
      lessonNumber: 17,
      title: { en: "Cure Health Excusitis", ta: "உடல்நலம் குறித்த சாக்குப்போக்குகளை நிறுத்துங்கள்" },
      explanation: {
        en: "Refuse to talk about your health. Complaining about aches and pains makes them seem worse and annoys others.",
        ta: "எப்பொழுதும் உங்கள் உடல்நலத்தைப் பற்றி குறை சொல்வதை நிறுத்துங்கள். வலிகளைப் பற்றி பேசிக் கொண்டே இருந்தால் அது அதிகமாகவே செய்யும்."
      },
      whyItMatters: {
        en: "Focusing heavily on minor health issues drains your energy and gives you an excuse not to try.",
        ta: "சிறிய உடல்நலக் குறைபாடுகளைப் பற்றியே யோசித்துக்கொண்டிருப்பது உங்களின் ஆற்றலை அழித்துவிடும், எதையும் செய்யாமல் இருக்க அதுவே ஒரு காரணமாகிவிடும்."
      },
      example: {
        en: "Instead of saying 'My back hurts so I can't work', say 'I am grateful I have a healthy mind to keep thinking.'",
        ta: "'எனக்கு தலை வலிக்கிறது அதனால் படிக்க முடியாது' என்று சொல்வதற்கு பதிலாக, 'எனக்கு கை, கால்கள் நன்றாக இருக்கிறது, நான் படிப்பேன்' என்று நேர்மறையாக நினையுங்கள்."
      },
      actionStep: {
        en: "For the next 24 hours, completely refuse to complain about feeling tired or having any minor pain.",
        ta: "அடுத்த 24 மணி நேரத்திற்கு, நீங்கள் சோர்வாக இருப்பதையோ அல்லது சிறிய வலிகள் இருப்பதையோ யாரிடமும் கூறக்கூடாது என்று உறுதியெடுங்கள்."
      },
      reflectionQuestion: {
        en: "Are you using minor health complaints as a shield to protect yourself from taking hard actions?",
        ta: "கடினமான வேலைகளை செய்ய பயந்து, உடல்நலக் குறைபாடுகளை ஒரு கேடயமாக பயன்படுத்தி தப்பித்துக்கொள்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 18,
      title: { en: "Cure Age Excusitis", ta: "வயது குறித்த சாக்குப்போக்குகளை ஒழியுங்கள்" },
      explanation: {
        en: "You are never too old or too young to succeed. Look at your present age positively. Compute how much productive time you have left.",
        ta: "வெற்றி பெற வயது ஒரு தடையல்ல. நீங்கள் மிகவும் சிறியவர் என்றோ, அல்லது வயது அதிகமாகிவிட்டது என்றோ கூறாதீர்கள்."
      },
      whyItMatters: {
        en: "Age is an attitude. Colonel Sanders started KFC in his 60s. Using age as an excuse guarantees failure.",
        ta: "வயது என்பது உங்கள் எண்ணத்தில் தான் உள்ளது. கே.எஃப்.சி (KFC) நிறுவனத்தை அதன் உரிமையாளர் தனது 60 வயதில் தான் தொடங்கினார்."
      },
      example: {
        en: "If you are 40, you still have 25+ years of productive work left. That is enough time to build an empire.",
        ta: "உங்களுக்கு 40 வயது ஆகிறது என்றால், இன்னும் 20 வருடங்களுக்கு மேல் உங்களால் உழைக்க முடியும். அந்த நேரம் ஒரு சாம்ராஜ்யத்தை உருவாக்கவே போதுமானது."
      },
      actionStep: {
        en: "Calculate exactly how many years of productive work you realistically have left. Realize it is a lot of time.",
        ta: "இன்னும் எத்தனை வருடங்கள் உங்களால் சுறுசுறுப்பாக உழைக்க முடியும் என்று கணக்கிடுங்கள். நீங்கள் சாதிக்க இன்னும் நிறைய காலம் இருக்கிறது என்பதை உணர்வீர்கள்."
      },
      reflectionQuestion: {
        en: "Are you using your age as a reason to give up on a dream you secretly still want?",
        ta: "உங்களுக்கு மிகவும் பிடித்த ஒரு கனவை, வயது அதிகமாகிவிட்டது என்ற ஒரு பொய்யான காரணத்தை கூறி அழித்துக்கொண்டிருக்கிறீர்களா?"
      }
    },
    {
      lessonNumber: 19,
      title: { en: "Ask Yourself: Is it Important?", ta: "உங்களையே கேளுங்கள்: இது முக்கியமானதா?" },
      explanation: {
        en: "Before getting angry or upset over a trivial matter, ask yourself if it really matters. Big thinkers don't sweat the small stuff.",
        ta: "ஒரு சிறிய விஷயத்திற்காக கோபப்படுவதற்கு முன், 'இது நிஜமாகவே அவ்வளவு முக்கியமானதா?' என்று உங்களையே கேட்டுக்கொள்ளுங்கள்."
      },
      whyItMatters: {
        en: "Getting caught up in petty arguments wastes mental energy that should be used for achieving your goals.",
        ta: "தேவையற்ற சிறிய சண்டைகளில் ஈடுபடுவது உங்கள் மூளையின் ஆற்றலை வீணாக்கும். அந்த ஆற்றலை உங்கள் இலக்குகளுக்கு பயன்படுத்துங்கள்."
      },
      example: {
        en: "Instead of arguing with someone who cut you off in traffic, ignore it and keep listening to your audiobook.",
        ta: "ரோட்டில் ஒருவர் தப்பாக வண்டி ஓட்டினால் அவருடன் சண்டை போடுவதற்கு பதிலாக, அதை கண்டுகொள்ளாமல் உங்கள் வேலையை பார்ப்பதே பெரிய மனிதர்களின் பண்பு."
      },
      actionStep: {
        en: "The next time you feel annoyed today, pause and ask: 'Will this matter in 5 years?' If not, let it go.",
        ta: "இன்று நீங்கள் கோபப்படும் ஒரு சூழ்நிலை வந்தால், ஒரு நிமிடம் அமைதியாகி, 'இன்னும் 5 வருடங்கள் கழித்து இது எனக்கு முக்கியமாக படுமா?' என்று கேளுங்கள். இல்லை என்றால் விட்டுவிடுங்கள்."
      },
      reflectionQuestion: {
        en: "How much of your daily mental energy is wasted on things that absolutely do not matter?",
        ta: "உங்கள் வாழ்வில் துளியும் முக்கியமில்லாத விஷயங்களுக்காக தினமும் உங்களின் எவ்வளவு மன ஆற்றலை வீணாக்குகிறீர்கள்?"
      }
    },
    {
      lessonNumber: 20,
      title: { en: "How to Think Like a Leader in Emergencies", ta: "நெருக்கடியான நேரத்தில் தலைவரைப் போல சிந்திப்பது எப்படி" },
      explanation: {
        en: "When things go wrong, the average person panics or looks for someone to blame. A leader stays calm and looks for a solution.",
        ta: "ஒரு பிரச்சினை வரும்போது சாதாரண மனிதர்கள் பதற்றமடைவார்கள் அல்லது யாரை குறை சொல்லலாம் என்று தேடுவார்கள். ஆனால் ஒரு தலைவர் அமைதியாக அதற்கு தீர்வு காண்பார்."
      },
      whyItMatters: {
        en: "Your true capacity for success is measured by how you handle things when they fall apart.",
        ta: "எல்லாம் சாதகமாக இருக்கும்போது அல்ல, எல்லாம் தவறாக நடக்கும்போது நீங்கள் எப்படி செயல்படுகிறீர்கள் என்பதை வைத்தே உங்களின் வெற்றி தீர்மானிக்கப்படுகிறது."
      },
      example: {
        en: "If a project fails, don't yell at your team. Gather them and say, 'What went wrong, and how do we fix it immediately?'",
        ta: "ஒரு வேலை தோல்வியடைந்தால் மற்றவர்களை திட்டுவதற்கு பதிலாக, 'எங்கே தவறு நடந்தது, இதை எப்படி சரி செய்யலாம்?' என்று சிந்திப்பதே சரியான தலைமைத்துவம்."
      },
      actionStep: {
        en: "Think of a current crisis or problem. Force yourself to write down 3 possible solutions instead of complaining.",
        ta: "தற்போது நீங்கள் சந்திக்கும் ஒரு பெரிய பிரச்சினையை நினைத்துக்கொள்ளுங்கள். அதைப் பற்றி குறை சொல்வதை நிறுத்திவிட்டு, அதை தீர்க்க 3 வழிகளை எழுதுங்கள்."
      },
      reflectionQuestion: {
        en: "Do you focus 80% of your energy on the problem, or 80% on the solution?",
        ta: "ஒரு பிரச்சினை வரும்போது, அந்தப் பிரச்சினையைப் பற்றி யோசிப்பதிலேயே உங்கள் நேரத்தை வீணாக்குகிறீர்களா? அல்லது அதற்கான தீர்வை தேடுகிறீர்களா?"
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
