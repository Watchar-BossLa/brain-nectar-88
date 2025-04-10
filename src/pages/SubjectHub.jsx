import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Function, 
  Atom, 
  Flask, 
  BarChart, 
  DollarSign, 
  Code, 
  Microscope, 
  BookOpen,
  GraduationCap,
  Globe,
  Landmark,
  Lightbulb,
  Search,
  TrendingUp,
  Clock,
  Star,
  BookMarked
} from 'lucide-react';
import { KnowledgeGraph } from '@/components/subjects';

/**
 * SubjectHub page component
 * @returns {React.ReactElement} SubjectHub page component
 */
const SubjectHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Subject data
  const subjects = [
    { 
      id: 'mathematics', 
      name: 'Mathematics', 
      description: 'Explore numbers, equations, functions, and mathematical concepts',
      icon: <Function className="h-10 w-10" />,
      route: '/mathematics',
      color: 'bg-blue-500',
      progress: 65,
      topics: ['Calculus', 'Linear Algebra', 'Statistics', 'Geometry', 'Number Theory'],
      category: 'stem'
    },
    { 
      id: 'physics', 
      name: 'Physics', 
      description: 'Study matter, energy, and the fundamental forces of nature',
      icon: <Atom className="h-10 w-10" />,
      route: '/physics',
      color: 'bg-orange-500',
      progress: 40,
      topics: ['Mechanics', 'Electromagnetism', 'Thermodynamics', 'Quantum Physics', 'Relativity'],
      category: 'stem'
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      description: 'Learn about substances, their properties, and reactions',
      icon: <Flask className="h-10 w-10" />,
      route: '/chemistry',
      color: 'bg-green-500',
      progress: 30,
      topics: ['Atomic Structure', 'Chemical Bonding', 'Thermochemistry', 'Organic Chemistry', 'Biochemistry'],
      category: 'stem'
    },
    { 
      id: 'biology', 
      name: 'Biology', 
      description: 'Study living organisms and their interactions with each other',
      icon: <Microscope className="h-10 w-10" />,
      route: '/biology',
      color: 'bg-emerald-500',
      progress: 20,
      topics: ['Cell Biology', 'Genetics', 'Ecology', 'Physiology', 'Evolution'],
      category: 'stem'
    },
    { 
      id: 'data-science', 
      name: 'Data Science', 
      description: 'Analyze and interpret complex data using statistical methods',
      icon: <BarChart className="h-10 w-10" />,
      route: '/data-science',
      color: 'bg-cyan-500',
      progress: 25,
      topics: ['Data Analysis', 'Machine Learning', 'Big Data', 'Data Visualization', 'Statistical Inference'],
      category: 'stem'
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      description: 'Understand financial markets, investments, and money management',
      icon: <DollarSign className="h-10 w-10" />,
      route: '/finance',
      color: 'bg-indigo-500',
      progress: 50,
      topics: ['Financial Markets', 'Investment Management', 'Corporate Finance', 'Financial Analysis', 'Risk Management'],
      category: 'business'
    },
    { 
      id: 'computer-science', 
      name: 'Computer Science', 
      description: 'Learn programming, algorithms, and computational thinking',
      icon: <Code className="h-10 w-10" />,
      route: '/computer-science',
      color: 'bg-pink-500',
      progress: 35,
      topics: ['Programming', 'Data Structures', 'Algorithms', 'Computer Systems', 'Artificial Intelligence'],
      category: 'stem'
    },
    { 
      id: 'literature', 
      name: 'Literature', 
      description: 'Explore literary works, analysis, and critical thinking',
      icon: <BookOpen className="h-10 w-10" />,
      route: '/literature',
      color: 'bg-purple-500',
      progress: 15,
      topics: ['Fiction', 'Poetry', 'Drama', 'Literary Analysis', 'World Literature'],
      category: 'humanities'
    },
    { 
      id: 'history', 
      name: 'History', 
      description: 'Study past events, civilizations, and their impact on the present',
      icon: <Landmark className="h-10 w-10" />,
      route: '/history',
      color: 'bg-amber-500',
      progress: 10,
      topics: ['Ancient History', 'Medieval History', 'Modern History', 'World Wars', 'Cultural History'],
      category: 'humanities'
    },
    { 
      id: 'geography', 
      name: 'Geography', 
      description: 'Understand the Earth\'s features, inhabitants, and phenomena',
      icon: <Globe className="h-10 w-10" />,
      route: '/geography',
      color: 'bg-teal-500',
      progress: 5,
      topics: ['Physical Geography', 'Human Geography', 'Cartography', 'Climate', 'Geopolitics'],
      category: 'social-sciences'
    },
    { 
      id: 'psychology', 
      name: 'Psychology', 
      description: 'Explore the human mind, behavior, and mental processes',
      icon: <Lightbulb className="h-10 w-10" />,
      route: '/psychology',
      color: 'bg-rose-500',
      progress: 0,
      topics: ['Cognitive Psychology', 'Developmental Psychology', 'Social Psychology', 'Clinical Psychology', 'Neuroscience'],
      category: 'social-sciences'
    },
    { 
      id: 'education', 
      name: 'Education', 
      description: 'Study teaching methods, learning theories, and educational systems',
      icon: <GraduationCap className="h-10 w-10" />,
      route: '/education',
      color: 'bg-yellow-500',
      progress: 0,
      topics: ['Learning Theories', 'Curriculum Development', 'Educational Psychology', 'Assessment', 'Educational Technology'],
      category: 'social-sciences'
    }
  ];
  
  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get subjects by category
  const stemSubjects = subjects.filter(subject => subject.category === 'stem');
  const humanitiesSubjects = subjects.filter(subject => subject.category === 'humanities');
  const socialSciencesSubjects = subjects.filter(subject => subject.category === 'social-sciences');
  const businessSubjects = subjects.filter(subject => subject.category === 'business');
  
  // Get subjects by progress
  const inProgressSubjects = subjects.filter(subject => subject.progress > 0).sort((a, b) => b.progress - a.progress);
  const notStartedSubjects = subjects.filter(subject => subject.progress === 0);
  
  // Sample concept connections data for the knowledge graph
  const conceptConnections = {
    mathematics: [
      {
        concept: 'Calculus',
        relatedTo: [
          { subject: 'physics', concept: 'Kinematics', description: 'Calculus is used to describe motion in physics' },
          { subject: 'economics', concept: 'Marginal Analysis', description: 'Derivatives are used to analyze marginal costs and benefits' },
          { subject: 'data-science', concept: 'Optimization Algorithms', description: 'Calculus is used in gradient descent and other optimization methods' }
        ]
      },
      {
        concept: 'Linear Algebra',
        relatedTo: [
          { subject: 'computer-science', concept: 'Computer Graphics', description: 'Matrices are used for transformations in 3D graphics' },
          { subject: 'data-science', concept: 'Machine Learning', description: 'Linear algebra is fundamental to many ML algorithms' },
          { subject: 'physics', concept: 'Quantum Mechanics', description: 'Linear operators represent observables in quantum systems' }
        ]
      }
    ],
    physics: [
      {
        concept: 'Mechanics',
        relatedTo: [
          { subject: 'mathematics', concept: 'Calculus', description: 'Calculus is used to describe motion in physics' },
          { subject: 'engineering', concept: 'Structural Analysis', description: 'Mechanical principles are applied in structural engineering' },
          { subject: 'biology', concept: 'Biomechanics', description: 'Mechanical principles explain how organisms move' }
        ]
      }
    ],
    chemistry: [
      {
        concept: 'Chemical Bonding',
        relatedTo: [
          { subject: 'physics', concept: 'Electromagnetism', description: 'Electromagnetic forces govern chemical bonds' },
          { subject: 'biology', concept: 'Protein Structure', description: 'Chemical bonds determine protein folding and function' },
          { subject: 'materials-science', concept: 'Polymer Science', description: 'Chemical bonding determines polymer properties' }
        ]
      }
    ]
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Subject Hub</h1>
            <p className="text-muted-foreground">
              Explore and study a wide range of subjects
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Search Results for "{searchQuery}"</h2>
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-12">
                <BookMarked className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No subjects found</h3>
                <p className="text-muted-foreground">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Subjects</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="stem">STEM</TabsTrigger>
              <TabsTrigger value="humanities">Humanities</TabsTrigger>
              <TabsTrigger value="social-sciences">Social Sciences</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="connections">Subject Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressSubjects.map(subject => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
                
                {notStartedSubjects.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mt-8">Not Started</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notStartedSubjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="stem">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stemSubjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="humanities">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {humanitiesSubjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="social-sciences">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialSciencesSubjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="business">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessSubjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="connections">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Explore how concepts connect across different subjects with our interactive knowledge graph.
                </p>
                <KnowledgeGraph 
                  currentSubject="Subject Hub" 
                  conceptConnections={conceptConnections} 
                />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Connected Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        <li className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">1.</span>
                            <Function className="h-5 w-5 text-blue-500" />
                            <span>Mathematics</span>
                          </div>
                          <Badge>24 connections</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">2.</span>
                            <Atom className="h-5 w-5 text-orange-500" />
                            <span>Physics</span>
                          </div>
                          <Badge>18 connections</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">3.</span>
                            <BarChart className="h-5 w-5 text-cyan-500" />
                            <span>Data Science</span>
                          </div>
                          <Badge>15 connections</Badge>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Strongest Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Function className="h-5 w-5 text-blue-500" />
                          <span>Mathematics</span>
                          <ArrowIcon />
                          <Atom className="h-5 w-5 text-orange-500" />
                          <span>Physics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-cyan-500" />
                          <span>Data Science</span>
                          <ArrowIcon />
                          <Function className="h-5 w-5 text-blue-500" />
                          <span>Mathematics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Flask className="h-5 w-5 text-green-500" />
                          <span>Chemistry</span>
                          <ArrowIcon />
                          <Microscope className="h-5 w-5 text-emerald-500" />
                          <span>Biology</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Interdisciplinary Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Bioinformatics</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="bg-emerald-500/10">Biology</Badge>
                            <Badge variant="outline" className="bg-pink-500/10">CS</Badge>
                          </div>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Econometrics</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="bg-indigo-500/10">Economics</Badge>
                            <Badge variant="outline" className="bg-blue-500/10">Math</Badge>
                          </div>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Quantum Computing</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="bg-orange-500/10">Physics</Badge>
                            <Badge variant="outline" className="bg-pink-500/10">CS</Badge>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Why Study Multiple Subjects?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-3`}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">Develop Transferable Skills</h3>
              <p className="text-sm text-muted-foreground">
                Skills learned in one subject often apply to others, enhancing your overall capabilities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-3`}>
                <Network className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">Make Interdisciplinary Connections</h3>
              <p className="text-sm text-muted-foreground">
                The most innovative ideas often emerge at the intersection of different fields.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-3`}>
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">Become a Well-Rounded Learner</h3>
              <p className="text-sm text-muted-foreground">
                Diverse knowledge helps you approach problems from multiple perspectives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Subject card component
const SubjectCard = ({ subject }) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${subject.color}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <span className={`text-${subject.color.split('-')[1]}-500`}>
              {subject.icon}
            </span>
            <span>{subject.name}</span>
          </CardTitle>
          {subject.progress > 0 && (
            <Badge variant="outline">
              {subject.progress}% Complete
            </Badge>
          )}
        </div>
        <CardDescription>{subject.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {subject.progress > 0 && (
          <Progress value={subject.progress} className="h-2 mb-4" />
        )}
        <div className="flex flex-wrap gap-2">
          {subject.topics.map(topic => (
            <Badge key={topic} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          {subject.progress > 0 ? 'Continue' : 'Start'} Learning
        </Button>
        <Link to={subject.route}>
          <Button>Explore</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Arrow icon component
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default SubjectHub;
