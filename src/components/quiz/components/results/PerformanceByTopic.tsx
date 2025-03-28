
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { PerformanceByTopicProps } from './types';

const PerformanceByTopic: React.FC<PerformanceByTopicProps> = ({ topics }) => {
  return (
    <div className="space-y-3">
      {Object.entries(topics).map(([topic, { correct, total }]) => (
        <div key={topic} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{topic}</span>
            <span className="text-sm">{correct} / {total} ({Math.round(correct / total * 100)}%)</span>
          </div>
          <Progress value={correct / total * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default PerformanceByTopic;
