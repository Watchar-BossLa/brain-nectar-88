
import React from 'react';
import { BookOpen, Calendar, Trophy, Users } from 'lucide-react';
import { QualificationType } from '../types';

interface QualificationMetadataProps {
  qualification: QualificationType;
}

const QualificationMetadata: React.FC<QualificationMetadataProps> = ({ qualification }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-full p-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Exams</div>
          <div>{qualification.totalExams} total</div>
        </div>
      </div>
      
      {qualification.startedDate && (
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full p-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Started</div>
            <div>{qualification.startedDate}</div>
          </div>
        </div>
      )}
      
      {qualification.expectedCompletion && (
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full p-2">
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Est. Completion</div>
            <div>{qualification.expectedCompletion}</div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-full p-2">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Active Students</div>
          <div>{qualification.activeStudents.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default QualificationMetadata;
