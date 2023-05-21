import AccessCodeModel from "../../models/Users/AccessCode.js";
import {throwError} from "../../utils/throwError.js";

export const findCodeModerator = async (codeAccess) => {
  try {
    console.log(codeAccess);
    const access = await AccessCodeModel.findOne();

    return access.codesModerator.find(elem => {
      return elem.code === codeAccess && !elem?.user;
    });

  } catch (error) {
    console.error("Ошибка при поиске кода модератора: ", error);
    throw error;
  }
};

export const findCodeAdm = async (codeAccess) => {
  try {
    const access = await AccessCodeModel.findOne();

    return access.codeAdm?.code === codeAccess && !access.codeAdm.user;

  } catch (error) {
    console.error("Ошибка при поиске кода модератора: ", error);
    throw error;
  }
};

export const create = async (req, res) => {
  try {
    const doc = new AccessCodeModel({});

    await doc.save();

    res.json(doc)
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать документ для кодов доступа');
  }
}

export const addCode = async (req, res) => {
  try {
    const access = await AccessCodeModel.findOne();

    switch (req.body.type) {
      case 'adm':
        access.codeAdm = {code: req.body.code}
        break;
      case 'moderator':
        access.codesModerator.push({code: req.body.code})
        break;
    }

    await access.save();

    res.json({success: true})
  } catch (err) {
    throwError(res, err, 500, 'Не удалось добавить код доступа');
  }
}
