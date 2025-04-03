import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from '@/types/flashcard';
import { calculateFlashcardRetention } from '@/services/spacedRepetition';
import { getIconForInterval, getRetentionLabel } from './utils/spacedRepetitionUtils';
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle2, Flame, HelpCircle, Hourglass, Star } from 'lucide-react';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onReview: (flashcardId: string, difficulty: number) => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({ flashcard, onReview }) => {
  const result = calculateFlashcardRetention(flashcard);

  const handleReview = (difficulty: number) => {
    onReview(flashcard.id, difficulty);
  };

  const spaceRepIcon = getIconForInterval(result?.daysUntilReview || 0);
  const retentionLabel = getRetentionLabel(result?.retention || 0);
  const retentionPercentage = Math.round((result?.retention || 0) * 100);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{flashcard.frontContent}</h2>
        <p className="text-sm text-muted-foreground mb-4">{flashcard.backContent}</p>

        <div className="flex items-center space-x-2 mb-3">
          {spaceRepIcon}
          <span className="text-xs text-muted-foreground">{retentionLabel}</span>
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">{retentionPercentage}% Retention</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleReview(1)}
          >
            Hard
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleReview(2)}
          >
            Okay
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleReview(3)}
          >
            Easy
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpacedRepetitionCard;
