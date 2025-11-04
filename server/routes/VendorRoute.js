import express from 'express';


import { deleteMenu, getMenu, getMenuByEmail, isAuth, logout, saveMenu, getVendorReviews, getProfile } from '../controllers/Vendorcontroller.js';
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
console.log('  - GET /api/Vendor/profile (vendor auth)');

// Public routes
VendorRouter.post('/otp/send', sendOtp);
VendorRouter.post('/otp/verify', verifyOtp);

// Authenticated routes (protected by authVendor)
VendorRouter.get('/is-auth', authVendor, isAuth);
VendorRouter.get('/logout', authVendor, logout);

// Menu operations (protected) - MUST come before /menu/:email to avoid route conflicts
// Order matters: All specific routes (no params) must come before parameterized routes
VendorRouter.delete('/menu', (req, res, next) => {
  console.log('🛣️ DELETE /menu route matched');
  next();
}, authVendor, deleteMenu); // Delete menu - specific route
VendorRouter.post('/menu', authVendor, saveMenu);    // Create or update - specific route
VendorRouter.get('/menu', authVendor, getMenu);      // Get logged-in vendor's menu - specific route

// Public menu route with email parameter (for students) - must come after all /menu routes
VendorRouter.get('/menu/:email', authStudent, getMenuByEmail);

// Vendor reviews (protected)
VendorRouter.get('/reviews', authVendor, getVendorReviews);

// Vendor profile (protected)
VendorRouter.get('/profile', authVendor, getProfile);


export default VendorRouter;
