
/**
 * Types for flashcard review functionality
 */

export interface FlashcardRetentionResult {
  overallRetention: number;
  cardRetention: Array<{
    id: string;
    retention: number;
    mastery: number;
  }>;
}

export interface FlashcardLearningStats {
  overallRetention: number;
  masteryDistribution: {
    beginner: number;
    developing: number;
    proficient: number;
    mastered: number;
  };
  reviewEfficiency: number;
  lowestRetentionCards: Array<{
    id: string;
    retention: number;
    mastery: number;
  }>;
}

export interface UpdateResult {
  data: any | null;
  error: any | null;
}
