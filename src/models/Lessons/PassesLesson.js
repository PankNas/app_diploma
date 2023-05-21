import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const PassesLessonSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default Lesson.discriminator('PassesLesson', PassesLessonSchema);
