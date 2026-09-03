import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getAllAnalyses } from '../../services/analysisService';

const RecentAnalyses = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getAllAnalyses();
        setAnalyses(data.slice(0, 5)); // show up to 5 recent
      } catch (err) {
        console.error("Failed to fetch recent analyses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          Recent Role Analyses
        </div>
        <Link to={`/${userid}/resume-analysis`} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          View all analyses →
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Company</th>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Match Score</th>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ paddingBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  Loading analyses...
                </td>
              </tr>
            ) : analyses.length > 0 ? (
              analyses.map((analysis, i) => (
                <tr key={i} style={{ borderBottom: i < analyses.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{analysis.job_title}</td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{analysis.company || '-'}</td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{analysis.match_score}%</td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{new Date(analysis.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: 'rgba(22, 101, 52, 0.2)', 
                      color: '#4ade80', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {analysis.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <button style={{
                      padding: '0.375rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-secondary)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => navigate(`/${userid}/analysis/${analysis.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  No recent analyses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAnalyses;
