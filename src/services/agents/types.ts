
export type AgentType = 
  | 'COGNITIVE_PROFILE' 
  | 'LEARNING_PATH' 
  | 'CONTENT_ADAPTATION' 
  | 'ASSESSMENT' 
  | 'ENGAGEMENT' 
  | 'FEEDBACK' 
  | 'UI_UX' 
  | 'SCHEDULING';

export type TaskType = 
  | 'COGNITIVE_PROFILING' 
  | 'LEARNING_PATH_GENERATION' 
  | 'LEARNING_PATH_UPDATE' 
  | 'CONTENT_ADAPTATION' 
  | 'ASSESSMENT_GENERATION' 
  | 'ENGAGEMENT_OPTIMIZATION' 
  | 'FEEDBACK_GENERATION' 
  | 'SCHEDULE_OPTIMIZATION'
  | 'FLASHCARD_OPTIMIZATION'
  | 'FLASHCARD_SEQUENCE_OPTIMIZATION'
  | 'UI_OPTIMIZATION'
  | 'MULTI_AGENT_COORDINATION';

export type MessageType = 
  | 'NOTIFICATION' 
  | 'REQUEST' 
  | 'RESPONSE' 
  | 'UPDATE' 
  | 'SYSTEM'
  | 'TASK';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType;
  description: string;
  priority: TaskPriority;
  targetAgentTypes: AgentType[];
  context: string[];
  data: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  status?: TaskStatus;
  result?: Record<string, any>;
}

export interface AgentMessage {
  type: MessageType;
  content: string;
  senderId?: AgentType;
  targetId?: AgentType;
  data?: Record<string, any>;
  timestamp: string;
}

export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  preferredContentFormats: string[];
  knowledgeGraph: Record<string, any>;
  attentionSpan: number;
  retentionRates: Record<string, number>;
  lastUpdated: string;
}

export interface SystemState {
  activeAgents: AgentType[];
  taskQueue?: number;
  completedTasks?: number;
  failedTasks?: number;
  uptime?: number;
  globalVariables: Record<string, any>;
  lastUpdated?: string;
  metrics?: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
  };
  priorityMatrix?: Record<string, number>;
}
