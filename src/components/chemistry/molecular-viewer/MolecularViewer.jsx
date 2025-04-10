import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Beaker, Rotate3d, ZoomIn, Download, Maximize2, RefreshCw } from 'lucide-react';

/**
 * MolecularViewer component for visualizing 3D molecular structures
 * @returns {React.ReactElement} MolecularViewer component
 */
const MolecularViewer = () => {
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [viewMode, setViewMode] = useState('ball-and-stick');
  const canvasRef = useRef(null);
  
  // Sample molecules data
  const molecules = [
    { id: 'water', name: 'Water (H₂O)', formula: 'H₂O', complexity: 'Simple' },
    { id: 'methane', name: 'Methane (CH₄)', formula: 'CH₄', complexity: 'Simple' },
    { id: 'ethanol', name: 'Ethanol (C₂H₅OH)', formula: 'C₂H₅OH', complexity: 'Medium' },
    { id: 'glucose', name: 'Glucose (C₆H₁₂O₆)', formula: 'C₆H₁₂O₆', complexity: 'Complex' },
    { id: 'caffeine', name: 'Caffeine (C₈H₁₀N₄O₂)', formula: 'C₈H₁₀N₄O₂', complexity: 'Complex' },
    { id: 'aspirin', name: 'Aspirin (C₉H₈O₄)', formula: 'C₉H₈O₄', complexity: 'Complex' },
    { id: 'dna', name: 'DNA Fragment', formula: 'C₁₀H₁₃N₅O₄P', complexity: 'Very Complex' }
  ];
  
  // Molecule categories
  const categories = [
    { id: 'simple', name: 'Simple Molecules' },
    { id: 'organic', name: 'Organic Compounds' },
    { id: 'biochemical', name: 'Biochemical Molecules' },
    { id: 'custom', name: 'Custom Molecules' }
  ];
  
  // Initialize the 3D viewer (placeholder for actual implementation)
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // In a real implementation, this would initialize a 3D molecular viewer
    // like 3Dmol.js, ChemDoodle, or JSmol
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw a placeholder molecule
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(200, 150, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw bonds
    if (showBonds) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 5;
      
      // Bond 1
      ctx.beginPath();
      ctx.moveTo(180, 130);
      ctx.lineTo(120, 80);
      ctx.stroke();
      
      // Bond 2
      ctx.beginPath();
      ctx.moveTo(220, 130);
      ctx.lineTo(280, 80);
      ctx.stroke();
    }
    
    // Draw hydrogen atoms
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(120, 80, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(280, 80, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw labels
    if (showLabels) {
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText('O', 200, 150);
      ctx.fillText('H', 120, 80);
      ctx.fillText('H', 280, 80);
    }
    
    // Animation loop for rotation would be implemented here
    // using requestAnimationFrame
    
  }, [selectedMolecule, showLabels, showBonds, viewMode, rotationSpeed]);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Molecule Viewer */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Molecular Viewer</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" title="Reset View">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Full Screen">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Download Image">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted rounded-md overflow-hidden" style={{ height: '400px' }}>
                <canvas 
                  ref={canvasRef} 
                  width="400" 
                  height="300"
                  className="absolute inset-0 w-full h-full"
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md">
                    <p className="text-sm font-medium">{molecules.find(m => m.id === selectedMolecule)?.name}</p>
                    <p className="text-xs text-muted-foreground">{molecules.find(m => m.id === selectedMolecule)?.formula}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" title="Rotate">
                      <Rotate3d className="h-4 w-4 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="secondary" size="sm" title="Zoom">
                      <ZoomIn className="h-4 w-4 mr-1" />
                      Zoom
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Controls */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Molecule Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="simple">
                <TabsList className="w-full">
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="simple" className="pt-4">
                  <div className="space-y-2">
                    {molecules
                      .filter(m => m.complexity === 'Simple')
                      .map(molecule => (
                        <div 
                          key={molecule.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${selectedMolecule === molecule.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedMolecule(molecule.id)}
                        >
                          <div>
                            <p className="font-medium">{molecule.name}</p>
                            <p className="text-xs text-muted-foreground">{molecule.formula}</p>
                          </div>
                          <Beaker className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="organic" className="pt-4">
                  <div className="space-y-2">
                    {molecules
                      .filter(m => m.complexity === 'Medium')
                      .map(molecule => (
                        <div 
                          key={molecule.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${selectedMolecule === molecule.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedMolecule(molecule.id)}
                        >
                          <div>
                            <p className="font-medium">{molecule.name}</p>
                            <p className="text-xs text-muted-foreground">{molecule.formula}</p>
                          </div>
                          <Beaker className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="biochemical" className="pt-4">
                  <div className="space-y-2">
                    {molecules
                      .filter(m => m.complexity === 'Complex' || m.complexity === 'Very Complex')
                      .map(molecule => (
                        <div 
                          key={molecule.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${selectedMolecule === molecule.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedMolecule(molecule.id)}
                        >
                          <div>
                            <p className="font-medium">{molecule.name}</p>
                            <p className="text-xs text-muted-foreground">{molecule.formula}</p>
                          </div>
                          <Beaker className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="pt-4">
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Custom molecule import will be available soon.</p>
                    <Button variant="outline" className="mt-2" disabled>
                      Import Molecule
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="view-mode">View Mode</Label>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger id="view-mode">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ball-and-stick">Ball and Stick</SelectItem>
                      <SelectItem value="space-filling">Space Filling</SelectItem>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                      <SelectItem value="ribbon">Ribbon (Proteins)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rotation-speed">Rotation Speed</Label>
                    <span className="text-sm">{rotationSpeed}x</span>
                  </div>
                  <Slider
                    id="rotation-speed"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[rotationSpeed]}
                    onValueChange={(value) => setRotationSpeed(value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-labels" className="cursor-pointer">Show Labels</Label>
                  <Switch
                    id="show-labels"
                    checked={showLabels}
                    onCheckedChange={setShowLabels}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-bonds" className="cursor-pointer">Show Bonds</Label>
                  <Switch
                    id="show-bonds"
                    checked={showBonds}
                    onCheckedChange={setShowBonds}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Molecule Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Molecule Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Properties</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formula:</span>
                  <span className="font-medium">{molecules.find(m => m.id === selectedMolecule)?.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Molecular Weight:</span>
                  <span className="font-medium">18.02 g/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bond Angle:</span>
                  <span className="font-medium">104.5°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bond Length:</span>
                  <span className="font-medium">0.96 Å</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                Water is a polar inorganic compound with the chemical formula H₂O. It has a bent molecular geometry due to the lone pairs on the oxygen atom, resulting in a bond angle of 104.5°.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MolecularViewer;
