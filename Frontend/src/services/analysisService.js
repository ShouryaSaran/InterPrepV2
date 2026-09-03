import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
};

export const generateAnalysis = async (resumeId, jobTitle, company, jobDescription) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/analyses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resumeId, jobTitle, company, jobDescription })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate analysis");
  }

  return data.analysis;
};

export const getAnalysis = async (id) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/analyses/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch analysis");
  }

  return data.analysis;
};

export const getAllAnalyses = async () => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/analyses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch analyses");
  }

  return data.analyses;
};
