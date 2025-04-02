
import React from 'react';
import { BookOpen } from 'lucide-react';

const AssessmentsTab = () => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Course Assessments</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Take quizzes and practice tests to gauge your understanding of the material.
      </p>
    </div>
  );
};

export default AssessmentsTab;
