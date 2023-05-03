import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    sparse: true
  },
  desc: {
    type: String,
    sparse: true
  },
  language: {
    type: String,
    sparse: true
  },
  levelLanguage: {
    type: String,
    sparse: true
  },
  imageUrl: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    sparse: true
  }],

}, {
  timestamps: true,
});

export default mongoose.model('Course', CourseSchema);
