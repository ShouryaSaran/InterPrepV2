import React from 'react';
import { Info, Box, Workflow, Database } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const NextSteps = () => {
  const { userid } = useParams();

  // Empty data as requested
  const recommendations = [];

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ef4444'; // Red
      case 'medium': return '#eab308'; // Yellow
      case 'low': return '#22c55e'; // Green
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
        Recommended Next Steps <Info size={14} color="var(--text-tertiary)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: index < recommendations.length - 1 ? '1px solid var(--border-light)' : 'none', paddingBottom: index < recommendations.length - 1 ? '1rem' : '0' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                {rec.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{rec.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{rec.description}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: getPriorityColor(rec.priority) }}>{rec.priority}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{rec.time}</div>
                </div>
                <button style={{
                  padding: '0.375rem 1rem',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                >
                  Start
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            No recommendations available yet.
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to={`/${userid}/career-roadmap`} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          View all recommendations →
        </Link>
      </div>
    </div>
  );
};

export default NextSteps;
