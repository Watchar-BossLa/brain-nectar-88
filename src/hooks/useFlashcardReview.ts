
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Flashcard } from '@/types/flashcards';

type ReviewState = 'loading' | 'active' | 'complete';

export const useFlashcardReview = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewState, setReviewState] = useState<ReviewState>('loading');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDueFlashcards();
    }
  }, [user]);

  const loadDueFlashcards = async () => {
    setReviewState('loading');
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', now)
        .order('next_review_date', { ascending: true })
        .limit(20); // Limit to avoid overwhelming the user
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert database format to our app's Flashcard format
        const formattedFlashcards: Flashcard[] = data.map(card => ({
          id: card.id,
          front_content: card.front_content,
          back_content: card.back_content,
          difficulty: card.difficulty || 3,
          next_review_date: card.next_review_date,
          repetition_count: card.repetition_count || 0,
          mastery_level: card.mastery_level || 0,
          easiness_factor: card.easiness_factor || 2.5,
          last_retention: card.last_retention,
          last_reviewed_at: card.last_reviewed_at,
          
          // Add UI field names for compatibility with components
          front: card.front_content,
          back: card.back_content,
          userId: card.user_id,
          topicId: card.topic_id,
          mastery: card.mastery_level || 0,
        }));
        
        setFlashcards(formattedFlashcards);
        setCurrentIndex(0);
        setReviewState('active');
      } else {
        setFlashcards([]);
        setReviewState('complete');
      }
    } catch (error) {
      console.error('Error loading due flashcards:', error);
      setReviewState('complete');
    }
  };

  const calculateNextReviewDate = (easinessFactor: number, repetitionCount: number) => {
    const now = new Date();
    const days = Math.round(easinessFactor * repetitionCount);
    now.setDate(now.getDate() + Math.max(1, days)); // At least 1 day
    return now.toISOString();
  };

  const updateEasinessFactor = (currentFactor: number, difficultyRating: number) => {
    // Convert 1-5 difficulty to 0-5 quality (reversed: 5=easy, 1=hard)
    const quality = 6 - difficultyRating;
    
    // SM-2 algorithm
    const newFactor = currentFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Clamp between 1.3 and 2.5
    return Math.max(1.3, Math.min(2.5, newFactor));
  };
  
  const calculateRetention = (difficulty: number, easinessFactor: number) => {
    // This is a simplified model based on difficulty and current easiness
    const baseRetention = 1.0 - (difficulty / 5.0);
    const modifiedRetention = baseRetention * Math.min(easinessFactor, 2.5) / 2.5;
    return Math.max(0.3, Math.min(0.95, modifiedRetention));
  };

  const calculateMasteryLevel = (currentMastery: number, retention: number, difficulty: number) => {
    // Convert difficulty (1-5) to mastery impact (higher difficulty = less mastery gain)
    const difficultyFactor = 1 - ((difficulty - 1) / 4);
    
    // Current mastery has more weight than new retention
    const newMastery = currentMastery * 0.7 + retention * 0.3 * difficultyFactor;
    
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, newMastery));
  };

  const handleDifficultyRating = async (difficultyRating: number) => {
    if (!user || currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    
    try {
      // Calculate new spaced repetition values
      const retention = calculateRetention(
        currentCard.difficulty, 
        currentCard.easiness_factor || 2.5
      );
      
      const newEasinessFactor = updateEasinessFactor(
        currentCard.easiness_factor || 2.5, 
        difficultyRating
      );
      
      const newMasteryLevel = calculateMasteryLevel(
        currentCard.mastery_level || 0,
        retention,
        difficultyRating
      );
      
      const nextReviewDate = calculateNextReviewDate(
        newEasinessFactor,
        (currentCard.repetition_count || 0) + 1
      );
      
      // Update the flashcard in the database
      await supabase
        .from('flashcards')
        .update({
          difficulty: difficultyRating,
          easiness_factor: newEasinessFactor,
          last_retention: retention,
          mastery_level: newMasteryLevel,
          repetition_count: (currentCard.repetition_count || 0) + 1,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextReviewDate
        })
        .eq('id', currentCard.id);
      
      // Record the review
      await supabase
        .from('flashcard_reviews')
        .insert({
          user_id: user.id,
          flashcard_id: currentCard.id,
          difficulty_rating: difficultyRating,
          retention_estimate: retention
        });
      
      // Move to the next card or complete the review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setReviewState('complete');
      }
    } catch (error) {
      console.error('Error updating flashcard after review:', error);
    }
  };
  
  const completeReview = () => {
    loadDueFlashcards();
  };

  return {
    currentCard: reviewState === 'active' ? flashcards[currentIndex] : null,
    reviewState,
    handleDifficultyRating,
    completeReview
  };
};
