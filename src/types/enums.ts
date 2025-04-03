
/**
 * Central location for all enum types used across the application
 */

// Task categories for LLM and agent system
export enum TaskCategory {
  TEXT_GENERATION = 'TEXT_GENERATION',
  QUESTION_ANSWERING = 'QUESTION_ANSWERING',
  REASONING = 'REASONING',
  CONTENT_CREATION = 'CONTENT_CREATION',
  CODING = 'CODING',
  MATHEMATICS = 'MATHEMATICS',
  ACCOUNTING = 'ACCOUNTING',
  FINANCE = 'FINANCE',
  DATA_ANALYSIS = 'DATA_ANALYSIS',
  CLASSIFICATION = 'CLASSIFICATION',
  SUMMARIZATION = 'SUMMARIZATION',
  CODE_GENERATION = 'CODE_GENERATION'
}

// Agent types for the multi-agent system
export enum AgentType {
  COGNITIVE_PROFILE = 'COGNITIVE_PROFILE',
  LEARNING_PATH = 'LEARNING_PATH',
  CONTENT_ADAPTATION = 'CONTENT_ADAPTATION',
  ASSESSMENT = 'ASSESSMENT',
  ENGAGEMENT = 'ENGAGEMENT',
  FEEDBACK = 'FEEDBACK',
  UI_UX = 'UI_UX',
  SCHEDULING = 'SCHEDULING'
}

// Task types for the agent system
export enum TaskType {
  COGNITIVE_PROFILING = 'COGNITIVE_PROFILING',
  LEARNING_PATH_GENERATION = 'LEARNING_PATH_GENERATION',
  CONTENT_ADAPTATION = 'CONTENT_ADAPTATION',
  ASSESSMENT_GENERATION = 'ASSESSMENT_GENERATION',
  ENGAGEMENT_OPTIMIZATION = 'ENGAGEMENT_OPTIMIZATION',
  FEEDBACK_GENERATION = 'FEEDBACK_GENERATION',
  UI_OPTIMIZATION = 'UI_OPTIMIZATION',
  SCHEDULE_OPTIMIZATION = 'SCHEDULE_OPTIMIZATION',
  FLASHCARD_OPTIMIZATION = 'FLASHCARD_OPTIMIZATION',
  MULTI_AGENT_COORDINATION = 'MULTI_AGENT_COORDINATION'
}

// Message types for agent communication
export enum MessageType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  AGENT = 'AGENT',
  TASK = 'TASK',
  RESULT = 'RESULT',
  NOTIFICATION = 'NOTIFICATION'
}

// Task priority levels
export enum TaskPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// Task status
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Flashcard types
export enum FlashcardType {
  TEXT = 'TEXT',
  FORMULA = 'FORMULA',
  FINANCIAL = 'FINANCIAL',
  IMAGE = 'IMAGE',
  CODE = 'CODE'
}

// Learning resource types
export enum ResourceType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  EXERCISE = 'EXERCISE',
  BOOK = 'BOOK',
  FLASHCARD_DECK = 'FLASHCARD_DECK',
  QUIZ = 'QUIZ'
}
