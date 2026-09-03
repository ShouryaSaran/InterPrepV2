import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { supabase } from '../lib/supabase';
import { getRoadmap, toggleTaskCompletion } from '../services/roadmapService';
import { ArrowLeft, Target, Clock, Calendar, CheckCircle2, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCard = ({ task, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    await onToggle(task, !task.completed);
    setLoading(false);
  };

  const priorityColors = {
    high: { border: '#991b1b', bg: 'rgba(153, 27, 27, 0.1)', text: '#f87171' },
    medium: { border: '#854d0e', bg: 'rgba(133, 77, 14, 0.1)', text: '#facc15' },
    low: { border: '#166534', bg: 'rgba(22, 101, 52, 0.1)', text: '#4ade80' }
  };
  const pStyle = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div style={{
      display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border)',
      borderRadius: '8px', backgroundColor: 'var(--bg)', marginBottom: '0.75rem',
      opacity: task.completed ? 0.6 : 1, transition: 'opacity 0.2s'
    }}>
      <button 
        onClick={handleToggle}
        disabled={loading}
        style={{ marginTop: '0.25rem', color: task.completed ? '#4ade80' : 'var(--text-secondary)', flexShrink: 0 }}
      >
        {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </h4>
          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: pStyle.bg, color: pStyle.text, border: `1px solid ${pStyle.border}`, textTransform: 'capitalize' }}>
            {task.priority} Priority
          </span>
        </div>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          {task.description}
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ padding: '0.125rem 0.375rem', border: '1px solid var(--border-light)', borderRadius: '4px', textTransform: 'capitalize' }}>
              {task.category}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Target size={14} /> {task.skill}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {task.estimated_hours} hours
          </div>
        </div>

        {task.deliverable && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '0.875rem', borderLeft: '3px solid var(--text-primary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Deliverable:</strong> <span style={{ color: 'var(--text-secondary)' }}>{task.deliverable}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const WeekCard = ({ weekData, tasks, onToggleTask }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Week {weekData.week}: {weekData.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg)', padding: '0.25rem 0.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              ~{weekData.estimatedHours} hrs
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{weekData.objective}</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {completedCount} / {tasks.length} tasks
            </div>
            <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent === 100 ? '#4ade80' : 'var(--text-primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoadmapPage = () => {
  const { userid, id: roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await getRoadmap(roadmapId);
        setRoadmap(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const handleToggleTask = async (task, completed) => {
    try {
      // Optimistic update locally
      const newTasks = roadmap.tasks.map(t => t.id === task.id ? { ...t, completed } : t);
      const newCompleted = newTasks.filter(t => t.completed).length;
      
      setRoadmap(prev => ({
        ...prev,
        tasks: newTasks,
        completed_tasks: newCompleted,
        status: newCompleted >= prev.total_tasks ? 'completed' : 'active'
      }));

      // Call API
      await toggleTaskCompletion(roadmapId, task.id, completed);
    } catch (err) {
      console.error("Failed to toggle task", err);
      // Revert optimistic update if API fails (simplistic revert by refreshing)
      const data = await getRoadmap(roadmapId);
      setRoadmap(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>Loading roadmap...</div>;
  if (error || !roadmap) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: '#f87171' }}>Error: {error || 'Not found'}</div>;

  const progress = (roadmap.completed_tasks / roadmap.total_tasks) * 100;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      <Sidebar userid={userid} onLogout={handleLogout} />

      <main style={{ flex: 1, padding: '2rem 3rem', height: '100vh', overflowY: 'auto' }}>
        <Link to={`/${userid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {roadmap.status === 'completed' && (
          <div style={{ backgroundColor: 'rgba(22, 101, 52, 0.1)', border: '1px solid #166534', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: '#4ade80', fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} /> Roadmap Complete!
              </h2>
              <p style={{ color: '#bbf7d0', fontSize: '0.875rem' }}>You completed all planned preparation tasks. Great work!</p>
            </div>
            <Link to={`/${userid}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
              Run a New Role Analysis
            </Link>
          </div>
        )}

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {roadmap.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '600px', lineHeight: 1.5 }}>
                {roadmap.summary}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{roadmap.duration_weeks} wks</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{roadmap.hours_per_week} hrs/week</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4ade80' }}>{roadmap.estimated_readiness}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Projected Match Potential</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Overall Progress</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{roadmap.completed_tasks} of {roadmap.total_tasks} tasks completed ({Math.round(progress)}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: progress === 100 ? '#4ade80' : 'var(--text-primary)', transition: 'width 0.5s ease-out' }} />
            </div>
          </div>
        </header>

        {roadmap.roadmap_data?.focusAreas && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Primary Focus Areas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {roadmap.roadmap_data.focusAreas.map((area, i) => (
                <div key={i} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{area.name}</h3>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.125rem 0.375rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                      {area.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{area.reason}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Level: <span style={{ color: 'var(--text-secondary)' }}>{area.currentLevel}</span> → <span style={{ color: 'var(--text-primary)' }}>{area.targetLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Weekly Roadmap</h2>
          {roadmap.roadmap_data?.weeks.map(week => {
            const weekTasks = roadmap.tasks.filter(t => t.week_number === week.week);
            return (
              <WeekCard 
                key={week.week} 
                weekData={week} 
                tasks={weekTasks} 
                onToggleTask={handleToggleTask}
              />
            );
          })}
        </section>

      </main>
    </div>
  );
};

export default RoadmapPage;
