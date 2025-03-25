
import { AgentTask, AgentTaskResult } from './types';
import { TaskCategory } from '../types';
import { modelExecution } from '../modelExecution';
import { modelOrchestration } from '../modelOrchestration';
import { mapAgentTaskToLLMCategory } from './taskMapping';
import { deriveTaskComplexity } from './complexityAnalyzer';
import { constructPromptFromTask } from './promptGenerator';
import { recordTaskExecution } from './metricsRecorder';

/**
 * Agent Integration Service
 * 
 * Provides integration between the multi-agent system and the LLM orchestration system.
 * This enables agents to leverage the LLM system for tasks and the MCP to route tasks
 * to the optimal models.
 */
export class AgentIntegrationService {
  private static instance: AgentIntegrationService;
  
  private constructor() {
    console.log('Agent Integration Service initialized');
  }
  
  /**
   * Get singleton instance of the AgentIntegrationService
   */
  public static getInstance(): AgentIntegrationService {
    if (!AgentIntegrationService.instance) {
      AgentIntegrationService.instance = new AgentIntegrationService();
    }
    return AgentIntegrationService.instance;
  }
  
  /**
   * Process a task from the agent system using the LLM orchestration
   */
  public async processAgentTask(task: AgentTask): Promise<string> {
    console.log(`Processing agent task ${task.id} with LLM orchestration`);
    
    // Determine appropriate task category based on task type
    const taskCategory = mapAgentTaskToLLMCategory(task.taskType);
    
    // Derive complexity based on task context and priority
    const complexity = deriveTaskComplexity(task);
    
    // Construct a prompt from the task data
    const prompt = constructPromptFromTask(task);
    
    // Execute with optimal model selection
    try {
      const domainContext = ['accounting', 'learning', ...task.context];
      
      const result = await modelExecution.executeWithOptimalModel(
        prompt,
        taskCategory,
        complexity,
        domainContext
      );
      
      console.log(`Task ${task.id} processed successfully with model ${result.modelId}`);
      
      // Record success in monitoring
      recordTaskExecution(task, result.modelId, true);
      
      return result.text;
    } catch (error) {
      console.error(`Error processing task ${task.id}:`, error);
      
      // Record failure in monitoring
      recordTaskExecution(task, 'unknown', false);
      
      throw error;
    }
  }
  
  /**
   * Get the optimal model for a specific agent task type
   */
  public getOptimalModelForTaskType(taskType: string): string | undefined {
    const taskCategory = mapAgentTaskToLLMCategory(taskType);
    const model = modelOrchestration.selectModelForTask(taskCategory, 0.5, ['accounting', 'education']);
    return model?.id;
  }
}

// Export a singleton instance
export const agentIntegration = AgentIntegrationService.getInstance();
