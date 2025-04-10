import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, ZoomIn, ZoomOut, RefreshCw, Download } from 'lucide-react';
import FunctionInput from './FunctionInput';
import GraphControls from './GraphControls';
import * as math from 'mathjs';

const GraphingCalculator = () => {
  const [functions, setFunctions] = useState([
    { id: 1, expression: 'x^2', color: '#ff0000', visible: true, error: null }
  ]);
  const [xRange, setXRange] = useState([-10, 10]);
  const [yRange, setYRange] = useState([-10, 10]);
  const [gridSize, setGridSize] = useState(1);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Add a new function
  const addFunction = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];
    const newId = Math.max(0, ...functions.map(f => f.id)) + 1;
    const colorIndex = newId % colors.length;
    
    setFunctions([
      ...functions,
      { id: newId, expression: '', color: colors[colorIndex], visible: true, error: null }
    ]);
  };

  // Remove a function
  const removeFunction = (id) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  // Update a function
  const updateFunction = (id, updates) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  // Reset the graph
  const resetGraph = () => {
    setXRange([-10, 10]);
    setYRange([-10, 10]);
    setGridSize(1);
  };

  // Zoom in
  const zoomIn = () => {
    const xCenter = (xRange[0] + xRange[1]) / 2;
    const yCenter = (yRange[0] + yRange[1]) / 2;
    const xWidth = (xRange[1] - xRange[0]) * 0.8;
    const yWidth = (yRange[1] - yRange[0]) * 0.8;
    
    setXRange([xCenter - xWidth / 2, xCenter + xWidth / 2]);
    setYRange([yCenter - yWidth / 2, yCenter + yWidth / 2]);
  };

  // Zoom out
  const zoomOut = () => {
    const xCenter = (xRange[0] + xRange[1]) / 2;
    const yCenter = (yRange[0] + yRange[1]) / 2;
    const xWidth = (xRange[1] - xRange[0]) * 1.2;
    const yWidth = (yRange[1] - yRange[0]) * 1.2;
    
    setXRange([xCenter - xWidth / 2, xCenter + xWidth / 2]);
    setYRange([yCenter - yWidth / 2, yCenter + yWidth / 2]);
  };

  // Download the graph as an image
  const downloadGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw the grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Calculate the pixel coordinates for a given (x, y) point
    const xToPixel = (x) => width * (x - xRange[0]) / (xRange[1] - xRange[0]);
    const yToPixel = (y) => height * (1 - (y - yRange[0]) / (yRange[1] - yRange[0]));
    
    // Draw vertical grid lines
    for (let x = Math.ceil(xRange[0] / gridSize) * gridSize; x <= xRange[1]; x += gridSize) {
      const pixelX = xToPixel(x);
      ctx.beginPath();
      ctx.moveTo(pixelX, 0);
      ctx.lineTo(pixelX, height);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = Math.ceil(yRange[0] / gridSize) * gridSize; y <= yRange[1]; y += gridSize) {
      const pixelY = yToPixel(y);
      ctx.beginPath();
      ctx.moveTo(0, pixelY);
      ctx.lineTo(width, pixelY);
      ctx.stroke();
    }
    
    // Draw the x and y axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // x-axis
    if (yRange[0] <= 0 && yRange[1] >= 0) {
      const pixelY = yToPixel(0);
      ctx.beginPath();
      ctx.moveTo(0, pixelY);
      ctx.lineTo(width, pixelY);
      ctx.stroke();
    }
    
    // y-axis
    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const pixelX = xToPixel(0);
      ctx.beginPath();
      ctx.moveTo(pixelX, 0);
      ctx.lineTo(pixelX, height);
      ctx.stroke();
    }
    
    // Draw the functions
    functions.forEach(func => {
      if (!func.visible || !func.expression.trim()) return;
      
      try {
        // Compile the expression
        const compiledExpression = math.compile(func.expression);
        
        // Set the stroke style
        ctx.strokeStyle = func.color;
        ctx.lineWidth = 2;
        
        // Start the path
        ctx.beginPath();
        
        // Calculate points
        const numPoints = width;
        let isFirstPoint = true;
        
        for (let i = 0; i < numPoints; i++) {
          const x = xRange[0] + (i / numPoints) * (xRange[1] - xRange[0]);
          
          try {
            // Evaluate the function at x
            const y = compiledExpression.evaluate({ x });
            
            // Check if y is a valid number
            if (isNaN(y) || !isFinite(y)) continue;
            
            // Check if y is within the range
            if (y < yRange[0] || y > yRange[1]) continue;
            
            // Convert to pixel coordinates
            const pixelX = xToPixel(x);
            const pixelY = yToPixel(y);
            
            // Move to or line to the point
            if (isFirstPoint) {
              ctx.moveTo(pixelX, pixelY);
              isFirstPoint = false;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          } catch (err) {
            // Skip points where evaluation fails
            continue;
          }
        }
        
        // Stroke the path
        ctx.stroke();
        
        // Clear any previous error
        if (func.error) {
          updateFunction(func.id, { error: null });
        }
      } catch (err) {
        // Set the error
        updateFunction(func.id, { error: err.message });
      }
    });
    
  }, [functions, xRange, yRange, gridSize]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Graphing Calculator</CardTitle>
        <CardDescription>
          Plot and analyze mathematical functions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Function inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Functions</Label>
              {functions.map(func => (
                <FunctionInput
                  key={func.id}
                  func={func}
                  updateFunction={updateFunction}
                  removeFunction={removeFunction}
                  canRemove={functions.length > 1}
                />
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={addFunction}
              >
                Add Function
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <GraphControls
                xRange={xRange}
                yRange={yRange}
                gridSize={gridSize}
                setXRange={setXRange}
                setYRange={setYRange}
                setGridSize={setGridSize}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4 mr-1" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4 mr-1" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" onClick={resetGraph}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={downloadGraph}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Right panel: Graph */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground flex items-center">
              <InfoIcon className="h-4 w-4 mr-1" />
              <span>
                Tip: Use standard mathematical notation. Examples: x^2, sin(x), 2*x+1
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphingCalculator;
