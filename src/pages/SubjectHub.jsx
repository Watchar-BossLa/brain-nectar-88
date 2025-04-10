import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SubjectSelector, SubjectDashboard } from '@/components/subjects';
import { Search, BookOpen, Star, Clock, TrendingUp, Filter } from 'lucide-react';

/**
 * SubjectHub page that serves as a central location for accessing all subjects
 * @returns {React.ReactElement} SubjectHub page
 */
const SubjectHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample data for featured subjects
  const featuredSubjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      description: 'Explore numbers, equations, functions, and mathematical concepts',
      progress: 65,
      topics: 24,
      lastStudied: '2 days ago'
    },
    {
      id: 'physics',
      name: 'Physics',
      description: 'Study matter, energy, and the fundamental forces of nature',
      progress: 40,
      topics: 18,
      lastStudied: '1 week ago'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      description: 'Learn about substances, their properties, and reactions',
      progress: 30,
      topics: 20,
      lastStudied: '3 days ago'
    },
    {
      id: 'data-science',
      name: 'Data Science',
      description: 'Analyze and interpret complex data using statistical methods',
      progress: 25,
      topics: 15,
      lastStudied: '5 days ago'
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Understand financial markets, investments, and money management',
      progress: 50,
      topics: 22,
      lastStudied: '1 day ago'
    }
  ];
  
  // Sample data for recommended subjects
  const recommendedSubjects = [
    {
      id: 'biology',
      name: 'Biology',
      description: 'Study living organisms and their interactions with each other',
      progress: 0,
      topics: 30,
      lastStudied: null
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      description: 'Learn programming, algorithms, and computational thinking',
      progress: 10,
      topics: 25,
      lastStudied: '2 weeks ago'
    },
    {
      id: 'economics',
      name: 'Economics',
      description: 'Understand how economies work and how resources are allocated',
      progress: 5,
      topics: 20,
      lastStudied: '3 weeks ago'
    }
  ];
  
  // Filter subjects based on search query and active tab
  const getFilteredSubjects = () => {
    let subjects = [];
    
    if (activeTab === 'all' || activeTab === 'featured') {
      subjects = [...subjects, ...featuredSubjects];
    }
    
    if (activeTab === 'all' || activeTab === 'recommended') {
      subjects = [...subjects, ...recommendedSubjects];
    }
    
    if (searchQuery) {
      subjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return subjects;
  };
  
  const filteredSubjects = getFilteredSubjects();
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Subject Hub</h1>
            <p className="text-muted-foreground">
              Explore and study a wide range of subjects with comprehensive resources
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full md:w-[200px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <SubjectSelector />
        
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Subjects</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubjects.map(subject => (
                    <Card key={subject.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{subject.name}</CardTitle>
                        <CardDescription>{subject.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {subject.topics} Topics
                            </Badge>
                            {subject.lastStudied && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {subject.lastStudied}
                              </Badge>
                            )}
                          </div>
                          {subject.progress > 0 && (
                            <Badge className="bg-primary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {subject.progress}% Complete
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">Study Now</Button>
                          <Button variant="outline" className="flex-1">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-4">No subjects found matching your criteria.</p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          
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
        </div>
      </div>
    </MainLayout>
  );
};

export default SubjectHub;
