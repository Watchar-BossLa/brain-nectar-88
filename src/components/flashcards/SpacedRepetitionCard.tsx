import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Loader2 } from 'lucide-react';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onComplete: () => void;
  onUpdateStats?: () => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({ 
  flashcard, 
  onComplete,
  onUpdateStats
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when flashcard changes
    setIsFlipped(false);
    setDifficultyRating(null);
  }, [flashcard.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (difficulty: number) => {
    setDifficultyRating(difficulty);
    setIsSubmitting(true);

    try {
      const { error } = await updateFlashcardAfterReview(flashcard.id, difficulty);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update stats if callback is provided
      if (onUpdateStats) {
        onUpdateStats();
      }
      
      // Short delay to show the selected rating
      setTimeout(() => {
        onComplete();
        setIsSubmitting(false);
      }, 600);
      
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  const renderContent = (content: string) => {
    // Check if content has LaTeX formulas
    if (!content.includes('$$')) return content;
    
    // Replace $$formula$$ with LaTeX rendered formula
    const parts = content.split(/(\\?\$\$[^$]*\$\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          return <InlineMath key={index} math={formula} />;
        } catch (error) {
          console.error('LaTeX rendering error:', error);
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return "Complete Blackout";
      case 2: return "Very Difficult";
      case 3: return "Difficult";
      case 4: return "Easy";
      case 5: return "Perfect Recall";
      default: return "";
    }
  };

  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 1: return "bg-red-500 hover:bg-red-600";
      case 2: return "bg-orange-500 hover:bg-orange-600";
      case 3: return "bg-yellow-500 hover:bg-yellow-600";
      case 4: return "bg-green-500 hover:bg-green-600";
      case 5: return "bg-emerald-500 hover:bg-emerald-600";
      default: return "bg-primary hover:bg-primary/90";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Flashcard Review</CardTitle>
        <CardDescription>
          How well did you remember this card? Be honest for best results.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex justify-center pb-8">
        <div 
          className="relative w-full h-[300px] cursor-pointer"
          onClick={handleFlip}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div 
              key={isFlipped ? 'back' : 'front'}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-6 border rounded-lg bg-card">
                <div className="text-lg font-medium text-center mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
                <div className="text-xl text-center">
                  {renderContent(isFlipped ? flashcard.back_content : flashcard.front_content)}
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  {isFlipped ? 'Click to see question' : 'Click to reveal answer'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {isFlipped && (
          <>
            <div className="text-center mb-2">How well did you remember this?</div>
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  disabled={isSubmitting}
                  className={`${getRatingColor(rating)} ${difficultyRating === rating ? 'ring-2 ring-offset-2' : ''}`}
                >
                  <span className="mr-1">{rating}</span>
                  <span className="hidden sm:inline">{getRatingText(rating)}</span>
                </Button>
              ))}
            </div>
          </>
        )}
        {!isFlipped && (
          <Button 
            onClick={handleFlip}
            className="w-full"
          >
            Show Answer
          </Button>
        )}
        
        {isSubmitting && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SpacedRepetitionCard;
