
import { Topic, UserProgress } from '@/types/supabase';

/**
 * Calculates the mastery level for each topic based on user progress
 */
export const calculateTopicMastery = (
  topics: Topic[] | null,
  userProgress: UserProgress[] | null
): Record<string, number> => {
  const mastery: Record<string, number> = {};
  
  if (!topics || !userProgress) return mastery;
  
  topics.forEach(topic => {
    // Default mastery is 0
    mastery[topic.id] = 0;
    
    // Find all progress entries related to this topic's content
    const relatedProgress = userProgress.filter(progress => {
      // Access content_id directly instead of through content property
      const progressData = progress as unknown as { content: { topic_id: string } };
      return progressData.content?.topic_id === topic.id;
    });
    
    if (relatedProgress.length > 0) {
      // Calculate average progress percentage
      const totalPercentage = relatedProgress.reduce(
        (sum, progress) => sum + progress.progress_percentage, 
        0
      );
      mastery[topic.id] = Math.round(totalPercentage / relatedProgress.length);
    }
  });
  
  return mastery;
};
