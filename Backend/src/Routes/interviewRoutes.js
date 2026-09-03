import express from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
  createInterview,
  listInterviews,
  getInterview,
  submitAnswer,
  completeInterview,
  deleteInterview
} from '../Controllers/interviewController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createInterview);
router.get('/', listInterviews);
router.get('/:id', getInterview);
router.delete('/:id', deleteInterview);
router.post('/:sessionId/questions/:questionId/answer', submitAnswer);
router.post('/:sessionId/complete', completeInterview);

export default router;
