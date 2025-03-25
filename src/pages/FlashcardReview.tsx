
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, SkipForwardIcon, CheckIcon, XIcon, HelpCircleIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const FlashcardReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewsCompleted, setReviewsCompleted] = useState(0);
  const [totalToReview, setTotalToReview] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchFlashcardsForReview = async () => {
      try {
        setLoading(true);
        const now = new Date().toISOString();
        
        // Fetch flashcards that are due for review
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .lte('next_review_date', now)
          .order('next_review_date', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setFlashcards(data);
          setTotalToReview(data.length);
        } else {
          // No flashcards to review
          toast({
            title: "All caught up!",
            description: "You have no flashcards due for review right now.",
          });
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: "Error",
          description: "Failed to load flashcards for review.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardsForReview();
  }, [user, toast]);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleDifficultyRating = async (difficulty: number) => {
    if (!user || !flashcards[currentIndex]) return;
    
    try {
      const flashcard = flashcards[currentIndex];
      const now = new Date();
      
      // Calculate new values based on difficulty rating
      const newEasinessFactor = calculateEasinessFactor(flashcard.easiness_factor || 2.5, difficulty);
      const newRepetitionCount = difficulty < 3 ? 0 : (flashcard.repetition_count + 1);
      const newInterval = calculateNextInterval(newRepetitionCount, newEasinessFactor);
      
      // Calculate next review date
      const nextReviewDate = new Date();
      nextReviewDate.setDate(now.getDate() + newInterval);
      
      // Estimate retention based on difficulty (simplified)
      const retentionEstimate = calculateRetentionEstimate(difficulty);
      
      // Update the flashcard in the database
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: newEasinessFactor,
          repetition_count: newRepetitionCount,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: now.toISOString(),
          mastery_level: calculateMasteryLevel(newRepetitionCount),
          last_retention: retentionEstimate
        })
        .eq('id', flashcard.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Record the review in the flashcard_reviews table
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          user_id: user.id,
          flashcard_id: flashcard.id,
          difficulty_rating: difficulty,
          retention_estimate: retentionEstimate
        });
      
      if (reviewError) {
        throw reviewError;
      }
      
      // Move to the next card
      setReviewsCompleted(prev => prev + 1);
      setShowAnswer(false);
      
      // If there are more cards, move to the next one
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // All cards reviewed
        toast({
          title: "Review completed!",
          description: `You've reviewed all ${flashcards.length} flashcards.`,
        });
        
        // Give the user a moment to see the completion message
        setTimeout(() => {
          navigate('/flashcards');
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to save your review.",
        variant: "destructive",
      });
    }
  };
  
  // Spaced repetition algorithm helper functions
  const calculateEasinessFactor = (oldEF: number, quality: number) => {
    // SM-2 algorithm for calculating the easiness factor
    let newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(1.3, newEF); // EF should not be below 1.3
  };
  
  const calculateNextInterval = (repetitionCount: number, easinessFactor: number) => {
    // SM-2 algorithm for interval calculation
    if (repetitionCount === 0) return 1; // 1 day for relearning
    if (repetitionCount === 1) return 3; // 3 days for first successful review
    if (repetitionCount === 2) return 7; // 7 days for second successful review
    
    // For subsequent reviews, multiply the previous interval by EF
    const previousInterval = calculateNextInterval(repetitionCount - 1, easinessFactor);
    return Math.round(previousInterval * easinessFactor);
  };
  
  const calculateRetentionEstimate = (difficulty: number) => {
    // Simplified retention estimate based on difficulty
    // 0 = forgot completely, 5 = perfect recall
    return Math.max(0, Math.min(1, difficulty / 5));
  };
  
  const calculateMasteryLevel = (repetitionCount: number) => {
    // Simple mastery level calculation based on repetition count
    // More sophisticated implementations would consider retention and time
    return Math.min(1, repetitionCount / 10);
  };

  if (loading) {
    return (
      <div className="container max-w-5xl py-10">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl mb-4" />
        <div className="flex justify-center gap-4 mt-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="container max-w-5xl py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>No flashcards to review</CardTitle>
            <CardDescription>
              You're all caught up! Check back later for more cards to review.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/flashcards')}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to flashcards
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];
  const progressPercentage = Math.round((reviewsCompleted / totalToReview) * 100);

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcard Review</h1>
          <p className="text-muted-foreground">
            Reviewing {reviewsCompleted} of {totalToReview} cards
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/flashcards')}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to flashcards
        </Button>
      </div>
      
      <Progress value={progressPercentage} className="mb-8 h-2" />
      
      <div className="relative h-96 w-full perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFlashcard.id + (showAnswer ? '-back' : '-front')}
            initial={{ opacity: 0, rotateY: showAnswer ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: showAnswer ? -180 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <Card 
              className={`h-full w-full cursor-pointer ${showAnswer ? 'bg-muted/50' : ''}`}
              onClick={handleFlip}
            >
              <div className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {showAnswer ? 'Answer' : 'Question'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div 
                    className="text-xl"
                    style={{ transform: showAnswer ? 'rotateY(180deg)' : 'none' }}
                  >
                    {showAnswer 
                      ? <div dangerouslySetInnerHTML={{ __html: currentFlashcard.back_content }} />
                      : <div dangerouslySetInnerHTML={{ __html: currentFlashcard.front_content }} />
                    }
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    {showAnswer
                      ? "Rate how well you remembered this card"
                      : "Click to reveal the answer"}
                  </p>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {showAnswer ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => handleDifficultyRating(1)}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Forgot
          </Button>
          <Button 
            variant="outline" 
            className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
            onClick={() => handleDifficultyRating(2)}
          >
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Hard
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
            onClick={() => handleDifficultyRating(3)}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Good
          </Button>
          <Button 
            variant="outline" 
            className="border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleDifficultyRating(5)}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Easy
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleFlip}>
            Reveal Answer
          </Button>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="ghost" 
          className="text-muted-foreground"
          onClick={() => {
            setShowAnswer(false);
            if (currentIndex < flashcards.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setReviewsCompleted(prev => prev + 1);
            }
          }}
        >
          <SkipForwardIcon className="mr-2 h-4 w-4" />
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default FlashcardReview;
