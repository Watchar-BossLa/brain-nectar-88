
import { ModelType, TaskCategory, ModelEvaluation } from '../types';
import { modelRegistry } from '../modelRegistry/modelRegistryService';

/**
 * Model Selection Service
 * 
 * Handles the selection of the optimal model for a specific task.
 */
export class ModelSelectionService {
  private static instance: ModelSelectionService;
  private performanceMetrics: Map<string, ModelEvaluation> = new Map();
  
  private constructor() {
    console.log('Model Selection Service initialized');
  }
  
  /**
   * Get singleton instance of the ModelSelectionService
   */
  public static getInstance(): ModelSelectionService {
    if (!ModelSelectionService.instance) {
      ModelSelectionService.instance = new ModelSelectionService();
    }
    return ModelSelectionService.instance;
  }
  
  /**
   * Select the optimal model for a specific task
   */
  public selectModelForTask(
    taskCategory: TaskCategory,
    taskComplexity: number = 0.5,
    domainContext: string[] = [],
    resourceConstraints?: { maxMemory?: number, maxComputeUnits?: number }
  ): ModelType | undefined {
    console.log(`Selecting model for task: ${taskCategory}, complexity: ${taskComplexity}`);
    
    // Get all models capable of handling the task category
    const capableModels = modelRegistry.getAllModels()
      .filter(model => model.capabilities.includes(taskCategory));
    
    if (capableModels.length === 0) {
      console.log(`No models capable of handling task: ${taskCategory}`);
      return undefined;
    }
    
    // Filter by resource constraints if provided
    let eligibleModels = capableModels;
    if (resourceConstraints) {
      eligibleModels = capableModels.filter(model => {
        const meetsMemoryConstraint = !resourceConstraints.maxMemory || 
          model.resourceRequirements.memory <= resourceConstraints.maxMemory;
        
        const meetsComputeConstraint = !resourceConstraints.maxComputeUnits || 
          model.resourceRequirements.computeUnits <= resourceConstraints.maxComputeUnits;
        
        return meetsMemoryConstraint && meetsComputeConstraint;
      });
      
      if (eligibleModels.length === 0) {
        console.log(`No models meet resource constraints for task: ${taskCategory}`);
        // Fall back to the model with the lowest resource requirements
        return this.selectFallbackModel(capableModels);
      }
    }
    
    // Calculate a score for each model based on capabilities, performance metrics, and task complexity
    const modelScores = eligibleModels.map(model => {
      // Start with base score
      let score = 1.0;
      
      // Adjust score based on task complexity
      if (taskComplexity > 0.7 && model.resourceRequirements.computeUnits > 4) {
        // More complex tasks benefit from larger models
        score += 0.5;
      } else if (taskComplexity < 0.3 && model.resourceRequirements.computeUnits <= 2) {
        // Simple tasks can work well with smaller models
        score += 0.3;
      }
      
      // Consider performance metrics if available
      const metrics = this.performanceMetrics.get(model.id);
      if (metrics) {
        // Boost score based on relevant metrics
        if (metrics.accuracy > 0.8) score += 0.2;
        if (metrics.latency < 100) score += 0.2;
        if (taskCategory === TaskCategory.QUESTION_ANSWERING && metrics.f1Score > 0.7) score += 0.3;
      }
      
      // Consider domain-specific factors
      if (domainContext.includes('accounting') && model.id.includes('llama3')) {
        // Example: If we've determined Llama models perform better on accounting tasks
        score += 0.2;
      }
      
      return { model, score };
    });
    
    // Sort by score and return the best model
    modelScores.sort((a, b) => b.score - a.score);
    
    const selectedModel = modelScores[0]?.model;
    if (selectedModel) {
      console.log(`Selected model: ${selectedModel.name} (${selectedModel.id}) with score: ${modelScores[0].score}`);
    }
    
    return selectedModel;
  }
  
  /**
   * Select a fallback model when resource constraints can't be met
   */
  private selectFallbackModel(models: ModelType[]): ModelType {
    // Sort by resource requirements (lower is better for fallback)
    const sortedByResource = [...models].sort((a, b) => 
      a.resourceRequirements.memory - b.resourceRequirements.memory ||
      a.resourceRequirements.computeUnits - b.resourceRequirements.computeUnits
    );
    
    return sortedByResource[0];
  }
  
  /**
   * Update performance metrics for a model
   */
  public updateModelMetrics(modelId: string, evaluation: Partial<ModelEvaluation>): void {
    const currentMetrics = this.performanceMetrics.get(modelId) || {
      accuracy: 0,
      latency: 0,
      f1Score: 0,
      resourceEfficiency: 0,
      userSatisfaction: 0
    };
    
    // Update metrics with new evaluation data
    this.performanceMetrics.set(modelId, {
      ...currentMetrics,
      ...evaluation
    });
    
    console.log(`Updated metrics for model: ${modelId}`);
  }
  
  /**
   * Get performance metrics for a model
   */
  public getModelMetrics(modelId: string): ModelEvaluation | undefined {
    return this.performanceMetrics.get(modelId);
  }
  
  /**
   * Get all performance metrics
   */
  public getAllModelMetrics(): Map<string, ModelEvaluation> {
    return this.performanceMetrics;
  }
}

// Export a singleton instance
export const modelSelection = ModelSelectionService.getInstance();
