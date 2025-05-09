import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/context/auth';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import CoursesSection from '@/components/dashboard/CoursesSection';
import AssessmentsRecommendedSection from '@/components/dashboard/AssessmentsRecommendedSection';
import DailyStudyGoal from '@/components/dashboard/DailyStudyGoal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-8">
        <WelcomeHeader />
        <StatsOverview />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/study-material-generator">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Generate Study Materials</span>
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="learning-path">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
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
            </TabsList>

            <TabsContent value="learning-path">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-lg py-8">
                      Your personalized learning journey is being prepared.
                    </p>
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

            <TabsContent value="achievements">
              <Card className="mt-6">
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

            <TabsContent value="schedule">
              <Card className="mt-6">
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
          </Tabs>
        </div>

        <CoursesSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AssessmentsRecommendedSection />
          <DailyStudyGoal />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
