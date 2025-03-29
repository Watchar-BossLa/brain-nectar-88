
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, Calendar, BarChart2 } from 'lucide-react';
import StatsOverview from '@/components/dashboard/StatsOverview';
import AssessmentsRecommendedSection from '@/components/dashboard/AssessmentsRecommendedSection';
import CoursesSection from '@/components/dashboard/CoursesSection';
import DailyStudyGoal from '@/components/dashboard/DailyStudyGoal';
import { getFlashcardStats } from '@/services/spacedRepetition';
import { FlashcardStats } from '@/types/flashcard';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [flashcardStats, setFlashcardStats] = useState<FlashcardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const stats = await getFlashcardStats(user.id);
        setFlashcardStats(stats);
      } catch (error) {
        console.error('Error fetching flashcard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-8">
        <motion.div 
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.email?.split('@')[0] || 'Student'}</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey
          </p>
        </motion.div>

        <StatsOverview />
        
        <DailyStudyGoal />
        
        <AssessmentsRecommendedSection />
        
        <Tabs defaultValue="learning-path" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="learning-path" className="flex gap-2 items-center justify-center">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learning Path</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex gap-2 items-center justify-center">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex gap-2 items-center justify-center">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex gap-2 items-center justify-center">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning-path" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ) : (
                    <p className="text-center text-lg py-8">
                      Your personalized learning journey is being prepared.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Complete Introduction Module</p>
                        <p className="text-sm text-muted-foreground">Foundation concepts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Take Assessment Quiz</p>
                        <p className="text-sm text-muted-foreground">Check your understanding</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-lg py-8">
                  Complete learning activities to earn achievements.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-lg py-8">
                  Your personalized study schedule will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  </div>
                ) : flashcardStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Total Cards</p>
                      <p className="text-2xl font-bold">{flashcardStats.totalCards}</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Mastered</p>
                      <p className="text-2xl font-bold text-green-600">{flashcardStats.masteredCards}</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Due for Review</p>
                      <p className="text-2xl font-bold text-amber-600">{flashcardStats.dueCards}</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Reviews Today</p>
                      <p className="text-2xl font-bold text-blue-600">{flashcardStats.reviewsToday}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-lg py-8">
                    Start creating flashcards to see your analytics.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <CoursesSection />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
