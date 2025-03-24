import { supabase } from '@/integrations/supabase/client';
import { AgentMessage, AgentTask, AgentType, SystemState } from '../types';
import { createAgentRegistry } from './agentRegistry';

/**
 * Master Control Program (MCP)
 * 
 * Central orchestration layer that coordinates all agent activities,
 * maintains system coherence, and ensures alignment with user learning objectives.
 */
export class MasterControlProgram {
  private static instance: MasterControlProgram;
  private systemState: SystemState;
  private agentRegistry: ReturnType<typeof createAgentRegistry>;
  private taskQueue: AgentTask[] = [];
  private isProcessing = false;

  private constructor() {
    this.systemState = {
      activeAgents: [],
      metrics: {
        taskCompletionRate: 0,
        averageResponseTime: 0,
        userSatisfactionScore: 0,
      },
      priorityMatrix: {},
      globalVariables: {},
    };
    
    this.agentRegistry = createAgentRegistry();
    
    // Initialize the system with registered agents
    this.systemState.activeAgents = this.agentRegistry.getRegisteredAgentTypes();
    
    console.log('MCP initialized with agents:', this.systemState.activeAgents);
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
    console.log('Task submitted to MCP:', task);
    this.taskQueue.push(task);
    
    // Start processing the queue if not already processing
    if (!this.isProcessing) {
      this.processTaskQueue();
    }
  }

  /**
   * Process tasks in the queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.taskQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.taskQueue.shift()!;
    
    try {
      // Determine which agent(s) should handle the task
      const targetAgents = this.determineTargetAgents(task);
      
      if (targetAgents.length === 0) {
        console.warn('No suitable agent found for task:', task);
        this.recordTaskFailure(task, 'No suitable agent found');
      } else {
        // Distribute the task to the appropriate agent(s)
        for (const agentType of targetAgents) {
          const agent = this.agentRegistry.getAgent(agentType);
          if (agent) {
            await agent.processTask(task);
          }
        }
        
        this.recordTaskSuccess(task);
      }
    } catch (error) {
      console.error('Error processing task:', error);
      this.recordTaskFailure(task, error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Continue processing the queue
    this.processTaskQueue();
  }

  /**
   * Determine which agent(s) should handle a given task
   */
  private determineTargetAgents(task: AgentTask): AgentType[] {
    // If the task specifies target agents, use those
    if (task.targetAgentTypes && task.targetAgentTypes.length > 0) {
      return task.targetAgentTypes;
    }
    
    // Otherwise, determine the best agent(s) based on the task type
    const { taskType, priority } = task;
    
    // This is a simplified allocation strategy
    // In a more sophisticated system, this would consider agent specialization,
    // current load, success rates, etc.
    
    switch (taskType) {
      case 'COGNITIVE_PROFILING':
        return ['COGNITIVE_PROFILE'];
      case 'LEARNING_PATH_GENERATION':
        return ['LEARNING_PATH'];
      case 'CONTENT_ADAPTATION':
        return ['CONTENT_ADAPTATION'];
      case 'ASSESSMENT_GENERATION':
        return ['ASSESSMENT'];
      case 'ENGAGEMENT_OPTIMIZATION':
        return ['ENGAGEMENT'];
      case 'FEEDBACK_GENERATION':
        return ['FEEDBACK'];
      case 'UI_OPTIMIZATION':
        return ['UI_UX'];
      case 'SCHEDULE_OPTIMIZATION':
        return ['SCHEDULING'];
      case 'MULTI_AGENT_COORDINATION':
        // For complex tasks requiring multiple agents
        // We'll let the MCP handle coordination
        return this.determineMultiAgentTeam(task);
      default:
        // If we can't determine a specific agent, let all applicable agents handle it
        return this.systemState.activeAgents;
    }
  }

  /**
   * For complex tasks, determine the optimal team of agents
   */
  private determineMultiAgentTeam(task: AgentTask): AgentType[] {
    // This is a placeholder for more sophisticated team composition logic
    // In a real system, this would consider task requirements, agent capabilities,
    // and previous successful agent collaborations
    
    const { context } = task;
    const team: AgentType[] = [];
    
    // Basic team composition based on task context
    if (context.includes('learning_path')) {
      team.push('LEARNING_PATH');
    }
    
    if (context.includes('assessment')) {
      team.push('ASSESSMENT');
    }
    
    if (context.includes('content')) {
      team.push('CONTENT_ADAPTATION');
    }
    
    if (context.includes('user_profile') || context.includes('cognitive')) {
      team.push('COGNITIVE_PROFILE');
    }
    
    if (context.includes('feedback')) {
      team.push('FEEDBACK');
    }
    
    if (context.includes('engagement') || context.includes('motivation')) {
      team.push('ENGAGEMENT');
    }
    
    if (context.includes('ui') || context.includes('interface')) {
      team.push('UI_UX');
    }
    
    if (context.includes('schedule') || context.includes('timing')) {
      team.push('SCHEDULING');
    }
    
    // If we couldn't determine a specific team, default to the core agents
    if (team.length === 0) {
      return ['COGNITIVE_PROFILE', 'LEARNING_PATH', 'ASSESSMENT'];
    }
    
    return team;
  }

  /**
   * Record successful task completion for performance tracking
   */
  private recordTaskSuccess(task: AgentTask): void {
    // In a real implementation, this would update performance metrics
    // and possibly store the results in a database
    console.log('Task completed successfully:', task.id);
    
    // Update metrics
    this.updateSystemMetrics(task, true);
  }

  /**
   * Record task failure for performance tracking and improvement
   */
  private recordTaskFailure(task: AgentTask, reason: string): void {
    console.error(`Task ${task.id} failed: ${reason}`);
    
    // Update metrics
    this.updateSystemMetrics(task, false);
  }

  /**
   * Update system metrics based on task outcomes
   */
  private updateSystemMetrics(task: AgentTask, success: boolean): void {
    // This is a simplified metrics update
    // In a real system, this would be much more sophisticated
    
    // Update task completion rate
    const currentRate = this.systemState.metrics.taskCompletionRate;
    const newRate = success
      ? currentRate + (1 - currentRate) * 0.1  // Slight increase for success
      : currentRate - currentRate * 0.1;       // Slight decrease for failure
    
    this.systemState.metrics.taskCompletionRate = Math.max(0, Math.min(1, newRate));
    
    // In a production system, we would store these metrics in a database
    // for long-term performance analysis
  }

  /**
   * Get the current system state
   */
  public getSystemState(): SystemState {
    return { ...this.systemState };
  }

  /**
   * Broadcast a message to all agents or specific agents
   */
  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    if (targetAgents && targetAgents.length > 0) {
      targetAgents.forEach(agentType => {
        const agent = this.agentRegistry.getAgent(agentType);
        if (agent) {
          agent.receiveMessage(message);
        }
      });
    } else {
      // Broadcast to all agents
      this.systemState.activeAgents.forEach(agentType => {
        const agent = this.agentRegistry.getAgent(agentType);
        if (agent) {
          agent.receiveMessage(message);
        }
      });
    }
  }

  /**
   * Initialize the system for a specific user
   */
  public async initializeForUser(userId: string): Promise<void> {
    console.log(`Initializing MCP for user: ${userId}`);
    
    // Set the user ID in the global variables
    this.systemState.globalVariables.currentUserId = userId;
    
    // Notify all agents that we're initializing for a new user
    this.broadcastMessage({
      type: 'SYSTEM',
      content: 'INITIALIZE_FOR_USER',
      data: { userId },
      timestamp: new Date().toISOString(),
    });
    
    // Load user-specific data and preferences
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      } else if (profile) {
        this.systemState.globalVariables.userProfile = profile;
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
      
    } catch (error) {
      console.error('Error initializing MCP for user:', error);
    }
  }
}

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();
