
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { QualificationType } from '../types';

interface QualificationProgressProps {
  qualification: QualificationType;
}

const QualificationProgress: React.FC<QualificationProgressProps> = ({ qualification }) => {
  if (qualification.status !== 'in-progress') {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="text-sm font-medium">
          {qualification.examsPassed}/{qualification.totalExams} exams passed
        </span>
      </div>
      <Progress 
        value={(qualification.examsPassed / qualification.totalExams) * 100} 
        className="h-2" 
      />
    </div>
  );
};

export default QualificationProgress;
