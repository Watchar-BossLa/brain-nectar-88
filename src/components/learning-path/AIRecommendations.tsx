
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { useAuth } from '@/context/auth';
import { Brain, BookOpen, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AIRecommendations = () => {
  const { user } = useAuth();
  const { isInitialized, getAgentStatuses } = useMultiAgentSystem();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, we would fetch recommendations from the agent system
    // For now, we'll simulate a delay and use mock data
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecommendations({
        topicRecommendations: [
          {
            id: 'topic-2',
            title: 'Double-Entry Bookkeeping',
            priority: 'high',
            reason: 'Current mastery is below target',
            currentMastery: 60,
            moduleName: 'Financial Accounting'
          },
          {
            id: 'topic-5',
            title: 'Break-Even Analysis',
            priority: 'medium',
            reason: 'Important foundation for upcoming content',
            currentMastery: 0,
            moduleName: 'Management Accounting'
          },
          {
            id: 'topic-3',
            title: 'Financial Statements',
            priority: 'medium',
            reason: 'Builds on recently completed topics',
            currentMastery: 0,
            moduleName: 'Financial Accounting'
          }
        ],
        learningInsights: {
          optimalStudyTime: 'Morning (8-10am)',
          retentionRate: 68,
          studyStreak: 5,
          recommendedPomodoroLength: 25,
          focusAreas: ['Practical exercises', 'Spaced repetition review'],
          weaknessPatterns: ['Calculation-based questions', 'Standard terminology']
        },
        personalizedTips: [
          {
            title: 'Improve retention with active recall',
            description: 'Based on your learning patterns, try using active recall techniques after each study session'
          },
          {
            title: 'Focus on management accounting concepts',
            description: 'Your profile shows a knowledge gap in cost allocation techniques'
          },
          {
            title: 'Try morning study sessions',
            description: 'Your historical data indicates better retention during morning hours'
          }
        ]
      });
      
      setLoading(false);
    };
    
    fetchRecommendations();
  }, []);
  
  // Check if the agent system is initialized
  const agentStatuses = getAgentStatuses();
  const allAgentsReady = Array.from(agentStatuses.values()).every(status => status);
  
  if (!isInitialized() || !allAgentsReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Learning Agents
          </CardTitle>
          <CardDescription>
            Personalized recommendations powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto text-primary/50 animate-pulse mb-4" />
            <h3 className="text-xl font-medium mb-2">AI System Initializing</h3>
            <p className="text-muted-foreground mb-4">
              Learning agents are analyzing your study patterns and preferences
            </p>
            <Progress value={65} className="max-w-md mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return <AIRecommendationsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personalized AI Recommendations
          </CardTitle>
          <CardDescription>
            Smart learning suggestions based on your progress and learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="priorityTopics">
            <TabsList className="mb-4">
              <TabsTrigger value="priorityTopics">Priority Topics</TabsTrigger>
              <TabsTrigger value="insights">Learning Insights</TabsTrigger>
              <TabsTrigger value="tips">Personalized Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="priorityTopics">
              <div className="space-y-4">
                {recommendations?.topicRecommendations.map((topic: any) => (
                  <div key={topic.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{topic.title}</h3>
                          <PriorityBadge priority={topic.priority} />
                        </div>
                        <p className="text-sm text-muted-foreground">{topic.moduleName}</p>
                      </div>
                      <Button size="sm">Study Now</Button>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Current Mastery</span>
                        <span>{topic.currentMastery}%</span>
                      </div>
                      <Progress value={topic.currentMastery} className="h-1.5" />
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                      <p>{topic.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Optimal Study Time</h3>
                      <p className="text-lg">{recommendations?.learningInsights.optimalStudyTime}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your past learning patterns, you tend to retain information better during this time frame.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Retention Rate</h3>
                      <p className="text-lg">{recommendations?.learningInsights.retentionRate}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your average information retention from recent learning sessions.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="font-medium mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendations?.learningInsights.focusAreas.map((area: string, index: number) => (
                      <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="font-medium mb-3">Improvement Opportunities</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {recommendations?.learningInsights.weaknessPatterns.map((pattern: string, index: number) => (
                      <li key={index}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tips">
              <div className="space-y-4">
                {recommendations?.personalizedTips.map((tip: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 mt-1">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getColor = () => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${getColor()}`}>
      {priority}
    </span>
  );
};

// Skeleton loading state
const AIRecommendationsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-64 mb-6" />
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
