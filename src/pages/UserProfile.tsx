
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SaveIcon, UserIcon, BookOpenIcon, BrainIcon, ClockIcon } from 'lucide-react';

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

interface LearningStats {
  totalFlashcards: number;
  reviewedFlashcards: number;
  masteredFlashcards: number;
  totalStudyTime: number; // in minutes
  averageRetention: number; // percentage
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalFlashcards: 0,
    reviewedFlashcards: 0,
    masteredFlashcards: 0,
    totalStudyTime: 0,
    averageRetention: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfileData(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
        }
        
        // Fetch learning statistics
        await fetchLearningStats();
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const fetchLearningStats = async () => {
    if (!user) return;
    
    try {
      // Count total flashcards
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('id, mastery_level')
        .eq('user_id', user.id);
      
      if (flashcardsError) throw flashcardsError;
      
      // Count reviewed flashcards
      const { count: reviewedCount, error: reviewedError } = await supabase
        .from('flashcard_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (reviewedError) throw reviewedError;
      
      // Get average retention
      const { data: retentionData, error: retentionError } = await supabase
        .from('flashcard_reviews')
        .select('retention_estimate')
        .eq('user_id', user.id);
      
      if (retentionError) throw retentionError;
      
      // Calculate statistics
      const totalFlashcards = flashcardsData?.length || 0;
      const masteredFlashcards = flashcardsData?.filter(card => card.mastery_level >= 0.7).length || 0;
      const totalReviews = reviewedCount || 0;
      
      let averageRetention = 0;
      if (retentionData && retentionData.length > 0) {
        const sum = retentionData.reduce((acc, review) => acc + (review.retention_estimate || 0), 0);
        averageRetention = Math.round((sum / retentionData.length) * 100);
      }
      
      // Update learning stats
      setLearningStats({
        totalFlashcards,
        reviewedFlashcards: totalReviews,
        masteredFlashcards,
        totalStudyTime: totalReviews * 2, // Estimate: 2 minutes per review
        averageRetention,
      });
      
    } catch (error) {
      console.error('Error fetching learning stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          first_name: firstName,
          last_name: lastName,
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <Skeleton className="h-12 w-64 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="learning">Learning Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData?.avatar_url || ''} />
                  <AvatarFallback className="text-2xl">
                    {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {firstName || lastName 
                      ? `${firstName} ${lastName}`.trim() 
                      : 'Study Bee User'}
                  </h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {new Date(profileData?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="col-span-3"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
              <CardDescription>
                Your progress and learning achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpenIcon className="h-5 w-5" />
                      Flashcards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{learningStats.totalFlashcards}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Mastered</p>
                        <p className="text-2xl font-bold">{learningStats.masteredFlashcards}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BrainIcon className="h-5 w-5" />
                      Memory Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Retention</p>
                        <p className="text-2xl font-bold">{learningStats.averageRetention}%</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Reviews</p>
                        <p className="text-2xl font-bold">{learningStats.reviewedFlashcards}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Learning Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {learningStats.totalFlashcards > 0 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      First Flashcard Created
                    </Badge>
                  )}
                  {learningStats.reviewedFlashcards > 0 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Started Learning
                    </Badge>
                  )}
                  {learningStats.reviewedFlashcards > 10 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Consistent Learner
                    </Badge>
                  )}
                  {learningStats.masteredFlashcards > 0 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      First Card Mastered
                    </Badge>
                  )}
                  {learningStats.masteredFlashcards > 10 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Knowledge Builder
                    </Badge>
                  )}
                  {learningStats.averageRetention > 75 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Excellent Memory
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
