import mongoose from "mongoose";

const ItemTestSchema = new mongoose.Schema({
  question: {
    type: String,
    sparse: true
  },
  options: {
    type: [String],
    sparse: true
  },
  answer: {
    type: String,
    sparse: true
  },
  score: {
    type: Number,
    sparse: true
  },

  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestLesson',
    sparse: true
  },
}, {
  timestamps: true
});

export default mongoose.model('ItemTest', ItemTestSchema);
