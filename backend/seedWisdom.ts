import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from './src/models/WisdomBook';
import { connectDB } from './src/config/db';

dotenv.config();

const seedData = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
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
          ta: "ஜெயித்தவனுக்கும் தோற்றவனுக்கும் ஒரே இலக்கு தான் இருந்திருக்கும் (உதாரணமாக: தேர்வில் முதல் மதிப்பெண் வாங்க வேண்டும் என்று). ஆனால் ஜெயித்தவனின் படிக்கும் முறை (System) சிறப்பாக இருந்ததால் அவன் ஜெயித்தான்." 
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
        title: { en: "Make It Obvious", ta: "கண்ணில் படும்படி வையுங்கள் (Make It Obvious)" },
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
