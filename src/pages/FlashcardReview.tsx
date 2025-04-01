
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmptyFlashcardState from '@/components/flashcards/EmptyFlashcardState';
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
        <EmptyFlashcardState 
          title="No flashcards to review"
          description="You've caught up with all your flashcard reviews. Well done!"
        />
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
          <EmptyFlashcardState 
            title="Review Complete"
            description="You've completed all your flashcard reviews for now. Come back later for more!"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default FlashcardReview;
