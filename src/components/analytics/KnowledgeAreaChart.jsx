import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Knowledge Area Chart Component
 * Shows a radar chart of knowledge areas and proficiency
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.description - Chart description
 * @returns {React.ReactElement} Knowledge area chart component
 */
const KnowledgeAreaChart = ({ 
  data = [], 
  title = "Knowledge Areas", 
  description = "Your proficiency across different knowledge areas" 
}) => {
  const [timeRange, setTimeRange] = React.useState('current');
  
  // Get data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case 'current':
        return data.filter(item => item.type === 'current');
      case 'previous':
        return data.filter(item => item.type === 'previous');
      case 'comparison':
        return data;
      default:
        return data.filter(item => item.type === 'current');
    }
  };
  
  const chartData = getChartData();
  
  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="previous">Previous</SelectItem>
                <SelectItem value="comparison">Comparison</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Transform data for radar chart
  const radarData = chartData.reduce((acc, item) => {
    const existingArea = acc.find(a => a.subject === item.subject);
    
    if (existingArea) {
      existingArea[item.type] = item.proficiency;
    } else {
      const newArea = { subject: item.subject };
      newArea[item.type] = item.proficiency;
      acc.push(newArea);
    }
    
    return acc;
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="previous">Previous</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              
              {timeRange === 'current' || timeRange === 'comparison' ? (
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              ) : null}
              
              {timeRange === 'previous' || timeRange === 'comparison' ? (
                <Radar
                  name="Previous"
                  dataKey="previous"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              ) : null}
              
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeAreaChart;
