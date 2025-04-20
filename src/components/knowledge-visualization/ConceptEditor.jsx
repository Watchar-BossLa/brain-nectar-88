
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useConceptForm } from '@/hooks/knowledge-visualization/useConceptForm';
import { ConceptForm } from './concept-editor/ConceptForm';
import { TypeIconSelect } from './concept-editor/TypeIconSelect';
import { ColorSelector } from './concept-editor/ColorSelector';
import { PositionInputs } from './concept-editor/PositionInputs';
import { FormHeader } from './concept-editor/FormHeader';
import { FormFooter } from './concept-editor/FormFooter';

const ConceptEditor = ({ mapId, concept, onSave, onCancel, onDelete }) => {
  const {
    formData,
    loading,
    deleting,
    handleChange,
    handleSelectChange,
    handleColorChange,
    handleSubmit,
    handleDelete
  } = useConceptForm({ mapId, concept, onSave, onDelete });

  return (
    <Card className="w-full">
      <FormHeader isEditing={!!concept} />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ConceptForm
            formData={formData}
            handleChange={handleChange}
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
        
        <FormFooter
          isEditing={!!concept}
          loading={loading}
          deleting={deleting}
          onCancel={onCancel}
          onDelete={concept ? handleDelete : undefined}
        />
      </form>
    </Card>
  );
};

export default ConceptEditor;
