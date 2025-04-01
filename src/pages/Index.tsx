import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calculator, Clock, FileText, FlaskConical, GraduationCap, LayoutDashboard, Lightbulb, Presentation, Sparkles } from 'lucide-react';
import HomeNavigation from '@/components/layout/HomeNavigation';
import HeroSection from '@/components/landing/HeroSection';
import { useAuth } from '@/context/auth';

export default function Index() {
  let user;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log('Auth not initialized yet, rendering without user data');
    user = null;
  }
  
  return (
    <MainLayout>
      <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b">
        <div className="container py-2">
          <HomeNavigation />
        </div>
      </div>
      
      <div>
        <HeroSection />
        
        <div className="container py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Explore Study Bee</h2>
            <p className="text-xl text-muted-foreground">
              Your adaptive learning platform for mastering accounting qualifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </CardTitle>
                <CardDescription>
                  Track your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View your study statistics, upcoming reviews, and personalized recommendations
                  based on your learning patterns.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Flashcards
                </CardTitle>
                <CardDescription>
                  Spaced repetition learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create and review flashcards with our spaced repetition system to
                  efficiently memorize accounting concepts and definitions.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/flashcards">Study Flashcards</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Qualifications
                </CardTitle>
                <CardDescription>
                  Professional certification paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore structured learning paths for ACCA, CPA, CIMA and other
                  accounting qualifications with tailored study materials.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/qualifications">View Qualifications</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Planner
                </CardTitle>
                <CardDescription>
                  Organize your study schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a personalized study plan based on your exam dates, available
                  study time, and learning priorities.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/study-planner">Plan Your Studies</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5" />
                  Practice Exams
                </CardTitle>
                <CardDescription>
                  Test your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take practice exams with questions similar to those on your actual
                  certification exams to gauge your readiness.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/assessments">Take Practice Exam</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Study Assistant
                </CardTitle>
                <CardDescription>
                  Get personalized help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ask questions, get explanations, and receive guidance from our
                  AI assistant specialized in accounting topics.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/agent-dashboard">Chat with Assistant</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Advanced Learning
                </CardTitle>
                <CardDescription>
                  Interactive learning tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access interactive simulations, case studies, and advanced learning
                  tools to deepen your understanding of complex topics.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/advanced-learning">Explore Advanced Tools</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Accounting Tools
                </CardTitle>
                <CardDescription>
                  Interactive tools for accounting practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize accounting equations and create financial statements 
                  to reinforce your understanding of accounting concepts.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/accounting-tools">Explore Tools</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Community Forum
                </CardTitle>
                <CardDescription>
                  Learn with peers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow accounting students, share study tips, ask questions,
                  and participate in discussions about accounting topics.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="#">Coming Soon</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
