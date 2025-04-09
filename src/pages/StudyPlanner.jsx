import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StudyPlanner from '@/components/study-planner/StudyPlanner';

const StudyPlannerPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Study Planner</h1>
        <StudyPlanner />
      </div>
    </MainLayout>
  );
};

export default StudyPlannerPage;
