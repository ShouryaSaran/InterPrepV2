import { supabase } from '../config/supabaseClient.js';

export const createInterviewSession = async (sessionData) => {
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert([sessionData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const createInterviewQuestions = async (questionsData) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .insert(questionsData)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getInterviews = async (userId) => {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getInterviewSession = async (sessionId, userId) => {
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (sessionError) throw new Error(sessionError.message);

  const { data: questions, error: questionsError } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('session_id', sessionId)
    .order('question_order', { ascending: true });

  if (questionsError) throw new Error(questionsError.message);

  return { session, questions };
};

export const getQuestion = async (questionId, sessionId, userId) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('id', questionId)
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const submitQuestionAnswer = async (questionId, updateData) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .update(updateData)
    .eq('id', questionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateInterviewSession = async (sessionId, updateData) => {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteInterviewSession = async (sessionId, userId) => {
  const { error } = await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return true;
};
