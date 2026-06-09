import { calculateGoalTargets } from './src/utils/goalCalculator';

const today = new Date();
const deadline = new Date(today);
deadline.setDate(today.getDate() + 10); // 10 days from now

const result = calculateGoalTargets(deadline.toISOString(), 100, 8);
console.log('Result for 100 hours in 10 days with 8 avail/day:', result);

const result2 = calculateGoalTargets(deadline.toISOString(), 100, 12);
console.log('Result for 100 hours in 10 days with 12 avail/day:', result2);
