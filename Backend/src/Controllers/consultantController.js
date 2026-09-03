import { 
  createConversation, 
  getConversations, 
  getConversationById, 
  deleteConversation, 
  saveMessage, 
  getRecentHistory,
  updateConversationTitle
} from '../services/consultantService.js';
import { buildCareerContext } from '../services/careerContextService.js';
import { generateCareerConsultantResponse } from '../services/ai/geminiService.js';
import { buildConsultantSystemPrompt } from '../prompts/careerConsultantPrompt.js';

export const createConversationHandler = async (req, res) => {
  try {
    const { analysisId, roadmapId } = req.body;
    const userId = req.user.id;

    const conversation = await createConversation(userId, 'New Career Conversation', analysisId, roadmapId);
    
    res.status(201).json({ success: true, conversation });
  } catch (error) {
    console.error("Create Conversation Error:", error);
    if (error.message === 'UNAUTHORIZED_ANALYSIS' || error.message === 'UNAUTHORIZED_ROADMAP') {
      return res.status(403).json({ success: false, message: "Unauthorized reference" });
    }
    res.status(500).json({ success: false, message: "Failed to create conversation" });
  }
};

export const getConversationsHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await getConversations(userId);
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
};

export const getConversationHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const data = await getConversationById(userId, id);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    res.status(500).json({ success: false, message: "Failed to fetch conversation" });
  }
};

export const deleteConversationHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await deleteConversation(userId, id);
    res.status(200).json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete conversation" });
  }
};

export const sendMessageHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: conversationId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Invalid message" });
    }

    if (message.length > 4000) {
      return res.status(400).json({ success: false, message: "Message exceeds 4000 characters" });
    }

    // 1. Verify ownership by fetching conversation
    const { conversation, messages } = await getConversationById(userId, conversationId);
    
    // 2. Save user message
    const savedUserMessage = await saveMessage(userId, conversationId, 'user', message.trim());

    // 3. Optional: update title if it's the first user message
    if (messages.length === 0) {
      const newTitle = message.substring(0, 40) + (message.length > 40 ? '...' : '');
      await updateConversationTitle(conversationId, newTitle);
    }

    // 4. Build context
    const context = await buildCareerContext(userId, {
      analysisId: conversation.analysis_id,
      roadmapId: conversation.roadmap_id
    });

    // 5. Build prompt
    const systemPrompt = buildConsultantSystemPrompt(context);

    // 6. Get history (including the one we just saved, so we must fetch recent history or just append it)
    // Actually, getRecentHistory pulls from DB, which includes the savedUserMessage. We want the history *before* the current message, 
    // plus we pass the current message separately to the gemini call.
    // So we fetch history BEFORE saving user message, OR we fetch history and pass the latest as the user message.
    
    // Let's fetch history excluding the message we just saved to pass as `history` parameter
    const rawHistory = await getRecentHistory(conversationId, 15);
    // Remove the last one (which is the user message we just saved) from history
    const historyForAI = rawHistory.slice(0, rawHistory.length - 1);

    // 7. Call Gemini
    const aiResponseText = await generateCareerConsultantResponse(systemPrompt, savedUserMessage.content, historyForAI);

    // 8. Save AI response
    const savedAssistantMessage = await saveMessage(userId, conversationId, 'assistant', aiResponseText);

    res.status(200).json({ 
      success: true, 
      userMessage: savedUserMessage,
      assistantMessage: savedAssistantMessage
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    res.status(500).json({ success: false, message: "Failed to process message" });
  }
};
