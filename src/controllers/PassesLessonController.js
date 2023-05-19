import {throwError} from "../utils/throwError.js";
import {createLesson} from "./LessonsController.js";
import PassesLessonModel from "../models/PassesLesson.js";

export const create = async (req, res) => {
  try {
    const doc = new PassesLessonModel({
      type: req.body.type,
      title: req.body.title,
      sentence: req.body.sentence,
      course: req.body.course,
      module: req.body.module,
    });

    const lesson = await createLesson(doc, PassesLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать урок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await PassesLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        sentence: req.body.sentence,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить урок');
  }
};
