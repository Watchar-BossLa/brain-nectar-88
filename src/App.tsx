
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/auth';
import { ThemeProvider } from './context/theme';
import { SolanaProvider } from './context/blockchain/SolanaProvider';
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
import Admin from './pages/Admin';
import FlashcardReview from './pages/FlashcardReview';

function App() {
  useEffect(() => {
    console.log('Study Bee - Adaptive Learning Platform');
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
        <AuthProvider>
          {/* First wrap with SolanaProvider (wallet adapter) */}
          <SolanaProvider>
            {/* Then wrap with our custom Solana Context */}
            <SolanaContextProvider>
              <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signin" element={<Login />} /> {/* Alias for login */}
                <Route path="/signup" element={<Register />} /> {/* Alias for register */}
                
                {/* Main app routes */}
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/qualifications" element={<Qualifications />} />
                <Route path="/flashcards" element={<FlashcardsPage />} />
                <Route path="/flashcard-review" element={<FlashcardReview />} />
                <Route path="/study-planner" element={<StudyPlannerPage />} />
                <Route path="/learning-path" element={<LearningPath />} />
                <Route path="/cognitive-profile" element={<CognitiveProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Settings />} /> {/* Alias for settings */}
                <Route path="/agent-dashboard" element={<AgentDashboard />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/adaptive-quiz" element={<AdaptiveQuiz />} />
                <Route path="/blockchain" element={<Blockchain />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Toaster />
            </SolanaContextProvider>
          </SolanaProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
