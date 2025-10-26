import express from 'express';

import { isAuth, login, logout, register, getAvailableVendors, sendStudentEmailOtp, verifyStudentEmailOtp, updateProfile } from '../controllers/Studentcontroller.js';
import authStudent from '../middlewares/authStudent.js';

const StudentRouter = express.Router();

StudentRouter.post('/register', register);
StudentRouter.post('/login', login);
StudentRouter.post('/otp/send', sendStudentEmailOtp);
StudentRouter.post('/otp/verify', verifyStudentEmailOtp);
StudentRouter.get('/is-auth', authStudent, isAuth);
StudentRouter.get('/logout', authStudent, logout);

// Profile update
StudentRouter.put('/profile', authStudent, updateProfile);

// Get all vendors with available menus
StudentRouter.get('/vendors', authStudent, getAvailableVendors);

export default StudentRouter;
