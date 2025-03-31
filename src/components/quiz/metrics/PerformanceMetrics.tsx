
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetricsProps {
  accuracy: number;
  completionRate: number;
  averageTime: number;
  topicStrengths?: Record<string, number>;
  topicWeaknesses?: Record<string, number>;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  accuracy,
  completionRate,
  averageTime,
  topicStrengths = {},
  topicWeaknesses = {}
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Accuracy</span>
              <span>{accuracy.toFixed(0)}%</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Completion Rate</span>
              <span>{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Average Time per Question</span>
              <span>{averageTime.toFixed(1)} seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {Object.keys(topicStrengths).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(topicStrengths).map(([topic, score]) => (
              <div key={topic}>
                <div className="flex justify-between mb-1">
                  <span>{topic}</span>
                  <span>{score.toFixed(0)}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {Object.keys(topicWeaknesses).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(topicWeaknesses).map(([topic, score]) => (
              <div key={topic}>
                <div className="flex justify-between mb-1">
                  <span>{topic}</span>
                  <span>{score.toFixed(0)}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMetrics;
