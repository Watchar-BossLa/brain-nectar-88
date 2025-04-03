
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlashcardContent } from './components/FlashcardContent';
import DeleteFlashcardDialog from './DeleteFlashcardDialog';
import { format } from 'date-fns';
import { Flashcard } from '@/types/flashcard';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onDelete: (id: string) => void;
  onUpdated?: () => void;
  isReviewMode?: boolean;
  onRating?: (rating: number) => Promise<void>;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ 
  flashcard, 
  onDelete,
  onUpdated,
  isReviewMode,
  onRating 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onUpdated && !isFlipped) {
      // When flipping to see the answer, call the onUpdated callback
      onUpdated();
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await onDelete(flashcard.id);
    setIsDeleteDialogOpen(false);
    if (onUpdated) {
      onUpdated();
    }
  };

  // Get content directly from the flashcard properties
  const frontContent = flashcard.frontContent || flashcard.front_content || '';
  const backContent = flashcard.backContent || flashcard.back_content || '';
  
  // Ensure we have the next review date
  const reviewDateStr = flashcard.nextReviewDate || flashcard.next_review_date;
  const nextReviewDate = reviewDateStr ? new Date(reviewDateStr) : null;
  
  return (
    <>
      <Card className="h-64 relative perspective-1000">
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleClick}
        >
          {/* Front of card */}
          <CardContent className="absolute inset-0 backface-hidden p-4 flex flex-col items-center justify-center">
            <FlashcardContent content={frontContent} />
          </CardContent>
          
          {/* Back of card */}
          <CardContent className="absolute inset-0 backface-hidden rotate-y-180 p-4 flex flex-col items-center justify-center">
            <FlashcardContent content={backContent} />
          </CardContent>
        </div>
        
        <CardFooter className="absolute bottom-0 left-0 right-0 justify-between p-2 z-10">
          <div className="text-xs text-muted-foreground">
            {nextReviewDate ? (
              <span>Next review: {format(nextReviewDate, 'MMM d')}</span>
            ) : (
              <span>New card</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      
      <DeleteFlashcardDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default FlashcardCard;
