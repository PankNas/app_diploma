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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
}, {
  timestamps: true
});

export default mongoose.model('Lesson', LessonSchema);
