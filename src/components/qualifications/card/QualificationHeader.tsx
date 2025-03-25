
import React from 'react';
import { Button } from "@/components/ui/button";
import { QualificationType } from '../types';

interface QualificationHeaderProps {
  qualification: QualificationType;
}

const QualificationHeader: React.FC<QualificationHeaderProps> = ({ qualification }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{qualification.name}</h2>
          <span className="text-muted-foreground">({qualification.fullName})</span>
        </div>
        <p className="text-muted-foreground mt-2 max-w-3xl">{qualification.description}</p>
      </div>
      
      {qualification.status === 'in-progress' ? (
        <Button className="md:self-start">Continue Learning</Button>
      ) : (
        <Button variant="outline" className="md:self-start">Start Track</Button>
      )}
    </div>
  );
};

export default QualificationHeader;
