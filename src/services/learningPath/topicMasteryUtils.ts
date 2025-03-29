
import { UserProgress } from '@/types/supabase';

/**
 * Calculate mastery level for each topic based on user progress
 */
export const calculateTopicMastery = (
  userProgress: UserProgress[],
  topics: any[]
): Record<string, number> => {
  const result: Record<string, number> = {};
  
  // Initial setup - all topics start at 0 mastery
  topics.forEach(topic => {
    result[topic.id] = 0;
  });
  
  // Process user progress data
  if (userProgress && userProgress.length > 0) {
    // Group progress by topic
    const progressByTopic: Record<string, UserProgress[]> = {};
    
    userProgress.forEach(progress => {
      if (progress.content && progress.content.topic_id) {
        const topicId = progress.content.topic_id;
        if (!progressByTopic[topicId]) {
          progressByTopic[topicId] = [];
        }
        progressByTopic[topicId].push(progress);
      }
    });
    
    // Calculate mastery for each topic with progress
    Object.entries(progressByTopic).forEach(([topicId, progressItems]) => {
      // Mastery is based on average completion percentage and completion status
      const avgCompletion = progressItems.reduce((sum, item) => sum + item.progress_percentage, 0) / progressItems.length;
      const completedItems = progressItems.filter(item => item.status === 'completed').length;
      const completionRatio = progressItems.length > 0 ? completedItems / progressItems.length : 0;
      
      // Weighted score: 60% from completion percentage, 40% from completion status
      result[topicId] = Math.round(avgCompletion * 0.6 + completionRatio * 100 * 0.4);
    });
  }
  
  return result;
};
