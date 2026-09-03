import { supabase } from '../config/supabase.js';
import { analyzeResumeMatch } from './ai/geminiService.js';

export const generateAndSaveAnalysis = async (userId, resumeId, jobTitle, company, jobDescription) => {
  // 1. Verify ownership and get the parsed text of the resume
  const { data: resume, error: fetchError } = await supabase
    .from('resumes')
    .select('parsed_text')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !resume) {
    throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
  }

  if (!resume.parsed_text) {
    throw new Error("EMPTY_RESUME_TEXT");
  }

  // 2. Call Gemini API to perform the analysis
  const aiResult = await analyzeResumeMatch(resume.parsed_text, jobDescription);

  // 3. Save the structured result to the database
  const { data: analysisData, error: dbError } = await supabase
    .from('analyses')
    .insert([{
      user_id: userId,
      resume_id: resumeId,
      job_title: jobTitle,
      company: company || null,
      job_description: jobDescription,
      match_score: aiResult.matchScore,
      matched_skills: aiResult.matchedSkills,
      missing_skills: aiResult.missingSkills,
      partial_skills: aiResult.partialSkills,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      recommendations: aiResult.recommendations,
      interview_questions: aiResult.interviewQuestions
    }])
    .select()
    .single();

  if (dbError) {
    console.error("Database Insert Error (Analysis):", dbError);
    throw new Error("DATABASE_ERROR");
  }

  return analysisData;
};

export const getAnalysisById = async (userId, analysisId) => {
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      *,
      resumes (
        original_filename
      )
    `)
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error("NOT_FOUND");
  }

  return data;
};

export const getAllAnalyses = async (userId) => {
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      id,
      job_title,
      company,
      match_score,
      created_at,
      resumes (
        original_filename
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error("DATABASE_ERROR");
  }

  return data;
};
