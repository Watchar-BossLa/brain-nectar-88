
import React from 'react';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import LoadingSkeleton from '@/components/flashcards/review-page/LoadingSkeleton';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import ReviewHeader from '@/components/flashcards/review-page/ReviewHeader';
import FlashcardView from '@/components/flashcards/review-page/FlashcardView';
import RatingButtons from '@/components/flashcards/review-page/RatingButtons';
import { Flashcard } from '@/types/supabase';

const FlashcardReview = () => {
  const {
    loading,
    flashcards,
    currentIndex,
    isFlipped,
    currentFlashcard,
    flipCard,
    reviewFlashcard,
    skipCard
  } = useFlashcardReview();
  
  // Derived state
  const reviewComplete = !loading && (!flashcards || flashcards.length === 0 || currentIndex >= flashcards.length);
  const reviewStats = {
    totalReviewed: currentIndex
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!flashcards || flashcards.length === 0) {
    return <EmptyReviewState />;
  }

  const reviewsCompleted = reviewStats.totalReviewed || 0;
  const totalToReview = flashcards.length || 0;

  // Safe conversion of the currentCard to Supabase Flashcard type
  const displayCard: Flashcard = currentFlashcard ? {
    id: currentFlashcard.id,
    user_id: currentFlashcard.user_id || '',
    topic_id: currentFlashcard.topicId || currentFlashcard.topic_id || null,
    front_content: currentFlashcard.front || currentFlashcard.front_content || '',
    back_content: currentFlashcard.back || currentFlashcard.back_content || '',
    difficulty: currentFlashcard.difficulty || 0,
    next_review_date: currentFlashcard.next_review_date || new Date().toISOString(),
    repetition_count: currentFlashcard.repetition_count || 0,
    mastery_level: currentFlashcard.mastery_level || 0,
    created_at: currentFlashcard.created_at || new Date().toISOString(),
    updated_at: currentFlashcard.updated_at || new Date().toISOString(),
    easiness_factor: currentFlashcard.easiness_factor || 2.5,
    last_retention: currentFlashcard.last_retention || 0,
    last_reviewed_at: currentFlashcard.last_reviewed_at || null
  } : {} as Flashcard;

  return (
    <div className="container max-w-5xl py-10">
      <ReviewHeader 
        reviewsCompleted={reviewsCompleted} 
        totalToReview={totalToReview} 
      />
      
      {currentFlashcard && (
        <FlashcardView
          flashcard={displayCard}
          isFlipped={isFlipped}
          onFlip={flipCard}
        />
      )}
      
      <RatingButtons 
        isFlipped={isFlipped}
        onRating={difficulty => currentFlashcard && reviewFlashcard(currentFlashcard.id, difficulty)}
        onSkip={skipCard}
        onRevealAnswer={flipCard}
      />
    </div>
  );
};

export default FlashcardReview;
