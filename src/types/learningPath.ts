
/**
 * Types for the learning path feature
 */

export interface Topic {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  mastery: number;
  recommended: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  topics: Topic[];
}

export interface LearningPathStats {
  totalTopics: number;
  completedTopics: number;
  masteredTopics: number;
  averageMastery: number;
  estimatedCompletionDays: number;
  streak: number;
}

export interface LearningPathProviderProps {
  children: React.ReactNode;
}

export interface LearningPathContextType {
  modules: Module[];
  isLoading: boolean;
  error: Error | null;
  stats: LearningPathStats | null;
  generateLearningPath: (qualificationId: string) => Promise<boolean>;
  updateTopicProgress: (topicId: string, progressPercentage: number) => Promise<boolean>;
  refreshLearningPath: () => Promise<void>;
}
