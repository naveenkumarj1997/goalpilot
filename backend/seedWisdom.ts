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
