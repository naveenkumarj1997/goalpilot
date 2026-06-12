import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise';

dotenv.config();

const exercises = [
  // CHEST - Bodyweight
  { name: 'Push-ups', description: 'Classic bodyweight chest exercise.', targetMuscles: ['Chest', 'Triceps', 'Shoulders'], difficulty: 'Beginner', equipment: 'None', category: 'Chest' },
  { name: 'Wide Push-ups', description: 'Push-ups with wider hand placement.', targetMuscles: ['Chest', 'Shoulders'], difficulty: 'Intermediate', equipment: 'None', category: 'Chest' },
  { name: 'Decline Push-ups', description: 'Feet elevated push-ups targeting upper chest.', targetMuscles: ['Upper Chest', 'Triceps'], difficulty: 'Advanced', equipment: 'None', category: 'Chest' },
  { name: 'Incline Push-ups', description: 'Hands elevated push-ups targeting lower chest.', targetMuscles: ['Lower Chest', 'Triceps'], difficulty: 'Beginner', equipment: 'None', category: 'Chest' },
  { name: 'Diamond Push-ups', description: 'Hands close together forming a diamond.', targetMuscles: ['Triceps', 'Inner Chest'], difficulty: 'Intermediate', equipment: 'None', category: 'Chest' },
  { name: 'Explosive Push-ups', description: 'Push up with enough force to lift hands off ground.', targetMuscles: ['Chest', 'Triceps'], difficulty: 'Advanced', equipment: 'None', category: 'Chest' },
  // CHEST - Dumbbells
  { name: 'Dumbbell Floor Press', description: 'Bench press variation lying on the floor.', targetMuscles: ['Chest', 'Triceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Chest' },
  { name: 'Dumbbell Flyes', description: 'Lying on floor or bench, arms open wide.', targetMuscles: ['Chest'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Chest' },
  { name: 'Standing Upward Chest Fly', description: 'Using bands or light dumbbells, sweeping upward.', targetMuscles: ['Upper Chest'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Chest' },
  // CHEST - Bands
  { name: 'Resistance Band Push-ups', description: 'Push-ups with a band across the back for added resistance.', targetMuscles: ['Chest', 'Triceps'], difficulty: 'Advanced', equipment: 'Resistance Bands', category: 'Chest' },
  { name: 'Band Chest Press', description: 'Standing press pushing band straight out.', targetMuscles: ['Chest', 'Triceps'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Chest' },
  { name: 'Band Chest Flyes', description: 'Standing flyes crossing arms in front.', targetMuscles: ['Chest'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Chest' },

  // BACK - Bodyweight
  { name: 'Pull-ups', description: 'Overhand grip pulling body up.', targetMuscles: ['Lats', 'Biceps', 'Upper Back'], difficulty: 'Advanced', equipment: 'Pull-up Bar', category: 'Back' },
  { name: 'Chin-ups', description: 'Underhand grip pulling body up.', targetMuscles: ['Lats', 'Biceps'], difficulty: 'Intermediate', equipment: 'Pull-up Bar', category: 'Back' },
  { name: 'Superman Holds', description: 'Lying on stomach, lifting arms and legs.', targetMuscles: ['Lower Back'], difficulty: 'Beginner', equipment: 'None', category: 'Back' },
  { name: 'Bodyweight Rows (Table)', description: 'Inverted rows using a sturdy table.', targetMuscles: ['Mid Back', 'Biceps'], difficulty: 'Intermediate', equipment: 'None', category: 'Back' },
  { name: 'Snow Angels (Prone)', description: 'Lying on stomach, sweeping arms back and forth.', targetMuscles: ['Upper Back', 'Shoulders'], difficulty: 'Beginner', equipment: 'None', category: 'Back' },
  // BACK - Dumbbells
  { name: 'Dumbbell Bent Over Row', description: 'Hinging at hips, pulling dumbbells to waist.', targetMuscles: ['Lats', 'Mid Back', 'Biceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Back' },
  { name: 'Single Arm Dumbbell Row', description: 'Rowing one dumbbell while supporting with the other arm.', targetMuscles: ['Lats', 'Biceps'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Back' },
  { name: 'Dumbbell Pullovers', description: 'Lying down, pulling dumbbell over head.', targetMuscles: ['Lats', 'Chest'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Back' },
  { name: 'Dumbbell Reverse Flyes', description: 'Bent over, raising arms out to sides.', targetMuscles: ['Rear Delts', 'Upper Back'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Back' },
  // BACK - Bands
  { name: 'Band Seated Row', description: 'Sitting, pulling band to stomach.', targetMuscles: ['Mid Back', 'Lats'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Back' },
  { name: 'Band Pull-Aparts', description: 'Pulling band apart in front of chest.', targetMuscles: ['Upper Back', 'Rear Delts'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Back' },
  { name: 'Band Lat Pulldown', description: 'Kneeling, pulling band down from above.', targetMuscles: ['Lats'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Back' },

  // SHOULDERS - Bodyweight
  { name: 'Pike Push-ups', description: 'Push-ups with hips high in the air.', targetMuscles: ['Shoulders', 'Triceps'], difficulty: 'Intermediate', equipment: 'None', category: 'Shoulders' },
  { name: 'Handstand Push-ups', description: 'Vertical push-ups against a wall.', targetMuscles: ['Shoulders', 'Triceps'], difficulty: 'Advanced', equipment: 'None', category: 'Shoulders' },
  { name: 'Wall Walks', description: 'Walking feet up wall into handstand.', targetMuscles: ['Shoulders', 'Core'], difficulty: 'Advanced', equipment: 'None', category: 'Shoulders' },
  { name: 'Arm Circles', description: 'Small to large circles with arms.', targetMuscles: ['Shoulders'], difficulty: 'Beginner', equipment: 'None', category: 'Shoulders' },
  // SHOULDERS - Dumbbells
  { name: 'Dumbbell Overhead Press', description: 'Pressing dumbbells overhead from shoulders.', targetMuscles: ['Shoulders', 'Triceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Shoulders' },
  { name: 'Dumbbell Lateral Raises', description: 'Raising dumbbells to the sides.', targetMuscles: ['Lateral Delts'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Shoulders' },
  { name: 'Dumbbell Front Raises', description: 'Raising dumbbells straight to the front.', targetMuscles: ['Front Delts'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Shoulders' },
  { name: 'Dumbbell Arnold Press', description: 'Rotating press starting palms facing you.', targetMuscles: ['Shoulders'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Shoulders' },
  // SHOULDERS - Bands
  { name: 'Band Overhead Press', description: 'Standing on band, pressing handles overhead.', targetMuscles: ['Shoulders', 'Triceps'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Shoulders' },
  { name: 'Band Face Pulls', description: 'Pulling band towards face.', targetMuscles: ['Rear Delts', 'Upper Back'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Shoulders' },
  { name: 'Band Lateral Raises', description: 'Standing on band, raising handles to sides.', targetMuscles: ['Lateral Delts'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Shoulders' },

  // LEGS - Bodyweight
  { name: 'Bodyweight Squats', description: 'Classic squat movement.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  { name: 'Jump Squats', description: 'Explosive jump from squat position.', targetMuscles: ['Quads', 'Calves', 'Glutes'], difficulty: 'Intermediate', equipment: 'None', category: 'Legs' },
  { name: 'Lunges', description: 'Stepping forward and dropping knee.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  { name: 'Reverse Lunges', description: 'Stepping backward into lunge.', targetMuscles: ['Glutes', 'Quads'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  { name: 'Jump Lunges', description: 'Explosive alternating jump lunges.', targetMuscles: ['Quads', 'Glutes', 'Cardio'], difficulty: 'Advanced', equipment: 'None', category: 'Legs' },
  { name: 'Bulgarian Split Squats', description: 'One foot elevated behind, squatting down.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Intermediate', equipment: 'Bench', category: 'Legs' },
  { name: 'Glute Bridges', description: 'Lying on back, thrusting hips upward.', targetMuscles: ['Glutes', 'Hamstrings'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  { name: 'Single-leg Glute Bridges', description: 'Glute bridge with one leg extended.', targetMuscles: ['Glutes', 'Hamstrings'], difficulty: 'Intermediate', equipment: 'None', category: 'Legs' },
  { name: 'Calf Raises', description: 'Pushing up onto toes.', targetMuscles: ['Calves'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  { name: 'Pistol Squats', description: 'Single leg deep squat.', targetMuscles: ['Quads', 'Glutes', 'Balance'], difficulty: 'Advanced', equipment: 'None', category: 'Legs' },
  { name: 'Wall Sits', description: 'Holding squat position against wall.', targetMuscles: ['Quads', 'Endurance'], difficulty: 'Beginner', equipment: 'None', category: 'Legs' },
  // LEGS - Dumbbells
  { name: 'Goblet Squat', description: 'Holding one dumbbell at chest height while squatting.', targetMuscles: ['Quads', 'Glutes', 'Core'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Legs' },
  { name: 'Dumbbell Romanian Deadlift (RDL)', description: 'Hinging at hips holding dumbbells.', targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Legs' },
  { name: 'Dumbbell Lunges', description: 'Lunging while holding dumbbells.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Legs' },
  { name: 'Dumbbell Step-ups', description: 'Stepping onto a chair or bench holding dumbbells.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Legs' },
  { name: 'Dumbbell Calf Raises', description: 'Calf raises holding dumbbells.', targetMuscles: ['Calves'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Legs' },
  // LEGS - Bands
  { name: 'Band Squats', description: 'Squatting with band looped under feet and over shoulders.', targetMuscles: ['Quads', 'Glutes'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Legs' },
  { name: 'Banded Lateral Walks', description: 'Walking sideways with band around knees/ankles.', targetMuscles: ['Glute Medius'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Legs' },
  { name: 'Banded Kickbacks', description: 'Kicking leg back against band resistance.', targetMuscles: ['Glutes'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Legs' },

  // ARMS - Bodyweight
  { name: 'Bench Dips', description: 'Dips using a chair or bench.', targetMuscles: ['Triceps'], difficulty: 'Beginner', equipment: 'Bench', category: 'Arms' },
  { name: 'Tricep Extensions (Wall)', description: 'Pushing off wall using only triceps.', targetMuscles: ['Triceps'], difficulty: 'Beginner', equipment: 'None', category: 'Arms' },
  { name: 'Chin-up Hold', description: 'Holding chin over bar statically.', targetMuscles: ['Biceps', 'Forearms'], difficulty: 'Intermediate', equipment: 'Pull-up Bar', category: 'Arms' },
  { name: 'Plank Up-Downs', description: 'Moving from elbow plank to hand plank.', targetMuscles: ['Triceps', 'Shoulders', 'Core'], difficulty: 'Intermediate', equipment: 'None', category: 'Arms' },
  // ARMS - Dumbbells
  { name: 'Dumbbell Bicep Curls', description: 'Standard bicep curl.', targetMuscles: ['Biceps'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Arms' },
  { name: 'Dumbbell Hammer Curls', description: 'Neutral grip bicep curl.', targetMuscles: ['Brachialis', 'Biceps'], difficulty: 'Beginner', equipment: 'Dumbbells', category: 'Arms' },
  { name: 'Dumbbell Concentration Curls', description: 'Seated, curling with elbow rested on inner thigh.', targetMuscles: ['Biceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Arms' },
  { name: 'Dumbbell Tricep Kickbacks', description: 'Bent over, extending arm backwards.', targetMuscles: ['Triceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Arms' },
  { name: 'Dumbbell Overhead Tricep Extension', description: 'Lowering dumbbell behind head and extending up.', targetMuscles: ['Triceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Arms' },
  { name: 'Dumbbell Skullcrushers', description: 'Lying on floor, lowering weights to ears.', targetMuscles: ['Triceps'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Arms' },
  // ARMS - Bands
  { name: 'Band Bicep Curls', description: 'Standing on band, curling handles up.', targetMuscles: ['Biceps'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Arms' },
  { name: 'Band Tricep Pushdowns', description: 'Band anchored high, pushing down.', targetMuscles: ['Triceps'], difficulty: 'Beginner', equipment: 'Resistance Bands', category: 'Arms' },

  // CORE - Bodyweight
  { name: 'Plank', description: 'Static hold on forearms and toes.', targetMuscles: ['Core', 'Abs'], difficulty: 'Beginner', equipment: 'None', category: 'Core' },
  { name: 'Side Plank', description: 'Static hold on one forearm.', targetMuscles: ['Obliques'], difficulty: 'Intermediate', equipment: 'None', category: 'Core' },
  { name: 'Crunches', description: 'Lifting shoulders off ground.', targetMuscles: ['Upper Abs'], difficulty: 'Beginner', equipment: 'None', category: 'Core' },
  { name: 'Bicycle Crunches', description: 'Alternating elbow to opposite knee.', targetMuscles: ['Abs', 'Obliques'], difficulty: 'Intermediate', equipment: 'None', category: 'Core' },
  { name: 'Leg Raises', description: 'Lying on back, raising straight legs.', targetMuscles: ['Lower Abs'], difficulty: 'Intermediate', equipment: 'None', category: 'Core' },
  { name: 'Hanging Leg Raises', description: 'Hanging from bar, raising legs to chest.', targetMuscles: ['Lower Abs', 'Core'], difficulty: 'Advanced', equipment: 'Pull-up Bar', category: 'Core' },
  { name: 'Russian Twists', description: 'Seated, twisting torso side to side.', targetMuscles: ['Obliques'], difficulty: 'Intermediate', equipment: 'None', category: 'Core' },
  { name: 'Mountain Climbers', description: 'Plank position, driving knees to chest.', targetMuscles: ['Core', 'Cardio'], difficulty: 'Beginner', equipment: 'None', category: 'Core' },
  { name: 'V-Ups', description: 'Simultaneously lifting arms and legs to meet in middle.', targetMuscles: ['Abs', 'Core'], difficulty: 'Advanced', equipment: 'None', category: 'Core' },
  { name: 'Hollow Body Hold', description: 'Static hold with lower back pressed to floor.', targetMuscles: ['Core'], difficulty: 'Advanced', equipment: 'None', category: 'Core' },
  { name: 'Deadbugs', description: 'Lying on back, opposite arm and leg extend.', targetMuscles: ['Core'], difficulty: 'Beginner', equipment: 'None', category: 'Core' },
  { name: 'Bird Dog', description: 'On all fours, opposite arm and leg extend.', targetMuscles: ['Core', 'Lower Back'], difficulty: 'Beginner', equipment: 'None', category: 'Core' },
  // CORE - Dumbbells
  { name: 'Dumbbell Russian Twists', description: 'Russian twists holding a dumbbell.', targetMuscles: ['Obliques'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Core' },
  { name: 'Weighted Crunches', description: 'Crunches holding a dumbbell at chest.', targetMuscles: ['Abs'], difficulty: 'Intermediate', equipment: 'Dumbbells', category: 'Core' },
  // CORE - Bands
  { name: 'Band Woodchoppers', description: 'Pulling band diagonally across body.', targetMuscles: ['Obliques', 'Core'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Core' },
  { name: 'Band Pallof Press', description: 'Pressing band straight out resisting rotation.', targetMuscles: ['Core', 'Obliques'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Core' },

  // FULL BODY / CARDIO / FAT LOSS
  { name: 'Burpees', description: 'Drop to pushup, jump to feet, and jump up.', targetMuscles: ['Full Body', 'Cardio'], difficulty: 'Intermediate', equipment: 'None', category: 'Fat Loss' },
  { name: 'Jumping Jacks', description: 'Classic jumping jacks.', targetMuscles: ['Full Body', 'Cardio'], difficulty: 'Beginner', equipment: 'None', category: 'Fat Loss' },
  { name: 'High Knees', description: 'Running in place lifting knees high.', targetMuscles: ['Cardio', 'Legs', 'Core'], difficulty: 'Beginner', equipment: 'None', category: 'Fat Loss' },
  { name: 'Bear Crawls', description: 'Crawling on hands and toes.', targetMuscles: ['Full Body', 'Core'], difficulty: 'Intermediate', equipment: 'None', category: 'Fat Loss' },
  { name: 'Inchworms', description: 'Walking hands out to plank and back.', targetMuscles: ['Core', 'Shoulders', 'Hamstrings'], difficulty: 'Beginner', equipment: 'None', category: 'Fat Loss' },
  { name: 'Dumbbell Thrusters', description: 'Front squat into overhead press.', targetMuscles: ['Legs', 'Shoulders', 'Full Body'], difficulty: 'Advanced', equipment: 'Dumbbells', category: 'Muscle Building' },
  { name: 'Dumbbell Man Makers', description: 'Pushup, row, clean, thruster sequence.', targetMuscles: ['Full Body'], difficulty: 'Advanced', equipment: 'Dumbbells', category: 'Strength' },
  { name: 'Band Thrusters', description: 'Squat to press using bands.', targetMuscles: ['Full Body'], difficulty: 'Intermediate', equipment: 'Resistance Bands', category: 'Fat Loss' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/goalpilot');
    console.log('Connected to MongoDB');

    // Clear existing
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert new
    await Exercise.insertMany(exercises.map(e => ({
      ...e,
      defaultSets: 3,
      defaultReps: 10,
      defaultRestTime: 60,
      animationUrl: '' // Placeholder for animated guide
    })));

    console.log(`Successfully seeded ${exercises.length} exercises!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

seed();
