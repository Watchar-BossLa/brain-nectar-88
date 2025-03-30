
import { SystemStateManager } from './systemState';
import { initializeLLMSystem, modelOrchestration } from '../../llm';
import { SystemMonitoring } from './systemMonitoring';

/**
 * LLMIntegration
 * 
 * Handles integration with the LLM orchestration system
 */
export class LLMIntegration {
  private systemStateManager: SystemStateManager;
  private systemMonitoring: SystemMonitoring;
  private llmOrchestrationEnabled = true;
  
  constructor(systemStateManager: SystemStateManager, systemMonitoring: SystemMonitoring) {
    this.systemStateManager = systemStateManager;
    this.systemMonitoring = systemMonitoring;
  }

  /**
   * Initialize the LLM orchestration system
   */
  public async initializeLLMSystem(): Promise<void> {
    try {
      const llmSystem = await initializeLLMSystem();
      this.systemMonitoring.setLLMSystemInitialized(true);
      
      // Update global state to indicate LLM system is available
      this.systemStateManager.setGlobalVariable('llmSystemAvailable', true);
      this.systemStateManager.setGlobalVariable('llmSystemModels', modelOrchestration.getAllModels().map(m => m.id));
      this.systemStateManager.setGlobalVariable('llmOrchestrationEnabled', this.llmOrchestrationEnabled);
      
      console.log('LLM orchestration system initialized successfully');
    } catch (error) {
      console.error('Error initializing LLM system:', error);
      this.systemStateManager.setGlobalVariable('llmSystemAvailable', false);
      this.systemStateManager.setGlobalVariable('llmOrchestrationEnabled', false);
    }
  }
  
  /**
   * Enable or disable LLM orchestration
   */
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.llmOrchestrationEnabled = enabled;
    this.systemStateManager.setGlobalVariable('llmOrchestrationEnabled', enabled);
    
    console.log(`LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.llmOrchestrationEnabled;
  }
}
