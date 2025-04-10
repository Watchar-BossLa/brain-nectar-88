import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, Lightbulb, HeartPulse, School, Sparkles } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import CognitiveAssessment from '@/components/psychology/cognitive-assessment/CognitiveAssessment';

/**
 * Psychology page component
 * @returns {React.ReactElement} Psychology page component
 */
const Psychology = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  
  const openAssessment = () => {
    setShowAssessment(true);
  };
  
  const closeAssessment = () => {
    setShowAssessment(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Psychology</h1>
            <p className="text-muted-foreground">
              Understand the human mind, behavior, and mental processes
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
              subject="Psychology" 
              description="Understand the human mind, behavior, and mental processes"
              progress={15}
              topics={[
                {
                  title: "Cognitive Psychology",
                  description: "Study of mental processes such as attention, memory, perception, and thinking",
                  status: "in_progress",
                  subtopics: [
                    { title: "Attention", completed: true },
                    { title: "Memory", completed: true },
                    { title: "Perception", completed: false },
                    { title: "Problem Solving", completed: false }
                  ]
                },
                {
                  title: "Social Psychology",
                  description: "Study of how people's thoughts, feelings, and behaviors are influenced by others",
                  status: "not_started",
                  subtopics: [
                    { title: "Social Influence", completed: false },
                    { title: "Group Dynamics", completed: false },
                    { title: "Attitudes", completed: false },
                    { title: "Prejudice", completed: false }
                  ]
                },
                {
                  title: "Developmental Psychology",
                  description: "Study of how people grow and change throughout the lifespan",
                  status: "not_started",
                  subtopics: [
                    { title: "Childhood Development", completed: false },
                    { title: "Adolescence", completed: false },
                    { title: "Adulthood", completed: false },
                    { title: "Aging", completed: false }
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
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>Cognitive Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of mental processes such as attention, memory, perception, and thinking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Memory and Learning
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openAssessment}
                      >
                        Take Assessment
                      </Button>
                    </li>
                    <li>Attention and Perception</li>
                    <li>Problem Solving and Decision Making</li>
                    <li>Language and Communication</li>
                    <li>Intelligence and Creativity</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Social Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of how people's thoughts, feelings, and behaviors are influenced by others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Social Influence and Conformity</li>
                    <li>Group Dynamics and Leadership</li>
                    <li>Attitudes and Persuasion</li>
                    <li>Prejudice and Discrimination</li>
                    <li>Interpersonal Relationships</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    <CardTitle>Developmental Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of how people grow and change throughout the lifespan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Childhood Development</li>
                    <li>Adolescence and Identity Formation</li>
                    <li>Adult Development and Aging</li>
                    <li>Cognitive Development</li>
                    <li>Social and Emotional Development</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <CardTitle>Clinical Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study and treatment of mental, emotional, and behavioral disorders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Psychological Disorders</li>
                    <li>Therapeutic Approaches</li>
                    <li>Assessment and Diagnosis</li>
                    <li>Mental Health and Well-being</li>
                    <li>Psychopharmacology</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Behavioral Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of observable behavior and its relationship to the environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Classical Conditioning</li>
                    <li>Operant Conditioning</li>
                    <li>Behavior Modification</li>
                    <li>Applied Behavior Analysis</li>
                    <li>Habit Formation and Change</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle>Positive Psychology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of human strengths, virtues, and factors that enable individuals and communities to thrive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Happiness and Well-being</li>
                    <li>Character Strengths and Virtues</li>
                    <li>Flow and Optimal Experience</li>
                    <li>Resilience and Post-traumatic Growth</li>
                    <li>Positive Relationships</li>
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
                  <CardTitle>Cognitive Assessment</CardTitle>
                  <CardDescription>
                    Assess cognitive functions like memory, attention, and problem-solving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Brain className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Take interactive assessments to measure various cognitive functions including memory, attention, processing speed, and problem-solving abilities. Get personalized feedback and track your progress over time.
                  </p>
                  <Button 
                    onClick={openAssessment}
                    className="w-full"
                  >
                    Launch Cognitive Assessment
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personality Profiler</CardTitle>
                  <CardDescription>
                    Discover your personality traits and tendencies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete comprehensive personality assessments based on established psychological models. Gain insights into your traits, preferences, strengths, and potential areas for growth.
                  </p>
                  <Button className="w-full">Launch Personality Profiler</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Behavior Tracker</CardTitle>
                  <CardDescription>
                    Monitor and analyze behavioral patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track daily behaviors, emotions, and habits to identify patterns and triggers. Set goals for behavior change and monitor your progress with data visualizations and insights.
                  </p>
                  <Button className="w-full">Launch Behavior Tracker</Button>
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
                      <li>Introduction to Psychology (Kalat)</li>
                      <li>Cognitive Psychology: Mind and Brain (Smith & Kosslyn)</li>
                      <li>Social Psychology (Aronson, Wilson, & Akert)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Introduction to Psychology (Yale University)</li>
                      <li>edX: The Science of Happiness (UC Berkeley)</li>
                      <li>Khan Academy: Psychology</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Psychology</li>
                      <li>TED Talks on Psychology</li>
                      <li>The Psychology Podcast</li>
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
                    <h3 className="text-sm font-medium">Case Studies</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Classic Psychology Case Studies</li>
                      <li>Contemporary Applications</li>
                      <li>Ethical Considerations in Psychology</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Experiments</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Cognitive Experiments</li>
                      <li>Social Psychology Demonstrations</li>
                      <li>Perception and Illusion Activities</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Assessment Tools</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Psychological Scales and Measures</li>
                      <li>Self-Assessment Questionnaires</li>
                      <li>Research Methods Practice</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Psychology" />
        </div>
        
        {/* Cognitive Assessment Modal */}
        {showAssessment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Cognitive Assessment</h2>
                  <Button variant="ghost" onClick={closeAssessment}>
                    ✕
                  </Button>
                </div>
                <CognitiveAssessment />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Psychology;
