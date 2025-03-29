
import React, { useState, useEffect } from 'react';
import { getDueFlashcards } from '@/services/spacedRepetition';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { Flashcard } from '@/types/supabase';
import ReviewCard from './review/ReviewCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { Progress } from '@/components/ui/progress';

const FlashcardReview: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviewed: 0,
    correctCount: 0,
    averageRating: 0
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDueFlashcards = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      setFlashcards(dueCards);
      setCurrentIndex(0);
      setIsReviewing(dueCards.length > 0);
      setIsFlipped(false);
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
    if (user) {
      fetchDueFlashcards();
    }
  }, [user]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating: number) => {
    if (!flashcards.length || currentIndex >= flashcards.length) return;

    const currentFlashcard = flashcards[currentIndex];
    
    try {
      await spacedRepetitionService.recordReview(currentFlashcard.id, rating);
      
      // Update statistics
      setReviewStats(prev => {
        const totalReviewed = prev.totalReviewed + 1;
        const correctCount = rating <= 3 ? prev.correctCount + 1 : prev.correctCount;
        const totalRating = prev.averageRating * prev.totalReviewed + rating;
        
        return {
          totalReviewed,
          correctCount,
          averageRating: totalRating / totalReviewed
        };
      });
      
      // Move to the next card or complete the review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setIsReviewing(false);
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

  const resetReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsReviewing(flashcards.length > 0);
    setReviewStats({
      totalReviewed: 0,
      correctCount: 0,
      averageRating: 0
    });
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
            {flashcards.length > 0 && reviewStats.totalReviewed > 0
              ? 'Review session complete!'
              : flashcards.length > 0
                ? 'You have flashcards ready for review!'
                : 'No flashcards due for review at this moment.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flashcards.length > 0 && reviewStats.totalReviewed > 0 ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="mb-2">
                You reviewed {reviewStats.totalReviewed} cards with an average rating of {reviewStats.averageRating.toFixed(1)}.
              </p>
              <Button onClick={resetReview} className="mr-2">
                Review Again
              </Button>
              <Button onClick={fetchDueFlashcards} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Cards
              </Button>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="text-center">
              <p className="mb-4">You have {flashcards.length} flashcards due for review.</p>
              <Button onClick={resetReview}>Start Review</Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Check back later or create new flashcards to study.</p>
              <Button onClick={fetchDueFlashcards} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
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
        <Progress value={progress} className="h-2" />
      </div>

      {currentFlashcard && (
        <ReviewCard
          currentCard={currentFlashcard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onRating={handleRating}
        />
      )}
    </div>
  );
};

export default FlashcardReview;
