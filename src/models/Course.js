import mongoose from "mongoose";
import UserModel from './Users/User.js';

const CourseSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  statusOld: {
    type: String,
  },

  reviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  countCheck: {
    type: Number,
    default: 0,
  },

  title: {
    type: String,
    sparse: true
  },
  desc: {
    type: String,
    sparse: true
  },
  language: {
    type: String,
    sparse: true
  },
  levelLanguage: {
    type: String,
    sparse: true
  },
  imageUrl: {
    type: String,
    // default: '/uploads/backAvaCourse.jpg'
  },

  scores: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  }],
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModuleLesson',
    sparse: true
  }],
  remarkForCourse: [{
    type: String,
    default: new Array(2).fill('')
  }],
  // remarks: [{
  //   id: {
  //     type: String,
  //     // required: true,
  //   },
  //   text: String,
  // }]

}, {
  timestamps: true,
  cascadeDelete: true,
});

CourseSchema.pre('findOneAndDelete', async function (next) {
  try {
    const courseId = this._id;
    console.log(courseId);
    // Удаление курса из списка пользователей
    const users = await UserModel.find({ 'studentCourses.course': courseId });

    users.forEach(async (user) => {
      user.progressCourses = user.progressCourses.filter((p) => String(p.course) !== String(courseId));
      await user.save();
    });

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Course', CourseSchema);
