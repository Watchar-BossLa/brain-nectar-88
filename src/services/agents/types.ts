
// Agent System Types

export type AgentType =
  | "cognitive_profile"
  | "learning_path"
  | "content_adaptation"
  | "assessment"
  | "engagement"
  | "feedback"
  | "ui_ux"
  | "scheduling";

export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

export type TaskPriority = "high" | "medium" | "low";

export interface AgentTask {
  taskId: string;
  userId: string;
  taskType: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  completedAt?: Date;
  targetAgentTypes: AgentType[];
  context?: TaskContext;
  result?: any;
}

export interface Task {
  id: string;
  type: string;
  priority: string;
  status: string;
  data: any;
}

export interface AgentMessage {
  messageId: string;
  senderId: AgentType;
  recipientId: AgentType | "MCP";
  timestamp: Date;
  content: any;
  correlationId?: string;
}

export interface CommunicationManager {
  sendMessage: (message: AgentMessage) => Promise<boolean>;
  registerMessageHandler: (
    agentType: AgentType,
    handler: (message: AgentMessage) => Promise<void>
  ) => void;
}

export interface TaskContext {
  learningProfile?: any;
  learningPath?: any;
  assessment?: any;
  contentAdaptation?: any;
  userFeedback?: any;
  engagement?: any;
  ui?: any;
  scheduling?: any;
  [key: string]: any;
}

export interface SystemMetrics {
  completedTasks: number;
  averageResponseTime: number;
  successRate: number;
  taskCompletionRate: number;
}

export interface CognitiveProfile {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  adaptationLevel: number;
  retentionFactors: Record<string, number>;
  studyPreferences: {
    timeOfDay: string[];
    sessionDuration: number;
    frequencyPreference: string;
  };
}
