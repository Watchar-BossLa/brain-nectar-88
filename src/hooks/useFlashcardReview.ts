
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Flashcard } from '@/hooks/flashcards/types';

export const useFlashcardReview = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useAuth();
  
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
      
      // Convert database format to Flashcard format
      const convertedCards: Flashcard[] = data.map(card => ({
        id: card.id,
        deck_id: card.deck_id || '',
        front: card.front_content || '',
        back: card.back_content || '',
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        easiness_factor: card.easiness_factor,
        interval: card.interval,
        repetitions: card.repetitions,
        last_reviewed_at: card.last_reviewed_at,
        next_review_at: card.next_review_date,
        review_count: card.review_count,
        // Additional fields for front-end compatibility
        front_content: card.front_content,
        back_content: card.back_content,
        topic_id: card.topic_id,
        difficulty: card.difficulty,
        mastery_level: card.mastery_level,
        repetition_count: card.repetition_count,
        next_review_date: card.next_review_date,
        last_retention: card.last_retention
      }));

      setFlashcards(convertedCards);
      
      // Reset the current index and flip state
      setCurrentIndex(0);
      setIsFlipped(false);
      
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
      
      // Move to the next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // All cards reviewed, fetch new set or show completion message
        await fetchDueFlashcards();
      }
      
    } catch (err) {
      console.error('Error reviewing flashcard:', err);
    }
  };
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const skipCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
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
    refreshCards: fetchDueFlashcards
  };
};
