import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CombatLesson from './src/models/CombatLesson';

dotenv.config();

const lessons = [
  // BOXING
  {
    title: "Boxing Stance and Footwork Fundamentals",
    description: "Learn the proper boxing stance, balance, and basic footwork to move like a pro. Perfect for complete beginners.",
    discipline: "Boxing",
    category: "Fundamentals",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=SjLXzCpRS8U", 
    duration: 10,
    order: 1
  },
  {
    title: "How to throw a perfect Jab",
    description: "The most important punch in boxing. Learn the mechanics of a fast, snapping jab.",
    discipline: "Boxing",
    category: "Punches",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=71nmi6nGcrY", 
    duration: 12,
    order: 2
  },
  {
    title: "The Cross (Right Hand)",
    description: "Generate knockout power with proper hip rotation and weight transfer on your cross punch.",
    discipline: "Boxing",
    category: "Punches",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=u_JBl8WRz5I",
    duration: 8,
    order: 3
  },
  {
    title: "Head Movement & Slips",
    description: "Defensive fundamentals to avoid getting hit. Learn how to slip punches smoothly and efficiently.",
    discipline: "Boxing",
    category: "Defense",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/watch?v=HVTTZI_7Lvw",
    duration: 15,
    order: 4
  },
  
  // MMA
  {
    title: "MMA Stance vs Boxing Stance",
    description: "Understand the differences in stance to defend against takedowns and leg kicks.",
    discipline: "MMA",
    category: "Fundamentals",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=R3CwbFrSis0",
    duration: 15,
    order: 1
  },
  {
    title: "Sprawl Fundamentals",
    description: "The most essential takedown defense technique in MMA. Learn to sprawl hard and stop the takedown.",
    discipline: "MMA",
    category: "Defense",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=g9u-JcVXYFM",
    duration: 11,
    order: 2
  },
  {
    title: "Ground and Pound Basics",
    description: "Learn how to deliver devastating strikes while maintaining top control on the ground.",
    discipline: "MMA",
    category: "Drill",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/watch?v=Zmealzdnit4",
    duration: 14,
    order: 3
  },

  // Muay Thai
  {
    title: "Muay Thai Roundhouse Kick",
    description: "Learn how to chop trees down with the devastating Muay Thai roundhouse kick.",
    discipline: "Muay Thai",
    category: "Kicks",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=BBSV6f2JNEA",
    duration: 14,
    order: 1
  },
  {
    title: "The Thai Clinch (Plum)",
    description: "Master the basics of the Muay Thai clinch to control your opponent and deliver vicious knees.",
    discipline: "Muay Thai",
    category: "Clinch",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/watch?v=GHKJeN0mFcU",
    duration: 18,
    order: 2
  },

  // Kickboxing
  {
    title: "Kickboxing Combos: Jab Cross Switch Kick",
    description: "A classic Dutch Kickboxing combination integrating hands and feet.",
    discipline: "Kickboxing",
    category: "Drill",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/watch?v=Bp_QVO7kYtg",
    duration: 9,
    order: 1
  },
  {
    title: "Checking Leg Kicks",
    description: "Essential defense for kickboxing. Learn how to absorb and check leg kicks properly to avoid injury.",
    discipline: "Kickboxing",
    category: "Defense",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=Msxt-LzrOow",
    duration: 12,
    order: 2
  },

  // Self Defense
  {
    title: "Self Defense: Escaping Wrist Grabs",
    description: "Simple and effective techniques to break free when someone grabs your wrists.",
    discipline: "Self Defense",
    category: "Defense",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=0jT4D-Nvshc",
    duration: 8,
    order: 1
  },
  {
    title: "De-escalation and Distance Management",
    description: "The best self-defense is avoiding the fight. Learn how to manage distance and de-escalate situations.",
    discipline: "Self Defense",
    category: "Fundamentals",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=ryvyIIEAkxE",
    duration: 20,
    order: 2
  }
];

const seedLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");
    
    // Clear existing
    await CombatLesson.deleteMany({});
    
    // Insert
    await CombatLesson.insertMany(lessons);
    
    console.log("Lessons seeded successfully with real tutorials!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed lessons", error);
    process.exit(1);
  }
};

seedLessons();
