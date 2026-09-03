import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach. Your job is to analyze a candidate's resume against a target job description.
You MUST output your response strictly as a JSON object, with no markdown formatting around it (do not use \`\`\`json).

Follow this exact JSON schema:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "partialSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["rec1", "rec2"],
  "interviewQuestions": [
    { "question": "...", "reason": "..." }
  ]
}

Instructions for evaluation:
- matchScore: Be brutally honest. Only award >80% if they are a near-perfect fit.
- matchedSkills: Skills they have that are explicitly required.
- missingSkills: Crucial skills missing from the resume.
- partialSkills: Skills they have some exposure to, but not at the required depth.
- recommendations: Actionable steps to improve their fit.
- interviewQuestions: Questions the recruiter is likely to ask based on their gaps or resume highlights.`;

export const analyzeResumeMatch = async (resumeText, jobDescription) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });

  const prompt = `Please analyze the following resume against the job description.

--- RESUME TEXT ---
${resumeText}

--- JOB DESCRIPTION ---
${jobDescription}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Strip markdown JSON blocks if the model accidentally included them
    if (text.startsWith('```json')) {
      text = text.substring(7);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    }
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("FAILED_AI_ANALYSIS");
  }
};

export const generateCareerConsultantResponse = async (systemInstruction, userMessage, history) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  // Use the standard text model, but configured with the system instruction
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction 
  });

  // Convert our DB history format to Gemini's history format
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  try {
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage([{ text: userMessage }]);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Consultant Error:", error);
    throw new Error("FAILED_AI_CONSULTATION");
  }
};

const callGeminiJson = async (promptText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(promptText);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) {
      text = text.substring(7);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    }
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini JSON Generation Error:", error);
    throw new Error("FAILED_AI_JSON_GENERATION");
  }
};

export const generateInterviewQuestions = async (systemPrompt) => {
  return callGeminiJson(systemPrompt);
};

export const evaluateInterviewAnswer = async (systemPrompt) => {
  return callGeminiJson(systemPrompt);
};

export const generateInterviewSummary = async (systemPrompt) => {
  return callGeminiJson(systemPrompt);
};
