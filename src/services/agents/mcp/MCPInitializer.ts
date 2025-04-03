
import { initializeLLMSystem, modelOrchestration, performanceMonitoring } from '../../llm';

/**
 * MCPInitializer
 * 
 * Handles initialization of MCP subsystems, particularly the LLM orchestration system.
 */
export class MCPInitializer {
  /**
   * Initialize the LLM orchestration system
   * @returns Promise that resolves when initialization is complete
   */
  public static async initializeLLMSystem(): Promise<{
    initialized: boolean;
    availableModels?: string[];
  }> {
    try {
      const llmSystem = await initializeLLMSystem();
      const availableModels = modelOrchestration.getAllModels().map(m => m.id);
      
      console.log('LLM orchestration system initialized successfully');
      
      return {
        initialized: true,
        availableModels
      };
    } catch (error) {
      console.error('Error initializing LLM system:', error);
      return {
        initialized: false
      };
    }
  }

  /**
   * Check the health of the LLM system
   * @returns Health status of the LLM system
   */
  public static checkLLMSystemHealth(): 'healthy' | 'degraded' | 'offline' {
    // In a real implementation, we would perform actual health checks
    // For now, just check if models are available
    try {
      const models = modelOrchestration.getAllModels();
      if (models.length === 0) {
        return 'degraded';
      }
      return 'healthy';
    } catch (error) {
      return 'offline';
    }
  }

  /**
   * Get performance metrics for the LLM system
   * @returns Performance metrics for all models
   */
  public static getLLMPerformanceMetrics(): Record<string, any> {
    // Get metrics for all models
    const metrics: Record<string, any> = {};
    
    try {
      const models = modelOrchestration.getAllModels();
      
      for (const model of models) {
        const modelPerformance = performanceMonitoring.getModelPerformance(model.id);
        if (modelPerformance) {
          metrics[model.id] = modelPerformance;
        }
      }
    } catch (error) {
      console.error('Error getting LLM performance metrics:', error);
    }
    
    return metrics;
  }
}
