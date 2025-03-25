
import { ModelType, TaskCategory } from '../types';

/**
 * Model Registry Service
 * 
 * Handles the registration and retrieval of LLM models.
 */
export class ModelRegistryService {
  private static instance: ModelRegistryService;
  private modelRegistry: Map<string, ModelType> = new Map();
  
  private constructor() {
    this.initializeModelRegistry();
    console.log('Model Registry Service initialized');
  }
  
  /**
   * Get singleton instance of the ModelRegistryService
   */
  public static getInstance(): ModelRegistryService {
    if (!ModelRegistryService.instance) {
      ModelRegistryService.instance = new ModelRegistryService();
    }
    return ModelRegistryService.instance;
  }
  
  /**
   * Initialize the model registry with available models
   */
  private initializeModelRegistry(): void {
    // Register Llama models
    this.registerModel({
      id: 'llama3-8b',
      name: 'Llama 3 8B',
      provider: 'Meta',
      capabilities: [
        TaskCategory.TEXT_GENERATION,
        TaskCategory.QUESTION_ANSWERING,
        TaskCategory.CLASSIFICATION
      ],
      resourceRequirements: {
        memory: 4, // GB
        computeUnits: 2
      },
      defaultParameters: {
        temperature: 0.7,
        maxTokens: 1024,
        topP: 0.9
      }
    });
    
    this.registerModel({
      id: 'llama3-70b',
      name: 'Llama 3 70B',
      provider: 'Meta',
      capabilities: [
        TaskCategory.TEXT_GENERATION,
        TaskCategory.QUESTION_ANSWERING,
        TaskCategory.CLASSIFICATION,
        TaskCategory.REASONING,
        TaskCategory.CODE_GENERATION
      ],
      resourceRequirements: {
        memory: 35, // GB
        computeUnits: 8
      },
      defaultParameters: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9
      }
    });
    
    // Register Mistral models
    this.registerModel({
      id: 'mistral-7b',
      name: 'Mistral 7B',
      provider: 'Mistral AI',
      capabilities: [
        TaskCategory.TEXT_GENERATION,
        TaskCategory.CLASSIFICATION,
        TaskCategory.SUMMARIZATION
      ],
      resourceRequirements: {
        memory: 4, // GB
        computeUnits: 2
      },
      defaultParameters: {
        temperature: 0.7,
        maxTokens: 1024,
        topP: 0.9
      }
    });
    
    // Register Mixtral models
    this.registerModel({
      id: 'mixtral-8x7b',
      name: 'Mixtral 8x7B',
      provider: 'Mistral AI',
      capabilities: [
        TaskCategory.TEXT_GENERATION,
        TaskCategory.QUESTION_ANSWERING,
        TaskCategory.CLASSIFICATION,
        TaskCategory.REASONING,
        TaskCategory.SUMMARIZATION
      ],
      resourceRequirements: {
        memory: 24, // GB
        computeUnits: 6
      },
      defaultParameters: {
        temperature: 0.8,
        maxTokens: 1536,
        topP: 0.9
      }
    });
  }
  
  /**
   * Register a new model in the registry
   */
  public registerModel(model: ModelType): void {
    this.modelRegistry.set(model.id, model);
    console.log(`Registered model: ${model.name} (${model.id})`);
  }
  
  /**
   * Get a model by ID
   */
  public getModel(modelId: string): ModelType | undefined {
    return this.modelRegistry.get(modelId);
  }
  
  /**
   * Get all registered models
   */
  public getAllModels(): ModelType[] {
    return Array.from(this.modelRegistry.values());
  }
}

// Export a singleton instance
export const modelRegistry = ModelRegistryService.getInstance();
