import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LineChart = ({ data, config }) => {
  // Extract unique categories for multiple lines
  const getCategories = () => {
    if (!data || data.length === 0 || !config.xAxis || !config.yAxis) return [];
    
    // For simple line charts, we just need the yAxis
    if (config.yAxis && typeof data[0][config.yAxis] === 'number') {
      return [config.yAxis];
    }
    
    // For multiple lines, we need to find all possible categories
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
  
  // Determine the curve type
  const getCurveType = () => {
    switch (config.curveType) {
      case 'natural':
        return 'natural';
      case 'step':
        return 'stepAfter';
      case 'linear':
      default:
        return 'linear';
    }
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
      <RechartsLineChart
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
          <Line 
            key={category}
            type={getCurveType()}
            dataKey={category} 
            stroke={getColor(index)}
            activeDot={{ r: 8 }}
            animationDuration={config.animation ? 1500 : 0}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
