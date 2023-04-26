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

app.post('/auth/register', valid.registerValidation, handleValidationError, control.UserController.register);
app.post('/auth/login', valid.loginValidation, handleValidationError, control.UserController.login);
app.get('/auth/me', checkAuth, control.UserController.getMe);

app.post('/upload', checkAuth, upload.single('file'), (req, res) => {
  res.json({
    url: `/src/uploads/${req.file.originalname}`,
  });
});

app.get('/courses', control.CourseController.getAll);
app.get('/courses/:id', control.CourseController.getOne);
app.post('/courses', checkAuth, valid.courseValidation, handleValidationError, control.CourseController.create);
app.delete('/courses/:id', checkAuth, control.CourseController.remove);
app.patch(
  '/courses/:id',
  checkAuth,
  valid.courseValidation,
  handleValidationError,
  control.CourseController.update
);

app.post(
  '/lessons/video',
  checkAuth,
  valid.videoLessonValidation,
  handleValidationError,
  control.VideoLessonController.create);
app.delete('/lesson/video/:id', checkAuth, control.VideoLessonController.remove);
app.patch(
  '/lesson/video/:id',
  checkAuth,
  valid.videoLessonValidation,
  handleValidationError,
  control.VideoLessonController.update
);
