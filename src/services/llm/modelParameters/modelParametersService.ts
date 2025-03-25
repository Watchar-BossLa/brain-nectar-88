
import { ModelParameters, TaskCategory } from '../types';
import { modelRegistry } from '../modelRegistry/modelRegistryService';

/**
 * Model Parameters Service
 * 
 * Handles the optimization of model parameters for specific tasks.
 */
export class ModelParametersService {
  private static instance: ModelParametersService;
  private modelCache: Map<string, any> = new Map();
  
  private constructor() {
    console.log('Model Parameters Service initialized');
  }
  
  /**
   * Get singleton instance of the ModelParametersService
   */
  public static getInstance(): ModelParametersService {
    if (!ModelParametersService.instance) {
      ModelParametersService.instance = new ModelParametersService();
    }
    return ModelParametersService.instance;
  }
  
  /**
   * Get model parameters optimized for a specific task
   */
  public getOptimizedParameters(
    modelId: string, 
    taskCategory: TaskCategory
  ): ModelParameters {
    const model = modelRegistry.getModel(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }
    
    // Start with default parameters
    const params = { ...model.defaultParameters };
    
    // Task-specific parameter adjustments
    switch (taskCategory) {
      case TaskCategory.CLASSIFICATION:
        // Lower temperature for more deterministic outputs
        params.temperature = 0.3;
        break;
        
      case TaskCategory.SUMMARIZATION:
        // Adjust for summarization tasks
        params.temperature = 0.5;
        params.maxTokens = Math.min(params.maxTokens, 512); // Shorter responses
        break;
        
      case TaskCategory.CODE_GENERATION:
        // More precise for code generation
        params.temperature = 0.2;
        params.topP = 0.95;
        break;
        
      case TaskCategory.REASONING:
        // More exploratory for reasoning
        params.temperature = 0.8;
        params.topP = 0.9;
        break;
        
      // Default parameters for other categories
    }
    
    return params;
  }
  
  /**
   * Pre-load a model into cache based on anticipated usage
   */
  public preloadModel(modelId: string): void {
    // In a real implementation, this would initialize the model
    console.log(`Preloading model: ${modelId}`);
    
    // Placeholder for model preloading
    this.modelCache.set(modelId, { preloaded: true, timestamp: Date.now() });
  }
  
  /**
   * Check if a model is preloaded
   */
  public isModelPreloaded(modelId: string): boolean {
    return this.modelCache.has(modelId);
  }
  
  /**
   * Get all preloaded models
   */
  public getPreloadedModels(): string[] {
    return Array.from(this.modelCache.keys());
  }
}

// Export a singleton instance
export const modelParameters = ModelParametersService.getInstance();
