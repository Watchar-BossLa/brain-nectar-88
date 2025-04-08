import React, { useState, useEffect } from 'react';
import { useARStudyEnvironment, useARObjectManager } from '@/services/augmented-reality';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import ARSceneView from './ARSceneView';
import { 
  Cube, 
  ArrowLeft,
  Users,
  Share2,
  Settings,
  Plus,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  PenTool,
  Brain,
  BookOpen,
  MessageSquare,
  Trash2
} from 'lucide-react';

/**
 * Study Space Details Component
 * Displays details of an AR study space and allows management
 * @param {Object} props - Component props
 * @param {string} props.spaceId - Space ID
 * @param {Function} [props.onBack] - Callback when back button is clicked
 * @returns {React.ReactElement} Study space details component
 */
const StudySpaceDetails = ({ spaceId, onBack }) => {
  const { user } = useAuth();
  const arStudyEnvironment = useARStudyEnvironment();
  const arObjectManager = useARObjectManager();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scene');
  const [addObjectDialogOpen, setAddObjectDialogOpen] = useState(false);
  const [selectedObjectType, setSelectedObjectType] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // Load space details
  useEffect(() => {
    if (!user || !spaceId) return;
    
    const loadSpaceDetails = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!arStudyEnvironment.initialized) {
          await arStudyEnvironment.initialize(user.id);
        }
        
        if (!arObjectManager.initialized) {
          await arObjectManager.initialize(user.id);
        }
        
        // Load space details
        const spaceDetails = await arStudyEnvironment.getStudySpaceDetails(spaceId);
        setSpace(spaceDetails);
        
        setError(null);
      } catch (err) {
        console.error('Error loading space details:', err);
        setError(err.message || 'Failed to load space details');
      } finally {
        setLoading(false);
      }
    };
    
    loadSpaceDetails();
  }, [user, spaceId, arStudyEnvironment, arObjectManager]);
  
  // Handle creating a collaborative session
  const handleCreateSession = async () => {
    if (!user || !space) return;
    
    try {
      setIsCreatingSession(true);
      
      // Create session
      const session = await arStudyEnvironment.createCollaborativeSession(space.id);
      
      toast({
        title: 'Session Created',
        description: `Session code: ${session.session_code}`,
      });
      
      // Copy session code to clipboard
      navigator.clipboard.writeText(session.session_code);
      
      toast({
        title: 'Code Copied',
        description: 'Session code copied to clipboard',
      });
    } catch (err) {
      console.error('Error creating session:', err);
      toast({
        title: 'Creation Failed',
        description: err.message || 'An error occurred while creating the session',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingSession(false);
    }
  };
  
  // Handle adding an object
  const handleAddObject = async (objectType) => {
    setSelectedObjectType(objectType);
    setAddObjectDialogOpen(true);
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32 mt-1" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>
                Failed to load space details
              </CardDescription>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
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
  
  // Render if no space
  if (!space) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Space Not Found</CardTitle>
              <CardDescription>
                The requested study space could not be found
              </CardDescription>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p>The study space you're looking for doesn't exist or you don't have access to it.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{space.name}</CardTitle>
            <CardDescription>
              {space.description || 'No description provided'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateSession}
              disabled={isCreatingSession}
            >
              {isCreatingSession ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scene" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scene" className="flex items-center gap-2">
              <Cube className="h-4 w-4" />
              <span className="hidden sm:inline">Scene</span>
            </TabsTrigger>
            <TabsTrigger value="objects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Objects</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scene">
            <div className="space-y-4">
              <ARSceneView 
                studySpace={space}
                onObjectSelect={(object) => {
                  toast({
                    title: 'Object Selected',
                    description: `Selected: ${object?.settings?.name || 'Unknown object'}`,
                  });
                }}
              />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">AR Environment</h3>
                <Dialog open={addObjectDialogOpen} onOpenChange={setAddObjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Object
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Object to Space</DialogTitle>
                      <DialogDescription>
                        Select the type of object you want to add
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add Text Note',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <FileText className="h-8 w-8" />
                        <span>Text Note</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add Image',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <ImageIcon className="h-8 w-8" />
                        <span>Image</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add 3D Model',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <Cube className="h-8 w-8" />
                        <span>3D Model</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add Whiteboard',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <PenTool className="h-8 w-8" />
                        <span>Whiteboard</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add Flashcards',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <BookOpen className="h-8 w-8" />
                        <span>Flashcards</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => {
                          setAddObjectDialogOpen(false);
                          toast({
                            title: 'Add Knowledge Map',
                            description: 'This feature is not yet implemented',
                          });
                        }}
                      >
                        <Brain className="h-8 w-8" />
                        <span>Knowledge Map</span>
                      </Button>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setAddObjectDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium">Environment Type</p>
                  <p className="text-lg">{space.environment_type}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium">Object Count</p>
                  <p className="text-lg">{space.objects?.length || 0}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="objects">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Objects ({space.objects?.length || 0})
                </h3>
                <Button
                  onClick={() => setAddObjectDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Object
                </Button>
              </div>
              
              {!space.objects || space.objects.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <Cube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Objects</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add objects to your AR study space to start learning.
                  </p>
                  <Button onClick={() => setAddObjectDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Object
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {space.objects.map((object) => (
                    <div
                      key={object.id}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {object.object_type === 'note' && <FileText className="h-5 w-5 text-blue-500 mt-1" />}
                          {object.object_type === '3d_model' && <Cube className="h-5 w-5 text-purple-500 mt-1" />}
                          {object.object_type === 'image' && <ImageIcon className="h-5 w-5 text-green-500 mt-1" />}
                          {object.object_type === 'video' && <Video className="h-5 w-5 text-red-500 mt-1" />}
                          {object.object_type === 'whiteboard' && <PenTool className="h-5 w-5 text-orange-500 mt-1" />}
                          {object.object_type === 'flashcards' && <BookOpen className="h-5 w-5 text-yellow-500 mt-1" />}
                          {object.object_type === 'knowledge_map' && <Brain className="h-5 w-5 text-indigo-500 mt-1" />}
                          <div>
                            <h4 className="font-medium">
                              {object.settings?.name || object.settings?.title || `${object.object_type} object`}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">
                                {object.object_type}
                              </Badge>
                              <Badge variant="outline">
                                {object.content_type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={async () => {
                            try {
                              await arStudyEnvironment.deleteStudyObject(object.id);
                              
                              // Update space objects
                              setSpace(prev => ({
                                ...prev,
                                objects: prev.objects.filter(obj => obj.id !== object.id)
                              }));
                              
                              toast({
                                title: 'Object Deleted',
                                description: 'The object has been deleted successfully',
                              });
                            } catch (err) {
                              console.error('Error deleting object:', err);
                              toast({
                                title: 'Deletion Failed',
                                description: err.message || 'An error occurred while deleting the object',
                                variant: 'destructive'
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {object.settings?.preview && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {object.settings.preview}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Position: x={object.position.x.toFixed(2)}, y={object.position.y.toFixed(2)}, z={object.position.z.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Collaborative Sessions</h3>
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreatingSession}
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      New Session
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center py-8 border rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a session to collaborate with others in AR.
                </p>
                <Button onClick={handleCreateSession} disabled={isCreatingSession}>
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      New Session
                    </>
                  )}
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Join a Session</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter a session code to join an existing collaborative session.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter session code"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Created on {new Date(space.created_at).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudySpaceDetails;
