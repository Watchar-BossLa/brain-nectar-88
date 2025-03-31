
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ScoreDataItem } from './types';

interface PerformanceChartProps {
  data: ScoreDataItem[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // Transform the data for the chart
  const chartData = data.map(item => ({
    name: item.name,
    score: item.score,
    average: item.average,
    color: item.color || '#10b981'  // Default color if not provided
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`]}
          labelStyle={{ color: '#111', fontWeight: 'bold' }}
        />
        <Bar 
          dataKey="score" 
          name="Your Score" 
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="average" 
          name="Average" 
          fill="#6366f1"
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;

// Named export for convenient imports
export { PerformanceChart };
