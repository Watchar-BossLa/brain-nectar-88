import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, PauseCircle, RotateCcw, Download, Settings } from 'lucide-react';
import ProjectileMotion from './ProjectileMotion';
import CollisionSimulator from './CollisionSimulator';
import HarmonicMotion from './HarmonicMotion';

const MechanicsSimulator = () => {
  const [activeSimulation, setActiveSimulation] = useState('projectile');
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    // The reset functionality will be handled by the individual simulation components
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const downloadSimulation = () => {
    // This will be implemented to capture the canvas and download it as an image
    const canvas = document.querySelector('#simulation-canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${activeSimulation}-simulation.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Mechanics Simulator</CardTitle>
        <CardDescription>
          Visualize and experiment with mechanics concepts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeSimulation} 
          onValueChange={(value) => {
            setActiveSimulation(value);
            setIsRunning(false);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="projectile">Projectile Motion</TabsTrigger>
            <TabsTrigger value="collision">Collisions</TabsTrigger>
            <TabsTrigger value="harmonic">Harmonic Motion</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Simulation Canvas */}
            <div className="lg:w-2/3">
              <div className="border rounded-lg bg-white p-2 relative">
                <TabsContent value="projectile" className="m-0">
                  <ProjectileMotion isRunning={isRunning} />
                </TabsContent>
                <TabsContent value="collision" className="m-0">
                  <CollisionSimulator isRunning={isRunning} />
                </TabsContent>
                <TabsContent value="harmonic" className="m-0">
                  <HarmonicMotion isRunning={isRunning} />
                </TabsContent>
                
                {/* Simulation Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 p-2 rounded-full shadow-md">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleSimulation}
                    title={isRunning ? "Pause" : "Play"}
                  >
                    {isRunning ? (
                      <PauseCircle className="h-5 w-5" />
                    ) : (
                      <PlayCircle className="h-5 w-5" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={resetSimulation}
                    title="Reset"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleSettings}
                    title={showSettings ? "Hide Settings" : "Show Settings"}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={downloadSimulation}
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  {activeSimulation === 'projectile' && 
                    "Projectile motion demonstrates how objects move through the air under the influence of gravity."}
                  {activeSimulation === 'collision' && 
                    "Collision simulations show the transfer of momentum and energy between objects."}
                  {activeSimulation === 'harmonic' && 
                    "Simple harmonic motion illustrates oscillatory movement like that of a pendulum or spring."}
                </p>
              </div>
            </div>
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="lg:w-1/3 border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Simulation Settings</h3>
                
                <TabsContent value="projectile" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectile-angle">Launch Angle (degrees)</Label>
                    <Slider 
                      id="projectile-angle" 
                      min={0} 
                      max={90} 
                      step={1} 
                      defaultValue={[45]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectile-velocity">Initial Velocity (m/s)</Label>
                    <Slider 
                      id="projectile-velocity" 
                      min={1} 
                      max={50} 
                      step={1} 
                      defaultValue={[20]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectile-gravity">Gravity (m/s²)</Label>
                    <Slider 
                      id="projectile-gravity" 
                      min={1} 
                      max={20} 
                      step={0.1} 
                      defaultValue={[9.8]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectile-air-resistance">Air Resistance</Label>
                    <Select defaultValue="none">
                      <SelectTrigger id="projectile-air-resistance">
                        <SelectValue placeholder="Select air resistance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="collision" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collision-type">Collision Type</Label>
                    <Select defaultValue="elastic">
                      <SelectTrigger id="collision-type">
                        <SelectValue placeholder="Select collision type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elastic">Elastic</SelectItem>
                        <SelectItem value="inelastic">Inelastic</SelectItem>
                        <SelectItem value="partially-elastic">Partially Elastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="object1-mass">Object 1 Mass (kg)</Label>
                    <Slider 
                      id="object1-mass" 
                      min={1} 
                      max={20} 
                      step={0.1} 
                      defaultValue={[5]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="object1-velocity">Object 1 Velocity (m/s)</Label>
                    <Slider 
                      id="object1-velocity" 
                      min={-10} 
                      max={10} 
                      step={0.1} 
                      defaultValue={[5]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="object2-mass">Object 2 Mass (kg)</Label>
                    <Slider 
                      id="object2-mass" 
                      min={1} 
                      max={20} 
                      step={0.1} 
                      defaultValue={[5]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="object2-velocity">Object 2 Velocity (m/s)</Label>
                    <Slider 
                      id="object2-velocity" 
                      min={-10} 
                      max={10} 
                      step={0.1} 
                      defaultValue={[-5]} 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="harmonic" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="harmonic-type">Oscillator Type</Label>
                    <Select defaultValue="spring">
                      <SelectTrigger id="harmonic-type">
                        <SelectValue placeholder="Select oscillator type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring-Mass</SelectItem>
                        <SelectItem value="pendulum">Pendulum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="harmonic-amplitude">Amplitude (m)</Label>
                    <Slider 
                      id="harmonic-amplitude" 
                      min={0.1} 
                      max={2} 
                      step={0.1} 
                      defaultValue={[1]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="harmonic-mass">Mass (kg)</Label>
                    <Slider 
                      id="harmonic-mass" 
                      min={0.1} 
                      max={10} 
                      step={0.1} 
                      defaultValue={[1]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="harmonic-k">Spring Constant (N/m)</Label>
                    <Slider 
                      id="harmonic-k" 
                      min={1} 
                      max={50} 
                      step={1} 
                      defaultValue={[10]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="harmonic-damping">Damping</Label>
                    <Slider 
                      id="harmonic-damping" 
                      min={0} 
                      max={1} 
                      step={0.01} 
                      defaultValue={[0.1]} 
                    />
                  </div>
                </TabsContent>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MechanicsSimulator;
