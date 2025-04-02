
import React from 'react';
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
import { AuthProvider } from './context/auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TestingPage from './pages/TestingPage';
import Index from './pages/Index';
import { LanguageProvider } from './context/language/LanguageContext';
import Assessment from './pages/Assessment';
import Courses from './pages/Courses';

// Import i18n configuration
import './i18n/i18n';

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
          <LanguageProvider>
            <AuthProvider>
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
                  <Route path="/testing" element={<ProtectedRoute><TestingPage /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                  <Route path="/signin" element={<Index />} />
                  <Route path="/signup" element={<Index />} />
                </Routes>
              </Router>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
