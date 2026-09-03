import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAnalyses } from '../../../services/analysisService';
import { createInterview, getInterviews } from '../../../services/interviewService';
import { MessageSquare, Target, Settings2, Play, AlertCircle, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewHomePage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  
  const [analyses, setAnalyses] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  // Config state
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [type, setType] = useState('mixed');
  const [difficulty, setDifficulty] = useState('adaptive');
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysesData, interviewsData] = await Promise.all([
          getAnalyses(),
          getInterviews()
        ]);
        
        setAnalyses(analysesData);
        setInterviews(interviewsData.interviews || []);
        
        if (analysesData.length > 0) {
          setSelectedAnalysis(analysesData[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartInterview = async () => {
    if (!selectedAnalysis) {
      setError('Please select a role analysis first.');
      return;
    }

    setStarting(true);
    setError('');

    try {
      const response = await createInterview({
        analysisId: selectedAnalysis,
        type,
        difficulty,
        questionCount,
        focusArea: null // Future enhancement: allow specific focus
      });

      if (response.success && response.sessionId) {
        navigate(`/${userid}/interview/${response.sessionId}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate interview. Please try again.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={28} />
          Interview Preparation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Practice questions tailored to your resume and target role.
        </p>
      </header>

      {analyses.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Role Analyses Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Analyze a target role first to unlock personalized interview preparation.
          </p>
          <Link 
            to={`/${userid}/resume-analysis`}
            style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}
          >
            Analyze a Role
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings2 size={20} />
              Configure Mock Interview
            </h2>

            {error && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Target Role Analysis
                </label>
                <select 
                  value={selectedAnalysis}
                  onChange={(e) => setSelectedAnalysis(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                >
                  {analyses.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.analysis_data.jobTitle} at {a.analysis_data.company} ({new Date(a.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Interview Type
                  </label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  >
                    <option value="mixed">Mixed (Technical & Behavioral)</option>
                    <option value="technical">Technical Only</option>
                    <option value="behavioral">Behavioral Only</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Difficulty
                  </label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  >
                    <option value="adaptive">Adaptive (Mixed difficulty)</option>
                    <option value="easy">Easy (Fundamentals)</option>
                    <option value="medium">Medium (Practical)</option>
                    <option value="hard">Hard (Advanced / Deep Dive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Question Count
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[5, 10, 15].map(num => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      style={{
                        flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 500,
                        backgroundColor: questionCount === num ? 'var(--text-primary)' : 'var(--bg)',
                        color: questionCount === num ? 'var(--bg)' : 'var(--text-primary)',
                        border: `1px solid ${questionCount === num ? 'var(--text-primary)' : 'var(--border)'}`,
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleStartInterview}
                disabled={starting}
                style={{
                  marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '8px',
                  backgroundColor: 'var(--text-primary)', color: 'var(--bg)', fontWeight: 600,
                  fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  border: 'none', cursor: starting ? 'not-allowed' : 'pointer', opacity: starting ? 0.7 : 1
                }}
              >
                {starting ? (
                  <>Generating Interview...</>
                ) : (
                  <><Play size={18} fill="currentColor" /> Start Mock Interview</>
                )}
              </button>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* History Panel */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} />
                Recent Interviews
              </h3>
              
              {interviews.length === 0 ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                  No past interviews found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {interviews.slice(0, 5).map(session => (
                    <Link
                      key={session.id}
                      to={`/${userid}/interview/${session.id}${session.status === 'completed' ? '/results' : ''}`}
                      style={{
                        display: 'block', padding: '1rem', backgroundColor: 'var(--bg)', borderRadius: '8px',
                        border: '1px solid var(--border)', textDecoration: 'none', transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {session.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{session.status.replace('_', ' ')}</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHomePage;
