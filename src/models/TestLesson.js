import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const TestLessonSchema = new mongoose.Schema({
  totalScore: {
    type: Number,
    sparse: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemTest',
    sparse: true
  }],
}, {
  timestamps: true
});

export default Lesson.discriminator('TestLesson', TestLessonSchema);
