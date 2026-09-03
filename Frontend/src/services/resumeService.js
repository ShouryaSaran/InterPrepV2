import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the current Supabase Auth token
 */
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
};

/**
 * Uploads a resume file to the backend
 * @param {File} file 
 */
export const uploadResume = async (file) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/resumes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Do NOT set 'Content-Type' when using FormData, 
      // the browser will set it automatically with the correct boundary
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data;
};

/**
 * Fetches the current primary resume metadata
 */
export const getCurrentResume = async () => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/resumes/current`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch current resume");
  }

  return data;
};

/**
 * Deletes a specific resume by ID
 */
export const deleteResume = async (id) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/resumes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to delete resume");
  }

  return data;
};
