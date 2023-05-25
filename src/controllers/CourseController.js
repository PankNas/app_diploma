import CourseModel from "../models/Course.js";
import {throwError} from "../utils/throwError.js";
import UserModel from "../models/Users/User.js";

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
      .populate({ path: 'modules', populate: { path: 'lessons' } })
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
          {$pull: {teachCourses: courseId, studentCourses: courseId, progressCourses: courseId}},
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

    const course = await CourseModel.findById(courseId);
    const remarkIndex = course.remarks.findIndex(remark => remark.id === req.body.id);

    if (remarkIndex === -1) {
      course.remarks.push({
        id: req.body.id,
        text: req.body.text,
      })
    } else {
      course.remarks[remarkIndex].text = req.body.text;
    }

    await course.save();

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить курс');
  }
};
