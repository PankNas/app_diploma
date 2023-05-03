import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const TextLessonSchema = new mongoose.Schema({
  // type: {
  //   type: String,
  //   required: true
  // },
  // title: {
  //   type: String,
  //   required: true
  // },
  desc: {
    type: String,
    required: true
  },
  // course: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Course',
  //   required: true
  // },
}, {
  timestamps: true
});

export default Lesson.discriminator('TextLesson', TextLessonSchema);

// export default mongoose.model('TextLesson', TextLessonSchema);
