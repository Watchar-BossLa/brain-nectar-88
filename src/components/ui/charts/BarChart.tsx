
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKeys: string[];
  xAxisKey?: string;
  colors?: string[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  dataKeys, 
  xAxisKey = "name",
  colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"], 
  height = 300 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar 
            key={key}
            dataKey={key} 
            fill={colors[index % colors.length]} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
