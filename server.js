import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {registerValidation, loginValidation, courseCreateValidation} from "./src/validations.js";
import {checkAuth, handleValidationError} from "./src/utils/index.js";
import {UserController, CourseController} from './src/controllers/index.js';

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'src/backend/uploads');
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
app.use('/uploads', express.static('src/backend/uploads'));
app.use(cors());

app.post('/auth/register', registerValidation, handleValidationError, UserController.register);
app.post('/auth/login', loginValidation, handleValidationError, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/src/backend/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', CourseController.getLastTags);

app.get('/courses', CourseController.getAll);
app.get('/courses/:id', CourseController.getOne);
app.post('/courses', checkAuth, courseCreateValidation, handleValidationError, CourseController.create);
app.delete('/courses/:id', checkAuth, CourseController.remove);
app.patch(
  '/courses/:id',
  checkAuth,
  courseCreateValidation,
  handleValidationError,
  CourseController.update
);
