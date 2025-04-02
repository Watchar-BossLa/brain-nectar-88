
import { CognitiveProfile } from '../types';

/**
 * Learning history item from database
 */
export interface LearningHistoryItem {
  content?: {
    content_type?: string;
    topic_id?: string;
    module_id?: string;
  };
  topic_id?: string;
  module_id?: string;
  status?: string;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * Profile update options
 */
export interface ProfileUpdateOptions {
  userId: string;
  newData: Partial<CognitiveProfile>;
}
