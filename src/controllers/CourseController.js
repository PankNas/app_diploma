import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";

export const getLastTags = async (req, res) => {
  try {
    const courses = await CourseModel.find().limit(5).exec();

    const tags = courses.flatMap(obj => obj.tags).slice(0, 5);

    res.json(tags);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курсы');
  }
};

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
      .populate('user')
      .then(doc => {
        if (!doc) return throwError(res, '', 404, 'Статья не найдена');

        res.json(doc);
      })
      .catch(_ => throwError(res, '', 500, 'Не удалось вернуть курс'))
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

export const remove = async (req, res) => {
  try {
    const courseId = req.params.id;

    CourseModel.findOneAndDelete({_id: courseId})
      .then(doc => {
        if (!doc) return throwError(res, '', 500, 'Не удалось удалить курс');

        res.json({success: true});
      })
      .catch(_ => throwError(res, '', 500, 'Не удалось удалить курс'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курс');
  }
};

export const update = async (req, res) => {
  try {
    const courseId = req.params.id;

    await CourseModel.updateOne(
      {_id: courseId},
      {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
        }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить статью');
  }
};
