import React, { useState } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Network, Lock, Globe, Tag, X } from 'lucide-react';

/**
 * Map Creation Form Component
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 * @returns {React.ReactElement} Map creation form component
 */
const MapCreationForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const knowledgeMap = useKnowledgeMap();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle switch change
  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      isPublic: checked
    }));
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };
  
  // Add a tag
  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Map title is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Initialize service if needed
      if (!knowledgeMap.initialized) {
        await knowledgeMap.initialize(user.id);
      }
      
      // Create the map
      const map = await knowledgeMap.createMap({
        title: formData.title.trim(),
        description: formData.description.trim(),
        isPublic: formData.isPublic,
        tags: formData.tags,
        layoutData: {}
      });
      
      toast({
        title: 'Success',
        description: 'Knowledge map created successfully',
      });
      
      if (onSuccess) {
        onSuccess(map);
      }
    } catch (error) {
      console.error('Error creating map:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create knowledge map',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Knowledge Map</CardTitle>
        <CardDescription>
          Create a new map to visualize and organize your knowledge
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Map Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter map title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your knowledge map"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addTag(tagInput.trim())}
                disabled={!tagInput.trim()}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button 
                    type="button" 
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isPublic" className="flex items-center gap-2">
              {formData.isPublic ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Public Map</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Private Map</span>
                </>
              )}
            </Label>
          </div>
          
          {formData.isPublic && (
            <div className="text-sm text-muted-foreground">
              Anyone can view this map
            </div>
          )}
          
          {!formData.isPublic && (
            <div className="text-sm text-muted-foreground">
              Only you and people you share with can view this map
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Network className="mr-2 h-4 w-4" />
                Create Map
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MapCreationForm;
