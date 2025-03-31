
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth';
import { getUserPerformanceStats, getPerformanceByDifficulty } from '@/services/quiz/performanceService';
import { getFeedbackStats } from '@/services/quiz/feedbackService';
import PerformanceMetrics from '../analytics/PerformanceMetrics';
import PerformanceByTopic from '../analytics/PerformanceByTopic';
import PerformanceByDifficulty from '../analytics/PerformanceByDifficulty';
import { Loader2 } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [topicData, setTopicData] = useState<Record<string, { total: number; correct: number }>>({});
  const [difficultyData, setDifficultyData] = useState<any>(null);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get performance statistics
        const performanceStats = await getUserPerformanceStats(user.id);
        setPerformanceData(performanceStats);
        
        // Transform topic performance data
        const topicStats: Record<string, { total: number; correct: number }> = {};
        Object.entries(performanceStats.topicPerformance).forEach(([topic, data]: [string, any]) => {
          topicStats[topic] = {
            total: data.totalCount || 0,
            correct: data.correctCount || 0
          };
        });
        setTopicData(topicStats);
        
        // Get difficulty performance
        const difficultyStats = await getPerformanceByDifficulty(user.id);
        setDifficultyData(difficultyStats);
        
        // Get feedback statistics
        const feedbackStats = await getFeedbackStats();
        setFeedbackData(feedbackStats);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your quiz performance analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-center mb-4">No quiz data available yet.</p>
          <Button>Try a Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PerformanceMetrics
        averageScore={performanceData.averageScore}
        totalSessions={performanceData.totalSessions}
        improvementRate={performanceData.improvementRate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PerformanceByTopic 
          topicStats={topicData} 
        />
        
        <PerformanceByDifficulty 
          difficultyStats={difficultyData}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Sessions</CardTitle>
          <CardDescription>Your most recent quiz attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {performanceData.recentSessions.length > 0 ? (
            <div className="space-y-4">
              {performanceData.recentSessions.map((session: any) => (
                <div key={session.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">
                      Score: {session.score_percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No recent quiz sessions found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
