
/**
 * Types for the multi-agent system
 */

// Supported agent types in the system
export type AgentType = 
  | 'COGNITIVE_PROFILE'
  | 'LEARNING_PATH'
  | 'CONTENT_ADAPTATION'
  | 'ASSESSMENT'
  | 'ENGAGEMENT'
  | 'FEEDBACK'
  | 'UI_UX'
  | 'SCHEDULING';

// Task types that agents can process
export type TaskType = 
  | 'COGNITIVE_PROFILING'
  | 'LEARNING_PATH_GENERATION'
  | 'CONTENT_ADAPTATION'
  | 'ASSESSMENT_GENERATION'
  | 'ENGAGEMENT_OPTIMIZATION'
  | 'FEEDBACK_GENERATION'
  | 'UI_OPTIMIZATION'
  | 'SCHEDULE_OPTIMIZATION'
  | 'MULTI_AGENT_COORDINATION';

// Priority levels for tasks
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Status of a task
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// Message types for inter-agent communication
export type MessageType = 'TASK' | 'RESPONSE' | 'NOTIFICATION' | 'SYSTEM';

/**
 * A task that can be assigned to one or more agents
 */
export interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType;
  description: string;
  priority: TaskPriority;
  targetAgentTypes?: AgentType[];
  context: string[];
  data: Record<string, any>;
  createdAt: string;
  status?: TaskStatus;
  completedAt?: string;
  result?: any;
}

/**
 * A message that can be sent between agents
 */
export interface AgentMessage {
  type: MessageType;
  content: string;
  data: Record<string, any>;
  timestamp: string;
  senderId?: AgentType;
  targetId?: AgentType;
}

/**
 * System state maintained by the MCP
 */
export interface SystemState {
  activeAgents: AgentType[];
  metrics: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
    [key: string]: number;
  };
  priorityMatrix: Record<string, number>;
  globalVariables: Record<string, any>;
}

/**
 * Cognitive profile of a user
 */
export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  preferredContentFormats: string[];
  knowledgeGraph: Record<string, string[]>;
  attentionSpan: number;
  retentionRates: Record<string, number>;
  lastUpdated: string;
}

/**
 * Agent capability description
 */
export interface AgentCapability {
  name: string;
  description: string;
  requiredData: string[];
  outputFormat: string;
}
