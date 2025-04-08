import React, { useState, useEffect } from 'react';
import { useARStudyEnvironment, useARSpatialMemory } from '@/services/augmented-reality';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import { StudySpaceList, StudySpaceDetails, MemoryPalaceView } from '@/components/augmented-reality';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Cube, 
  Brain, 
  Users,
  Lightbulb,
  Glasses,
  Loader2
} from 'lucide-react';

/**
 * Augmented Reality Study page component
 * @returns {React.ReactElement} AugmentedRealityStudy page
 */
const AugmentedRealityStudy = () => {
  const { user } = useAuth();
  const arStudyEnvironment = useARStudyEnvironment();
  const arSpatialMemory = useARSpatialMemory();
  
  const [activeTab, setActiveTab] = useState('spaces');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedPalace, setSelectedPalace] = useState(null);
  const [memoryPalaces, setMemoryPalaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize services and load data
  useEffect(() => {
    if (!user) return;
    
    const initializeServices = async () => {
      try {
        setLoading(true);
        
        // Initialize services
        await arStudyEnvironment.initialize(user.id);
        await arSpatialMemory.initialize(user.id);
        
        // Load memory palaces
        const palaces = await arSpatialMemory.getUserMemoryPalaces();
        setMemoryPalaces(palaces);
      } catch (error) {
        console.error('Error initializing services:', error);
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize augmented reality services',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeServices();
  }, [user, arStudyEnvironment, arSpatialMemory]);
  
  // Handle space selection
  const handleSelectSpace = (space) => {
    setSelectedSpace(space);
  };
  
  // Handle palace selection
  const handleSelectPalace = (palace) => {
    setSelectedPalace(palace);
  };
  
  // Handle back button click
  const handleBack = () => {
    setSelectedSpace(null);
    setSelectedPalace(null);
  };
  
  // Create a new memory palace
  const handleCreateMemoryPalace = async () => {
    try {
      // Create memory palace
      const newPalace = await arSpatialMemory.createMemoryPalace({
        name: 'New Memory Palace',
        description: 'A place to store your memories',
        environmentType: 'library'
      });
      
      // Add to list
      setMemoryPalaces(prev => [newPalace, ...prev]);
      
      // Select the new palace
      setSelectedPalace(newPalace);
      
      toast({
        title: 'Memory Palace Created',
        description: 'Your new memory palace has been created',
      });
    } catch (error) {
      console.error('Error creating memory palace:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create memory palace',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Augmented Reality Study</h1>
            <p className="text-muted-foreground">
              Study in augmented reality with spatial memory techniques
            </p>
          </div>
          
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">Initializing AR environment...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="spaces" className="flex items-center gap-2">
                  <Cube className="h-4 w-4" />
                  <span>Study Spaces</span>
                </TabsTrigger>
                <TabsTrigger value="memory" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Memory Palaces</span>
                </TabsTrigger>
                <TabsTrigger value="collaborative" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Collaborative</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="spaces">
                {selectedSpace ? (
                  <StudySpaceDetails 
                    spaceId={selectedSpace.id}
                    onBack={handleBack}
                  />
                ) : (
                  <StudySpaceList onSelectSpace={handleSelectSpace} />
                )}
              </TabsContent>
              
              <TabsContent value="memory">
                {selectedPalace ? (
                  <MemoryPalaceView 
                    palaceId={selectedPalace.id}
                    onBack={handleBack}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Memory Palaces</CardTitle>
                          <CardDescription>
                            {memoryPalaces.length === 0
                              ? 'Create your first memory palace'
                              : `You have ${memoryPalaces.length} memory palace${memoryPalaces.length === 1 ? '' : 's'}`
                            }
                          </CardDescription>
                        </div>
                        <Button onClick={handleCreateMemoryPalace}>
                          <Brain className="h-4 w-4 mr-2" />
                          New Palace
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {memoryPalaces.length === 0 ? (
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Memory Palaces</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Create your first memory palace to start using spatial memory techniques.
                          </p>
                          <Button onClick={handleCreateMemoryPalace}>
                            <Brain className="h-4 w-4 mr-2" />
                            Create Memory Palace
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {memoryPalaces.map((palace) => (
                            <div
                              key={palace.id}
                              className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleSelectPalace(palace)}
                            >
                              <div className="flex items-start space-x-3">
                                <Brain className="h-6 w-6 text-primary mt-1" />
                                <div>
                                  <h3 className="font-medium">{palace.name}</h3>
                                  {palace.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {palace.description}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Created on {new Date(palace.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="collaborative">
                <Card>
                  <CardHeader>
                    <CardTitle>Collaborative AR Sessions</CardTitle>
                    <CardDescription>
                      Join or create collaborative AR study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Active Sessions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Join an existing session or create a new one to collaborate with others.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: 'Join Session',
                              description: 'This feature is not yet implemented',
                            });
                          }}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button
                          onClick={() => {
                            toast({
                              title: 'Create Session',
                              description: 'This feature is not yet implemented',
                            });
                          }}
                        >
                          <Glasses className="h-4 w-4 mr-2" />
                          Create Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Augmented Reality Study Tips</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Spatial memory techniques can improve retention by up to 50%. Place items in meaningful locations and create a journey through your palace to connect them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AugmentedRealityStudy;
