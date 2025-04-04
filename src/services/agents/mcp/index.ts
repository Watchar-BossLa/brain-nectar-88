import { AgentMessage, AgentTask, AgentType, SystemState, AgentTypeEnum, TaskTypeEnum, TaskPriorityEnum, MessageTypeEnum } from '../types';
import { TaskProcessor } from './taskProcessor';
import { SystemStateManager } from './systemState';
import { CommunicationManager } from './communication';
import { UserContextManager } from './userContext';
import { LLMService } from './services/LLMService';
import { MonitoringService } from './services/MonitoringService';
import { TaskManagementService } from './services/TaskManagementService';

export class MasterControlProgram {
  private static instance: MasterControlProgram;
  private taskProcessor: TaskProcessor;
  private systemStateManager: SystemStateManager;
  private communicationManager: CommunicationManager;
  private userContextManager: UserContextManager;
  private llmService: LLMService;
  private monitoringService: MonitoringService;
  private taskManagementService: TaskManagementService;

  private constructor() {
    // Initialize core services
    this.taskProcessor = new TaskProcessor();
    const agentRegistry = this.taskProcessor.getAgentRegistry();
    const registeredAgents = agentRegistry.getRegisteredAgentTypes();
    
    this.systemStateManager = new SystemStateManager(registeredAgents);
    this.communicationManager = new CommunicationManager();
    this.userContextManager = new UserContextManager(this.communicationManager);
    
    // Initialize supporting services
    this.llmService = new LLMService();
    this.monitoringService = new MonitoringService(this.systemStateManager, this.llmService);
    this.taskManagementService = new TaskManagementService(
      this.taskProcessor,
      this.communicationManager
    );
    
    // Initialize the LLM system
    this.llmService.initializeLLMSystem();
    
    // Set up monitoring
    this.monitoringService.setupSystemMonitoring();
    
    console.log('MCP initialized with agents:', registeredAgents);
  }

  public static getInstance(): MasterControlProgram {
    if (!MasterControlProgram.instance) {
      MasterControlProgram.instance = new MasterControlProgram();
    }
    return MasterControlProgram.instance;
  }

  public async submitTask(task: AgentTask): Promise<void> {
    await this.taskManagementService.submitTask(task);
  }

  public getSystemState(): SystemState {
    const state = this.systemStateManager.getSystemState();
    
    return {
      ...state,
      globalVariables: {
        ...state.globalVariables,
        llmSystemAvailable: this.llmService.isLLMSystemInitialized(),
        llmOrchestrationEnabled: this.llmService.isLLMOrchestrationEnabled()
      }
    };
  }

  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    this.taskManagementService.broadcastMessage(message, targetAgents);
  }

  public async initializeForUser(userId: string): Promise<void> {
    await this.userContextManager.initializeForUser(userId, 
      (key, value) => this.systemStateManager.setGlobalVariable(key, value)
    );
    
    // Create initial cognitive profile task
    this.submitTask({
      id: `initial-cognitive-profiling-${Date.now()}`,
      userId,
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Initial cognitive profiling for user',
      priority: TaskPriorityEnum.HIGH,
      targetAgentTypes: [AgentTypeEnum.COGNITIVE_PROFILE],
      context: ['initial_setup', 'user_profile'],
      data: {},
      createdAt: new Date().toISOString(),
    });
    
    console.log(`MCP initialized for user ${userId} with LLM orchestration ${this.llmService.isLLMOrchestrationEnabled() ? 'enabled' : 'disabled'}`);
  }
  
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.llmService.setLLMOrchestrationEnabled(enabled);
    this.taskManagementService.setLLMOrchestrationEnabled(enabled);
    
    this.broadcastMessage({
      type: MessageTypeEnum.SYSTEM,
      content: `LLM orchestration has been ${enabled ? 'enabled' : 'disabled'}`,
      data: { llmOrchestrationEnabled: enabled },
      timestamp: new Date().toISOString()
    });
    
    console.log(`LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  public isLLMOrchestrationEnabled(): boolean {
    return this.llmService.isLLMOrchestrationEnabled();
  }
  
  public getLLMPerformanceMetrics(): Record<string, any> {
    return this.llmService.getLLMPerformanceMetrics();
  }
}

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();
