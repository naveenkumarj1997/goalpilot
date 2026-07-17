export interface VocabularyWord {
  id: string;
  word: string;
  tamilWord: string;
  pronunciation: string;
  partOfSpeech: string;
  meaningEnglish: string;
  meaningTamil: string;
  examples: string[];
  conversationalContext: string;
}

export const VOCABULARY_LIST: VocabularyWord[] = [
  {
    id: 'v1',
    word: 'Ephemeral',
    tamilWord: 'தற்காலிகமான',
    pronunciation: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Lasting for a very short time.',
    meaningTamil: 'குறுகிய காலம் மட்டுமே இருக்கக்கூடிய / தற்காலிகமான',
    examples: [
      'The beauty of a sunset is ephemeral.',
      'Fame in the world of social media is often ephemeral.'
    ],
    conversationalContext: 'Use this when talking about things that don’t last long, like trends, emotions, or fragile beauty.'
  },
  {
    id: 'v2',
    word: 'Resilience',
    tamilWord: 'மன உறுதி',
    pronunciation: '/rɪˈzɪl.i.əns/',
    partOfSpeech: 'noun',
    meaningEnglish: 'The capacity to recover quickly from difficulties; toughness.',
    meaningTamil: 'துன்பங்களிலிருந்து மீண்டு வரும் திறன் / மன உறுதி',
    examples: [
      'She showed great resilience after failing the exam and tried again.',
      'The human body has a remarkable resilience to injury.'
    ],
    conversationalContext: 'Use this to praise someone who has bounced back from a tough situation or failure.'
  },
  {
    id: 'v3',
    word: 'Meticulous',
    tamilWord: 'மிகவும் கவனமான',
    pronunciation: '/məˈtɪk.jə.ləs/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Showing great attention to detail; very careful and precise.',
    meaningTamil: 'மிகவும் கவனமான / துல்லியமான (ஒவ்வொரு சிறு விஷயத்திலும் கவனம் செலுத்துதல்)',
    examples: [
      'He is very meticulous about how he organizes his desk.',
      'The architect was meticulous in his planning.'
    ],
    conversationalContext: 'Use this when describing someone who works perfectly, double-checks everything, and doesn\'t make careless mistakes.'
  },
  {
    id: 'v4',
    word: 'Serendipity',
    tamilWord: 'தற்செயலான அதிர்ஷ்டம்',
    pronunciation: '/ˌser.ənˈdɪp.ə.t̬i/',
    partOfSpeech: 'noun',
    meaningEnglish: 'The occurrence and development of events by chance in a happy or beneficial way.',
    meaningTamil: 'எதிர்பாராத நல்வாய்ப்பு / தற்செயலான அதிர்ஷ்டம்',
    examples: [
      'Finding that 100-rupee note in my old jeans was pure serendipity.',
      'They met by serendipity at a coffee shop.'
    ],
    conversationalContext: 'Use this when a happy accident occurs, or when something surprisingly good happens when you weren\'t looking for it.'
  },
  {
    id: 'v5',
    word: 'Procrastinate',
    tamilWord: 'தள்ளிப்போடுதல்',
    pronunciation: '/proʊˈkræs.tə.neɪt/',
    partOfSpeech: 'verb',
    meaningEnglish: 'To delay or postpone action; put off doing something.',
    meaningTamil: 'தள்ளிப்போடுதல் / காலதாமதம் செய்தல்',
    examples: [
      'If you procrastinate, you will have to rush the work at the last minute.',
      'I tend to procrastinate when I have a difficult task.'
    ],
    conversationalContext: 'Use this to describe the habit of watching YouTube instead of doing your homework or office work.'
  },
  {
    id: 'v6',
    word: 'Ubiquitous',
    tamilWord: 'எங்கும் நிறைந்திருக்கிற',
    pronunciation: '/juːˈbɪk.wə.t̬əs/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Present, appearing, or found everywhere.',
    meaningTamil: 'எங்கும் நிறைந்திருக்கிற / எங்கும் காணப்படுகிற',
    examples: [
      'Mobile phones have become ubiquitous in modern society.',
      'The company\'s logo is ubiquitous across the city.'
    ],
    conversationalContext: 'Use this to describe things that are literally everywhere you look (like smartphones, fast food chains, or plastic).'
  },
  {
    id: 'v7',
    word: 'Eloquent',
    tamilWord: 'சொல்லாற்றல் மிக்க',
    pronunciation: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Fluent or persuasive in speaking or writing.',
    meaningTamil: 'சிறப்பாகவும் தெளிவாகவும் பேசக்கூடிய / சொல்லாற்றல் மிக்க',
    examples: [
      'She gave an eloquent speech that moved the audience to tears.',
      'He is a very eloquent speaker.'
    ],
    conversationalContext: 'Use this to compliment someone who speaks beautifully, clearly, and persuasively.'
  },
  {
    id: 'v8',
    word: 'Ambiguous',
    tamilWord: 'தெளிவற்ற',
    pronunciation: '/æmˈbɪɡ.ju.əs/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Open to more than one interpretation; having a double meaning.',
    meaningTamil: 'தெளிவற்ற / இருபொருள் படக்கூடிய',
    examples: [
      'His answer to the question was highly ambiguous.',
      'The movie had an ambiguous ending.'
    ],
    conversationalContext: 'Use this when someone says something confusing that could mean two different things, or when instructions are not clear.'
  },
  {
    id: 'v9',
    word: 'Nostalgia',
    tamilWord: 'பழங்கால ஏக்கம்',
    pronunciation: '/nɑːˈstæl.dʒə/',
    partOfSpeech: 'noun',
    meaningEnglish: 'A sentimental longing or wistful affection for the past.',
    meaningTamil: 'கடந்த காலத்தின் பசுமையான நினைவுகள் / பழங்கால ஏக்கம்',
    examples: [
      'Hearing that old 90s song fills me with nostalgia.',
      'She felt a wave of nostalgia when visiting her childhood home.'
    ],
    conversationalContext: 'Use this when looking at old photos or thinking about your school days brings a warm, slightly sad feeling.'
  },
  {
    id: 'v10',
    word: 'Pragmatic',
    tamilWord: 'நடைமுறைக்கு ஏற்ற',
    pronunciation: '/præɡˈmæt̬.ɪk/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    meaningTamil: 'நடைமுறைக்கு ஏற்ற / சாத்தியமானதை மட்டும் கருத்தில் கொள்ளும்',
    examples: [
      'We need a pragmatic approach to solve this financial crisis.',
      'She is a pragmatic leader who focuses on results.'
    ],
    conversationalContext: 'Use this to describe a person who is highly practical and realistic, rather than someone who is a daydreamer.'
  },
  {
    id: 'v11',
    word: 'Tenacious',
    tamilWord: 'விடாப்பிடியான',
    pronunciation: '/təˈneɪ.ʃəs/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Tending to keep a firm hold of something; clinging or adhering closely. Not easily stopped.',
    meaningTamil: 'பற்றுறுதியான / விடாப்பிடியான (எளிதில் விட்டுக்கொடுக்காத)',
    examples: [
      'He is a tenacious defender on the football field.',
      'Her tenacious spirit helped her finish the marathon despite the pain.'
    ],
    conversationalContext: 'Use this to describe someone who refuses to quit or give up, no matter how hard the situation gets.'
  },
  {
    id: 'v12',
    word: 'Inevitable',
    tamilWord: 'தவிர்க்க முடியாத',
    pronunciation: '/ˌɪnˈev.ə.t̬ə.bəl/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Certain to happen; unavoidable.',
    meaningTamil: 'தவிர்க்க முடியாத / நிச்சயமாக நடக்கக்கூடிய',
    examples: [
      'With the way he was driving, an accident was inevitable.',
      'Change is an inevitable part of life.'
    ],
    conversationalContext: 'Use this when talking about something that cannot be stopped, like growing older or technology advancing.'
  },
  {
    id: 'v13',
    word: 'Lethargic',
    tamilWord: 'சோர்வான',
    pronunciation: '/ləˈθɑːr.dʒɪk/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Affected by lethargy; sluggish and apathetic.',
    meaningTamil: 'மந்தமான / சோம்பேறித்தனமான / சோர்வான',
    examples: [
      'I always feel lethargic after eating a heavy lunch.',
      'The extreme heat made everyone lethargic.'
    ],
    conversationalContext: 'Use this to describe how you feel when you have zero energy and just want to lay on the sofa all day.'
  },
  {
    id: 'v14',
    word: 'Lucid',
    tamilWord: 'தெளிவான',
    pronunciation: '/ˈluː.sɪd/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Expressed clearly; easy to understand.',
    meaningTamil: 'தெளிவான / எளிதில் புரிந்துகொள்ளக்கூடிய',
    examples: [
      'The teacher gave a lucid explanation of a very complex physics concept.',
      'He had a few lucid moments during his illness.'
    ],
    conversationalContext: 'Use this to compliment someone\'s writing or speaking when they explain something difficult in a very simple, clear way.'
  },
  {
    id: 'v15',
    word: 'Candid',
    tamilWord: 'வெளிப்படையான',
    pronunciation: '/ˈkæn.dɪd/',
    partOfSpeech: 'adjective',
    meaningEnglish: 'Truthful and straightforward; frank.',
    meaningTamil: 'வெளிப்படையான / ஒளிவுமறைவற்ற / நேர்மையான',
    examples: [
      'To be completely candid, I don\'t think this plan will work.',
      'They had a candid conversation about their relationship.'
    ],
    conversationalContext: 'Use this when you are about to tell the harsh truth, or to describe someone who always speaks their mind honestly without filtering.'
  }
];
