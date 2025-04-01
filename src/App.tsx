
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Dashboard from './pages/Dashboard';
import CognitiveProfile from './pages/CognitiveProfile';
import AdaptiveQuiz from './components/quiz/AdaptiveQuiz';
import LearningPaths from './pages/LearningPaths';
import Qualifications from './pages/Qualifications';
import Flashcards from './pages/Flashcards';
import FlashcardReview from './pages/FlashcardReview';
import QuizHistory from './pages/QuizHistory';
import Standards from './pages/Standards';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TestingPage from './pages/TestingPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cognitive-profile" element={<ProtectedRoute><CognitiveProfile /></ProtectedRoute>} />
              <Route path="/quiz" element={<ProtectedRoute><AdaptiveQuiz topicIds={[]} /></ProtectedRoute>} />
              <Route path="/learning-paths" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />
              <Route path="/qualifications" element={<ProtectedRoute><Qualifications /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
              <Route path="/flashcard-review" element={<ProtectedRoute><FlashcardReview /></ProtectedRoute>} />
              <Route path="/quiz-history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
              <Route path="/standards" element={<ProtectedRoute><Standards /></ProtectedRoute>} />
              <Route path="/testing" element={<ProtectedRoute><TestingPage /></ProtectedRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
