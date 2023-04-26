import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    sparse:true
    // required: true,
  },
  desc: {
    type: String,
    sparse:true
    // required: true,
  },
  language: {
    type: String,
    sparse:true
    // required: true,
  },
  levelLanguage: {
    type: String,
    sparse:true
    // required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,

}, {
  timestamps: true,
});

export default mongoose.model('Course', CourseSchema);
