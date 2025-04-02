
import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  color?: string;
  height?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  dataKey, 
  nameKey = "subject",
  color = "#2563eb", 
  height = 300 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={nameKey} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name={dataKey}
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.6}
        />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};
