import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Flashcard } from '@/hooks/flashcards/types';

export interface ReviewStats {
  totalReviewed: number;
  easy: number;
  medium: number;
  hard: number;
  averageRating: number;
}

export type ReviewState = 'reviewing' | 'answering' | 'complete';

export const useFlashcardReview = (onComplete?: () => void) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewState, setReviewState] = useState<ReviewState>('reviewing');
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const { user } = useAuth();
  
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });
  
  useEffect(() => {
    fetchDueFlashcards();
  }, [user]);
  
  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .or(`next_review_date.lte.${today},next_review_date.is.null`);
      
      if (error) throw error;
      
      // Convert database format to Flashcard format with necessary fields
      const convertedCards: Flashcard[] = data.map(card => ({
        id: card.id,
        deck_id: card.topic_id || '', // Using topic_id as a fallback
        front: card.front_content || '',
        back: card.back_content || '',
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        easiness_factor: card.easiness_factor,
        interval: card.repetition_count || 0, // Map to repetition_count as fallback
        repetitions: card.repetition_count || 0, // Map to repetition_count as fallback
        last_reviewed_at: card.last_reviewed_at,
        next_review_at: card.next_review_date,
        review_count: card.repetition_count || 0, // Map to repetition_count as fallback
        // Additional fields for front-end compatibility
        front_content: card.front_content,
        back_content: card.back_content,
        topic_id: card.topic_id,
        difficulty: card.difficulty,
        mastery_level: card.mastery_level,
        repetition_count: card.repetition_count,
        next_review_date: card.next_review_date,
        last_retention: card.last_retention,
        topic: card.topic || card.topic_id || '' // Use topic if available, fallback to topic_id
      }));

      setFlashcards(convertedCards);
      setReviewCards(convertedCards);
      
      // Reset the current index and flip state
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewState('reviewing');
      
    } catch (err) {
      console.error('Error fetching due flashcards:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const reviewFlashcard = async (flashcardId: string, difficulty: number) => {
    if (!user) return;
    
    try {
      // Get the current flashcard
      const currentCard = flashcards[currentIndex];
      
      // Calculate new spaced repetition values
      const easinessFactor = Math.max(1.3, (currentCard?.easiness_factor || 2.5) + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
      
      let repetitions = (currentCard?.repetitions || 0);
      if (difficulty < 3) {
        repetitions = 0;
      } else {
        repetitions += 1;
      }
      
      // Calculate next review interval
      let interval: number;
      if (repetitions <= 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round((currentCard?.interval || 0) * easinessFactor);
      }
      
      // Calculate next review date
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      
      // Update the flashcard
      const { error } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: easinessFactor,
          repetition_count: repetitions,
          interval: interval,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextReviewDate.toISOString(),
          mastery_level: Math.min(Math.floor((repetitions / 10) * 100), 100),
          review_count: (currentCard?.review_count || 0) + 1
        })
        .eq('id', flashcardId);
      
      if (error) throw error;

      // Update review stats
      setReviewStats(prev => {
        const newStats = { ...prev };
        newStats.totalReviewed++;
        
        if (difficulty <= 2) {
          newStats.hard++;
        } else if (difficulty === 3) {
          newStats.medium++;
        } else {
          newStats.easy++;
        }
        
        const totalRatings = (prev.totalReviewed * prev.averageRating) + difficulty;
        newStats.averageRating = totalRatings / newStats.totalReviewed;
        
        return newStats;
      });
      
      // Move to the next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setReviewState('reviewing');
      } else {
        // All cards reviewed, show completion state
        setReviewState('complete');
        if (onComplete) onComplete();
      }
      
    } catch (err) {
      console.error('Error reviewing flashcard:', err);
    }
  };
  
  const showAnswer = () => {
    setIsFlipped(true);
    setReviewState('answering');
  };
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setReviewState(isFlipped ? 'reviewing' : 'answering');
  };
  
  const skipCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setReviewState('reviewing');
    } else {
      setReviewState('complete');
      if (onComplete) onComplete();
    }
  };

  const rateCard = (difficulty: number) => {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      reviewFlashcard(currentCard.id, difficulty);
    }
  };

  const completeReview = () => {
    if (onComplete) onComplete();
  };
  
  const handleDifficultyRating = async (difficulty: number) => {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      await reviewFlashcard(currentCard.id, difficulty);
    }
  };

  const handleFlip = () => {
    flipCard();
  };
  
  const handleSkip = () => {
    skipCard();
  };
  
  return {
    flashcards,
    currentFlashcard: flashcards[currentIndex],
    isFlipped,
    loading,
    hasMoreCards: currentIndex < flashcards.length - 1,
    totalCards: flashcards.length,
    currentIndex,
    reviewFlashcard,
    flipCard,
    skipCard,
    refreshCards: fetchDueFlashcards,
    
    currentCard: flashcards[currentIndex],
    reviewState,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview,
    reviewCards,
    currentCardIndex: currentIndex,
    isLoading: loading,
    handleFlip,
    handleDifficultyRating,
    handleSkip
  };
};
