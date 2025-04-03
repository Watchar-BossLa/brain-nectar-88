
/**
 * Service for managing learning history for cognitive profiling
 */

interface LearningHistoryItem {
  id: string;
  userId: string;
  eventType: string;
  contentType: string;
  timestamp: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export class LearningHistoryService {
  /**
   * Fetch learning history for a user
   */
  public static async getLearningHistory(userId: string): Promise<LearningHistoryItem[]> {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll return mock data
      return this.getMockLearningHistory(userId);
    } catch (error) {
      console.error("Error fetching learning history:", error);
      return [];
    }
  }
  
  /**
   * Record a learning event in the user's history
   */
  public static async recordLearningEvent(
    userId: string,
    eventType: string,
    contentType: string,
    data: Record<string, any>
  ): Promise<boolean> {
    try {
      console.log(`Recording ${eventType} event for user ${userId}`);
      // In a real implementation, this would write to a database
      return true;
    } catch (error) {
      console.error("Error recording learning event:", error);
      return false;
    }
  }
  
  /**
   * Get mock learning history data for development
   */
  private static getMockLearningHistory(userId: string): LearningHistoryItem[] {
    const now = new Date();
    const history: LearningHistoryItem[] = [];
    
    // Generate mock learning events
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - (i * 3600000));
      history.push(
        this.formatToLearningHistoryItem(userId, timestamp)
      );
    }
    
    return history;
  }
  
  /**
   * Format a learning event into a history item
   */
  private static formatToLearningHistoryItem(userId: string, timestamp: Date): LearningHistoryItem {
    const eventTypes = ['video_watched', 'quiz_completed', 'article_read', 'flashcard_session'];
    const contentTypes = ['video', 'quiz', 'article', 'flashcard'];
    
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomContent = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    return {
      id: `history-${timestamp.getTime()}`,
      userId,
      eventType: randomEvent,
      contentType: randomContent,
      timestamp: timestamp.toISOString(),
      data: {
        duration: Math.floor(Math.random() * 45) + 5,
        completion: Math.random(),
        topicId: `topic-${Math.floor(Math.random() * 10) + 1}`
      },
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString()
    };
  }
}
