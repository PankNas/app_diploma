import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import {throwError} from "../utils/error.js";

export const register = async (request, response) => {
  try {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json(errors.array());
    }

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
    // if (!user) {
    //   return res.status(404).json({massage: 'Неверный логин или пароль'});
    // }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass)
      return throwError(res, '', 400, 'Неверный логин или пароль');
    // if (!isValidPass) {
    //   return res.status(400).json({message: 'Неверный логин или пароль'});
    // }

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
    // if (!user) {
    //   return res.status(404).json({message: 'Пользователь не найден'});
    // }

    const {passwordHash, ...userData} = user._doc;

    res.json(userData);
  } catch (err) {
    throwError(res, err, 500, 'Нет доступа');
  }
};
