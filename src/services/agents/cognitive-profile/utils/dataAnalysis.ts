
import { LearningHistoryItem } from './types';

/**
 * Utilities for analyzing learning data
 */
export class DataAnalysisUtils {
  /**
   * Analyze content interaction patterns
   */
  public static analyzeContentInteractions(history: LearningHistoryItem[]): string[] {
    // Extract content types from progress data
    const contentTypes = history
      .filter(item => item.content && item.content.content_type)
      .map(item => item.content.content_type);
    
    // Count occurrences of each content type
    const typeCounts: Record<string, number> = {};
    contentTypes.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Sort by frequency
    const preferredTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
    
    return preferredTypes.length > 0 ? preferredTypes : ['text', 'video'];
  }
  
  /**
   * Estimate learning speed across different domains
   */
  public static estimateLearningSpeed(history: LearningHistoryItem[]): Record<string, number> {
    // This is a simplified implementation
    // In a real system, this would analyze completion times, repeated attempts, etc.
    
    const speeds: Record<string, number> = {};
    const defaultSpeed = 1.0; // Normal speed
    
    // Group by topic or subject area
    const topicGroups = this.groupByTopic(history);
    
    // Calculate speed for each topic
    for (const [topicId, items] of Object.entries(topicGroups)) {
      // Simple heuristic: calculate average progress rate
      const progressRates = items
        .filter(item => item.progress_percentage !== undefined)
        .map(item => ({
          progress: item.progress_percentage,
          time: new Date(item.updated_at).getTime() - new Date(item.created_at).getTime()
        }));
      
      if (progressRates.length > 0) {
        // Calculate progress per millisecond, normalized against a baseline
        const avgRate = progressRates.reduce((sum, item) => 
          sum + (item.progress / Math.max(1, item.time)), 0) / progressRates.length;
          
        // Convert to a scale where 1.0 is average
        speeds[topicId] = avgRate > 0 ? avgRate * 1000 : defaultSpeed;
      } else {
        speeds[topicId] = defaultSpeed;
      }
    }
    
    return speeds;
  }
  
  /**
   * Group learning history items by topic
   */
  public static groupByTopic(items: LearningHistoryItem[]): Record<string, LearningHistoryItem[]> {
    const groups: Record<string, LearningHistoryItem[]> = {};
    
    items.forEach(item => {
      const topicId = item.content?.topic_id || item.topicId;
      if (topicId) {
        if (!groups[topicId]) {
          groups[topicId] = [];
        }
        groups[topicId].push(item);
      }
    });
    
    return groups;
  }
  
  /**
   * Group learning history items by module
   */
  public static groupByModule(items: LearningHistoryItem[]): Record<string, LearningHistoryItem[]> {
    const groups: Record<string, LearningHistoryItem[]> = {};
    
    items.forEach(item => {
      const moduleId = item.content?.module_id || item.module_id;
      if (moduleId) {
        if (!groups[moduleId]) {
          groups[moduleId] = [];
        }
        groups[moduleId].push(item);
      }
    });
    
    return groups;
  }
  
  /**
   * Build initial knowledge graph from completed topics
   */
  public static buildInitialKnowledgeGraph(history: LearningHistoryItem[]): Record<string, any> {
    const graph: Record<string, any> = {};
    
    // Extract completed topics from progress data
    const completedItems = history.filter(item => 
      item.status === 'completed' || item.progress_percentage >= 90
    );
    
    // Group by module or subject area
    const moduleGroups = this.groupByModule(completedItems);
    
    // For each module, create connections between its topics
    for (const [moduleId, items] of Object.entries(moduleGroups)) {
      const topicIds = [...new Set(items
        .filter(item => item.content && item.content.topic_id)
        .map(item => item.content.topic_id)
      )];
      
      // Create connections between topics in the same module
      topicIds.forEach(topicId => {
        if (!graph[topicId]) {
          graph[topicId] = [];
        }
        
        // Connect to other topics in the same module
        topicIds
          .filter(id => id !== topicId)
          .forEach(relatedId => {
            if (!graph[topicId].includes(relatedId)) {
              graph[topicId].push(relatedId);
            }
          });
      });
    }
    
    return graph;
  }
}
