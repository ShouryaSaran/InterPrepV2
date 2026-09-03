import api from './api';

export const createInterview = async (config) => {
  const response = await api.post('/interviews', config);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

export const getInterview = async (sessionId) => {
  const response = await api.get(`/interviews/${sessionId}`);
  return response.data;
};

export const submitAnswer = async (sessionId, questionId, answerData) => {
  // answerData: { answer: string } or { skip: true }
  const response = await api.post(`/interviews/${sessionId}/questions/${questionId}/answer`, answerData);
  return response.data;
};

export const completeInterview = async (sessionId) => {
  const response = await api.post(`/interviews/${sessionId}/complete`);
  return response.data;
};

export const deleteInterview = async (sessionId) => {
  const response = await api.delete(`/interviews/${sessionId}`);
  return response.data;
};
