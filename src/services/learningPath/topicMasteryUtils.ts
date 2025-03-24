
import { Topic, UserProgress } from '@/types/supabase';

/**
 * Calculates the mastery level for each topic based on user progress
 */
export const calculateTopicMastery = (
  userProgress: UserProgress[] | null,
  topics?: Topic[] | null
): Record<string, number> => {
  const mastery: Record<string, number> = {};
  
  if (!userProgress) return mastery;
  
  // If topics are provided, initialize mastery for each topic
  if (topics) {
    topics.forEach(topic => {
      mastery[topic.id] = 0;
    });
  }
  
  // Process each progress entry to calculate topic mastery
  userProgress.forEach(progress => {
    // Extract topic ID from the content
    const contentData = progress.content as unknown as { topic_id: string } | null;
    const topicId = contentData?.topic_id;
    
    if (topicId) {
      // Initialize if not already set
      if (mastery[topicId] === undefined) {
        mastery[topicId] = 0;
      }
      
      // Update mastery based on progress percentage
      const currentCount = mastery[topicId] || 0;
      const currentTotal = currentCount * (mastery[`${topicId}_count`] || 0);
      const newCount = (mastery[`${topicId}_count`] || 0) + 1;
      
      // Store count for averaging
      mastery[`${topicId}_count`] = newCount;
      // Calculate weighted average
      mastery[topicId] = Math.round((currentTotal + progress.progress_percentage) / newCount);
    }
  });
  
  // Remove count entries from the return value
  Object.keys(mastery).forEach(key => {
    if (key.endsWith('_count')) {
      delete mastery[key];
    }
  });
  
  return mastery;
};
