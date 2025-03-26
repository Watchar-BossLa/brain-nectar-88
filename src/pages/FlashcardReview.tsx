
import React from 'react';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import LoadingSkeleton from '@/components/flashcards/review-page/LoadingSkeleton';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import ReviewHeader from '@/components/flashcards/review-page/ReviewHeader';
import FlashcardView from '@/components/flashcards/review-page/FlashcardView';
import RatingButtons from '@/components/flashcards/review-page/RatingButtons';

const FlashcardReview = () => {
  const {
    loading,
    flashcards,
    currentIndex,
    showAnswer,
    reviewsCompleted,
    totalToReview,
    currentFlashcard,
    handleFlip,
    handleDifficultyRating,
    handleSkip
  } = useFlashcardReview();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (flashcards.length === 0) {
    return <EmptyReviewState />;
  }

  return (
    <div className="container max-w-5xl py-10">
      <ReviewHeader 
        reviewsCompleted={reviewsCompleted} 
        totalToReview={totalToReview} 
      />
      
      {currentFlashcard && (
        <FlashcardView
          flashcard={currentFlashcard}
          isFlipped={showAnswer}
          onFlip={handleFlip}
        />
      )}
      
      <RatingButtons 
        isFlipped={showAnswer}
        onRating={handleDifficultyRating}
        onSkip={handleSkip}
        onRevealAnswer={handleFlip}
      />
    </div>
  );
};

export default FlashcardReview;
