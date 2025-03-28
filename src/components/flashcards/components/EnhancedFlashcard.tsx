
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, BarChart4, Volume2, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import FlashcardContent from './FlashcardContent';
import { Flashcard } from '@/types/flashcards';

interface EnhancedFlashcardProps {
  flashcard: Flashcard;
  onRate: (difficulty: number) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  showControls?: boolean;
  showProgress?: boolean;
  currentIndex?: number;
  totalCards?: number;
}

const EnhancedFlashcard: React.FC<EnhancedFlashcardProps> = ({
  flashcard,
  onRate,
  onNext,
  onPrevious,
  showControls = true,
  showProgress = true,
  currentIndex = 0,
  totalCards = 1
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [recallTime, setRecallTime] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Reset timer when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setStartTime(Date.now());
    setRecallTime(null);
    setShowHint(false);
  }, [flashcard.id]);
  
  const handleFlip = () => {
    if (!isFlipped) {
      setRecallTime(Date.now() - (startTime || 0));
    }
    setIsFlipped(!isFlipped);
  };
  
  const handleRating = async (rating: number) => {
    await onRate(rating);
    if (onNext) onNext();
  };
  
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  const playAudio = () => {
    if (flashcard.audioUrl) {
      const audio = new Audio(flashcard.audioUrl);
      audio.play();
      setPlayingAudio(true);
      audio.onended = () => setPlayingAudio(false);
    }
  };
  
  const progressPercentage = totalCards > 1 ? ((currentIndex + 1) / totalCards) * 100 : 0;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {showProgress && totalCards > 1 && (
        <div className="mb-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Card {currentIndex + 1} of {totalCards}</span>
            <span>
              {recallTime 
                ? `Recall time: ${Math.round(recallTime / 1000)}s` 
                : 'Tap to reveal'}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>
      )}
      
      <div className="relative perspective-1000 w-full h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${flashcard.id}-${isFlipped ? 'back' : 'front'}`}
            initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute w-full h-full"
          >
            <Card 
              className={cn(
                "w-full h-full cursor-pointer overflow-hidden",
                isFlipped ? "bg-primary/5" : "bg-card"
              )}
              onClick={handleFlip}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {isFlipped ? "Answer" : "Question"}
                </div>
                
                <div className="flex-1 overflow-auto">
                  <FlashcardContent 
                    content={isFlipped ? flashcard.back : flashcard.front}
                  />
                  
                  {showHint && !isFlipped && (
                    <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-950 border-l-2 border-amber-500 rounded">
                      <p className="text-sm">
                        Hint: {flashcard.front.substring(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <div>Topic: {flashcard.topic}</div>
                  {flashcard.tags && (
                    <div className="flex gap-1">
                      {flashcard.tags.map(tag => (
                        <span key={tag} className="bg-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
        {!isFlipped ? (
          <>
            {showControls && (
              <div className="flex items-center gap-2">
                {onPrevious && (
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  toggleHint();
                }}>
                  <Lightbulb className={cn(
                    "h-4 w-4 mr-1",
                    showHint && "text-amber-500"
                  )} />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
                
                {flashcard.audioUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                    disabled={playingAudio}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    {playingAudio ? "Playing..." : "Listen"}
                  </Button>
                )}
              </div>
            )}
            
            <Button onClick={handleFlip} className="ml-auto">
              Show Answer
            </Button>
          </>
        ) : (
          <div className="w-full">
            <div className="text-sm font-medium mb-2">How well did you know this?</div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={rating <= 2 ? "destructive" : rating >= 4 ? "default" : "outline"}
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating(rating);
                  }}
                >
                  {rating === 1 && "Forgot"}
                  {rating === 2 && "Hard"}
                  {rating === 3 && "Medium"}
                  {rating === 4 && "Easy"}
                  {rating === 5 && "Perfect"}
                </Button>
              ))}
            </div>
            
            {showControls && onNext && (
              <div className="flex justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}>
                  Skip
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">
            {recallTime 
              ? `Recalled in ${(recallTime / 1000).toFixed(1)}s` 
              : 'Time tracking enabled'}
          </span>
        </div>
        
        <div className="flex items-center">
          <BarChart4 className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">
            Mastery: {Math.round(flashcard.mastery * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFlashcard;
