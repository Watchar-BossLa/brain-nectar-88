import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, RefreshCw, Download, Maximize2, Filter } from 'lucide-react';

/**
 * KnowledgeGraph component for visualizing connections between subjects and concepts
 * @param {Object} props Component props
 * @param {string} props.currentSubject The current subject being viewed
 * @param {Object} props.conceptConnections The concept connections data
 * @returns {React.ReactElement} KnowledgeGraph component
 */
const KnowledgeGraph = ({ currentSubject, conceptConnections }) => {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showAllConnections, setShowAllConnections] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [graphLayout, setGraphLayout] = useState('radial');
  const [physics, setPhysics] = useState(true);
  const [draggedNode, setDraggedNode] = useState(null);
  
  // Graph data
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Colors for different subjects
  const subjectColors = {
    mathematics: '#3b82f6', // blue
    physics: '#ef4444', // red
    chemistry: '#10b981', // green
    biology: '#8b5cf6', // purple
    'data science': '#f59e0b', // amber
    finance: '#64748b', // slate
    'computer science': '#ec4899', // pink
    literature: '#6366f1', // indigo
    history: '#f97316', // orange
    geography: '#14b8a6', // teal
    psychology: '#d946ef', // fuchsia
    neuroscience: '#0ea5e9', // sky
    sociology: '#84cc16', // lime
    economics: '#f43f5e', // rose
    philosophy: '#0f172a', // slate-900
    education: '#7c3aed', // violet
    medicine: '#06b6d4', // cyan
    'political science': '#9333ea', // purple
    anthropology: '#eab308', // yellow
    'environmental science': '#22c55e', // green
    art: '#e11d48', // rose
    music: '#7e22ce', // purple
    ethics: '#0369a1', // sky
    law: '#b91c1c', // red
    engineering: '#0f766e', // teal
    statistics: '#4338ca', // indigo
    geology: '#92400e', // amber
    archaeology: '#b45309', // amber
  };
  
  // Prepare graph data
  useEffect(() => {
    if (!conceptConnections || !currentSubject) return;
    
    const currentSubjectConnections = conceptConnections[currentSubject.toLowerCase()] || [];
    
    // Create nodes
    const newNodes = [];
    const newEdges = [];
    
    // Add center node for current subject
    newNodes.push({
      id: currentSubject,
      label: currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1),
      color: subjectColors[currentSubject.toLowerCase()] || '#64748b',
      size: 20,
      type: 'subject',
      fixed: true,
      x: 0,
      y: 0
    });
    
    // Add nodes for concepts in current subject
    currentSubjectConnections.forEach((concept, index) => {
      const angle = (2 * Math.PI * index) / currentSubjectConnections.length;
      const radius = 150;
      
      newNodes.push({
        id: `${currentSubject}-${concept.concept}`,
        label: concept.concept,
        color: subjectColors[currentSubject.toLowerCase()] || '#64748b',
        size: 15,
        type: 'concept',
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
      
      // Add edge from subject to concept
      newEdges.push({
        from: currentSubject,
        to: `${currentSubject}-${concept.concept}`,
        color: subjectColors[currentSubject.toLowerCase()] || '#64748b',
        width: 2
      });
      
      // Add nodes and edges for related concepts
      concept.relatedTo.forEach(related => {
        // Add node for related subject if it doesn't exist
        if (!newNodes.some(node => node.id === related.subject)) {
          newNodes.push({
            id: related.subject,
            label: related.subject.charAt(0).toUpperCase() + related.subject.slice(1),
            color: subjectColors[related.subject] || '#64748b',
            size: 12,
            type: 'subject'
          });
        }
        
        // Add node for related concept
        const relatedConceptId = `${related.subject}-${related.concept}`;
        if (!newNodes.some(node => node.id === relatedConceptId)) {
          newNodes.push({
            id: relatedConceptId,
            label: related.concept,
            color: subjectColors[related.subject] || '#64748b',
            size: 10,
            type: 'concept'
          });
          
          // Add edge from related subject to related concept
          newEdges.push({
            from: related.subject,
            to: relatedConceptId,
            color: subjectColors[related.subject] || '#64748b',
            width: 1,
            dashed: true
          });
        }
        
        // Add edge from current concept to related concept
        newEdges.push({
          from: `${currentSubject}-${concept.concept}`,
          to: relatedConceptId,
          color: '#94a3b8', // slate-400
          width: 1
        });
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [conceptConnections, currentSubject]);
  
  // Draw the graph
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set transform for zoom and center
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(node => node.id === edge.from);
      const toNode = nodes.find(node => node.id === edge.to);
      
      if (!fromNode || !toNode) return;
      
      // Skip if not showing all connections and neither node is selected
      if (!showAllConnections && selectedConcept && 
          fromNode.id !== selectedConcept && 
          toNode.id !== selectedConcept) {
        return;
      }
      
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      // Set line style
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = edge.width / zoomLevel;
      
      if (edge.dashed) {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.stroke();
    });
    
    // Draw nodes
    nodes.forEach(node => {
      // Skip if not showing all connections and node is not selected or connected to selected
      if (!showAllConnections && selectedConcept && 
          node.id !== selectedConcept && 
          !edges.some(edge => 
            (edge.from === selectedConcept && edge.to === node.id) || 
            (edge.to === selectedConcept && edge.from === node.id)
          )) {
        return;
      }
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / zoomLevel;
      ctx.stroke();
      
      // Draw label if enabled
      if (showLabels) {
        ctx.font = `${12 / zoomLevel}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw text with background for better readability
        const textWidth = ctx.measureText(node.label).width;
        const padding = 4 / zoomLevel;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(
          node.x - textWidth / 2 - padding,
          node.y + node.size + padding,
          textWidth + padding * 2,
          16 / zoomLevel
        );
        
        ctx.fillStyle = '#000000';
        ctx.fillText(node.label, node.x, node.y + node.size + 8 / zoomLevel);
      }
    });
    
    ctx.restore();
  }, [nodes, edges, zoomLevel, showLabels, selectedConcept, showAllConnections]);
  
  // Apply force-directed layout
  useEffect(() => {
    if (!physics || nodes.length === 0) return;
    
    const simulation = () => {
      // Skip if a node is being dragged
      if (draggedNode) return;
      
      // Apply forces
      const newNodes = [...nodes];
      
      // Repulsive force between nodes
      for (let i = 0; i < newNodes.length; i++) {
        if (newNodes[i].fixed) continue;
        
        let fx = 0;
        let fy = 0;
        
        for (let j = 0; j < newNodes.length; j++) {
          if (i === j) continue;
          
          const dx = newNodes[i].x - newNodes[j].x;
          const dy = newNodes[i].y - newNodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) continue;
          
          // Repulsive force (inverse square law)
          const force = 1000 / (distance * distance);
          fx += (dx / distance) * force;
          fy += (dy / distance) * force;
        }
        
        // Apply force
        newNodes[i].x += fx * 0.05;
        newNodes[i].y += fy * 0.05;
      }
      
      // Attractive force along edges
      edges.forEach(edge => {
        const fromNode = newNodes.find(node => node.id === edge.from);
        const toNode = newNodes.find(node => node.id === edge.to);
        
        if (!fromNode || !toNode || fromNode.fixed && toNode.fixed) return;
        
        const dx = fromNode.x - toNode.x;
        const dy = fromNode.y - toNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        // Attractive force (spring)
        const force = (distance - 100) * 0.05;
        
        if (!fromNode.fixed) {
          fromNode.x -= (dx / distance) * force;
          fromNode.y -= (dy / distance) * force;
        }
        
        if (!toNode.fixed) {
          toNode.x += (dx / distance) * force;
          toNode.y += (dy / distance) * force;
        }
      });
      
      setNodes(newNodes);
    };
    
    const interval = setInterval(simulation, 30);
    
    return () => clearInterval(interval);
  }, [nodes, edges, physics, draggedNode]);
  
  // Handle mouse events
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / zoomLevel;
    const y = (e.clientY - rect.top - canvas.height / 2) / zoomLevel;
    
    // Check if a node was clicked
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.size) {
        setDraggedNode(node);
        setSelectedConcept(node.id);
        return;
      }
    }
    
    // If no node was clicked, deselect
    setSelectedConcept(null);
  };
  
  const handleMouseMove = (e) => {
    if (!draggedNode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / zoomLevel;
    const y = (e.clientY - rect.top - canvas.height / 2) / zoomLevel;
    
    // Update node position
    const newNodes = nodes.map(node => {
      if (node.id === draggedNode.id) {
        return { ...node, x, y };
      }
      return node;
    });
    
    setNodes(newNodes);
  };
  
  const handleMouseUp = () => {
    setDraggedNode(null);
  };
  
  // Reset graph layout
  const resetLayout = () => {
    // Reset node positions based on layout
    const newNodes = [...nodes];
    
    if (graphLayout === 'radial') {
      // Center the current subject
      const centerNode = newNodes.find(node => node.id === currentSubject);
      if (centerNode) {
        centerNode.x = 0;
        centerNode.y = 0;
        centerNode.fixed = true;
      }
      
      // Position concept nodes in a circle around the subject
      const conceptNodes = newNodes.filter(node => 
        node.type === 'concept' && node.id.startsWith(currentSubject)
      );
      
      conceptNodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / conceptNodes.length;
        const radius = 150;
        
        node.x = Math.cos(angle) * radius;
        node.y = Math.sin(angle) * radius;
        node.fixed = false;
      });
      
      // Position other nodes randomly
      newNodes.forEach(node => {
        if (node.id !== currentSubject && !node.id.startsWith(currentSubject)) {
          node.x = (Math.random() - 0.5) * 400;
          node.y = (Math.random() - 0.5) * 400;
          node.fixed = false;
        }
      });
    } else if (graphLayout === 'force') {
      // Position all nodes randomly
      newNodes.forEach(node => {
        node.x = (Math.random() - 0.5) * 400;
        node.y = (Math.random() - 0.5) * 400;
        node.fixed = false;
      });
    } else if (graphLayout === 'hierarchical') {
      // Position in a hierarchical layout
      // Current subject at top
      const centerNode = newNodes.find(node => node.id === currentSubject);
      if (centerNode) {
        centerNode.x = 0;
        centerNode.y = -200;
        centerNode.fixed = true;
      }
      
      // Concept nodes in a row below
      const conceptNodes = newNodes.filter(node => 
        node.type === 'concept' && node.id.startsWith(currentSubject)
      );
      
      const conceptWidth = conceptNodes.length * 100;
      conceptNodes.forEach((node, index) => {
        node.x = -conceptWidth / 2 + index * 100 + 50;
        node.y = 0;
        node.fixed = false;
      });
      
      // Related subjects in a row at the bottom
      const subjectNodes = newNodes.filter(node => 
        node.type === 'subject' && node.id !== currentSubject
      );
      
      const subjectWidth = subjectNodes.length * 100;
      subjectNodes.forEach((node, index) => {
        node.x = -subjectWidth / 2 + index * 100 + 50;
        node.y = 200;
        node.fixed = false;
      });
      
      // Related concepts positioned randomly
      newNodes.forEach(node => {
        if (node.type === 'concept' && !node.id.startsWith(currentSubject)) {
          node.x = (Math.random() - 0.5) * 400;
          node.y = (Math.random() - 0.5) * 400;
          node.fixed = false;
        }
      });
    }
    
    setNodes(newNodes);
  };
  
  // Get selected node info
  const getSelectedNodeInfo = () => {
    if (!selectedConcept) return null;
    
    const node = nodes.find(node => node.id === selectedConcept);
    if (!node) return null;
    
    // Get connected nodes
    const connectedNodes = nodes.filter(n => 
      edges.some(edge => 
        (edge.from === selectedConcept && edge.to === n.id) || 
        (edge.to === selectedConcept && edge.from === n.id)
      )
    );
    
    return {
      node,
      connectedNodes
    };
  };
  
  // Export graph as image
  const exportGraph = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${currentSubject}-knowledge-graph.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Graph Controls */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Graph Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select value={graphLayout} onValueChange={(value) => {
                  setGraphLayout(value);
                  resetLayout();
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="force">Force-Directed</SelectItem>
                    <SelectItem value="hierarchical">Hierarchical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="zoom-level">Zoom Level</Label>
                  <span className="text-sm">{zoomLevel.toFixed(1)}x</span>
                </div>
                <Slider
                  id="zoom-level"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[zoomLevel]}
                  onValueChange={(value) => setZoomLevel(value[0])}
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
                <Label htmlFor="show-all" className="cursor-pointer">Show All Connections</Label>
                <Switch
                  id="show-all"
                  checked={showAllConnections}
                  onCheckedChange={setShowAllConnections}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="physics" className="cursor-pointer">Enable Physics</Label>
                <Switch
                  id="physics"
                  checked={physics}
                  onCheckedChange={setPhysics}
                />
              </div>
              
              <div className="pt-2 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={resetLayout} title="Reset Layout">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))} title="Zoom In">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))} title="Zoom Out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={exportGraph} title="Export Image">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Graph Visualization */}
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Knowledge Graph</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetLayout} title="Reset View">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportGraph} title="Download Image">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Full Screen">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  width="800" 
                  height="600"
                  className="w-full h-[500px] border rounded-md"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {nodes.length} nodes, {edges.length} connections
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAllConnections(!showAllConnections)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showAllConnections ? 'Hide' : 'Show'} All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Selected Node Info */}
      {selectedConcept && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Selected Node Information</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const info = getSelectedNodeInfo();
              if (!info) return null;
              
              const { node, connectedNodes } = info;
              
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{node.label}</h3>
                    <Badge className="mt-1" style={{ backgroundColor: node.color }}>
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Connections ({connectedNodes.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {connectedNodes.map(connectedNode => {
                        // Find the edge between the nodes
                        const edge = edges.find(edge => 
                          (edge.from === selectedConcept && edge.to === connectedNode.id) || 
                          (edge.to === selectedConcept && edge.from === connectedNode.id)
                        );
                        
                        // Find the related concept if this is a connection between concepts
                        let description = '';
                        if (node.type === 'concept' && connectedNode.type === 'concept') {
                          const nodeSubject = node.id.split('-')[0];
                          const connectedSubject = connectedNode.id.split('-')[0];
                          const nodeConcept = node.id.substring(nodeSubject.length + 1);
                          const connectedConcept = connectedNode.id.substring(connectedSubject.length + 1);
                          
                          if (conceptConnections[nodeSubject]) {
                            const concept = conceptConnections[nodeSubject].find(c => c.concept === nodeConcept);
                            if (concept) {
                              const related = concept.relatedTo.find(r => 
                                r.subject === connectedSubject && r.concept === connectedConcept
                              );
                              if (related) {
                                description = related.description;
                              }
                            }
                          }
                        }
                        
                        return (
                          <div 
                            key={connectedNode.id} 
                            className="flex items-start gap-2 p-2 border rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => setSelectedConcept(connectedNode.id)}
                          >
                            <div 
                              className="w-3 h-3 rounded-full mt-1"
                              style={{ backgroundColor: connectedNode.color }}
                            ></div>
                            <div>
                              <div className="font-medium">{connectedNode.label}</div>
                              {description && (
                                <div className="text-xs text-muted-foreground mt-1">{description}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeGraph;
