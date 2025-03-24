import { AgentTask, AgentType, TaskStatus } from '../types';
import { createAgentRegistry } from './agentRegistry';

/**
 * TaskProcessor
 * 
 * Handles the processing of tasks in the queue and distributes them to appropriate agents.
 */
export class TaskProcessor {
  private taskQueue: AgentTask[] = [];
  private isProcessing = false;
  private agentRegistry = createAgentRegistry();

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
        return { success: false, error: 'No suitable agent found' };
      } else {
        // Distribute the task to the appropriate agent(s)
        for (const agentType of targetAgents) {
          const agent = this.agentRegistry.getAgent(agentType);
          if (agent) {
            await agent.processTask(task);
          }
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error processing task:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      // Continue processing the queue
      this.processTaskQueue();
    }
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
    const { taskType } = task;
    
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
        return this.determineMultiAgentTeam(task);
      default:
        // If we can't determine a specific agent, return an empty array
        // The MCP will handle this case
        return [];
    }
  }

  /**
   * For complex tasks, determine the optimal team of agents
   */
  private determineMultiAgentTeam(task: AgentTask): AgentType[] {
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
   * Get the registry of agents
   */
  public getAgentRegistry() {
    return this.agentRegistry;
  }
}
