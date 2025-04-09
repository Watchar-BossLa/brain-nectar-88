
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { ThemeProvider } from './context/theme/ThemeContext';
import { SolanaProvider } from './context/blockchain';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { registerServiceWorker } from './registerServiceWorker';
import OfflineStatusIndicator from './components/ui/OfflineStatusIndicator';
import ServiceInitializer from './components/revolutionary/ServiceInitializer';

// Page imports
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Flashcards from './pages/Flashcards';
import FlashcardReview from './pages/FlashcardReview';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Blockchain from './pages/Blockchain';
import Qualifications from './pages/Qualifications';
import UserProfile from './pages/UserProfile';
import StudyPlanner from './pages/StudyPlanner';
import Courses from './pages/Courses';
import Assessments from './pages/Assessments';
import AgentDashboard from './pages/AgentDashboard';
import AdvancedLearning from './pages/AdvancedLearning';
import FinancialTools from './pages/FinancialTools';
import AccountingTools from './pages/AccountingTools';
import AuthWrapper from './context/AuthWrapper';
import StudyTimer from './pages/StudyTimer';
import VisualRecognition from './pages/VisualRecognition';
import DocumentAnalysis from './pages/DocumentAnalysis';
import AdaptiveSpacedRepetition from './pages/AdaptiveSpacedRepetition';
import KnowledgeVisualization from './pages/KnowledgeVisualization';
import CollaborativeLearning from './pages/CollaborativeLearning';
import AugmentedRealityStudy from './pages/AugmentedRealityStudy';
import AIStudyCoach from './pages/AIStudyCoach';
import StudyGroups from './pages/StudyGroups';
import StudyGroupDetail from './pages/StudyGroupDetail';
import KnowledgeVisualizationSystem from './pages/KnowledgeVisualizationSystem';
import KnowledgeMapDetail from './pages/KnowledgeMapDetail';

/**
 * Main application component
 * @returns {React.ReactElement} The application component
 */
function App() {
  const queryClient = new QueryClient();

  // Register service worker on app initialization
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SolanaProvider>
            <AuthWrapper>
              <ServiceInitializer />
              <div className="app">
                <QueryClientProvider client={queryClient}>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  <OfflineStatusIndicator />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/flashcards" element={<Flashcards />} />
                    <Route path="/flashcard-review" element={<FlashcardReview />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/blockchain" element={<Blockchain />} />
                    <Route path="/qualifications" element={<Qualifications />} />
                    <Route path="/user-profile" element={<UserProfile />} />
                    <Route path="/study-planner" element={<StudyPlanner />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/assessments" element={<Assessments />} />
                    <Route path="/agent-dashboard" element={<AgentDashboard />} />
                    <Route path="/advanced-learning" element={<AdvancedLearning />} />
                    <Route path="/financial-tools" element={<FinancialTools />} />
                    <Route path="/accounting-tools" element={<AccountingTools />} />
                    <Route path="/study-timer" element={<StudyTimer />} />
                    <Route path="/visual-recognition" element={<VisualRecognition />} />
                    <Route path="/document-analysis" element={<DocumentAnalysis />} />
                    <Route path="/adaptive-spaced-repetition" element={<AdaptiveSpacedRepetition />} />
                    <Route path="/knowledge-visualization" element={<KnowledgeVisualization />} />
                    <Route path="/collaborative-learning" element={<CollaborativeLearning />} />
                    <Route path="/augmented-reality-study" element={<AugmentedRealityStudy />} />
                    <Route path="/ai-study-coach" element={<AIStudyCoach />} />
                    <Route path="/study-groups" element={<StudyGroups />} />
                    <Route path="/study-groups/:groupId" element={<StudyGroupDetail />} />
                    <Route path="/knowledge-visualization-system" element={<KnowledgeVisualizationSystem />} />
                    <Route path="/knowledge-visualization-system/maps/:mapId" element={<KnowledgeMapDetail />} />
                  </Routes>
                </QueryClientProvider>
              </div>
            </AuthWrapper>
          </SolanaProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
