
import MainLayout from '@/components/layout/MainLayout';
import UserProfileCard from '@/components/profile/UserProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import { getFlashcardLearningStats } from '@/services/spacedRepetition';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [learningStats, setLearningStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const stats = await getFlashcardLearningStats(user.id);
        setLearningStats(stats);
      } catch (err) {
        console.error('Error fetching learning stats:', err);
        toast({
          title: 'Error',
          description: 'Could not load your learning statistics',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user, toast]);

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your learning progress
          </p>
        </div>
        
        <UserProfileCard />
        
        <Tabs defaultValue="learning-stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learning-stats">Learning Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="learning-stats" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spaced Repetition Performance</CardTitle>
                <CardDescription>
                  Your flashcard learning statistics and mastery metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {learningStats?.totalReviews || 0}
                      </h3>
                      <p className="text-sm text-muted-foreground">Total Reviews</p>
                    </div>
                    
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {Math.round((learningStats?.retentionRate || 0) * 100)}%
                      </h3>
                      <p className="text-sm text-muted-foreground">Retention Rate</p>
                    </div>
                    
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {learningStats?.masteredCardCount || 0}
                      </h3>
                      <p className="text-sm text-muted-foreground">Mastered Cards</p>
                    </div>
                    
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {Math.round((learningStats?.averageEaseFactor || 0) * 100) / 100}
                      </h3>
                      <p className="text-sm text-muted-foreground">Ease Factor</p>
                    </div>
                    
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {Math.round((learningStats?.learningEfficiency || 0) * 100)}%
                      </h3>
                      <p className="text-sm text-muted-foreground">Learning Efficiency</p>
                    </div>
                    
                    <div className="space-y-1 text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {learningStats?.recommendedDailyReviews || 0}
                      </h3>
                      <p className="text-sm text-muted-foreground">Recommended Daily</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Achievements</CardTitle>
                <CardDescription>
                  Track your learning milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="font-medium">No achievements yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Continue learning to earn achievements and track your progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account-settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="font-medium">Settings coming soon</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Account settings and preferences will be available in a future update
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
