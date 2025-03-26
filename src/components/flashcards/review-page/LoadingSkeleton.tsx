
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="container max-w-5xl py-10">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-64 w-full rounded-xl mb-4" />
      <div className="flex justify-center gap-4 mt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
