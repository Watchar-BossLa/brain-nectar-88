
import { CognitiveProfile } from '../types';

/**
 * Learning history item from database
 */
export interface LearningHistoryItem {
  content?: {
    contentType?: string;
    topicId?: string;
    moduleId?: string;
  };
  topicId?: string;
  moduleId?: string;
  status?: string;
  progressPercentage?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * Profile update options
 */
export interface ProfileUpdateOptions {
  userId: string;
  newData: Partial<CognitiveProfile>;
}

/**
 * Learning session data
 */
export interface LearningSessionData {
  userId: string;
  sessionStart: string;
  sessionEnd?: string;
  topicId?: string;
  moduleId?: string;
  sessionType: 'flashcard' | 'quiz' | 'content' | 'discussion';
  progress: number;
  metrics?: {
    correctAnswers?: number;
    totalQuestions?: number;
    averageResponseTime?: number;
    cardsMastered?: number;
    retentionRate?: number;
  };
}

/**
 * Cognitive profile generation parameters
 */
export interface ProfileGenerationParams {
  learningHistory: LearningHistoryItem[];
  quizResults?: Array<{
    topic: string;
    score: number;
    dateCompleted: string;
  }>;
  flashcardStats?: {
    masteryRate: number;
    retentionRate: number;
    learningEfficiency: number;
    preferredStudyTimes?: string[];
  };
  userPreferences?: {
    preferredContentTypes?: string[];
    studyFrequency?: string;
    sessionDuration?: number;
  };
}
