
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Lightbulb } from 'lucide-react';

interface EmptyFlashcardStateProps {
  onAddNew: () => void;
}

const EmptyFlashcardState: React.FC<EmptyFlashcardStateProps> = ({ onAddNew }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 pb-8 text-center">
        <div className="flex justify-center mb-4">
          <Lightbulb className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Create your first flashcard to start your spaced repetition learning journey. 
          Flashcards are a powerful way to memorize accounting concepts.
        </p>
        
        <Button onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Flashcard
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyFlashcardState;
