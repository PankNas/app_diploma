import mongoose from "mongoose";
import UserModel from './User.js';

const CourseSchema = new mongoose.Schema({
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
  imageUrl: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    sparse: true
  }],

}, {
  timestamps: true,
  cascadeDelete: true,
});

CourseSchema.pre('remove', async function (next) {
  try {
    const courseId = this._id;
    // Удаление курса из списка пользователей
    const users = await UserModel.find({ 'progressCourses.course': courseId });

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
