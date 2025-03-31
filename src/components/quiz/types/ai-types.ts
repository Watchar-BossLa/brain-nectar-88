
/**
 * Types for AI-related components
 */

export enum TaskCategory {
  QUESTION_GENERATION = "QUESTION_GENERATION",
  ANSWER_EVALUATION = "ANSWER_EVALUATION",
  FEEDBACK_GENERATION = "FEEDBACK_GENERATION",
  EXPLANATION_GENERATION = "EXPLANATION_GENERATION",
  HINT_GENERATION = "HINT_GENERATION",
  TUTORING = "TUTORING"
}

export interface AITaskRequest {
  category: TaskCategory;
  payload: Record<string, any>;
  userId?: string;
  contextData?: Record<string, any>;
}

export interface AITaskResponse {
  result: any;
  metadata?: {
    processingTime?: number;
    modelUsed?: string;
    confidence?: number;
  };
  error?: string;
}

export interface AITutorMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: "image" | "video" | "document";
    url: string;
  }>;
}

export interface AITutorSession {
  id: string;
  userId: string;
  topic?: string;
  subject?: string;
  messages: AITutorMessage[];
  startTime: Date;
  endTime?: Date;
  active: boolean;
}
