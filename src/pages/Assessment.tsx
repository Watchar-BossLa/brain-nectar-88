
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AdaptiveQuizPlatform } from '@/components/quiz/AdaptiveQuizPlatform';

const Assessment = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Assessment</h1>
        <AdaptiveQuizPlatform />
      </div>
    </MainLayout>
  );
};

export default Assessment;
