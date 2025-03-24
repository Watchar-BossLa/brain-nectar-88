
import React from 'react';
import UpcomingAssessments from './UpcomingAssessments';
import RecommendedStudy from './RecommendedStudy';

const AssessmentsRecommendedSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <UpcomingAssessments />
      <RecommendedStudy />
    </div>
  );
};

export default AssessmentsRecommendedSection;
