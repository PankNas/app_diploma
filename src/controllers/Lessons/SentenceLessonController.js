import SentenceLessonModel from "../../models/Lessons/SentenceLesson.js";
import {throwError} from "../../utils/throwError.js";
import {createLesson} from "./LessonsController.js";

export const create = async (req, res) => {
  try {
    const doc = new SentenceLessonModel({
      type: req.body.type,
      title: req.body.title,
      sentence: req.body.sentence,
      translate: req.body.translate,
      course: req.body.course,
      module: req.body.module,
    });

    const lesson = await createLesson(doc, SentenceLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать урок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await SentenceLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        sentence: req.body.sentence,
        translate: req.body.translate,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить урок');
  }
};
