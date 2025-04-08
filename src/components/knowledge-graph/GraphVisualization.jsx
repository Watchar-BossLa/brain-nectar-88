import React, { useEffect, useRef, useState } from 'react';
import { useKnowledgeGraph, useGraphVisualization } from '@/services/knowledge-graph';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Search,
  Filter,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react';
// Note: This component requires the d3 library (v7.8.5 or later)
// The dependency has been added to package.json and should be installed by the CI/CD pipeline
import * as d3 from 'd3';

/**
 * Graph Visualization Component
 * Renders an interactive visualization of a knowledge graph
 * @param {Object} props - Component props
 * @param {Object} props.graph - Graph data
 * @param {Array<Object>} props.graph.nodes - Graph nodes
 * @param {Array<Object>} props.graph.edges - Graph edges
 * @param {Function} [props.onNodeClick] - Callback when a node is clicked
 * @param {Function} [props.onNodeDoubleClick] - Callback when a node is double-clicked
 * @param {boolean} [props.loading=false] - Whether the graph is loading
 * @param {Object} [props.options] - Visualization options
 * @returns {React.ReactElement} Graph visualization component
 */
const GraphVisualization = ({
  graph,
  onNodeClick,
  onNodeDoubleClick,
  loading = false,
  options = {}
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const graphVisualization = useGraphVisualization();

  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Initialize visualization
  useEffect(() => {
    if (loading || !graph || !graph.nodes || !svgRef.current) return;

    // Check if d3 is available
    if (typeof d3 === 'undefined') {
      console.error('D3 library is not available. Using fallback visualization.');
      return;
    }

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    setDimensions({ width, height });

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        setZoom(event.transform.k);
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Create container for graph
    const g = svg.append('g');

    // Generate layout if not provided
    let layout;
    if (graph.nodes.every(node => node.x !== undefined && node.y !== undefined)) {
      // Use provided layout
      layout = {
        nodes: graph.nodes.map(node => ({
          id: node.id,
          x: node.x,
          y: node.y
        })),
        edges: graph.edges
      };
    } else {
      // Generate layout
      layout = graphVisualization.generateForceDirectedLayout(graph, {
        width,
        height,
        iterations: 100
      });
    }

    // Create links
    const links = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graph.edges)
      .join('line')
      .attr('stroke-width', d => Math.max(1, d.strength * 3))
      .attr('x1', d => {
        const source = layout.nodes.find(node => node.id === d.source);
        return source ? source.x : 0;
      })
      .attr('y1', d => {
        const source = layout.nodes.find(node => node.id === d.source);
        return source ? source.y : 0;
      })
      .attr('x2', d => {
        const target = layout.nodes.find(node => node.id === d.target);
        return target ? target.x : 0;
      })
      .attr('y2', d => {
        const target = layout.nodes.find(node => node.id === d.target);
        return target ? target.y : 0;
      });

    // Create nodes
    const nodes = g.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .join('g')
      .attr('transform', d => {
        const node = layout.nodes.find(n => n.id === d.id);
        return `translate(${node ? node.x : 0},${node ? node.y : 0})`;
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (onNodeClick) onNodeClick(d);
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        if (onNodeDoubleClick) onNodeDoubleClick(d);
      });

    // Add circles to nodes
    nodes.append('circle')
      .attr('r', 8)
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Add labels to nodes
    nodes.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.label)
      .attr('font-size', '10px')
      .attr('fill', '#333');

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Create simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        links
          .attr('x1', d => {
            const source = graph.nodes.find(node => node.id === d.source);
            return source ? source.x : 0;
          })
          .attr('y1', d => {
            const source = graph.nodes.find(node => node.id === d.source);
            return source ? source.y : 0;
          })
          .attr('x2', d => {
            const target = graph.nodes.find(node => node.id === d.target);
            return target ? target.x : 0;
          })
          .attr('y2', d => {
            const target = graph.nodes.find(node => node.id === d.target);
            return target ? target.y : 0;
          });

        nodes.attr('transform', d => `translate(${d.x},${d.y})`);
      });

    // Stop simulation after a while
    setTimeout(() => {
      simulation.stop();
    }, 2000);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graph, loading, graphVisualization, onNodeClick, onNodeDoubleClick]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setDimensions({ width, height });

        if (svgRef.current) {
          d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentZoom = d3.zoomTransform(svg.node());
      const newZoom = d3.zoomIdentity.translate(currentZoom.x, currentZoom.y).scale(currentZoom.k * 1.2);
      svg.transition().duration(300).call(d3.zoom().transform, newZoom);
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentZoom = d3.zoomTransform(svg.node());
      const newZoom = d3.zoomIdentity.translate(currentZoom.x, currentZoom.y).scale(currentZoom.k / 1.2);
      svg.transition().duration(300).call(d3.zoom().transform, newZoom);
    }
  };

  // Handle reset zoom
  const handleResetZoom = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(d3.zoom().transform, d3.zoomIdentity);
    }
  };

  // Get node color based on node properties
  const getNodeColor = (node) => {
    // In a real implementation, this would use more sophisticated
    // methods to determine node color based on node properties

    // For now, we'll use a simple approach
    if (node.tags && node.tags.includes('key-concept')) {
      return '#ff6b6b'; // Red for key concepts
    } else if (node.source === 'document') {
      return '#4ecdc4'; // Teal for document concepts
    } else if (node.source === 'user') {
      return '#1a535c'; // Dark blue for user-created concepts
    } else {
      return '#f7b801'; // Yellow for other concepts
    }
  };

  // Render fallback visualization if D3 is not available
  const renderFallbackVisualization = () => {
    if (!graph || !graph.nodes) return null;

    return (
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">Knowledge Graph (Simple View)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Interactive visualization requires the D3 library. Showing simplified view.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Concepts ({graph.nodes.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {graph.nodes.slice(0, 9).map(node => (
                <div
                  key={node.id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-muted/50"
                  onClick={() => handleNodeClick(node)}
                >
                  {node.label}
                </div>
              ))}
              {graph.nodes.length > 9 && (
                <div className="p-2 border rounded-md text-center text-muted-foreground">
                  +{graph.nodes.length - 9} more
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Relationships ({graph.edges.length})</h4>
            <div className="space-y-1">
              {graph.edges.slice(0, 5).map((edge, index) => {
                const source = graph.nodes.find(n => n.id === edge.source);
                const target = graph.nodes.find(n => n.id === edge.target);
                return (
                  <div key={index} className="text-sm">
                    {source?.label || 'Unknown'} → {target?.label || 'Unknown'}
                  </div>
                );
              })}
              {graph.edges.length > 5 && (
                <div className="text-sm text-muted-foreground">
                  +{graph.edges.length - 5} more relationships
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <Card className={`w-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: isFullscreen ? '100vh' : '600px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-64 w-64 rounded-full mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <Card className={`w-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: isFullscreen ? '100vh' : '600px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Concepts</h3>
                <p className="text-sm text-muted-foreground">
                  No concepts found in the knowledge graph.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if D3 is available
  const isD3Available = typeof d3 !== 'undefined';

  return (
    <Card className={`w-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardContent className="p-0">
        {!isD3Available ? (
          // Render fallback visualization if D3 is not available
          renderFallbackVisualization()
        ) : (
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: isFullscreen ? '100vh' : '600px' }}
          >
            {/* Graph controls */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetZoom}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Graph SVG */}
            <svg ref={svgRef} className="w-full h-full" />

            {/* Selected node info */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-md shadow-md z-10 max-w-md">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                {selectedNode.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedNode.description}
                  </p>
                )}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedNode.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphVisualization;
