
import React from 'react';
import { 
  CalendarIcon, 
  CheckCircle2, 
  Flame, 
  HelpCircle, 
  Hourglass, 
  Star 
} from 'lucide-react';

/**
 * Get an appropriate icon based on the interval until the next review
 */
export const getIconForInterval = (daysUntilReview: number) => {
  if (daysUntilReview < 0) {
    return <Hourglass className="h-4 w-4 text-red-500" />;
  } else if (daysUntilReview === 0) {
    return <CalendarIcon className="h-4 w-4 text-amber-500" />;
  } else if (daysUntilReview <= 1) {
    return <HelpCircle className="h-4 w-4 text-blue-500" />;
  } else if (daysUntilReview <= 3) {
    return <Flame className="h-4 w-4 text-purple-500" />;
  } else if (daysUntilReview <= 7) {
    return <Star className="h-4 w-4 text-indigo-500" />;
  } else {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
};

/**
 * Get a human-readable label for retention level
 */
export const getRetentionLabel = (retention: number): string => {
  if (retention < 0.3) return "Low Retention";
  if (retention < 0.6) return "Medium Retention";
  if (retention < 0.8) return "Good Retention";
  return "High Retention";
};
