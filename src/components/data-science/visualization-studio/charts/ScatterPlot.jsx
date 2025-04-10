import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis
} from 'recharts';

const ScatterPlot = ({ data, config }) => {
  // For scatter plots, we need at least two numerical axes
  const validateData = () => {
    if (!data || data.length === 0 || !config.xAxis || !config.yAxis) return false;
    
    // Check if both axes are numerical
    return typeof data[0][config.xAxis] === 'number' && typeof data[0][config.yAxis] === 'number';
  };
  
  // Find a suitable category for grouping points
  const findCategoryKey = () => {
    if (!data || data.length === 0) return null;
    
    // Look for a string column that could be used for categorization
    return Object.keys(data[0]).find(key => 
      key !== config.xAxis && 
      key !== config.yAxis && 
      typeof data[0][key] === 'string'
    );
  };
  
  // Prepare data for grouped scatter plot
  const prepareData = () => {
    if (!validateData()) return [];
    
    const categoryKey = findCategoryKey();
    
    if (categoryKey) {
      // Group data by category
      const groupedData = {};
      
      data.forEach(item => {
        const category = item[categoryKey];
        if (!groupedData[category]) {
          groupedData[category] = [];
        }
        
        groupedData[category].push({
          x: item[config.xAxis],
          y: item[config.yAxis],
          z: 10, // Fixed size for now
          name: item[categoryKey]
        });
      });
      
      return Object.entries(groupedData).map(([name, points]) => ({
        name,
        data: points
      }));
    } else {
      // No category, use a single series
      return [{
        name: 'All Data',
        data: data.map(item => ({
          x: item[config.xAxis],
          y: item[config.yAxis],
          z: 10, // Fixed size for now
          name: item[config.xAxis] + ', ' + item[config.yAxis]
        }))
      }];
    }
  };
  
  const scatterData = prepareData();
  
  // Generate colors for different series
  const getColor = (index) => {
    if (scatterData.length === 1) return config.color;
    
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
  
  if (!validateData() || scatterData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select numerical data for both axes</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          type="number" 
          dataKey="x" 
          name={config.xAxis} 
          label={{ value: config.xAxis, position: 'bottom', offset: 10 }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name={config.yAxis} 
          label={{ value: config.yAxis, angle: -90, position: 'left', offset: 10 }}
        />
        <ZAxis type="number" dataKey="z" range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        {config.showLegend && <Legend />}
        
        {scatterData.map((series, index) => (
          <Scatter 
            key={series.name}
            name={series.name} 
            data={series.data} 
            fill={getColor(index)}
            animationDuration={config.animation ? 1500 : 0}
          />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;
