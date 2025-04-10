import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Atom, Rocket, Zap, Waves, Magnet, Lightbulb } from 'lucide-react';
import MechanicsSimulator from '@/components/physics/mechanics-simulator/MechanicsSimulator';

const Physics = () => {
  const [activeSimulator, setActiveSimulator] = useState(null);

  const openSimulator = (simulator) => {
    setActiveSimulator(simulator);
  };

  const closeSimulator = () => {
    setActiveSimulator(null);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Atom className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Physics Learning Center</h1>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl">
          Explore the fundamental laws that govern our universe through interactive simulations,
          problem-solving, and conceptual explanations. From mechanics to quantum physics,
          deepen your understanding of physical phenomena.
        </p>

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="simulations">Interactive Simulations</TabsTrigger>
            <TabsTrigger value="problems">Problem Sets</TabsTrigger>
            <TabsTrigger value="experiments">Virtual Labs</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mechanics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Mechanics
                  </CardTitle>
                  <CardDescription>Motion, forces, and energy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Kinematics</li>
                    <li>Newton's Laws of Motion</li>
                    <li>Work, Energy, and Power</li>
                    <li>Momentum and Collisions</li>
                    <li>Rotational Motion</li>
                    <li>Gravitation</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Electromagnetism */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Electromagnetism
                  </CardTitle>
                  <CardDescription>Electric and magnetic phenomena</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Electric Fields and Forces</li>
                    <li>Electric Potential and Capacitance</li>
                    <li>Current and Resistance</li>
                    <li>Magnetic Fields and Forces</li>
                    <li>Electromagnetic Induction</li>
                    <li>Maxwell's Equations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Thermodynamics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Thermodynamics
                  </CardTitle>
                  <CardDescription>Heat, energy, and entropy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Temperature and Heat</li>
                    <li>Kinetic Theory of Gases</li>
                    <li>Laws of Thermodynamics</li>
                    <li>Heat Engines and Efficiency</li>
                    <li>Entropy and Disorder</li>
                    <li>Phase Transitions</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Waves and Optics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5" />
                    Waves and Optics
                  </CardTitle>
                  <CardDescription>Wave phenomena and light</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Wave Properties and Behavior</li>
                    <li>Sound Waves</li>
                    <li>Reflection and Refraction</li>
                    <li>Interference and Diffraction</li>
                    <li>Polarization</li>
                    <li>Optical Instruments</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Modern Physics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-5 w-5" />
                    Modern Physics
                  </CardTitle>
                  <CardDescription>Relativity and quantum mechanics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Special Relativity</li>
                    <li>General Relativity</li>
                    <li>Quantum Mechanics</li>
                    <li>Atomic Physics</li>
                    <li>Nuclear Physics</li>
                    <li>Particle Physics</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Astrophysics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Astrophysics
                  </CardTitle>
                  <CardDescription>Physics of celestial objects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stellar Evolution</li>
                    <li>Galaxies and Cosmology</li>
                    <li>Black Holes</li>
                    <li>Dark Matter and Dark Energy</li>
                    <li>Cosmic Microwave Background</li>
                    <li>Big Bang Theory</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mechanics Simulator</CardTitle>
                  <CardDescription>Visualize and analyze mechanics concepts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore projectile motion, collisions, and simple harmonic motion. Adjust parameters
                    and observe how they affect the behavior of physical systems.
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => openSimulator('mechanics')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Launch Simulator
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Electric Field Visualizer</CardTitle>
                  <CardDescription>Explore electric fields and forces</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Place charges and observe the resulting electric fields and forces.
                    Experiment with different charge configurations and see how they interact.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Launch Simulator
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wave Interference Simulator</CardTitle>
                  <CardDescription>Visualize wave superposition and interference</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create multiple wave sources and observe interference patterns.
                    Adjust frequency, amplitude, and phase to see how they affect the result.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Launch Simulator
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum Mechanics Simulator</CardTitle>
                  <CardDescription>Explore quantum phenomena</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize quantum wavefunctions, probability distributions, and tunneling effects.
                    Experiment with potential wells and barriers.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Launch Simulator
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problems">
            <Card>
              <CardHeader>
                <CardTitle>Physics Problem Sets</CardTitle>
                <CardDescription>
                  Practice solving physics problems with step-by-step guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our problem sets are designed to help you develop problem-solving skills and deepen your
                  understanding of physics concepts. Each problem includes hints, step-by-step solutions,
                  and explanations of the underlying principles.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Mechanics Problems</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Problems on motion, forces, energy, and momentum
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      Start Solving
                    </button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Electromagnetism Problems</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Problems on electric fields, circuits, and magnetism
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      Start Solving
                    </button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Modern Physics Problems</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Problems on relativity and quantum mechanics
                    </p>
                    <button className="text-primary text-sm hover:underline">
                      Start Solving
                    </button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Adaptive Problem Sets</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our adaptive learning system adjusts the difficulty of problems based on your performance,
                    helping you focus on areas that need improvement while challenging you appropriately.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Start Adaptive Practice
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Mechanics Lab</CardTitle>
                  <CardDescription>Conduct experiments on forces and motion</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Perform virtual experiments to verify Newton's laws, conservation principles,
                    and other mechanics concepts. Collect and analyze data just like in a real lab.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Enter Lab
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Virtual Circuits Lab</CardTitle>
                  <CardDescription>Build and analyze electrical circuits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Design and test electrical circuits with various components.
                    Measure voltage, current, and resistance, and verify circuit laws.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Enter Lab
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Virtual Optics Lab</CardTitle>
                  <CardDescription>Explore light, lenses, and optical phenomena</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conduct experiments with lenses, mirrors, and other optical elements.
                    Observe reflection, refraction, interference, and diffraction.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Enter Lab
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Virtual Modern Physics Lab</CardTitle>
                  <CardDescription>Explore quantum and relativistic phenomena</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Perform virtual versions of famous experiments in modern physics,
                    such as the photoelectric effect, double-slit experiment, and more.
                  </p>
                  <div className="mt-4">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      Enter Lab
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Simulator Modals */}
        {activeSimulator === 'mechanics' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Mechanics Simulator</h2>
                  <Button variant="ghost" onClick={closeSimulator}>
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
