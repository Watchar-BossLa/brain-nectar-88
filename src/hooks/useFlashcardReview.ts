
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';

export const useFlashcardReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewsCompleted, setReviewsCompleted] = useState(0);
  const [totalToReview, setTotalToReview] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchFlashcardsForReview = async () => {
      try {
        setLoading(true);
        const now = new Date().toISOString();
        
        // Fetch flashcards that are due for review
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .lte('next_review_date', now)
          .order('next_review_date', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setFlashcards(data);
          setTotalToReview(data.length);
        } else {
          // No flashcards to review
          toast({
            title: "All caught up!",
            description: "You have no flashcards due for review right now.",
          });
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: "Error",
          description: "Failed to load flashcards for review.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardsForReview();
  }, [user, toast]);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleDifficultyRating = async (difficulty: number) => {
    if (!user || !flashcards[currentIndex]) return;
    
    try {
      const flashcard = flashcards[currentIndex];
      const now = new Date();
      
      // Calculate new values based on difficulty rating
      const newEasinessFactor = calculateEasinessFactor(flashcard.easiness_factor || 2.5, difficulty);
      const newRepetitionCount = difficulty < 3 ? 0 : (flashcard.repetition_count + 1);
      const newInterval = calculateNextInterval(newRepetitionCount, newEasinessFactor);
      
      // Calculate next review date
      const nextReviewDate = new Date();
      nextReviewDate.setDate(now.getDate() + newInterval);
      
      // Estimate retention based on difficulty (simplified)
      const retentionEstimate = calculateRetentionEstimate(difficulty);
      
      // Update the flashcard in the database
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: newEasinessFactor,
          repetition_count: newRepetitionCount,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: now.toISOString(),
          mastery_level: calculateMasteryLevel(newRepetitionCount),
          last_retention: retentionEstimate
        })
        .eq('id', flashcard.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Record the review in the flashcard_reviews table
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          user_id: user.id,
          flashcard_id: flashcard.id,
          difficulty_rating: difficulty,
          retention_estimate: retentionEstimate
        });
      
      if (reviewError) {
        throw reviewError;
      }
      
      // Move to the next card
      setReviewsCompleted(prev => prev + 1);
      setShowAnswer(false);
      
      // If there are more cards, move to the next one
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // All cards reviewed
        toast({
          title: "Review completed!",
          description: `You've reviewed all ${flashcards.length} flashcards.`,
        });
        
        // Give the user a moment to see the completion message
        setTimeout(() => {
          navigate('/flashcards');
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to save your review.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    setShowAnswer(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setReviewsCompleted(prev => prev + 1);
    }
  };

  // Spaced repetition algorithm helper functions
  const calculateEasinessFactor = (oldEF: number, quality: number) => {
    // SM-2 algorithm for calculating the easiness factor
    let newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(1.3, newEF); // EF should not be below 1.3
  };
  
  const calculateNextInterval = (repetitionCount: number, easinessFactor: number) => {
    // SM-2 algorithm for interval calculation
    if (repetitionCount === 0) return 1; // 1 day for relearning
    if (repetitionCount === 1) return 3; // 3 days for first successful review
    if (repetitionCount === 2) return 7; // 7 days for second successful review
    
    // For subsequent reviews, multiply the previous interval by EF
    const previousInterval = calculateNextInterval(repetitionCount - 1, easinessFactor);
    return Math.round(previousInterval * easinessFactor);
  };
  
  const calculateRetentionEstimate = (difficulty: number) => {
    // Simplified retention estimate based on difficulty
    // 0 = forgot completely, 5 = perfect recall
    return Math.max(0, Math.min(1, difficulty / 5));
  };
  
  const calculateMasteryLevel = (repetitionCount: number) => {
    // Simple mastery level calculation based on repetition count
    // More sophisticated implementations would consider retention and time
    return Math.min(1, repetitionCount / 10);
  };

  return {
    loading,
    flashcards,
    currentIndex,
    showAnswer,
    reviewsCompleted,
    totalToReview,
    currentFlashcard: flashcards[currentIndex],
    handleFlip,
    handleDifficultyRating,
    handleSkip,
    navigate
  };
};
