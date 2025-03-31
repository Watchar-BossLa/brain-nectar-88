
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceByTopicProps {
  topicStats?: Record<string, { total: number; correct: number }>;
}

const PerformanceByTopic: React.FC<PerformanceByTopicProps> = ({ topicStats }) => {
  // Transform topic stats into chart data
  const chartData = Object.entries(topicStats || {}).map(([topic, stats]) => ({
    topic,
    score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    correct: stats.correct,
    total: stats.total
  }));

  if (!topicStats || Object.keys(topicStats).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60">
          <p className="text-muted-foreground">
            No topic performance data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === 'score') return [`${value}%`, 'Score'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceByTopic;
