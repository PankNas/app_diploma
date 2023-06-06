import CourseModel from "../../models/Course.js";
import {throwError} from "../../utils/throwError.js";
import LessonModel from "../../models/Lessons/Lesson.js";
import ModuleLessonModel from "../../models/Lessons/ModuleLesson.js";
import UserModel from "../../models/Users/User.js";

export const createLesson = async (doc, model) => {
  await doc.save();

  const lesson = await model.findById(doc._id).populate('course');

  let module = await ModuleLessonModel.findById(doc.module).populate('lessons');
  module.lessons.push(lesson);

  await module.save();

  return lesson;
};

export const getOne = async (req, res) => {
  try {
    const lessonId = req.params.id;

    LessonModel.findOne({_id: lessonId})
      .populate('module')
      .populate({ path: 'course', populate: { path: 'user' } })
      .populate({ path: 'comments', populate: { path: 'user' } })
      .then(doc => {
        if (!doc) return throwError(res, 'error lessons', 404, 'Урок не найден!');

        res.json(doc);
      })
      .catch(err => throwError(res, err, 500, 'Не удалось вернуть урок'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить урок');
  }
};

export const remove = async (req, res) => {
  try {
    const lessonId = req.params.id;

    LessonModel.findOneAndDelete({_id: lessonId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить урок');

        await ModuleLessonModel.updateMany(
          {},
          {$pull: {lessons: lessonId}},
          {new: true}
        );

        // await UserModel.updateMany(
        //   {},
        //   {$pull: {progressCourses: lessonId}},
        //   {new: true}
        // );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить урок'));

  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить урок');
  }
};
