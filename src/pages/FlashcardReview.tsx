
import React from 'react';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import LoadingSkeleton from '@/components/flashcards/review-page/LoadingSkeleton';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import ReviewHeader from '@/components/flashcards/review-page/ReviewHeader';
import FlashcardView from '@/components/flashcards/review-page/FlashcardView';
import RatingButtons from '@/components/flashcards/review-page/RatingButtons';
import { Flashcard } from '@/types/flashcards';

const FlashcardReview = () => {
  const {
    isLoading,
    reviewCards,
    currentCardIndex,
    reviewStats,
    currentCard,
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

  if (!reviewCards || reviewCards.length === 0) {
    return <EmptyReviewState />;
  }

  const reviewsCompleted = reviewStats.totalReviewed || 0;
  const totalToReview = reviewCards.length || 0;
  const isFlipped = reviewState === 'answering';

  // Create a display card that conforms to our Flashcard interface
  const displayCard: Flashcard = currentCard ? {
    id: currentCard.id,
    user_id: currentCard.user_id || currentCard.userId || '',
    topic_id: currentCard.topic_id || currentCard.topicId || null,
    front_content: currentCard.front_content || currentCard.front || '',
    back_content: currentCard.back_content || currentCard.back || '',
    difficulty: currentCard.difficulty || 0,
    next_review_date: currentCard.next_review_date || new Date().toISOString(),
    repetition_count: currentCard.repetition_count || currentCard.repetitionCount || 0,
    mastery_level: currentCard.mastery_level || currentCard.mastery || 0,
    created_at: currentCard.created_at || currentCard.created || new Date().toISOString(),
    updated_at: currentCard.updated_at || new Date().toISOString(),
    easiness_factor: currentCard.easiness_factor || currentCard.easinessFactor || 2.5,
    last_retention: currentCard.last_retention || 0,
    last_reviewed_at: currentCard.last_reviewed_at || currentCard.lastReviewed || null
  } : {} as Flashcard;

  return (
    <div className="container max-w-5xl py-10">
      <ReviewHeader 
        reviewsCompleted={reviewsCompleted} 
        totalToReview={totalToReview} 
      />
      
      {currentCard && (
        <FlashcardView
          flashcard={displayCard}
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
