
/**
 * Types for the cognitive profile agent
 */

/**
 * Learning history item representing a user's interaction with content
 */
export interface LearningHistoryItem {
  contentId?: string;
  topicId?: string | null;
  moduleId?: string | null;
  status?: string;
  progressPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
  content?: {
    id?: string;
    topicId?: string;
    moduleId?: string;
    contentType?: string;
    contentData?: any;
    title?: string;
  };
}

/**
 * User cognitive profile
 */
export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  contentPreferences: string[];
  strengths: string[];
  weaknesses: string[];
  knowledgeGraph: Record<string, string[]>;
  lastUpdated: string;
}
