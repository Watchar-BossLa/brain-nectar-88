import React, { useState, useEffect } from 'react';
import { useAICoachProfile, useAICoachSession } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import { 
  CoachProfileCard, 
  CoachChatInterface, 
  LearningGoalsList, 
  StudyPlanCard, 
  LearningInsightsCard,
  LearningStyleAssessment
} from '@/components/ai-coach';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Brain, 
  Target, 
  Calendar,
  Lightbulb,
  MessageSquare,
  Loader2
} from 'lucide-react';

/**
 * AI Study Coach page component
 * @returns {React.ReactElement} AIStudyCoach page
 */
const AIStudyCoach = () => {
  const { user } = useAuth();
  const aiCoachProfile = useAICoachProfile();
  const aiCoachSession = useAICoachSession();
  
  const [activeTab, setActiveTab] = useState('coach');
  const [loading, setLoading] = useState(true);
  const [sessionType, setSessionType] = useState('general');
  
  // Initialize services
  useEffect(() => {
    if (!user) return;
    
    const initializeServices = async () => {
      try {
        setLoading(true);
        
        // Initialize services
        await aiCoachProfile.initialize(user.id);
        await aiCoachSession.initialize(user.id);
      } catch (error) {
        console.error('Error initializing services:', error);
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize AI coach services',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeServices();
  }, [user, aiCoachProfile, aiCoachSession]);
  
  // Handle session type change
  const handleSessionTypeChange = (type) => {
    setSessionType(type);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">AI Study Coach</h1>
            <p className="text-muted-foreground">
              Your personalized learning assistant and study coach
            </p>
          </div>
          
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">Initializing AI coach...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <CoachProfileCard />
                <LearningStyleAssessment />
              </div>
              
              <div className="md:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="coach" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Coach</span>
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="hidden sm:inline">Goals</span>
                    </TabsTrigger>
                    <TabsTrigger value="plans" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Plans</span>
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">Insights</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="coach">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Chat with Your Coach</CardTitle>
                          <CardDescription>
                            Get personalized guidance and support for your learning journey
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Button
                              variant={sessionType === 'general' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSessionTypeChange('general')}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              General
                            </Button>
                            <Button
                              variant={sessionType === 'goal_setting' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSessionTypeChange('goal_setting')}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Goal Setting
                            </Button>
                            <Button
                              variant={sessionType === 'study_planning' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSessionTypeChange('study_planning')}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Study Planning
                            </Button>
                            <Button
                              variant={sessionType === 'motivation' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSessionTypeChange('motivation')}
                            >
                              <Brain className="h-4 w-4 mr-2" />
                              Motivation
                            </Button>
                            <Button
                              variant={sessionType === 'learning_strategy' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSessionTypeChange('learning_strategy')}
                            >
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Learning Strategies
                            </Button>
                          </div>
                          
                          <CoachChatInterface sessionType={sessionType} />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="goals">
                    <LearningGoalsList />
                  </TabsContent>
                  
                  <TabsContent value="plans">
                    <StudyPlanCard />
                  </TabsContent>
                  
                  <TabsContent value="insights">
                    <LearningInsightsCard />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">AI Coach Tips</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your AI Study Coach adapts to your learning style and goals. Set clear goals, create personalized study plans, and get insights to optimize your learning journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIStudyCoach;
