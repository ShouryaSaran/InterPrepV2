import React from 'react';

const ConversationSidebar = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation 
}) => {
  return (
    <div style={{
      width: '300px',
      borderRight: '1px solid var(--border)',
      backgroundColor: 'var(--surface-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={onNewConversation}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + New Conversation
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {conversations.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
            No recent conversations
          </p>
        ) : (
          conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                backgroundColor: activeConversationId === conv.id ? 'var(--surface)' : 'transparent',
                border: activeConversationId === conv.id ? '1px solid var(--border)' : '1px solid transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {conv.title || 'Conversation'}
                </h4>
                <small style={{ color: 'var(--text-secondary)' }}>
                  {new Date(conv.updated_at).toLocaleDateString()}
                </small>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                title="Delete Conversation"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
