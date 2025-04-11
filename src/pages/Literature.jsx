import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, BookText, Scroll, Theater, Pencil, Globe } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import TextAnalyzer from '@/components/literature/text-analyzer/TextAnalyzer';

/**
 * Literature page component
 * @returns {React.ReactElement} Literature page component
 */
const Literature = () => {
  const [showTextAnalyzer, setShowTextAnalyzer] = useState(false);
  
  const openTextAnalyzer = () => {
    setShowTextAnalyzer(true);
  };
  
  const closeTextAnalyzer = () => {
    setShowTextAnalyzer(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Literature</h1>
            <p className="text-muted-foreground">
              Explore literary works, analysis, and critical thinking
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
              subject="Literature" 
              description="Explore literary works, analysis, and critical thinking"
              progress={15}
              topics={[
                {
                  title: "Fiction",
                  description: "Novels, short stories, and narrative prose",
                  status: "in_progress",
                  subtopics: [
                    { title: "Elements of Fiction", completed: true },
                    { title: "Literary Genres", completed: true },
                    { title: "Character Analysis", completed: false },
                    { title: "Plot Structure", completed: false }
                  ]
                },
                {
                  title: "Poetry",
                  description: "Verse and poetic forms",
                  status: "not_started",
                  subtopics: [
                    { title: "Poetic Forms", completed: false },
                    { title: "Poetic Devices", completed: false },
                    { title: "Meter and Rhythm", completed: false },
                    { title: "Interpretation", completed: false }
                  ]
                },
                {
                  title: "Drama",
                  description: "Plays and theatrical works",
                  status: "not_started",
                  subtopics: [
                    { title: "Elements of Drama", completed: false },
                    { title: "Tragedy and Comedy", completed: false },
                    { title: "Character and Dialogue", completed: false },
                    { title: "Performance Analysis", completed: false }
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
                    <BookText className="h-5 w-5 text-primary" />
                    <CardTitle>Fiction</CardTitle>
                  </div>
                  <CardDescription>
                    Novels, short stories, and narrative prose
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Elements of Fiction
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openTextAnalyzer}
                      >
                        Analyze
                      </Button>
                    </li>
                    <li>Literary Genres</li>
                    <li>Character Analysis</li>
                    <li>Plot Structure</li>
                    <li>Setting and Atmosphere</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-primary" />
                    <CardTitle>Poetry</CardTitle>
                  </div>
                  <CardDescription>
                    Verse and poetic forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Poetic Forms</li>
                    <li>Poetic Devices</li>
                    <li>Meter and Rhythm</li>
                    <li>Imagery and Symbolism</li>
                    <li>Interpretation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Theater className="h-5 w-5 text-primary" />
                    <CardTitle>Drama</CardTitle>
                  </div>
                  <CardDescription>
                    Plays and theatrical works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Elements of Drama</li>
                    <li>Tragedy and Comedy</li>
                    <li>Character and Dialogue</li>
                    <li>Stage Directions</li>
                    <li>Performance Analysis</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Literary Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Critical approaches to literature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Close Reading</li>
                    <li>Literary Theory</li>
                    <li>Critical Approaches</li>
                    <li>Textual Analysis</li>
                    <li>Interpretation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>World Literature</CardTitle>
                  </div>
                  <CardDescription>
                    Literature from different cultures and traditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Western Canon</li>
                    <li>Eastern Literature</li>
                    <li>African Literature</li>
                    <li>Latin American Literature</li>
                    <li>Comparative Literature</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Pencil className="h-5 w-5 text-primary" />
                    <CardTitle>Creative Writing</CardTitle>
                  </div>
                  <CardDescription>
                    Techniques and practice of writing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Narrative Techniques</li>
                    <li>Character Development</li>
                    <li>Dialogue Writing</li>
                    <li>Poetry Composition</li>
                    <li>Revision and Editing</li>
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
                  <CardTitle>Text Analyzer</CardTitle>
                  <CardDescription>
                    Analyze literary texts for patterns and devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze texts for literary devices, themes, tone, and more. Get insights into style, vocabulary, and structure.
                  </p>
                  <Button 
                    onClick={openTextAnalyzer}
                    className="w-full"
                  >
                    Launch Text Analyzer
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Character Map</CardTitle>
                  <CardDescription>
                    Visualize character relationships
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Theater className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create and explore character relationship maps for novels, plays, and other literary works.
                  </p>
                  <Button className="w-full">Launch Character Map</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Poetry Scanner</CardTitle>
                  <CardDescription>
                    Analyze poetic meter and form
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Scroll className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan poetry for meter, rhyme scheme, and poetic devices. Identify forms and patterns.
                  </p>
                  <Button className="w-full">Launch Poetry Scanner</Button>
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
                      <li>The Norton Anthology of World Literature</li>
                      <li>How to Read Literature Like a Professor (Thomas C. Foster)</li>
                      <li>Literary Theory: An Introduction (Terry Eagleton)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>edX: Introduction to Literature (Harvard)</li>
                      <li>Coursera: Modern & Contemporary American Poetry (UPenn)</li>
                      <li>Khan Academy: World Literature</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Literature</li>
                      <li>TED-Ed Literary Analysis</li>
                      <li>The School of Life: Literature</li>
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
                    <h3 className="text-sm font-medium">Reading Lists</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Classic Fiction Reading List</li>
                      <li>Contemporary Poetry Collection</li>
                      <li>World Drama Anthology</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Analysis Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Close Reading Practice</li>
                      <li>Character Analysis Worksheets</li>
                      <li>Poetry Interpretation Exercises</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Writing Prompts</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Creative Writing Prompts</li>
                      <li>Literary Analysis Essay Topics</li>
                      <li>Comparative Literature Assignments</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Literature" />
        </div>
        
        {/* Text Analyzer Modal */}
        {showTextAnalyzer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Literary Text Analyzer</h2>
                  <Button variant="ghost" onClick={closeTextAnalyzer}>
                    ✕
                  </Button>
                </div>
                <TextAnalyzer />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Literature;
