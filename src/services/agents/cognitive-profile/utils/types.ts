
/**
 * Learning History Item Interface
 */
export interface LearningHistoryItem {
  id: string;
  userId: string;
  topicId: string;
  contentType: string;
  interactionType: string;
  completionStatus: string;
  timeSpent: number;
  score?: number;
  timestamp: string;
}
