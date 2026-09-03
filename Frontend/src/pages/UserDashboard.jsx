import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Dashboard Components
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ResumeAnalyzer from '../components/dashboard/ResumeAnalyzer';
import StatsGrid from '../components/dashboard/StatsGrid';
import SkillGapOverview from '../components/dashboard/SkillGapOverview';
import NextSteps from '../components/dashboard/NextSteps';
import RecentAnalyses from '../components/dashboard/RecentAnalyses';
import { CareerProgress, AIConsultant } from '../components/dashboard/ProgressAndAI';

const UserDashboard = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      if (session.user.id !== userid) {
        navigate(`/${session.user.id}`);
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/auth');
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [userid, navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Sidebar - Fixed Left */}
      <Sidebar userid={userid} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: '2rem 3rem',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <DashboardHeader user={user} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top & Middle Rows (2fr 1fr) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gap: '1.5rem' 
          }}>
            <ResumeAnalyzer />
            <StatsGrid />
            
            <SkillGapOverview />
            <NextSteps />
          </div>

          {/* Bottom Row (2fr 1fr 1fr) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2.5fr 1.25fr 1.25fr', 
            gap: '1.5rem' 
          }}>
            <RecentAnalyses />
            <CareerProgress />
            <AIConsultant />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
