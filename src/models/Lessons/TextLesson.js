import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const TextLessonSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

export default Lesson.discriminator('TextLesson', TextLessonSchema);
