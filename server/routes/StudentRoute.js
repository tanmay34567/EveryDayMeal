import express from 'express';

import { isAuth, login, logout, register } from '../controllers/Studentcontroller.js';
import authStudent from '../middlewares/authStudent.js';

const StudentRouter = express.Router();

StudentRouter.post('/register', register);
StudentRouter.post('/login', login);
StudentRouter.get('/is-auth', authStudent, isAuth);
StudentRouter.get('/logout', authStudent, logout);

export default StudentRouter;
