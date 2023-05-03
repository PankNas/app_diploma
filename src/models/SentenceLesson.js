import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const SentenceLessonSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  },
  translate: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

export default Lesson.discriminator('SentenceLesson', SentenceLessonSchema);
