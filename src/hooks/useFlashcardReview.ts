
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';

export const useFlashcardReview = (onComplete?: () => void) => {
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [reviewCards, setReviewCards] = useState<any[]>([]);
  const [reviewState, setReviewState] = useState<'reviewing' | 'answering' | 'complete'>('reviewing');
  const [reviewStats, setReviewStats] = useState({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDueCards();
    }
  }, [user]);

  const loadDueCards = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .or(`next_review_date.lte.${today},next_review_date.is.null`);
        
      if (error) throw error;
      
      setReviewCards(data || []);
      if (data && data.length > 0) {
        setCurrentCard(data[0]);
      }
    } catch (err) {
      console.error('Error loading due cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showAnswer = () => {
    setReviewState('answering');
  };

  const rateCard = async (difficulty: number) => {
    if (!currentCard) return;
    
    // Update flashcard in the database with new spaced repetition values
    try {
      // Calculate new spaced repetition values based on difficulty rating
      const easinessFactor = Math.max(1.3, (currentCard.easiness_factor || 2.5) + 
        (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
      
      let repetitions = currentCard.repetitions || 0;
      if (difficulty < 3) {
        repetitions = 0;
      } else {
        repetitions += 1;
      }
      
      // Calculate next interval
      let interval;
      if (repetitions <= 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round((currentCard.interval || 1) * easinessFactor);
      }
      
      // Calculate next review date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      
      // Update the database
      const { error } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: easinessFactor,
          repetitions: repetitions,
          interval: interval,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextDate.toISOString(),
          repetition_count: (currentCard.repetition_count || 0) + 1,
          last_retention: difficulty
        })
        .eq('id', currentCard.id);
      
      if (error) throw error;
      
      // Update stats
      const newStats = { ...reviewStats };
      newStats.totalReviewed++;
      
      if (difficulty <= 2) newStats.hard++;
      else if (difficulty === 3) newStats.medium++;
      else newStats.easy++;
      
      // Update average
      const totalRatings = newStats.totalReviewed;
      const totalScore = newStats.averageRating * (totalRatings - 1) + difficulty;
      newStats.averageRating = totalScore / totalRatings;
      
      setReviewStats(newStats);
      
      // Move to the next card
      const currentIndex = reviewCards.findIndex(card => card.id === currentCard.id);
      if (currentIndex < reviewCards.length - 1) {
        setCurrentCard(reviewCards[currentIndex + 1]);
        setReviewState('reviewing');
      } else {
        setReviewState('complete');
        setCurrentCard(null);
        if (onComplete) onComplete();
      }
    } catch (err) {
      console.error('Error updating flashcard:', err);
    }
  };
  
  const completeReview = () => {
    if (onComplete) onComplete();
  };

  return {
    currentCard,
    reviewState,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview,
    isLoading,
    reviewCards
  };
};
