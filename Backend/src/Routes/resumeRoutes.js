import express from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { handleUpload } from '../Middlewares/uploadMiddleware.js';
import { uploadResume, getCurrentResume, deleteResume } from '../Controllers/resumeController.js';

const router = express.Router();

// Apply auth protection to all resume routes
router.use(protect);

// POST /api/resumes
router.post('/', handleUpload, uploadResume);

// GET /api/resumes/current
router.get('/current', getCurrentResume);

// DELETE /api/resumes/:id
router.delete('/:id', deleteResume);

export default router;
