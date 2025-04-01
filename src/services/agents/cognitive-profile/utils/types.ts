
/**
 * Learning History Item Interface
 */
export interface LearningHistoryItem {
  id: string;
  userId: string;
  topicId: string;
  module_id?: string;
  content?: {
    topic_id: string;
    module_id: string;
    content_type: string;
  };
  contentType: string;
  interactionType: string;
  status: string;
  completionStatus: string;
  progress_percentage: number;
  timeSpent: number;
  score?: number;
  created_at: string;
  updated_at: string;
  timestamp: string;
}
