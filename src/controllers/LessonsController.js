import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";
import LessonModel from "../models/Lesson.js";

export const createLesson = async (doc, model) => {
  await doc.save();

  const lesson = await model.findById(doc._id).populate('course');

  let course = await CourseModel.findById(doc.course).populate('lessons');
  course.lessons.push(lesson);
  await course.save();

  return lesson;
};

export const getOne = async (req, res) => {
  try {
    const lessonId = req.params.id;

    LessonModel.findOne({_id: lessonId})
      .populate('course')
      .then(doc => {
        if (!doc) return throwError(res, '', 404, 'Урок не найден!');

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

        await CourseModel.updateMany(
          {},
          {$pull: {lessons: lessonId}},
          {new: true}
        );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить урок'));

  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить урок');
  }
};
