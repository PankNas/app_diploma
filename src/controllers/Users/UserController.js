import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../../models/Users/User.js";
import {throwError} from "../../utils/throwError.js";

export const getAll = async (req, res) => {
  try {
    const courses = await UserModel.find().exec();

    res.json(courses);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить пользователей');
  }
};

export const register = async (request, response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(request.body.password, salt);

    const doc = new UserModel({
      email: request.body.email,
      role: 'member',
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
      passwordHash: passHash,
    });

    // if (request.body.codeAccess === '') {
    //   doc = await registerMember(request, passHash);
    // } else if (await findCodeModerator(request.body.codeAccess)) {
    //   doc = await registerModerator(request, passHash);
    // } else if (await findCodeAdm(request.body.codeAccess)) {
    //   doc = await registerAdm(request, passHash);
    // } else {
    //   throw new Error('Не удалось зарегистрироваться');
    // }

    const user = await doc.save();

    const token = jwt.sign(
      {_id: user._id,},
      'secret123',
      {expiresIn: '30d',},
    );

    const {passwordHash, ...userData} = user._doc;

    response.json({
      ...userData,
      token,
    });
  } catch (err) {
    throwError(response, err, 500, 'Не удалось зарегистрироваться');
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user)
      return throwError(res, '', 404, 'Неверные данные');

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass)
      return throwError(res, '', 400, 'Неверные данные');

    const token = jwt.sign(
      {_id: user._id,},
      'secret123',
      {expiresIn: '30d',},
    );

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    throwError(res, err, 500, 'Не удалось авторизоваться');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .populate({path: 'teachCourses reviewCourses'})
      .populate({path: 'studentCourses', populate: {path: 'modules'}});

    if (!user)
      return throwError(res, '', 404, 'Пользователь не найден');

    const {passwordHash, ...userData} = user._doc;

    res.json(userData);
  } catch (err) {
    throwError(res, err, 500, 'Нет доступа');
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    await UserModel.updateOne(
      {_id: id},
      {
        role: req.body?.role,
        reviewCourses: req.body?.reviewCourses,
        avatarUrl: req.body?.avatarUrl,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить пользователя');
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.params.id;

    UserModel.findOneAndDelete({_id: userId})
      .then(async doc => {
        if (!doc) return throwError(res, 'error', 500, 'Не удалось удалить пользователя');

        // await CourseModel.updateMany(
        //   {},
        //   {$pull: {user: userId}},
        //   {new: true}
        // );

        res.json({success: true});
      })
      .catch(err => throwError(res, err, 500, 'Не удалось удалить пользователя'));
  } catch (err) {
    throwError(res, err, 500, 'Не удалось получить пользователя');
  }
};
