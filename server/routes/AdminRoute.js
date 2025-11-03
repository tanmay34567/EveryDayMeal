import express from 'express';
import { 
  getAllApplications, 
  getApplicationById, 
  approveApplication, 
  rejectApplication,
  getDashboardStats 
} from '../controllers/AdminController.js';
import authAdmin from '../middlewares/authAdmin.js';

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Vendor application management
router.get('/applications', getAllApplications); // Get all applications (with optional status filter)
router.get('/applications/:applicationId', getApplicationById); // Get single application
router.post('/applications/:applicationId/approve', approveApplication); // Approve application
router.post('/applications/:applicationId/reject', rejectApplication); // Reject application

export default router;
