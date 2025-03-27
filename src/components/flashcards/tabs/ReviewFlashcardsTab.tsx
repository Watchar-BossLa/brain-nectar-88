
import React from 'react';
import FlashcardReviewSystem from '@/components/flashcards/FlashcardReviewSystem';

interface ReviewFlashcardsTabProps {
  onComplete: () => void;
}

const ReviewFlashcardsTab = ({ onComplete }: ReviewFlashcardsTabProps) => {
  return (
    <FlashcardReviewSystem onComplete={onComplete} />
  );
};

export default ReviewFlashcardsTab;
