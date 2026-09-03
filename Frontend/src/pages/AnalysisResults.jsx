import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnalysis } from '../services/analysisService';
import Sidebar from '../components/dashboard/Sidebar';
import RoadmapGenerationModal from '../components/roadmap/RoadmapGenerationModal';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Target, CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, items, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!items || items.length === 0) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
          {Icon && <Icon size={18} />}
          {title} ({items.length})
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
          <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, i) => (
              <li key={i}>{typeof item === 'string' ? item : `${item.question} (Reason: ${item.reason})`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SkillPill = ({ skill, type }) => {
  const colors = {
    matched: { border: '#166534', bg: 'rgba(22, 101, 52, 0.2)', text: '#4ade80', icon: <CheckCircle2 size={14} color="#4ade80" /> },
    partial: { border: '#854d0e', bg: 'rgba(133, 77, 14, 0.2)', text: '#facc15', icon: <AlertCircle size={14} color="#facc15" /> },
    missing: { border: '#991b1b', bg: 'rgba(153, 27, 27, 0.2)', text: '#f87171', icon: <XCircle size={14} color="#f87171" /> }
  };
  const style = colors[type];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem',
      border: `1px solid ${style.border}`, backgroundColor: style.bg, borderRadius: '20px',
      fontSize: '0.75rem', color: style.text, fontWeight: 500
    }}>
      {style.icon}
      {skill}
    </div>
  );
};

const AnalysisResults = () => {
  const { userid, analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAnalysis(analysisId);
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [analysisId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>Loading analysis...</div>;
  }

  if (error || !analysis) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: '#f87171' }}>Error: {error || 'Analysis not found'}</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      <Sidebar userid={userid} onLogout={handleLogout} />

      <main style={{ flex: 1, padding: '2rem 3rem', height: '100vh', overflowY: 'auto' }}>
        <Link to={`/${userid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Role Analysis Results
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Based on {analysis.resumes.original_filename}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: analysis.match_score >= 80 ? '#4ade80' : analysis.match_score >= 50 ? '#facc15' : '#f87171' }}>
                {analysis.match_score}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Match Score</div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
              padding: '0.75rem 1.5rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)',
              borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
            }}>
              <Sparkles size={16} /> Generate Preparation Roadmap
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Skills Overview */}
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} /> Skill Gap Analysis
            </h2>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#4ade80' }}>Matched Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.matched_skills?.map(skill => <SkillPill key={skill} skill={skill} type="matched" />)}
                  {(!analysis.matched_skills || analysis.matched_skills.length === 0) && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>None identified</span>}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#facc15' }}>Partial Match / Weak</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.partial_skills?.map(skill => <SkillPill key={skill} skill={skill} type="partial" />)}
                  {(!analysis.partial_skills || analysis.partial_skills.length === 0) && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>None identified</span>}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#f87171' }}>Missing Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.missing_skills?.map(skill => <SkillPill key={skill} skill={skill} type="missing" />)}
                  {(!analysis.missing_skills || analysis.missing_skills.length === 0) && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>None identified</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Details Accordions */}
          <section>
            <Accordion title="Strengths" items={analysis.strengths} icon={CheckCircle2} />
            <Accordion title="Weaknesses" items={analysis.weaknesses} icon={XCircle} />
            <Accordion title="Recommendations" items={analysis.recommendations} icon={Sparkles} />
            <Accordion title="Potential Interview Questions" items={analysis.interview_questions} icon={Target} />
          </section>
        </div>
      </main>

      <RoadmapGenerationModal 
        analysisId={analysisId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(roadmap) => {
          setIsModalOpen(false);
          navigate(`/${userid}/roadmap/${roadmap.id}`);
        }}
      />
    </div>
  );
};

export default AnalysisResults;
