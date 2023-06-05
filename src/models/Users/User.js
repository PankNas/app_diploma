import mongoose from "mongoose";
import CourseModel from "../Course.js";

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: String,

  // member
  teachCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true
  }],

  studentCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true
  }],
  progressCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      sparse: true
    },
    lessonsEnd: [String],
  }],

  //moderator
  reviewCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true
  }]
}, {
  timestamps: true,
});

export default mongoose.model('User', UserSchema);
