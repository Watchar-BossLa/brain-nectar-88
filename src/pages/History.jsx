import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, Globe, Users, Scroll, BookOpen, Swords } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import HistoricalTimeline from '@/components/history/timeline/HistoricalTimeline';

/**
 * History page component
 * @returns {React.ReactElement} History page component
 */
const History = () => {
  const [showTimeline, setShowTimeline] = useState(false);
  
  const openTimeline = () => {
    setShowTimeline(true);
  };
  
  const closeTimeline = () => {
    setShowTimeline(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">History</h1>
            <p className="text-muted-foreground">
              Study past events, civilizations, and their impact on the present
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
              subject="History" 
              description="Study past events, civilizations, and their impact on the present"
              progress={10}
              topics={[
                {
                  title: "Ancient History",
                  description: "Early civilizations and classical antiquity",
                  status: "in_progress",
                  subtopics: [
                    { title: "Mesopotamia", completed: true },
                    { title: "Ancient Egypt", completed: false },
                    { title: "Ancient Greece", completed: false },
                    { title: "Roman Empire", completed: false }
                  ]
                },
                {
                  title: "Medieval History",
                  description: "Middle Ages and feudal societies",
                  status: "not_started",
                  subtopics: [
                    { title: "Early Middle Ages", completed: false },
                    { title: "High Middle Ages", completed: false },
                    { title: "Late Middle Ages", completed: false },
                    { title: "Byzantine Empire", completed: false }
                  ]
                },
                {
                  title: "Modern History",
                  description: "Renaissance to present day",
                  status: "not_started",
                  subtopics: [
                    { title: "Renaissance", completed: false },
                    { title: "Age of Exploration", completed: false },
                    { title: "Industrial Revolution", completed: false },
                    { title: "20th Century", completed: false }
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
                    <Landmark className="h-5 w-5 text-primary" />
                    <CardTitle>Ancient History</CardTitle>
                  </div>
                  <CardDescription>
                    Early civilizations and classical antiquity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Mesopotamia
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openTimeline}
                      >
                        View Timeline
                      </Button>
                    </li>
                    <li>Ancient Egypt</li>
                    <li>Ancient Greece</li>
                    <li>Roman Empire</li>
                    <li>Ancient China</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-primary" />
                    <CardTitle>Medieval History</CardTitle>
                  </div>
                  <CardDescription>
                    Middle Ages and feudal societies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Early Middle Ages</li>
                    <li>High Middle Ages</li>
                    <li>Late Middle Ages</li>
                    <li>Byzantine Empire</li>
                    <li>Islamic Golden Age</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Modern History</CardTitle>
                  </div>
                  <CardDescription>
                    Renaissance to present day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Renaissance</li>
                    <li>Age of Exploration</li>
                    <li>Industrial Revolution</li>
                    <li>World Wars</li>
                    <li>Cold War</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Social History</CardTitle>
                  </div>
                  <CardDescription>
                    History of societies and social movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Social Structures</li>
                    <li>Gender History</li>
                    <li>Labor History</li>
                    <li>Civil Rights Movements</li>
                    <li>Cultural History</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>World History</CardTitle>
                  </div>
                  <CardDescription>
                    Global historical developments and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>African History</li>
                    <li>Asian History</li>
                    <li>European History</li>
                    <li>American History</li>
                    <li>Oceanian History</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-primary" />
                    <CardTitle>Military History</CardTitle>
                  </div>
                  <CardDescription>
                    Warfare, military institutions, and conflicts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ancient Warfare</li>
                    <li>Medieval Warfare</li>
                    <li>Modern Warfare</li>
                    <li>Military Technology</li>
                    <li>Strategic Thought</li>
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
                  <CardTitle>Historical Timeline</CardTitle>
                  <CardDescription>
                    Visualize historical events and periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Scroll className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore interactive timelines of historical events, periods, and civilizations. Compare developments across different regions.
                  </p>
                  <Button 
                    onClick={openTimeline}
                    className="w-full"
                  >
                    Launch Timeline
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Historical Maps</CardTitle>
                  <CardDescription>
                    Explore geographical changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Globe className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View historical maps showing political boundaries, trade routes, and cultural diffusion throughout different time periods.
                  </p>
                  <Button className="w-full">Launch Maps</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Primary Source Analyzer</CardTitle>
                  <CardDescription>
                    Analyze historical documents and artifacts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Examine primary sources with contextual information, guided analysis questions, and interpretation tools.
                  </p>
                  <Button className="w-full">Launch Analyzer</Button>
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
                      <li>A History of World Societies (McKay, Hill, Buckler, et al.)</li>
                      <li>Guns, Germs, and Steel (Jared Diamond)</li>
                      <li>A People's History of the United States (Howard Zinn)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>edX: World History (Harvard)</li>
                      <li>Coursera: The Modern World (Princeton)</li>
                      <li>Khan Academy: World History</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course World History</li>
                      <li>BBC Documentaries</li>
                      <li>The Great Courses: History Series</li>
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
                    <h3 className="text-sm font-medium">Primary Sources</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Ancient Texts Collection</li>
                      <li>Historical Document Archive</li>
                      <li>Oral History Recordings</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Analysis Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Document-Based Questions</li>
                      <li>Historical Interpretation Exercises</li>
                      <li>Comparative History Assignments</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Interactive Activities</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Historical Simulations</li>
                      <li>Virtual Museum Tours</li>
                      <li>Archaeological Site Explorations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="History" />
        </div>
        
        {/* Historical Timeline Modal */}
        {showTimeline && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Historical Timeline</h2>
                  <Button variant="ghost" onClick={closeTimeline}>
                    ✕
                  </Button>
                </div>
                <HistoricalTimeline />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default History;
