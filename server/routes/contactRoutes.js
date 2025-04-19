import express from 'express';
import { submitMessage } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact', submitMessage);

export default router;