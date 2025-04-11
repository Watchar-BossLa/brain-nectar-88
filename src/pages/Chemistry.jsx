import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flask, Atom, Beaker, Thermometer, Droplet, Microscope } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import PeriodicTable from '@/components/chemistry/periodic-table/PeriodicTable';
import MolecularViewer from '@/components/chemistry/molecular-viewer/MolecularViewer';

/**
 * Chemistry page component
 * @returns {React.ReactElement} Chemistry page component
 */
const Chemistry = () => {
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);
  const [showMolecularViewer, setShowMolecularViewer] = useState(false);
  
  const openPeriodicTable = () => {
    setShowPeriodicTable(true);
  };
  
  const closePeriodicTable = () => {
    setShowPeriodicTable(false);
  };
  
  const openMolecularViewer = () => {
    setShowMolecularViewer(true);
  };
  
  const closeMolecularViewer = () => {
    setShowMolecularViewer(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Chemistry</h1>
            <p className="text-muted-foreground">
              Learn about substances, their properties, and reactions
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
              subject="Chemistry" 
              description="Learn about substances, their properties, and reactions"
              progress={30}
              topics={[
                {
                  title: "Atomic Structure",
                  description: "Structure of atoms and periodic trends",
                  status: "completed",
                  subtopics: [
                    { title: "Atomic Models", completed: true },
                    { title: "Electron Configuration", completed: true },
                    { title: "Periodic Table", completed: true },
                    { title: "Periodic Trends", completed: true }
                  ]
                },
                {
                  title: "Chemical Bonding",
                  description: "Formation and types of chemical bonds",
                  status: "in_progress",
                  subtopics: [
                    { title: "Ionic Bonding", completed: true },
                    { title: "Covalent Bonding", completed: true },
                    { title: "Metallic Bonding", completed: false },
                    { title: "Intermolecular Forces", completed: false }
                  ]
                },
                {
                  title: "Chemical Reactions",
                  description: "Types and mechanisms of chemical reactions",
                  status: "not_started",
                  subtopics: [
                    { title: "Reaction Types", completed: false },
                    { title: "Stoichiometry", completed: false },
                    { title: "Reaction Rates", completed: false },
                    { title: "Chemical Equilibrium", completed: false }
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
                    <Atom className="h-5 w-5 text-primary" />
                    <CardTitle>Atomic Structure</CardTitle>
                  </div>
                  <CardDescription>
                    Structure of atoms and periodic trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Atomic Models</li>
                    <li>
                      Periodic Table & Trends
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openPeriodicTable}
                      >
                        View Table
                      </Button>
                    </li>
                    <li>Electron Configuration</li>
                    <li>Isotopes and Nuclear Chemistry</li>
                    <li>Quantum Mechanical Model</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    <CardTitle>Chemical Bonding</CardTitle>
                  </div>
                  <CardDescription>
                    Formation and types of chemical bonds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ionic Bonding</li>
                    <li>Covalent Bonding</li>
                    <li>
                      Molecular Structure
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openMolecularViewer}
                      >
                        View Models
                      </Button>
                    </li>
                    <li>VSEPR Theory</li>
                    <li>Intermolecular Forces</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Flask className="h-5 w-5 text-primary" />
                    <CardTitle>Chemical Reactions</CardTitle>
                  </div>
                  <CardDescription>
                    Types and mechanisms of chemical reactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Reaction Types</li>
                    <li>Stoichiometry</li>
                    <li>Reaction Rates</li>
                    <li>Chemical Equilibrium</li>
                    <li>Acid-Base Reactions</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <CardTitle>Thermochemistry</CardTitle>
                  </div>
                  <CardDescription>
                    Energy changes in chemical reactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Enthalpy</li>
                    <li>Entropy</li>
                    <li>Gibbs Free Energy</li>
                    <li>Calorimetry</li>
                    <li>Hess's Law</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-primary" />
                    <CardTitle>Solutions & Equilibria</CardTitle>
                  </div>
                  <CardDescription>
                    Properties of solutions and equilibrium systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Solution Properties</li>
                    <li>Concentration Units</li>
                    <li>Colligative Properties</li>
                    <li>Acid-Base Equilibria</li>
                    <li>Solubility Equilibria</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    <CardTitle>Organic Chemistry</CardTitle>
                  </div>
                  <CardDescription>
                    Chemistry of carbon compounds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Hydrocarbons</li>
                    <li>Functional Groups</li>
                    <li>Reaction Mechanisms</li>
                    <li>Stereochemistry</li>
                    <li>Biochemistry</li>
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
                  <CardTitle>Periodic Table</CardTitle>
                  <CardDescription>
                    Interactive periodic table of elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Atom className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore the periodic table, learn about elements, and discover periodic trends with our interactive tool.
                  </p>
                  <Button 
                    onClick={openPeriodicTable}
                    className="w-full"
                  >
                    Launch Periodic Table
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Molecular Viewer</CardTitle>
                  <CardDescription>
                    3D visualization of molecular structures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Beaker className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View and manipulate 3D models of molecules, explore bond angles, and understand molecular geometry.
                  </p>
                  <Button 
                    onClick={openMolecularViewer}
                    className="w-full"
                  >
                    Launch Molecular Viewer
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reaction Simulator</CardTitle>
                  <CardDescription>
                    Simulate chemical reactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Flask className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate chemical reactions, observe reaction mechanisms, and study reaction kinetics.
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
                      <li>Chemistry: The Central Science (Brown, LeMay)</li>
                      <li>Organic Chemistry (Clayden, Greeves, Warren)</li>
                      <li>Physical Chemistry (Atkins, de Paula)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>MIT OpenCourseWare: Principles of Chemical Science</li>
                      <li>Khan Academy: Chemistry</li>
                      <li>Coursera: Introduction to Chemistry</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Chemistry</li>
                      <li>Tyler DeWitt Chemistry Videos</li>
                      <li>The Organic Chemistry Tutor</li>
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
                      <li>General Chemistry Problem Set (100 problems)</li>
                      <li>Organic Chemistry Exercises (75 problems)</li>
                      <li>Thermochemistry Practice Problems (50 problems)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Practice Exams</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>General Chemistry Midterm Exam</li>
                      <li>Organic Chemistry Final Exam</li>
                      <li>Comprehensive Chemistry Exam</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Interactive Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Balancing Chemical Equations</li>
                      <li>Naming Compounds Practice</li>
                      <li>Acid-Base Titration Simulator</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Chemistry" />
        </div>
        
        {/* Periodic Table Modal */}
        {showPeriodicTable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Periodic Table</h2>
                  <Button variant="ghost" onClick={closePeriodicTable}>
                    ✕
                  </Button>
                </div>
                <PeriodicTable />
              </div>
            </div>
          </div>
        )}
        
        {/* Molecular Viewer Modal */}
        {showMolecularViewer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Molecular Viewer</h2>
                  <Button variant="ghost" onClick={closeMolecularViewer}>
                    ✕
                  </Button>
                </div>
                <MolecularViewer />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Chemistry;
