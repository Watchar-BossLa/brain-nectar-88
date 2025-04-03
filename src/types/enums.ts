
/**
 * Central location for all enum definitions used in the Study Bee application
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

export enum TaskType {
  COGNITIVE_PROFILING = "COGNITIVE_PROFILING",
  LEARNING_PATH_GENERATION = "LEARNING_PATH_GENERATION",
  CONTENT_ADAPTATION = "CONTENT_ADAPTATION",
  ASSESSMENT_GENERATION = "ASSESSMENT_GENERATION",
  FLASHCARD_OPTIMIZATION = "FLASHCARD_OPTIMIZATION",
  SCHEDULE_OPTIMIZATION = "SCHEDULE_OPTIMIZATION",
  UI_OPTIMIZATION = "UI_OPTIMIZATION"
}

export enum TaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export enum MessageType {
  SYSTEM = "SYSTEM",
  USER = "USER",
  AGENT = "AGENT",
  TASK = "TASK"
}

export enum ContentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  PDF = "PDF",
  INTERACTIVE = "INTERACTIVE"
}

export enum QualificationStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE"
}

export enum StudySessionStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED"
}

export enum FlashcardDifficulty {
  VERY_EASY = 1,
  EASY = 2,
  MEDIUM = 3,
  HARD = 4,
  VERY_HARD = 5
}

export enum LearningPathType {
  STANDARD = "STANDARD",
  ADAPTIVE = "ADAPTIVE",
  CUSTOM = "CUSTOM"
}

export enum ModuleType {
  CONCEPT = "CONCEPT",
  PRACTICE = "PRACTICE",
  ASSESSMENT = "ASSESSMENT"
}

export enum AssessmentType {
  QUIZ = "QUIZ",
  TEST = "TEST",
  EXAM = "EXAM",
  SELF_ASSESSMENT = "SELF_ASSESSMENT"
}

export enum CognitiveProfileAspect {
  LEARNING_STYLE = "LEARNING_STYLE",
  KNOWLEDGE_GAPS = "KNOWLEDGE_GAPS",
  STRENGTHS = "STRENGTHS",
  WEAKNESSES = "WEAKNESSES",
  PREFERENCES = "PREFERENCES"
}

export enum TaskCategory {
  TEXT_GENERATION = "TEXT_GENERATION",
  QUESTION_ANSWERING = "QUESTION_ANSWERING",
  SUMMARIZATION = "SUMMARIZATION",
  CLASSIFICATION = "CLASSIFICATION",
  CODE_GENERATION = "CODE_GENERATION",
  DATA_ANALYSIS = "DATA_ANALYSIS"
}

export enum ModelProvider {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  OLLAMA = "OLLAMA",
  GOOGLE = "GOOGLE",
  INTERNAL = "INTERNAL"
}

// Re-export all enums as a namespace for easier imports
export const Enums = {
  AgentType,
  TaskType,
  TaskPriority,
  MessageType,
  ContentType,
  QualificationStatus,
  StudySessionStatus,
  FlashcardDifficulty,
  LearningPathType,
  ModuleType,
  AssessmentType,
  CognitiveProfileAspect,
  TaskCategory,
  ModelProvider
}
