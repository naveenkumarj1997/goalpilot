import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastDailyLog: {
    type: Date,
  },
  dailyCheckInTime: {
    type: String,
    default: "20:00", // 24-hour HH:MM format
  },
  nofapCheckInTime: {
    type: String,
    default: "20:00", // 24-hour HH:MM format
  },
  role: {
    type: String,
    enum: ['Standard', 'Premium', 'Admin', 'SuperAdmin'],
    default: 'Standard'
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  },
  blockReason: {
    type: String
  },
  moduleOverrides: {
    type: Map,
    of: Boolean,
    default: {}
  },
  lastActiveAt: {
    type: Date
  }
}, {
  timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
