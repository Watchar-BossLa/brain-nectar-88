
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

interface PerformanceByDifficultyProps {
  difficultyStats?: Record<number, { total: number; correct: number }>;
}

const PerformanceByDifficulty: React.FC<PerformanceByDifficultyProps> = ({ difficultyStats }) => {
  // Transform difficulty stats into chart data
  const chartData = Object.entries(difficultyStats || {}).map(([level, stats]) => ({
    level: `Level ${level}`,
    score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    correct: stats.correct,
    total: stats.total,
    difficultyLevel: level
  })).sort((a, b) => Number(a.difficultyLevel) - Number(b.difficultyLevel));

  if (!difficultyStats || Object.keys(difficultyStats).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance by Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60">
          <p className="text-muted-foreground">
            No difficulty performance data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Difficulty</CardTitle>
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
              <XAxis dataKey="level" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === 'score') return [`${value}%`, 'Score'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#82ca9d" name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceByDifficulty;
