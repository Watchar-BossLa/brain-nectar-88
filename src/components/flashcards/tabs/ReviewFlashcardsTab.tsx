import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchDueFlashcards } from '@/services/spacedRepetition';
import { Hourglass, BookOpen } from 'lucide-react';

interface ReviewFlashcardsTabProps {
  topicId?: string;
}

const ReviewFlashcardsTab: React.FC<ReviewFlashcardsTabProps> = ({ topicId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dueFlashcardsCount, setDueFlashcardsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDueFlashcardsCount = async () => {
      setLoading(true);
      try {
        const dueCards = await fetchDueFlashcards(user.id, topicId);
        setDueFlashcardsCount(dueCards.length);
      } catch (error) {
        console.error("Error fetching due flashcards:", error);
        setDueFlashcardsCount(null);
      } finally {
        setLoading(false);
      }
    };

    loadDueFlashcardsCount();
  }, [user, topicId]);

  const navigateToReview = () => {
    const reviewPath = topicId ? `/flashcard-review?topic=${topicId}` : '/flashcard-review';
    navigate(reviewPath);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Flashcards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center space-x-2">
            <Hourglass className="h-4 w-4 animate-spin" />
            <p>Loading due flashcards...</p>
          </div>
        ) : dueFlashcardsCount === null ? (
          <p className="text-red-500">Failed to load due flashcards.</p>
        ) : dueFlashcardsCount === 0 ? (
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No flashcards due for review right now.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p>
                {dueFlashcardsCount} flashcards due for review.
              </p>
              <Button onClick={navigateToReview}>Start Review</Button>
            </div>
            <Progress value={100} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewFlashcardsTab;
