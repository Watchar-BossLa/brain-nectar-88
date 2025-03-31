
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export interface PerformanceByDifficultyProps {
  difficultyStats?: Record<number, { total: number; correct: number }>;
}

const PerformanceByDifficulty: React.FC<PerformanceByDifficultyProps> = ({ 
  difficultyStats = {} 
}) => {
  // Transform the difficulty stats into chart data
  const data = Object.entries(difficultyStats).map(([difficulty, stats]) => {
    const difficultyLevel = Number(difficulty);
    let name = 'Unknown';
    let color = '#777';
    
    switch(difficultyLevel) {
      case 1:
        name = 'Easy';
        color = '#4ade80'; // green
        break;
      case 2:
        name = 'Medium';
        color = '#facc15'; // yellow
        break;
      case 3:
        name = 'Hard';
        color = '#f87171'; // red
        break;
    }
    
    const percentage = stats.total > 0 
      ? Math.round((stats.correct / stats.total) * 100)
      : 0;
    
    return {
      name,
      value: stats.total,
      correct: stats.correct,
      percentage,
      color
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Difficulty</CardTitle>
        <CardDescription>
          How you perform across different difficulty levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${props.payload.correct} / ${value} (${props.payload.percentage}%)`,
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No difficulty data available yet. Complete some quizzes to see your performance by difficulty.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceByDifficulty;
