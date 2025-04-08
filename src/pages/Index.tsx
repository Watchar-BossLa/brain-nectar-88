
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, BookType, Brain, Calculator, Clock, Camera } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

/**
 * Landing page component for StudyBee
 * @returns {React.ReactElement} Index page component
 */
const Index = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Welcome to StudyBee
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your adaptive learning platform for accounting qualifications and beyond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Flashcards</h2>
                  <p className="text-muted-foreground">Study with spaced repetition</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/flashcards">
                  <Button className="w-full">Study Flashcards</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookType className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Qualifications</h2>
                  <p className="text-muted-foreground">Browse qualification paths</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/qualifications">
                  <Button className="w-full">Explore Qualifications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Financial Tools</h2>
                  <p className="text-muted-foreground">Use accounting calculators</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/financial-tools">
                  <Button className="w-full">Open Tools</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Quiz</h2>
                  <p className="text-muted-foreground">Test your knowledge</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/quiz">
                  <Button className="w-full">Take a Quiz</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Study Timer</h2>
                  <p className="text-muted-foreground">Track your study sessions</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/study-timer">
                  <Button className="w-full">Start Timer</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Visual Recognition</h2>
                  <p className="text-muted-foreground">Capture handwritten content</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/visual-recognition">
                  <Button className="w-full">Open Camera</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
