import mongoose from 'mongoose';
import dotenv from 'dotenv';
import YogaPose from '../models/YogaPose';
import YogaLesson from '../models/YogaLesson';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goalpilot';

const seedYogaData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database');

    // Clear existing data
    await YogaPose.deleteMany();
    await YogaLesson.deleteMany();
    console.log('Cleared existing Yoga data');

    // --- POSES ---
    const poses = [
      {
        name: 'Mountain Pose (Tadasana)',
        difficulty: 'Beginner',
        description: 'Stand tall with feet together, shoulders relaxed, weight evenly distributed, arms at sides.',
        durationSeconds: 30,
        benefits: ['Improves posture', 'Strengthens thighs, knees, and ankles', 'Firms abdomen and buttocks'],
        precautions: ['Avoid if experiencing headaches or insomnia'],
        category: 'Balance'
      },
      {
        name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
        difficulty: 'Beginner',
        description: 'An inverted V-shape. Hands and feet on the mat, hips lifted towards the ceiling.',
        durationSeconds: 60,
        benefits: ['Calms the brain', 'Energizes the body', 'Stretches shoulders, hamstrings, calves'],
        precautions: ['Carpal tunnel syndrome', 'Late-term pregnancy'],
        category: 'Flexibility'
      },
      {
        name: 'Child’s Pose (Balasana)',
        difficulty: 'Beginner',
        description: 'Kneel on the floor, touch big toes together, sit on heels, then separate knees. Lay torso down between thighs.',
        durationSeconds: 60,
        benefits: ['Gently stretches hips, thighs, and ankles', 'Calms the brain and helps relieve stress'],
        precautions: ['Knee injury', 'Pregnancy (use variations)'],
        category: 'Relaxation'
      },
      {
        name: 'Warrior II (Virabhadrasana II)',
        difficulty: 'Intermediate',
        description: 'Stand with legs wide apart. Turn right foot out 90 degrees. Bend right knee until thigh is parallel to floor. Extend arms out.',
        durationSeconds: 45,
        benefits: ['Strengthens and stretches legs and ankles', 'Stretches groins, chest, lungs, shoulders'],
        precautions: ['Diarrhea', 'High blood pressure'],
        category: 'Strength'
      },
      {
        name: 'Tree Pose (Vrksasana)',
        difficulty: 'Beginner',
        description: 'Stand on one leg. Place the sole of the other foot on the inner thigh or calf. Balance and breathe.',
        durationSeconds: 30,
        benefits: ['Improves balance', 'Strengthens thighs, calves, ankles, and spine'],
        precautions: ['Headache', 'Insomnia', 'Low blood pressure'],
        category: 'Balance'
      },
      {
        name: 'Cat-Cow Pose (Marjaryasana-Bitilasana)',
        difficulty: 'Beginner',
        description: 'On all fours, inhale as you arch your back (Cow), exhale as you round your spine (Cat).',
        durationSeconds: 60,
        benefits: ['Improves posture and balance', 'Strengthens and stretches spine and neck'],
        precautions: ['Neck injury'],
        category: 'Mobility'
      },
      {
        name: 'Cobra Pose (Bhujangasana)',
        difficulty: 'Beginner',
        description: 'Lie on your stomach. Place hands under shoulders. Inhale and lift chest off the floor, keeping elbows slightly bent.',
        durationSeconds: 30,
        benefits: ['Strengthens the spine', 'Stretches chest, lungs, shoulders, and abdomen'],
        precautions: ['Back injury', 'Pregnancy'],
        category: 'Flexibility'
      },
      {
        name: 'Crow Pose (Bakasana)',
        difficulty: 'Advanced',
        description: 'Squat down, place hands on mat. Bring knees to upper triceps. Lean forward and lift feet off the floor.',
        durationSeconds: 20,
        benefits: ['Strengthens arms and wrists', 'Stretches the upper back', 'Improves balance and core strength'],
        precautions: ['Carpal tunnel syndrome', 'Pregnancy'],
        category: 'Core'
      }
    ];

    const insertedPoses = await YogaPose.insertMany(poses);
    console.log(`Inserted ${insertedPoses.length} Poses`);

    const getPoses = (names: string[]) => insertedPoses.filter(p => names.includes(p.name)).map(p => p._id);

    // --- LESSONS ---
    const lessons = [
      {
        title: 'Morning Yoga for Beginners',
        videoId: 'v7AYKMP6rOE', 
        durationMinutes: 10,
        difficulty: 'Beginner',
        category: 'Morning Yoga',
        description: 'A gentle 10-minute morning yoga routine to wake up your body and set a positive tone for the day.',
        poses: getPoses(['Mountain Pose (Tadasana)', 'Cat-Cow Pose (Marjaryasana-Bitilasana)', 'Child’s Pose (Balasana)'])
      },
      {
        title: 'Yoga for Flexibility - 20 Min Flow',
        videoId: 'sTANio_2E0Q',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        category: 'Flexibility',
        description: 'A 20-minute flow focused on deep stretching and increasing overall flexibility.',
        poses: getPoses(['Downward-Facing Dog (Adho Mukha Svanasana)', 'Cobra Pose (Bhujangasana)', 'Child’s Pose (Balasana)'])
      },
      {
        title: '30 Minute Full Body Yoga Flow',
        videoId: 'b1H3xO3x_Js',
        durationMinutes: 30,
        difficulty: 'Intermediate',
        category: 'Full Body Yoga',
        description: 'A dynamic 30-minute full body yoga workout designed to build heat, strength, and endurance.',
        poses: getPoses(['Warrior II (Virabhadrasana II)', 'Downward-Facing Dog (Adho Mukha Svanasana)', 'Crow Pose (Bakasana)'])
      },
      {
        title: '20 Minute Evening Wind Down',
        videoId: 'BiVDjQpeK30',
        durationMinutes: 20,
        difficulty: 'Beginner',
        category: 'Relaxation',
        description: 'Unwind after a long day with this relaxing sequence designed to promote deep sleep.',
        poses: [insertedPoses[0]._id, insertedPoses[6]._id, insertedPoses[7]._id]
      },
      {
        title: 'Deep Stretch & Mobility',
        description: 'Focus on opening up tight hips and shoulders.',
        videoId: 'GLy2rYHwUqY', 
        durationMinutes: 45,
        difficulty: 'Intermediate',
        category: 'Mobility',
        poses: [insertedPoses[1]._id, insertedPoses[4]._id, insertedPoses[5]._id]
      },
      {
        title: 'Advanced Core Strength',
        description: 'Challenging sequence focusing on core control.',
        videoId: 'LqXZ628YNj4', 
        durationMinutes: 25,
        difficulty: 'Advanced',
        category: 'Balance',
        poses: getPoses(['Downward-Facing Dog (Adho Mukha Svanasana)', 'Warrior II (Virabhadrasana II)', 'Crow Pose (Bakasana)'])
      }
    ];

    await YogaLesson.insertMany(lessons);
    console.log(`Inserted ${lessons.length} Lessons`);

    console.log('Yoga Seeding Completed Successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedYogaData();
