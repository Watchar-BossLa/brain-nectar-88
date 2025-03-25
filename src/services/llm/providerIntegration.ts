
import { ModelProviderConfig, ModelType } from './types';
import { modelOrchestration } from './modelOrchestration';

/**
 * Provider Integration Service
 * 
 * Manages connections to different model providers and ensures
 * new models are properly integrated into the system.
 */
export class ProviderIntegrationService {
  private static instance: ProviderIntegrationService;
  private providers: Map<string, ModelProviderConfig> = new Map();
  
  private constructor() {
    this.initializeProviders();
    console.log('Provider Integration Service initialized');
  }
  
  /**
   * Get singleton instance of the ProviderIntegrationService
   */
  public static getInstance(): ProviderIntegrationService {
    if (!ProviderIntegrationService.instance) {
      ProviderIntegrationService.instance = new ProviderIntegrationService();
    }
    return ProviderIntegrationService.instance;
  }
  
  /**
   * Initialize default providers
   */
  private initializeProviders(): void {
    // Register Hugging Face
    this.registerProvider({
      name: 'huggingface',
      apiEndpoint: 'https://api-inference.huggingface.co/models',
      authType: 'apiKey',
      modelsAvailable: [
        'meta-llama/Meta-Llama-3-8B',
        'meta-llama/Meta-Llama-3-70B',
        'mistralai/Mistral-7B-v0.1',
        'mistralai/Mixtral-8x7B-v0.1'
      ]
    });
    
    // Register Ollama (local inference)
    this.registerProvider({
      name: 'ollama',
      apiEndpoint: 'http://localhost:11434/api',
      authType: 'none',
      modelsAvailable: [
        'llama3:8b',
        'llama3:70b',
        'mistral:7b',
        'mixtral:8x7b'
      ]
    });
  }
  
  /**
   * Register a new provider
   */
  public registerProvider(config: ModelProviderConfig): void {
    this.providers.set(config.name, config);
    console.log(`Registered provider: ${config.name}`);
  }
  
  /**
   * Get a provider by name
   */
  public getProvider(name: string): ModelProviderConfig | undefined {
    return this.providers.get(name);
  }
  
  /**
   * Get all registered providers
   */
  public getAllProviders(): ModelProviderConfig[] {
    return Array.from(this.providers.values());
  }
  
  /**
   * Discover available models from a provider
   */
  public async discoverModels(providerName: string): Promise<string[]> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }
    
    console.log(`Discovering models from provider: ${providerName}`);
    
    // In a real implementation, this would query the provider's API
    // For now, we'll return the preconfigured list
    return provider.modelsAvailable;
  }
  
  /**
   * Import a new model from a provider
   */
  public async importModel(providerName: string, modelIdentifier: string): Promise<boolean> {
    console.log(`Importing model ${modelIdentifier} from provider ${providerName}`);
    
    try {
      // In a real implementation, this would validate and configure the model
      // For now, we'll simulate importing a new model
      
      // Generate a unique ID for the imported model
      const modelId = `${providerName}-${modelIdentifier.replace(/\//g, '-')}`;
      
      // Check if model already exists
      if (modelOrchestration.getModel(modelId)) {
        console.log(`Model ${modelId} already exists`);
        return false;
      }
      
      // Create a mock model configuration
      // In a real implementation, this would be derived from provider metadata
      const modelConfig: ModelType = {
        id: modelId,
        name: modelIdentifier.split('/').pop() || modelIdentifier,
        provider: providerName,
        capabilities: [], // These would be determined during import
        resourceRequirements: {
          memory: 4, // Default values
          computeUnits: 2
        },
        defaultParameters: {
          temperature: 0.7,
          maxTokens: 1024,
          topP: 0.9
        }
      };
      
      // Register the imported model
      modelOrchestration.registerModel(modelConfig);
      
      console.log(`Successfully imported model: ${modelId}`);
      return true;
    } catch (error) {
      console.error(`Error importing model ${modelIdentifier}:`, error);
      return false;
    }
  }
  
  /**
   * Configure API credentials for a provider
   */
  public configureProviderCredentials(providerName: string, apiKey: string): void {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }
    
    this.providers.set(providerName, {
      ...provider,
      apiKey
    });
    
    console.log(`Updated credentials for provider: ${providerName}`);
  }
}

// Export a singleton instance
export const providerIntegration = ProviderIntegrationService.getInstance();
