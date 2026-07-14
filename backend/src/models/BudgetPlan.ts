import mongoose, { Document, Schema } from 'mongoose';

export interface IBudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

export interface IBudgetPlan extends Document {
  userId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  categories: IBudgetCategory[];
  totalAllocated: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetCategorySchema = new Schema<IBudgetCategory>({
  name: { type: String, required: true },
  allocated: { type: Number, required: true, default: 0 },
  spent: { type: Number, required: true, default: 0 },
  icon: { type: String, default: 'dollar-sign' },
  color: { type: String, default: '#D4AF37' }
}, { _id: false });

const BudgetPlanSchema = new Schema<IBudgetPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  categories: [BudgetCategorySchema],
  totalAllocated: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const BudgetPlan = mongoose.model<IBudgetPlan>('BudgetPlan', BudgetPlanSchema);
