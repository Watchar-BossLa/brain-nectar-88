import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { Flashcard } from '@/hooks/flashcards/types';

interface ReviewFlashcardsTabProps {
  onComplete: () => void;
}

const FlashcardReviewContent = ({ flashcard, isFlipped }: { flashcard: Flashcard; isFlipped: boolean }) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-6">
      <div className="text-center">
        {isFlipped ? (
          <div className="animate-fadeIn">
            <div className="text-xl font-semibold">{flashcard.back_content || flashcard.back}</div>
          </div>
        ) : (
          <div className="text-xl font-semibold">{flashcard.front_content || flashcard.front}</div>
        )}
      </div>
    </div>
  );
};

const FlashcardReviewCard = ({ flashcard, onFlip, isFlipped, onRate }: {
  flashcard: Flashcard;
  onFlip: () => void;
  isFlipped: boolean;
  onRate: (rating: number) => Promise<void>;
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          {isFlipped ? (
            <div className="animate-fadeIn">
              <div className="mb-4 text-xl font-semibold">{flashcard.back_content || flashcard.back}</div>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-xl font-semibold">{flashcard.front_content || flashcard.front}</div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-around">
        <Button variant="outline" onClick={() => onRate(1)}>Hard</Button>
        <Button onClick={onFlip}>{isFlipped ? 'Show Question' : 'Show Answer'}</Button>
        <Button variant="outline" onClick={() => onRate(5)}>Easy</Button>
      </CardFooter>
    </Card>
  );
};

const ReviewFlashcardsTab: React.FC<ReviewFlashcardsTabProps> = ({ onComplete }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
        setFlashcards(dueCards);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Error fetching due flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards for review',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFlashcards();
    }
  }, [user, toast]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating: number) => {
    if (!flashcards.length || currentIndex >= flashcards.length) return;

    const currentFlashcard = flashcards[currentIndex];
    
    try {
      await spacedRepetitionService.recordReview(currentFlashcard.id, rating);
      
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        onComplete();
        toast({
          title: 'Review complete',
          description: `You've reviewed all ${flashcards.length} cards due today!`,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error updating flashcard after review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your rating',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium mb-2">No cards due for review</h3>
          <p className="text-muted-foreground text-center">
            You've caught up with all your reviews. Check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Flashcard Review</CardTitle>
          <CardDescription>Review your flashcards using spaced repetition.</CardDescription>
        </CardHeader>
        
        {currentFlashcard && (
          <FlashcardReviewCard
            flashcard={currentFlashcard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onRate={handleRating}
          />
        )}
      </Card>
    </div>
  );
};

export default ReviewFlashcardsTab;
