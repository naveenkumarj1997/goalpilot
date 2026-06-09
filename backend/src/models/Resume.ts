import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetRole?: string;
  templateId: string;
  atsScore?: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary?: string;
  };
  education: {
    _id?: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    cgpa?: string;
  }[];
  experience: {
    _id?: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    _id?: string;
    name: string;
    technologies: string;
    link?: string;
    github?: string;
    description: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'My Resume' },
    targetRole: { type: String },
    templateId: { type: String, default: 'modern' },
    atsScore: { type: Number, default: 0 },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    education: [
      {
        degree: { type: String, default: '' },
        school: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        cgpa: { type: String, default: '' }
      }
    ],
    experience: [
      {
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    ],
    projects: [
      {
        name: { type: String, default: '' },
        technologies: { type: String, default: '' },
        link: { type: String, default: '' },
        github: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    ],
    skills: [
      {
        category: { type: String, default: '' },
        items: [{ type: String }]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
