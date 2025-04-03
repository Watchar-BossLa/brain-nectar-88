import React from 'react';
import { DifficultyRatingButtonsProps } from '@/types/components';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const DifficultyRatingButtons: React.FC<DifficultyRatingButtonsProps> = ({
  onRate,
  selectedRating,
  isSubmitting
}) => {
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
    <>
      <div className="text-center mb-2">How well did you remember this?</div>
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            onClick={() => onRate(rating)}
            disabled={isSubmitting}
            className={`${getRatingColor(rating)} ${selectedRating === rating ? 'ring-2 ring-offset-2' : ''}`}
          >
            <span className="mr-1">{rating}</span>
            <span className="hidden sm:inline">{getRatingText(rating)}</span>
          </Button>
        ))}
      </div>
      
      {isSubmitting && (
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </>
  );
};
