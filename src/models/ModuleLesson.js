import mongoose from "mongoose";

const ModuleLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    sparse: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    sparse: true
  }],
}, {
  timestamps: true
});

export default mongoose.model('ModuleLesson', ModuleLessonSchema);
