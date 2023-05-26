import TextLessonModel from "../models/Lessons/TextLesson.js";
import {throwError} from "../utils/throwError.js";
import {createLesson} from "./LessonsController.js";

export const create = async (req, res) => {
  try {
    const doc = new TextLessonModel({
      type: req.body.type,
      title: req.body.title,
      desc: req.body.desc,
      course: req.body.course,
      module: req.body.module,
      remarks: '',
    });

    const lesson = await createLesson(doc, TextLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать урок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    const lesson = await TextLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        desc: req.body.desc,
        course: req.course,
      }
    );

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить урок');
  }
};
