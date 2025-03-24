
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PathSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
};

export default PathSkeleton;
