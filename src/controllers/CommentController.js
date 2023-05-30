import CommentModel from "../models/Comment.js";
import {throwError} from "../utils/throwError.js";
import CourseModel from "../models/Course.js";
import LessonModel from "../models/Lessons/Lesson.js";

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      dateTime: req.body.dateTime,
      user: req.userId,
      lesson: req.body?.lesson,
      course: req.body?.course,
    });

    const comment = await doc.save();

    const [model, id] = doc?.lesson ? [LessonModel, doc.lesson] : [CourseModel, doc.course];
    const obj = await model.findById(id).populate('comments');
    console.log(comment, model, id);

    obj.comments.push(comment);
    await obj.save();

    res.json(comment);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать комментарий');
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id;

    CommentModel.findOneAndDelete({_id: commentId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить комментарий');

        await CourseModel.updateMany(
          {},
          {$pull: {comments: commentId}},
          {new: true}
        );

        await LessonModel.updateMany(
          {},
          {$pull: {comments: commentId}},
          {new: true}
        );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить комментарий'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить комментарий');
  }
};

export const update = async (req, res) => {
  try {
    const commentId = req.params.id;

    await CommentModel.updateOne(
      {_id: commentId},
      {
        dateTime: req.body.dateTime,
        text: req.body.text,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить комментарий');
  }
};
