
import { performanceMonitoring } from '../../llm';
import { SystemStateManager } from './systemState';
import { MCPInitializer } from './MCPInitializer';

/**
 * MCPMonitoring
 * 
 * Handles system monitoring and statistics update
 */
export class MCPMonitoring {
  private systemStateManager: SystemStateManager;
  private llmSystemInitialized: boolean;
  
  constructor(systemStateManager: SystemStateManager, llmSystemInitialized: boolean) {
    this.systemStateManager = systemStateManager;
    this.llmSystemInitialized = llmSystemInitialized;
  }

  /**
   * Set up periodic system monitoring
   */
  public setupSystemMonitoring(): void {
    // Update system stats every 30 seconds
    setInterval(() => this.updateSystemStats(), 30000);  // 30 seconds
  }

  /**
   * Update system statistics
   */
  private updateSystemStats(): void {
    // Check if LLM system is healthy
    const llmSystemHealth = MCPInitializer.checkLLMSystemHealth();
    this.systemStateManager.setGlobalVariable('llmSystemHealth', llmSystemHealth);
    
    // Update agent statistics
    this.updateAgentStatistics();
    
    // Update performance metrics
    if (this.llmSystemInitialized) {
      const recentExecutions = performanceMonitoring.getRecentExecutions(10);
      this.systemStateManager.setGlobalVariable('recentLLMExecutions', recentExecutions.length);
    }
  }

  /**
   * Update agent statistics in the system state
   */
  private updateAgentStatistics(): void {
    // In a real implementation, we would collect detailed agent statistics
    // For now, just update some basic metrics
    this.systemStateManager.updateMetrics(true);
  }
}
