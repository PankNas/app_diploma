import mongoose from "mongoose";
import UserModel from './Users/User.js';

const CourseSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  // countCheck: {
  //   type: Number,
  // },
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

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModuleLesson',
    sparse: true
  }],
  remarkForCourse: String,
  remarks: [{
    id: {
      type: String,
      // required: true,
    },
    text: String,
  }]

}, {
  timestamps: true,
  cascadeDelete: true,
});

CourseSchema.pre('findOneAndDelete', async function (next) {
  try {
    const courseId = this._id;
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
