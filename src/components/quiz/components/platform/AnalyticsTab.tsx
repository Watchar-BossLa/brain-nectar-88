
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Zap, Lightbulb } from 'lucide-react';
import { AnalyticsTabProps } from '../../types/platform-types';
import { useQuizAnalytics } from '../../hooks/useQuizAnalytics';
import { 
  PerformanceOverTimeChart, 
  TopicMasteryChart, 
  DifficultyCategoryChart, 
  ConfidenceAccuracyChart, 
  AnalyticsSummary 
} from '../analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ answeredQuestions, setActiveTab }) => {
  // Use the new analytics hook
  const { analyticsData, isLoading } = useQuizAnalytics(answeredQuestions);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Your Performance Analytics
        </CardTitle>
        <CardDescription>
          Track your progress and identify areas for improvement
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : analyticsData.overallStats.totalQuestions === 0 ? (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground py-12">
              {answeredQuestions.length > 0 ? (
                "Complete more quizzes to see detailed analytics here."
              ) : (
                "You haven't taken any quizzes yet. Start a quiz to see your analytics."
              )}
            </p>
            
            <div className="flex justify-center">
              <Button onClick={() => setActiveTab("quiz")} className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Take a Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <AnalyticsSummary 
              overallStats={analyticsData.overallStats}
              recentPerformance={analyticsData.recentQuestionsPerformance}
            />
            
            <div className="bg-accent/20 p-4 rounded-lg border border-accent flex items-start space-x-3">
              <div className="bg-accent/30 p-2 rounded-full">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Personalized Learning Insight</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {analyticsData.recentQuestionsPerformance.lastFiveAccuracy > analyticsData.overallStats.averageScore
                    ? "You're improving! Your recent performance is better than your overall average."
                    : "Focus on reviewing topics where your accuracy is below 70% for maximum improvement."}
                  {analyticsData.overallStats.worstTopic !== 'None' && ` Consider focusing more on ${analyticsData.overallStats.worstTopic}.`}
                </p>
              </div>
            </div>
            
            {/* Detailed analytics */}
            <Tabs defaultValue="performance">
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
                <TabsTrigger value="confidence">Confidence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <PerformanceOverTimeChart data={analyticsData.performanceOverTime} />
              </TabsContent>
              
              <TabsContent value="topics">
                <TopicMasteryChart data={analyticsData.topicMastery} />
              </TabsContent>
              
              <TabsContent value="difficulty">
                <DifficultyCategoryChart data={analyticsData.difficultyPerformance} />
              </TabsContent>
              
              <TabsContent value="confidence">
                <ConfidenceAccuracyChart data={analyticsData.confidenceAccuracy} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
