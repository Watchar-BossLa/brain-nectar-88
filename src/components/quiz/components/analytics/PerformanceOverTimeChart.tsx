
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformancePoint {
  date: string;
  score: number;
  difficulty: number;
}

interface PerformanceOverTimeChartProps {
  data: PerformancePoint[];
}

const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
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
              data={data}
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
