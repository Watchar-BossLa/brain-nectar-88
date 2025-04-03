import React from 'react';
import { FlashcardsEmptyStateProps } from '@/types/components';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, Calculator } from 'lucide-react';

const FlashcardsEmptyState = ({
  title,
  description,
  onCreateSimpleFlashcard,
  onCreateAdvancedFlashcard
}: FlashcardsEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-center text-sm text-muted-foreground max-w-md">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCreateSimpleFlashcard}>
            <BookText className="mr-2 h-4 w-4" />
            Simple Flashcard
          </Button>
          <Button onClick={onCreateAdvancedFlashcard}>
            <Calculator className="mr-2 h-4 w-4" />
            Advanced Flashcard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardsEmptyState;
