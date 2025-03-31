
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDueFlashcards, updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';
import { Loader2 } from 'lucide-react';

interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  front?: string;
  back?: string;
  difficulty?: number;
  next_review_date?: string;
  user_id?: string;
  topic_id?: string;
}

const FlashcardReviewSystem = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getDueFlashcards(user.id);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setReviewComplete(true);
        }
      } catch (error) {
        toast({
          title: 'Error loading flashcards',
          description: 'Could not load flashcards for review.',
          variant: 'destructive'
        });
        console.error('Error fetching flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlashcards();
  }, [user, toast]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = async (difficulty: number) => {
    if (!user || currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    try {
      await updateFlashcardAfterReview(currentCard.id, difficulty);
      
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setReviewComplete(true);
      }
    } catch (error) {
      toast({
        title: 'Error updating flashcard',
        description: 'Could not save your review.',
        variant: 'destructive'
      });
      console.error('Error updating flashcard:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (reviewComplete || flashcards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You have completed all your due flashcards.</p>
          <Button onClick={() => window.location.reload()}>
            Check for New Cards
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Flashcard Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            {isFlipped ? (
              <div className="animate-fadeIn">
                <div className="text-xl font-semibold">{currentCard.back_content || currentCard.back}</div>
              </div>
            ) : (
              <div className="text-xl font-semibold">{currentCard.front_content || currentCard.front}</div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 mt-6">
          <Button onClick={handleFlip} variant="outline" className="w-full">
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </Button>
          
          {isFlipped && (
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => handleDifficulty(1)} variant="outline" className="bg-red-100 hover:bg-red-200">
                Hard
              </Button>
              <Button onClick={() => handleDifficulty(3)} variant="outline" className="bg-yellow-100 hover:bg-yellow-200">
                Medium
              </Button>
              <Button onClick={() => handleDifficulty(5)} variant="outline" className="bg-green-100 hover:bg-green-200">
                Easy
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardReviewSystem;
