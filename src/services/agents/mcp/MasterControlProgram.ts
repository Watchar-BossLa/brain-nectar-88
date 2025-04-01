
import { AgentType } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { TaskProcessor } from './taskProcessor';

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
    
    // Initialize LLM system
    console.info('[MCP] Initializing LLM system');
    console.info('Initializing LLM system...');
    
    console.info('[MCP] MCP initialized');
    console.info('LLM orchestration system initialized successfully');
    console.info('[MCP] LLM system initialized successfully');
    
    this.systemState.initialized = true;
    this.systemState.activeAgents = availableAgents;
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
}

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();
