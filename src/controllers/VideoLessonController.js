import VideoLessonModel from "../models/VideoLesson.js";
import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";

export const getOne = async (req, res) => {
  try {
    const lessonId = req.params.id;

    VideoLessonModel.findOne({_id: lessonId})
      .populate('course')
      .then(doc => {
        if (!doc) return throwError(res, '', 404, 'Видеоурок не найден!');

        res.json(doc);
      })
      .catch(err => throwError(res, err, 500, 'Не удалось вернуть видеоурок'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить видеоурок');
  }
};

export const create = async (req, res) => {
  try {
    const doc = new VideoLessonModel({
      type: req.body.type,
      title: req.body.title,
      desc: req.body.desc,
      videoUrl: req.body.videoUrl,
      course: req.body.course,
    });

    await doc.save();

    const videoLesson = await VideoLessonModel.findById(doc._id).populate('course');

    let course = await CourseModel.findById(req.body.course).populate('lessons');
    course.lessons.push(videoLesson);
    await course.save();

    res.json(videoLesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать видеоурок');
  }
};

export const remove = async (req, res) => {
  try {
    const lessonId = req.params.id;

    VideoLessonModel.findOneAndDelete({_id: lessonId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить видеоурок');

        const course = await CourseModel.findById(req.body.course).populate('lessons');

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить видеоурок'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить видеоурок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await VideoLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        desc: req.body.desc,
        videoUrl: req.body.imageUrl,
        course: req.course,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить видеоурок');
  }
};
