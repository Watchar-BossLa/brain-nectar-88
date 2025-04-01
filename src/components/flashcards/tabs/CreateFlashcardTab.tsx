
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import AdvancedFlashcardForm from '@/components/flashcards/AdvancedFlashcardForm';

interface CreateFlashcardTabProps {
  isAdvancedForm: boolean;
  onFlashcardCreated: () => void;
  onCancel: () => void;
  topicId?: string;
}

const CreateFlashcardTab = ({
  isAdvancedForm,
  onFlashcardCreated,
  onCancel,
  topicId
}: CreateFlashcardTabProps) => {
  if (isAdvancedForm) {
    return (
      <AdvancedFlashcardForm 
        onSuccess={onFlashcardCreated} 
        onCancel={onCancel}
        topicId={topicId}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="py-6">
        <FlashcardForm 
          onFlashcardCreated={onFlashcardCreated}
          topicId={topicId}
        />
      </CardContent>
    </Card>
  );
};

export default CreateFlashcardTab;
