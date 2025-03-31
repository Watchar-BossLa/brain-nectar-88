
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
  CUSTOM = 'CUSTOM'
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
