import express from 'express';

import { isAuth, login, logout, register, getAvailableVendors, sendStudentEmailOtp, verifyStudentEmailOtp, updateProfile } from '../controllers/Studentcontroller.js';
import { getReviewsByVendor, upsertReview, deleteOwnReview } from '../controllers/ReviewController.js';
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

// Reviews
// List reviews for a vendor (visible to authenticated students)
StudentRouter.get('/reviews/:vendorEmail', authStudent, getReviewsByVendor);
// Create or update own review for a vendor
StudentRouter.post('/reviews/:vendorEmail', authStudent, upsertReview);
// Delete own review for a vendor
StudentRouter.delete('/reviews/:vendorEmail', authStudent, deleteOwnReview);

export default StudentRouter;
