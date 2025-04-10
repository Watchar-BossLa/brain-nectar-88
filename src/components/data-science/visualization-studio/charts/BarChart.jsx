import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BarChart = ({ data, config }) => {
  // Extract unique categories for grouped/stacked bar charts
  const getCategories = () => {
    if (!data || data.length === 0 || !config.xAxis || !config.yAxis) return [];
    
    // For simple bar charts, we just need the yAxis
    if (config.yAxis && typeof data[0][config.yAxis] === 'number') {
      return [config.yAxis];
    }
    
    // For grouped/stacked bar charts, we need to find all possible categories
    const categories = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== config.xAxis && typeof item[key] === 'number') {
          categories.add(key);
        }
      });
    });
    
    return Array.from(categories);
  };
  
  const categories = getCategories();
  
  // Generate a color for each category
  const getColor = (index) => {
    if (categories.length === 1) return config.color;
    
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ];
    
    return colors[index % colors.length];
  };
  
  if (!data || data.length === 0 || !config.xAxis || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select data and axes to visualize</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={config.xAxis} 
          angle={-45} 
          textAnchor="end" 
          height={70}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip />
        {config.showLegend && <Legend />}
        
        {categories.map((category, index) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={getColor(index)}
            stackId={config.stacked ? 'stack' : undefined}
            animationDuration={config.animation ? 1500 : 0}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
