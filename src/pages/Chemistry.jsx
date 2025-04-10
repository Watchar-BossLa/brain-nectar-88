import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flask, Atom, Beaker, Thermometer, Droplet, Microscope } from 'lucide-react';

const Chemistry = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Flask className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Chemistry Learning Center</h1>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Explore the fascinating world of chemistry through interactive simulations, 
          molecular visualizations, and comprehensive learning resources. From atomic structure 
          to organic reactions, deepen your understanding of chemical principles and applications.
        </p>
        
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="molecular">Molecular Viewer</TabsTrigger>
            <TabsTrigger value="reactions">Reaction Database</TabsTrigger>
            <TabsTrigger value="lab">Virtual Lab</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* General Chemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-5 w-5" />
                    General Chemistry
                  </CardTitle>
                  <CardDescription>Fundamental principles and concepts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Atomic Structure</li>
                    <li>Periodic Table & Trends</li>
                    <li>Chemical Bonding</li>
                    <li>Stoichiometry</li>
                    <li>States of Matter</li>
                    <li>Solutions & Concentrations</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Organic Chemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    Organic Chemistry
                  </CardTitle>
                  <CardDescription>Carbon-based compounds and reactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Functional Groups</li>
                    <li>Reaction Mechanisms</li>
                    <li>Stereochemistry</li>
                    <li>Aromatic Compounds</li>
                    <li>Carbonyl Chemistry</li>
                    <li>Polymers & Biomolecules</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Physical Chemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Physical Chemistry
                  </CardTitle>
                  <CardDescription>Energy, equilibrium, and kinetics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Thermodynamics</li>
                    <li>Chemical Equilibrium</li>
                    <li>Reaction Kinetics</li>
                    <li>Electrochemistry</li>
                    <li>Quantum Chemistry</li>
                    <li>Spectroscopy</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Inorganic Chemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Flask className="h-5 w-5" />
                    Inorganic Chemistry
                  </CardTitle>
                  <CardDescription>Non-carbon-based compounds</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Coordination Compounds</li>
                    <li>Transition Metals</li>
                    <li>Main Group Elements</li>
                    <li>Solid State Chemistry</li>
                    <li>Acid-Base Chemistry</li>
                    <li>Organometallic Chemistry</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Analytical Chemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    Analytical Chemistry
                  </CardTitle>
                  <CardDescription>Methods for chemical analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Chromatography</li>
                    <li>Spectroscopic Methods</li>
                    <li>Mass Spectrometry</li>
                    <li>Electroanalytical Methods</li>
                    <li>Titrations & Equilibria</li>
                    <li>Statistical Analysis</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Biochemistry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5" />
                    Biochemistry
                  </CardTitle>
                  <CardDescription>Chemistry of biological systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Proteins & Enzymes</li>
                    <li>Carbohydrates</li>
                    <li>Lipids & Membranes</li>
                    <li>Nucleic Acids</li>
                    <li>Metabolism</li>
                    <li>Molecular Biology</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="molecular">
            <Card>
              <CardHeader>
                <CardTitle>3D Molecular Viewer</CardTitle>
                <CardDescription>
                  Visualize and interact with molecular structures in 3D
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Molecule Library</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Browse our extensive library of pre-built molecular structures, 
                      from simple molecules to complex biomolecules.
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      Open Library
                    </button>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Structure Builder</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create your own molecular structures using our intuitive 
                      molecular building tools.
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      Open Builder
                    </button>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Visualization Options</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose from various visualization styles: ball-and-stick, 
                      space-filling, ribbon diagrams, and more.
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      View Options
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <Atom className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Interactive Molecular Viewer</h3>
                  <p className="text-center text-muted-foreground mb-4 max-w-md">
                    Select a molecule from the library or build your own to view it in 3D. 
                    Rotate, zoom, and explore molecular properties.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md">
                    Launch Viewer
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reactions">
            <Card>
              <CardHeader>
                <CardTitle>Chemical Reaction Database</CardTitle>
                <CardDescription>
                  Explore and understand chemical reactions and mechanisms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search reactions, reagents, or functional groups..." 
                      className="w-full px-4 py-2 border rounded-md pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Reaction Categories</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>Substitution Reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>Addition Reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>Elimination Reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>Redox Reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>Acid-Base Reactions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Featured Reactions</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        <span>Grignard Reaction</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        <span>Diels-Alder Reaction</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        <span>Aldol Condensation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        <span>Wittig Reaction</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        <span>Friedel-Crafts Alkylation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Reaction Mechanism Visualizer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View step-by-step animations of reaction mechanisms to understand 
                    how electrons move and bonds form/break during chemical reactions.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Mechanism Visualizer
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lab">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Chemistry Lab</CardTitle>
                  <CardDescription>Perform fundamental chemistry experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Conduct virtual experiments on acid-base titrations, precipitation reactions, 
                    redox reactions, and more. Collect and analyze data just like in a real lab.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Enter Lab
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Organic Chemistry Lab</CardTitle>
                  <CardDescription>Perform organic synthesis and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Conduct virtual organic chemistry experiments, including synthesis, 
                    purification, and spectroscopic analysis of organic compounds.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Enter Lab
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analytical Chemistry Lab</CardTitle>
                  <CardDescription>Perform chemical analysis experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Use virtual analytical instruments like spectrophotometers, chromatographs, 
                    and mass spectrometers to analyze chemical samples.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Enter Lab
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Physical Chemistry Lab</CardTitle>
                  <CardDescription>Explore thermodynamics and kinetics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Conduct experiments on chemical kinetics, thermodynamics, 
                    electrochemistry, and spectroscopy in this virtual lab.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Enter Lab
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Chemistry;
