import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth';
import { getDueFlashcards, updateFlashcardAfterReview } from '@/services/spacedRepetition';

interface ReviewFlashcardsTabProps {
  onComplete: () => void;
}

const ReviewFlashcardsTab: React.FC<ReviewFlashcardsTabProps> = ({ onComplete }) => {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    loadDueFlashcards();
  }, [user]);
  
  const loadDueFlashcards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getDueFlashcards(user.id);
      
      if (data && data.length > 0) {
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setFlashcards([]);
        toast({
          title: 'No cards due',
          description: 'You have no flashcards due for review.',
        });
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards for review',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleRate = async (difficulty: number) => {
    if (currentIndex >= flashcards.length) return;
    
    const currentFlashcard = flashcards[currentIndex];
    
    try {
      // Record the review with the difficulty rating
      await updateFlashcardAfterReview(currentFlashcard.id, difficulty);
      
      // Move to the next card or complete the review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // End of review session
        toast({
          title: 'Review complete',
          description: 'You have completed this review session!',
        });
        onComplete();
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to record your review',
        variant: 'destructive'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">No Flashcards Due</h3>
        <p className="text-muted-foreground mb-4">You don't have any flashcards due for review.</p>
        <Button onClick={loadDueFlashcards}>Check Again</Button>
      </div>
    );
  }
  
  if (currentIndex >= flashcards.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Review Complete!</h3>
        <p className="text-muted-foreground mb-4">You've completed your review session.</p>
        <Button onClick={onComplete}>Return to Flashcards</Button>
      </div>
    );
  }
  
  const currentFlashcard = flashcards[currentIndex];
  const progress = Math.round((currentIndex / flashcards.length) * 100);
  
  return (
    <Card>
      <CardContent className="relative">
        <Progress value={progress} className="absolute top-2 right-2 w-24" />
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              {isFlipped ? 'Answer' : 'Question'}
            </h3>
            <p className="text-muted-foreground">
              {isFlipped ? currentFlashcard.back_content : currentFlashcard.front_content}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary" onClick={handleFlip}>
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </Button>
        {isFlipped && (
          <div className="flex space-x-2">
            <Button onClick={() => handleRate(5)}>Easy</Button>
            <Button onClick={() => handleRate(4)}>Good</Button>
            <Button onClick={() => handleRate(3)}>Okay</Button>
            <Button onClick={() => handleRate(2)}>Hard</Button>
            <Button onClick={() => handleRate(1)}>Forgot</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewFlashcardsTab;
