
import { MCPInitializer } from '../MCPInitializer';
import { modelOrchestration, performanceMonitoring } from '../../../llm';

export class LLMService {
  private llmSystemInitialized = false;
  private llmOrchestrationEnabled = true;

  public async initializeLLMSystem(): Promise<void> {
    const result = await MCPInitializer.initializeLLMSystem();
    this.llmSystemInitialized = result.initialized;
    
    if (result.initialized && result.availableModels) {
      return;
    }
  }

  public isLLMSystemInitialized(): boolean {
    return this.llmSystemInitialized;
  }

  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.llmOrchestrationEnabled = enabled;
  }

  public isLLMOrchestrationEnabled(): boolean {
    return this.llmOrchestrationEnabled;
  }

  public getLLMPerformanceMetrics(): Record<string, any> {
    if (!this.llmSystemInitialized) {
      return {};
    }
    return MCPInitializer.getLLMPerformanceMetrics();
  }
}
