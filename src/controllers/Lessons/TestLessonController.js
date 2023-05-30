import {throwError} from "../../utils/throwError.js";
import {createLesson} from "./LessonsController.js";
import TestLessonModel from "../../models/Lessons/TestLesson.js";

export const create = async (req, res) => {
  try {
    const doc = new TestLessonModel({
      type: req.body.type,
      id: req.body.id,
      title: req.body.title,
      itemsTest: req.body.itemsTest,
      totalScore: req.body.totalScore,
      course: req.body.course,
      module: req.body.module,
    });

    const lesson = await createLesson(doc, TestLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать урок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await TestLessonModel.updateOne(
      {_id: lessonId},
      {
        id: req.body.id,
        title: req.body.title,
        itemsTest: req.body.itemsTest,
        totalScore: req.body.totalScore,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить урок');
  }
};
