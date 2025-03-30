
import { AgentType } from '../types';
import { AgentInitializer } from './AgentInitializer';
import { TaskManager } from './TaskManager';

/**
 * MultiAgentSystem handles the coordination and management of all Study Bee agents
 */
export class MultiAgentSystem {
  private static instance: MultiAgentSystem;
  private userId: string | null = null;
  private agentStatus: Map<string, boolean> = new Map();
  private systemInitialized: boolean = false;
  
  constructor() {
    // Initialize agent statuses as inactive
    this.agentStatus.set('COGNITIVE_PROFILE', false);
    this.agentStatus.set('LEARNING_PATH', false);
    this.agentStatus.set('CONTENT_ADAPTATION', false);
    this.agentStatus.set('ASSESSMENT', false);
    this.agentStatus.set('ENGAGEMENT', false);
    this.agentStatus.set('FEEDBACK', false);
    this.agentStatus.set('UI_UX', false);
    this.agentStatus.set('SCHEDULING', false);
  }
  
  /**
   * Get the MultiAgentSystem singleton instance
   */
  public static getInstance(): MultiAgentSystem {
    if (!MultiAgentSystem.instance) {
      MultiAgentSystem.instance = new MultiAgentSystem();
    }
    return MultiAgentSystem.instance;
  }
  
  /**
   * Initialize the multi-agent system for a user
   * @param userId The user ID to initialize the system for
   */
  public static async initialize(userId: string): Promise<void> {
    const system = MultiAgentSystem.getInstance();
    
    if (system.systemInitialized && system.userId === userId) {
      console.log('Multi-agent system already initialized for user:', userId);
      return;
    }
    
    system.userId = userId;
    
    try {
      console.log('Initializing multi-agent system for user:', userId);
      
      // Initialize MCP (Master Control Program) first
      await AgentInitializer.initializeMCP();
      
      // Initialize individual agents
      await Promise.all([
        AgentInitializer.initializeCognitiveProfileAgent().then(() => system.agentStatus.set('COGNITIVE_PROFILE', true)),
        AgentInitializer.initializeLearningPathAgent().then(() => system.agentStatus.set('LEARNING_PATH', true)),
        AgentInitializer.initializeContentAdaptationAgent().then(() => system.agentStatus.set('CONTENT_ADAPTATION', true)),
        AgentInitializer.initializeAssessmentAgent().then(() => system.agentStatus.set('ASSESSMENT', true)),
        AgentInitializer.initializeEngagementAgent().then(() => system.agentStatus.set('ENGAGEMENT', true)),
        AgentInitializer.initializeFeedbackAgent().then(() => system.agentStatus.set('FEEDBACK', true)),
        AgentInitializer.initializeUIUXAgent().then(() => system.agentStatus.set('UI_UX', true)),
        AgentInitializer.initializeSchedulingAgent().then(() => system.agentStatus.set('SCHEDULING', true)),
      ]);
      
      system.systemInitialized = true;
      console.log('Multi-agent system initialized successfully');
      
      // Start the agent tasks after initialization
      TaskManager.startAgentTasks(system.userId);
      
    } catch (error) {
      console.error('Error initializing multi-agent system:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of all agents
   */
  public getAgentStatuses(): Map<string, boolean> {
    return new Map(this.agentStatus);
  }
  
  /**
   * Check if the system is initialized
   */
  public isInitialized(): boolean {
    return this.systemInitialized;
  }
  
  /**
   * Get the current user ID
   */
  public getCurrentUserId(): string | null {
    return this.userId;
  }
}
