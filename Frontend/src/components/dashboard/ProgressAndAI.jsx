import React from 'react';
import { Info, Sparkles } from 'lucide-react';

const ProgressBar = ({ label, percentage }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{percentage}%</span>
    </div>
    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: 'var(--text-primary)', borderRadius: '3px' }} />
    </div>
  </div>
);

export const CareerProgress = () => {
  // Empty data as requested
  const progressData = [];

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
        <span style={{ backgroundColor: 'var(--bg)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>Coming Soon</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
        Career Progress <Info size={14} color="var(--text-tertiary)" />
      </div>
      
      <div style={{ flex: 1 }}>
        {progressData.length > 0 ? (
          progressData.map((item, i) => (
            <ProgressBar key={i} label={item.label} percentage={item.percentage} />
          ))
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            No progress data available.
          </div>
        )}
      </div>
    </div>
  );
};

import { useNavigate, useParams } from 'react-router-dom';

export const AIConsultant = () => {
  const navigate = useNavigate();
  const { userid } = useParams();

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
        <Sparkles size={16} /> AI Career Consultant
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '16px', 
          backgroundColor: '#111', 
          border: '1px solid var(--border-light)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255,255,255,0.05) inset'
        }}>
          <Sparkles size={32} color="var(--text-primary)" />
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Need help deciding what to work on?
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            Ask your AI career consultant about skills, projects, resumes, interviews, or your preparation strategy.
          </p>
          <button 
            onClick={() => navigate(`/${userid}/consultant`)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            Ask InterPrep AI →
          </button>
        </div>
      </div>
    </div>
  );
};
