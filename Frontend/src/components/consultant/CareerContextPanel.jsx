import React from 'react';

const CareerContextPanel = ({ contextData }) => {
  if (!contextData) return null;

  return (
    <div style={{
      width: '300px',
      borderLeft: '1px solid var(--border)',
      backgroundColor: 'var(--surface-light)',
      padding: '1.5rem',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Career Context</h3>
      
      {/* Target Role section */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Target Role</h4>
        {contextData.analysis?.available ? (
          <>
            <p style={{ margin: 0, fontWeight: '500' }}>{contextData.analysis.jobTitle}</p>
            {contextData.analysis.company && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>at {contextData.analysis.company}</p>}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Match:</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{contextData.analysis.matchScore}%</span>
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No target role analyzed yet.</p>
        )}
      </div>

      {/* Roadmap section */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active Roadmap</h4>
        {contextData.roadmap?.available ? (
          <>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{contextData.roadmap.durationWeeks} Weeks Plan</p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No active roadmap.</p>
        )}
      </div>

      {/* Top Gaps section */}
      {contextData.analysis?.available && contextData.analysis.missingSkills && contextData.analysis.missingSkills.length > 0 && (
        <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Top Gaps</h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
            {contextData.analysis.missingSkills.slice(0, 3).map((skill, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CareerContextPanel;
