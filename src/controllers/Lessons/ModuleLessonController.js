import CourseModel from "../../models/Course.js";
import {throwError} from "../../utils/throwError.js";
import ModuleLessonModel from '../../models/Lessons/ModuleLesson.js';
import TextLessonModel from "../../models/Lessons/TextLesson.js";

export const create = async (req, res) => {
  try {
    const doc = new ModuleLessonModel({
      course: req.body.course,
    });

    const module = await doc.save();

    let course = await CourseModel.findById(doc.course).populate('modules');
    course.modules.push(module);
    await course.save();

    res.json(module);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать модуль');
  }
};

// export const getOne = async (req, res) => {
//   try {
//     const lessonId = req.params.id;
//
//     LessonModel.findOne({_id: lessonId})
//       .populate('course')
//       .then(doc => {
//         if (!doc) return throwError(res, 'error lessons', 404, 'Урок не найден!');
//
//         res.json(doc);
//       })
//       .catch(err => throwError(res, err, 500, 'Не удалось вернуть урок'));
//   } catch (err) {
//     throwError(res, err, 500, 'Не удалось получить урок');
//   }
// };

export const remove = async (req, res) => {
  try {
    const moduleId = req.params.id;

    ModuleLessonModel.findOneAndDelete({_id: moduleId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить модуль');

        await CourseModel.updateMany(
          {},
          {$pull: {modules: moduleId}},
          {new: true}
        );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить модуль'));

  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить урок');
  }
};

export const update = async (req, res) => {
  try {
    const moduleId = req.params.id;

    await ModuleLessonModel.updateOne(
      {_id: moduleId},
      {
        title: req.body.title,
        lessons: req.body.lessons,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить модуль');
  }
};
