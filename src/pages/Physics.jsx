import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Atom, Zap, Rocket, Thermometer, Waves, Magnet } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import MechanicsSimulator from '@/components/physics/mechanics-simulator/MechanicsSimulator';

/**
 * Physics page component
 * @returns {React.ReactElement} Physics page component
 */
const Physics = () => {
  const [showMechanicsSimulator, setShowMechanicsSimulator] = useState(false);
  
  const openMechanicsSimulator = () => {
    setShowMechanicsSimulator(true);
  };
  
  const closeMechanicsSimulator = () => {
    setShowMechanicsSimulator(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Physics</h1>
            <p className="text-muted-foreground">
              Study matter, energy, and the fundamental forces of nature
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
              subject="Physics" 
              description="Study matter, energy, and the fundamental forces of nature"
              progress={40}
              topics={[
                {
                  title: "Mechanics",
                  description: "Motion, forces, and energy",
                  status: "completed",
                  subtopics: [
                    { title: "Kinematics", completed: true },
                    { title: "Newton's Laws", completed: true },
                    { title: "Work and Energy", completed: true },
                    { title: "Momentum and Collisions", completed: true }
                  ]
                },
                {
                  title: "Electromagnetism",
                  description: "Electric and magnetic fields and their interactions",
                  status: "in_progress",
                  subtopics: [
                    { title: "Electric Fields", completed: true },
                    { title: "Electric Potential", completed: true },
                    { title: "Magnetic Fields", completed: false },
                    { title: "Electromagnetic Induction", completed: false }
                  ]
                },
                {
                  title: "Thermodynamics",
                  description: "Heat, temperature, and energy transfer",
                  status: "not_started",
                  subtopics: [
                    { title: "Temperature and Heat", completed: false },
                    { title: "Laws of Thermodynamics", completed: false },
                    { title: "Entropy", completed: false },
                    { title: "Thermal Processes", completed: false }
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
                    <Rocket className="h-5 w-5 text-primary" />
                    <CardTitle>Mechanics</CardTitle>
                  </div>
                  <CardDescription>
                    Motion, forces, and energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Kinematics</li>
                    <li>Newton's Laws of Motion</li>
                    <li>Work, Energy, and Power</li>
                    <li>Momentum and Collisions</li>
                    <li>Rotational Motion</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Electromagnetism</CardTitle>
                  </div>
                  <CardDescription>
                    Electric and magnetic fields and their interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Electric Fields and Forces</li>
                    <li>Electric Potential and Capacitance</li>
                    <li>Current and Resistance</li>
                    <li>Magnetic Fields and Forces</li>
                    <li>Electromagnetic Induction</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <CardTitle>Thermodynamics</CardTitle>
                  </div>
                  <CardDescription>
                    Heat, temperature, and energy transfer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Temperature and Heat</li>
                    <li>Thermal Properties of Matter</li>
                    <li>Laws of Thermodynamics</li>
                    <li>Heat Engines and Refrigerators</li>
                    <li>Entropy and Disorder</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-primary" />
                    <CardTitle>Waves and Optics</CardTitle>
                  </div>
                  <CardDescription>
                    Wave phenomena and the behavior of light
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Wave Properties and Types</li>
                    <li>Sound Waves</li>
                    <li>Reflection and Refraction</li>
                    <li>Interference and Diffraction</li>
                    <li>Polarization</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Atom className="h-5 w-5 text-primary" />
                    <CardTitle>Modern Physics</CardTitle>
                  </div>
                  <CardDescription>
                    Relativity and quantum mechanics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Special Relativity</li>
                    <li>Quantum Mechanics</li>
                    <li>Atomic Physics</li>
                    <li>Nuclear Physics</li>
                    <li>Particle Physics</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Magnet className="h-5 w-5 text-primary" />
                    <CardTitle>Applied Physics</CardTitle>
                  </div>
                  <CardDescription>
                    Applications of physics in technology and engineering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Electronics</li>
                    <li>Solid State Physics</li>
                    <li>Fluid Mechanics</li>
                    <li>Acoustics</li>
                    <li>Medical Physics</li>
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
                  <CardTitle>Mechanics Simulator</CardTitle>
                  <CardDescription>
                    Simulate and visualize mechanical systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Rocket className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate projectile motion, collisions, pendulums, and other mechanical systems with our interactive simulator.
                  </p>
                  <Button 
                    onClick={openMechanicsSimulator}
                    className="w-full"
                  >
                    Launch Simulator
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Simulator</CardTitle>
                  <CardDescription>
                    Build and analyze electrical circuits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Zap className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create circuits with resistors, capacitors, inductors, and more. Analyze current, voltage, and power.
                  </p>
                  <Button className="w-full">Launch Simulator</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Wave Simulator</CardTitle>
                  <CardDescription>
                    Visualize wave phenomena
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Waves className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore wave properties, interference, diffraction, and other wave phenomena with our interactive simulator.
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
                      <li>University Physics (Young & Freedman)</li>
                      <li>Fundamentals of Physics (Halliday, Resnick, Walker)</li>
                      <li>Introduction to Electrodynamics (Griffiths)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>MIT OpenCourseWare: Classical Mechanics</li>
                      <li>Khan Academy: Physics</li>
                      <li>Coursera: How Things Work: An Introduction to Physics</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>The Mechanical Universe (Caltech)</li>
                      <li>Crash Course Physics</li>
                      <li>Walter Lewin Physics Lectures (MIT)</li>
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
                      <li>Mechanics Problem Set (100 problems)</li>
                      <li>Electromagnetism Exercises (75 problems)</li>
                      <li>Thermodynamics Practice Problems (50 problems)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Practice Exams</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Mechanics Midterm Exam</li>
                      <li>Electromagnetism Final Exam</li>
                      <li>Comprehensive Physics Exam</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Interactive Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Force and Motion Simulator</li>
                      <li>Electric Field Visualizer</li>
                      <li>Thermodynamic Cycle Analyzer</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Physics" />
        </div>
        
        {/* Mechanics Simulator Modal */}
        {showMechanicsSimulator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Mechanics Simulator</h2>
                  <Button variant="ghost" onClick={closeMechanicsSimulator}>
                    ✕
                  </Button>
                </div>
                <MechanicsSimulator />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Physics;
