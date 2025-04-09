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
  const [learningStats, setLearningStats] = useState(null);
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
        
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <UserProfileCard user={user} />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learning">Learning Stats</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>
                    Your account information and summary
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-base">{user?.email || 'Not available'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                      <p className="text-base">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString() 
                          : 'Not available'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="learning" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>
                    Your learning progress and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Flashcards</h3>
                        <p className="text-2xl font-bold">{learningStats?.totalCards || 0}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Cards Mastered</h3>
                        <p className="text-2xl font-bold">{learningStats?.masteredCards || 0}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Review Streak</h3>
                        <p className="text-2xl font-bold">{learningStats?.streak || 0} days</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Account settings will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
