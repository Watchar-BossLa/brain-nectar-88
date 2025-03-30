
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DifficultyPerformance {
  name: string;
  correct: number;
  incorrect: number;
  total: number;
}

interface DifficultyCategoryChartProps {
  data: DifficultyPerformance[];
}

const DifficultyCategoryChart: React.FC<DifficultyCategoryChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance by Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No difficulty performance data available yet.</p>
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
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value, name, props) => {
                if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
                // Safely handle name formatting regardless of type
                const formattedName = typeof name === 'string' 
                  ? name.charAt(0).toUpperCase() + name.slice(1) 
                  : name;
                return [value, formattedName];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="correct" name="Correct" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="incorrect" name="Incorrect" fill="#ff8042" />
              <Bar yAxisId="right" dataKey="accuracy" name="Accuracy" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyCategoryChart;
