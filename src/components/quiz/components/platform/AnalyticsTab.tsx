
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import PerformanceMetrics from '../metrics/PerformanceMetrics';
import { useAuth } from '@/context/auth';

const AnalyticsTab: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("performance");

  // Sample data - in a real app, this would be fetched from an API
  const accuracyTrendData = [
    { date: 'Jan', accuracy: 65 },
    { date: 'Feb', accuracy: 68 },
    { date: 'Mar', accuracy: 75 },
    { date: 'Apr', accuracy: 80 },
    { date: 'May', accuracy: 82 },
    { date: 'Jun', accuracy: 78 },
    { date: 'Jul', accuracy: 85 },
  ];

  const topicAccuracyData = [
    { topic: 'Accounting', correct: 25, incorrect: 5 },
    { topic: 'Taxation', correct: 18, incorrect: 7 },
    { topic: 'Finance', correct: 22, incorrect: 3 },
    { topic: 'Auditing', correct: 15, incorrect: 10 },
    { topic: 'Law', correct: 20, incorrect: 5 },
  ];

  const difficultyDistribution = [
    { name: 'Easy', value: 25 },
    { name: 'Medium', value: 45 },
    { name: 'Hard', value: 30 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Performance Analytics</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Overall Performance</TabsTrigger>
            <TabsTrigger value="topics">Topics Breakdown</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            {user && <PerformanceMetrics userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Topic Accuracy</h3>
                <BarChart 
                  data={topicAccuracyData}
                  dataKeys={['correct', 'incorrect']}
                  xAxisKey="topic"
                  height={300}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Question Difficulty Distribution</h3>
                <PieChart 
                  data={difficultyDistribution}
                  height={300}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <div>
              <h3 className="text-lg font-medium mb-4">Accuracy Trend Over Time</h3>
              <LineChart 
                data={accuracyTrendData}
                dataKeys={['accuracy']}
                xAxisKey="date"
                height={300}
              />
              <p className="text-sm text-muted-foreground mt-4">
                Your accuracy has improved by 20% over the last 6 months.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
