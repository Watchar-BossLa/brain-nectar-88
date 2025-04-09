import React, { useState, useEffect } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Save, Trash2, X, ArrowRight, ArrowLeftRight } from 'lucide-react';

/**
 * Relationship Editor Component
 * @param {Object} props - Component props
 * @param {string} props.mapId - Map ID
 * @param {Object} props.relationship - Relationship data (if editing)
 * @param {Array} props.concepts - Available concepts
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {React.ReactElement} Relationship editor component
 */
const RelationshipEditor = ({ mapId, relationship, concepts, onSave, onCancel, onDelete }) => {
  const knowledgeMap = useKnowledgeMap();
  
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    sourceId: relationship?.source_id || '',
    targetId: relationship?.target_id || '',
    relationshipType: relationship?.relationship_type || 'related_to',
    label: relationship?.label || '',
    strength: relationship?.strength || 1,
    bidirectional: relationship?.bidirectional || false,
    metadata: relationship?.metadata || {}
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
  
  // Handle switch change
  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      bidirectional: checked
    }));
  };
  
  // Handle strength change
  const handleStrengthChange = (value) => {
    setFormData(prev => ({
      ...prev,
      strength: value[0]
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.sourceId) {
      toast({
        title: 'Error',
        description: 'Source concept is required',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.targetId) {
      toast({
        title: 'Error',
        description: 'Target concept is required',
        variant: 'destructive'
      });
      return;
    }
    
    if (formData.sourceId === formData.targetId) {
      toast({
        title: 'Error',
        description: 'Source and target concepts must be different',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let savedRelationship;
      
      if (relationship) {
        // Update existing relationship
        savedRelationship = await knowledgeMap.updateRelationship(relationship.id, {
          relationshipType: formData.relationshipType,
          label: formData.label.trim(),
          strength: formData.strength,
          bidirectional: formData.bidirectional,
          metadata: formData.metadata
        });
        
        toast({
          title: 'Success',
          description: 'Relationship updated successfully',
        });
      } else {
        // Create new relationship
        savedRelationship = await knowledgeMap.addRelationship(mapId, {
          sourceId: formData.sourceId,
          targetId: formData.targetId,
          relationshipType: formData.relationshipType,
          label: formData.label.trim(),
          strength: formData.strength,
          bidirectional: formData.bidirectional,
          metadata: formData.metadata
        });
        
        toast({
          title: 'Success',
          description: 'Relationship created successfully',
        });
      }
      
      if (onSave) {
        onSave(savedRelationship);
      }
    } catch (error) {
      console.error('Error saving relationship:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save relationship',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!relationship) return;
    
    try {
      setDeleting(true);
      
      await knowledgeMap.deleteRelationship(relationship.id);
      
      toast({
        title: 'Success',
        description: 'Relationship deleted successfully',
      });
      
      if (onDelete) {
        onDelete(relationship.id);
      }
    } catch (error) {
      console.error('Error deleting relationship:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete relationship',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };
  
  // Get concept title by ID
  const getConceptTitle = (id) => {
    const concept = concepts.find(c => c.id === id);
    return concept ? concept.title : 'Unknown Concept';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{relationship ? 'Edit Relationship' : 'Add Relationship'}</CardTitle>
        <CardDescription>
          {relationship ? 'Update relationship details' : 'Create a new relationship between concepts'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!relationship && (
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sourceId">Source Concept</Label>
                <Select
                  value={formData.sourceId}
                  onValueChange={(value) => handleSelectChange('sourceId', value)}
                >
                  <SelectTrigger id="sourceId">
                    <SelectValue placeholder="Select source concept" />
                  </SelectTrigger>
                  <SelectContent>
                    {concepts.map(concept => (
                      <SelectItem key={concept.id} value={concept.id}>
                        {concept.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetId">Target Concept</Label>
                <Select
                  value={formData.targetId}
                  onValueChange={(value) => handleSelectChange('targetId', value)}
                >
                  <SelectTrigger id="targetId">
                    <SelectValue placeholder="Select target concept" />
                  </SelectTrigger>
                  <SelectContent>
                    {concepts.map(concept => (
                      <SelectItem key={concept.id} value={concept.id}>
                        {concept.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {relationship && (
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="font-medium">{getConceptTitle(relationship.source_id)}</div>
              {formData.bidirectional ? (
                <ArrowLeftRight className="h-4 w-4 mx-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mx-2" />
              )}
              <div className="font-medium">{getConceptTitle(relationship.target_id)}</div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship Type</Label>
            <Select
              value={formData.relationshipType}
              onValueChange={(value) => handleSelectChange('relationshipType', value)}
            >
              <SelectTrigger id="relationshipType">
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="related_to">Related To</SelectItem>
                <SelectItem value="depends_on">Depends On</SelectItem>
                <SelectItem value="part_of">Part Of</SelectItem>
                <SelectItem value="example_of">Example Of</SelectItem>
                <SelectItem value="leads_to">Leads To</SelectItem>
                <SelectItem value="similar_to">Similar To</SelectItem>
                <SelectItem value="opposite_of">Opposite Of</SelectItem>
                <SelectItem value="causes">Causes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              placeholder="Enter relationship label"
              value={formData.label}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="strength">Strength</Label>
              <span className="text-sm text-muted-foreground">{formData.strength}</span>
            </div>
            <Slider
              id="strength"
              min={0}
              max={5}
              step={0.1}
              value={[formData.strength]}
              onValueChange={handleStrengthChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="bidirectional"
              checked={formData.bidirectional}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="bidirectional" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Bidirectional</span>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            {relationship && (
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

export default RelationshipEditor;
