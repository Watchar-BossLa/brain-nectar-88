import React, { useState, useEffect } from 'react';
import { useKnowledgeGraph, useGraphVisualization } from '@/services/knowledge-graph';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Map, 
  Edit, 
  Trash2, 
  Share2,
  Loader2,
  Search,
  X
} from 'lucide-react';

/**
 * Knowledge Map Manager Component
 * Allows users to create and manage knowledge maps
 * @param {Object} props - Component props
 * @param {Function} props.onSelectMap - Callback when a map is selected
 * @returns {React.ReactElement} Knowledge map manager component
 */
const KnowledgeMapManager = ({ onSelectMap }) => {
  const { user } = useAuth();
  const knowledgeGraph = useKnowledgeGraph();
  const graphVisualization = useGraphVisualization();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMapData, setNewMapData] = useState({ name: '', description: '', tags: [], isPublic: false });
  const [newTagInput, setNewTagInput] = useState('');
  const [creatingMap, setCreatingMap] = useState(false);
  
  // Load user maps
  useEffect(() => {
    if (!user) return;
    
    const loadMaps = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!knowledgeGraph.initialized) {
          await knowledgeGraph.initialize(user.id);
        }
        
        if (!graphVisualization.initialized) {
          await graphVisualization.initialize();
        }
        
        const data = await graphVisualization.getUserMaps(user.id);
        setMaps(data);
        setError(null);
      } catch (err) {
        console.error('Error loading maps:', err);
        setError(err.message || 'Failed to load maps');
      } finally {
        setLoading(false);
      }
    };
    
    loadMaps();
  }, [user, knowledgeGraph, graphVisualization]);
  
  // Handle map selection
  const handleSelectMap = (map) => {
    if (onSelectMap) {
      onSelectMap(map);
    }
  };
  
  // Handle new map form change
  const handleNewMapChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMapData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    
    setNewMapData(prev => ({
      ...prev,
      tags: [...prev.tags, newTagInput.trim()]
    }));
    
    setNewTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setNewMapData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle creating a new map
  const handleCreateMap = async () => {
    if (!user || !newMapData.name.trim()) return;
    
    try {
      setCreatingMap(true);
      
      const mapData = {
        userId: user.id,
        name: newMapData.name.trim(),
        description: newMapData.description.trim(),
        tags: newMapData.tags,
        isPublic: newMapData.isPublic
      };
      
      const newMap = await graphVisualization.createMap(mapData);
      
      // Add new map to list
      setMaps(prev => [newMap, ...prev]);
      
      // Reset form
      setNewMapData({ name: '', description: '', tags: [], isPublic: false });
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating map:', err);
      alert('Failed to create map: ' + (err.message || 'Unknown error'));
    } finally {
      setCreatingMap(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load knowledge maps</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Knowledge Maps</CardTitle>
            <CardDescription>
              {maps.length === 0
                ? 'Create your first knowledge map'
                : `You have ${maps.length} knowledge map${maps.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Map
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Knowledge Map</DialogTitle>
                <DialogDescription>
                  Create a new map to visualize and organize concepts
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Map Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newMapData.name}
                    onChange={handleNewMapChange}
                    placeholder="Enter map name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newMapData.description}
                    onChange={handleNewMapChange}
                    placeholder="Enter map description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tags
                  </label>
                  <div className="flex">
                    <Input
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleAddTag} 
                      variant="outline" 
                      className="ml-2"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {newMapData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newMapData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={newMapData.isPublic}
                    onChange={handleNewMapChange}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    Make this map public
                  </label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateMap}
                  disabled={!newMapData.name.trim() || creatingMap}
                >
                  {creatingMap ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Map'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {maps.length === 0 ? (
          <div className="text-center py-8">
            <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Maps</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first knowledge map to visualize concepts and their relationships.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Map
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {maps.map((map) => (
              <div
                key={map.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectMap(map)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Map className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">{map.name}</h3>
                      {map.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {map.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {map.is_public && (
                    <Badge variant="outline" className="flex items-center">
                      <Share2 className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
                
                {map.tags && map.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 ml-9">
                    {map.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeMapManager;
