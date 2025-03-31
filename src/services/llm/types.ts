
// Task categories for the LLM system
export enum TaskCategory {
  CONTENT_GENERATION = 'CONTENT_GENERATION',
  CONTENT_ANALYSIS = 'CONTENT_ANALYSIS',
  QUESTION_ANSWERING = 'QUESTION_ANSWERING',
  SUMMARIZATION = 'SUMMARIZATION',
  TUTORING = 'TUTORING',
  CLASSIFICATION = 'CLASSIFICATION',
  TRANSLATION = 'TRANSLATION',
  CHAT = 'CHAT',
  CODE_GENERATION = 'CODE_GENERATION',
  CUSTOM = 'CUSTOM',
  // Adding missing categories
  TEXT_GENERATION = 'TEXT_GENERATION',
  REASONING = 'REASONING',
  CONTENT_CREATION = 'CONTENT_CREATION'
}

// Task complexity levels
export enum TaskComplexity {
  LOW = 0.25,
  MEDIUM = 0.5,
  HIGH = 0.75,
  VERY_HIGH = 1.0
}

// Model execution result
export interface ModelExecutionResult {
  text: string;
  modelId: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  executionTime: number;
}

// Additional types needed by the system
export interface ModelExecutionInput {
  prompt: string;
  modelId?: string;
  parameters?: ModelParameters;
}

export interface ModelParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ModelProviderConfig {
  id: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  models: ModelType[];
}

export interface ModelType {
  id: string;
  name: string;
  provider: string;
  contextSize: number;
  capabilities: TaskCategory[];
}

export interface ModelEvaluation {
  modelId: string;
  accuracy: number;
  latency: number;
  costEfficiency: number;
  resourceEfficiency: number;
}

export interface ExecutionMetrics {
  modelId: string;
  taskCategory: TaskCategory;
  executionTime: number;
  tokenCount: number;
  success: boolean;
}
