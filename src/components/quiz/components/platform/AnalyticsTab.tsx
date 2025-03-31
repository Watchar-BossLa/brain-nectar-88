
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getQuizPerformanceMetrics } from '@/services/quiz/performanceService';
import { getFeedbackData } from '@/services/quiz/feedbackService';
import PerformanceMetrics from '../analytics/PerformanceMetrics';
import PerformanceByTopic from '../analytics/PerformanceByTopic';
import PerformanceByDifficulty from '../analytics/PerformanceByDifficulty';
import FeedbackSummary from '../analytics/FeedbackSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [topicData, setTopicData] = useState<any>(null);
  const [difficultyData, setDifficultyData] = useState<any>(null);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch metrics
        const metrics = await getQuizPerformanceMetrics(user.id);
        setMetricsData(metrics);
        
        // Fetch feedback data
        const feedback = await getFeedbackData();
        setFeedbackData(feedback);
        
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      );
    }
    
    if (!metricsData) {
      return (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-muted-foreground">
              No analytics data available yet. Complete some quizzes to see your performance metrics.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        <TabsContent value="overview" className="space-y-8 pt-4">
          <PerformanceMetrics
            totalQuizzes={metricsData.totalQuizzes}
            averageScore={metricsData.averageScore}
            completionRate={metricsData.completionRate}
            improvementRate={metricsData.improvementRate}
            totalQuestions={metricsData.totalQuestions}
            correctAnswers={metricsData.correctAnswers}
          />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PerformanceByTopic topicStats={topicData} />
            <PerformanceByDifficulty difficultyStats={difficultyData} />
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="pt-4">
          <FeedbackSummary feedbackData={feedbackData || {}} />
        </TabsContent>
        
        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance Trends
                <Badge variant="outline">Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Trend analysis will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        {renderTabContent()}
      </Tabs>
    </div>
  );
}

export default AnalyticsTab;
