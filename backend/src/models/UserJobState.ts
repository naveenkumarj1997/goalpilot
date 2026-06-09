import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface IUserJobState extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  notes?: string;
  appliedDate?: Date;
}

const userJobStateSchema = new Schema<IUserJobState>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { 
      type: String, 
      enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected'],
      default: 'saved'
    },
    notes: { type: String },
    appliedDate: { type: Date },
  },
  { timestamps: true }
);

userJobStateSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model<IUserJobState>('UserJobState', userJobStateSchema);
