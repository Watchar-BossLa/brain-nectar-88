
import { LearningHistoryItem } from '../types';

/**
 * Utility class for analyzing learning data
 */
export class DataAnalysisUtils {
  /**
   * Analyze content interaction patterns to determine preferred content formats
   */
  static analyzeContentInteractions(learningHistory: LearningHistoryItem[]): string[] {
    // Default content types if analysis is inconclusive
    if (!learningHistory || learningHistory.length === 0) {
      return ['text', 'video'];
    }
    
    const contentTypeCount: Record<string, number> = {};
    
    // Count interactions by content type
    for (const item of learningHistory) {
      const contentType = item.content?.contentType || 'text';
      contentTypeCount[contentType] = (contentTypeCount[contentType] || 0) + 1;
    }
    
    // Sort content types by frequency
    const sortedTypes = Object.entries(contentTypeCount)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .map(([type]) => type);
    
    // Return top 2 types, or all if less than 2
    return sortedTypes.length > 2 ? sortedTypes.slice(0, 2) : sortedTypes;
  }
  
  /**
   * Estimate learning speed across different domains
   */
  static estimateLearningSpeed(learningHistory: LearningHistoryItem[]): Record<string, number> {
    const speeds: Record<string, number> = {};
    
    if (!learningHistory || learningHistory.length === 0) {
      return speeds;
    }
    
    // Group by topic/module
    const groupedItems = this.groupByProperty(learningHistory, 'moduleId');
    
    // Calculate average completion time/progress for each group
    for (const [moduleId, items] of Object.entries(groupedItems)) {
      if (!items.length) continue;
      
      // Calculate average progress rate
      const avgProgress = items.reduce((sum, item) => sum + (item.progressPercentage || 0), 0) / items.length;
      
      // Normalize to a 0-1 scale where higher is faster
      speeds[moduleId] = Math.min(Math.max(avgProgress / 100, 0.1), 1.0);
    }
    
    return speeds;
  }
  
  /**
   * Build initial knowledge graph from completed topics
   */
  static buildInitialKnowledgeGraph(learningHistory: LearningHistoryItem[]): Record<string, string[]> {
    const knowledgeGraph: Record<string, string[]> = {};
    
    if (!learningHistory || learningHistory.length === 0) {
      return knowledgeGraph;
    }
    
    // Find completed topics
    const completedTopics = learningHistory
      .filter(item => item.status === 'completed' && item.topicId)
      .map(item => item.topicId);
    
    // Group by module
    const groupedByModule = this.groupByProperty(
      learningHistory.filter(item => item.topicId && item.moduleId), 
      'moduleId'
    );
    
    // Build simple graph: module -> completed topics
    for (const [moduleId, items] of Object.entries(groupedByModule)) {
      const topicsInModule = [...new Set(items.map(item => item.topicId))];
      const completedTopicsInModule = topicsInModule.filter(topicId => 
        completedTopics.includes(topicId)
      );
      
      if (completedTopicsInModule.length > 0) {
        knowledgeGraph[moduleId] = completedTopicsInModule as string[];
      }
    }
    
    return knowledgeGraph;
  }
  
  /**
   * Group an array of objects by a specific property
   */
  private static groupByProperty(array: any[], property: string): Record<string, any[]> {
    return array.reduce((grouped, item) => {
      const key = item[property] || item.content?.[property] || 'unknown';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
      return grouped;
    }, {});
  }
}
