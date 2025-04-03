import React from 'react';
import { EmptyFlashcardStateProps } from '@/types/components';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const EmptyFlashcardState: React.FC<EmptyFlashcardStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <p className="text-muted-foreground mb-4">You don't have any flashcards yet.</p>
      <Button onClick={onAddNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Your First Flashcard
      </Button>
    </div>
  );
};

export default EmptyFlashcardState;
