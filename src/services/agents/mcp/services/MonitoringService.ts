
import { SystemStateManager } from '../systemState';
import { MCPInitializer } from '../MCPInitializer';
import { performanceMonitoring } from '../../../llm';

export class MonitoringService {
  constructor(
    private systemStateManager: SystemStateManager,
    private llmService: { isLLMSystemInitialized: () => boolean }
  ) {}

  public setupSystemMonitoring(): void {
    // Update system stats every 30 seconds
    setInterval(() => this.updateSystemStats(), 30000);
  }

  private updateSystemStats(): void {
    // Check if LLM system is healthy
    const llmSystemHealth = MCPInitializer.checkLLMSystemHealth();
    this.systemStateManager.setGlobalVariable('llmSystemHealth', llmSystemHealth);
    
    // Update agent statistics
    this.updateAgentStatistics();
    
    // Update performance metrics
    if (this.llmService.isLLMSystemInitialized()) {
      const recentExecutions = performanceMonitoring.getRecentExecutions(10);
      this.systemStateManager.setGlobalVariable('recentLLMExecutions', recentExecutions.length);
    }
  }

  private updateAgentStatistics(): void {
    this.systemStateManager.updateMetrics(true);
  }
}
