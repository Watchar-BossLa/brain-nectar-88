import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, BookOpen, BrainCircuit, Function, PieChart } from 'lucide-react';

const Mathematics = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Function className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mathematics Learning Center</h1>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Explore mathematical concepts through interactive tools, visualizations, and adaptive learning. 
          From algebra and calculus to statistics and discrete mathematics, enhance your understanding with 
          our comprehensive resources.
        </p>
        
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
            <TabsTrigger value="practice">Practice Problems</TabsTrigger>
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Algebra */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Algebra
                  </CardTitle>
                  <CardDescription>Equations, functions, and algebraic structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Linear Equations & Inequalities</li>
                    <li>Quadratic Functions</li>
                    <li>Polynomial & Rational Functions</li>
                    <li>Systems of Equations</li>
                    <li>Matrices & Determinants</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Calculus */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Calculus
                  </CardTitle>
                  <CardDescription>Limits, derivatives, and integrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Limits & Continuity</li>
                    <li>Differentiation & Applications</li>
                    <li>Integration Techniques</li>
                    <li>Differential Equations</li>
                    <li>Multivariable Calculus</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Statistics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Statistics & Probability
                  </CardTitle>
                  <CardDescription>Data analysis and probability theory</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Descriptive Statistics</li>
                    <li>Probability Distributions</li>
                    <li>Hypothesis Testing</li>
                    <li>Regression Analysis</li>
                    <li>Bayesian Statistics</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Geometry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Geometry
                  </CardTitle>
                  <CardDescription>Shapes, spaces, and transformations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Euclidean Geometry</li>
                    <li>Coordinate Geometry</li>
                    <li>Transformations</li>
                    <li>Vector Geometry</li>
                    <li>Non-Euclidean Geometry</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Discrete Mathematics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Discrete Mathematics
                  </CardTitle>
                  <CardDescription>Logic, sets, and combinatorics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Logic & Proof Techniques</li>
                    <li>Set Theory</li>
                    <li>Combinatorics</li>
                    <li>Graph Theory</li>
                    <li>Number Theory</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Applied Mathematics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Applied Mathematics
                  </CardTitle>
                  <CardDescription>Mathematical methods in science and engineering</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Numerical Methods</li>
                    <li>Optimization</li>
                    <li>Differential Equations</li>
                    <li>Mathematical Modeling</li>
                    <li>Computational Mathematics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Graphing Calculator</CardTitle>
                  <CardDescription>Plot functions and analyze their properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our interactive graphing calculator allows you to visualize functions, 
                    find intersections, calculate derivatives, and more.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Calculator
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Matrix Operations</CardTitle>
                  <CardDescription>Perform calculations with matrices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add, subtract, multiply matrices, calculate determinants, 
                    find eigenvalues, and perform other matrix operations.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Matrix Tool
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Statistical Analysis</CardTitle>
                  <CardDescription>Analyze datasets and perform statistical tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Calculate descriptive statistics, create visualizations, 
                    perform hypothesis tests, and analyze correlations.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Statistics Tool
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Equation Solver</CardTitle>
                  <CardDescription>Solve various types of equations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Solve linear, quadratic, polynomial, and systems of equations 
                    with step-by-step explanations.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Equation Solver
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="practice">
            <Card>
              <CardHeader>
                <CardTitle>Adaptive Practice Problems</CardTitle>
                <CardDescription>
                  Practice problems that adapt to your skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our adaptive learning system adjusts the difficulty of problems based on your performance, 
                  helping you focus on areas that need improvement while challenging you appropriately.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Skill Assessment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Take a diagnostic test to identify your strengths and weaknesses
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Personalized Practice
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get problems tailored to your skill level and learning goals
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Progress Tracking
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your improvement and identify areas for further study
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md">
                    Start Practicing
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualizations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Function Visualizer</CardTitle>
                  <CardDescription>Explore three-dimensional functions and surfaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize multivariable functions, parametric surfaces, and vector fields 
                    in an interactive 3D environment.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open 3D Visualizer
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Geometric Transformations</CardTitle>
                  <CardDescription>Visualize transformations in 2D and 3D space</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore rotations, reflections, translations, and other transformations 
                    with interactive visualizations.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Transformation Tool
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Probability Simulations</CardTitle>
                  <CardDescription>Visualize probability concepts through simulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Run simulations for various probability distributions, random processes, 
                    and statistical concepts to build intuition.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Probability Simulator
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fractal Explorer</CardTitle>
                  <CardDescription>Explore the fascinating world of fractals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate and interact with various fractals, including the Mandelbrot set, 
                    Julia sets, and other complex mathematical patterns.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Open Fractal Explorer
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Mathematics;
