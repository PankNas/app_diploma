import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  remarks: [{
    type: String,
    default: new Array(2).fill('')
  }],

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModuleLesson',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  }],
}, {
  timestamps: true
});

export default mongoose.model('Lesson', LessonSchema);
