// Enhanced flashcard types that map to both the database schema and UI components
export interface Flashcard {
  id: string;
  
  // Database field names
  user_id?: string;
  topic_id?: string;
  front_content: string;
  back_content: string;
  difficulty?: number;
  next_review_date?: string;
  repetition_count?: number;
  mastery_level?: number;
  easiness_factor?: number;
  last_retention?: number;
  last_reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
  
  // UI field names (for backward compatibility)
  userId?: string;
  topicId?: string;
  front?: string;
  back?: string;
  topic?: string;
  tags?: string[];
  usesLatex?: boolean;
  hasFinancialFormulas?: boolean;
  imageUrls?: string[];
  audioUrl?: string;
  created?: string;
  lastReviewed?: string;
  dueDate?: string;
  repetitionCount?: number;
  easinessFactor?: number;
  interval?: number;
  mastery?: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic: boolean;
  coverImageUrl?: string;
  tags?: string[];
}

export interface ReviewSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  averageDifficulty: number;
  retentionRate: number;
}

export interface FlashcardStudyStats {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  dueCards: number;
  retentionRate: number;
  averageMastery: number;
  studyStreak: number;
  lastStudyDate?: string;
}

export interface FlashcardReviewRating {
  flashcardId: string;
  difficulty: number; // 1-5 scale (1: forgot completely, 5: perfect recall)
  timeToRecall: number; // milliseconds
  date: string;
}

export interface StudySchedule {
  dueCards: Flashcard[];
  recommendedStudyTime: string;
  estimatedCompletionTime: number; // minutes
  optimalBatchSize: number;
}
