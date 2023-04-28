import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";
import VideoLessonModel from "../models/VideoLesson.js";
import UserModel from "../models/User.js";

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
      // {$inc: {viewsCount: 1}},
      {returnDocument: 'after'}
    )
      .populate('user')
      .populate('lessons')
      .then(doc => {
        if (!doc) return throwError(res, '', 404, 'Курс не найден!');

        res.json(doc);
      })
      .catch(err => throwError(res, err, 500, 'Не удалось вернуть курс'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курс');
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CourseModel({
      title: req.body?.title,
      desc: req.body?.desc,
      imageUrl: req.body?.imageUrl,
      language: req.body?.language,
      levelLanguage: req.body?.levelLanguage,
      user: req.userId,
    });

    const course = await doc.save();

    // const videoLesson = await VideoLessonModel.findById(doc._id).populate('course');

    let user = await UserModel.findById(req.userId).populate('teachCourses');
    user.teachCourses.push(course);
    await user.save();

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
        desc: req.body.desc,
        imageUrl: req.body.imageUrl,
        language: req.body.language,
        levelLanguage: req.body.levelLanguage,
        user: req.userId,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};
