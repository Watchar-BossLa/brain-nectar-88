
// Re-export the main flashcard types for better organization
export type { Flashcard, FlashcardReview } from './supabase';

// Additional flashcard-related types can be added here
export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty?: number;
  reviewsToday?: number;
  masteryPercentage?: number;
  learningCards?: number;
  newCards?: number;
}
