
import { ModelParameters, ModelType, TaskCategory, ModelEvaluation } from './types';
import { modelRegistry } from './modelRegistry/modelRegistryService';
import { modelSelection } from './modelSelection/modelSelectionService';
import { modelParameters } from './modelParameters/modelParametersService';

/**
 * LLM Orchestration Service
 * 
 * Dynamically selects and deploys the optimal open-source large language model
 * for each task based on requirements, performance metrics, and resource constraints.
 * 
 * This acts as a facade for the smaller, focused services.
 */
export class ModelOrchestrationService {
  private static instance: ModelOrchestrationService;
  
  private constructor() {
    console.log('Model Orchestration Service initialized');
  }
  
  /**
   * Get singleton instance of the ModelOrchestrationService
   */
  public static getInstance(): ModelOrchestrationService {
    if (!ModelOrchestrationService.instance) {
      ModelOrchestrationService.instance = new ModelOrchestrationService();
    }
    return ModelOrchestrationService.instance;
  }
  
  /**
   * Get a model by ID
   */
  public getModel(modelId: string): ModelType | undefined {
    return modelRegistry.getModel(modelId);
  }
  
  /**
   * Get all registered models
   */
  public getAllModels(): ModelType[] {
    return modelRegistry.getAllModels();
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
    return modelSelection.selectModelForTask(
      taskCategory,
      taskComplexity,
      domainContext,
      resourceConstraints
    );
  }
  
  /**
   * Update performance metrics for a model
   */
  public updateModelMetrics(modelId: string, evaluation: Partial<ModelEvaluation>): void {
    modelSelection.updateModelMetrics(modelId, evaluation);
  }
  
  /**
   * Pre-load a model into cache based on anticipated usage
   */
  public preloadModel(modelId: string): void {
    modelParameters.preloadModel(modelId);
  }
  
  /**
   * Get model parameters optimized for a specific task
   */
  public getOptimizedParameters(
    modelId: string, 
    taskCategory: TaskCategory
  ): ModelParameters {
    return modelParameters.getOptimizedParameters(modelId, taskCategory);
  }
  
  /**
   * Register a new model in the registry
   */
  public registerModel(model: ModelType): void {
    modelRegistry.registerModel(model);
  }
}

// Export a singleton instance
export const modelOrchestration = ModelOrchestrationService.getInstance();
