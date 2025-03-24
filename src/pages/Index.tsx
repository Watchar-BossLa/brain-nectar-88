
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import CoursesSection from '@/components/dashboard/CoursesSection';
import AssessmentsRecommendedSection from '@/components/dashboard/AssessmentsRecommendedSection';
import DailyStudyGoal from '@/components/dashboard/DailyStudyGoal';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <WelcomeHeader />
        <StatsOverview />
        <CoursesSection />
        <AssessmentsRecommendedSection />
        <DailyStudyGoal />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
