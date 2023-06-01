import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";
import UserModel from "../models/Users/User.js";
import LessonModel from "../models/Lessons/Lesson.js";
import {ObjectId} from "mongodb";

export const getAll = async (req, res) => {
  try {
    const courses = await CourseModel.find().populate('user reviewers').exec();

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
      .populate('user reviewers')
      .populate({path: 'modules', populate: {path: 'lessons'}})
      .populate({path: 'comments', populate: {path: 'user'}})
      .then(doc => {
        if (!doc) return throwError(res, 'error course', 404, 'Курс не найден!');

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
      status: 'passive',
      user: req.userId,
    });

    const course = await doc.save();

    let user = await UserModel.findById(req.userId).populate('teachCourses');
    user.teachCourses.push(course);
    await user.save();

    res.json(course);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать курс');
  }
};

export const subscript = async (req, res) => {
  try {
    const courseId = req.body.id;

    const course = await CourseModel.findById(courseId);
    const user = await UserModel.findById(req.userId).populate('studentCourses');

    user.studentCourses.push(course);
    user.progressCourses.push({
      course: course,
      lessonsEnd: [],
    });
    // user.studentCourses.push({
    //   course: course,
    //   lessonEnd: 0,
    // });

    await user.save();

    res.json(course);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось записаться на курс');
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId);
    const user = await UserModel.findById(req.userId).populate('studentCourses');

    const index = user.studentCourses.findIndex(item => item === course);

    user.studentCourses.splice(index, 1);
    user.progressCourses.splice(index, 1);
    // user.studentCourses = user.studentCourses.filter(item => item._id !== courseId);

    await user.save();

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось отписаться от курса');
  }
};

export const progress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    const indexCourse = user.studentCourses.indexOf(req.body.course);
    user.progressCourses[indexCourse].lessonsEnd.push(req.body.lesson);

    await user.save();

    res.json(user);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось записать прогресс');
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
          {
            $pull: {
              teachCourses: courseId,
              studentCourses: courseId,
              progressCourses: courseId,
              reviewCourses: courseId
            }
          },
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

    await CourseModel.updateOne(
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

    const course = await CourseModel.findById(courseId)
      .populate({path: 'modules', populate: {path: 'lessons'}});

    if (course.status === 'check') {
      // const moderator = await UserModel.findOne({reviewCourses: courseId}).populate('reviewCourses');
      // moderator.reviewCourses = moderator.reviewCourses.filter(course => course._id !== courseId);
      // await moderator.save();

      // course.reviewers = course.reviewers.filter(item => item._id !== req.body.reviewer)

      if (req.body.delete) {
        const moderator = await UserModel.find({reviewCourses: courseId});
        console.log(moderator);
        // moderator.reviewCourses = moderator.reviewCourses.filter(course => course._id !== courseId);
        // await moderator.save();

        course.remarkForCourse = new Array(2).fill('');

        course.modules.forEach(module => {
          module.lessons.forEach(async lesson => {
            lesson.remarks = new Array(2).fill('');

            await lesson.save();
          });
        });

        course.countCheck = 0;
        course.reviewers = [];

        // course.lessons.forEach(async lesson => {
        //   lesson.remarks = new Array(2).fill('');
        //
        //   await lesson.save();
        // })
      } else {
        const index = course.reviewers.findIndex(item => item._id !== req.body.reviewer);

        if (index !== -1) {
          course.remarkForCourse.splice(index, 1);

          course.modules.forEach(module => {
            module.lessons.forEach(async lesson => {
              lesson.remarks.splice(index, 1);

              await lesson.save();
            });
          });

          // course.lessons.forEach(async lesson => {
          //   lesson.remarks.splice(index, 1);
          //
          //   await lesson.save();
          // })
        }
      }

      // course.remarks = [];
    }

    if (course.status === 'fail') {
      // const moderators = await UserModel.find({reviewCourses: courseId});
      //
      // moderators.forEach(async moderator => {
      //   moderator.reviewCourses = moderator.reviewCourses.filter(course => course._id !== courseId);
      //   await moderator.save();
      // });
      //
      // course.reviewers = [];
      // course.countCheck = 0;
    }

    if (course.status === 'moderate') {
      course.reviewers.push(req.body.reviewer);
    }

    if (course.status === 'active') {
      course.countCheck += 1;

      if (course.countCheck < 2) course.status = 'check';
    }

    // console.log(course);

    await course.save();

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};

export const addRemarkLesson = async (req, res) => {
  try {
    const courseId = req.params.id;
    const lessonId = req.params.lessonId;

    const course = await CourseModel.findById(courseId).populate('reviewers');
    const index = course.reviewers.findIndex(reviewer => reviewer._id.toString() === req.body.reviewer);

    const lesson = await LessonModel.findById(lessonId);
    lesson.remarks[index] = req.body.text;
    await lesson.save();

    // const course = await CourseModel.findById(courseId);
    // const remarkIndex = course.remarks.findIndex(remark => remark.id === lessonId);
    //
    // if (remarkIndex === -1) {
    //   course.remarks.push({
    //     id: lessonId,
    //     text: req.body.text,
    //   })
    // } else {
    //   course.remarks[remarkIndex].text = req.body.text;
    // }

    // await course.save();

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};

export const addRemarkCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId);
    const index = course.reviewers.findIndex(reviewer => reviewer._id.toString() === req.body.reviewer);

    if (index !== -1) {
      course.remarkForCourse[index] = req.body.remarkForCourse;
    }

    await course.save();

    // await CourseModel.updateOne(
    //   {_id: courseId},
    //   {
    //     remarkForCourse: req.body.remarkForCourse,
    //   }
    // )

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};

export const removeRemarkCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await CourseModel.updateOne(
      {_id: courseId},
      {
        remarkForCourse: req.body.remarkForCourse,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};

export const removeRemarkLesson = async (req, res) => {
  try {
    const courseId = req.params.id;

    await CourseModel.updateOne(
      {_id: courseId},
      {
        remarkForCourse: req.body.remarkForCourse,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};

export const setScore = async (req, res) => {
  try {

    const course = await CourseModel.findById(req.params.id);

    const index = course.scores.findIndex(score => score.user.toString() === req.userId.toString());

    if (index === -1) {
      course.scores.push({
        score: req.body.score,
        user: req.userId,
      })
    } else {
      course.scores[index].score = req.body.score === course.scores[index].score ? 0 : req.body.score;
    }

    await course.save();

    res.json(course);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить рейтинг');
  }
};
