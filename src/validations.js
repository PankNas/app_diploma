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
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('desc', 'Введите описание курса').isLength({min: 5}).isString(),
  body('imageUrl', 'Неверный url изображения').optional().isString(),
  body('language', 'Не определен язык').isString(),
  body('levelLanguage', 'Не определен уровень языка').isString(),
];

export const videoLessonValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('desc', 'Введите описание курса').optional().isString(),
  body('videoUrl', 'Неверный url изображения').isString(),
];

export const textLessonValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('desc', 'Введите описание курса').isLength({min: 5}).isString(),
];

export const sentenceLessonValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('sentence', 'Введите текст').isLength({min: 5}).isString(),
  body('translate', 'Введите перевод текста').isLength({min: 5}).isString(),
];

export const passesLessonValidation = [
  body('title', 'Введите заголовок курса').isLength({min: 3}).isString(),
  body('sentence', 'Введите предложение для урока').isLength({min: 5}).isString(),
];
