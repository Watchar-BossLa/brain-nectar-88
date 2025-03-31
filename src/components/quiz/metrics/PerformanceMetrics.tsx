
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, DoughnutChart } from '@/components/ui/charts';

interface PerformanceMetricsProps {
  userId: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ userId }) => {
  // Sample data - in a real app, this would come from an API call
  const performanceData = [
    { name: 'Jan', score: 65, accuracy: 70, time: 45 },
    { name: 'Feb', score: 59, accuracy: 60, time: 40 },
    { name: 'Mar', score: 80, accuracy: 85, time: 35 },
    { name: 'Apr', score: 81, accuracy: 90, time: 30 },
    { name: 'May', score: 56, accuracy: 65, time: 42 },
    { name: 'Jun', score: 55, accuracy: 60, time: 45 },
    { name: 'Jul', score: 40, accuracy: 50, time: 50 }
  ];
  
  const topicPerformance = [
    { name: 'Accounting', value: 85 },
    { name: 'Finance', value: 65 },
    { name: 'Taxation', value: 75 },
    { name: 'Audit', value: 90 },
    { name: 'Law', value: 60 }
  ];
  
  const timeSpentData = [
    { name: 'Mon', minutes: 45 },
    { name: 'Tue', minutes: 30 },
    { name: 'Wed', minutes: 60 },
    { name: 'Thu', minutes: 25 },
    { name: 'Fri', minutes: 90 },
    { name: 'Sat', minutes: 120 },
    { name: 'Sun', minutes: 45 }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Your quiz scores and accuracy over time</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={performanceData} 
            dataKeys={['score', 'accuracy']} 
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Your mastery by topic area</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart data={topicPerformance} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Time</CardTitle>
            <CardDescription>Minutes spent studying per day</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={timeSpentData} 
              dataKeys={['minutes']} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
