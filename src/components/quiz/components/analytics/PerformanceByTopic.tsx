
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface PerformanceByTopicProps {
  topicStats?: Record<string, { total: number; correct: number }>;
}

const PerformanceByTopic: React.FC<PerformanceByTopicProps> = ({ topicStats = {} }) => {
  const data = Object.entries(topicStats).map(([topic, stats]) => ({
    name: topic,
    score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    questions: stats.total,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance by Topic</CardTitle>
        <CardDescription>
          Your score distribution across different accounting topics
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[300px] w-full px-1">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, 'Score']}
                  labelFormatter={(label) => `Topic: ${label}`}
                />
                <Bar 
                  dataKey="score" 
                  name="Score" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No topic data available yet. Complete some quizzes to see your performance by topic.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceByTopic;
