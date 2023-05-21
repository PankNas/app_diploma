import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const TranslateLessonSchema = new mongoose.Schema({
  question: {
    type: String,
    sparse: true
  },
  options: {
    type: [String],
    sparse: true
  },
  answer: {
    type: Number,
    sparse: true
  },
}, {
  timestamps: true
});

export default Lesson.discriminator('TranslateLesson', TranslateLessonSchema);
