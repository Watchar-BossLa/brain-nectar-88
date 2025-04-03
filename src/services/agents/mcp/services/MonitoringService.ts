
import { SystemStateManager } from '../systemState';
import { MCPInitializer } from '../MCPInitializer';
import { performanceMonitoring } from '../../../llm';
import { ExecutionMetrics } from '../../../llm/types';

/**
 * MonitoringService
 * 
 * Handles system monitoring, metrics collection, and performance tracking.
 */
export class MonitoringService {
  constructor(
    private systemStateManager: SystemStateManager,
    private llmService: { isLLMSystemInitialized: () => boolean }
  ) {}

  /**
   * Set up periodic system monitoring
   */
  public setupSystemMonitoring(): void {
    // Update system stats every 30 seconds
    setInterval(() => this.updateSystemStats(), 30000);
  }

  /**
   * Update system statistics and health metrics
   */
  private updateSystemStats(): void {
    // Check if LLM system is healthy
    const llmSystemHealth = MCPInitializer.checkLLMSystemHealth();
    this.systemStateManager.setGlobalVariable('llmSystemHealth', llmSystemHealth);
    
    // Update agent statistics
    this.updateAgentStatistics();
    
    // Update LLM performance metrics
    this.updateLLMPerformanceMetrics();
  }

  /**
   * Update LLM performance metrics
   */
  private updateLLMPerformanceMetrics(): void {
    if (!this.llmService.isLLMSystemInitialized()) {
      return;
    }
    
    // Get recent executions from performance monitoring
    const recentExecutions = performanceMonitoring.getRecentExecutions(10);
    this.systemStateManager.setGlobalVariable('recentLLMExecutions', recentExecutions.length);
    
    // Calculate average execution time if executions exist
    if (recentExecutions.length > 0) {
      const avgExecutionTime = this.calculateAverageExecutionTime(recentExecutions);
      this.systemStateManager.setGlobalVariable('avgLLMExecutionTime', avgExecutionTime);
      
      // Calculate success rate
      const successRate = this.calculateSuccessRate(recentExecutions);
      this.systemStateManager.setGlobalVariable('llmSuccessRate', successRate);
    }
  }
  
  /**
   * Calculate average execution time from metrics
   */
  private calculateAverageExecutionTime(executions: ExecutionMetrics[]): number {
    const executionTimes = executions.map(e => e.endTime - e.startTime);
    const totalTime = executionTimes.reduce((sum, time) => sum + time, 0);
    return totalTime / executions.length;
  }
  
  /**
   * Calculate success rate from metrics
   */
  private calculateSuccessRate(executions: ExecutionMetrics[]): number {
    const successfulExecutions = executions.filter(e => e.success).length;
    return successfulExecutions / executions.length;
  }
  
  /**
   * Update agent statistics
   */
  private updateAgentStatistics(): void {
    this.systemStateManager.updateMetrics(true);
  }
}
