import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Activity } from 'lucide-react';
import { AnsweredQuestion } from '../../types';
import FeedbackSummary from '../analytics/FeedbackSummary';

// Create component
interface AnalyticsTabProps {
  answeredQuestions: AnsweredQuestion[];
  setActiveTab: (tab: string) => void;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ answeredQuestions, setActiveTab }) => {
  // Calculate overall performance
  const totalQuestions = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Calculate performance by topic
  const performanceByTopic: Record<string, { correct: number; total: number }> = {};
  answeredQuestions.forEach(q => {
    if (q.topic) {
      if (!performanceByTopic[q.topic]) {
        performanceByTopic[q.topic] = { correct: 0, total: 0 };
      }
      performanceByTopic[q.topic].total++;
      if (q.isCorrect) {
        performanceByTopic[q.topic].correct++;
      }
    }
  });

  // Calculate trends over time (simplified)
  const calculateTrends = () => {
    // Group questions by date (simplified: just count per question)
    const trendData = answeredQuestions.reduce((acc: Record<string, number>, question) => {
      const date = question.id; // Using question ID as a placeholder for date
      acc[date] = (acc[date] || 0) + (question.isCorrect ? 1 : 0);
      return acc;
    }, {});

    return Object.entries(trendData).map(([date, correctCount]) => ({
      date,
      correctCount,
    }));
  };

  const trendsData = calculateTrends();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Breakdown
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around">
                    <div>
                      <div className="text-2xl font-bold">{correctAnswers}</div>
                      <div className="text-sm text-muted-foreground">Correct</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{incorrectAnswers}</div>
                      <div className="text-sm text-muted-foreground">Incorrect</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Topic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(performanceByTopic).map(([topic, data]) => (
                    <div key={topic} className="mb-2">
                      <div className="font-medium">{topic}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.correct} / {data.total} correct
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Add the feedback summary */}
            <div className="mt-6">
              <FeedbackSummary />
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {trendsData.length > 0 ? (
                  <ul>
                    {trendsData.map((trend, index) => (
                      <li key={index}>
                        {trend.date}: {trend.correctCount} correct
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No trends available.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {answeredQuestions.map((question) => (
                    <li key={question.id}>
                      Question: {question.id}, Correct: {question.isCorrect ? 'Yes' : 'No'}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
