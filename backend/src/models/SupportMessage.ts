import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['User', 'Admin'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
export default SupportMessage;
