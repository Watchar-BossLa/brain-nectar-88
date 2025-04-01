
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

interface PerformanceMetricsProps {
  userId: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Sample data for demonstration
  const performanceData = [
    { date: 'Week 1', score: 68 },
    { date: 'Week 2', score: 74 },
    { date: 'Week 3', score: 72 },
    { date: 'Week 4', score: 80 },
    { date: 'Week 5', score: 85 },
    { date: 'Week 6', score: 82 },
  ];

  const questionTypeData = [
    { name: 'Multiple Choice', value: 45 },
    { name: 'True/False', value: 15 },
    { name: 'Free Response', value: 25 },
    { name: 'Fill in Blank', value: 15 },
  ];

  const subjectPerformance = [
    { subject: 'Financial Accounting', correct: 45, incorrect: 15 },
    { subject: 'Cost Accounting', correct: 35, incorrect: 25 },
    { subject: 'Audit', correct: 30, incorrect: 10 },
    { subject: 'Tax', correct: 25, incorrect: 15 },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        // In a real application, you would fetch actual metrics data here
        setTimeout(() => {
          setMetricsData({
            performanceData,
            questionTypeData,
            subjectPerformance
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
        <TabsTrigger value="questions">Question Types</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Performance Trend</h3>
            <LineChart 
              data={performanceData}
              dataKeys={['score']}
              xAxisKey="date"
              height={300}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subjects">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
            <BarChart 
              data={subjectPerformance}
              dataKeys={['correct', 'incorrect']}
              xAxisKey="subject"
              height={300}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="questions">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Question Type Distribution</h3>
            <PieChart 
              data={questionTypeData}
              height={300}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PerformanceMetrics;
