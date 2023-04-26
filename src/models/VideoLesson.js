import mongoose from "mongoose";

const VideoLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },

}, {
  timestamps: true,
});

export default mongoose.model('VideoLesson', VideoLessonSchema);
