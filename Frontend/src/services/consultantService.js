import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
};

export const createConversation = async (analysisId = null, roadmapId = null) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/consultant`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ analysisId, roadmapId })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create conversation");
  }

  return data.conversation;
};

export const getConversations = async () => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/consultant`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch conversations");
  }

  return data.conversations;
};

export const getConversation = async (id) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/consultant/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch conversation");
  }

  return { conversation: data.conversation, messages: data.messages };
};

export const deleteConversation = async (id) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/consultant/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete conversation");
  }

  return true;
};

export const sendMessage = async (conversationId, message) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/consultant/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return { 
    userMessage: data.userMessage, 
    assistantMessage: data.assistantMessage 
  };
};
