import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Server, Database, Network, Lock, Cpu, BrainCircuit } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';

/**
 * ComputerScience page component
 * @returns {React.ReactElement} ComputerScience page component
 */
const ComputerScience = () => {
  const [showAlgorithmVisualizer, setShowAlgorithmVisualizer] = useState(false);
  
  const openAlgorithmVisualizer = () => {
    setShowAlgorithmVisualizer(true);
  };
  
  const closeAlgorithmVisualizer = () => {
    setShowAlgorithmVisualizer(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Computer Science</h1>
            <p className="text-muted-foreground">
              Learn programming, algorithms, and computational thinking
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
              subject="Computer Science" 
              description="Learn programming, algorithms, and computational thinking"
              progress={35}
              topics={[
                {
                  title: "Programming Fundamentals",
                  description: "Basic programming concepts and languages",
                  status: "completed",
                  subtopics: [
                    { title: "Variables and Data Types", completed: true },
                    { title: "Control Structures", completed: true },
                    { title: "Functions and Methods", completed: true },
                    { title: "Object-Oriented Programming", completed: true }
                  ]
                },
                {
                  title: "Data Structures and Algorithms",
                  description: "Efficient data organization and problem-solving",
                  status: "in_progress",
                  subtopics: [
                    { title: "Arrays and Linked Lists", completed: true },
                    { title: "Stacks and Queues", completed: true },
                    { title: "Trees and Graphs", completed: false },
                    { title: "Sorting and Searching", completed: false }
                  ]
                },
                {
                  title: "Computer Systems",
                  description: "Hardware, operating systems, and networks",
                  status: "not_started",
                  subtopics: [
                    { title: "Computer Architecture", completed: false },
                    { title: "Operating Systems", completed: false },
                    { title: "Computer Networks", completed: false },
                    { title: "Distributed Systems", completed: false }
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
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>Programming Fundamentals</CardTitle>
                  </div>
                  <CardDescription>
                    Basic programming concepts and languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Variables and Data Types</li>
                    <li>Control Structures</li>
                    <li>Functions and Methods</li>
                    <li>Object-Oriented Programming</li>
                    <li>Functional Programming</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <CardTitle>Data Structures and Algorithms</CardTitle>
                  </div>
                  <CardDescription>
                    Efficient data organization and problem-solving
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Arrays and Linked Lists</li>
                    <li>Stacks and Queues</li>
                    <li>
                      Sorting and Searching
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openAlgorithmVisualizer}
                      >
                        Visualize
                      </Button>
                    </li>
                    <li>Trees and Graphs</li>
                    <li>Algorithm Analysis</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <CardTitle>Computer Systems</CardTitle>
                  </div>
                  <CardDescription>
                    Hardware, operating systems, and networks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Computer Architecture</li>
                    <li>Operating Systems</li>
                    <li>Computer Networks</li>
                    <li>Distributed Systems</li>
                    <li>Cloud Computing</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Databases</CardTitle>
                  </div>
                  <CardDescription>
                    Data storage, retrieval, and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Relational Databases</li>
                    <li>SQL</li>
                    <li>Database Design</li>
                    <li>NoSQL Databases</li>
                    <li>Data Warehousing</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Cybersecurity</CardTitle>
                  </div>
                  <CardDescription>
                    Protecting systems, networks, and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Cryptography</li>
                    <li>Network Security</li>
                    <li>Web Security</li>
                    <li>Ethical Hacking</li>
                    <li>Security Policies</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle>Artificial Intelligence</CardTitle>
                  </div>
                  <CardDescription>
                    Creating intelligent systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Machine Learning</li>
                    <li>Neural Networks</li>
                    <li>Natural Language Processing</li>
                    <li>Computer Vision</li>
                    <li>Robotics</li>
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
                  <CardTitle>Algorithm Visualizer</CardTitle>
                  <CardDescription>
                    Visualize algorithms in action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Server className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visualize sorting algorithms, graph algorithms, and other common algorithms to understand how they work.
                  </p>
                  <Button 
                    onClick={openAlgorithmVisualizer}
                    className="w-full"
                  >
                    Launch Visualizer
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Code Playground</CardTitle>
                  <CardDescription>
                    Write and run code in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Code className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Write and run code in multiple programming languages, test algorithms, and solve programming challenges.
                  </p>
                  <Button className="w-full">Launch Playground</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Network Simulator</CardTitle>
                  <CardDescription>
                    Simulate computer networks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Network className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Design and simulate computer networks, understand protocols, and troubleshoot network issues.
                  </p>
                  <Button className="w-full">Launch Simulator</Button>
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
                      <li>Introduction to Algorithms (Cormen, Leiserson, Rivest, Stein)</li>
                      <li>Computer Systems: A Programmer's Perspective (Bryant, O'Hallaron)</li>
                      <li>Artificial Intelligence: A Modern Approach (Russell, Norvig)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Algorithms Specialization (Stanford)</li>
                      <li>edX: CS50's Introduction to Computer Science (Harvard)</li>
                      <li>Udacity: Data Structures and Algorithms Nanodegree</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>MIT OpenCourseWare: Introduction to Algorithms</li>
                      <li>Computerphile</li>
                      <li>The Coding Train</li>
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
                    <h3 className="text-sm font-medium">Coding Challenges</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>LeetCode</li>
                      <li>HackerRank</li>
                      <li>CodeSignal</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Web Development Projects</li>
                      <li>Data Structure Implementations</li>
                      <li>Algorithm Visualizations</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Competitions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>ACM International Collegiate Programming Contest</li>
                      <li>Google Code Jam</li>
                      <li>Facebook Hacker Cup</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Computer Science" />
        </div>
        
        {/* Algorithm Visualizer Modal */}
        {showAlgorithmVisualizer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Algorithm Visualizer</h2>
                  <Button variant="ghost" onClick={closeAlgorithmVisualizer}>
                    ✕
                  </Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p>Algorithm Visualizer component will be implemented here.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ComputerScience;
