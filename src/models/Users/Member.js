import mongoose from "mongoose";
import User from './User.js';

const MemberSchema = new mongoose.Schema({
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
  }]

}, {
  timestamps: true,
});

export default User.discriminator('Member', MemberSchema);
