import express from 'express';


import { deleteMenu, getMenu, getMenuByEmail, isAuth, logout, saveMenu, getVendorReviews } from '../controllers/Vendorcontroller.js';
import { sendOtp, verifyOtp } from '../controllers/VendorOtpController.js';
import authStudent from '../middlewares/authStudent.js';
import authVendor from '../middlewares/authVendor.js';

const VendorRouter = express.Router();

// Log route registration
console.log('✅ Vendor routes registered:');
console.log('  - POST /api/Vendor/otp/send');
console.log('  - POST /api/Vendor/otp/verify');
console.log('  - GET /api/Vendor/menu/:email (student auth)');
console.log('  - GET /api/Vendor/is-auth (vendor auth)');
console.log('  - GET /api/Vendor/logout (vendor auth)');
console.log('  - POST /api/Vendor/menu (vendor auth)');
console.log('  - GET /api/Vendor/menu (vendor auth)');
console.log('  - DELETE /api/Vendor/menu (vendor auth)');
console.log('  - GET /api/Vendor/reviews (vendor auth)');

// Public routes
VendorRouter.post('/otp/send', sendOtp);
VendorRouter.post('/otp/verify', verifyOtp);

// Authenticated routes (protected by authVendor)
VendorRouter.get('/is-auth', authVendor, isAuth);
VendorRouter.get('/logout', authVendor, logout);

// Menu operations (protected) - MUST come before /menu/:email to avoid route conflicts
VendorRouter.post('/menu', authVendor, saveMenu);    // Create or update
VendorRouter.get('/menu', authVendor, getMenu);      // Get logged-in vendor's menu (specific route first!)
VendorRouter.delete('/menu', authVendor, deleteMenu); // Delete menu of logged-in vendor

// Public menu route with email parameter (for students) - must come after /menu
VendorRouter.get('/menu/:email', authStudent, getMenuByEmail);

// Vendor reviews (protected)
VendorRouter.get('/reviews', authVendor, getVendorReviews);


export default VendorRouter;
