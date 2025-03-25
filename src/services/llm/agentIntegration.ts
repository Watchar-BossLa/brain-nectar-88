
import { AgentMessage, AgentTask } from '../agents/types';
import { TaskCategory, ModelExecutionInput } from './types';
import { modelExecution } from './modelExecution';
import { modelOrchestration } from './modelOrchestration';
import { performanceMonitoring } from './performanceMonitoring';

/**
 * Agent Integration Service
 * 
 * Integrates the LLM orchestration system with the agent framework.
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
   * Map agent task type to LLM task category
   */
  private mapTaskTypeToCategory(taskType: string): TaskCategory {
    const mappings: Record<string, TaskCategory> = {
      'COGNITIVE_PROFILING': TaskCategory.CLASSIFICATION,
      'LEARNING_PATH_GENERATION': TaskCategory.CONTENT_CREATION,
      'CONTENT_ADAPTATION': TaskCategory.TEXT_GENERATION,
      'ASSESSMENT_GENERATION': TaskCategory.QUESTION_ANSWERING,
      'ENGAGEMENT_OPTIMIZATION': TaskCategory.REASONING,
      'FEEDBACK_GENERATION': TaskCategory.TEXT_GENERATION,
      'UI_OPTIMIZATION': TaskCategory.CLASSIFICATION,
      'SCHEDULE_OPTIMIZATION': TaskCategory.REASONING,
      'FLASHCARD_OPTIMIZATION': TaskCategory.CONTENT_CREATION
    };
    
    return mappings[taskType] || TaskCategory.TEXT_GENERATION;
  }
  
  /**
   * Estimate task complexity based on data and context
   */
  private estimateTaskComplexity(task: AgentTask): number {
    // This is a simplified heuristic
    // In a real system, this would be more sophisticated
    
    // Start with medium complexity
    let complexity = 0.5;
    
    // More context items suggests higher complexity
    if (task.context.length > 3) {
      complexity += 0.1;
    }
    
    // Larger data payload suggests higher complexity
    const dataSize = JSON.stringify(task.data).length;
    if (dataSize > 1000) {
      complexity += 0.1;
    }
    
    // Certain task types are inherently more complex
    if (['REASONING', 'COGNITIVE_PROFILING', 'LEARNING_PATH_GENERATION'].includes(task.taskType)) {
      complexity += 0.2;
    }
    
    // Adjust based on priority
    if (task.priority === 'CRITICAL' || task.priority === 'HIGH') {
      complexity += 0.1;
    }
    
    // Cap at 1.0
    return Math.min(complexity, 1.0);
  }
  
  /**
   * Process a task using the LLM orchestration system
   */
  public async processAgentTask(task: AgentTask): Promise<any> {
    console.log(`Processing agent task with LLM orchestration: ${task.taskType}`);
    
    // Map agent task to LLM task category
    const taskCategory = this.mapTaskTypeToCategory(task.taskType);
    
    // Estimate task complexity
    const complexity = this.estimateTaskComplexity(task);
    
    // Create domain context from task data
    const domainContext = task.context || [];
    
    // Create a prompt from the task data
    const prompt = this.createPromptFromTask(task);
    
    try {
      // Execute the task with the optimal model
      const executionStart = Date.now();
      
      const result = await modelExecution.executeWithOptimalModel(
        prompt,
        taskCategory,
        complexity,
        domainContext
      );
      
      // Record execution metrics
      performanceMonitoring.recordExecution({
        modelId: result.modelId,
        taskId: task.id,
        startTime: executionStart,
        endTime: Date.now(),
        inputTokens: result.tokenCount.input,
        outputTokens: result.tokenCount.output,
        success: true
      });
      
      // Process the model output
      const processedResult = this.processModelOutput(result.text, task);
      
      return {
        status: 'success',
        result: processedResult,
        modelId: result.modelId,
        executionTime: result.executionTime
      };
    } catch (error) {
      console.error(`Error processing agent task with LLM:`, error);
      
      // Record failed execution
      performanceMonitoring.recordExecution({
        modelId: 'unknown',
        taskId: task.id,
        startTime: Date.now(),
        endTime: Date.now(),
        inputTokens: 0,
        outputTokens: 0,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Process an agent message using the LLM orchestration system
   */
  public async processAgentMessage(message: AgentMessage): Promise<string> {
    console.log(`Processing agent message: ${message.type}`);
    
    // Determine task category based on message type
    let taskCategory = TaskCategory.TEXT_GENERATION;
    if (message.type === 'NOTIFICATION') {
      taskCategory = TaskCategory.CLASSIFICATION;
    } else if (message.type === 'TASK') {
      taskCategory = TaskCategory.REASONING;
    }
    
    // Create prompt from message
    const prompt = `${message.content}\n\nAdditional data: ${JSON.stringify(message.data)}`;
    
    try {
      // Execute with optimal model
      const result = await modelExecution.executeWithOptimalModel(
        prompt,
        taskCategory,
        0.4, // Lower complexity for messages
        [] // No specific domain context
      );
      
      return result.text;
    } catch (error) {
      console.error(`Error processing agent message with LLM:`, error);
      return `Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  /**
   * Create a prompt from an agent task
   */
  private createPromptFromTask(task: AgentTask): string {
    const taskDescription = task.description || 'No description provided';
    const contextInfo = task.context.join(', ');
    const taskData = JSON.stringify(task.data, null, 2);
    
    return `
Task: ${task.taskType}
Description: ${taskDescription}
Context: ${contextInfo}
Priority: ${task.priority}
User ID: ${task.userId}

Task Data:
${taskData}

Please process this task and provide a complete response.
`;
  }
  
  /**
   * Process model output based on task type
   */
  private processModelOutput(output: string, task: AgentTask): any {
    // This would contain task-specific processing logic
    // For now, we'll return a simple object with the output
    return {
      processedOutput: output,
      taskId: task.id,
      timestamp: new Date().toISOString()
    };
  }
}

// Export a singleton instance
export const agentIntegration = AgentIntegrationService.getInstance();
