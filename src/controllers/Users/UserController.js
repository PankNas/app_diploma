import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../../models/Users/User.js";
import {throwError} from "../../utils/throwError.js";
import {registerMember, registerModerator, registerAdm} from "./registeration.js";
import AccessCodeModel from "../../models/Users/AccessCode.js";
import {findCodeAdm, findCodeModerator} from "./AccessCodeController.js";

export const register = async (request, response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(request.body.password, salt);

    let doc = NaN;

    if (request.body.codeAccess === '') {
      doc = await registerMember(request, passHash);
    } else if (await findCodeModerator(request.body.codeAccess)) {
      doc = await registerModerator(request, passHash);
    } else if (await findCodeAdm(request.body.codeAccess)) {
      doc = await registerAdm(request, passHash);
    } else {
      throw new Error('Не удалось зарегистрироваться');
    }

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

    // const access = await AccessCodeModel.findOne();
    //
    // switch (user.role) {
    //   case 'adm':
    //     if (user.codeAccess !== access.codeAdm.code)
    //       return throwError(res, '', 400, 'Неверные данные');
    //     break;
    //
    //   case 'moderator':
    //     const code = access.codesModerator.find(elem => elem.code === user.codeAccess);
    //
    //     if (!code)
    //       return throwError(res, '', 400, 'Неверные данные');
    //     break;
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
