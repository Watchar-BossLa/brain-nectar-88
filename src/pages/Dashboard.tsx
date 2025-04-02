
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { useFlashcardsStats } from '@/hooks/flashcards';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecommendedStudy from '@/components/dashboard/RecommendedStudy';
import DailyStudyGoal from '@/components/dashboard/DailyStudyGoal';
import CoursesSection from '@/components/dashboard/CoursesSection';
import UpcomingAssessments from '@/components/dashboard/UpcomingAssessments';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { stats, fetchStats, loading: statsLoading } = useFlashcardsStats();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    
    if (user) {
      fetchStats();
    }
  }, [user, authLoading, navigate, fetchStats]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeHeader />
        
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecommendedStudy />
            <CoursesSection />
          </div>
          
          <div className="space-y-6">
            <DailyStudyGoal />
            <UpcomingAssessments />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
