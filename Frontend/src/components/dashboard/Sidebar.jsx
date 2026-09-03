import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Map, 
  Sparkles, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Overview', path: '' },
  { icon: FileText, label: 'Resume Analysis', path: '/resume-analysis' },
  { icon: Map, label: 'Career Roadmap', path: '/career-roadmap' },
  { icon: Sparkles, label: 'AI Career Consultant', path: '/consultant' },
  { icon: Target, label: 'Interview Prep', path: '/interview' },
  { icon: Bookmark, label: 'Saved Jobs', path: '/saved-jobs' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const Sidebar = ({ userid, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    // Exact match for overview, prefix match for others
    if (path === '') {
      return location.pathname === `/${userid}`;
    }
    return location.pathname.startsWith(`/${userid}${path}`);
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0a0a0a',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '1.5rem',
      color: 'var(--text-secondary)'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2.5rem', paddingLeft: '0.75rem' }}>
        <Link to={`/${userid}`} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          InterPrep
        </Link>
      </div>

      {/* Main Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.label}
              to={`/${userid}${item.path}`} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: active ? 'var(--border)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: active ? 500 : 400,
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
        <Link 
          to={`/${userid}/settings`} 
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', 
            borderRadius: '8px', transition: 'all 0.2s', textDecoration: 'none', color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Settings size={18} />
          Settings
        </Link>
        <button 
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', 
            borderRadius: '8px', transition: 'all 0.2s', color: 'var(--text-secondary)', width: '100%', textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Premium Upgrade Card */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#111111',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
          <Sparkles size={16} />
          Unlock Premium
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
          Get advanced insights, more analyses and AI guidance.
        </p>
        <button style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--border-light)',
          borderRadius: '6px',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Upgrade Now <span style={{ fontSize: '1rem' }}>→</span>
        </button>
      </div>

      {/* Collapse button (decorative based on design) */}
      <div style={{ position: 'absolute', right: '-12px', bottom: '2rem', backgroundColor: 'var(--border)', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
        <ChevronLeft size={16} color="var(--text-secondary)" />
      </div>
    </aside>
  );
};

export default Sidebar;
