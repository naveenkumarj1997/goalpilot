import mongoose from 'mongoose';

const yogaPoseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  durationSeconds: {
    type: Number,
    default: 30
  },
  benefits: [{
    type: String
  }],
  precautions: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['Flexibility', 'Balance', 'Strength', 'Relaxation', 'Core', 'Mobility'],
    required: true
  }
}, {
  timestamps: true
});

const YogaPose = mongoose.model('YogaPose', yogaPoseSchema);
export default YogaPose;
