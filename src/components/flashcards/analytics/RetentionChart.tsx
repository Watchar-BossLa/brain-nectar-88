
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DataPoint {
  date: string;
  retention: number;
  reviewCount: number;
}

interface RetentionChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
}

const RetentionChart: React.FC<RetentionChartProps> = ({ 
  data, 
  title = "Memory Retention Over Time",
  description = "This chart shows your retention rate based on spaced repetition reviews."
}) => {
  // Calculate average retention
  const avgRetention = data.length 
    ? data.reduce((sum, point) => sum + point.retention, 0) / data.length 
    : 0;
  
  // Find the most recent retention
  const currentRetention = data.length ? data[data.length - 1].retention : 0;
  
  // Calculate improvement
  const improvement = data.length > 1 
    ? ((data[data.length - 1].retention - data[0].retention) / data[0].retention) * 100 
    : 0;
    
  // Format data for display
  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString(),
    retention: Math.round(point.retention * 100)
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground flex items-center">
            <Info className="h-3.5 w-3.5 mr-1" />
            Based on spaced repetition algorithm
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Retention']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Retention</p>
            <p className="text-2xl font-bold">{Math.round(currentRetention * 100)}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Retention</p>
            <p className="text-2xl font-bold">{Math.round(avgRetention * 100)}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Improvement</p>
            <p className={`text-2xl font-bold ${improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : ''}`}>
              {improvement > 0 ? '+' : ''}{Math.round(improvement)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetentionChart;
