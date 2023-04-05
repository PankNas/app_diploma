import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import {throwError} from "../utils/throwError.js";

export const register = async (request, response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(request.body.password, salt);

    const doc = new UserModel({
      email: request.body.email,
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
      passwordHash: passHash
    });

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
    throwError(response, err, 500, 'Не удалось зарегестрироваться');
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user)
      return throwError(res, '', 404, 'Неверный логин или пароль');

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass)
      return throwError(res, '', 400, 'Неверный логин или пароль');

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
    const user = await UserModel.findById(req.userId);

    if (!user)
      return throwError(res, '', 404, 'Пользователь не найден');

    const {passwordHash, ...userData} = user._doc;

    res.json(userData);
  } catch (err) {
    throwError(res, err, 500, 'Нет доступа');
  }
};
