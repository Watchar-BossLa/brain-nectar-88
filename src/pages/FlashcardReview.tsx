
import React from 'react';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import LoadingSkeleton from '@/components/flashcards/review-page/LoadingSkeleton';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import ReviewHeader from '@/components/flashcards/review-page/ReviewHeader';
import FlashcardView from '@/components/flashcards/review-page/FlashcardView';
import RatingButtons from '@/components/flashcards/review-page/RatingButtons';

const FlashcardReview = () => {
  const {
    isLoading,
    flashcards,
    currentIndex,
    reviewsCompleted,
    totalToReview,
    currentFlashcard,
    reviewState,
    handleFlip,
    handleDifficultyRating,
    handleSkip
  } = useFlashcardReview(() => {
    // Callback for when review is complete
    console.log("Review completed");
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!flashcards || flashcards.length === 0) {
    return <EmptyReviewState />;
  }

  const isFlipped = reviewState === 'answering';

  return (
    <div className="container max-w-5xl py-10">
      <ReviewHeader 
        reviewsCompleted={reviewsCompleted} 
        totalToReview={totalToReview} 
      />
      
      {currentFlashcard && (
        <FlashcardView
          flashcard={currentFlashcard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      )}
      
      <RatingButtons 
        isFlipped={isFlipped}
        onRating={handleDifficultyRating}
        onSkip={handleSkip}
        onRevealAnswer={handleFlip}
      />
    </div>
  );
};

export default FlashcardReview;
