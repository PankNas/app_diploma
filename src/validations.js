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

export const courseValidation = [
  body('title', 'Введите заголовок курса').optional().isLength({min: 3}).isString(),
  body('desc', 'Введите описание курса').optional().isLength({min: 5}).isString(),
  body('imageUrl', 'Неверный url изображения').optional().optional().isString(),
  body('language', 'Не определен язык').optional().isString(),
  body('levelLanguage', 'Не определен уровень языка').optional().isString(),
];

export const videoLessonValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('desc', 'Введите описание курса').optional().isLength({min: 5}).isString(),
  body('videoUrl', 'Неверный url изображения').isString(),
];
