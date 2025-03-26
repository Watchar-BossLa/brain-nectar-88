
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import AgentDashboard from '@/pages/AgentDashboard';
import AdvancedLearning from '@/pages/AdvancedLearning';
import { AuthProvider } from '@/context/auth';
import { LearningPathProvider } from '@/components/learning/LearningPathProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LearningPathProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/advanced-learning" element={<AdvancedLearning />} />
          </Routes>
          <Toaster />
        </LearningPathProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
