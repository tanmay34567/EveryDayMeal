import express from 'express';
import { apply } from '../controllers/VendorApplicationController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/apply', upload.array('restaurantImages', 3), apply);

export default router;
