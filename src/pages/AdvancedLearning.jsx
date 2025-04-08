import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RevolutionaryFeaturesDashboard from '@/components/revolutionary/RevolutionaryFeaturesDashboard';

/**
 * Advanced Learning page showcasing revolutionary features
 * @returns {React.ReactElement} Advanced Learning page
 */
const AdvancedLearning = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Advanced Learning</h1>
        <p className="text-lg mb-8">
          Experience the future of education with our revolutionary learning features.
          These cutting-edge technologies are designed to optimize your learning experience
          and help you achieve your educational goals more effectively.
        </p>
        
        <RevolutionaryFeaturesDashboard />
      </div>
    </MainLayout>
  );
};

export default AdvancedLearning;
