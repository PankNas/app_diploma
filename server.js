import express from 'express';
import mongoose from 'mongoose';

import {registerValidation, loginValidation, courseCreateValidation} from "./src/backend/validations.js";
import checkAuth from "./src/backend/utils/checkAuth.js";

import * as UserController from "./src/backend/controllers/UserController.js";
import * as CourseController from "./src/backend/controllers/CourseController.js";

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/app_diploma')
  .then(() => {
    console.log('Connect to MongoDB');

    app.listen(8000, (err) => {
      (err) ? console.log(err) : console.log('Server OK');
    });
  })
  .catch(err => console.log(`DB connection error: ${err}`));

app.use(express.json());

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/courses', CourseController.getAll);
app.get('/courses/:id', CourseController.getOne);
app.post('/courses', checkAuth, courseCreateValidation, CourseController.create);
// app.delete('/courses', checkAuth, CourseController.remove);
// app.patch('/courses', checkAuth, CourseController.update);
