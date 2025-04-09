import React, { useState, useEffect } from 'react';
import { useSpacedRepetition, useAdaptiveAlgorithm } from '@/services/spaced-repetition';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart2, 
  Calendar, 
  Clock, 
  Brain,
  Loader2,
  TrendingUp,
  Tag,
  Zap
} from 'lucide-react';

/**
 * Learning Insights Component
 * Displays insights and analytics about the user's learning patterns
 * @returns {React.ReactElement} Learning insights component
 */
const LearningInsights = () => {
  const { user } = useAuth();
  const spacedRepetition = useSpacedRepetition();
  const adaptiveAlgorithm = useAdaptiveAlgorithm();
  
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load insights
  useEffect(() => {
    if (!user) return;
    
    const loadInsights = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!spacedRepetition.initialized) {
          await spacedRepetition.initialize(user.id);
        }
        
        if (!adaptiveAlgorithm.initialized) {
          await adaptiveAlgorithm.initialize(user.id);
        }
        
        // Get learning insights
        const analysis = await adaptiveAlgorithm.analyzeLearningPatterns(user.id);
        
        // Get review stats
        const reviewStats = await spacedRepetition.getReviewStats(user.id);
        
        // Get upcoming reviews
        const upcomingReviews = await spacedRepetition.getUpcomingItems(user.id, 7);
        
        // Combine data
        setInsights({
          analysis,
          reviewStats,
          upcomingReviews
        });
      } catch (error) {
        console.error('Error loading insights:', error);
        toast({
          title: 'Error',
          description: 'Failed to load learning insights',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInsights();
  }, [user, spacedRepetition, adaptiveAlgorithm]);
  
  // Handle refresh insights
  const handleRefreshInsights = async () => {
    if (!user) return;
    
    try {
      setAnalyzing(true);
      
      // Get learning insights
      const analysis = await adaptiveAlgorithm.analyzeLearningPatterns(user.id);
      
      // Get review stats
      const reviewStats = await spacedRepetition.getReviewStats(user.id);
      
      // Get upcoming reviews
      const upcomingReviews = await spacedRepetition.getUpcomingItems(user.id, 7);
      
      // Combine data
      setInsights({
        analysis,
        reviewStats,
        upcomingReviews
      });
      
      toast({
        title: 'Insights Updated',
        description: 'Your learning insights have been refreshed',
      });
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast({
        title: 'Refresh Failed',
        description: error.message || 'An error occurred while refreshing insights',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render if no insights
  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
          <CardDescription>
            Analyze your learning patterns and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start reviewing cards to generate learning insights.
            </p>
            <Button onClick={handleRefreshInsights} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Refresh Insights'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Extract data
  const { analysis, reviewStats, upcomingReviews } = insights;
  
  // Calculate review forecast
  const reviewForecast = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dateStr = date.toISOString().split('T')[0];
    const count = upcomingReviews.filter(item => {
      const reviewDate = new Date(item.next_review_date);
      return reviewDate.toISOString().split('T')[0] === dateStr;
    }).length;
    
    reviewForecast.push({
      date: dateStr,
      count
    });
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Learning Insights</CardTitle>
          <CardDescription>
            Analyze your learning patterns and performance
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshInsights}
          disabled={analyzing}
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Patterns</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Performance Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Retention Rate</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {analysis.retentionRate ? Math.round(analysis.retentionRate * 100) : 0}%
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Ease Factor</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {analysis.averageEaseFactor ? analysis.averageEaseFactor.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
              
              {/* Review Stats */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Review Activity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="text-xl font-bold">{reviewStats?.today || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                    <p className="text-xl font-bold">{reviewStats?.thisWeek || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{reviewStats?.total || 0}</p>
                  </div>
                </div>
              </div>
              
              {/* Difficult Tags */}
              {analysis.difficultTags && analysis.difficultTags.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Challenging Topics</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.difficultTags.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-destructive/10 text-destructive px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Optimal Review Times */}
              {analysis.optimalReviewTimes && analysis.optimalReviewTimes.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Optimal Review Times</h3>
                  </div>
                  <div className="space-y-2">
                    {analysis.optimalReviewTimes.map((time, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">
                          {time.hour}:00
                        </span>
                        <div className="w-2/3 bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-2" 
                            style={{ width: `${time.performance * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(time.performance * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="forecast">
            <div className="space-y-4">
              {/* Review Forecast */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">7-Day Review Forecast</h3>
                <div className="space-y-3">
                  {reviewForecast.map((day, index) => {
                    const date = new Date(day.date);
                    const isToday = date.toDateString() === today.toDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    return (
                      <div key={index} className="flex items-center">
                        <div className={`w-20 text-sm ${isToday ? 'font-bold' : ''}`}>
                          {isToday ? 'Today' : dayName}
                          <span className="text-xs text-muted-foreground ml-1">
                            {dateStr}
                          </span>
                        </div>
                        <div className="flex-1 ml-2">
                          <div className="w-full bg-muted h-6 rounded-md overflow-hidden relative">
                            <div 
                              className={`h-6 ${isToday ? 'bg-primary' : 'bg-primary/70'}`}
                              style={{ width: `${Math.min(100, (day.count / 20) * 100)}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs">
                              {day.count} cards
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Upcoming Reviews */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Upcoming Reviews by Category</h3>
                {upcomingReviews.length > 0 ? (
                  <div className="space-y-3">
                    {/* Group by source/category */}
                    {Object.entries(
                      upcomingReviews.reduce((acc, item) => {
                        const source = item.source || 'Uncategorized';
                        if (!acc[source]) acc[source] = 0;
                        acc[source]++;
                        return acc;
                      }, {})
                    ).map(([source, count], index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{source}</span>
                        <div className="w-2/3 bg-muted h-4 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary/70 h-4" 
                            style={{ width: `${Math.min(100, (count / upcomingReviews.length) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {count} cards
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming reviews in the next 7 days
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns">
            <div className="space-y-4">
              {/* Learning Efficiency */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Learning Efficiency</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Retention vs Target */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Retention Rate</span>
                      <span>
                        {analysis.retentionRate ? Math.round(analysis.retentionRate * 100) : 0}% / 
                        {analysis.recommendedSettings?.settings_data?.retention_target ? 
                          Math.round(analysis.recommendedSettings.settings_data.retention_target * 100) : 90}%
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 ${
                          analysis.retentionRate >= (analysis.recommendedSettings?.settings_data?.retention_target || 0.9) 
                            ? 'bg-green-500' 
                            : 'bg-amber-500'
                        }`}
                        style={{ 
                          width: `${analysis.retentionRate ? Math.round(analysis.retentionRate * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Review Efficiency */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Review Efficiency</span>
                      <span>
                        {analysis.averageEaseFactor ? 
                          Math.round((analysis.averageEaseFactor / 2.5) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2"
                        style={{ 
                          width: `${analysis.averageEaseFactor ? 
                            Math.round((analysis.averageEaseFactor / 2.5) * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Learning Recommendations */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Personalized Recommendations</h3>
                <div className="space-y-3">
                  {analysis.retentionRate < 0.8 && (
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-500/10 p-1 rounded">
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Improve Retention</p>
                        <p className="text-xs text-muted-foreground">
                          Your retention rate is below target. Consider reviewing more frequently 
                          or focusing on smaller chunks of information.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analysis.difficultTags && analysis.difficultTags.length > 0 && (
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-500/10 p-1 rounded">
                        <Tag className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Focus on Challenging Topics</p>
                        <p className="text-xs text-muted-foreground">
                          You're finding topics like {analysis.difficultTags.slice(0, 2).join(', ')} challenging. 
                          Consider creating more focused study materials on these topics.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analysis.optimalReviewTimes && analysis.optimalReviewTimes.length > 0 && (
                    <div className="flex items-start gap-2">
                      <div className="bg-green-500/10 p-1 rounded">
                        <Clock className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Optimize Review Times</p>
                        <p className="text-xs text-muted-foreground">
                          Your optimal review time is around {
                            analysis.optimalReviewTimes.sort((a, b) => b.performance - a.performance)[0].hour
                          }:00. Try to schedule your study sessions during this time for better results.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {reviewStats && reviewStats.today < 10 && (
                    <div className="flex items-start gap-2">
                      <div className="bg-purple-500/10 p-1 rounded">
                        <Calendar className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Maintain Consistency</p>
                        <p className="text-xs text-muted-foreground">
                          You've only reviewed {reviewStats.today} cards today. 
                          Regular, consistent review is key to long-term retention.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningInsights;
