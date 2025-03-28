
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ScoreDataItem } from './types';

interface PerformanceChartProps {
  scoreData: ScoreDataItem[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ scoreData }) => {
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={scoreData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {scoreData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} questions`, '']}
            itemStyle={{ color: 'inherit' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
