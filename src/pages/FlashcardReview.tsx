
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmptyReviewState from '@/components/flashcards/review-page/EmptyReviewState';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import SpacedRepetitionCard from '@/components/flashcards/SpacedRepetitionCard';

const FlashcardReview = () => {
  const {
    currentCard,
    reviewState,
    handleDifficultyRating,
    completeReview,
  } = useFlashcardReview();

  if (!currentCard && reviewState !== 'complete') {
    return (
      <MainLayout>
        <EmptyReviewState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Flashcard Review</h1>
        
        {currentCard ? (
          <SpacedRepetitionCard
            flashcard={currentCard}
            onComplete={completeReview}
            onUpdateStats={completeReview}
          />
        ) : (
          <EmptyReviewState />
        )}
      </div>
    </MainLayout>
  );
};

export default FlashcardReview;
