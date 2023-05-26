import {throwError} from "../../utils/throwError.js";
import ModeratorModel from '../../models/Users/Moderator.js';
import CourseModel from "../../models/Course.js";
import UserModel from "../../models/Users/User.js";
import mongoose from "mongoose";

export const add = async (req, res) => {
  try {
    const moderator = await UserModel.findById(req.userId);
    const course = await CourseModel.findById(req.body.course);
    moderator.reviewCourses.push(course);
    await moderator.save();

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось принять курс на модерацию');
  }
};

export const remove = async (req, res) => {
  try {
    const courseId = req.params.id;

    const moderator = await UserModel.findById(req.userId).populate('reviewCourses');
    const course = await CourseModel.findById(courseId);

    const result = await UserModel.findByIdAndUpdate(
      moderator._id,
      { $pull: { 'reviewCourses': {$in: course._id} } },
      { new: true }
    );

    // console.log(moderator.reviewCourses);
    // moderator.reviewCourses = moderator.reviewCourses.filter(course => course._id !== courseId);
    // console.log(moderator.reviewCourses);
    // await moderator.save();
    // console.log(result.reviewCourses);

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось удалить курс из модератора');
  }
};
