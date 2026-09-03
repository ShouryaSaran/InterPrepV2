import { supabase } from '../config/supabase.js';

export const createConversation = async (userId, title, analysisId = null, roadmapId = null) => {
  // If IDs are provided, verify ownership first
  if (analysisId) {
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .single();
    if (error || !analysis) throw new Error("UNAUTHORIZED_ANALYSIS");
  }

  if (roadmapId) {
    const { data: roadmap, error } = await supabase
      .from('roadmaps')
      .select('id')
      .eq('id', roadmapId)
      .eq('user_id', userId)
      .single();
    if (error || !roadmap) throw new Error("UNAUTHORIZED_ROADMAP");
  }

  const { data, error } = await supabase
    .from('career_conversations')
    .insert([{
      user_id: userId,
      title: title || 'New Career Conversation',
      analysis_id: analysisId,
      roadmap_id: roadmapId
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw new Error("DATABASE_ERROR");
  }

  return data;
};

export const getConversations = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('career_conversations')
    .select('id, title, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("DATABASE_ERROR");
  }

  // To get the last message preview, we'd ideally do a join or subquery, 
  // but for simplicity we'll just return the conversations. 
  // In a real app we might fetch the latest message per conversation.
  return data;
};

export const getConversationById = async (userId, conversationId) => {
  const { data: conversation, error: convError } = await supabase
    .from('career_conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (convError || !conversation) {
    throw new Error("NOT_FOUND");
  }

  const { data: messages, error: msgError } = await supabase
    .from('career_messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgError) {
    console.error("Error fetching messages:", msgError);
    throw new Error("DATABASE_ERROR");
  }

  return { conversation, messages: messages || [] };
};

export const deleteConversation = async (userId, conversationId) => {
  const { error } = await supabase
    .from('career_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    console.error("Error deleting conversation:", error);
    throw new Error("DATABASE_ERROR");
  }
  
  return true;
};

export const saveMessage = async (userId, conversationId, role, content) => {
  const { data, error } = await supabase
    .from('career_messages')
    .insert([{
      conversation_id: conversationId,
      user_id: userId,
      role,
      content
    }])
    .select('id, role, content, created_at')
    .single();

  if (error) {
    console.error("Error saving message:", error);
    throw new Error("DATABASE_ERROR");
  }

  // Update conversation updated_at
  await supabase
    .from('career_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
};

export const getRecentHistory = async (conversationId, limit = 15) => {
  const { data, error } = await supabase
    .from('career_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent history:", error);
    return [];
  }

  // Reverse to get chronological order for the AI prompt
  return data.reverse();
};

export const updateConversationTitle = async (conversationId, title) => {
  await supabase
    .from('career_conversations')
    .update({ title })
    .eq('id', conversationId);
};
