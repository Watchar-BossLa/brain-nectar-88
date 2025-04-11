import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music as MusicIcon, FileText, Waveform, BarChart4, Headphones, Lightbulb } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import MusicAnalyzer from '@/components/music/music-analyzer';

/**
 * Music page component
 * @returns {React.ReactElement} Music page component
 */
const Music = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Music</h1>
            <p className="text-muted-foreground">
              Explore musical theory, composition, and historical context
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
              subject="Music" 
              description="Explore musical theory, composition, and historical context"
              progress={12}
              topics={[
                {
                  title: "Music Theory",
                  description: "Fundamental principles and concepts of music",
                  status: "in_progress",
                  subtopics: [
                    { title: "Notation and Rhythm", completed: true },
                    { title: "Scales and Modes", completed: false },
                    { title: "Harmony and Chord Progressions", completed: false },
                    { title: "Form and Structure", completed: false }
                  ]
                },
                {
                  title: "Music History",
                  description: "Evolution of musical styles and periods",
                  status: "in_progress",
                  subtopics: [
                    { title: "Medieval and Renaissance", completed: true },
                    { title: "Baroque Period", completed: false },
                    { title: "Classical Period", completed: false },
                    { title: "Romantic Period", completed: false },
                    { title: "20th Century and Beyond", completed: false }
                  ]
                },
                {
                  title: "Music Analysis",
                  description: "Methods for analyzing and interpreting musical works",
                  status: "not_started",
                  subtopics: [
                    { title: "Formal Analysis", completed: false },
                    { title: "Harmonic Analysis", completed: false },
                    { title: "Melodic Analysis", completed: false },
                    { title: "Historical Context", completed: false }
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
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Music Theory</CardTitle>
                  </div>
                  <CardDescription>
                    Fundamental principles and concepts of music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Notation and Rhythm</li>
                    <li>Scales and Modes</li>
                    <li>Harmony and Chord Progressions</li>
                    <li>Form and Structure</li>
                    <li>Counterpoint</li>
                    <li>Orchestration and Arrangement</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MusicIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Music History</CardTitle>
                  </div>
                  <CardDescription>
                    Evolution of musical styles and periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Medieval and Renaissance (500-1600)</li>
                    <li>Baroque Period (1600-1750)</li>
                    <li>Classical Period (1750-1820)</li>
                    <li>Romantic Period (1820-1900)</li>
                    <li>20th Century and Beyond</li>
                    <li>World Music Traditions</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    <CardTitle>Music Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Methods for analyzing and interpreting musical works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Formal Analysis</li>
                    <li>Harmonic Analysis</li>
                    <li>Melodic Analysis</li>
                    <li>Textural Analysis</li>
                    <li>Historical Context</li>
                    <li>Performance Practice</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Waveform className="h-5 w-5 text-primary" />
                    <CardTitle>Composition</CardTitle>
                  </div>
                  <CardDescription>
                    Techniques for creating original musical works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Melodic Writing</li>
                    <li>Harmonic Progression</li>
                    <li>Form and Structure</li>
                    <li>Texture and Orchestration</li>
                    <li>Style and Genre</li>
                    <li>Technology in Composition</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    <CardTitle>Music Appreciation</CardTitle>
                  </div>
                  <CardDescription>
                    Developing listening skills and understanding musical works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Active Listening Techniques</li>
                    <li>Elements of Music</li>
                    <li>Musical Genres and Styles</li>
                    <li>Great Composers and Works</li>
                    <li>Cultural Context</li>
                    <li>Performance Evaluation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Music and Society</CardTitle>
                  </div>
                  <CardDescription>
                    The role of music in culture, society, and human experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Music and Cultural Identity</li>
                    <li>Music and Politics</li>
                    <li>Music and Technology</li>
                    <li>Music Industry and Economics</li>
                    <li>Music Education</li>
                    <li>Music Psychology and Cognition</li>
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
                  <CardTitle>Music Analyzer</CardTitle>
                  <CardDescription>
                    Analyze musical compositions, theory, and historical context
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <MusicIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore the elements of musical compositions including form, harmony, melody, and historical context. Listen to musical examples and see detailed analysis of their structure and characteristics.
                  </p>
                  <Button className="w-full">Launch Music Analyzer</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ear Training</CardTitle>
                  <CardDescription>
                    Develop your musical ear and listening skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Headphones className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Practice identifying intervals, chords, scales, and rhythmic patterns. Improve your ability to recognize musical elements by ear through interactive exercises and assessments.
                  </p>
                  <Button className="w-full">Launch Ear Training</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Composition Workshop</CardTitle>
                  <CardDescription>
                    Create and experiment with musical composition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Waveform className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Experiment with melody, harmony, rhythm, and form to create your own musical compositions. Learn composition techniques and get feedback on your musical creations.
                  </p>
                  <Button className="w-full">Launch Composition Workshop</Button>
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
                      <li>The Study of Counterpoint by Johann Joseph Fux</li>
                      <li>Harmony and Voice Leading by Edward Aldwell and Carl Schachter</li>
                      <li>A History of Western Music by J. Peter Burkholder</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Fundamentals of Music Theory (University of Edinburgh)</li>
                      <li>edX: Introduction to Music Theory (Berklee)</li>
                      <li>Yale Open Courses: Listening to Music</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Music Theory for Beginners</li>
                      <li>Inside the Score: Analysis of Great Works</li>
                      <li>Ear Training Exercises</li>
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
                    <h3 className="text-sm font-medium">Theory Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Scale and Mode Identification</li>
                      <li>Chord Analysis Worksheets</li>
                      <li>Form Analysis Templates</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Listening Examples</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Curated Playlists by Period</li>
                      <li>Annotated Recordings</li>
                      <li>Comparative Listening Exercises</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Composition Resources</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Melody Writing Templates</li>
                      <li>Chord Progression Libraries</li>
                      <li>Form and Structure Guidelines</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Music" />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Music Analyzer</h2>
          <MusicAnalyzer />
        </div>
      </div>
    </MainLayout>
  );
};

export default Music;
