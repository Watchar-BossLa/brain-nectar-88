import React, { useState } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, X } from 'lucide-react';
import { ConceptForm } from './concept-editor/ConceptForm';
import { TypeIconSelect } from './concept-editor/TypeIconSelect';
import { ColorSelector } from './concept-editor/ColorSelector';
import { PositionInputs } from './concept-editor/PositionInputs';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Concept title is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      let savedConcept;
      
      if (concept) {
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
          title: "Success",
          description: "Concept updated successfully"
        });
      } else {
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
          title: "Success",
          description: "Concept created successfully"
        });
      }
      
      if (onSave) {
        onSave(savedConcept);
      }
    } catch (error) {
      console.error("Error saving concept:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save concept",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!concept) return;
    
    try {
      setDeleting(true);
      
      await knowledgeMap.deleteConcept(concept.id);
      
      toast({
        title: "Success",
        description: "Concept deleted successfully",
      });
      
      if (onDelete) {
        onDelete(concept.id);
      }
    } catch (error) {
      console.error("Error deleting concept:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete concept",
        variant: "destructive"
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
          <ConceptForm
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleColorChange={handleColorChange}
          />
          
          <TypeIconSelect 
            formData={formData}
            handleSelectChange={handleSelectChange}
          />
          
          <ColorSelector
            formData={formData}
            handleChange={handleChange}
            handleColorChange={handleColorChange}
          />
          
          <PositionInputs
            formData={formData}
            handleChange={handleChange}
          />
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
