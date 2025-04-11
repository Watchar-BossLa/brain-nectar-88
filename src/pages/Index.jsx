
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import Navbar from '@/components/layout/Navbar';
import MainLayout from '@/components/layout/MainLayout';
import {
  BookOpen,
  GraduationCap,
  BarChart2,
  Calculator,
  Brain,
  Camera,
  FileText,
  Network,
  Users,
  Glasses
} from 'lucide-react';

/**
 * Home page component
 * @returns {React.ReactElement} Home page component
 */
const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Subject Hub",
      description: "Explore and study a wide range of subjects",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      path: "/subject-hub"
    },
    {
      title: "Flashcards",
      description: "Create and study with adaptive flashcards",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      path: "/flashcards"
    },
    {
      title: "Quiz",
      description: "Test your knowledge with adaptive quizzes",
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      path: "/quiz"
    },
    {
      title: "Visual Recognition",
      description: "Capture and process handwritten notes and equations",
      icon: <Camera className="h-10 w-10 text-primary" />,
      path: "/visual-recognition"
    },
    {
      title: "Document Analysis",
      description: "Extract insights from study documents",
      icon: <FileText className="h-10 w-10 text-primary" />,
      path: "/document-analysis"
    },
    {
      title: "Knowledge Graph",
      description: "Visualize connections between concepts",
      icon: <Network className="h-10 w-10 text-primary" />,
      path: "/knowledge-visualization"
    },
    {
      title: "Advanced Learning",
      description: "Personalized learning paths",
      icon: <Brain className="h-10 w-10 text-primary" />,
      path: "/advanced-learning"
    },
    {
      title: "Collaborative Learning",
      description: "Study with peers in real-time",
      icon: <Users className="h-10 w-10 text-primary" />,
      path: "/collaborative-learning"
    },
    {
      title: "Augmented Reality Study",
      description: "Immersive 3D learning spaces",
      icon: <Glasses className="h-10 w-10 text-primary" />,
      path: "/augmented-reality-study"
    },
    {
      title: "Financial Tools",
      description: "Finance and accounting calculators",
      icon: <Calculator className="h-10 w-10 text-primary" />,
      path: "/financial-tools"
    },
    {
      title: "Dashboard",
      description: "Track your learning progress",
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
      path: "/dashboard"
    }
  ];

  return (
    <>
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
              Welcome to StudyBee
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your intelligent learning platform with advanced AI features to enhance your study experience.
            </p>
            {!user ? (
              <div className="flex justify-center gap-4">
                <Link to="/sign-up">
                  <Button size="lg" className="text-lg px-8">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8">Log In</Button>
                </Link>
              </div>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">Go to Dashboard</Button>
              </Link>
            )}
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Link key={index} to={feature.path}>
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader>
                      <div className="mb-4 flex justify-center">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="outline">Explore</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to boost your learning?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join StudyBee today and experience the future of education with our AI-powered learning platform.
            </p>
            {!user ? (
              <Link to="/sign-up">
                <Button size="lg" className="text-lg px-8">Sign Up Now</Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">Go to Dashboard</Button>
              </Link>
            )}
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Index;
