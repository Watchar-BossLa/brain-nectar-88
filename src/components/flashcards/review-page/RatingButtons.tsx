
import React from 'react';
import { Button } from '@/components/ui/button';
import { XIcon, HelpCircleIcon, CheckIcon, SkipForwardIcon } from 'lucide-react';

interface RatingButtonsProps {
  isFlipped: boolean;
  onRating: (rating: number) => Promise<void>;
  onSkip: () => void;
  onRevealAnswer: () => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({
  isFlipped,
  onRating,
  onSkip,
  onRevealAnswer
}) => {
  if (isFlipped) {
    return (
      <>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => onRating(1)}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Forgot
          </Button>
          <Button 
            variant="outline" 
            className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
            onClick={() => onRating(2)}
          >
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Hard
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
            onClick={() => onRating(3)}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Good
          </Button>
          <Button 
            variant="outline" 
            className="border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => onRating(5)}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Easy
          </Button>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            onClick={onSkip}
          >
            <SkipForwardIcon className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <div className="mt-6 flex justify-center">
      <Button onClick={onRevealAnswer}>
        Reveal Answer
      </Button>
    </div>
  );
};

export default RatingButtons;
