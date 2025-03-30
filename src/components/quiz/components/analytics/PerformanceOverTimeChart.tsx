
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnsweredQuestion } from '../../types';
import { format } from 'date-fns';

interface PerformancePoint {
  date: string;
  score: number;
  difficulty: number;
}

export interface PerformanceOverTimeChartProps {
  data?: PerformancePoint[];
  answeredQuestions?: AnsweredQuestion[];
}

const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({ 
  data: providedData,
  answeredQuestions = []
}) => {
  // Calculate performance data from answered questions if not provided
  const chartData = useMemo(() => {
    if (providedData && providedData.length > 0) return providedData;
    
    const questionsByDate: Record<string, { correct: number, total: number, difficulty: number[] }> = {};
    
    answeredQuestions.forEach(q => {
      // Use current date for missing timestamps - in a real app, you'd store the timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (!questionsByDate[timestamp]) {
        questionsByDate[timestamp] = { correct: 0, total: 0, difficulty: [] };
      }
      
      questionsByDate[timestamp].total++;
      if (q.isCorrect) {
        questionsByDate[timestamp].correct++;
      }
      
      if (q.difficulty) {
        questionsByDate[timestamp].difficulty.push(q.difficulty);
      }
    });
    
    // Convert to chart data format
    return Object.entries(questionsByDate)
      .map(([dateStr, data]) => {
        const avgDifficulty = data.difficulty.length > 0
          ? data.difficulty.reduce((sum, val) => sum + val, 0) / data.difficulty.length
          : 2; // Default to medium difficulty if not specified
        
        const score = data.total > 0 
          ? (data.correct / data.total) * 100
          : 0;
        
        return {
          date: format(new Date(dateStr), 'MMM d'),
          score: Math.round(score),
          difficulty: Number(avgDifficulty.toFixed(1))
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [providedData, answeredQuestions]);

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No performance data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis yAxisId="right" orientation="right" domain={[1, 3]} tickFormatter={(value) => `${value}`} />
              <Tooltip formatter={(value, name) => [
                name === 'score' ? `${value}%` : value, 
                name === 'score' ? 'Score' : 'Difficulty'
              ]} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="hsl(var(--primary))"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="difficulty"
                name="Difficulty"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverTimeChart;
