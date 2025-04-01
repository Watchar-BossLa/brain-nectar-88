import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDueFlashcards } from '@/services/spacedRepetition';
import ReviewCard from './review/ReviewCard';
import ReviewComplete from './review/ReviewComplete';
import ReviewProgress from './review/ReviewProgress';
import ReviewLoading from './review/ReviewLoading';
import { Flashcard } from '@/types/supabase';

const FlashcardReviewSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadFlashcards = async () => {
      setLoading(true);
      try {
        const dueFlashcards = await fetchDueFlashcards(user.id);
        setFlashcards(dueFlashcards);
        setReviewComplete(dueFlashcards.length === 0);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards for review.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [user, toast]);

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setReviewComplete(true);
    }
  };

  const restartReview = () => {
    setCurrentCardIndex(0);
    setReviewComplete(false);
  };

  if (loading) {
    return <ReviewLoading />;
  }

  if (reviewComplete) {
    return (
      <ReviewComplete 
        restartReview={restartReview} 
        totalCards={flashcards.length}
      />
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Flashcards Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have no flashcards due for review at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flashcard Review</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ReviewProgress
          current={currentCardIndex + 1}
          total={flashcards.length}
        />
        <ReviewCard
          flashcard={currentCard}
          nextCard={nextCard}
        />
      </CardContent>
    </Card>
  );
};

export default FlashcardReviewSystem;
