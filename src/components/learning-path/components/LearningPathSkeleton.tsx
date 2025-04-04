
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LearningPathSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      
      <Skeleton className="h-64" />
    </div>
  );
};

export default LearningPathSkeleton;
