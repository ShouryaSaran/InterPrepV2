import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Target, Info, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { getCurrentRoadmap } from '../../services/roadmapService';

// A simple circular progress SVG component
const CircularProgress = ({ percentage = 0 }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="40" cy="40" r={radius}
          stroke="var(--border-light)" strokeWidth="6" fill="transparent"
        />
        <circle
          cx="40" cy="40" r={radius}
          stroke="var(--text-primary)" strokeWidth="6" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {percentage}%
      </span>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, tooltip }) => (
  <div style={{
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{title}</span>
      {tooltip && <Info size={14} />}
    </div>
    <div style={{ flex: 1 }}>
      {icon ? icon : (
        <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>
          {value || '-'}
        </div>
      )}
    </div>
    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: 'auto' }}>
      {subtitle}
    </div>
  </div>
);

const CurrentRoadmapCard = ({ roadmap, userid }) => {
  if (!roadmap) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px',
        padding: '1.5rem', marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        <Target size={24} color="var(--text-tertiary)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No Active Roadmap</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Create your preparation roadmap from a role analysis.</p>
      </div>
    );
  }

  const progress = roadmap.total_tasks > 0 ? (roadmap.completed_tasks / roadmap.total_tasks) * 100 : 0;

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px',
      padding: '1.5rem', marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          <Activity size={18} /> Current Roadmap
        </div>
        <Link to={`/${userid}/roadmap/${roadmap.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          Continue <ChevronRight size={16} />
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {roadmap.title}
        </h4>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {roadmap.duration_weeks} Weeks • {roadmap.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Progress</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: progress === 100 ? '#4ade80' : 'var(--text-primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  );
};

const StatsGrid = () => {
  const { userid } = useParams();
  const [currentRoadmap, setCurrentRoadmap] = useState(null);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const roadmap = await getCurrentRoadmap();
        setCurrentRoadmap(roadmap);
      } catch (err) {
        console.error("Failed to fetch current roadmap", err);
      }
    };
    fetchCurrent();
  }, []);

  const stats = {
    overallMatch: null,
    skillsMatched: null,
    missingSkills: null,
    analysesCompleted: null
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <StatCard 
          title="Overall Match" 
          tooltip={true}
          icon={<CircularProgress percentage={stats.overallMatch || 0} />}
          subtitle="Target Role Match"
        />
        <StatCard 
          title="Skills Matched" 
          tooltip={true}
          value={stats.skillsMatched}
          subtitle="Required skills identified"
        />
        <StatCard 
          title="Missing Skills" 
          tooltip={true}
          value={stats.missingSkills}
          subtitle="Skills to improve"
        />
        <StatCard 
          title="Analyses Completed" 
          tooltip={true}
          value={stats.analysesCompleted}
          subtitle="Roles analyzed"
        />
      </div>
      <CurrentRoadmapCard roadmap={currentRoadmap} userid={userid} />
    </div>
  );
};

export default StatsGrid;
