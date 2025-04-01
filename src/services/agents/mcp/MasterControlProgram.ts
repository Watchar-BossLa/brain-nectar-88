
import { AgentType, SystemState } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { TaskProcessor } from './taskProcessor';
import { SystemStateManager } from './systemState';
import { SystemMonitoring } from './systemMonitoring';
import { LLMIntegration } from './llmIntegration';

/**
 * MasterControlProgram (MCP)
 * 
 * The central coordinator for the Study Bee multi-agent system.
 * Manages agent registration, task distribution, and system state.
 */
export class MasterControlProgram {
  private static instance: MasterControlProgram;
  private taskProcessor: TaskProcessor;
  private agentRegistry: ReturnType<typeof createAgentRegistry>;
  private systemStateManager: SystemStateManager;
  private systemMonitoring: SystemMonitoring;
  private llmIntegration: LLMIntegration;
  private systemState = {
    initialized: false,
    activeAgents: [] as AgentType[]
  };
  
  constructor() {
    console.info('[MCP] Initializing Master Control Program');
    
    this.taskProcessor = new TaskProcessor();
    this.agentRegistry = createAgentRegistry();
    
    // Register available agents
    const availableAgents = this.agentRegistry.getRegisteredAgentTypes();
    console.info('[MCP] Registered agents:', availableAgents);
    
    // Initialize system state manager
    this.systemStateManager = new SystemStateManager(availableAgents);
    this.systemMonitoring = new SystemMonitoring(this.systemStateManager);
    this.llmIntegration = new LLMIntegration(this.systemStateManager, this.systemMonitoring);
    
    // Initialize LLM system
    console.info('[MCP] Initializing LLM system');
    this.initializeLLMSystem();
    
    console.info('[MCP] MCP initialized');
    console.info('LLM orchestration system initialized successfully');
    console.info('[MCP] LLM system initialized successfully');
    
    this.systemState.initialized = true;
    this.systemState.activeAgents = availableAgents;
    
    // Setup system monitoring
    this.systemMonitoring.setupSystemMonitoring();
  }
  
  /**
   * Initialize the LLM system
   */
  private async initializeLLMSystem(): Promise<void> {
    try {
      await this.llmIntegration.initializeLLMSystem();
    } catch (error) {
      console.error('[MCP] Failed to initialize LLM system:', error);
    }
  }
  
  /**
   * Get the MasterControlProgram singleton instance
   */
  public static getInstance(): MasterControlProgram {
    if (!MasterControlProgram.instance) {
      MasterControlProgram.instance = new MasterControlProgram();
    }
    return MasterControlProgram.instance;
  }
  
  /**
   * Get the task processor
   */
  public getTaskProcessor(): TaskProcessor {
    return this.taskProcessor;
  }
  
  /**
   * Get the agent registry
   */
  public getAgentRegistry(): ReturnType<typeof createAgentRegistry> {
    return this.agentRegistry;
  }
  
  /**
   * Check if the system is initialized
   */
  public isInitialized(): boolean {
    return this.systemState.initialized;
  }
  
  /**
   * Get the active agents
   */
  public getActiveAgents(): AgentType[] {
    return [...this.systemState.activeAgents];
  }
  
  /**
   * Get the system state
   */
  public getSystemState(): SystemState {
    return this.systemStateManager.getSystemState();
  }
  
  /**
   * Enable or disable LLM orchestration
   */
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.taskProcessor.setLLMOrchestrationEnabled(enabled);
    this.llmIntegration.setLLMOrchestrationEnabled(enabled);
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.taskProcessor.isLLMOrchestrationEnabled();
  }
}

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();
