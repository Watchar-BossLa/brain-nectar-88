
import { AgentTask, TaskType, TaskStatus } from '../types';
import { createAgentRegistry } from './agentRegistry';
import { agentIntegration } from '../../llm/agentIntegration';
import { determineTargetAgents } from './taskRouting';
import { TaskQueueManager } from './taskQueueManager';

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
  }

  /**
   * Submit a task to be handled by the appropriate agent(s)
   */
  public async submitTask(task: AgentTask): Promise<void> {
    console.log('Task submitted to MCP:', task);
    
    // Add task to the queue based on priority
    this.taskQueueManager.addTaskToQueue(task);
    
    // Start processing the queue if not already processing
    if (!this.isProcessing) {
      this.processTaskQueue();
    }
  }

  /**
   * Process tasks in the queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.taskQueueManager.isEmpty()) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.taskQueueManager.getNextTask();
    
    if (!task) {
      this.isProcessing = false;
      return;
    }
    
    try {
      // Determine which agent(s) should handle the task
      const targetAgents = determineTargetAgents(task);
      
      if (targetAgents.length === 0) {
        console.warn('No suitable agent found for task:', task);
        console.error('No suitable agent found');
      } else {
        // If LLM orchestration is enabled, use it to enhance agent processing
        if (this.useLLMOrchestration) {
          // Process the task with LLM orchestration first
          const llmResult = await agentIntegration.processAgentTask(task);
          
          // Attach LLM result to task data for agent use
          task.data = {
            ...task.data,
            llmResult: llmResult
          };
          
          console.log(`Enhanced task with LLM orchestration: ${task.id}`);
        }
        
        // Distribute the task to the appropriate agent(s)
        for (const agentType of targetAgents) {
          const agent = this.agentRegistry.getAgent(agentType);
          if (agent) {
            await agent.processTask(task);
          }
        }
        
        console.log('Task processed successfully');
      }
    } catch (error) {
      console.error('Error processing task:', error);
      console.error('Task processing failed:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      // Continue processing the queue
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
    console.log(`LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Check if LLM orchestration is enabled
   */
  public isLLMOrchestrationEnabled(): boolean {
    return this.useLLMOrchestration;
  }
}
