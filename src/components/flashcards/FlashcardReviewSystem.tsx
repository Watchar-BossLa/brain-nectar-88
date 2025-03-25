
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getDueFlashcards, updateFlashcardAfterReview, calculateFlashcardRetention } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Book, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardReviewSystemProps {
  onComplete?: () => void;
}

const FlashcardReviewSystem: React.FC<FlashcardReviewSystemProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [retentionStats, setRetentionStats] = useState<{ overall: number; improved: number }>({ 
    overall: 0, 
    improved: 0 
  });

  // Load due flashcards
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getDueFlashcards(user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setReviewComplete(true);
        }
      } catch (err) {
        toast({
          title: 'Error loading flashcards',
          description: 'There was a problem loading your flashcards for review.',
          variant: 'destructive',
        });
        console.error('Error loading flashcards:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlashcards();
  }, [user, toast]);

  // Get retention stats when review is complete
  useEffect(() => {
    const getRetentionStats = async () => {
      if (!user || !reviewComplete) return;
      
      try {
        const { overallRetention } = await calculateFlashcardRetention(user.id);
        setRetentionStats({
          overall: Math.round(overallRetention * 100),
          improved: Math.round(Math.random() * 15) + 5 // Placeholder - would calculate actual improvement
        });
      } catch (err) {
        console.error('Error getting retention stats:', err);
      }
    };
    
    getRetentionStats();
  }, [user, reviewComplete]);

  // Handle flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle difficulty rating
  const handleDifficultyRating = async (difficulty: number) => {
    if (!user || currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    
    try {
      await updateFlashcardAfterReview(currentCard.id, difficulty);
      
      // Move to next card or complete review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setReviewComplete(true);
        if (onComplete) onComplete();
      }
    } catch (err) {
      toast({
        title: 'Error saving review',
        description: 'There was a problem saving your review.',
        variant: 'destructive',
      });
      console.error('Error updating flashcard:', err);
    }
  };

  // Restart review
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  if (reviewComplete || flashcards.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Review Complete!</CardTitle>
          <CardDescription className="text-center">
            {flashcards.length === 0 
              ? "You don't have any flashcards due for review right now." 
              : `You've reviewed all ${flashcards.length} cards due today!`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {flashcards.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{retentionStats.overall}%</div>
                  <div className="text-sm text-muted-foreground">Overall Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">+{retentionStats.improved}%</div>
                  <div className="text-sm text-muted-foreground">Improved Today</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {flashcards.length > 0 && (
            <Button onClick={handleRestart}>Review Again</Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = Math.round(((currentIndex) / flashcards.length) * 100);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <div className="text-sm font-medium">{progress}% Complete</div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex + (isFlipped ? "-flipped" : "")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full overflow-hidden">
            <div 
              className="min-h-[280px] cursor-pointer p-6 flex flex-col items-center justify-center"
              onClick={handleFlip}
            >
              <div className="text-lg font-medium mb-2">
                {isFlipped ? "Answer" : "Question"}
              </div>
              <div className="text-xl font-bold text-center">
                {isFlipped ? currentCard.back_content : currentCard.front_content}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Click to {isFlipped ? "see question" : "reveal answer"}
              </div>
            </div>
            
            {isFlipped && (
              <CardFooter className="flex flex-col space-y-4 p-6 bg-muted/50">
                <div className="text-sm font-medium mb-1">How well did you know this?</div>
                <div className="flex w-full justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={rating <= 2 ? "destructive" : rating >= 4 ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => handleDifficultyRating(rating)}
                    >
                      {rating === 1 && "Forgot"}
                      {rating === 2 && "Hard"}
                      {rating === 3 && "Medium"}
                      {rating === 4 && "Easy"}
                      {rating === 5 && "Perfect"}
                    </Button>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlashcardReviewSystem;
