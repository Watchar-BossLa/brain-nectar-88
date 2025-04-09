import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useLearningProfile, useRecommendations } from '@/services/learning-recommendations';
import { RecommendationList, LearningStyleAssessment, TopicSelector } from '@/components/learning-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Sparkles, 
  BrainCircuit, 
  Tag, 
  Target, 
  BarChart, 
  BookOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';

/**
 * Learning Recommendations Page
 * @returns {React.ReactElement} Learning recommendations page
 */
const LearningRecommendations = () => {
  const { user } = useAuth();
  const learningProfile = useLearningProfile();
  const recommendations = useRecommendations();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // Load user profile
  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Initialize services
        if (!learningProfile.initialized) {
          await learningProfile.initialize(user.id);
        }
        
        if (!recommendations.initialized) {
          await recommendations.initialize(user.id);
        }
        
        // Get user profile
        const userProfile = await learningProfile.getProfile();
        setProfile(userProfile);
        
        // Check if assessment needed
        if (!userProfile.learning_style || !userProfile.profile_data?.lastAssessment) {
          setShowAssessment(true);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your learning profile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, learningProfile, recommendations]);
  
  // Handle assessment completion
  const handleAssessmentComplete = (results) => {
    setShowAssessment(false);
    
    // Update profile with assessment results
    setProfile(prev => ({
      ...prev,
      learning_style: results.scores,
      profile_data: {
        ...prev.profile_data,
        lastAssessment: results.completedAt,
        dominantStyle: results.dominantStyle
      }
    }));
    
    // Generate new recommendations
    handleGenerateRecommendations();
  };
  
  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Get updated profile
      const updatedProfile = await learningProfile.getProfile();
      setProfile(updatedProfile);
      
      // Generate new recommendations
      handleGenerateRecommendations();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  // Handle generate recommendations
  const handleGenerateRecommendations = async () => {
    try {
      await recommendations.generateRecommendations();
      
      toast({
        title: 'Recommendations Generated',
        description: 'New personalized recommendations are ready',
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations',
        variant: 'destructive'
      });
    }
  };
  
  // Handle view content
  const handleViewContent = (content) => {
    // In a real implementation, this would navigate to the content
    // or open it in a modal/viewer
    toast({
      title: 'Content Selected',
      description: `You selected: ${content.title}`,
    });
  };
  
  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-full max-w-md" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Render assessment if needed
  if (showAssessment) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-3xl">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Learning Style Assessment</h1>
              <p className="text-muted-foreground">
                Let's discover your learning style to provide better recommendations
              </p>
            </div>
            
            <LearningStyleAssessment onComplete={handleAssessmentComplete} />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Calculate profile completeness
  const profileCompleteness = profile?.profile_data?.completeness || 0;
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Recommendations</h1>
            <p className="text-muted-foreground">
              Personalized content recommendations based on your learning profile
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Recommendations</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Learning Insights</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendations">
                  <RecommendationList onViewContent={handleViewContent} />
                </TabsContent>
                
                <TabsContent value="insights">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Insights</CardTitle>
                      <CardDescription>
                        Analytics and insights about your learning patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Learning Analytics</h3>
                        <p className="text-muted-foreground mb-4">
                          This feature is coming soon!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              {/* Profile Completeness */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile Completeness</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completion</span>
                      <span>{Math.round(profileCompleteness * 100)}%</span>
                    </div>
                    <Progress value={profileCompleteness * 100} className="h-2" />
                  </div>
                  
                  {profileCompleteness < 1 && (
                    <div className="rounded-lg border p-3 text-sm">
                      <h4 className="font-medium mb-1">Complete Your Profile</h4>
                      <p className="text-muted-foreground mb-2">
                        Enhance your recommendations by completing your profile
                      </p>
                      <ul className="space-y-1 text-xs">
                        {(!profile.learning_style || Object.keys(profile.learning_style).length === 0) && (
                          <li className="flex items-center">
                            <BrainCircuit className="h-3 w-3 mr-1 text-muted-foreground" />
                            Take the learning style assessment
                          </li>
                        )}
                        {(!profile.topics || profile.topics.length === 0) && (
                          <li className="flex items-center">
                            <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                            Add topics of interest
                          </li>
                        )}
                        {(!profile.goals || profile.goals.length === 0) && (
                          <li className="flex items-center">
                            <Target className="h-3 w-3 mr-1 text-muted-foreground" />
                            Set learning goals
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Learning Style */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2" />
                    Learning Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.learning_style && Object.keys(profile.learning_style).length > 0 ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <h3 className="font-medium capitalize mb-1">
                          {profile.profile_data?.dominantStyle || 'Balanced'} Learner
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Last assessed: {new Date(profile.profile_data?.lastAssessment).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {Object.entries(profile.learning_style).map(([style, score]) => (
                        <div key={style} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{style}</span>
                            <span>{Math.round(score * 100)}%</span>
                          </div>
                          <Progress value={score * 100} className="h-1.5" />
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowAssessment(true)}
                      >
                        Retake Assessment
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <BrainCircuit className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Take the learning style assessment to get personalized recommendations
                      </p>
                      <Button 
                        onClick={() => setShowAssessment(true)}
                        className="w-full"
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Topics of Interest */}
              <TopicSelector 
                userTopics={profile.topics || []} 
                onUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningRecommendations;
