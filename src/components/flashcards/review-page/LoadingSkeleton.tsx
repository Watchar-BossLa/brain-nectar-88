
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="container max-w-5xl py-10">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-full mb-6" />
      
      <Skeleton className="h-96 w-full mb-6 rounded-lg" />
      
      <div className="flex justify-center gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
