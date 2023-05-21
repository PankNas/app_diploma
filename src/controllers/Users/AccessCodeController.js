import AccessCodeModel from "../../models/Users/AccessCode.js";
import {throwError} from "../../utils/throwError.js";

export const findCodeModerator = async (codeAccess) => {
  try {
    const result = AccessCodeModel.findOne({
      codesModerator: { $elemMatch: { code: { $eq: codeAccess } } }
    }, { 'codesModerator.$': 1 }); // $ - означает, что мы хотим получить только первый совпадающий элемент

    if (result && result.codesModerator && result.codesModerator.length > 0) {
      const moderatorCode = result.codesModerator[0];
      console.log("Код модератора: ", moderatorCode);
      return moderatorCode;
    } else {
      console.log("Код модератора не найден");
      return false;
    }
  } catch (error) {
    console.error("Ошибка при поиске кода модератора: ", error);
    throw error;
  }
};

export const findCodeAdm = async (codeAccess) => {
  try {
    const access = AccessCodeModel.findOne();

    return access.codeAdm?.code === codeAccess;

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
