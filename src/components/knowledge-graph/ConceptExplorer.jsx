import React, { useState, useEffect } from 'react';
import { useKnowledgeGraph } from '@/services/knowledge-graph';
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
  Search, 
  Tag, 
  Link2,
  Loader2,
  X,
  BookOpen,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';

/**
 * Concept Explorer Component
 * Allows users to explore, search, and create concepts
 * @param {Object} props - Component props
 * @param {Function} [props.onSelectConcept] - Callback when a concept is selected
 * @returns {React.ReactElement} Concept explorer component
 */
const ConceptExplorer = ({ onSelectConcept }) => {
  const { user } = useAuth();
  const knowledgeGraph = useKnowledgeGraph();
  const [concepts, setConcepts] = useState([]);
  const [filteredConcepts, setFilteredConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newConceptData, setNewConceptData] = useState({ name: '', description: '', tags: [] });
  const [newTagInput, setNewTagInput] = useState('');
  const [creatingConcept, setCreatingConcept] = useState(false);
  
  // Load concepts
  useEffect(() => {
    if (!user) return;
    
    const loadConcepts = async () => {
      try {
        setLoading(true);
        
        // Initialize knowledge graph if needed
        if (!knowledgeGraph.initialized) {
          await knowledgeGraph.initialize(user.id);
        }
        
        // Get graph
        const graph = await knowledgeGraph.getGraph();
        
        if (graph && graph.nodes) {
          setConcepts(graph.nodes);
          setFilteredConcepts(graph.nodes);
          
          // Extract available tags
          const tags = new Set();
          graph.nodes.forEach(node => {
            if (node.tags) {
              node.tags.forEach(tag => tags.add(tag));
            }
          });
          
          setAvailableTags(Array.from(tags));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading concepts:', err);
        setError(err.message || 'Failed to load concepts');
      } finally {
        setLoading(false);
      }
    };
    
    loadConcepts();
  }, [user, knowledgeGraph]);
  
  // Filter concepts when search query or selected tags change
  useEffect(() => {
    if (!concepts) return;
    
    let filtered = [...concepts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(concept => 
        concept.label.toLowerCase().includes(query) || 
        (concept.description && concept.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(concept => 
        concept.tags && selectedTags.every(tag => concept.tags.includes(tag))
      );
    }
    
    setFilteredConcepts(filtered);
  }, [concepts, searchQuery, selectedTags]);
  
  // Handle concept selection
  const handleSelectConcept = (concept) => {
    if (onSelectConcept) {
      onSelectConcept(concept);
    }
  };
  
  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Handle new concept form change
  const handleNewConceptChange = (e) => {
    const { name, value } = e.target;
    setNewConceptData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    
    setNewConceptData(prev => ({
      ...prev,
      tags: [...prev.tags, newTagInput.trim()]
    }));
    
    setNewTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setNewConceptData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle creating a new concept
  const handleCreateConcept = async () => {
    if (!user || !newConceptData.name.trim()) return;
    
    try {
      setCreatingConcept(true);
      
      const conceptData = {
        name: newConceptData.name.trim(),
        description: newConceptData.description.trim(),
        source: 'user',
        tags: newConceptData.tags
      };
      
      const newConcept = await knowledgeGraph.addConcept(conceptData);
      
      // Add new concept to list
      setConcepts(prev => [
        ...prev, 
        {
          id: newConcept.id,
          label: newConcept.name,
          description: newConcept.description,
          tags: newConcept.tags,
          source: newConcept.source
        }
      ]);
      
      // Add new tags to available tags
      const newTags = newConceptData.tags.filter(tag => !availableTags.includes(tag));
      if (newTags.length > 0) {
        setAvailableTags(prev => [...prev, ...newTags]);
      }
      
      // Reset form
      setNewConceptData({ name: '', description: '', tags: [] });
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating concept:', err);
      alert('Failed to create concept: ' + (err.message || 'Unknown error'));
    } finally {
      setCreatingConcept(false);
    }
  };
  
  // Get concept icon based on source
  const getConceptIcon = (source) => {
    switch (source) {
      case 'document':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'user':
        return <User className="h-5 w-5 text-primary" />;
      default:
        return <BookOpen className="h-5 w-5 text-primary" />;
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
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
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
          <CardDescription>Failed to load concepts</CardDescription>
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
            <CardTitle>Concepts</CardTitle>
            <CardDescription>
              {concepts.length === 0
                ? 'Create your first concept'
                : `Explore ${concepts.length} concept${concepts.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Concept
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Concept</DialogTitle>
                <DialogDescription>
                  Add a new concept to your knowledge graph
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Concept Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newConceptData.name}
                    onChange={handleNewConceptChange}
                    placeholder="Enter concept name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newConceptData.description}
                    onChange={handleNewConceptChange}
                    placeholder="Enter concept description"
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
                  
                  {newConceptData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newConceptData.tags.map((tag, index) => (
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
                  onClick={handleCreateConcept}
                  disabled={!newConceptData.name.trim() || creatingConcept}
                >
                  {creatingConcept ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Concept'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Concepts list */}
        {filteredConcepts.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Concepts Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {concepts.length === 0
                ? 'Create your first concept to get started.'
                : 'No concepts match your search criteria.'
              }
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Concept
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConcepts.map((concept) => (
              <div
                key={concept.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectConcept(concept)}
              >
                <div className="flex items-start space-x-3">
                  {getConceptIcon(concept.source)}
                  <div>
                    <h3 className="font-medium">{concept.label}</h3>
                    {concept.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {concept.description.length > 150
                          ? `${concept.description.substring(0, 150)}...`
                          : concept.description
                        }
                      </p>
                    )}
                    
                    {concept.tags && concept.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {concept.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3 mr-1" />
                      <span>
                        {concept.connectionCount || 0} connections
                      </span>
                      
                      {concept.sourceId && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 h-6 px-2"
                          asChild
                        >
                          <a 
                            href={`/source/${concept.source}/${concept.sourceId}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConceptExplorer;
