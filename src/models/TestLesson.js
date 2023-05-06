import mongoose from "mongoose";
import Lesson from "./Lesson.js";

const TestLessonSchema = new mongoose.Schema({
  totalScore: {
    type: Number,
    sparse: true
  },
  itemsTest: [{
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
    score: {
      type: Number,
      sparse: true
    },
  }],
}, {
  timestamps: true
});

export default Lesson.discriminator('TestLesson', TestLessonSchema);
