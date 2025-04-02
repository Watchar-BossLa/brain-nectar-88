
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import CognitiveProfile from './pages/CognitiveProfile';
import AdaptiveQuiz from './components/quiz/AdaptiveQuiz';
import LearningPaths from './pages/LearningPaths';
import Qualifications from './pages/Qualifications';
import Flashcards from './pages/Flashcards';
import FlashcardReview from './pages/FlashcardReview';
import QuizHistory from './pages/QuizHistory';
import Standards from './pages/Standards';
import Settings from './pages/Settings'; 
import { AuthProvider } from './context/auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TestingPage from './pages/TestingPage';
import Index from './pages/Index';
import { LanguageProvider } from './context/language/LanguageContext';
import { ThemeProvider } from './context/theme/ThemeContext'; 
import Courses from './pages/Courses';
import Assessment from './pages/Assessment';

// Import i18n configuration first
import './i18n/i18n';

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/cognitive-profile" element={<ProtectedRoute><CognitiveProfile /></ProtectedRoute>} />
                  <Route path="/quiz" element={<ProtectedRoute><AdaptiveQuiz topicIds={[]} /></ProtectedRoute>} />
                  <Route path="/learning-paths" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />
                  <Route path="/qualifications" element={<ProtectedRoute><Qualifications /></ProtectedRoute>} />
                  <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
                  <Route path="/flashcard-review" element={<ProtectedRoute><FlashcardReview /></ProtectedRoute>} />
                  <Route path="/quiz-history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
                  <Route path="/standards" element={<ProtectedRoute><Standards /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/testing" element={<ProtectedRoute><TestingPage /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                  <Route path="/signin" element={<Index />} />
                  <Route path="/signup" element={<Index />} />
                </Routes>
              </Router>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
