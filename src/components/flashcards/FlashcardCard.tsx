
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flashcard } from '@/types/supabase';
import { Pencil, Trash2 } from 'lucide-react';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onFlip?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isReviewMode?: boolean;
  onRating?: (rating: number) => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  flashcard,
  onFlip,
  onEdit,
  onDelete,
  isReviewMode = false,
  onRating
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) {
      onFlip();
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Again (Very Hard)";
      case 2: return "Hard";
      case 3: return "Good";
      case 4: return "Easy";
      case 5: return "Very Easy";
      default: return "Good";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative">
        <div 
          className={`transition-all duration-500 cursor-pointer ${isFlipped ? 'opacity-0 absolute' : 'opacity-100'}`}
          onClick={handleFlip}
        >
          <CardContent className="p-6 min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">{flashcard.front_content}</p>
            </div>
          </CardContent>
        </div>

        <div 
          className={`transition-all duration-500 cursor-pointer ${isFlipped ? 'opacity-100' : 'opacity-0 absolute'}`}
          onClick={handleFlip}
        >
          <CardContent className="p-6 min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">{flashcard.back_content}</p>
            </div>
          </CardContent>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {isReviewMode && isFlipped && onRating ? (
          <div className="flex flex-wrap justify-between gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <Button
                key={rating}
                variant={rating <= 2 ? "destructive" : rating === 3 ? "default" : "outline"}
                size="sm"
                onClick={() => onRating(rating)}
                className="flex-1"
              >
                {getDifficultyLabel(rating)}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFlip}
            >
              {isFlipped ? 'Show Front' : 'Show Back'}
            </Button>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FlashcardCard;
