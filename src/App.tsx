
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/context/theme/ThemeContext";
import { LearningPathProvider } from "@/components/learning/LearningPathProvider";
import { SolanaProvider } from "@/context/SolanaContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EnvCheckWarning } from "@/components/auth/EnvCheckWarning";
import { AuthProvider } from "@/context/auth";
import AuthWrapper from "@/context/AuthWrapper";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Assessments from "./pages/Assessments";
import Qualifications from "./pages/Qualifications";
import Flashcards from "./pages/Flashcards";
import FlashcardReview from "./pages/FlashcardReview";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AgentDashboard from './pages/AgentDashboard';
import FinancialTools from './pages/FinancialTools';
import Quiz from './pages/Quiz';
import StudyPlanner from './pages/StudyPlanner';
import Blockchain from './pages/Blockchain';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter> {/* Move BrowserRouter to wrap everything including AuthProvider */}
        <AuthProvider>
          <AuthWrapper>
            <SolanaProvider>
              <LearningPathProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <div className="container mx-auto px-4">
                    <EnvCheckWarning />
                    <AnimatePresence>
                      <Routes>
                        {/* Auth routes */}
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        
                        {/* Protected routes */}
                        <Route 
                          path="/" 
                          element={
                            <ProtectedRoute>
                              <Index />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/courses" 
                          element={
                            <ProtectedRoute>
                              <Courses />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/assessments" 
                          element={
                            <ProtectedRoute>
                              <Assessments />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/qualifications" 
                          element={
                            <ProtectedRoute>
                              <Qualifications />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/flashcards" 
                          element={
                            <ProtectedRoute>
                              <Flashcards />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/flashcards/review" 
                          element={
                            <ProtectedRoute>
                              <FlashcardReview />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/profile" 
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/profile/user" 
                          element={
                            <ProtectedRoute>
                              <UserProfile />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/agents" 
                          element={
                            <ProtectedRoute>
                              <AgentDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/financial-tools" 
                          element={
                            <ProtectedRoute>
                              <FinancialTools />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/quiz" 
                          element={
                            <ProtectedRoute>
                              <Quiz />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/study-planner" 
                          element={
                            <ProtectedRoute>
                              <StudyPlanner />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/blockchain" 
                          element={
                            <ProtectedRoute>
                              <Blockchain />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </TooltipProvider>
              </LearningPathProvider>
            </SolanaProvider>
          </AuthWrapper>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
