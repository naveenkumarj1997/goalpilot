import mongoose, { Document } from 'mongoose';

export interface IManifestationGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  deadline: Date;
  priority: string;
  status: string;
  yearlyPlan: string[];
  monthlyPlan: string[];
  weeklyPlan: string[];
  dailyTasks: Array<{
    task: string;
    completed: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const manifestationGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Active', 'Completed', 'Dropped'], default: 'Active' },
  yearlyPlan: [{ type: String }],
  monthlyPlan: [{ type: String }],
  weeklyPlan: [{ type: String }],
  dailyTasks: [{
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model<IManifestationGoal>('ManifestationGoal', manifestationGoalSchema);
