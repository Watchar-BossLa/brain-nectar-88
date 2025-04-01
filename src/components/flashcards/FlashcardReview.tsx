
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import SpacedRepetitionCard from '@/components/flashcards/SpacedRepetitionCard';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/layouts/MainLayout';

const FlashcardReview = () => {
  const {
    flashcards,
    currentFlashcard,
    currentIndex,
    isFlipped,
    loading,
    flipCard,
    reviewFlashcard,
    refreshCards
  } = useFlashcardReview();

  const handleSkip = () => {
    if (currentIndex < flashcards.length - 1) {
      // For now, just move to the next card without updating
      refreshCards();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>No Flashcards Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You don't have any flashcards due for review right now. Check back later!</p>
            <Button onClick={refreshCards}>Check Again</Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  if (currentIndex >= flashcards.length) {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Review Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've completed your review session for today!</p>
            <Button onClick={refreshCards}>Start New Session</Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const progress = Math.round((currentIndex / flashcards.length) * 100);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              Progress: {currentIndex} of {flashcards.length} cards
            </div>
            <div className="text-sm font-medium">{progress}%</div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {currentFlashcard && (
          <SpacedRepetitionCard
            flashcard={currentFlashcard}
            onComplete={async (difficulty: number) => {
              await reviewFlashcard(currentFlashcard.id, difficulty);
            }}
          />
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlashcardReview;
