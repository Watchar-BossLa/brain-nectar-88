import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import { getQuizPerformanceMetrics } from '@/services/quiz/performanceService';
import { getFeedbackData } from '@/services/quiz/feedbackService';
import PerformanceMetrics from '../analytics/PerformanceMetrics';
import PerformanceByTopic from '../analytics/PerformanceByTopic';
import PerformanceByDifficulty from '../analytics/PerformanceByDifficulty';
import FeedbackSummary from '../analytics/FeedbackSummary';
import { Loader2, BarChart3, MessageSquare, BookOpen } from 'lucide-react';
import { QuestionFeedback } from '../results/types';

const AnalyticsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [topicPerformance, setTopicPerformance] = useState<Record<string, { total: number; correct: number }>>({});
  const [difficultyPerformance, setDifficultyPerformance] = useState<Record<number, { total: number; correct: number }>>({});
  const [feedbackData, setFeedbackData] = useState<QuestionFeedback[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch performance metrics
        const metricsData = await getQuizPerformanceMetrics(user.id);
        setMetrics(metricsData);
        
        // Extract topic and difficulty performance
        const topicData: Record<string, { total: number; correct: number }> = {};
        const difficultyData: Record<number, { total: number; correct: number }> = {};
        
        metricsData.forEach((metric: any) => {
          if (metric.topic) {
            topicData[metric.topic] = {
              total: metric.total_count,
              correct: metric.correct_count
            };
          }
          
          // Aggregate by difficulty
          if (metric.questions) {
            metric.questions.forEach((q: any) => {
              if (!difficultyData[q.difficulty]) {
                difficultyData[q.difficulty] = { total: 0, correct: 0 };
              }
              difficultyData[q.difficulty].total += 1;
              if (q.is_correct) {
                difficultyData[q.difficulty].correct += 1;
              }
            });
          }
        });
        
        setTopicPerformance(topicData);
        setDifficultyPerformance(difficultyData);
        
        // Fetch feedback data
        const feedback = await getFeedbackData();
        setFeedbackData(feedback);
        
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading analytics data...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics metrics={metrics} />
          <PerformanceByDifficulty difficultyStats={difficultyPerformance} />
        </TabsContent>
        
        <TabsContent value="topics" className="space-y-4">
          <PerformanceByTopic topicStats={topicPerformance} />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSummary feedbackData={feedbackData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AnalyticsTab;
