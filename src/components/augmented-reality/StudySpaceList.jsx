import React, { useState, useEffect } from 'react';
import { useARStudyEnvironment } from '@/services/augmented-reality';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Cube, 
  Plus, 
  Search, 
  Users,
  Loader2,
  Globe,
  Lock,
  Trash2,
  Edit,
  Copy
} from 'lucide-react';

/**
 * Study Space List Component
 * Displays a list of user's AR study spaces and allows creating new ones
 * @param {Object} props - Component props
 * @param {Function} [props.onSelectSpace] - Callback when a space is selected
 * @returns {React.ReactElement} Study space list component
 */
const StudySpaceList = ({ onSelectSpace }) => {
  const { user } = useAuth();
  const arStudyEnvironment = useARStudyEnvironment();
  const [spaces, setSpaces] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpaceData, setNewSpaceData] = useState({ 
    name: '', 
    description: '', 
    environmentType: 'classroom',
    isPublic: false,
    useTemplate: false,
    templateId: ''
  });
  const [creatingSpace, setCreatingSpace] = useState(false);
  
  // Load user's spaces and templates
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!arStudyEnvironment.initialized) {
          await arStudyEnvironment.initialize(user.id);
        }
        
        // Load spaces
        const userSpaces = await arStudyEnvironment.getUserStudySpaces();
        setSpaces(userSpaces);
        
        // Load templates
        const environmentTemplates = await arStudyEnvironment.getEnvironmentTemplates();
        setTemplates(environmentTemplates);
        
        setError(null);
      } catch (err) {
        console.error('Error loading spaces:', err);
        setError(err.message || 'Failed to load study spaces');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, arStudyEnvironment]);
  
  // Handle space selection
  const handleSelectSpace = (space) => {
    if (onSelectSpace) {
      onSelectSpace(space);
    }
  };
  
  // Handle new space form change
  const handleNewSpaceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSpaceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setNewSpaceData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle creating a new space
  const handleCreateSpace = async () => {
    if (!user || !newSpaceData.name.trim() || !newSpaceData.environmentType) return;
    
    try {
      setCreatingSpace(true);
      
      let newSpace;
      
      if (newSpaceData.useTemplate && newSpaceData.templateId) {
        // Create from template
        newSpace = await arStudyEnvironment.createSpaceFromTemplate(
          newSpaceData.templateId,
          {
            name: newSpaceData.name.trim(),
            description: newSpaceData.description.trim(),
            isPublic: newSpaceData.isPublic
          }
        );
      } else {
        // Create new space
        newSpace = await arStudyEnvironment.createStudySpace({
          name: newSpaceData.name.trim(),
          description: newSpaceData.description.trim(),
          environmentType: newSpaceData.environmentType,
          isPublic: newSpaceData.isPublic
        });
      }
      
      // Add new space to list
      setSpaces(prev => [newSpace, ...prev]);
      
      // Reset form
      setNewSpaceData({ 
        name: '', 
        description: '', 
        environmentType: 'classroom',
        isPublic: false,
        useTemplate: false,
        templateId: ''
      });
      setCreateDialogOpen(false);
      
      toast({
        title: 'Space Created',
        description: 'Your AR study space has been created successfully',
      });
    } catch (err) {
      console.error('Error creating space:', err);
      toast({
        title: 'Creation Failed',
        description: err.message || 'An error occurred while creating the study space',
        variant: 'destructive'
      });
    } finally {
      setCreatingSpace(false);
    }
  };
  
  // Handle deleting a space
  const handleDeleteSpace = async (e, spaceId) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!confirm('Are you sure you want to delete this study space?')) {
      return;
    }
    
    try {
      await arStudyEnvironment.deleteStudySpace(spaceId);
      
      // Remove space from state
      setSpaces(spaces.filter(space => space.id !== spaceId));
      
      toast({
        title: 'Space Deleted',
        description: 'The study space has been deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting space:', err);
      
      toast({
        title: 'Deletion Failed',
        description: err.message || 'An error occurred while deleting the study space',
        variant: 'destructive'
      });
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
          <CardDescription>Failed to load study spaces</CardDescription>
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
            <CardTitle>AR Study Spaces</CardTitle>
            <CardDescription>
              {spaces.length === 0
                ? 'Create your first AR study space'
                : `You have ${spaces.length} study space${spaces.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Space
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New AR Study Space</DialogTitle>
                <DialogDescription>
                  Create a new augmented reality environment for studying
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Space Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newSpaceData.name}
                    onChange={handleNewSpaceChange}
                    placeholder="Enter space name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newSpaceData.description}
                    onChange={handleNewSpaceChange}
                    placeholder="Enter space description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useTemplate"
                      name="useTemplate"
                      checked={newSpaceData.useTemplate}
                      onCheckedChange={(checked) => 
                        setNewSpaceData(prev => ({ ...prev, useTemplate: checked }))
                      }
                    />
                    <Label htmlFor="useTemplate">
                      Use a template
                    </Label>
                  </div>
                </div>
                
                {newSpaceData.useTemplate ? (
                  <div className="space-y-2">
                    <Label htmlFor="templateId">Template</Label>
                    <Select
                      value={newSpaceData.templateId}
                      onValueChange={(value) => handleSelectChange('templateId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="environmentType">Environment Type</Label>
                    <Select
                      value={newSpaceData.environmentType}
                      onValueChange={(value) => handleSelectChange('environmentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    name="isPublic"
                    checked={newSpaceData.isPublic}
                    onCheckedChange={(checked) => 
                      setNewSpaceData(prev => ({ ...prev, isPublic: checked }))
                    }
                  />
                  <Label htmlFor="isPublic">
                    Make this space public (discoverable by other users)
                  </Label>
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
                  onClick={handleCreateSpace}
                  disabled={!newSpaceData.name.trim() || creatingSpace || (newSpaceData.useTemplate && !newSpaceData.templateId)}
                >
                  {creatingSpace ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Space'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {spaces.length === 0 ? (
          <div className="text-center py-8">
            <Cube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Study Spaces</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first AR study space to start learning in augmented reality.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectSpace(space)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Cube className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">{space.name}</h3>
                      {space.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {space.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">
                          {space.environment_type}
                        </Badge>
                        {space.is_public ? (
                          <Badge variant="outline" className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                        toast({
                          title: 'Edit Space',
                          description: 'This feature is not yet implemented',
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => handleDeleteSpace(e, space.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            // TODO: Implement join space by code
            toast({
              title: 'Join Space',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <Users className="h-4 w-4 mr-2" />
          Join Collaborative Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudySpaceList;
