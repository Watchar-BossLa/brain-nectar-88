
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { PerformanceMetrics } from '../metrics/PerformanceMetrics';
import { getPerformanceByDifficulty } from '@/services/quiz/performanceService';
import { supabase } from '@/lib/supabase';

export const AnalyticsTab = ({ userId }: { userId: string }) => {
  const [performanceData, setPerformanceData] = useState({
    byDifficulty: {
      easy: { correct: 0, total: 0, accuracy: 0 },
      medium: { correct: 0, total: 0, accuracy: 0 },
      hard: { correct: 0, total: 0, accuracy: 0 }
    },
    byTopic: [],
    overall: {
      correct: 0,
      total: 0,
      accuracy: 0
    }
  });
  
  const [metrics, setMetrics] = useState({
    averageScore: 0,
    totalQuestions: 0,
    improvementRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Get performance by difficulty
        const difficultyData = await getPerformanceByDifficulty(userId);
        
        // Get overall metrics
        const { data: sessions } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
        
        const totalSessions = sessions?.length || 0;
        const totalQuestions = sessions?.reduce((sum, session) => sum + (session.total_questions || 0), 0) || 0;
        const totalCorrect = sessions?.reduce((sum, session) => sum + (session.correct_answers || 0), 0) || 0;
        
        // Calculate improvement rate (compare last 3 sessions with previous 3)
        let improvementRate = 0;
        
        if (sessions && sessions.length >= 6) {
          const recent3 = sessions.slice(0, 3);
          const previous3 = sessions.slice(3, 6);
          
          const recentAvg = recent3.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / 3;
          const previousAvg = previous3.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / 3;
          
          improvementRate = ((recentAvg - previousAvg) / previousAvg) * 100;
        }
        
        setPerformanceData({
          byDifficulty: difficultyData,
          byTopic: [],
          overall: {
            correct: totalCorrect,
            total: totalQuestions,
            accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
          }
        });
        
        setMetrics({
          averageScore: totalSessions > 0 
            ? sessions.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / totalSessions 
            : 0,
          totalQuestions,
          improvementRate
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <div className="space-y-8">
      <PerformanceMetrics 
        averageScore={metrics.averageScore} 
        totalQuestions={metrics.totalQuestions} 
        improvementRate={metrics.improvementRate} 
      />
      
      <Tabs defaultValue="difficulty">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
          <TabsTrigger value="topics">By Topic</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="difficulty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty Level</CardTitle>
              <CardDescription>
                How you perform across different difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={[
                  { name: 'Easy', value: performanceData.byDifficulty.easy.accuracy },
                  { name: 'Medium', value: performanceData.byDifficulty.medium.accuracy },
                  { name: 'Hard', value: performanceData.byDifficulty.hard.accuracy }
                ]}
                xAxisKey="name"
                yAxisKey="value"
                height={300}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics">
          {/* Content for topics tab */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Topic</CardTitle>
              <CardDescription>
                Your accuracy across different accounting topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Topic analytics will be available after completing more quizzes
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          {/* Content for progress tab */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your quiz performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Progress analytics will be available after completing more quizzes
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
