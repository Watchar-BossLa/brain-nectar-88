
import { AgentMessage, AgentTask, AgentType, SystemState } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { TaskProcessor } from './taskProcessor';
import { SystemStateManager } from './systemState';
import { CommunicationManager } from './communication';
import { UserContextManager } from './userContext';
import { SystemMonitoring } from './systemMonitoring';
import { LLMIntegration } from './llmIntegration';

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
  private systemMonitoring: SystemMonitoring;
  private llmIntegration: LLMIntegration;

  private constructor() {
    console.log('[MCP] Initializing Master Control Program');
    this.taskProcessor = new TaskProcessor();
    
    const agentRegistry = this.taskProcessor.getAgentRegistry();
    const registeredAgents = agentRegistry.getRegisteredAgentTypes();
    
    console.log('[MCP] Registered agents:', registeredAgents);
    
    this.systemStateManager = new SystemStateManager(registeredAgents);
    this.communicationManager = new CommunicationManager();
    this.userContextManager = new UserContextManager(this.communicationManager);
    
    // Initialize monitoring and LLM integration
    this.systemMonitoring = new SystemMonitoring(this.systemStateManager);
    this.llmIntegration = new LLMIntegration(this.systemStateManager, this.systemMonitoring);
    
    // Initialize the LLM orchestration system
    this.initializeLLMSystem();
    
    // Set up interval for monitoring the system
    this.systemMonitoring.setupSystemMonitoring();
    
    console.log('[MCP] MCP initialized');
  }

  /**
   * Initialize the LLM orchestration system
   */
  private async initializeLLMSystem(): Promise<void> {
    console.log('[MCP] Initializing LLM system');
    try {
      await this.llmIntegration.initializeLLMSystem();
      console.log('[MCP] LLM system initialized successfully');
    } catch (error) {
      console.error('[MCP] Failed to initialize LLM system:', error);
    }
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
    console.log(`[MCP] Submitting task: ${task.id} (${task.taskType})`);
    console.log(`[MCP] Task details:`, {
      priority: task.priority,
      userId: task.userId,
      targetAgents: task.targetAgentTypes,
      context: task.context
    });
    
    try {
      const startTime = Date.now();
      await this.taskProcessor.submitTask(task);
      const processingTime = Date.now() - startTime;
      
      console.log(`[MCP] Task ${task.id} submitted successfully (processing time: ${processingTime}ms)`);
      this.systemMonitoring.updateAgentStatistics();
      this.systemStateManager.updateMetrics(true);
    } catch (error) {
      console.error(`[MCP] Error submitting task ${task.id}:`, error);
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
        llmSystemAvailable: this.systemMonitoring.isLLMSystemInitialized(),
        llmOrchestrationEnabled: this.llmIntegration.isLLMOrchestrationEnabled()
      }
    };
  }

  /**
   * Broadcast a message to all agents or specific agents
   */
  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    console.log(`[MCP] Broadcasting message of type ${message.type}`, targetAgents ? `to ${targetAgents.join(', ')}` : 'to all agents');
    this.communicationManager.broadcastMessage(message, targetAgents);
  }

  /**
   * Initialize the system for a specific user
   */
  public async initializeForUser(userId: string): Promise<void> {
    console.log(`[MCP] Initializing system for user: ${userId}`);
    
    try {
      await this.userContextManager.initializeForUser(userId, 
        (key, value) => this.systemStateManager.setGlobalVariable(key, value)
      );
      
      // Ensure LLM system is initialized
      if (!this.systemMonitoring.isLLMSystemInitialized()) {
        console.log(`[MCP] LLM system not initialized, initializing now for user ${userId}`);
        await this.initializeLLMSystem();
      }
      
      // Create initial cognitive profile task
      const initialTask: AgentTask = {
        id: `initial-cognitive-profiling-${Date.now()}`,
        userId,
        taskType: 'COGNITIVE_PROFILING',
        description: 'Initial cognitive profiling for user',
        priority: 'HIGH',
        targetAgentTypes: ['COGNITIVE_PROFILE'],
        context: ['initial_setup', 'user_profile'],
        data: {},
        createdAt: new Date().toISOString(),
      };
      
      console.log(`[MCP] Submitting initial cognitive profile task for user ${userId}`);
      await this.submitTask(initialTask);
      
      console.log(`[MCP] System initialized successfully for user ${userId}`);
    } catch (error) {
      console.error(`[MCP] Error initializing system for user ${userId}:`, error);
      throw new Error(`Failed to initialize system for user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Enable or disable LLM orchestration
   */
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    console.log(`[MCP] Setting LLM orchestration to: ${enabled ? 'enabled' : 'disabled'}`);
    this.llmIntegration.setLLMOrchestrationEnabled(enabled);
    this.taskProcessor.setLLMOrchestrationEnabled(enabled);
    
    // Broadcast a system message about the change
    this.broadcastMessage({
      type: 'SYSTEM',
      content: `LLM orchestration has been ${enabled ? 'enabled' : 'disabled'}`,
      data: { llmOrchestrationEnabled: enabled },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.llmIntegration.isLLMOrchestrationEnabled();
  }
  
  /**
   * Get performance metrics for the LLM system
   */
  public getLLMPerformanceMetrics(): Record<string, any> {
    return this.systemMonitoring.getLLMPerformanceMetrics();
  }
}
