/**
 * Import TaskCategory from central location
 */
import { TaskCategory } from '../../types/enums';

/**
 * Export TaskCategory for backward compatibility
 */
export { TaskCategory };

/**
 * Model capability information
 */
export interface ModelCapability {
  taskCategory: TaskCategory;
  performanceScore: number; // 0-1 score indicating performance on this task
}

/**
 * Resource requirements for a model
 */
export interface ResourceRequirements {
  memory: number; // Memory needed in GB
  computeUnits: number; // Abstract compute units needed
}

/**
 * Parameters for model execution
 */
export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  [key: string]: any; // Allow for model-specific parameters
}

/**
 * Model type information
 */
export interface ModelType {
  id: string;
  name: string;
  provider: string;
  capabilities: TaskCategory[];
  resourceRequirements: ResourceRequirements;
  defaultParameters: ModelParameters;
  quantizationLevel?: string;
  contextLength?: number;
}

/**
 * Model evaluation metrics
 */
export interface ModelEvaluation {
  accuracy: number;
  latency: number;
  f1Score: number;
  resourceEfficiency: number;
  userSatisfaction: number;
  evaluatedAt?: string;
}

/**
 * Input for model execution
 */
export interface ModelExecutionInput {
  modelId: string;
  prompt: string;
  taskCategory: TaskCategory;
  parameters?: Partial<ModelParameters>;
  systemPrompt?: string;
}

/**
 * Result of model execution
 */
export interface ModelExecutionResult {
  text: string;
  modelId: string;
  executionTime: number;
  tokenCount: {
    input: number;
    output: number;
  };
  truncated: boolean;
}

/**
 * Model provider configuration
 */
export interface ModelProviderConfig {
  name: string;
  apiEndpoint: string;
  authType: 'apiKey' | 'oauth' | 'none';
  apiKey?: string;
  modelsAvailable: string[];
}

/**
 * Model selection criteria
 */
export interface ModelSelectionCriteria {
  taskCategory: TaskCategory;
  complexity?: number; // 0-1 scale where 1 is most complex
  domainContext?: string[];
  maxLatency?: number;
  minAccuracy?: number;
  resourceConstraints?: {
    maxMemory?: number;
    maxComputeUnits?: number;
  };
}

/**
 * Model execution metrics
 */
export interface ExecutionMetrics {
  modelId: string;
  taskId: string;
  startTime: number;
  endTime: number;
  inputTokens: number;
  outputTokens: number;
  success: boolean;
  errorMessage?: string;
}
