import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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

  teachCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true
  }],
  // studentCourses: [{
  //   course: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Course',
  //     sparse: true
  //   },
  //   lessonEnd: Number,
  // }],

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
    // resLessons: [{
    //   lessonId: String,
    //   answer: String,
    // }],
  }]

}, {
  timestamps: true,
});

export default mongoose.model('User', UserSchema);
