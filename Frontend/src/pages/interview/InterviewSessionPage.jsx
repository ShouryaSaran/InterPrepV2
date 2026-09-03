import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterview, submitAnswer, completeInterview } from '../../../services/interviewService';
import { ArrowLeft, Send, SkipForward, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const InterviewSessionPage = () => {
  const { userid, sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getInterview(sessionId);
        setSession(data.session);
        setQuestions(data.questions);

        // Find the first unanswered question
        const firstUnanswered = data.questions.findIndex(q => q.user_answer === null);
        if (firstUnanswered !== -1) {
          setCurrentQuestionIndex(firstUnanswered);
        } else if (data.session.status === 'completed') {
          navigate(`/${userid}/interview/${sessionId}/results`);
        } else {
          // All answered but not completed
          handleComplete(data.session.id);
        }
      } catch (err) {
        console.error("Failed to load session", err);
        setError("Failed to load interview session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, userid, navigate]);

  const handleComplete = async (id) => {
    setSubmitting(true);
    try {
      await completeInterview(id);
      navigate(`/${userid}/interview/${id}/results`);
    } catch (err) {
      console.error(err);
      setError('Failed to complete interview. Please refresh and try again.');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (skip = false) => {
    if (!skip && answerText.trim() === '') return;

    setSubmitting(true);
    setError('');
    
    const currentQ = questions[currentQuestionIndex];

    try {
      const response = await submitAnswer(sessionId, currentQ.id, {
        answer: skip ? null : answerText,
        skip
      });

      if (response.success) {
        // Update local question state
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = response.question;
        setQuestions(updatedQuestions);

        if (skip) {
          handleNextQuestion(updatedQuestions);
        } else {
          // Show feedback
          setFeedback(response.question.feedback);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async (currentQuestions = questions) => {
    setFeedback(null);
    setAnswerText('');
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await handleComplete(sessionId);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Interview...</div>;
  if (error && !session) return <div style={{ padding: '2rem', color: '#ef4444' }}>{error}</div>;
  if (!session) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Session not found.</div>;

  const currentQ = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(`/${userid}/interview`)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Exit Interview
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{session.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {currentQ.difficulty}
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
              {currentQ.category}
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--text-primary)', transition: 'width 0.3s ease' }} />
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>
          {currentQ.question}
        </div>

        <AnimatePresence mode="wait">
          {!feedback ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer as if you were responding in an interview..."
                style={{
                  flex: 1, width: '100%', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', 
                  borderRadius: '12px', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.6, resize: 'none', outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {answerText.length} / 8000
                </span>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleSubmit(true)}
                    disabled={submitting}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    Skip <SkipForward size={16} />
                  </button>
                  <button 
                    onClick={() => handleSubmit(false)}
                    disabled={submitting || answerText.trim() === ''}
                    style={{
                      padding: '0.75rem 1.5rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)', borderRadius: '8px', 
                      fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', 
                      cursor: submitting || answerText.trim() === '' ? 'not-allowed' : 'pointer', opacity: submitting || answerText.trim() === '' ? 0.5 : 1
                    }}
                  >
                    {submitting ? 'Evaluating...' : 'Submit Answer'} <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}
            >
              {/* Score Card */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{feedback.score}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>/ 100</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: feedback.score >= 80 ? '#4ade80' : feedback.score >= 60 ? '#facc15' : '#ef4444', marginTop: '0.5rem' }}>
                    {feedback.rating}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                    {feedback.summary}
                  </p>
                </div>
              </div>

              {/* Feedback Points */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4ade80', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> What you did well
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {feedback.whatYouDidWell?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} /> Areas to improve
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {feedback.missingPoints?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>

              {/* Improved Answer */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Example Strong Answer</h4>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  <ReactMarkdown>{feedback.improvedAnswer}</ReactMarkdown>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingBottom: '2rem' }}>
                <button 
                  onClick={() => handleNextQuestion()}
                  style={{ padding: '0.875rem 2rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InterviewSessionPage;
