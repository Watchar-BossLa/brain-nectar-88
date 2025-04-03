
import { LearningHistoryItem } from './historyService';

/**
 * Utility for analyzing learning data to generate and update cognitive profiles
 */
export class DataAnalysisUtils {
  /**
   * Analyze content interaction patterns to determine preferred content formats
   */
  public static analyzeContentInteractions(history: LearningHistoryItem[]): string[] {
    const contentTypeInteractions: Record<string, number> = {};
    
    // Count interactions by content type
    history.forEach(item => {
      if (!item.contentType) return;
      
      contentTypeInteractions[item.contentType] = 
        (contentTypeInteractions[item.contentType] || 0) + 1;
    });
    
    // Sort by interaction count
    const sortedTypes = Object.entries(contentTypeInteractions)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
    
    // Return top 3 content types, or all if less than 3
    return sortedTypes.slice(0, 3);
  }
  
  /**
   * Estimate learning speed across different domains
   */
  public static estimateLearningSpeed(history: LearningHistoryItem[]): Record<string, number> {
    const domainSpeed: Record<string, { total: number; count: number }> = {};
    
    // Calculate average completion time for each domain
    history.forEach(item => {
      if (!item.domain || !item.completionTimeMinutes) return;
      
      if (!domainSpeed[item.domain]) {
        domainSpeed[item.domain] = { total: 0, count: 0 };
      }
      
      domainSpeed[item.domain].total += item.completionTimeMinutes;
      domainSpeed[item.domain].count += 1;
    });
    
    // Convert to relative speed (0-1 scale)
    const result: Record<string, number> = {};
    
    // Find max average time for normalization
    const maxAvgTime = Math.max(
      ...Object.values(domainSpeed).map(v => v.total / v.count)
    ) || 1; // Prevent division by zero
    
    // Calculate normalized speed (inverted time)
    Object.entries(domainSpeed).forEach(([domain, data]) => {
      const avgTime = data.total / data.count;
      // Invert and normalize so faster = higher number
      result[domain] = 1 - (avgTime / maxAvgTime);
    });
    
    return result;
  }
  
  /**
   * Build initial knowledge graph from completed topics
   */
  public static buildInitialKnowledgeGraph(history: LearningHistoryItem[]): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    
    // Group completed topics by domain
    history.forEach(item => {
      if (!item.domain || !item.topic) return;
      
      if (!graph[item.domain]) {
        graph[item.domain] = [];
      }
      
      if (!graph[item.domain].includes(item.topic)) {
        graph[item.domain].push(item.topic);
      }
    });
    
    return graph;
  }
}
