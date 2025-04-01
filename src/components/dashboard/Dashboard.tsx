
import React from 'react';
import { useAuth } from '@/context/auth';
import QuizBasedLearningPath from '@/components/learning/QuizBasedLearningPath';

// Import your existing components
import StudyProgress from './StudyProgress';
import UpcomingAssessments from './UpcomingAssessments';
import RecommendedStudy from './RecommendedStudy';
import RecentActivity from './RecentActivity';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6 space-y-6">
      {/* Welcome message */}
      <div className="transition-opacity duration-500 opacity-100">
        <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.name || 'Student'}</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and continue your learning journey
        </p>
      </div>
      
      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="transition-all duration-300">
            <StudyProgress />
          </div>
          
          <div className="transition-all duration-300 delay-100">
            <QuizBasedLearningPath />
          </div>
        </div>
        
        {/* Second column */}
        <div className="space-y-6">
          <div className="transition-all duration-300 delay-200">
            <UpcomingAssessments />
          </div>
          
          <div className="transition-all duration-300 delay-300">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
