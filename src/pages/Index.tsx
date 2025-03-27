
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calculator, 
  FileText, 
  BrainCircuit, 
  Layers, 
  BarChart3,
  FlaskConical
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-4">Study Bee</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Your adaptive learning platform for mastering accounting qualifications and professional certifications
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-primary/20">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Flashcards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Advanced Flashcards
              </CardTitle>
              <CardDescription>
                Create and review flashcards with spaced repetition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our spaced repetition system optimizes your learning by showing cards at the perfect time for maximum retention. Support for text, math formulas, and financial statements.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/flashcards">Start Learning</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feature 2: Accounting Equation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Accounting Equation
              </CardTitle>
              <CardDescription>
                Interactive accounting equation visualizer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore the fundamental accounting equation (Assets = Liabilities + Equity) with our interactive visualization tool. See how transactions affect the equation in real-time.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/advanced-learning">Explore</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feature 3: Financial Statements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Financial Statements
              </CardTitle>
              <CardDescription>
                Create and analyze financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create balance sheets, income statements, and cash flow statements. Practice building and analyzing financial reports to prepare for your exams.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/financial-tools">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feature 4: Adaptive Quiz */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                Adaptive Quiz Platform
              </CardTitle>
              <CardDescription>
                Test your knowledge with adaptive difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our adaptive quiz system adjusts question difficulty based on your performance, ensuring you're always challenged at the right level for optimal learning.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/quiz">Take a Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feature 5: AI Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                AI Learning Agents
              </CardTitle>
              <CardDescription>
                Advanced AI system that adapts to your learning style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our multi-agent AI system analyzes your learning patterns and creates personalized study recommendations tailored to your unique cognitive profile.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/agent-dashboard">View Agents</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feature 6: Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Learning Analytics
              </CardTitle>
              <CardDescription>
                Track your progress and identify areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics help you understand your strengths and weaknesses, allowing you to focus your study time on areas that need the most attention.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Study Bee | Adaptive Learning Platform for Accounting Qualifications
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
