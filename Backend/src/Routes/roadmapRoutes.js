import express from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { createRoadmap, getRoadmap, getCurrent, updateTask } from '../Controllers/roadmapController.js';

const router = express.Router();

router.use(protect);

router.post('/', createRoadmap);
router.get('/current', getCurrent); // Must be before /:id
router.get('/:id', getRoadmap);
router.patch('/:roadmapId/tasks/:taskId', updateTask);

export default router;
