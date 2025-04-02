
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth';
import { ThemeProvider } from './context/theme';
import { SolanaContextProvider } from './context/blockchain/SolanaContextProvider';
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
import Quiz from './pages/Quiz';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import Blockchain from './pages/Blockchain';

function App() {
  useEffect(() => {
    console.log('Study Bee - Adaptive Learning Platform');
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
        <AuthProvider>
          <SolanaContextProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Login />} /> {/* Alias for login */}
              <Route path="/signup" element={<Register />} /> {/* Alias for register */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/qualifications" element={<Qualifications />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/study-planner" element={<StudyPlannerPage />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/cognitive-profile" element={<CognitiveProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/adaptive-quiz" element={<AdaptiveQuiz />} />
              <Route path="/blockchain" element={<Blockchain />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/profile" element={<Settings />} />
            </Routes>
            <Toaster />
          </SolanaContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
