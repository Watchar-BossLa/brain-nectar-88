
import { UserProgress, Content } from '@/types/supabase';

interface TopicMastery {
  topicId: string;
  completionPercentage: number;
  lastAccessedAt: string;
}

/**
 * Calculate mastery level for a specific topic based on user progress
 * 
 * @param userProgress Array of UserProgress objects
 * @param topicContent Array of Content objects for the topic
 * @returns Topic mastery metrics
 */
export function calculateTopicMastery(
  userProgress: UserProgress[], 
  topicContent: Content[]
): TopicMastery | null {
  if (!userProgress?.length || !topicContent?.length) {
    return null;
  }

  // Match user progress with topic content
  const relevantProgress = userProgress.filter(progress => 
    topicContent.some(content => content.id === progress.content_id)
  );

  if (!relevantProgress.length) {
    return null;
  }

  // Calculate mastery metrics
  const completedItems = relevantProgress.filter(p => p.progress_percentage >= 100).length;
  const totalItems = topicContent.length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Find most recent access timestamp
  const lastAccessed = relevantProgress
    .map(p => new Date(p.last_accessed_at))
    .sort((a, b) => b.getTime() - a.getTime())[0] || new Date();

  return {
    topicId: topicContent[0].topic_id,
    completionPercentage,
    lastAccessedAt: lastAccessed.toISOString()
  };
}
