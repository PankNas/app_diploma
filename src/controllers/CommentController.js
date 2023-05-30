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

    obj.comments.push(comment);
    await obj.save();

    res.json(comment);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать комментарий');
  }
};

export const remove = async (req, res) => {
  try {
    const courseId = req.params.id;

    CourseModel.findOneAndDelete({_id: courseId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить курс');

        await UserModel.updateMany(
          {},
          {$pull: {teachCourses: courseId, studentCourses: courseId, progressCourses: courseId, reviewCourses: courseId}},
          {new: true}
        );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить курс'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить курс');
  }
};

export const update = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log('courseId', courseId);

    const course = await CourseModel.updateOne(
      {_id: courseId},
      {
        title: req.body?.title,
        desc: req.body?.desc,
        imageUrl: req.body?.imageUrl,
        language: req.body?.language,
        levelLanguage: req.body?.levelLanguage,
        status: req.body?.status,
        // countCheck: req.body?.countCheck,
      }
    );

    if (course.status === 'check') {
      const moderator = await UserModel.findOne({reviewCourses: courseId}).populate('reviewCourses');
      moderator.reviewCourses = moderator.reviewCourses.filter(course => course._id !== courseId);
      await moderator.save();

      course.remarkForCourse = undefined;
      course.remarks = [];
      await course.save();
    }

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};
