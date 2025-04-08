import React, { useState, useEffect } from 'react';
import { useStudyItemGenerator } from '@/services/spaced-repetition';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Folder, 
  Edit, 
  Trash2, 
  FileText, 
  BookOpen,
  Loader2,
  Search,
  X
} from 'lucide-react';

/**
 * Study Deck Manager Component
 * Allows users to create and manage study decks
 * @param {Object} props - Component props
 * @param {Function} props.onSelectDeck - Callback when a deck is selected
 * @returns {React.ReactElement} Study deck manager component
 */
const StudyDeckManager = ({ onSelectDeck }) => {
  const { user } = useAuth();
  const studyItemGenerator = useStudyItemGenerator();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDeckData, setNewDeckData] = useState({ name: '', description: '', tags: [] });
  const [newTagInput, setNewTagInput] = useState('');
  const [creatingDeck, setCreatingDeck] = useState(false);
  
  // Load user decks
  useEffect(() => {
    if (!user) return;
    
    const loadDecks = async () => {
      try {
        setLoading(true);
        const data = await studyItemGenerator.getUserDecks(user.id);
        setDecks(data);
        setError(null);
      } catch (err) {
        console.error('Error loading decks:', err);
        setError(err.message || 'Failed to load decks');
      } finally {
        setLoading(false);
      }
    };
    
    loadDecks();
  }, [user, studyItemGenerator]);
  
  // Handle deck selection
  const handleSelectDeck = (deck) => {
    if (onSelectDeck) {
      onSelectDeck(deck);
    }
  };
  
  // Handle new deck form change
  const handleNewDeckChange = (e) => {
    const { name, value } = e.target;
    setNewDeckData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    
    setNewDeckData(prev => ({
      ...prev,
      tags: [...prev.tags, newTagInput.trim()]
    }));
    
    setNewTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setNewDeckData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle creating a new deck
  const handleCreateDeck = async () => {
    if (!user || !newDeckData.name.trim()) return;
    
    try {
      setCreatingDeck(true);
      
      const deckData = {
        userId: user.id,
        name: newDeckData.name.trim(),
        description: newDeckData.description.trim(),
        tags: newDeckData.tags
      };
      
      const newDeck = await studyItemGenerator.createDeck(deckData);
      
      // Add new deck to list
      setDecks(prev => [newDeck, ...prev]);
      
      // Reset form
      setNewDeckData({ name: '', description: '', tags: [] });
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating deck:', err);
      alert('Failed to create deck: ' + (err.message || 'Unknown error'));
    } finally {
      setCreatingDeck(false);
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
          <CardDescription>Failed to load study decks</CardDescription>
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
            <CardTitle>Study Decks</CardTitle>
            <CardDescription>
              {decks.length === 0
                ? 'Create your first study deck'
                : `You have ${decks.length} study deck${decks.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Deck</DialogTitle>
                <DialogDescription>
                  Create a new deck to organize your study items
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Deck Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newDeckData.name}
                    onChange={handleNewDeckChange}
                    placeholder="Enter deck name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newDeckData.description}
                    onChange={handleNewDeckChange}
                    placeholder="Enter deck description"
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
                  
                  {newDeckData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newDeckData.tags.map((tag, index) => (
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
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateDeck}
                  disabled={!newDeckData.name.trim() || creatingDeck}
                >
                  {creatingDeck ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Deck'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {decks.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Decks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first study deck to get started.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deck
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectDeck(deck)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Folder className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">{deck.name}</h3>
                      {deck.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {deck.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {deck.item_count} items
                  </Badge>
                </div>
                
                {deck.tags && deck.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 ml-9">
                    {deck.tags.map((tag, index) => (
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

export default StudyDeckManager;
