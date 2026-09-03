import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInterview } from '../../../services/interviewService';
import { ArrowLeft, Target, Briefcase, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const InterviewResultsPage = () => {
  const { userid, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getInterview(sessionId);
        setSession(data.session);
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
        setError('Failed to load interview results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Results...</div>;
  if (error) return <div style={{ padding: '2rem', color: '#ef4444' }}>{error}</div>;
  if (!session || session.status !== 'completed') return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Results not available yet.</div>;

  const feedback = session.feedback || {};
  const answeredCount = session.answered_questions;
  const skippedCount = session.total_questions - answeredCount;

  // Calculate category averages locally based on questions
  const categoryStats = questions.reduce((acc, q) => {
    if (q.answer_score !== null) {
      if (!acc[q.category]) {
        acc[q.category] = { total: 0, count: 0 };
      }
      acc[q.category].total += q.answer_score;
      acc[q.category].count += 1;
    }
    return acc;
  }, {});

  const categories = Object.keys(categoryStats).map(cat => ({
    name: cat,
    average: Math.round(categoryStats[cat].total / categoryStats[cat].count)
  })).sort((a, b) => b.average - a.average);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <Link 
          to={`/${userid}/interview`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back to Interviews
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Interview Performance
        </h1>
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Briefcase size={14} /> {session.title}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Target size={14} /> {session.interview_type}</span>
          <span>•</span>
          <span>{new Date(session.completed_at).toLocaleDateString()}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Left Col: Overall Score & Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Score Card */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Overall Score</div>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{session.overall_score || 0}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem', marginBottom: '1rem' }}>/ 100</div>
            
            <div style={{ padding: '0.5rem 1.5rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: '20px', fontWeight: 600, fontSize: '0.875rem' }}>
              {feedback.overallRating || 'Completed'}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', width: '100%', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{answeredCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Answered</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{skippedCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Skipped</div>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Category Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{cat.name}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{cat.average}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${cat.average}%`, height: '100%', 
                      backgroundColor: cat.average >= 80 ? '#4ade80' : cat.average >= 60 ? '#facc15' : '#ef4444' 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Feedback Narrative & Next Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Performance Summary</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
              {feedback.summary || 'No summary available.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4ade80', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> Strongest Areas
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {feedback.strongestAreas?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> Weakest Areas
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {feedback.weakestAreas?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* Actionable Focus */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} /> Recommended Next Steps
            </h3>
            
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {feedback.nextSteps?.map((step, i) => <li key={i}>{step}</li>)}
            </ul>

            {feedback.recommendedFocus?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {feedback.recommendedFocus.map((focus, i) => (
                  <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{focus.topic}</span>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: focus.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)', color: focus.priority === 'high' ? '#ef4444' : 'var(--text-secondary)', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {focus.priority} Priority
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{focus.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Question Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, i) => (
            <div key={q.id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1, paddingRight: '2rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', marginRight: '0.5rem' }}>Q{i+1}.</span>
                  {q.question}
                </div>
                {q.answer_score !== null ? (
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: q.answer_score >= 80 ? '#4ade80' : q.answer_score >= 60 ? '#facc15' : '#ef4444' }}>
                    {q.answer_score}/100
                  </div>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Skipped</div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Your Answer</div>
                  <div style={{ fontSize: '0.875rem', color: q.user_answer === '[SKIPPED]' ? 'var(--text-tertiary)' : 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {q.user_answer}
                  </div>
                </div>
                
                {q.feedback && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Feedback & Improved Answer</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {q.feedback.summary}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
                      <ReactMarkdown>{q.feedback.improvedAnswer}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewResultsPage;
