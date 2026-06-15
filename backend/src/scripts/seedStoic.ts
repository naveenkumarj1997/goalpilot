import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StoicLesson from '../models/StoicLesson';
import StoicQuote from '../models/StoicQuote';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goalpilot';

const LESSONS = [
  {
    title: 'What is Stoicism?',
    category: 'Foundations',
    description: 'An introduction to the ancient philosophy of Stoicism and its modern applications.',
    explanation: 'Stoicism is an ancient Greek philosophy that teaches the development of self-control and fortitude as a means of overcoming destructive emotions. The core idea is that we don\'t control what happens to us, but we control our response.',
    realLifeExample: 'Instead of getting angry at a traffic jam (which you cannot change), you use the time to listen to a podcast.',
    reflectionQuestion: 'Think of a recent time you got upset over something completely out of your control. How could a Stoic have reacted?',
    keyTakeaway: 'Focus only on what is within your control.',
    order: 1
  },
  {
    title: 'Control vs No Control',
    category: 'Foundations',
    description: 'The Dichotomy of Control: the most fundamental principle of Stoicism.',
    explanation: 'Epictetus stated: "Some things are in our control and others not." In our control are our opinions, aspirations, desires, and the things that repel us. Not in our control are our bodies, wealth, reputation, and other people.',
    realLifeExample: 'You prepare thoroughly for an interview (in your control). The interviewer chooses someone else (not in your control).',
    reflectionQuestion: 'List 3 things stressing you out right now. Are they inside or outside your control?',
    keyTakeaway: 'Separate your concerns into what you control and what you don\'t, and discard the latter.',
    order: 2
  },
  {
    title: 'Accepting Reality (Amor Fati)',
    category: 'Mindset',
    description: 'Learn to love your fate, not just endure it.',
    explanation: 'Amor Fati translates to "a love of fate". It means treating everything that happens to you—even the bad things—as necessary and useful. It is the practice of not wishing for reality to be different.',
    realLifeExample: 'Losing your job forces you to find a new career path that ultimately makes you much happier.',
    reflectionQuestion: 'What is a past "failure" or "disaster" that actually taught you an important lesson?',
    keyTakeaway: 'Don\'t just accept your fate. Embrace it.',
    order: 3
  },
  {
    title: 'Dealing With Failure',
    category: 'Resilience',
    description: 'How to reframe failure as a stepping stone rather than a roadblock.',
    explanation: 'To a Stoic, failure is simply a piece of information. It means your current approach didn\'t work. It does not mean you are permanently broken.',
    realLifeExample: 'A failed startup is not a permanent label of "failure," but a masterclass in what not to do next time.',
    reflectionQuestion: 'How can you view your most recent failure as a piece of objective feedback?',
    keyTakeaway: 'Failure is an event, not a person.',
    order: 4
  },
  {
    title: 'Handling Criticism',
    category: 'Social',
    description: 'Stop letting the opinions of others dictate your emotions.',
    explanation: 'Marcus Aurelius wrote: "We all love ourselves more than other people, but care more about their opinion than our own." If criticism is true, you should fix the problem. If it is false, you should ignore it.',
    realLifeExample: 'Someone calls you lazy. If you are lazy, thank them for the wake-up call. If you are not, realize they are misinformed.',
    reflectionQuestion: 'Whose opinion are you currently valuing over your own truth?',
    keyTakeaway: 'Truth needs no defense. Falsehood deserves none.',
    order: 5
  },
  {
    title: 'Managing Anger',
    category: 'Emotions',
    description: 'Why anger is a temporary madness and how to stop it.',
    explanation: 'Seneca viewed anger as the most destructive emotion. Anger never solves the problem; it only multiplies the damage. A Stoic pauses between the trigger and the reaction.',
    realLifeExample: 'Someone cuts you off in traffic. Instead of raging, you take a breath and realize their bad driving is their problem, not yours.',
    reflectionQuestion: 'When was the last time anger actually improved a situation for you?',
    keyTakeaway: 'Create a space between the event and your reaction.',
    order: 6
  },
  {
    title: 'Handling Stress',
    category: 'Emotions',
    description: 'Remove stress by living in the present moment.',
    explanation: 'Stress is almost always related to worrying about the future. Stoics ground themselves entirely in the present moment, handling one small task at a time.',
    realLifeExample: 'Instead of panicking over a massive project deadline next month, you focus solely on writing the first paragraph today.',
    reflectionQuestion: 'What future event are you ruining your present moment by worrying about?',
    keyTakeaway: 'You only ever have to handle the present moment.',
    order: 7
  },
  {
    title: 'Building Discipline',
    category: 'Action',
    description: 'Discipline equals freedom in the Stoic philosophy.',
    explanation: 'Stoics believe in strict discipline for themselves and tolerance for others. Discipline is doing what you must do, even when you don\'t feel like it, because you are commanded by your own reason.',
    realLifeExample: 'Waking up early to exercise even when it is cold and dark.',
    reflectionQuestion: 'In what area of your life are you letting comfort dictate your actions?',
    keyTakeaway: 'Be strict with yourself, and tolerant with others.',
    order: 8
  },
  {
    title: 'Negative Visualization',
    category: 'Practice',
    description: 'The practice of Premeditatio Malorum (premeditation of evils).',
    explanation: 'By occasionally imagining the loss of the things you value (your job, your health, your loved ones), you strip away your anxiety about losing them, and you cultivate deep gratitude for having them right now.',
    realLifeExample: 'Imagining that today is the last time you will ever see your pet, making you appreciate them intensely in this moment.',
    reflectionQuestion: 'What is one thing you take for granted every day?',
    keyTakeaway: 'Imagine losing what you love to appreciate it fully.',
    order: 9
  },
  {
    title: 'Making Better Decisions',
    category: 'Action',
    description: 'Using reason to cut through emotional decision making.',
    explanation: 'Before acting, a Stoic asks: Is this essential? Is this virtuous? Does this align with my character? They strip away the emotional narrative and look at the raw facts.',
    realLifeExample: 'Before buying an expensive item out of impulse, you wait 48 hours to let the emotion subside.',
    reflectionQuestion: 'What is an emotional decision you recently made that you regret?',
    keyTakeaway: 'Never act in the heat of emotion. Wait for reason to return.',
    order: 10
  }
];

const QUOTES = [
  { quote: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", meaning: "True resilience comes from internal control, not from trying to control the world.", practicalApplication: "When stuck in traffic, control your reaction instead of the cars." },
  { quote: "We suffer more often in imagination than in reality.", author: "Seneca", meaning: "Our anxiety about the future is usually worse than the actual event.", practicalApplication: "Stop overthinking future scenarios that haven't happened." },
  { quote: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", meaning: "Events are neutral. Your judgment makes them good or bad.", practicalApplication: "When you fail a test, react by studying harder, not by giving up." },
  { quote: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca", meaning: "Fear of mortality stops us from taking risks and living fully.", practicalApplication: "Take the bold career risk; life is short." },
  { quote: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", meaning: "Action is superior to philosophy. Embody your principles.", practicalApplication: "Stop debating politics online and go help your neighbor." },
  { quote: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", meaning: "Define your ideal self, then take the necessary actions to become it.", practicalApplication: "If you want to be a writer, write every day." },
  { quote: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius", meaning: "Do not let toxic people corrupt your character.", practicalApplication: "When someone insults you, do not insult them back." },
  { quote: "If a man knows not to which port he sails, no wind is favorable.", author: "Seneca", meaning: "Without a clear goal, even good opportunities are wasted.", practicalApplication: "Set a clear 1-year goal so you know what to focus on." },
  { quote: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus", meaning: "Desire is a contract you make with yourself to be unhappy until you get what you want.", practicalApplication: "Practice being content with what you currently own." },
  { quote: "Choose not to be harmed—and you won't feel harmed. Don't feel harmed—and you haven't been.", author: "Marcus Aurelius", meaning: "Offense is taken, not given.", practicalApplication: "When someone makes a rude comment, choose to ignore it." }
];

const seedStoicData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database');

    await StoicLesson.deleteMany();
    await StoicQuote.deleteMany();
    console.log('Cleared existing Stoic data');

    await StoicLesson.insertMany(LESSONS);
    console.log(`Inserted ${LESSONS.length} Stoic Lessons`);

    await StoicQuote.insertMany(QUOTES);
    console.log(`Inserted ${QUOTES.length} Stoic Quotes`);

    console.log('Stoicism Seeding Completed Successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedStoicData();
