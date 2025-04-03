
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
