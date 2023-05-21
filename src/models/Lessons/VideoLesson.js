import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const VideoLessonSchema = new mongoose.Schema({
  desc: String,
  videoUrl: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

export default Lesson.discriminator('VideoLesson', VideoLessonSchema);
