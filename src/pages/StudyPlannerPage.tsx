
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { StudyPlanner } from '@/components/study-planner/StudyPlanner';

const StudyPlannerPage = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Study Planner</h1>
        <StudyPlanner />
      </div>
    </MainLayout>
  );
};

export default StudyPlannerPage;
