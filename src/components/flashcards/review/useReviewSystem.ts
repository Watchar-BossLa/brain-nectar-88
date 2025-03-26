
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getDueFlashcards, updateFlashcardAfterReview, calculateFlashcardRetention } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useReviewSystem = (onComplete?: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [retentionStats, setRetentionStats] = useState<{ overall: number; improved: number }>({ 
    overall: 0, 
    improved: 0 
  });

  // Load due flashcards
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getDueFlashcards(user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setReviewComplete(true);
        }
      } catch (err) {
        toast({
          title: 'Error loading flashcards',
          description: 'There was a problem loading your flashcards for review.',
          variant: 'destructive',
        });
        console.error('Error loading flashcards:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlashcards();
  }, [user, toast]);

  // Get retention stats when review is complete
  useEffect(() => {
    const getRetentionStats = async () => {
      if (!user || !reviewComplete) return;
      
      try {
        const { overallRetention } = await calculateFlashcardRetention(user.id);
        setRetentionStats({
          overall: Math.round(overallRetention * 100),
          improved: Math.round(Math.random() * 15) + 5 // Placeholder - would calculate actual improvement
        });
      } catch (err) {
        console.error('Error getting retention stats:', err);
      }
    };
    
    getRetentionStats();
  }, [user, reviewComplete]);

  // Handle flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle difficulty rating
  const handleDifficultyRating = async (difficulty: number) => {
    if (!user || currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    
    try {
      await updateFlashcardAfterReview(currentCard.id, difficulty);
      
      // Move to next card or complete review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setReviewComplete(true);
        if (onComplete) onComplete();
      }
    } catch (err) {
      toast({
        title: 'Error saving review',
        description: 'There was a problem saving your review.',
        variant: 'destructive',
      });
      console.error('Error updating flashcard:', err);
    }
  };

  // Restart review
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
  };

  return {
    flashcards,
    currentIndex,
    isFlipped,
    isLoading,
    reviewComplete,
    retentionStats,
    currentCard: flashcards[currentIndex],
    handleFlip,
    handleDifficultyRating,
    handleRestart
  };
};
