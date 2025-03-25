
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { MultiAgentSystem } from '@/services/agents';
import MainLayout from '@/components/layout/MainLayout';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecommendedStudy from '@/components/dashboard/RecommendedStudy';
import DailyStudyGoal from '@/components/dashboard/DailyStudyGoal';
import FlashcardReviewSystem from '@/components/flashcards/FlashcardReviewSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { user } = useAuth();

  // Initialize multi-agent system when user is authenticated
  useEffect(() => {
    if (user) {
      MultiAgentSystem.initialize(user.id)
        .then(() => {
          console.log('Multi-agent system initialized for user:', user.id);
        })
        .catch((error) => {
          console.error('Failed to initialize multi-agent system:', error);
        });
    }
  }, [user]);

  return (
    <MainLayout>
      <WelcomeHeader />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <StatsOverview />
        <DailyStudyGoal />
        <RecommendedStudy />
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flashcards">Due Flashcards</TabsTrigger>
            <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flashcards" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Flashcard Review</CardTitle>
                <CardDescription>
                  Review your due flashcards with spaced repetition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlashcardReviewSystem />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learning-path" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Path</CardTitle>
                <CardDescription>
                  Personalized adaptive learning path based on your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Explore your personalized learning path to master your qualifications efficiently.
                </p>
                <Button asChild className="mt-2">
                  <Link to="/qualifications">View Your Learning Path</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Study Materials</CardTitle>
            <CardDescription>
              Create flashcards, notes and more
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button asChild>
              <Link to="/flashcards">Manage Flashcards</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Your Knowledge</CardTitle>
            <CardDescription>
              Take assessments and quizzes to gauge your understanding
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button asChild>
              <Link to="/quiz">Take a Quiz</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/assessments">View Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
