import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, RefreshCw, Download, Maximize2, Network } from 'lucide-react';

/**
 * KnowledgeGraph component for visualizing connections between concepts across subjects
 * @returns {React.ReactElement} KnowledgeGraph component
 */
const KnowledgeGraph = ({ currentSubject, conceptConnections }) => {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showRelationships, setShowRelationships] = useState(true);
  const [layoutType, setLayoutType] = useState('force-directed');
  const [highlightStrength, setHighlightStrength] = useState(2);
  
  // Sample nodes and edges for the knowledge graph
  const generateGraphData = () => {
    const nodes = [];
    const edges = [];
    
    // Add current subject as the central node
    nodes.push({
      id: currentSubject.toLowerCase(),
      label: currentSubject,
      type: 'current',
      size: 20
    });
    
    // Add concepts from current subject
    if (conceptConnections[currentSubject.toLowerCase()]) {
      conceptConnections[currentSubject.toLowerCase()].forEach(concept => {
        nodes.push({
          id: `${currentSubject.toLowerCase()}-${concept.concept.toLowerCase().replace(/\s+/g, '-')}`,
          label: concept.concept,
          type: 'concept',
          size: 15
        });
        
        // Add edge from current subject to concept
        edges.push({
          source: currentSubject.toLowerCase(),
          target: `${currentSubject.toLowerCase()}-${concept.concept.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'contains'
        });
        
        // Add related concepts from other subjects
        concept.relatedTo.forEach(related => {
          const relatedId = `${related.subject}-${related.concept.toLowerCase().replace(/\s+/g, '-')}`;
          
          // Add node if it doesn't exist
          if (!nodes.some(node => node.id === relatedId)) {
            nodes.push({
              id: relatedId,
              label: related.concept,
              type: 'related',
              subject: related.subject,
              size: 10
            });
          }
          
          // Add edge from concept to related concept
          edges.push({
            source: `${currentSubject.toLowerCase()}-${concept.concept.toLowerCase().replace(/\s+/g, '-')}`,
            target: relatedId,
            type: 'relates-to',
            description: related.description
          });
        });
      });
    }
    
    return { nodes, edges };
  };
  
  // Draw the knowledge graph on the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const { width, height } = canvasRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get graph data
    const { nodes, edges } = generateGraphData();
    
    // In a real implementation, this would use a library like D3.js, Sigma.js, or Vis.js
    // to create an interactive force-directed graph
    
    // For this placeholder, we'll draw a simple radial layout
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw edges
    if (showRelationships) {
      edges.forEach(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        
        if (!sourceNode || !targetNode) return;
        
        // Calculate positions (simplified for placeholder)
        let sourceX, sourceY, targetX, targetY;
        
        if (sourceNode.type === 'current') {
          sourceX = centerX;
          sourceY = centerY;
        } else if (sourceNode.type === 'concept') {
          const angle = nodes.findIndex(node => node.id === sourceNode.id) * (2 * Math.PI / conceptConnections[currentSubject.toLowerCase()].length);
          sourceX = centerX + Math.cos(angle) * 100;
          sourceY = centerY + Math.sin(angle) * 100;
        } else {
          const baseAngle = nodes.findIndex(node => node.id === sourceNode.id) * (2 * Math.PI / nodes.filter(node => node.type === 'related').length);
          sourceX = centerX + Math.cos(baseAngle) * 200;
          sourceY = centerY + Math.sin(baseAngle) * 200;
        }
        
        if (targetNode.type === 'current') {
          targetX = centerX;
          targetY = centerY;
        } else if (targetNode.type === 'concept') {
          const angle = nodes.findIndex(node => node.id === targetNode.id) * (2 * Math.PI / conceptConnections[currentSubject.toLowerCase()].length);
          targetX = centerX + Math.cos(angle) * 100;
          targetY = centerY + Math.sin(angle) * 100;
        } else {
          const baseAngle = nodes.findIndex(node => node.id === targetNode.id) * (2 * Math.PI / nodes.filter(node => node.type === 'related').length);
          targetX = centerX + Math.cos(baseAngle) * 200;
          targetY = centerY + Math.sin(baseAngle) * 200;
        }
        
        // Draw edge
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        
        if (edge.type === 'contains') {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
      });
    }
    
    // Draw nodes
    nodes.forEach(node => {
      let x, y;
      
      if (node.type === 'current') {
        x = centerX;
        y = centerY;
      } else if (node.type === 'concept') {
        const angle = nodes.findIndex(n => n.id === node.id) * (2 * Math.PI / conceptConnections[currentSubject.toLowerCase()].length);
        x = centerX + Math.cos(angle) * 100;
        y = centerY + Math.sin(angle) * 100;
      } else {
        const baseAngle = nodes.findIndex(n => n.id === node.id) * (2 * Math.PI / nodes.filter(n => n.type === 'related').length);
        x = centerX + Math.cos(baseAngle) * 200;
        y = centerY + Math.sin(baseAngle) * 200;
      }
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, node.size * zoomLevel, 0, 2 * Math.PI);
      
      if (node.type === 'current') {
        ctx.fillStyle = '#3b82f6';
      } else if (node.type === 'concept') {
        ctx.fillStyle = '#8b5cf6';
      } else {
        // Color by subject
        const subjectColors = {
          mathematics: '#ef4444',
          physics: '#f97316',
          chemistry: '#84cc16',
          biology: '#10b981',
          'data science': '#06b6d4',
          finance: '#6366f1',
          economics: '#8b5cf6',
          'computer science': '#ec4899'
        };
        
        ctx.fillStyle = subjectColors[node.subject] || '#94a3b8';
      }
      
      ctx.fill();
      
      // Draw labels
      if (showLabels) {
        ctx.fillStyle = '#000000';
        ctx.font = `${12 * zoomLevel}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y + node.size * zoomLevel + 10);
      }
    });
    
  }, [currentSubject, conceptConnections, zoomLevel, showLabels, showRelationships, layoutType, highlightStrength]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Knowledge Graph</CardTitle>
            <CardDescription>
              Visualize connections between concepts across subjects
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" title="Reset View">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" title="Download Image">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" title="Full Screen">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-muted rounded-md overflow-hidden" style={{ height: '500px' }}>
          <canvas 
            ref={canvasRef} 
            width="800" 
            height="500"
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="sm" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-xs">{currentSubject}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
              <span className="text-xs">Concepts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div>
              <span className="text-xs">Related Concepts</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="layout-type">Layout Type</Label>
            <Select value={layoutType} onValueChange={setLayoutType}>
              <SelectTrigger id="layout-type">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="force-directed">Force-Directed</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
                <SelectItem value="hierarchical">Hierarchical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="highlight-strength">Highlight Strength</Label>
              <span className="text-sm">{highlightStrength}x</span>
            </div>
            <Slider
              id="highlight-strength"
              min={1}
              max={5}
              step={1}
              value={[highlightStrength]}
              onValueChange={(value) => setHighlightStrength(value[0])}
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
            <Label htmlFor="show-relationships" className="cursor-pointer">Show Relationships</Label>
            <Switch
              id="show-relationships"
              checked={showRelationships}
              onCheckedChange={setShowRelationships}
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground flex items-start gap-2">
          <Network className="h-4 w-4 mt-0.5" />
          <p>
            This knowledge graph visualizes how concepts in {currentSubject} connect to concepts in other subjects.
            Explore the connections to see how knowledge integrates across different fields.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
