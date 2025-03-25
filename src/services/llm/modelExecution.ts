import { ModelExecutionInput, ModelExecutionResult, TaskCategory } from './types';
import { modelOrchestration } from './modelOrchestration';

/**
 * Model Execution Service
 * 
 * Handles the actual execution of tasks on selected models.
 */
export class ModelExecutionService {
  private static instance: ModelExecutionService;
  
  private constructor() {
    console.log('Model Execution Service initialized');
  }
  
  /**
   * Get singleton instance of the ModelExecutionService
   */
  public static getInstance(): ModelExecutionService {
    if (!ModelExecutionService.instance) {
      ModelExecutionService.instance = new ModelExecutionService();
    }
    return ModelExecutionService.instance;
  }
  
  /**
   * Execute a task using the specified model
   */
  public async executeTask(input: ModelExecutionInput): Promise<ModelExecutionResult> {
    console.log(`Executing task with model: ${input.modelId}`);
    
    const startTime = Date.now();
    
    // Get model details
    const model = modelOrchestration.getModel(input.modelId);
    if (!model) {
      throw new Error(`Model not found: ${input.modelId}`);
    }
    
    // Get optimized parameters for this task
    const optimizedParams = modelOrchestration.getOptimizedParameters(input.modelId, input.taskCategory);
    
    // Override with any provided parameters
    const parameters = {
      ...optimizedParams,
      ...input.parameters
    };
    
    try {
      // This is a simplified mock implementation
      // In a real application, this would connect to HuggingFace, local runtime, etc.
      let resultText = '';
      
      // Simulate different responses based on model and task
      if (input.taskCategory === TaskCategory.SUMMARIZATION) {
        resultText = `[Summary from ${model.name}]: ${input.prompt.substring(0, 50)}...`;
      } else if (input.taskCategory === TaskCategory.CLASSIFICATION) {
        resultText = `[Classification from ${model.name}]: Category A (95% confidence)`;
      } else {
        // Simple mock response for text generation
        resultText = `This is a response from ${model.name} to the prompt: "${input.prompt.substring(0, 30)}..."`;
      }
      
      // Simulate processing time based on model size
      const processingTime = model.resourceRequirements.computeUnits * 100;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const endTime = Date.now();
      
      // In a real implementation, we would track actual token counts
      const inputTokens = Math.floor(input.prompt.length / 4);
      const outputTokens = Math.floor(resultText.length / 4);
      
      // Update model metrics with this execution data
      modelOrchestration.updateModelMetrics(input.modelId, {
        latency: endTime - startTime,
        // Other metrics would be updated based on actual performance
      });
      
      return {
        text: resultText,
        modelId: input.modelId,
        executionTime: endTime - startTime,
        tokenCount: {
          input: inputTokens,
          output: outputTokens
        },
        truncated: false
      };
    } catch (error) {
      console.error(`Error executing task with model ${input.modelId}:`, error);
      throw error;
    }
  }
  
  /**
   * Execute a task with the optimal model selected automatically
   */
  public async executeWithOptimalModel(
    prompt: string,
    taskCategory: TaskCategory,
    complexity: number = 0.5,
    domainContext: string[] = [],
    parameters?: Partial<ModelParameters>
  ): Promise<ModelExecutionResult> {
    // Select the optimal model for this task
    const model = modelOrchestration.selectModelForTask(
      taskCategory,
      complexity,
      domainContext
    );
    
    if (!model) {
      throw new Error(`No suitable model found for task: ${taskCategory}`);
    }
    
    // Execute the task with the selected model
    return this.executeTask({
      modelId: model.id,
      prompt,
      taskCategory,
      parameters
    });
  }
}

// Export a singleton instance
export const modelExecution = ModelExecutionService.getInstance();
