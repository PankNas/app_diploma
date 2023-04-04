import express from 'express';
import mongoose from 'mongoose';

import {registerValidation, loginValidation} from "./src/backend/validations.js";
import checkAuth from "./src/backend/utils/checkAuth.js";
import * as UserController from "./src/backend/controllers/UserController.js";

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
