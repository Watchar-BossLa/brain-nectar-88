import { useState } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { toast } from "@/hooks/use-toast";
import { validateConceptForm, type ConceptFormData } from '@/utils/form-validation/conceptValidator';

interface UseConceptFormProps {
  mapId: string;
  concept?: any;
  onSave?: (concept: any) => void;
  onDelete?: (id: string) => void;
}

export function useConceptForm({ mapId, concept, onSave, onDelete }: UseConceptFormProps) {
  const knowledgeMap = useKnowledgeMap();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<ConceptFormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateConceptForm(formData);
    
    if (!isValid) {
      errors.forEach(error => {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive"
        });
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  return {
    formData,
    loading,
    deleting,
    handleChange,
    handleSelectChange,
    handleColorChange,
    handleSubmit,
    handleDelete
  };
}
