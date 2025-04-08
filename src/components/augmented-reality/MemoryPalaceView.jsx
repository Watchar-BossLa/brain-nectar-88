import React, { useState, useEffect } from 'react';
import { useARSpatialMemory } from '@/services/augmented-reality';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import ARSceneView from './ARSceneView';
import { 
  Brain, 
  Plus, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  BarChart,
  Route,
  Lightbulb,
  Trash2
} from 'lucide-react';

/**
 * Memory Palace View Component
 * Displays a memory palace and its items
 * @param {Object} props - Component props
 * @param {string} props.palaceId - Palace ID
 * @param {Function} [props.onBack] - Callback when back button is clicked
 * @returns {React.ReactElement} Memory palace view component
 */
const MemoryPalaceView = ({ palaceId, onBack }) => {
  const { user } = useAuth();
  const arSpatialMemory = useARSpatialMemory();
  
  const [palace, setPalace] = useState(null);
  const [memoryItems, setMemoryItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({ 
    content: '', 
    associatedImage: ''
  });
  const [addingItem, setAddingItem] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [reviewPath, setReviewPath] = useState([]);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Load palace details
  useEffect(() => {
    if (!user || !palaceId) return;
    
    const loadPalaceDetails = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!arSpatialMemory.initialized) {
          await arSpatialMemory.initialize(user.id);
        }
        
        // Load palace details
        const userPalaces = await arSpatialMemory.getUserMemoryPalaces();
        const currentPalace = userPalaces.find(p => p.id === palaceId);
        
        if (!currentPalace) {
          throw new Error('Memory palace not found');
        }
        
        setPalace(currentPalace);
        
        // Load memory items
        const items = await arSpatialMemory.getMemoryPalaceItems(palaceId);
        setMemoryItems(items);
        
        // Load analytics
        const palaceAnalytics = await arSpatialMemory.generateMemoryPalaceAnalytics(palaceId);
        setAnalytics(palaceAnalytics);
        
        setError(null);
      } catch (err) {
        console.error('Error loading palace details:', err);
        setError(err.message || 'Failed to load memory palace details');
      } finally {
        setLoading(false);
      }
    };
    
    loadPalaceDetails();
  }, [user, palaceId, arSpatialMemory]);
  
  // Handle new item form change
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding a new memory item
  const handleAddItem = async () => {
    if (!user || !newItemData.content.trim()) return;
    
    try {
      setAddingItem(true);
      
      // Create memory item
      const newItem = await arSpatialMemory.addMemoryItem(palaceId, {
        content: newItemData.content.trim(),
        associatedImage: newItemData.associatedImage.trim() || null,
        position: { x: Math.random() * 5 - 2.5, y: 1.5, z: Math.random() * 5 - 2.5 },
        rotation: { x: 0, y: Math.random() * 360, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });
      
      // Add new item to list
      setMemoryItems(prev => [...prev, newItem]);
      
      // Reset form
      setNewItemData({ 
        content: '', 
        associatedImage: ''
      });
      setAddItemDialogOpen(false);
      
      toast({
        title: 'Memory Item Added',
        description: 'Your memory item has been added to the palace',
      });
    } catch (err) {
      console.error('Error adding memory item:', err);
      toast({
        title: 'Addition Failed',
        description: err.message || 'An error occurred while adding the memory item',
        variant: 'destructive'
      });
    } finally {
      setAddingItem(false);
    }
  };
  
  // Handle starting review mode
  const handleStartReview = async () => {
    try {
      // Generate optimal review path
      const path = await arSpatialMemory.generateOptimalReviewPath(palaceId);
      
      if (path.length === 0) {
        toast({
          title: 'No Items to Review',
          description: 'There are no memory items due for review',
        });
        return;
      }
      
      setReviewPath(path);
      setCurrentReviewItem(path[0]);
      setReviewProgress(0);
      setShowAnswer(false);
      setReviewMode(true);
    } catch (err) {
      console.error('Error starting review:', err);
      toast({
        title: 'Review Failed',
        description: err.message || 'An error occurred while starting the review',
        variant: 'destructive'
      });
    }
  };
  
  // Handle recording recall quality
  const handleRecordRecall = async (recallQuality) => {
    if (!currentReviewItem) return;
    
    try {
      // Record review
      await arSpatialMemory.recordMemoryItemReview(currentReviewItem.id, recallQuality);
      
      // Move to next item or finish review
      const nextIndex = reviewProgress + 1;
      
      if (nextIndex < reviewPath.length) {
        setCurrentReviewItem(reviewPath[nextIndex]);
        setReviewProgress(nextIndex);
        setShowAnswer(false);
      } else {
        // Finished review
        setReviewMode(false);
        
        // Refresh analytics
        const palaceAnalytics = await arSpatialMemory.generateMemoryPalaceAnalytics(palaceId);
        setAnalytics(palaceAnalytics);
        
        toast({
          title: 'Review Complete',
          description: `You've reviewed ${reviewPath.length} memory items`,
        });
      }
    } catch (err) {
      console.error('Error recording recall:', err);
      toast({
        title: 'Recording Failed',
        description: err.message || 'An error occurred while recording your recall',
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
                Failed to load memory palace
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
  
  // Render if no palace
  if (!palace) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Memory Palace Not Found</CardTitle>
              <CardDescription>
                The requested memory palace could not be found
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
          <p>The memory palace you're looking for doesn't exist or you don't have access to it.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Render review mode
  if (reviewMode && currentReviewItem) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Memory Review</CardTitle>
              <CardDescription>
                {palace.name} - Item {reviewProgress + 1} of {reviewPath.length}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setReviewMode(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-1" 
                style={{ width: `${(reviewProgress / reviewPath.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Try to recall this item:</p>
              <p className="text-xl font-medium mb-4">
                {showAnswer ? currentReviewItem.settings.content : '???'}
              </p>
              
              {!showAnswer && (
                <Button
                  onClick={() => setShowAnswer(true)}
                  variant="outline"
                >
                  Show Answer
                </Button>
              )}
              
              {showAnswer && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">How well did you recall this item?</p>
                  
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((quality) => (
                      <Button
                        key={quality}
                        variant={quality < 3 ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleRecordRecall(quality)}
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    <p>0 = Complete blackout</p>
                    <p>5 = Perfect recall</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-sm font-medium">Position</p>
                <p className="text-xs">
                  x: {currentReviewItem.position.x.toFixed(2)}, 
                  y: {currentReviewItem.position.y.toFixed(2)}, 
                  z: {currentReviewItem.position.z.toFixed(2)}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm font-medium">Memory Strength</p>
                <p className="text-lg">{currentReviewItem.settings.memoryStrength?.toFixed(1) || '0.0'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle>{palace.name}</CardTitle>
              <Badge variant="outline">Memory Palace</Badge>
            </div>
            <CardDescription>
              {palace.description || 'No description provided'}
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
              size="sm"
              onClick={handleStartReview}
            >
              <Brain className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ARSceneView 
            studySpace={palace}
            onObjectSelect={(object) => {
              toast({
                title: 'Memory Item Selected',
                description: `Selected: ${object?.settings?.content || 'Unknown item'}`,
              });
            }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Memory Items ({memoryItems.length})
                </h3>
                <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Memory Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to your memory palace
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                          Content to Remember
                        </label>
                        <Textarea
                          id="content"
                          name="content"
                          value={newItemData.content}
                          onChange={handleNewItemChange}
                          placeholder="Enter the content you want to remember"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="associatedImage" className="text-sm font-medium">
                          Associated Image URL (optional)
                        </label>
                        <Input
                          id="associatedImage"
                          name="associatedImage"
                          value={newItemData.associatedImage}
                          onChange={handleNewItemChange}
                          placeholder="Enter an image URL to associate with this memory"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setAddItemDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddItem}
                        disabled={!newItemData.content.trim() || addingItem}
                      >
                        {addingItem ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Item'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {memoryItems.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Memory Items</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add items to your memory palace to start memorizing.
                  </p>
                  <Button onClick={() => setAddItemDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {memoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.settings.content}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">
                              {item.settings.reviewCount || 0} reviews
                            </Badge>
                            <Badge variant="outline">
                              Strength: {item.settings.memoryStrength?.toFixed(1) || '0.0'}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={async () => {
                            try {
                              await arSpatialMemory.arStudyEnvironment.deleteStudyObject(item.id);
                              
                              // Update memory items
                              setMemoryItems(prev => prev.filter(i => i.id !== item.id));
                              
                              toast({
                                title: 'Item Deleted',
                                description: 'The memory item has been deleted successfully',
                              });
                            } catch (err) {
                              console.error('Error deleting item:', err);
                              toast({
                                title: 'Deletion Failed',
                                description: err.message || 'An error occurred while deleting the item',
                                variant: 'destructive'
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.settings.lastReviewedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last reviewed: {new Date(item.settings.lastReviewedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Memory Analytics</h3>
              
              {analytics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Items Due for Review</p>
                      <p className="text-2xl font-bold">{analytics.dueItems}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Average Memory Strength</p>
                      <p className="text-2xl font-bold">{analytics.avgMemoryStrength.toFixed(1)}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Retention Rate</p>
                      <p className="text-2xl font-bold">{(analytics.retentionRate * 100).toFixed(0)}%</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Total Reviews</p>
                      <p className="text-2xl font-bold">{analytics.totalReviews}</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Review Status</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-2" 
                          style={{ width: `${(analytics.reviewedItems / analytics.totalItems) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {analytics.reviewedItems}/{analytics.totalItems} items
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.lastSessionDate ? (
                        `Last review session: ${new Date(analytics.lastSessionDate).toLocaleDateString()}`
                      ) : (
                        'No review sessions yet'
                      )}
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleStartReview}
                    disabled={analytics.dueItems === 0}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {analytics.dueItems > 0 ? (
                      `Review ${analytics.dueItems} Due Items`
                    ) : (
                      'No Items Due for Review'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Add items and complete reviews to see analytics.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Memory Techniques</h4>
                <div className="space-y-2">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <Route className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Create a Journey</p>
                        <p className="text-sm text-muted-foreground">
                          Create a path through your palace to connect memory items.
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={() => {
                            toast({
                              title: 'Journey Method',
                              description: 'This feature is not yet implemented',
                            });
                          }}
                        >
                          Create Journey
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Spaced Repetition</p>
                        <p className="text-sm text-muted-foreground">
                          Optimize your review schedule based on memory strength.
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={() => {
                            toast({
                              title: 'Spaced Repetition',
                              description: 'This feature is not yet implemented',
                            });
                          }}
                        >
                          View Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Created on {new Date(palace.created_at).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemoryPalaceView;
