import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calculator, Clock, FlaskConical, GraduationCap, LayoutDashboard, Lightbulb, Presentation, Sparkles } from 'lucide-react';
import HomeNavigation from '@/components/layout/HomeNavigation';
import HeroSection from '@/components/landing/HeroSection';
import { useAuth } from '@/context/auth';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth = useAuth();
        setUserData(auth.user);
      } catch (error) {
        // Use a proper logging service in production
        if (process.env.NODE_ENV !== 'production') {
          console.error('Auth initialization error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // You can customize content based on auth status
  const isAuthenticated = !!userData;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
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
            <FeatureCard
              icon={<LayoutDashboard className="h-5 w-5" />}
              title="Dashboard"
              description="Track your learning progress"
              content="View your study statistics, upcoming reviews, and personalized recommendations based on your learning patterns."
              linkTo="/dashboard"
              linkText="Go to Dashboard"
            />

            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Flashcards"
              description="Spaced repetition learning"
              content="Create and review flashcards with our spaced repetition system to efficiently memorize accounting concepts and definitions."
              linkTo="/flashcards"
              linkText="Study Flashcards"
            />

            <FeatureCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="Qualifications"
              description="Professional certification paths"
              content="Explore structured learning paths for ACCA, CPA, CIMA and other accounting qualifications with tailored study materials."
              linkTo="/qualifications"
              linkText="View Qualifications"
            />

            <FeatureCard
              icon={<Clock className="h-5 w-5" />}
              title="Study Planner"
              description="Organize your study schedule"
              content="Create a personalized study plan based on your exam dates, available study time, and learning priorities."
              linkTo="/study-planner"
              linkText="Plan Your Studies"
            />

            <FeatureCard
              icon={<Presentation className="h-5 w-5" />}
              title="Practice Exams"
              description="Test your knowledge"
              content="Take practice exams with questions similar to those on your actual certification exams to gauge your readiness."
              linkTo="/assessments"
              linkText="Take Practice Exam"
            />

            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Study Assistant"
              description="Get personalized help"
              content="Ask questions, get explanations, and receive guidance from our AI assistant specialized in accounting topics."
              linkTo="/agent-dashboard"
              linkText="Chat with Assistant"
            />

            <FeatureCard
              icon={<FlaskConical className="h-5 w-5" />}
              title="Advanced Learning"
              description="Interactive learning tools"
              content="Access interactive simulations, case studies, and advanced learning tools to deepen your understanding of complex topics."
              linkTo="/advanced-learning"
              linkText="Explore Advanced Tools"
            />

            <FeatureCard
              icon={<Calculator className="h-5 w-5" />}
              title="Accounting Tools"
              description="Interactive tools for accounting practice"
              content="Visualize accounting equations and create financial statements to reinforce your understanding of accounting concepts."
              linkTo="/accounting-tools"
              linkText="Explore Tools"
            />

            <FeatureCard
              icon={<Lightbulb className="h-5 w-5" />}
              title="Community Forum"
              description="Learn with peers"
              content="Connect with fellow accounting students, share study tips, ask questions, and participate in discussions about accounting topics."
              linkTo="/community"
              linkText="Coming Soon"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Extract card component to improve reusability and maintainability
function FeatureCard({ icon, title, description, content, linkTo, linkText, disabled = false }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {content}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          className="w-full" 
          variant={disabled ? "outline" : "default"}
          disabled={disabled}
        >
          <Link to={linkTo} aria-disabled={disabled}>
            {linkText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
