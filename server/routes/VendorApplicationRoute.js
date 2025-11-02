import express from 'express';
import { apply } from '../controllers/VendorApplicationController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Allow up to 3 images (minimum 3 required)
router.post('/apply', upload.array('restaurantImages', 3), apply);

export default router;
