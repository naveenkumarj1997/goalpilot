import mongoose, { Document, Schema } from 'mongoose';

export interface IAstrologyNote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AstrologyNoteSchema = new Schema<IAstrologyNote>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    source: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IAstrologyNote>('AstrologyNote', AstrologyNoteSchema);
