import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Ensure this exists or use standard text rendering

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        maxWidth: isUser ? '70%' : '85%',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: isUser ? 'var(--primary)' : 'var(--surface)',
        color: isUser ? 'white' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--border)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        lineHeight: '1.6'
      }}>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        ) : (
          <div className="markdown-body" style={{ color: 'inherit' }}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const ConsultantEmptyState = ({ onPromptSelect }) => {
  const suggestedPrompts = [
    "What's the biggest gap in my profile?",
    "What should I focus on this week?",
    "Am I ready for my target role?",
    "Help me improve my resume.",
    "Give me interview topics to revise."
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '2rem'
    }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>What would you like help with?</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        maxWidth: '600px'
      }}>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptSelect(prompt)}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-light)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'var(--bg)',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '0.5rem',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask InterPrep about your career preparation..."
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: '0.5rem',
            color: 'var(--text-primary)',
            resize: 'none',
            outline: 'none',
            minHeight: '44px',
            maxHeight: '150px',
            fontFamily: 'inherit'
          }}
          rows={1}
          maxLength={4000}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: text.trim() && !disabled ? 'var(--primary)' : 'var(--surface-light)',
            color: text.trim() && !disabled ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: text.trim() && !disabled ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            marginBottom: '4px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const ChatArea = ({ messages, isSending, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg)'
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--surface-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>AI Career Consultant</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Personalized guidance based on your resume, target roles and preparation progress.
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {messages.length === 0 ? (
          <ConsultantEmptyState onPromptSelect={onSendMessage} />
        ) : (
          <div>
            {messages.map((msg, idx) => (
              <ChatMessage key={msg.id || idx} message={msg} />
            ))}
            {isSending && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}>
                  InterPrep is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSendMessage={onSendMessage} disabled={isSending} />
    </div>
  );
};

export default ChatArea;
