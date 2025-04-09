import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useKnowledgeMap, useConceptGraph } from '@/services/knowledge-visualization';
import { ConceptEditor, RelationshipEditor } from '@/components/knowledge-visualization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Network, 
  Plus, 
  ArrowLeft, 
  Share2, 
  Settings, 
  Trash2, 
  Tag,
  Users,
  Route,
  Loader2,
  Lock,
  Globe
} from 'lucide-react';

/**
 * Knowledge Map Detail Page
 * @returns {React.ReactElement} Knowledge map detail page
 */
const KnowledgeMapDetail = () => {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const knowledgeMap = useKnowledgeMap();
  const conceptGraph = useConceptGraph();
  
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [showConceptEditor, setShowConceptEditor] = useState(false);
  const [showRelationshipEditor, setShowRelationshipEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [deletingMap, setDeletingMap] = useState(false);
  
  // Load map details
  useEffect(() => {
    if (!user || !mapId) return;
    
    const loadMap = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!knowledgeMap.initialized) {
          await knowledgeMap.initialize(user.id);
        }
        
        if (!conceptGraph.initialized) {
          await conceptGraph.initialize(user.id);
        }
        
        // Get map details
        const mapDetails = await knowledgeMap.getMapById(mapId);
        setMap(mapDetails);
      } catch (error) {
        console.error('Error loading map:', error);
        toast({
          title: 'Error',
          description: 'Failed to load map details',
          variant: 'destructive'
        });
        navigate('/knowledge-visualization-system');
      } finally {
        setLoading(false);
      }
    };
    
    loadMap();
  }, [user, mapId, knowledgeMap, conceptGraph, navigate]);
  
  // Handle back to maps
  const handleBackToMaps = () => {
    navigate('/knowledge-visualization-system');
  };
  
  // Handle add concept
  const handleAddConcept = () => {
    setShowConceptEditor(true);
  };
  
  // Handle concept save
  const handleConceptSave = async (concept) => {
    setShowConceptEditor(false);
    
    // Refresh map details
    try {
      const mapDetails = await knowledgeMap.getMapById(mapId);
      setMap(mapDetails);
    } catch (error) {
      console.error('Error refreshing map:', error);
    }
  };
  
  // Handle cancel concept
  const handleCancelConcept = () => {
    setShowConceptEditor(false);
  };
  
  // Handle add relationship
  const handleAddRelationship = () => {
    setShowRelationshipEditor(true);
  };
  
  // Handle relationship save
  const handleRelationshipSave = async (relationship) => {
    setShowRelationshipEditor(false);
    
    // Refresh map details
    try {
      const mapDetails = await knowledgeMap.getMapById(mapId);
      setMap(mapDetails);
    } catch (error) {
      console.error('Error refreshing map:', error);
    }
  };
  
  // Handle cancel relationship
  const handleCancelRelationship = () => {
    setShowRelationshipEditor(false);
  };
  
  // Handle delete map
  const handleDeleteMap = async () => {
    if (!user || !mapId) return;
    
    try {
      setDeletingMap(true);
      
      // Delete the map
      await knowledgeMap.deleteMap(mapId);
      
      toast({
        title: 'Success',
        description: 'Knowledge map deleted successfully',
      });
      
      navigate('/knowledge-visualization-system');
    } catch (error) {
      console.error('Error deleting map:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete map',
        variant: 'destructive'
      });
    } finally {
      setDeletingMap(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center mb-4">
              <Button variant="outline" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Skeleton className="h-8 w-64" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Render if map not found
  if (!map) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col space-y-6">
            <Button variant="outline" onClick={handleBackToMaps} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Maps
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>Map Not Found</CardTitle>
                <CardDescription>
                  The knowledge map you're looking for doesn't exist or you don't have access to it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Please check the URL or go back to your maps</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleBackToMaps}>
                  Go to My Maps
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Check if user can edit
  const canEdit = map.isOwner || map.role === 'editor' || map.role === 'admin';
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <Button variant="outline" onClick={handleBackToMaps} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Maps
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{map.title}</h1>
                  {map.is_public ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {map.description || 'No description'}
                </p>
              </div>
              <div className="flex gap-2">
                {canEdit && (
                  <Button variant="outline" onClick={handleAddConcept}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Concept
                  </Button>
                )}
                
                {map.isOwner && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Map Settings</DialogTitle>
                        <DialogDescription>
                          Manage your knowledge map settings
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Sharing</h3>
                          <p className="text-sm text-muted-foreground">
                            {map.is_public ? 
                              'This map is public and can be viewed by anyone with the link.' : 
                              'This map is private and can only be viewed by you and people you share it with.'}
                          </p>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Map
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {map.tags && map.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                            {(!map.tags || map.tags.length === 0) && (
                              <p className="text-sm text-muted-foreground">No tags</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium text-destructive">Danger Zone</h3>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteMap}
                            disabled={deletingMap}
                          >
                            {deletingMap ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Map
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          {showConceptEditor ? (
            <div>
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={handleCancelConcept}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Button>
              <ConceptEditor 
                mapId={mapId}
                onSave={handleConceptSave}
                onCancel={handleCancelConcept}
              />
            </div>
          ) : showRelationshipEditor ? (
            <div>
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={handleCancelRelationship}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Button>
              <RelationshipEditor 
                mapId={mapId}
                concepts={map.concepts || []}
                onSave={handleRelationshipSave}
                onCancel={handleCancelRelationship}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="map" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span>Map</span>
                    </TabsTrigger>
                    <TabsTrigger value="concepts" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span>Concepts</span>
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span>Analysis</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="map">
                    <Card>
                      <CardHeader>
                        <CardTitle>Knowledge Map</CardTitle>
                        <CardDescription>
                          Visual representation of your knowledge
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Interactive Map Visualization</h3>
                          <p className="text-muted-foreground mb-4">
                            This feature is coming soon!
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {canEdit && map.concepts && map.concepts.length >= 2 && (
                          <Button onClick={handleAddRelationship}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Relationship
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="concepts">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Concepts</CardTitle>
                            <CardDescription>
                              {map.concepts?.length || 0} concepts in this map
                            </CardDescription>
                          </div>
                          {canEdit && (
                            <Button onClick={handleAddConcept}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Concept
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {map.concepts && map.concepts.length > 0 ? (
                          <div className="space-y-4">
                            {map.concepts.map(concept => (
                              <Card key={concept.id} className="overflow-hidden">
                                <div 
                                  className="h-2" 
                                  style={{ backgroundColor: concept.color || '#4f46e5' }}
                                />
                                <CardHeader className="py-4">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{concept.title}</CardTitle>
                                    <Badge variant="outline">
                                      {concept.concept_type || 'concept'}
                                    </Badge>
                                  </div>
                                  <CardDescription className="line-clamp-2">
                                    {concept.description || 'No description'}
                                  </CardDescription>
                                </CardHeader>
                                {concept.content && (
                                  <CardContent className="py-0">
                                    <div className="text-sm">
                                      {concept.content}
                                    </div>
                                  </CardContent>
                                )}
                                {canEdit && (
                                  <CardFooter className="py-2">
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                  </CardFooter>
                                )}
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Concepts Yet</h3>
                            <p className="text-muted-foreground mb-4">
                              Add concepts to start building your knowledge map
                            </p>
                            {canEdit && (
                              <Button onClick={handleAddConcept}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Concept
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="analysis">
                    <Card>
                      <CardHeader>
                        <CardTitle>Map Analysis</CardTitle>
                        <CardDescription>
                          Insights and analysis of your knowledge map
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Map Analysis</h3>
                          <p className="text-muted-foreground mb-4">
                            This feature is coming soon!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Map Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Created</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(map.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Last Updated</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(map.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Visibility</h3>
                      <p className="text-sm text-muted-foreground">
                        {map.is_public ? 'Public' : 'Private'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Your Role</h3>
                      <p className="text-sm text-muted-foreground">
                        {map.isOwner ? 'Owner' : map.role || 'Viewer'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {map.tags && map.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {(!map.tags || map.tags.length === 0) && (
                          <span className="text-xs text-muted-foreground">No tags</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Paths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <Route className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No learning paths yet
                      </p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Path
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Collaborators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No collaborators yet
                      </p>
                      {map.isOwner && (
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Map
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default KnowledgeMapDetail;
