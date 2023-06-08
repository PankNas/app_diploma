import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import * as valid from "./src/validations.js";
import {checkAuth, handleValidationError} from "./src/utils/index.js";
import * as control from './src/controllers/index.js';

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'src/uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

mongoose.connect('mongodb://0.0.0.0:27017/app_diploma')
  .then(() => {
    console.log('Connect to MongoDB');

    app.listen(8000, (err) => {
      (err) ? console.log(err) : console.log('Server OK');
    });
  })
  .catch(err => console.log(`DB connection error: ${err}`));

app.use(express.json());
app.use('/uploads', express.static('src/uploads'));
app.use(cors());

// user
app.get('/users', checkAuth, control.UserController.getAll);
app.delete('/users/:id', checkAuth, control.UserController.remove);
app.patch(
  '/users/:id',
  checkAuth,
  // valid.courseValidation,
  handleValidationError,
  control.UserController.update
);
app.post('/auth/register', valid.registerValidation, handleValidationError, control.UserController.register);
app.post('/auth/login', valid.loginValidation, handleValidationError, control.UserController.login);
app.get('/auth/me', checkAuth, control.UserController.getMe);
app.patch(
  '/auth/me',
  checkAuth,
  valid.registerValidation,
  handleValidationError,
  control.UserController.updateMe
);

// moderator
app.post('/moderate', checkAuth, handleValidationError, control.ModeratorController.add);
app.delete('/moderate/:id', checkAuth, handleValidationError, control.ModeratorController.remove);

// comments
app.post('/comments', checkAuth, handleValidationError, control.CommentController.create);
app.delete('/comments/:id', checkAuth, handleValidationError, control.CommentController.remove);
app.patch(
  '/comments/:id',
  checkAuth,
  handleValidationError,
  control.CommentController.update
);

// file
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    url: `/src/uploads/${req.file.originalname}`,
  });
});

// courses
app.get('/courses', control.CourseController.getAll);
app.get('/courses/:id', checkAuth, control.CourseController.getOne);
app.post('/courses', checkAuth, handleValidationError, control.CourseController.create);
app.delete('/courses/:id', checkAuth, control.CourseController.remove);
app.patch(
  '/courses/:id',
  checkAuth,
  valid.courseValidation,
  handleValidationError,
  control.CourseController.update
);

app.patch('/score/:id', checkAuth, control.CourseController.setScore);

app.patch('/remarks/course/:id', checkAuth, handleValidationError, control.CourseController.addRemarkCourse);
app.delete('/remarks/course/:id', checkAuth, handleValidationError, control.CourseController.removeRemarkCourse);
app.patch(
  '/remarks/course/:id/lesson/:lessonId',
  checkAuth,
  // valid.courseValidation,
  handleValidationError,
  control.CourseController.addRemarkLesson,
);
app.delete('/remarks/course/:id/lesson/:lessonId', checkAuth, handleValidationError, control.CourseController.removeRemarkLesson);

app.post('/courses/subscript', checkAuth, handleValidationError, control.CourseController.subscript);
app.post('/courses/progress', checkAuth, handleValidationError, control.CourseController.progress);
app.delete('/courses/subscript/:id', checkAuth, handleValidationError, control.CourseController.unsubscribe);


// modules
app.post(
  '/modules',
  checkAuth,
  handleValidationError,
  control.ModuleLessonController.create
);
app.delete('/modules/:id', checkAuth, control.ModuleLessonController.remove);
app.patch(
  '/modules/:id',
  checkAuth,
  handleValidationError,
  control.ModuleLessonController.update
);

// lessons
app.get('/lessons/:id', checkAuth, control.LessonController.getOne);
app.delete('/lessons/:id', checkAuth, control.LessonController.remove);

app.post(
  '/lessons/video',
  checkAuth,
  valid.videoLessonValidation,
  handleValidationError,
  control.VideoLessonController.create
);
app.patch(
  '/lessons/video/:id',
  checkAuth,
  valid.videoLessonValidation,
  handleValidationError,
  control.VideoLessonController.update
);

app.post(
  '/lessons/text',
  checkAuth,
  valid.textLessonValidation,
  handleValidationError,
  control.TextLessonController.create);
app.patch(
  '/lessons/text/:id',
  checkAuth,
  valid.textLessonValidation,
  handleValidationError,
  control.TextLessonController.update
);

app.post(
  '/lessons/sentence',
  checkAuth,
  valid.sentenceLessonValidation,
  handleValidationError,
  control.SentenceLessonController.create);
app.patch(
  '/lessons/sentence/:id',
  checkAuth,
  valid.sentenceLessonValidation,
  handleValidationError,
  control.SentenceLessonController.update
);

app.post(
  '/lessons/passes',
  checkAuth,
  valid.passesLessonValidation,
  handleValidationError,
  control.PassesLessonController.create);
app.patch(
  '/lessons/passes/:id',
  checkAuth,
  valid.passesLessonValidation,
  handleValidationError,
  control.PassesLessonController.update
);

app.post(
  '/lessons/test',
  checkAuth,
  // valid.passesLessonValidation,
  handleValidationError,
  control.TestLessonController.create);
app.patch(
  '/lessons/test/:id',
  checkAuth,
  // valid.passesLessonValidation,
  handleValidationError,
  control.TestLessonController.update
);

app.post(
  '/lessons/translate',
  checkAuth,
  // valid.passesLessonValidation,
  handleValidationError,
  control.TranslateLessonController.create);
app.patch(
  '/lessons/translate/:id',
  checkAuth,
  // valid.passesLessonValidation,
  handleValidationError,
  control.TranslateLessonController.update
);
