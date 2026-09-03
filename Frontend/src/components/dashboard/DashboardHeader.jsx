import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const DashboardHeader = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const name = user?.user_metadata?.full_name || 'there';
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  const getInitials = (fullName) => {
    if (!fullName || fullName === 'there') return 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0][0].toUpperCase();
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {getGreeting()}, {name} <span style={{ fontSize: '1.5rem' }}>👋</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Here's where you stand in your career preparation.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ color: 'var(--text-secondary)', position: 'relative' }}>
          <Bell size={20} />
          {/* Unread dot indicator */}
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '6px',
            height: '6px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: 'var(--border)', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 500
            }}>
              {getInitials(name)}
            </div>
          )}
          <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
            {name.split(' ')[0]}
          </span>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
