
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
    
    // Sort task in the queue based on priority
    this.addTaskToQueue(task);
    
    // Start processing the queue if not already processing
    if (!this.isProcessing) {
      this.processTaskQueue();
    }
  }

  /**
   * Add task to queue with appropriate priority ordering
   */
  private addTaskToQueue(task: AgentTask): void {
    // If task has no priority specified, default to MEDIUM
    if (!task.priority) {
      task.priority = 'MEDIUM';
    }
    
    // Priority order: CRITICAL > HIGH > MEDIUM > LOW
    const priorityValues = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    
    // Find the right position based on priority
    const insertIndex = this.taskQueue.findIndex(
      queuedTask => priorityValues[queuedTask.priority || 'MEDIUM'] > priorityValues[task.priority || 'MEDIUM']
    );
    
    if (insertIndex === -1) {
      // Add to the end if no higher priority task is found
      this.taskQueue.push(task);
    } else {
      // Insert at the right position
      this.taskQueue.splice(insertIndex, 0, task);
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
        // Instead of returning an object, just log the error
        console.error('No suitable agent found');
      } else {
        // Distribute the task to the appropriate agent(s)
        for (const agentType of targetAgents) {
          const agent = this.agentRegistry.getAgent(agentType);
          if (agent) {
            await agent.processTask(task);
          }
        }
        
        // Instead of returning a success object, just log success
        console.log('Task processed successfully');
      }
    } catch (error) {
      console.error('Error processing task:', error);
      // Instead of returning an error object, just log the error
      console.error('Task processing failed:', error instanceof Error ? error.message : 'Unknown error');
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
      case 'FLASHCARD_OPTIMIZATION':
        // For flashcard tasks, involve the cognitive profile and engagement agents
        return ['COGNITIVE_PROFILE', 'SCHEDULING'];
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
    
    // Enhanced team composition based on task context with more granular analysis
    if (context.includes('learning_path') || context.includes('study_plan')) {
      team.push('LEARNING_PATH');
    }
    
    if (context.includes('assessment') || context.includes('test') || context.includes('quiz')) {
      team.push('ASSESSMENT');
    }
    
    if (context.includes('content') || context.includes('material') || context.includes('resources')) {
      team.push('CONTENT_ADAPTATION');
    }
    
    if (context.includes('user_profile') || context.includes('cognitive') || context.includes('learning_style')) {
      team.push('COGNITIVE_PROFILE');
    }
    
    if (context.includes('feedback') || context.includes('review') || context.includes('evaluation')) {
      team.push('FEEDBACK');
    }
    
    if (context.includes('engagement') || context.includes('motivation') || context.includes('gamification')) {
      team.push('ENGAGEMENT');
    }
    
    if (context.includes('ui') || context.includes('interface') || context.includes('display')) {
      team.push('UI_UX');
    }
    
    if (context.includes('schedule') || context.includes('timing') || context.includes('planning') || 
        context.includes('spaced_repetition') || context.includes('flashcard')) {
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
