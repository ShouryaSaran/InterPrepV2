import React, { useState } from 'react';
import { generateRoadmap } from '../../services/roadmapService';
import { X, Loader2, Calendar, Clock, Target } from 'lucide-react';

const RoadmapGenerationModal = ({ analysisId, isOpen, onClose, onSuccess }) => {
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [goal, setGoal] = useState('balanced');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const roadmap = await generateRoadmap(analysisId, durationWeeks, hoursPerWeek, goal);
      onSuccess(roadmap);
    } catch (err) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'var(--bg)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px',
        border: '1px solid var(--border)', position: 'relative'
      }}>
        {!isGenerating && (
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        )}

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Customize Your Preparation Plan
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          We'll use your Role Analysis to generate a personalized roadmap. How would you like to structure your prep?
        </p>

        {isGenerating ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', gap: '1rem' }}>
            <Loader2 size={40} color="var(--text-primary)" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Building your preparation roadmap...</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>We're prioritizing your skill gaps and creating a realistic plan for your target role.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                <Calendar size={16} /> Preparation Duration
              </label>
              <select 
                value={durationWeeks} 
                onChange={e => setDurationWeeks(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value={2}>2 weeks (Aggressive sprint)</option>
                <option value={4}>4 weeks (Standard prep)</option>
                <option value={6}>6 weeks (Recommended)</option>
                <option value={8}>8 weeks (Deep dive)</option>
                <option value={12}>12 weeks (Comprehensive)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                <Clock size={16} /> Weekly Time Commitment
              </label>
              <select 
                value={hoursPerWeek} 
                onChange={e => setHoursPerWeek(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value={5}>5 hours/week (Light)</option>
                <option value={10}>10 hours/week (Moderate)</option>
                <option value={15}>15 hours/week (Intensive)</option>
                <option value={20}>20 hours/week (Full-time job search)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                <Target size={16} /> Primary Goal
              </label>
              <select 
                value={goal} 
                onChange={e => setGoal(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="balanced">Balanced Preparation</option>
                <option value="interview_ready">Become Interview Ready (Algo/System Design)</option>
                <option value="skill_gaps">Close Technical Skill Gaps</option>
                <option value="resume_fit">Improve Resume Fit (Projects/Impact)</option>
              </select>
            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: '0.875rem', backgroundColor: 'rgba(153, 27, 27, 0.1)', padding: '0.75rem', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              style={{
                width: '100%', padding: '0.75rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)',
                borderRadius: '6px', fontWeight: 600, marginTop: '0.5rem'
              }}
            >
              Generate My Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerationModal;
