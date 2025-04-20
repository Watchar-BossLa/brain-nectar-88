
import React, { useState } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, X } from 'lucide-react';

/**
 * Concept Editor Component
 * @param {Object} props - Component props
 * @param {string} props.mapId - Map ID
 * @param {Object} props.concept - Concept data (if editing)
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {React.ReactElement} Concept editor component
 */
const ConceptEditor = ({ mapId, concept, onSave, onCancel, onDelete }) => {
  const knowledgeMap = useKnowledgeMap();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: concept?.title || '',
    description: concept?.description || '',
    content: concept?.content || '',
    conceptType: concept?.concept_type || 'concept',
    color: concept?.color || '#4f46e5',
    icon: concept?.icon || 'circle',
    positionX: concept?.position_x || 0,
    positionY: concept?.position_y || 0,
    metadata: concept?.metadata || {}
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Concept title is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let savedConcept;
      
      if (concept) {
        // Update existing concept
        savedConcept = await knowledgeMap.updateConcept(concept.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim(),
          conceptType: formData.conceptType,
          color: formData.color,
          icon: formData.icon,
          positionX: formData.positionX,
          positionY: formData.positionY,
          metadata: formData.metadata
        });
        
        toast({
          title: 'Success',
          description: 'Concept updated successfully',
        });
      } else {
        // Create new concept
        savedConcept = await knowledgeMap.addConcept(mapId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim(),
          conceptType: formData.conceptType,
          color: formData.color,
          icon: formData.icon,
          positionX: formData.positionX,
          positionY: formData.positionY,
          metadata: formData.metadata
        });
        
        toast({
          title: 'Success',
          description: 'Concept created successfully',
        });
      }
      
      if (onSave) {
        onSave(savedConcept);
      }
    } catch (error) {
      console.error('Error saving concept:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save concept',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!concept) return;
    
    try {
      setDeleting(true);
      
      await knowledgeMap.deleteConcept(concept.id);
      
      toast({
        title: 'Success',
        description: 'Concept deleted successfully',
      });
      
      if (onDelete) {
        onDelete(concept.id);
      }
    } catch (error) {
      console.error('Error deleting concept:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete concept',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{concept ? 'Edit Concept' : 'Add Concept'}</CardTitle>
        <CardDescription>
          {concept ? 'Update concept details' : 'Create a new concept'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter concept title"
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
              placeholder="Enter concept description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter concept content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conceptType">Type</Label>
              <Select
                value={formData.conceptType}
                onValueChange={(value) => handleSelectChange('conceptType', value)}
              >
                <SelectTrigger id="conceptType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="topic">Topic</SelectItem>
                  <SelectItem value="fact">Fact</SelectItem>
                  <SelectItem value="principle">Principle</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="example">Example</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => handleSelectChange('icon', value)}
              >
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="star">Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center space-x-2">
              <ColorPicker 
                value={formData.color}
                onChange={handleColorChange}
              />
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-32"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positionX">X Position</Label>
              <Input
                id="positionX"
                name="positionX"
                type="number"
                value={formData.positionX}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="positionY">Y Position</Label>
              <Input
                id="positionY"
                name="positionY"
                type="number"
                value={formData.positionY}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            {concept && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading || deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </div>
          
          <Button type="submit" disabled={loading || deleting}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ConceptEditor;
