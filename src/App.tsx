
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/auth';
import { ThemeProvider } from './context/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Assessment from './pages/Assessment';
import Qualifications from './pages/Qualifications';
import FlashcardsPage from './pages/Flashcards';
import Settings from './pages/Settings';
import StudyPlannerPage from './pages/StudyPlannerPage';
import AgentDashboard from './pages/AgentDashboard';
import LearningPath from './pages/LearningPath';
import CognitiveProfile from './pages/CognitiveProfile';
import { useEffect } from 'react';
import Index from './pages/Index';

function App() {
  useEffect(() => {
    console.log('Study Bee - Adaptive Learning Platform');
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/qualifications" element={<Qualifications />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/study-planner" element={<StudyPlannerPage />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/cognitive-profile" element={<CognitiveProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
