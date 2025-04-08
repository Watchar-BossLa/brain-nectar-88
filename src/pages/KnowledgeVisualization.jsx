import React, { useState, useEffect } from 'react';
import { useKnowledgeGraph, useGraphVisualization, useLearningPathGenerator } from '@/services/knowledge-graph';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import { GraphVisualization, KnowledgeMapManager, LearningPathVisualization, ConceptExplorer } from '@/components/knowledge-graph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Network, 
  Map, 
  BookOpen, 
  Lightbulb,
  FileText,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';

/**
 * Knowledge Visualization Page
 * Page for interactive knowledge visualization
 * @returns {React.ReactElement} Knowledge visualization page
 */
const KnowledgeVisualization = () => {
  const { user } = useAuth();
  const knowledgeGraph = useKnowledgeGraph();
  const graphVisualization = useGraphVisualization();
  const learningPathGenerator = useLearningPathGenerator();
  
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [createPathDialogOpen, setCreatePathDialogOpen] = useState(false);
  const [newPathData, setNewPathData] = useState({ name: '', description: '', startConceptId: '', endConceptId: '' });
  const [creatingPath, setCreatingPath] = useState(false);
  const [pathError, setPathError] = useState(null);
  
  // Initialize services
  useEffect(() => {
    if (user) {
      const initializeServices = async () => {
        try {
          await knowledgeGraph.initialize(user.id);
          await graphVisualization.initialize();
          await learningPathGenerator.initialize();
        } catch (err) {
          console.error('Error initializing services:', err);
          setError('Failed to initialize knowledge visualization services');
        }
      };
      
      initializeServices();
    }
  }, [user, knowledgeGraph, graphVisualization, learningPathGenerator]);
  
  // Load graph when tab changes
  useEffect(() => {
    if (!user || !knowledgeGraph.initialized) return;
    
    const loadGraph = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let graphData;
        
        if (activeTab === 'explore') {
          // Load full graph
          graphData = await knowledgeGraph.getGraph();
        } else if (activeTab === 'map' && selectedMap) {
          // Load map
          const mapData = await graphVisualization.getMap(selectedMap.id);
          graphData = {
            nodes: mapData.concepts,
            edges: mapData.relationships
          };
        } else if (activeTab === 'path' && selectedPath) {
          // Load path
          const pathData = await learningPathGenerator.getLearningPath(selectedPath.id);
          
          // Convert path to graph
          const nodes = pathData.steps.map(step => ({
            id: step.concept.id,
            label: step.concept.name,
            description: step.concept.description,
            tags: step.concept.tags,
            source: step.concept.source,
            sourceId: step.concept.source_id
          }));
          
          const edges = [];
          for (let i = 0; i < pathData.steps.length - 1; i++) {
            edges.push({
              source: pathData.steps[i].concept.id,
              target: pathData.steps[i + 1].concept.id,
              type: 'path',
              strength: 1
            });
          }
          
          graphData = { nodes, edges };
        }
        
        setGraph(graphData);
      } catch (err) {
        console.error('Error loading graph:', err);
        setError(err.message || 'Failed to load graph');
      } finally {
        setLoading(false);
      }
    };
    
    loadGraph();
  }, [activeTab, selectedMap, selectedPath, user, knowledgeGraph]);
  
  // Handle map selection
  const handleSelectMap = (map) => {
    setSelectedMap(map);
    setActiveTab('map');
  };
  
  // Handle concept selection
  const handleSelectConcept = (concept) => {
    setSelectedConcept(concept);
    
    // If creating a path, update the form
    if (createPathDialogOpen) {
      if (!newPathData.startConceptId) {
        setNewPathData(prev => ({ ...prev, startConceptId: concept.id }));
      } else if (!newPathData.endConceptId) {
        setNewPathData(prev => ({ ...prev, endConceptId: concept.id }));
      }
    }
  };
  
  // Handle node click in visualization
  const handleNodeClick = (node) => {
    setSelectedConcept(node);
  };
  
  // Handle new path form change
  const handleNewPathChange = (e) => {
    const { name, value } = e.target;
    setNewPathData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle creating a new learning path
  const handleCreatePath = async () => {
    if (!user || !newPathData.name.trim() || !newPathData.startConceptId || !newPathData.endConceptId) {
      setPathError('Please fill in all required fields');
      return;
    }
    
    try {
      setCreatingPath(true);
      setPathError(null);
      
      const pathData = {
        userId: user.id,
        name: newPathData.name.trim(),
        description: newPathData.description.trim(),
        startConceptId: newPathData.startConceptId,
        endConceptId: newPathData.endConceptId
      };
      
      const newPath = await learningPathGenerator.generatePath(pathData);
      
      // Select the new path
      setSelectedPath(newPath);
      setActiveTab('path');
      
      // Reset form
      setNewPathData({ name: '', description: '', startConceptId: '', endConceptId: '' });
      setCreatePathDialogOpen(false);
    } catch (err) {
      console.error('Error creating path:', err);
      setPathError(err.message || 'Failed to create learning path');
    } finally {
      setCreatingPath(false);
    }
  };
  
  // Reset path form
  const handleResetPathForm = () => {
    setNewPathData({ name: '', description: '', startConceptId: '', endConceptId: '' });
    setPathError(null);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Interactive Knowledge Visualization</h1>
        <p className="text-lg mb-6">
          Visualize, explore, and navigate your knowledge graph
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs defaultValue="concepts" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="concepts" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Concepts</span>
                </TabsTrigger>
                <TabsTrigger value="maps" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Maps</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="concepts">
                <ConceptExplorer onSelectConcept={handleSelectConcept} />
              </TabsContent>
              
              <TabsContent value="maps">
                <KnowledgeMapManager onSelectMap={handleSelectMap} />
              </TabsContent>
            </Tabs>
            
            {/* Create Learning Path Dialog */}
            <Dialog open={createPathDialogOpen} onOpenChange={setCreatePathDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Learning Path</DialogTitle>
                  <DialogDescription>
                    Generate a learning path between two concepts
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Path Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={newPathData.name}
                      onChange={handleNewPathChange}
                      placeholder="Enter path name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newPathData.description}
                      onChange={handleNewPathChange}
                      placeholder="Enter path description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Start Concept
                      </label>
                      <div className="p-3 border rounded-md">
                        {newPathData.startConceptId ? (
                          <div>
                            <p className="font-medium">
                              {selectedConcept && selectedConcept.id === newPathData.startConceptId
                                ? selectedConcept.label
                                : 'Selected Concept'
                              }
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => setNewPathData(prev => ({ ...prev, startConceptId: '' }))}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Clear
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Select a concept from the explorer
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        End Concept
                      </label>
                      <div className="p-3 border rounded-md">
                        {newPathData.endConceptId ? (
                          <div>
                            <p className="font-medium">
                              {selectedConcept && selectedConcept.id === newPathData.endConceptId
                                ? selectedConcept.label
                                : 'Selected Concept'
                              }
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => setNewPathData(prev => ({ ...prev, endConceptId: '' }))}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Clear
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Select a concept from the explorer
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {pathError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{pathError}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={handleResetPathForm}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleCreatePath}
                    disabled={!newPathData.name.trim() || !newPathData.startConceptId || !newPathData.endConceptId || creatingPath}
                  >
                    {creatingPath ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Path'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="explore" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Explore</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="flex items-center gap-2"
                  disabled={!selectedMap}
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="path" 
                  className="flex items-center gap-2"
                  disabled={!selectedPath}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Path</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="explore">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Knowledge Graph</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCreatePathDialogOpen(true)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Create Path
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/document-analysis'}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Add Documents
                      </Button>
                    </div>
                  </div>
                  
                  <GraphVisualization 
                    graph={graph} 
                    loading={loading}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                {selectedMap ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">{selectedMap.name}</h2>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab('explore')}
                      >
                        Back to Explore
                      </Button>
                    </div>
                    
                    {selectedMap.description && (
                      <p className="text-muted-foreground">
                        {selectedMap.description}
                      </p>
                    )}
                    
                    <GraphVisualization 
                      graph={graph} 
                      loading={loading}
                      onNodeClick={handleNodeClick}
                    />
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Map Selected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a map from the Maps tab to visualize it.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="path">
                {selectedPath ? (
                  <LearningPathVisualization 
                    pathId={selectedPath.id}
                    onStepClick={handleNodeClick}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Path Selected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create a learning path to visualize it.
                        </p>
                        <Button onClick={() => setCreatePathDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Path
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default KnowledgeVisualization;
