
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FlashcardView from './review-page/FlashcardView';
import { getDueFlashcards } from '@/services/spacedRepetition';

interface FlashcardReviewSystemProps {
  userId: string;
}

const FlashcardReviewSystem: React.FC<FlashcardReviewSystemProps> = ({ userId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const result = await getDueFlashcards(userId);
        setFlashcards(result || []);
      } catch (error) {
        console.error('Error loading flashcards for review:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [userId]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFinished(false);
  };

  if (loading) {
    return <div>Loading flashcards...</div>;
  }

  if (flashcards.length === 0) {
    return <div>No flashcards due for review.</div>;
  }

  if (finished) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Review Completed!</h2>
        <p className="mb-6">You've reviewed all your due flashcards.</p>
        <Button onClick={handleRestart}>Review Again</Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground">
        Card {currentIndex + 1} of {flashcards.length}
      </div>
      
      <FlashcardView 
        flashcard={currentCard}
        onNext={handleNext}
      />
    </div>
  );
};

export default FlashcardReviewSystem;
