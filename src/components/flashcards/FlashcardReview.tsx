
import React, { useState, useEffect } from 'react';
import { getDueFlashcards, updateFlashcardAfterReview } from '@/services/flashcardService';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const FlashcardReview: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  const fetchDueFlashcards = async () => {
    setLoading(true);
    try {
      const { data, error } = await getDueFlashcards();
      if (error) {
        throw new Error(error.message);
      }
      setFlashcards(data || []);
      setCurrentIndex(0);
      setIsReviewing(data && data.length > 0);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards for review',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueFlashcards();
  }, []);

  const handleRating = async (rating: number) => {
    if (!flashcards.length || currentIndex >= flashcards.length) return;

    const currentFlashcard = flashcards[currentIndex];
    
    try {
      await updateFlashcardAfterReview(currentFlashcard.id, rating);
      
      // Move to the next card or end review if it was the last card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // End of review session
        setIsReviewing(false);
        toast({
          title: 'Review complete',
          description: `You've reviewed all ${flashcards.length} cards due today!`
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

  const resetReview = () => {
    setCurrentIndex(0);
    setIsReviewing(flashcards.length > 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isReviewing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flashcard Review</CardTitle>
          <CardDescription>
            {flashcards.length > 0 
              ? 'You have flashcards ready for review!'
              : 'No flashcards due for review at this moment.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flashcards.length > 0 ? (
            <div className="text-center">
              <p className="mb-4">You have {flashcards.length} flashcards due for review.</p>
              <Button onClick={resetReview}>Start Review</Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Check back later or create new flashcards to study.</p>
              <Button onClick={fetchDueFlashcards} variant="outline">Refresh</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentFlashcard = flashcards[currentIndex];
  const progress = Math.round(((currentIndex) / flashcards.length) * 100);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Progress: {currentIndex} of {flashcards.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {currentFlashcard && (
        <FlashcardCard
          flashcard={currentFlashcard}
          isReviewMode={true}
          onRating={handleRating}
        />
      )}
    </div>
  );
};

export default FlashcardReview;
