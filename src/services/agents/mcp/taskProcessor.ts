
import { AgentTask, TaskType } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { agentIntegration } from '../../llm/agentIntegration';
import { determineTargetAgents } from './taskRouting';
import { TaskQueueManager } from './taskQueueManager';
import { TaskStatus } from '../types/taskTypes';

/**
 * TaskProcessor
 * 
 * Handles the processing of tasks in the queue and distributes them to appropriate agents.
 */
export class TaskProcessor {
  private taskQueueManager: TaskQueueManager;
  private isProcessing = false;
  private agentRegistry = createAgentRegistry();
  private useLLMOrchestration = true;

  constructor() {
    this.taskQueueManager = new TaskQueueManager();
    console.log('[TaskProcessor] Initialized with LLM orchestration:', this.useLLMOrchestration);
  }

  /**
   * Submit a task to be handled by the appropriate agent(s)
   */
  public async submitTask(task: AgentTask): Promise<void> {
    console.log(`[TaskProcessor] Task submitted: ${task.id} (${task.taskType}, Priority: ${task.priority})`);
    console.log(`[TaskProcessor] Task details: User ID: ${task.userId}, Context: ${task.context.join(', ')}`);
    
    // Add task to the queue based on priority
    this.taskQueueManager.addTaskToQueue(task);
    console.log(`[TaskProcessor] Task ${task.id} added to queue`);
    
    // Start processing the queue if not already processing
    if (!this.isProcessing) {
      console.log('[TaskProcessor] Starting queue processing');
      this.processTaskQueue();
    }
  }

  /**
   * Process tasks in the queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.taskQueueManager.isEmpty()) {
      console.log('[TaskProcessor] Queue is empty, stopping processing');
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.taskQueueManager.getNextTask();
    
    if (!task) {
      console.log('[TaskProcessor] No next task available, stopping processing');
      this.isProcessing = false;
      return;
    }
    
    console.log(`[TaskProcessor] Processing task: ${task.id} (${task.taskType})`);
    
    try {
      // Determine which agent(s) should handle the task
      const targetAgents = determineTargetAgents(task);
      console.log(`[TaskProcessor] Target agents for task ${task.id}: ${targetAgents.join(', ')}`);
      
      if (targetAgents.length === 0) {
        console.warn(`[TaskProcessor] No suitable agent found for task: ${task.id} (${task.taskType})`);
        console.error('[TaskProcessor] No suitable agent found');
        // Mark the task as failed since no agent can process it
        task.status = 'failed';
        task.completedAt = new Date().toISOString();
        console.error(`[TaskProcessor] Task ${task.id} marked as failed - no suitable agent`);
      } else {
        // If LLM orchestration is enabled, use it to enhance agent processing
        if (this.useLLMOrchestration) {
          console.log(`[TaskProcessor] Using LLM orchestration for task ${task.id}`);
          
          try {
            // Process the task with LLM orchestration first
            const llmResult = await agentIntegration.processAgentTask(task);
            
            // Attach LLM result to task data for agent use
            task.data = {
              ...task.data,
              llmResult: llmResult
            };
            
            console.log(`[TaskProcessor] Enhanced task ${task.id} with LLM orchestration successfully`);
          } catch (llmError) {
            console.error(`[TaskProcessor] LLM orchestration failed for task ${task.id}:`, llmError);
            console.log(`[TaskProcessor] Continuing with standard processing without LLM enhancement`);
          }
        }
        
        // Update task status to processing
        task.status = 'processing';
        console.log(`[TaskProcessor] Task ${task.id} status updated to: processing`);
        
        let successfulProcessing = false;
        
        // Distribute the task to the appropriate agent(s)
        for (const agentType of targetAgents) {
          const agent = this.agentRegistry.getAgent(agentType);
          if (agent) {
            console.log(`[TaskProcessor] Delegating task ${task.id} to agent: ${agentType}`);
            try {
              await agent.processTask(task);
              console.log(`[TaskProcessor] Agent ${agentType} processed task ${task.id} successfully`);
              successfulProcessing = true;
            } catch (agentError) {
              console.error(`[TaskProcessor] Agent ${agentType} failed to process task ${task.id}:`, agentError);
            }
          } else {
            console.warn(`[TaskProcessor] Agent ${agentType} registered but not instantiated correctly`);
          }
        }
        
        // Update task status based on processing result
        if (successfulProcessing) {
          task.status = 'completed';
          task.completedAt = new Date().toISOString();
          console.log(`[TaskProcessor] Task ${task.id} completed successfully at ${task.completedAt}`);
        } else {
          task.status = 'failed';
          task.completedAt = new Date().toISOString();
          console.error(`[TaskProcessor] Task ${task.id} marked as failed - all agents failed to process`);
        }
      }
    } catch (error) {
      console.error(`[TaskProcessor] Error processing task ${task.id}:`, error);
      console.error(`[TaskProcessor] Task processing failed:`, error instanceof Error ? error.message : 'Unknown error');
      
      // Update task status to failed
      task.status = 'failed';
      task.completedAt = new Date().toISOString();
    } finally {
      // Continue processing the queue
      console.log(`[TaskProcessor] Moving to next task in queue`);
      this.processTaskQueue();
    }
  }

  /**
   * Get the registry of agents
   */
  public getAgentRegistry() {
    return this.agentRegistry;
  }
  
  /**
   * Enable or disable LLM orchestration
   */
  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.useLLMOrchestration = enabled;
    console.log(`[TaskProcessor] LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.useLLMOrchestration;
  }
}
