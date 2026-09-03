import { 
  createInterviewSession,
  createInterviewQuestions,
  getInterviews,
  getInterviewSession,
  getQuestion,
  submitQuestionAnswer,
  updateInterviewSession,
  deleteInterviewSession
} from '../services/interviewService.js';
import { getAnalysisById } from '../services/analysisService.js';
import { getResumeById } from '../services/resumeService.js';
import { 
  generateInterviewQuestions, 
  evaluateInterviewAnswer, 
  generateInterviewSummary 
} from '../services/ai/geminiService.js';
import { 
  generateQuestionsPrompt, 
  evaluateAnswerPrompt, 
  generateSummaryPrompt 
} from '../prompts/interviewPrompts.js';

export const createInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { analysisId, type, questionCount, difficulty, focusArea } = req.body;

    if (!analysisId) return res.status(400).json({ success: false, error: 'Analysis ID is required' });
    
    // 1. Get analysis and verify ownership
    const analysis = await getAnalysisById(analysisId);
    if (!analysis) return res.status(404).json({ success: false, error: 'Analysis not found' });
    if (analysis.user_id !== userId) return res.status(403).json({ success: false, error: 'Unauthorized' });

    // 2. Get primary resume for context
    let resumeContent = null;
    if (analysis.resume_id) {
      const resume = await getResumeById(analysis.resume_id);
      if (resume) resumeContent = resume.parsed_text;
    }

    // 3. Build context and config
    const context = {
      analysis: analysis.analysis_data,
      resume: { content: resumeContent }
    };
    const config = { type, questionCount: parseInt(questionCount) || 5, difficulty, focusArea };

    // 4. Call Gemini to generate questions
    const prompt = generateQuestionsPrompt(context, config);
    let aiResponse;
    try {
      aiResponse = await generateInterviewQuestions(prompt);
    } catch (error) {
      console.error("Failed to generate questions first try:", error);
      // Try one more time
      aiResponse = await generateInterviewQuestions(prompt);
    }

    if (!aiResponse || !aiResponse.questions || !Array.isArray(aiResponse.questions)) {
      throw new Error("Invalid response format from Gemini");
    }

    // Ensure we got the requested number of questions (or close to it)
    const questions = aiResponse.questions.slice(0, config.questionCount);

    // 5. Save session
    const sessionData = {
      user_id: userId,
      analysis_id: analysisId,
      title: aiResponse.title || `Mock Interview - ${config.type}`,
      interview_type: config.type,
      difficulty: config.difficulty,
      focus_area: config.focusArea,
      total_questions: questions.length,
      status: 'in_progress'
    };

    const session = await createInterviewSession(sessionData);

    // 6. Save questions
    const questionsData = questions.map((q, index) => ({
      session_id: session.id,
      user_id: userId,
      question_order: index + 1,
      question_type: q.type,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      reason: q.reason,
      expected_points: q.expectedPoints,
    }));

    await createInterviewQuestions(questionsData);

    res.status(201).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ success: false, error: 'Failed to create interview session' });
  }
};

export const listInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await getInterviews(userId);
    res.status(200).json({ success: true, interviews });
  } catch (error) {
    console.error('List interviews error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve interviews' });
  }
};

export const getInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { session, questions } = await getInterviewSession(id, userId);
    
    // Hide expected points if not answered
    const sanitizedQuestions = questions.map(q => {
      if (q.user_answer === null) {
        const { expected_points, ...rest } = q;
        return rest;
      }
      return q;
    });

    res.status(200).json({ success: true, session, questions: sanitizedQuestions });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve interview session' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, questionId } = req.params;
    let { answer, skip } = req.body;

    if (!skip && (!answer || typeof answer !== 'string' || answer.trim() === '')) {
      return res.status(400).json({ success: false, error: 'Answer is required' });
    }

    if (answer && answer.length > 8000) {
       return res.status(400).json({ success: false, error: 'Answer exceeds maximum length' });
    }

    // 1. Get session and question to verify ownership
    const { session, questions } = await getInterviewSession(sessionId, userId);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    if (session.status === 'completed') return res.status(400).json({ success: false, error: 'Session is already completed' });
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

    let updateData = { answered_at: new Date() };

    if (skip) {
      updateData.user_answer = '[SKIPPED]';
      updateData.answer_score = null;
    } else {
      updateData.user_answer = answer;

      // 2. Evaluate answer with Gemini
      const analysis = await getAnalysisById(session.analysis_id);
      const context = { analysis: analysis?.analysis_data };
      const prompt = evaluateAnswerPrompt(question, context);
      
      const evaluation = await evaluateInterviewAnswer(prompt);
      
      updateData.answer_score = evaluation.score;
      updateData.feedback = {
        rating: evaluation.rating,
        summary: evaluation.summary,
        whatYouDidWell: evaluation.whatYouDidWell,
        missingPoints: evaluation.missingPoints,
        improvedAnswer: evaluation.improvedAnswer,
        followUpQuestion: evaluation.followUpQuestion
      };
    }

    // 3. Save evaluation
    const updatedQuestion = await submitQuestionAnswer(questionId, updateData);

    // 4. Update session progress
    const answeredCount = questions.filter(q => q.user_answer !== null || q.id === questionId).length;
    await updateInterviewSession(sessionId, { answered_questions: answeredCount });

    res.status(200).json({ success: true, question: updatedQuestion });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // 1. Get session and all questions
    const { session, questions } = await getInterviewSession(sessionId, userId);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    // 2. Calculate overall score (average of answered non-skipped questions)
    const scoredQuestions = questions.filter(q => q.answer_score !== null);
    let overallScore = null;
    if (scoredQuestions.length > 0) {
      const totalScore = scoredQuestions.reduce((sum, q) => sum + q.answer_score, 0);
      overallScore = Math.round(totalScore / scoredQuestions.length);
    }

    // 3. Get analysis for context
    const analysis = await getAnalysisById(session.analysis_id);

    // 4. Generate final summary with Gemini
    const prompt = generateSummaryPrompt(
      { analysis: analysis?.analysis_data, overall_score: overallScore }, 
      scoredQuestions
    );
    const summary = await generateInterviewSummary(prompt);

    // 5. Update session
    const updatedSession = await updateInterviewSession(sessionId, {
      status: 'completed',
      completed_at: new Date(),
      overall_score: overallScore,
      // Store summary in a new JSONB column or just shoehorn it if missing. Wait, DB schema.
      // I'll assume we can store it in a `feedback` column on session, or just add it to `updatedSession`.
      // The prompt asks for an `overall_score`. We didn't define a `feedback` column for session in the schema prompt, but it makes sense.
      // I'll add `feedback` to the session table in the SQL script. Let's send it in update:
      feedback: summary
    });

    res.status(200).json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ success: false, error: 'Failed to complete interview' });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await deleteInterviewSession(id, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete interview session' });
  }
};
