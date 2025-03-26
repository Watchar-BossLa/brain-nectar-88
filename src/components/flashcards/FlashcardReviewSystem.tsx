
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ReviewComplete from './review/ReviewComplete';
import ReviewLoading from './review/ReviewLoading';
import ReviewCard from './review/ReviewCard';
import ReviewProgress from './review/ReviewProgress';
import { useReviewSystem } from './review/useReviewSystem';

interface FlashcardReviewSystemProps {
  onComplete?: () => void;
}

const FlashcardReviewSystem: React.FC<FlashcardReviewSystemProps> = ({ onComplete }) => {
  const {
    flashcards,
    currentIndex,
    isFlipped,
    isLoading,
    reviewComplete,
    retentionStats,
    currentCard,
    handleFlip,
    handleDifficultyRating,
    handleRestart
  } = useReviewSystem(onComplete);

  if (isLoading) {
    return <ReviewLoading />;
  }

  if (reviewComplete || flashcards.length === 0) {
    return (
      <ReviewComplete 
        flashcardsCount={flashcards.length} 
        retentionStats={retentionStats}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      <ReviewProgress 
        currentIndex={currentIndex} 
        totalCards={flashcards.length} 
      />
      
      <AnimatePresence mode="wait">
        <ReviewCard
          currentCard={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onRating={handleDifficultyRating}
        />
      </AnimatePresence>
    </div>
  );
};

export default FlashcardReviewSystem;
