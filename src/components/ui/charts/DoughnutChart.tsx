
import React from 'react';
import { PieChart } from './PieChart';

interface DoughnutChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data, 
  colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"], 
  height = 300 
}) => {
  return (
    <PieChart 
      data={data} 
      colors={colors} 
      height={height}
      innerRadius={60}
      outerRadius={80}
    />
  );
};
