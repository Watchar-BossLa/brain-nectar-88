
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';
import LatexRenderer from '@/components/math/LatexRenderer';
import { calculateFlashcardRetention, recordFlashcardReview } from '@/services/spacedRepetition';

/**
 * Enhanced spaced repetition component for optimized learning
 */
const EnhancedSpacedRepetition = ({ flashcards, onComplete, onRetentionChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [retentionData, setRetentionData] = useState({
    before: { average: 0 },
    current: { average: 0 },
    change: 0
  });
  const [reviewStats, setReviewStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0
  });

  // Get current card
  const currentCard = flashcards && flashcards.length > 0 && currentIndex < flashcards.length
    ? flashcards[currentIndex]
    : null;

  // Fetch initial retention data
  useEffect(() => {
    if (user && flashcards && flashcards.length > 0) {
      fetchRetentionData();
    }
  }, [user, flashcards]);

  const fetchRetentionData = async () => {
    if (!user) return;

    try {
      const retention = await calculateFlashcardRetention(user.id);
      setRetentionData(prev => ({
        ...prev,
        before: { average: retention.averageRetention },
        current: { average: retention.averageRetention }
      }));
    } catch (error) {
      console.error('Error fetching retention data:', error);
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleDifficultyRating = async (difficulty) => {
    if (!currentCard) return;

    try {
      // Record the review
      await recordFlashcardReview({
        flashcardId: currentCard.id,
        difficulty,
        reviewedAt: new Date().toISOString()
      });

      // Update stats
      setReviewStats(prev => {
        const newStats = { ...prev, total: prev.total + 1 };
        
        if (difficulty <= 2) newStats.hard++;
        else if (difficulty <= 4) newStats.medium++;
        else newStats.easy++;
        
        return newStats;
      });

      // Move to the next card or complete review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Final card completed
        const newRetention = await calculateFlashcardRetention(user.id);
        
        setRetentionData(prev => ({
          before: prev.before,
          current: { average: newRetention.averageRetention },
          change: newRetention.averageRetention - prev.before.average
        }));
        
        if (onRetentionChange) {
          onRetentionChange(newRetention);
        }
        
        setReviewComplete(true);
        
        toast({
          title: "Review Complete!",
          description: `You've completed your review session. Great job!`,
        });
        
        if (onComplete) {
          onComplete(reviewStats);
        }
      }
    } catch (error) {
      console.error('Error recording review:', error);
      toast({
        title: "Error",
        description: "Failed to record your review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderDifficultyButtons = () => (
    <div className="grid grid-cols-5 gap-2 mt-6">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          variant={
            rating <= 2 ? "destructive" : 
            rating <= 4 ? "secondary" : 
            "default"
          }
          onClick={() => handleDifficultyRating(rating)}
          className="flex flex-col py-2 h-auto"
        >
          <span className="text-lg">{getDifficultyEmoji(rating)}</span>
          <span className="text-xs mt-1">{getDifficultyLabel(rating)}</span>
        </Button>
      ))}
    </div>
  );

  const getDifficultyEmoji = (rating) => {
    switch (rating) {
      case 1: return "😣"; // Very Hard
      case 2: return "😔"; // Hard
      case 3: return "😐"; // Medium
      case 4: return "🙂"; // Easy
      case 5: return "😄"; // Very Easy
      default: return "";
    }
  };

  const getDifficultyLabel = (rating) => {
    switch (rating) {
      case 1: return "Very Hard";
      case 2: return "Hard";
      case 3: return "Medium";
      case 4: return "Easy";
      case 5: return "Very Easy";
      default: return "";
    }
  };

  // Show completed screen
  if (reviewComplete) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Your Review Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
              <p className="text-sm text-muted-foreground">Easy</p>
              <p className="text-2xl font-bold text-green-600">{reviewStats.easy}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">{reviewStats.medium}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
              <p className="text-sm text-muted-foreground">Hard</p>
              <p className="text-2xl font-bold text-red-600">{reviewStats.hard}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Retention Impact</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Before</span>
              <span className="font-medium">{(retentionData.before.average * 100).toFixed(1)}%</span>
            </div>
            <Progress value={retentionData.before.average * 100} className="h-2" />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">After</span>
              <span className="font-medium">{(retentionData.current.average * 100).toFixed(1)}%</span>
            </div>
            <Progress value={retentionData.current.average * 100} className="h-2" />
            
            <div className="mt-2 text-sm">
              {retentionData.change > 0 ? (
                <span className="text-green-600">+{(retentionData.change * 100).toFixed(1)}% improvement</span>
              ) : (
                <span className="text-muted-foreground">No change in retention yet</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => window.location.href = '/flashcards'}>
            Return to Flashcards
          </Button>
        </div>
      </Card>
    );
  }

  // Show no cards message
  if (!currentCard) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-medium mb-2">No Cards to Review</h2>
        <p className="text-muted-foreground mb-4">
          You've caught up with all your reviews. Check back later!
        </p>
        <Button onClick={() => window.location.href = '/flashcards'}>
          Return to Flashcards
        </Button>
      </Card>
    );
  }

  // Determine if content has LaTeX
  const hasLatex = (content) => {
    return content.includes('$$') || content.includes('$');
  };

  // Main review card
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Review Flashcard</h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {flashcards.length}
        </span>
      </div>
      
      <Progress value={(currentIndex / flashcards.length) * 100} className="h-1 mb-6" />
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Question</h3>
        <div className="p-4 bg-muted/30 rounded-md min-h-[100px] flex items-center justify-center">
          <div className="max-w-full">
            {hasLatex(currentCard.front_content) ? (
              <LatexRenderer latex={currentCard.front_content} />
            ) : (
              <p className="text-lg">{currentCard.front_content}</p>
            )}
          </div>
        </div>
      </div>
      
      {showAnswer ? (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Answer</h3>
          <ScrollArea className="p-4 bg-muted/30 rounded-md min-h-[100px] max-h-[200px]">
            {hasLatex(currentCard.back_content) ? (
              <LatexRenderer latex={currentCard.back_content} />
            ) : (
              <p className="text-lg">{currentCard.back_content}</p>
            )}
          </ScrollArea>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-1">How well did you know this?</h3>
            {renderDifficultyButtons()}
          </div>
        </div>
      ) : (
        <Button onClick={handleReveal} className="w-full">
          Show Answer
        </Button>
      )}
    </Card>
  );
};

export default EnhancedSpacedRepetition;
