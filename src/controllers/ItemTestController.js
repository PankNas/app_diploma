import ItemTestModel from "../models/ItemTest.js";
import TestLessonModel from "../models/TestLesson.js";
import {throwError} from "../utils/throwError.js";

export const getOne = async (req, res) => {
  try {
    const itemId = req.params.id;

    ItemTestModel.findOne({_id: itemId})
      .populate('test')
      .then(doc => {
        if (!doc) return throwError(res, 'error', 404, 'Пункт теста не найден!');

        res.json(doc);
      })
      .catch(err => throwError(res, err, 500, 'Не удалось вернуть пункт теста'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить пункт теста');
  }
};

export const create = async (req, res) => {
  try {
    const doc = new ItemTestModel({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      score: req.body.score,
      test: req.body.test,
    });

    await doc.save();

    res.json(doc);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать пункт теста');
  }
};

// export const remove = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//
//     CourseModel.findOneAndDelete({_id: courseId})
//       .then(doc => {
//         if (!doc) return throwError(res, '', 500, 'Не удалось удалить курс');
//
//         res.json({success: true});
//       })
//       .catch(_ => throwError(res, '', 500, 'Не удалось удалить курс'));
//   } catch (err) {
//     throwError(res, err, 500, 'Не удалось получить курс');
//   }
// };

// export const update = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//
//     await CourseModel.updateOne(
//       {_id: courseId},
//       {
//         title: req.body.title,
//         desc: req.body.desc,
//         imageUrl: req.body.imageUrl,
//         language: req.body.language,
//         levelLanguage: req.body.levelLanguage,
//         user: req.userId,
//       }
//     );
//
//     res.json({success: true});
//   } catch (err) {
//     throwError(res, err, 500, 'Не удалось обновить курс');
//   }
// };
