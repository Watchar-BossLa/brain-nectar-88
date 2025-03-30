
import { AgentType, SystemState } from '../types';
import { SystemStateManager } from './systemState';
import { modelOrchestration, performanceMonitoring } from '../../llm';

/**
 * SystemMonitoring
 * 
 * Handles monitoring of the system state and LLM performance
 */
export class SystemMonitoring {
  private systemStateManager: SystemStateManager;
  private llmSystemInitialized = false;
  
  constructor(systemStateManager: SystemStateManager) {
    this.systemStateManager = systemStateManager;
  }

  /**
   * Set up periodic system monitoring
   */
  public setupSystemMonitoring(): void {
    // Update system stats every 30 seconds
    setInterval(() => {
      // Check if LLM system is healthy
      const llmSystemHealth = this.checkLLMSystemHealth();
      this.systemStateManager.setGlobalVariable('llmSystemHealth', llmSystemHealth);
      
      // Update agent statistics
      this.updateAgentStatistics();
      
      // Update performance metrics
      if (this.llmSystemInitialized) {
        const recentExecutions = performanceMonitoring.getRecentExecutions(10);
        this.systemStateManager.setGlobalVariable('recentLLMExecutions', recentExecutions.length);
      }
    }, 30000);  // 30 seconds
  }

  /**
   * Check the health of the LLM system
   */
  private checkLLMSystemHealth(): 'healthy' | 'degraded' | 'offline' {
    if (!this.llmSystemInitialized) {
      return 'offline';
    }
    
    // In a real implementation, we would perform actual health checks
    // For now, just return healthy if initialized
    return 'healthy';
  }

  /**
   * Update agent statistics in the system state
   */
  public updateAgentStatistics(): void {
    // In a real implementation, we would collect detailed agent statistics
    // For now, just update some basic metrics
    this.systemStateManager.updateMetrics(true);
  }
  
  /**
   * Set LLM system initialized status
   */
  public setLLMSystemInitialized(initialized: boolean): void {
    this.llmSystemInitialized = initialized;
  }
  
  /**
   * Check if LLM system is initialized
   */
  public isLLMSystemInitialized(): boolean {
    return this.llmSystemInitialized;
  }
  
  /**
   * Get performance metrics for the LLM system
   */
  public getLLMPerformanceMetrics(): Record<string, any> {
    if (!this.llmSystemInitialized) {
      return {};
    }
    
    // Get metrics for all models
    const metrics: Record<string, any> = {};
    const models = modelOrchestration.getAllModels();
    
    for (const model of models) {
      const modelPerformance = performanceMonitoring.getModelPerformance(model.id);
      if (modelPerformance) {
        metrics[model.id] = modelPerformance;
      }
    }
    
    return metrics;
  }
}
