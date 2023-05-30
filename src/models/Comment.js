import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    sparse: true,
  },

  text: {
    type: String,
    required: true,
  },
  dateTime: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Comment', CommentSchema);
