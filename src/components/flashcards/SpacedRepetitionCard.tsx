
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SpacedRepetitionCardProps {
  flashcards: any[];
  onComplete: () => void;
  onUpdateStats: () => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({
  flashcards,
  onComplete,
  onUpdateStats,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (flashcards.length > 0) {
      setProgress(Math.round((currentIndex / flashcards.length) * 100));
    }
  }, [currentIndex, flashcards.length]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRating = async (difficulty: number) => {
    if (!user) return;

    const currentCard = flashcards[currentIndex];
    
    try {
      await spacedRepetitionService.recordReview({
        flashcardId: currentCard.id,
        difficulty,
        reviewedAt: new Date().toISOString(),
      });

      // Trigger stats update
      onUpdateStats();

      // Move to next card or complete
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        toast({
          title: "Review session complete!",
          description: `You've reviewed ${flashcards.length} cards.`,
        });
        onComplete();
      }
    } catch (error) {
      console.error('Error recording review:', error);
      toast({
        title: "Error saving progress",
        description: "There was a problem recording your review.",
        variant: "destructive",
      });
    }
  };

  if (flashcards.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8 p-6 text-center">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">No flashcards due for review!</h2>
          <p className="text-muted-foreground mb-6">
            Great job! You don't have any flashcards scheduled for review right now.
          </p>
          <Button onClick={onComplete}>
            Return to Flashcards
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {progress}% Complete
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="relative w-full aspect-[3/2] perspective">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card
              className="w-full h-full flex items-center justify-center cursor-pointer bg-card hover:bg-accent/10 transition-colors"
              onClick={handleFlip}
            >
              <CardContent className="p-6 text-center">
                <div className="absolute top-3 right-3 text-xs text-muted-foreground">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
                <div className="text-xl font-medium">
                  {isFlipped ? currentCard.back_content : currentCard.front_content}
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-muted-foreground">
                  Click to flip
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="rounded-full h-10 w-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleFlip}
          className="rounded-full px-4"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Flip
        </Button>
        
        <div className="opacity-0 w-10">
          {/* Spacer for flex alignment */}
        </div>
      </div>
      
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          <h3 className="text-center text-sm font-medium mb-3">How well did you know this?</h3>
          <div className="grid grid-cols-6 gap-2">
            {[
              { rating: 0, label: "No idea" },
              { rating: 1, label: "Wrong" },
              { rating: 2, label: "Almost" },
              { rating: 3, label: "Hard" },
              { rating: 4, label: "Good" },
              { rating: 5, label: "Perfect" },
            ].map((option) => (
              <Button
                key={option.rating}
                variant="ghost"
                size="sm"
                onClick={() => handleRating(option.rating)}
                className={`flex-col py-2 h-auto border ${
                  option.rating >= 4 ? 'hover:bg-green-100 hover:text-green-800' : 
                  option.rating >= 2 ? 'hover:bg-yellow-100 hover:text-yellow-800' : 
                  'hover:bg-red-100 hover:text-red-800'
                }`}
              >
                <span className="text-lg font-bold">{option.rating}</span>
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpacedRepetitionCard;
