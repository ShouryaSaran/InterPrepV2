import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AnalysisResults from './pages/AnalysisResults';
import RoadmapPage from './pages/RoadmapPage';
import CareerConsultantPage from './pages/CareerConsultantPage';
import InterviewHomePage from './pages/interview/InterviewHomePage';
import InterviewSessionPage from './pages/interview/InterviewSessionPage';
import InterviewResultsPage from './pages/interview/InterviewResultsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/:userid" element={<UserDashboard />} />
      <Route path="/:userid/analysis/:analysisId" element={<AnalysisResults />} />
      <Route path="/:userid/roadmap/:id" element={<RoadmapPage />} />
      <Route path="/:userid/consultant" element={<CareerConsultantPage />} />
      <Route path="/:userid/interview" element={<InterviewHomePage />} />
      <Route path="/:userid/interview/:sessionId" element={<InterviewSessionPage />} />
      <Route path="/:userid/interview/:sessionId/results" element={<InterviewResultsPage />} />
    </Routes>
  );
}

export default App;
