import VideoLessonModel from "../models/VideoLesson.js";
import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";

// export const getAll = async (req, res) => {
//   try {
//     const courses = await CourseModel.find().populate('user').exec();
//
//     res.json(courses);
//   } catch (err) {
//     throwError(res, err, 500, 'Не удалось получить курсы');
//   }
// };
//
// export const getOne = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//
//     CourseModel.findOneAndUpdate(
//       {_id: courseId},
//       // {$inc: {viewsCount: 1}},
//       {returnDocument: 'after'}
//     )
//       .populate('user')
//       .then(doc => {
//         if (!doc) return throwError(res, '', 404, 'Курс не найден!');
//
//         res.json(doc);
//       })
//       .catch(_ => throwError(res, '', 500, 'Не удалось вернуть курс'));
//   } catch (err) {
//     throwError(res, err, 500, 'Не удалось получить курс');
//   }
// };

export const create = async (req, res) => {
  try {
    const doc = new VideoLessonModel({
      title: req.body.title,
      desc: req.body.desc,
      videoUrl: req.body.videoUrl,
      course: req.body.course,
    });

    await doc.save();

    const videoLesson = await VideoLessonModel.findById(doc._id).populate('course');

    let course = await CourseModel.findById(req.body.course).populate('lessons')
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
      .then(doc => {
        if (!doc) return throwError(res, '', 500, 'Не удалось удалить видеоурок');

        res.json({success: true});
      })
      .catch(_ => throwError(res, '', 500, 'Не удалось удалить видеоурок'));
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
        course: req.courseId,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить видеоурок');
  }
};
