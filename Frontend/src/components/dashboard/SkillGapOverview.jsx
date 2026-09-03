import React from 'react';
import { Info, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const SkillPill = ({ skill, type }) => {
  const colors = {
    strong: { border: '#166534', bg: 'rgba(22, 101, 52, 0.2)', text: '#4ade80', icon: <CheckCircle2 size={14} color="#4ade80" /> },
    needsImprovement: { border: '#854d0e', bg: 'rgba(133, 77, 14, 0.2)', text: '#facc15', icon: <AlertCircle size={14} color="#facc15" /> },
    missing: { border: '#991b1b', bg: 'rgba(153, 27, 27, 0.2)', text: '#f87171', icon: <XCircle size={14} color="#f87171" /> }
  };
  const style = colors[type];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 0.75rem',
      border: `1px solid ${style.border}`,
      backgroundColor: style.bg,
      borderRadius: '20px',
      fontSize: '0.75rem',
      color: style.text,
      fontWeight: 500
    }}>
      {style.icon}
      {skill}
    </div>
  );
};

const SkillGapOverview = () => {
  const { userid } = useParams();
  
  // Empty data as requested
  const skillGaps = {
    strong: [],
    needsImprovement: [],
    missing: []
  };

  const renderColumn = (title, type, skills, dotColor) => (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start' }}>
        {skills.length > 0 ? (
          skills.map(skill => <SkillPill key={skill} skill={skill} type={type} />)
        ) : (
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>-</span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
        <span style={{ backgroundColor: 'var(--bg)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>Coming Soon</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          Skill Gap Overview <Info size={14} color="var(--text-tertiary)" />
        </div>
        <Link to={`/${userid}/resume-analysis`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          View Full Analysis →
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {renderColumn('Strong Skills', 'strong', skillGaps.strong, '#22c55e')}
        {renderColumn('Needs Improvement', 'needsImprovement', skillGaps.needsImprovement, '#eab308')}
        {renderColumn('Missing', 'missing', skillGaps.missing, '#ef4444')}
      </div>
    </div>
  );
};

export default SkillGapOverview;
