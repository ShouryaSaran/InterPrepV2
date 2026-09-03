import express from 'express';
import { 
  createConversationHandler, 
  getConversationsHandler, 
  getConversationHandler, 
  deleteConversationHandler, 
  sendMessageHandler 
} from '../Controllers/consultantController.js';
import { requireAuth } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// All consultant routes require authentication
router.use(requireAuth);

router.post('/', createConversationHandler);
router.get('/', getConversationsHandler);
router.get('/:id', getConversationHandler);
router.delete('/:id', deleteConversationHandler);
router.post('/:id/messages', sendMessageHandler);

export default router;
