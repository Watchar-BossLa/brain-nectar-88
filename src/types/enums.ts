
/**
 * Centralized enumeration definitions for the application
 */

/**
 * Types of agents in the multi-agent system
 */
export enum AgentType {
  COGNITIVE_PROFILE = "COGNITIVE_PROFILE",
  LEARNING_PATH = "LEARNING_PATH",
  CONTENT_ADAPTATION = "CONTENT_ADAPTATION",
  ASSESSMENT = "ASSESSMENT",
  ENGAGEMENT = "ENGAGEMENT",
  FEEDBACK = "FEEDBACK",
  UI_UX = "UI_UX",
  SCHEDULING = "SCHEDULING"
}

/**
 * Types of tasks that can be performed by agents
 */
export enum TaskType {
  COGNITIVE_PROFILING = "COGNITIVE_PROFILING",
  LEARNING_PATH_GENERATION = "LEARNING_PATH_GENERATION",
  CONTENT_ADAPTATION = "CONTENT_ADAPTATION",
  ASSESSMENT_GENERATION = "ASSESSMENT_GENERATION",
  FLASHCARD_OPTIMIZATION = "FLASHCARD_OPTIMIZATION",
  SCHEDULE_OPTIMIZATION = "SCHEDULE_OPTIMIZATION",
  UI_OPTIMIZATION = "UI_OPTIMIZATION"
}

/**
 * Task priority levels
 */
export enum TaskPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

/**
 * Message types for agent communication
 */
export enum MessageType {
  SYSTEM = "SYSTEM",
  USER = "USER",
  AGENT = "AGENT",
  TASK = "TASK"
}

/**
 * Task categories for LLM task mapping
 */
export enum TaskCategory {
  CONTENT_UNDERSTANDING = "CONTENT_UNDERSTANDING",
  CONTENT_GENERATION = "CONTENT_GENERATION",
  PERSONALIZATION = "PERSONALIZATION",
  ASSESSMENT = "ASSESSMENT",
  OPTIMIZATION = "OPTIMIZATION"
}

/**
 * Task status indicators
 */
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED"
}
