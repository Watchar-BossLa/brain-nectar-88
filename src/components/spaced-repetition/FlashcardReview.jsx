import React, { useState, useEffect } from 'react';
import { useSpacedRepetition } from '@/services/spaced-repetition';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RotateCcw, 
  ChevronRight, 
  ThumbsUp, 
  ThumbsDown, 
  Frown, 
  Meh, 
  Smile, 
  CheckCircle2,
  Timer
} from 'lucide-react';

/**
 * Flashcard Review Component
 * Provides an interface for reviewing flashcards using spaced repetition
 * @param {Object} props - Component props
 * @param {string} props.sessionId - Review session ID
 * @param {Function} props.onComplete - Callback when session is complete
 * @returns {React.ReactElement} Flashcard review component
 */
const FlashcardReview = ({ sessionId, onComplete }) => {
  const spacedRepetition = useSpacedRepetition();
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [itemStartTime, setItemStartTime] = useState(null);
  
  // Load current item
  useEffect(() => {
    if (!sessionId) return;
    
    const loadCurrentItem = () => {
      setLoading(true);
      const item = spacedRepetition.getCurrentItem(sessionId);
      
      if (item) {
        setCurrentItem(item);
        setFlipped(false);
        setItemStartTime(new Date());
      } else {
        setCurrentItem(null);
      }
      
      setLoading(false);
    };
    
    loadCurrentItem();
    setStartTime(new Date());
  }, [sessionId, spacedRepetition]);
  
  // Handle card flip
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  // Handle rating submission
  const handleSubmitRating = async (rating) => {
    if (!sessionId || !currentItem) return;
    
    setLoading(true);
    
    try {
      const result = await spacedRepetition.submitReview(sessionId, rating);
      
      if (result.complete) {
        // Session is complete
        setSessionComplete(true);
        setSessionSummary(result.summary);
        
        if (onComplete) {
          onComplete(result.summary);
        }
      } else {
        // Move to next item
        setCurrentItem(result.nextItem);
        setFlipped(false);
        setProgress(result.progress);
        setItemStartTime(new Date());
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get rating button based on rating value
  const getRatingButton = (rating, label, icon) => (
    <Button
      onClick={() => handleSubmitRating(rating)}
      disabled={loading || !flipped}
      variant={rating >= 4 ? 'default' : (rating >= 2 ? 'outline' : 'destructive')}
      className="flex-1"
    >
      {icon}
      <span className="ml-1">{label}</span>
    </Button>
  );
  
  // Render session complete view
  if (sessionComplete && sessionSummary) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You've completed your review session.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Cards Reviewed</p>
                <p className="text-2xl font-bold">{sessionSummary.itemCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{sessionSummary.averageRating.toFixed(1)}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Perfect Recalls</p>
                <p className="text-2xl font-bold">{sessionSummary.perfectCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-2xl font-bold">{Math.round(sessionSummary.duration / 60)} min</p>
              </div>
            </div>
            
            <Button onClick={() => window.location.reload()} className="w-full">
              Start New Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render loading state
  if (loading && !currentItem) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-40 w-full rounded-md" />
            <div className="flex justify-center space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render no items state
  if (!currentItem) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-bold mb-2">No Items to Review</h2>
          <p className="text-muted-foreground mb-4">
            There are no items due for review at this time.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate time spent on current item
  const timeSpent = itemStartTime ? Math.round((new Date() - itemStartTime) / 1000) : 0;
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        {/* Progress bar */}
        {progress.total > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
          </div>
        )}
        
        {/* Tags */}
        {currentItem.tags && currentItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {currentItem.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Timer */}
        <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
          <Timer className="h-3 w-3 mr-1" />
          <span>{timeSpent}s</span>
        </div>
        
        {/* Flashcard */}
        <div 
          className={`border rounded-lg p-6 mb-4 min-h-[200px] flex items-center justify-center cursor-pointer transition-all duration-300 ${
            flipped ? 'bg-muted/50' : ''
          }`}
          onClick={handleFlip}
        >
          <div className="text-center">
            {flipped ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Answer:</p>
                <div className="text-lg font-medium">
                  {currentItem.content_back}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Question:</p>
                <div className="text-lg font-medium">
                  {currentItem.content_front}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleFlip} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {flipped ? 'Show Question' : 'Show Answer'}
          </Button>
          
          {flipped && (
            <div className="grid grid-cols-5 gap-2">
              {getRatingButton(1, '1', <Frown className="h-4 w-4" />)}
              {getRatingButton(2, '2', <ThumbsDown className="h-4 w-4" />)}
              {getRatingButton(3, '3', <Meh className="h-4 w-4" />)}
              {getRatingButton(4, '4', <Smile className="h-4 w-4" />)}
              {getRatingButton(5, '5', <ThumbsUp className="h-4 w-4" />)}
            </div>
          )}
          
          {!flipped && (
            <div className="text-center text-sm text-muted-foreground">
              Click the card or button to reveal the answer
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardReview;
