import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetUserId?: mongoose.Types.ObjectId;
  details?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  details: {
    type: String
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;
