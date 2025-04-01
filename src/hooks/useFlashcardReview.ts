
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Flashcard } from './useFlashcardsPage';

type ReviewState = 'loading' | 'reviewing' | 'answering' | 'complete';

interface ReviewStats {
  totalReviewed: number;
  easy: number;
  medium: number;
  hard: number;
  averageRating: number;
}

export const useFlashcardReview = (onComplete: () => void) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewState, setReviewState] = useState<ReviewState>('loading');
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const currentCard = cards[currentIndex] || null;
  const reviewCards = cards; // Expose the cards array for FlashcardReview.tsx

  // Fetch due flashcards
  useEffect(() => {
    const fetchDueCards = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .lte('next_review_date', new Date().toISOString())
          .order('next_review_date', { ascending: true });
          
        if (error) throw error;
        
        setCards(data || []);
        setReviewState(data && data.length > 0 ? 'reviewing' : 'complete');
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
    
    fetchDueCards();
  }, []);
  
  // Show the answer for the current card
  const showAnswer = () => {
    setReviewState('answering');
  };
  
  // Alias for showAnswer to match the interface expected by FlashcardReview.tsx
  const handleFlip = showAnswer;
  
  // Rate the current card and move to the next one
  const rateCard = async (rating: number) => {
    if (!currentCard) return;
    
    try {
      // Update the flashcard in the database
      const now = new Date();
      
      // Calculate new review date based on rating
      // Simple algorithm: easier cards get longer intervals
      const daysToAdd = rating === 1 ? 1 : (rating === 3 ? 3 : 7);
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
      
      // Calculate new mastery level - increases more with higher ratings
      const masteryIncrease = rating === 1 ? 0.05 : (rating === 3 ? 0.1 : 0.15);
      const newMastery = Math.min(1, (currentCard.mastery_level || 0) + masteryIncrease);
      
      // Update the card's record
      const { error } = await supabase
        .from('flashcards')
        .update({
          repetition_count: (currentCard.repetition_count || 0) + 1,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: now.toISOString(),
          mastery_level: newMastery,
          difficulty: rating
        })
        .eq('id', currentCard.id);
        
      if (error) throw error;
      
      // Update our statistics
      setReviewStats(prev => {
        const totalRatings = prev.totalReviewed + 1;
        const totalPoints = prev.averageRating * prev.totalReviewed + rating;
        return {
          totalReviewed: totalRatings,
          easy: rating === 5 ? prev.easy + 1 : prev.easy,
          medium: rating === 3 ? prev.medium + 1 : prev.medium,
          hard: rating === 1 ? prev.hard + 1 : prev.hard,
          averageRating: totalPoints / totalRatings
        };
      });
      
      // Move to the next card or complete the review
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setReviewState('reviewing');
      } else {
        setReviewState('complete');
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your rating',
        variant: 'destructive'
      });
    }
  };
  
  // Alias for rateCard to match the interface expected by FlashcardReview.tsx
  const handleDifficultyRating = rateCard;
  
  // Skip the current card without rating
  const handleSkip = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setReviewState('reviewing');
    } else {
      setReviewState('complete');
    }
  };
  
  // Complete the review session
  const completeReview = () => {
    onComplete();
  };
  
  return {
    currentCard,
    reviewState,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview,
    // Additional properties for FlashcardReview.tsx
    isLoading,
    reviewCards,
    currentCardIndex: currentIndex,
    handleFlip,
    handleDifficultyRating,
    handleSkip
  };
};
