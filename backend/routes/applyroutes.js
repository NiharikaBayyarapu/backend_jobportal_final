import express from 'express';
import upload from '../middlewares/upload.js';
import { uploadResume } from '../controllers/applyController.js';

const router = express.Router();

router.post('/upload-resume', upload.single('resume'), uploadResume);

export default router;
