import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope, Dna, Heart, Leaf, Brain, Flask, Bird } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';

/**
 * Biology page component
 * @returns {React.ReactElement} Biology page component
 */
const Biology = () => {
  const [showCellViewer, setShowCellViewer] = useState(false);
  
  const openCellViewer = () => {
    setShowCellViewer(true);
  };
  
  const closeCellViewer = () => {
    setShowCellViewer(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Biology</h1>
            <p className="text-muted-foreground">
              Study living organisms and their interactions with each other
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
              subject="Biology" 
              description="Study living organisms and their interactions with each other"
              progress={20}
              topics={[
                {
                  title: "Cell Biology",
                  description: "Structure and function of cells",
                  status: "completed",
                  subtopics: [
                    { title: "Cell Structure", completed: true },
                    { title: "Cell Membrane", completed: true },
                    { title: "Cell Division", completed: true },
                    { title: "Cellular Respiration", completed: true }
                  ]
                },
                {
                  title: "Genetics",
                  description: "Inheritance and variation of traits",
                  status: "in_progress",
                  subtopics: [
                    { title: "DNA Structure", completed: true },
                    { title: "Gene Expression", completed: true },
                    { title: "Inheritance Patterns", completed: false },
                    { title: "Genetic Engineering", completed: false }
                  ]
                },
                {
                  title: "Ecology",
                  description: "Interactions between organisms and their environment",
                  status: "not_started",
                  subtopics: [
                    { title: "Ecosystems", completed: false },
                    { title: "Population Dynamics", completed: false },
                    { title: "Biodiversity", completed: false },
                    { title: "Conservation Biology", completed: false }
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
                    <Microscope className="h-5 w-5 text-primary" />
                    <CardTitle>Cell Biology</CardTitle>
                  </div>
                  <CardDescription>
                    Structure and function of cells
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Cell Structure
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openCellViewer}
                      >
                        View 3D
                      </Button>
                    </li>
                    <li>Cell Membrane</li>
                    <li>Cell Division</li>
                    <li>Cellular Respiration</li>
                    <li>Photosynthesis</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Dna className="h-5 w-5 text-primary" />
                    <CardTitle>Genetics</CardTitle>
                  </div>
                  <CardDescription>
                    Inheritance and variation of traits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>DNA Structure and Replication</li>
                    <li>Gene Expression</li>
                    <li>Mendelian Genetics</li>
                    <li>Genetic Disorders</li>
                    <li>Genetic Engineering</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <CardTitle>Ecology</CardTitle>
                  </div>
                  <CardDescription>
                    Interactions between organisms and their environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ecosystems</li>
                    <li>Population Dynamics</li>
                    <li>Community Interactions</li>
                    <li>Biodiversity</li>
                    <li>Conservation Biology</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle>Physiology</CardTitle>
                  </div>
                  <CardDescription>
                    Function of living systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Nervous System</li>
                    <li>Circulatory System</li>
                    <li>Respiratory System</li>
                    <li>Digestive System</li>
                    <li>Immune System</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bird className="h-5 w-5 text-primary" />
                    <CardTitle>Evolution</CardTitle>
                  </div>
                  <CardDescription>
                    Change in heritable traits of populations over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Natural Selection</li>
                    <li>Adaptation</li>
                    <li>Speciation</li>
                    <li>Evolutionary History</li>
                    <li>Human Evolution</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Flask className="h-5 w-5 text-primary" />
                    <CardTitle>Biochemistry</CardTitle>
                  </div>
                  <CardDescription>
                    Chemical processes within living organisms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Proteins</li>
                    <li>Carbohydrates</li>
                    <li>Lipids</li>
                    <li>Nucleic Acids</li>
                    <li>Enzymes</li>
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
                  <CardTitle>Cell Viewer</CardTitle>
                  <CardDescription>
                    3D visualization of cell structures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Microscope className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore the structure of cells in 3D, zoom in on organelles, and learn about their functions.
                  </p>
                  <Button 
                    onClick={openCellViewer}
                    className="w-full"
                  >
                    Launch Cell Viewer
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Genetic Simulator</CardTitle>
                  <CardDescription>
                    Simulate genetic inheritance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Dna className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate genetic inheritance patterns, predict offspring traits, and explore genetic disorders.
                  </p>
                  <Button className="w-full">Launch Simulator</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ecosystem Simulator</CardTitle>
                  <CardDescription>
                    Simulate ecological interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate ecosystems, observe population dynamics, and study the effects of environmental changes.
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
                      <li>Campbell Biology (Reece, Urry, Cain, Wasserman, Minorsky, Jackson)</li>
                      <li>Molecular Biology of the Cell (Alberts, Johnson, Lewis, Morgan, Raff, Roberts, Walter)</li>
                      <li>Ecology: Concepts and Applications (Molles, Sher)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>edX: Introduction to Biology - The Secret of Life (MIT)</li>
                      <li>Coursera: Biology Everywhere Specialization (Colorado)</li>
                      <li>Khan Academy: Biology</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Biology</li>
                      <li>Amoeba Sisters</li>
                      <li>Bozeman Science</li>
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
                      <li>Cell Biology Problem Set</li>
                      <li>Genetics Practice Problems</li>
                      <li>Ecology Case Studies</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lab Activities</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Virtual Microscopy Lab</li>
                      <li>DNA Extraction Simulation</li>
                      <li>Ecosystem Modeling</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Interactive Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Cell Structure Identification</li>
                      <li>Punnett Square Practice</li>
                      <li>Food Web Construction</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Biology" />
        </div>
        
        {/* Cell Viewer Modal */}
        {showCellViewer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">3D Cell Viewer</h2>
                  <Button variant="ghost" onClick={closeCellViewer}>
                    ✕
                  </Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Microscope className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p>3D Cell Viewer component will be implemented here.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Biology;
