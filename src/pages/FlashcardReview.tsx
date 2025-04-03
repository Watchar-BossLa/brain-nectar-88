
import React from 'react';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import LoadingSkeleton from '@/components/flashcards/review-page/LoadingSkeleton';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import ReviewHeader from '@/components/flashcards/review-page/ReviewHeader';
import FlashcardView from '@/components/flashcards/review-page/FlashcardView';
import RatingButtons from '@/components/flashcards/review-page/RatingButtons';
import { Flashcard } from '@/types/flashcard';

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

  // Safe conversion to ensure the Flashcard type is consistent
  const displayCard = currentCard ? {
    id: currentCard.id,
    userId: currentCard.userId || currentCard.user_id || '',
    topicId: currentCard.topicId || currentCard.topic_id || null,
    frontContent: currentCard.frontContent || currentCard.front_content || '',
    backContent: currentCard.backContent || currentCard.back_content || '',
    difficulty: currentCard.difficulty || 0,
    nextReviewDate: currentCard.nextReviewDate || currentCard.next_review_date || new Date().toISOString(),
    repetitionCount: currentCard.repetitionCount || currentCard.repetition_count || 0,
    masteryLevel: currentCard.masteryLevel || currentCard.mastery_level || 0,
    createdAt: currentCard.createdAt || currentCard.created_at || new Date().toISOString(),
    updatedAt: currentCard.updatedAt || currentCard.updated_at || new Date().toISOString(),
    easinessFactor: currentCard.easinessFactor || currentCard.easiness_factor || 2.5,
    lastRetention: currentCard.lastRetention || currentCard.last_retention || 0,
    lastReviewedAt: currentCard.lastReviewedAt || currentCard.last_reviewed_at || null
  } as Flashcard : {} as Flashcard;

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
