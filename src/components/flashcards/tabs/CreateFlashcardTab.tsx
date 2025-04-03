import React from 'react';
import { CreateFlashcardTabProps } from '@/types/components';
import { Card, CardContent } from '@/components/ui/card';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import AdvancedFlashcardForm from '@/components/flashcards/AdvancedFlashcardForm';

const CreateFlashcardTab = ({
  isAdvancedForm,
  onFlashcardCreated,
  onCancel
}: CreateFlashcardTabProps) => {
  if (isAdvancedForm) {
    return (
      <AdvancedFlashcardForm 
        onSuccess={onFlashcardCreated} 
        onCancel={onCancel}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="py-6">
        <FlashcardForm onFlashcardCreated={onFlashcardCreated} />
      </CardContent>
    </Card>
  );
};

export default CreateFlashcardTab;
