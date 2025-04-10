import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Function, PieChart, Ruler, Sigma, Infinity } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import GraphingCalculator from '@/components/mathematics/graphing-calculator/GraphingCalculator';

/**
 * Mathematics page component
 * @returns {React.ReactElement} Mathematics page component
 */
const Mathematics = () => {
  const [showGraphingCalculator, setShowGraphingCalculator] = useState(false);
  
  const openGraphingCalculator = () => {
    setShowGraphingCalculator(true);
  };
  
  const closeGraphingCalculator = () => {
    setShowGraphingCalculator(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mathematics</h1>
            <p className="text-muted-foreground">
              Explore numbers, equations, functions, and mathematical concepts
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SubjectDashboard 
              subject="Mathematics" 
              description="Explore numbers, equations, functions, and mathematical concepts"
              progress={65}
              topics={[
                {
                  title: "Calculus",
                  description: "Differential and integral calculus",
                  status: "completed",
                  subtopics: [
                    { title: "Limits and Continuity", completed: true },
                    { title: "Derivatives", completed: true },
                    { title: "Integrals", completed: true },
                    { title: "Applications of Calculus", completed: true }
                  ]
                },
                {
                  title: "Linear Algebra",
                  description: "Vectors, matrices, and linear transformations",
                  status: "in_progress",
                  subtopics: [
                    { title: "Vectors and Vector Spaces", completed: true },
                    { title: "Matrices and Linear Transformations", completed: true },
                    { title: "Eigenvalues and Eigenvectors", completed: false },
                    { title: "Applications of Linear Algebra", completed: false }
                  ]
                },
                {
                  title: "Statistics",
                  description: "Data analysis and probability",
                  status: "not_started",
                  subtopics: [
                    { title: "Descriptive Statistics", completed: false },
                    { title: "Probability", completed: false },
                    { title: "Statistical Inference", completed: false },
                    { title: "Regression Analysis", completed: false }
                  ]
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sigma className="h-5 w-5 text-primary" />
                    <CardTitle>Calculus</CardTitle>
                  </div>
                  <CardDescription>
                    Differential and integral calculus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Limits and Continuity</li>
                    <li>Derivatives and Applications</li>
                    <li>Integrals and Applications</li>
                    <li>Differential Equations</li>
                    <li>Multivariable Calculus</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Function className="h-5 w-5 text-primary" />
                    <CardTitle>Linear Algebra</CardTitle>
                  </div>
                  <CardDescription>
                    Vectors, matrices, and linear transformations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Vectors and Vector Spaces</li>
                    <li>Matrices and Linear Transformations</li>
                    <li>Determinants and Inverses</li>
                    <li>Eigenvalues and Eigenvectors</li>
                    <li>Applications of Linear Algebra</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <CardTitle>Statistics</CardTitle>
                  </div>
                  <CardDescription>
                    Data analysis and probability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Descriptive Statistics</li>
                    <li>Probability Theory</li>
                    <li>Random Variables and Distributions</li>
                    <li>Statistical Inference</li>
                    <li>Regression Analysis</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <CardTitle>Geometry</CardTitle>
                  </div>
                  <CardDescription>
                    Study of shapes, sizes, and properties of space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Euclidean Geometry</li>
                    <li>Coordinate Geometry</li>
                    <li>Transformations</li>
                    <li>Non-Euclidean Geometry</li>
                    <li>Differential Geometry</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Infinity className="h-5 w-5 text-primary" />
                    <CardTitle>Number Theory</CardTitle>
                  </div>
                  <CardDescription>
                    Properties and relationships of numbers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Divisibility and Primes</li>
                    <li>Congruences</li>
                    <li>Diophantine Equations</li>
                    <li>Algebraic Number Theory</li>
                    <li>Analytic Number Theory</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle>Applied Mathematics</CardTitle>
                  </div>
                  <CardDescription>
                    Mathematical methods applied to real-world problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Mathematical Modeling</li>
                    <li>Numerical Analysis</li>
                    <li>Optimization</li>
                    <li>Dynamical Systems</li>
                    <li>Financial Mathematics</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Graphing Calculator</CardTitle>
                  <CardDescription>
                    Plot and analyze mathematical functions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Calculator className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plot functions, analyze graphs, find intersections, and more with our interactive graphing calculator.
                  </p>
                  <Button 
                    onClick={openGraphingCalculator}
                    className="w-full"
                  >
                    Launch Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Matrix Calculator</CardTitle>
                  <CardDescription>
                    Perform operations on matrices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Function className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add, subtract, multiply matrices, find determinants, inverses, eigenvalues, and more.
                  </p>
                  <Button className="w-full">Launch Calculator</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Statistics Tool</CardTitle>
                  <CardDescription>
                    Analyze data and perform statistical tests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <PieChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calculate descriptive statistics, perform hypothesis tests, regression analysis, and more.
                  </p>
                  <Button className="w-full">Launch Tool</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Textbooks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Calculus: Early Transcendentals (James Stewart)</li>
                      <li>Linear Algebra and Its Applications (David C. Lay)</li>
                      <li>Introduction to Probability and Statistics (Mendenhall, Beaver, Beaver)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>MIT OpenCourseWare: Single Variable Calculus</li>
                      <li>Khan Academy: Linear Algebra</li>
                      <li>Coursera: Statistics with R</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>3Blue1Brown: Essence of Calculus</li>
                      <li>Professor Leonard: Calculus Series</li>
                      <li>PatrickJMT: Math Tutorials</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Practice Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Problem Sets</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Calculus Problem Set (100 problems)</li>
                      <li>Linear Algebra Exercises (75 problems)</li>
                      <li>Statistics Practice Problems (50 problems)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Practice Exams</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Calculus Midterm Exam</li>
                      <li>Linear Algebra Final Exam</li>
                      <li>Statistics Comprehensive Exam</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Interactive Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Derivative Practice Tool</li>
                      <li>Matrix Operations Trainer</li>
                      <li>Probability Simulator</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Mathematics" />
        </div>
        
        {/* Graphing Calculator Modal */}
        {showGraphingCalculator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Graphing Calculator</h2>
                  <Button variant="ghost" onClick={closeGraphingCalculator}>
                    ✕
                  </Button>
                </div>
                <GraphingCalculator />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Mathematics;
