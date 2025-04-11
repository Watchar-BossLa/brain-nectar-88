import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Image, Brush, BookOpen, History, Lightbulb } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import StyleAnalyzer from '@/components/art/style-analyzer';

/**
 * Art page component
 * @returns {React.ReactElement} Art page component
 */
const Art = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Art</h1>
            <p className="text-muted-foreground">
              Explore artistic styles, techniques, and masterpieces throughout history
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
              subject="Art" 
              description="Explore artistic styles, techniques, and masterpieces throughout history"
              progress={15}
              topics={[
                {
                  title: "Art History",
                  description: "Study of art movements and their historical context",
                  status: "in_progress",
                  subtopics: [
                    { title: "Renaissance Art", completed: true },
                    { title: "Impressionism", completed: true },
                    { title: "Modern Art", completed: false },
                    { title: "Contemporary Art", completed: false }
                  ]
                },
                {
                  title: "Art Techniques",
                  description: "Various methods and approaches used in creating art",
                  status: "in_progress",
                  subtopics: [
                    { title: "Drawing Fundamentals", completed: true },
                    { title: "Painting Techniques", completed: false },
                    { title: "Sculpture Methods", completed: false },
                    { title: "Digital Art", completed: false }
                  ]
                },
                {
                  title: "Art Analysis",
                  description: "Methods for interpreting and analyzing artwork",
                  status: "not_started",
                  subtopics: [
                    { title: "Formal Analysis", completed: false },
                    { title: "Contextual Analysis", completed: false },
                    { title: "Iconography", completed: false },
                    { title: "Art Criticism", completed: false }
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
                    <History className="h-5 w-5 text-primary" />
                    <CardTitle>Art History</CardTitle>
                  </div>
                  <CardDescription>
                    Study of art movements and their historical context
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Renaissance Art (14th-17th century)</li>
                    <li>Baroque and Rococo (17th-18th century)</li>
                    <li>Neoclassicism and Romanticism (18th-19th century)</li>
                    <li>Impressionism and Post-Impressionism</li>
                    <li>Modern Art Movements</li>
                    <li>Contemporary Art</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brush className="h-5 w-5 text-primary" />
                    <CardTitle>Art Techniques</CardTitle>
                  </div>
                  <CardDescription>
                    Various methods and approaches used in creating art
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Drawing Fundamentals</li>
                    <li>Painting Techniques</li>
                    <li>Sculpture Methods</li>
                    <li>Printmaking</li>
                    <li>Photography</li>
                    <li>Digital Art</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle>Art Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Methods for interpreting and analyzing artwork
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Formal Analysis</li>
                    <li>Contextual Analysis</li>
                    <li>Iconography</li>
                    <li>Art Criticism</li>
                    <li>Aesthetic Theories</li>
                    <li>Semiotics in Art</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    <CardTitle>Visual Elements</CardTitle>
                  </div>
                  <CardDescription>
                    Basic components used to create visual art
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Line and Shape</li>
                    <li>Color Theory</li>
                    <li>Texture and Pattern</li>
                    <li>Space and Perspective</li>
                    <li>Form and Volume</li>
                    <li>Composition and Balance</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Art Appreciation</CardTitle>
                  </div>
                  <CardDescription>
                    Understanding and enjoying art on a deeper level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Viewing and Interpreting Art</li>
                    <li>Cultural Context of Art</li>
                    <li>Art and Society</li>
                    <li>Personal Response to Art</li>
                    <li>Art Museums and Galleries</li>
                    <li>Art Conservation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Creative Process</CardTitle>
                  </div>
                  <CardDescription>
                    Understanding how artists develop and execute their ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Inspiration and Ideation</li>
                    <li>Sketching and Planning</li>
                    <li>Experimentation</li>
                    <li>Execution and Refinement</li>
                    <li>Critique and Reflection</li>
                    <li>Artistic Voice and Style</li>
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
                  <CardTitle>Style Analyzer</CardTitle>
                  <CardDescription>
                    Analyze artistic styles, techniques, and color palettes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Palette className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore the characteristics of different artistic styles and movements. Analyze techniques, color palettes, and compositional elements used by artists throughout history.
                  </p>
                  <Button className="w-full">Launch Style Analyzer</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Museum</CardTitle>
                  <CardDescription>
                    Explore famous artworks in a virtual gallery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Take virtual tours of famous museums and galleries around the world. Explore masterpieces up close with high-resolution images and detailed information about each artwork.
                  </p>
                  <Button className="w-full">Launch Virtual Museum</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Composition Analyzer</CardTitle>
                  <CardDescription>
                    Analyze compositional elements and principles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Brush className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Understand how artists use composition to create effective artworks. Analyze balance, rhythm, proportion, emphasis, and unity in famous paintings and your own creations.
                  </p>
                  <Button className="w-full">Launch Composition Analyzer</Button>
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
                    <h3 className="text-sm font-medium">Books</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>The Story of Art by E.H. Gombrich</li>
                      <li>Ways of Seeing by John Berger</li>
                      <li>Art: A Visual History by Robert Cumming</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Modern Art & Ideas (MoMA)</li>
                      <li>edX: Art Appreciation and Techniques</li>
                      <li>Khan Academy: Art History Basics</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Smarthistory YouTube Channel</li>
                      <li>The Art Assignment</li>
                      <li>Great Art Explained</li>
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
                    <h3 className="text-sm font-medium">Art Analysis Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Formal Analysis Worksheets</li>
                      <li>Comparative Art Studies</li>
                      <li>Art Movement Identification Quizzes</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Virtual Museum Tours</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Louvre Virtual Tour</li>
                      <li>MoMA Online Collection</li>
                      <li>National Gallery Virtual Visits</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Art Creation Resources</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Drawing Technique Guides</li>
                      <li>Color Theory Exercises</li>
                      <li>Composition Templates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Art" />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Art Style Analyzer</h2>
          <StyleAnalyzer />
        </div>
      </div>
    </MainLayout>
  );
};

export default Art;
