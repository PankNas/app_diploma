import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
  body('fullName', 'Укажите имя').isLength({min: 3}),
  body('avatar', 'Неверный url аватарки').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const courseCreateValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('description', 'Введите описание курса').isLength({min: 5}).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
  body('imageUrl', 'Неверный url изображения').optional().isString(),
];
