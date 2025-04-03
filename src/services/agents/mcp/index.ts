
import { AgentMessage, AgentTask, AgentType, SystemState } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { TaskProcessor } from './taskProcessor';
import { SystemStateManager } from './systemState';
import { CommunicationManager } from './communication';
import { UserContextManager } from './userContext';
import { MCPInitializer } from './MCPInitializer';
import { MCPMonitoring } from './MCPMonitoring';
import { modelOrchestration, performanceMonitoring } from '../../llm';

/**
 * Master Control Program (MCP)
 * 
 * Central orchestration layer that coordinates all agent activities,
 * maintains system coherence, and ensures alignment with user learning objectives.
 * Also manages the LLM orchestration system for intelligent model selection.
 */
export class MasterControlProgram {
  private static instance: MasterControlProgram;
  private taskProcessor: TaskProcessor;
  private systemStateManager: SystemStateManager;
  private communicationManager: CommunicationManager;
  private userContextManager: UserContextManager;
  private mcpMonitoring: MCPMonitoring;
  private llmSystemInitialized = false;
  private llmOrchestrationEnabled = true;

  private constructor() {
    this.taskProcessor = new TaskProcessor();
    
    const agentRegistry = this.taskProcessor.getAgentRegistry();
    const registeredAgents = agentRegistry.getRegisteredAgentTypes();
    
    this.systemStateManager = new SystemStateManager(registeredAgents);
    this.communicationManager = new CommunicationManager();
    this.userContextManager = new UserContextManager(this.communicationManager);
    this.mcpMonitoring = new MCPMonitoring(this.systemStateManager, this.llmSystemInitialized);
    
    // Initialize the LLM orchestration system
    this.initializeLLMSystem();
    
    // Set up interval for monitoring the system
    this.mcpMonitoring.setupSystemMonitoring();
    
    console.log('MCP initialized with agents:', registeredAgents);
  }

  /**
   * Initialize the LLM orchestration system
   */
  private async initializeLLMSystem(): Promise<void> {
    const result = await MCPInitializer.initializeLLMSystem();
    this.llmSystemInitialized = result.initialized;
    
    // Update global state to indicate LLM system is available
    this.systemStateManager.setGlobalVariable('llmSystemAvailable', result.initialized);
    
    if (result.initialized && result.availableModels) {
      this.systemStateManager.setGlobalVariable('llmSystemModels', result.availableModels);
    }
    
    this.systemStateManager.setGlobalVariable('llmOrchestrationEnabled', this.llmOrchestrationEnabled);
  }

  /**
   * Get the singleton instance of the MCP
   */
  public static getInstance(): MasterControlProgram {
    if (!MasterControlProgram.instance) {
      MasterControlProgram.instance = new MasterControlProgram();
    }
    return MasterControlProgram.instance;
  }

  /**
   * Submit a task to be handled by the appropriate agent(s)
   */
  public async submitTask(task: AgentTask): Promise<void> {
    try {
      await this.taskProcessor.submitTask(task);
      this.systemStateManager.updateMetrics(true);
    } catch (error) {
      console.error('Error submitting task:', error);
      this.systemStateManager.updateMetrics(false);
    }
  }

  /**
   * Get the current system state
   */
  public getSystemState(): SystemState {
    const state = this.systemStateManager.getSystemState();
    
    // Add LLM system status to the state
    return {
      ...state,
      globalVariables: {
        ...state.globalVariables,
        llmSystemAvailable: this.llmSystemInitialized,
        llmOrchestrationEnabled: this.llmOrchestrationEnabled
      }
    };
  }

  /**
   * Broadcast a message to all agents or specific agents
   */
  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    this.communicationManager.broadcastMessage(message, targetAgents);
  }

  /**
   * Initialize the system for a specific user
   */
  public async initializeForUser(userId: string): Promise<void> {
    await this.userContextManager.initializeForUser(userId, 
      (key, value) => this.systemStateManager.setGlobalVariable(key, value)
    );
    
    // Ensure LLM system is initialized
    if (!this.llmSystemInitialized) {
      await this.initializeLLMSystem();
    }
    
    // Create initial cognitive profile task
    this.submitTask({
      id: `initial-cognitive-profiling-${Date.now()}`,
      userId,
      taskType: 'COGNITIVE_PROFILING',
      description: 'Initial cognitive profiling for user',
      priority: 'HIGH',
      targetAgentTypes: ['COGNITIVE_PROFILE'],
      context: ['initial_setup', 'user_profile'],
      data: {},
      createdAt: new Date().toISOString(),
    });
    
    // Log the initialization
    console.log(`MCP initialized for user ${userId} with LLM orchestration ${this.llmOrchestrationEnabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Enable or disable LLM orchestration
   */
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.llmOrchestrationEnabled = enabled;
    this.systemStateManager.setGlobalVariable('llmOrchestrationEnabled', enabled);
    this.taskProcessor.setLLMOrchestrationEnabled(enabled);
    
    // Broadcast a system message about the change
    this.broadcastMessage({
      type: 'SYSTEM',
      content: `LLM orchestration has been ${enabled ? 'enabled' : 'disabled'}`,
      data: { llmOrchestrationEnabled: enabled },
      timestamp: new Date().toISOString()
    });
    
    console.log(`LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.llmOrchestrationEnabled;
  }
  
  /**
   * Get performance metrics for the LLM system
   */
  public getLLMPerformanceMetrics(): Record<string, any> {
    if (!this.llmSystemInitialized) {
      return {};
    }
    
    return MCPInitializer.getLLMPerformanceMetrics();
  }
}

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();
