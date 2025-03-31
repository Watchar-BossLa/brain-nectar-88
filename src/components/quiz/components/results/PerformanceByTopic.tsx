
import React from 'react';
import { Progress } from "@/components/ui/progress";

export interface PerformanceByTopicProps {
  topics?: Record<string, { correct: number; total: number }>;
  topicStats?: Record<string, { correct: number; total: number }>; // For backwards compatibility
}

const PerformanceByTopic: React.FC<PerformanceByTopicProps> = ({ topics, topicStats }) => {
  // Use either topics or topicStats, preferring topics if both are provided
  const statsToRender = topics || topicStats || {};
  
  return (
    <div className="space-y-3">
      {Object.entries(statsToRender).map(([topic, { correct, total }]) => (
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
