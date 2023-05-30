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

UserSchema.pre('remote', async function (next) {
  try {
    // Remove associated courses
    try {
      await CourseModel.deleteMany({ _id: { $in: this.teachCourses } });
    } catch (err) {
      console.log('1', err);
      next(err);
    }

    // Remove the user's reference from teaching courses
    try {
      await CourseModel.updateMany(
        { _id: { $in: this.teachCourses } },
        { $pull: { user: this._id } }
      );
    } catch (err) {
      console.log(err);
      next('11', err);
    }

    return next();

    // console.log('remote user');
    //
    // // Retrieve user teachCourses and studentCourses
    // const {teachCourses, studentCourses} = this;
    //
    // // const courses = await CourseModel.find({ 'user': this._id });
    //
    //
    // // Delete teachCourses and studentCourses
    // await Promise.all([
    //   CourseModel.updateMany( // UpdateMany for better performance
    //     {_id: {$in: teachCourses}},
    //     {$pull: {user: this._id}}
    //   ),
    //   // CourseModel.updateMany(
    //   //   {_id: {$in: studentCourses}},
    //   //   {$pull: {user: this._id}}
    //   // ),
    //
    //   // CourseModel.updateMany( // UpdateMany for better performance
    //   //   {_id: {$in: teachCourses}},
    //   //   {$pull: {teachCourses: this._id}}
    //   // ),
    //   // CourseModel.updateMany(
    //   //   {_id: {$in: studentCourses}},
    //   //   {$pull: {studentCourses: this._id}}
    //   // ),
    // ]);
    //
    // return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model('User', UserSchema);
