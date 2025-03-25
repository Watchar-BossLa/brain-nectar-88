
import { AgentTask } from '../agents/types';
import { modelExecution } from './modelExecution';
import { TaskCategory } from './types';
import { modelOrchestration } from './modelOrchestration';
import { performanceMonitoring } from './performanceMonitoring';

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
    const taskCategory = this.mapAgentTaskToLLMCategory(task.taskType);
    
    // Derive complexity based on task context and priority
    const complexity = this.deriveTaskComplexity(task);
    
    // Construct a prompt from the task data
    const prompt = this.constructPromptFromTask(task);
    
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
      this.recordTaskExecution(task, result.modelId, true);
      
      return result.text;
    } catch (error) {
      console.error(`Error processing task ${task.id}:`, error);
      
      // Record failure in monitoring
      this.recordTaskExecution(task, 'unknown', false);
      
      throw error;
    }
  }
  
  /**
   * Map agent task type to LLM task category
   */
  private mapAgentTaskToLLMCategory(taskType: string): TaskCategory {
    switch (taskType) {
      case 'COGNITIVE_PROFILING':
        return TaskCategory.REASONING;
      case 'LEARNING_PATH_GENERATION':
        return TaskCategory.REASONING;
      case 'CONTENT_ADAPTATION':
        return TaskCategory.CONTENT_CREATION;
      case 'ASSESSMENT_GENERATION':
        return TaskCategory.QUESTION_ANSWERING;
      case 'ENGAGEMENT_OPTIMIZATION':
        return TaskCategory.REASONING;
      case 'FEEDBACK_GENERATION':
        return TaskCategory.TEXT_GENERATION;
      case 'UI_OPTIMIZATION':
        return TaskCategory.REASONING;
      case 'SCHEDULE_OPTIMIZATION':
        return TaskCategory.REASONING;
      case 'FLASHCARD_OPTIMIZATION':
        return TaskCategory.CONTENT_CREATION;
      default:
        return TaskCategory.TEXT_GENERATION;
    }
  }
  
  /**
   * Derive task complexity based on task attributes
   */
  private deriveTaskComplexity(task: AgentTask): number {
    // Higher priority tasks are typically more complex
    const priorityFactor = task.priority === 'CRITICAL' ? 0.9 : 
                        task.priority === 'HIGH' ? 0.7 : 
                        task.priority === 'MEDIUM' ? 0.5 : 0.3;
    
    // The more context provided, the more complex the task might be
    const contextFactor = Math.min(0.1 * task.context.length, 0.5);
    
    // If task data is extensive, complexity increases
    const dataComplexity = Object.keys(task.data).length > 5 ? 0.2 : 0.1;
    
    // Combine factors with weights
    let complexity = (priorityFactor * 0.5) + (contextFactor * 0.3) + (dataComplexity * 0.2);
    
    // Ensure complexity is between 0 and 1
    return Math.min(Math.max(complexity, 0), 1);
  }
  
  /**
   * Construct a prompt from the agent task
   */
  private constructPromptFromTask(task: AgentTask): string {
    // Construct a system prompt based on task type
    let systemPrompt = '';
    switch (task.taskType) {
      case 'COGNITIVE_PROFILING':
        systemPrompt = 'You are an expert at cognitive profiling and learning style analysis.';
        break;
      case 'LEARNING_PATH_GENERATION':
        systemPrompt = 'You are an expert educational planner specializing in accounting and professional certification paths.';
        break;
      case 'CONTENT_ADAPTATION':
        systemPrompt = 'You are an expert at adapting educational content to match individual learning needs.';
        break;
      case 'ASSESSMENT_GENERATION':
        systemPrompt = 'You are an expert at creating educational assessments for accounting concepts.';
        break;
      default:
        systemPrompt = 'You are an AI assistant helping with educational tasks related to accounting.';
    }
    
    // Format task data into a string
    const taskDataStr = JSON.stringify(task.data, null, 2);
    
    // Combine everything into a prompt
    const prompt = `${systemPrompt}
    
Task Type: ${task.taskType}
Task Description: ${task.description}
Task Context: ${task.context.join(', ')}
Priority: ${task.priority}
Task Data:
${taskDataStr}

Please provide a detailed response for this task.`;
    
    return prompt;
  }
  
  /**
   * Record task execution metrics
   */
  private recordTaskExecution(task: AgentTask, modelId: string, success: boolean): void {
    // Record basic execution metrics
    const taskCategory = this.mapAgentTaskToLLMCategory(task.taskType);
    
    performanceMonitoring.recordExecution({
      modelId,
      taskId: task.id,
      startTime: Date.now() - 1000, // Approximate start time (1 second ago)
      endTime: Date.now(),
      inputTokens: 500, // Placeholder values
      outputTokens: 300, // Placeholder values
      success,
      errorMessage: success ? undefined : 'Task execution failed'
    });
    
    // Update model performance metrics if successful
    if (success) {
      performanceMonitoring.recordEvaluation(modelId, taskCategory, {
        accuracy: 0.85, // Placeholder values
        userSatisfaction: 0.9  // Placeholder values
      });
    }
  }
  
  /**
   * Get the optimal model for a specific agent task type
   */
  public getOptimalModelForTaskType(taskType: string): string | undefined {
    const taskCategory = this.mapAgentTaskToLLMCategory(taskType);
    const model = modelOrchestration.selectModelForTask(taskCategory, 0.5, ['accounting', 'education']);
    return model?.id;
  }
}

// Export a singleton instance
export const agentIntegration = AgentIntegrationService.getInstance();
