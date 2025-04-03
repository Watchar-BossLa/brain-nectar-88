
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for learning history items
 */
export interface LearningHistoryItem {
  id: string;
  userId: string;
  contentType?: string;
  domain?: string;
  topic?: string;
  completionTimeMinutes?: number;
  completedAt?: string;
  score?: number;
  difficulty?: number;
}

/**
 * Service for handling user learning history
 */
export class LearningHistoryService {
  /**
   * Fetch a user's learning history
   */
  public static async fetchUserLearningHistory(userId: string): Promise<LearningHistoryItem[]> {
    try {
      // In a real implementation, we'd fetch from multiple tables
      // For now, we'll use a simulated approach with one query
      const { data: progressData } = await supabase
        .from('user_progress')
        .select(`
          id, 
          user_id,
          content_id,
          progress_percentage,
          last_accessed_at,
          content:content_id (title, content_type, topic:topic_id (title))
        `)
        .eq('user_id', userId)
        .gte('progress_percentage', 80); // Consider content that's at least 80% complete
      
      // Convert to LearningHistoryItem format
      const historyItems: LearningHistoryItem[] = [];
      
      if (progressData) {
        progressData.forEach((item: any) => {
          historyItems.push(LearningHistoryService.formatToLearningHistoryItem(item));
        });
      }
      
      return historyItems;
    } catch (error) {
      console.error('Error fetching learning history:', error);
      return [];
    }
  }
  
  /**
   * Format database response to LearningHistoryItem
   */
  public static formatToLearningHistoryItem(dbItem: any): LearningHistoryItem {
    // Extract content and topic information if available
    const content = dbItem.content || {};
    const topic = content.topic || {};
    
    return {
      id: dbItem.id,
      userId: dbItem.user_id,
      contentType: content.content_type || 'unknown',
      domain: topic.domain || 'general',
      topic: topic.title || content.title || 'unknown',
      completionTimeMinutes: dbItem.study_duration_minutes || 30,
      completedAt: dbItem.last_accessed_at,
      score: dbItem.score || dbItem.progress_percentage / 20, // Convert percentage to 0-5 scale
      difficulty: dbItem.difficulty || 3 // Default to medium difficulty
    };
  }
}
