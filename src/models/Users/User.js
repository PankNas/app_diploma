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

UserSchema.pre('remove', async function (next) {
  try {
    console.log('remote user');

    // Retrieve user teachCourses and studentCourses
    const {teachCourses, studentCourses} = this;

    // Delete teachCourses and studentCourses
    await Promise.all([
      CourseModel.updateMany( // UpdateMany for better performance
        {_id: {$in: teachCourses}},
        {$pull: {teachers: this._id}}
      ),
      CourseModel.updateMany(
        {_id: {$in: studentCourses}},
        {$pull: {students: this._id}}
      ),
    ]);

    return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model('User', UserSchema);
