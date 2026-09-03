import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
};

export const generateRoadmap = async (analysisId, durationWeeks, hoursPerWeek, goal) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/roadmaps`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ analysisId, durationWeeks, hoursPerWeek, goal })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate roadmap");
  }

  return data.roadmap;
};

export const getRoadmap = async (id) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/roadmaps/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch roadmap");
  }

  return data.roadmap;
};

export const getCurrentRoadmap = async () => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/roadmaps/current`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch current roadmap");
  }

  return data.roadmap;
};

export const toggleTaskCompletion = async (roadmapId, taskId, completed) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/roadmaps/${roadmapId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to update task");
  }

  return data;
};
