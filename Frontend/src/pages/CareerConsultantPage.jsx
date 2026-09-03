import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import ConversationSidebar from '../components/consultant/ConversationSidebar';
import ChatArea from '../components/consultant/ChatArea';
import CareerContextPanel from '../components/consultant/CareerContextPanel';
import { 
  getConversations, 
  createConversation, 
  getConversation, 
  deleteConversation, 
  sendMessage 
} from '../services/consultantService';
import { supabase } from '../lib/supabase';

const CareerConsultantPage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [contextData, setContextData] = useState(null);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [userid]);

  // Load active conversation messages when it changes
  useEffect(() => {
    if (activeConversationId) {
      fetchConversationDetails(activeConversationId);
    } else {
      setMessages([]);
      setContextData(null);
    }
  }, [activeConversationId]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const fetchConversationDetails = async (id) => {
    try {
      const data = await getConversation(id);
      setMessages(data.messages || []);
      // Ideally backend returns contextData used for this conversation if we wanted to show it
      // But for now, we'll fetch latest context manually or just rely on backend API that doesn't expose it yet.
      // Wait, we didn't add an endpoint to fetch context to frontend.
      // We can just show a simplified version or add it later.
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await createConversation();
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(id);
        setConversations(conversations.filter(c => c.id !== id));
        if (activeConversationId === id) {
          setActiveConversationId(null);
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
  };

  const handleSendMessage = async (text) => {
    setIsSending(true);
    let convId = activeConversationId;
    
    try {
      // If no active conversation, create one first
      if (!convId) {
        const newConv = await createConversation();
        setConversations([newConv, ...conversations]);
        setActiveConversationId(newConv.id);
        convId = newConv.id;
      }

      // Add optimistic user message
      const optimisticMsg = { role: 'user', content: text, id: Date.now().toString() };
      setMessages(prev => [...prev, optimisticMsg]);

      // Send to API
      const result = await sendMessage(convId, text);
      
      // Update with real messages
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== optimisticMsg.id);
        return [...filtered, result.userMessage, result.assistantMessage];
      });
      
      // Refresh conversations list to update title and updated_at
      fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to get a response. Please try again.");
      // Remove optimistic message if it failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Global Dashboard Sidebar */}
      <Sidebar userid={userid} onLogout={handleLogout} />

      {/* Consultant Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ConversationSidebar 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        
        <ChatArea 
          messages={messages}
          isSending={isSending}
          onSendMessage={handleSendMessage}
        />
        
        {/* Optional context panel - passing null for now since we didn't build the endpoint to fetch it */}
        <CareerContextPanel contextData={contextData} />
      </div>
    </div>
  );
};

export default CareerConsultantPage;
