import {throwError} from "../utils/throwError.js";
import {createLesson} from "./LessonsController.js";
import TranslateLessonModel from "../models/Lessons/TranslateLesson.js";

export const create = async (req, res) => {
  try {
    const doc = new TranslateLessonModel({
      type: req.body.type,
      title: req.body.title,
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      course: req.body.course,
      module: req.body.module,
    });

    const lesson = await createLesson(doc, TranslateLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать урок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await TranslateLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить урок');
  }
};
