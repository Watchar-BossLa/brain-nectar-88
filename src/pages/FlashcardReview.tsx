
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import { SpacedRepetitionCard } from '@/components/flashcards/SpacedRepetitionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';

// Add a skipCard function to the useFlashcardReview hook return type
const useReviewWithSkip = () => {
  const hookResult = useFlashcardReview();
  const { currentIndex, flashcards, setCurrentIndex } = hookResult as any;
  
  // Add skipCard function if it doesn't exist
  const skipCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  return { ...hookResult, skipCard };
};

const FlashcardReviewPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topicId = queryParams.get('topic');
  
  const [topicName, setTopicName] = useState<string>('');
  
  // Use the enhanced hook with skipCard
  const { 
    flashcards, 
    currentFlashcard, 
    currentIndex, 
    isFlipped, 
    loading, 
    flipCard, 
    reviewFlashcard, 
    refreshCards,
    skipCard 
  } = useReviewWithSkip();

  useEffect(() => {
    if (currentFlashcard && currentFlashcard.topic) {
      setTopicName(currentFlashcard.topic);
    }
  }, [currentFlashcard]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Loading flashcards...</p>
        </div>
      </MainLayout>
    );
  }

  if (flashcards.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Check className="h-12 w-12 text-green-500" />
          <h2 className="text-2xl font-bold mt-4">All Caught Up!</h2>
          <p className="mt-2 text-muted-foreground">
            You've reviewed all your due flashcards{topicName ? ` in ${topicName}` : ''}.
          </p>
          <Button onClick={refreshCards} className="mt-6">
            Check Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!currentFlashcard) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p>No flashcard to review.</p>
        </div>
      </MainLayout>
    );
  }

  const progress = ((currentIndex) / flashcards.length) * 100;

  return (
    <MainLayout>
      <div className="container py-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Flashcard Review</h1>
          <p className="text-muted-foreground">
            {currentFlashcard.topic_id ? `Topic: ${currentFlashcard.topic || 'Unknown'}` : 'Mixed Topics'}
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress: {currentIndex} of {flashcards.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {currentFlashcard && (
          <Card className="mb-4">
            <CardContent className="p-6">
              <SpacedRepetitionCard
                flashcard={currentFlashcard}
                isFlipped={isFlipped}
                onFlip={flipCard}
                onRate={async (difficulty) => {
                  await reviewFlashcard(currentFlashcard.id, difficulty);
                }}
              />
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={skipCard}
            disabled={currentIndex >= flashcards.length - 1}
          >
            Skip <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlashcardReviewPage;
