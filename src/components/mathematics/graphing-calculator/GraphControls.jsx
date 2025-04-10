import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GraphControls = ({ xRange, yRange, gridSize, setXRange, setYRange, setGridSize }) => {
  const [xMin, setXMin] = useState(xRange[0].toString());
  const [xMax, setXMax] = useState(xRange[1].toString());
  const [yMin, setYMin] = useState(yRange[0].toString());
  const [yMax, setYMax] = useState(yRange[1].toString());
  
  const handleXMinChange = (e) => {
    setXMin(e.target.value);
  };
  
  const handleXMaxChange = (e) => {
    setXMax(e.target.value);
  };
  
  const handleYMinChange = (e) => {
    setYMin(e.target.value);
  };
  
  const handleYMaxChange = (e) => {
    setYMax(e.target.value);
  };
  
  const handleGridSizeChange = (value) => {
    setGridSize(value[0]);
  };
  
  const applyRanges = () => {
    const newXMin = parseFloat(xMin);
    const newXMax = parseFloat(xMax);
    const newYMin = parseFloat(yMin);
    const newYMax = parseFloat(yMax);
    
    if (isNaN(newXMin) || isNaN(newXMax) || isNaN(newYMin) || isNaN(newYMax)) {
      return;
    }
    
    if (newXMin >= newXMax || newYMin >= newYMax) {
      return;
    }
    
    setXRange([newXMin, newXMax]);
    setYRange([newYMin, newYMax]);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="ranges">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ranges">Ranges</TabsTrigger>
          <TabsTrigger value="grid">Grid</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ranges" className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="xMin">X Min</Label>
              <Input
                id="xMin"
                value={xMin}
                onChange={handleXMinChange}
                type="number"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="xMax">X Max</Label>
              <Input
                id="xMax"
                value={xMax}
                onChange={handleXMaxChange}
                type="number"
                step="any"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yMin">Y Min</Label>
              <Input
                id="yMin"
                value={yMin}
                onChange={handleYMinChange}
                type="number"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yMax">Y Max</Label>
              <Input
                id="yMax"
                value={yMax}
                onChange={handleYMaxChange}
                type="number"
                step="any"
              />
            </div>
          </div>
          
          <Button onClick={applyRanges} className="w-full">
            Apply Ranges
          </Button>
        </TabsContent>
        
        <TabsContent value="grid" className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="gridSize">Grid Size</Label>
              <span>{gridSize}</span>
            </div>
            <Slider
              id="gridSize"
              min={0.1}
              max={5}
              step={0.1}
              value={[gridSize]}
              onValueChange={handleGridSizeChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GraphControls;
