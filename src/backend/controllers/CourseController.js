import CourseModel from "../models/Course.js";
import {throwError} from "../utils/error.js";

export const getAll = async (req, res) => {
  try {
    const courses = await CourseModel.find().populate('user').exec();

    res.json(courses);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курсы');
  }
};

export const getOne = async (req, res) => {
  try {
    const courseId = req.params.id;

    CourseModel.findOneAndUpdate(
      {_id: courseId},
      {$inc: {viewsCount: 1}},
      {returnDocument: 'after'}
    )
      .then(doc => {
        if (!doc) return throwError(res, '', 404, 'Статья не найдена');

        res.json(doc);
      })
      .catch(err => {
        throwError(res, err, 500, 'Не удалось вернуть курс')
      });
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курс');
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CourseModel({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const course = await doc.save();

    res.json(course);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать курс');
  }
};
