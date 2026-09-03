import express from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { generateAnalysis, getAnalysis, getAnalyses } from '../Controllers/analysisController.js';

const router = express.Router();

router.use(protect);

router.post('/', generateAnalysis);
router.get('/', getAnalyses);
router.get('/:id', getAnalysis);

export default router;
